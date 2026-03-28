-- Migration: Sync visibility_tier automatically when subscription_tier changes
-- Fixes CRITICAL BUG: referral-upgraded moana businesses not appearing on homepage
-- 
-- This trigger ensures visibility_tier = 'homepage' whenever subscription_tier = 'moana'
-- and visibility_tier = 'none' when subscription_tier downgrades from moana.
-- Respects visibility_mode = 'manual' for admin overrides.

-- ============================================================
-- 1. Create the trigger function for visibility sync
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_visibility_on_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only act when subscription_tier actually changes
    IF OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier THEN

        -- Skip if admin has set visibility_mode to 'manual'
        IF NEW.visibility_mode = 'manual' THEN
            RETURN NEW;
        END IF;

        -- Upgrade to homepage when becoming moana
        IF NEW.subscription_tier = 'moana' THEN
            NEW.visibility_tier := 'homepage';
            RAISE LOG 'Auto-set visibility_tier=homepage for business % (subscription_tier changed to moana)', NEW.id;
        END IF;

        -- Downgrade from homepage when leaving moana (only if currently homepage and auto mode)
        IF OLD.subscription_tier = 'moana' AND NEW.subscription_tier != 'moana' 
           AND NEW.visibility_tier = 'homepage' THEN
            NEW.visibility_tier := 'none';
            RAISE LOG 'Auto-reset visibility_tier=none for business % (subscription_tier changed from moana to %)', NEW.id, NEW.subscription_tier;
        END IF;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. Create the trigger (BEFORE UPDATE so we can modify NEW)
-- ============================================================
DROP TRIGGER IF EXISTS on_business_subscription_sync_visibility ON public.businesses;
CREATE TRIGGER on_business_subscription_sync_visibility
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_visibility_on_subscription_change();

-- ============================================================
-- 3. Update apply_referral_reward_for_business to also set visibility_tier
--    (belt-and-suspenders: trigger will also handle it, but explicit is safer)
-- ============================================================
CREATE OR REPLACE FUNCTION public.apply_referral_reward_for_business(p_referred_business_id UUID)
RETURNS JSON AS $$
DECLARE
    v_referred_business RECORD;
    v_referrer_business RECORD;
    v_existing_reward RECORD;
    v_referrer_expiry_date TIMESTAMPTZ;
    v_referred_expiry_date TIMESTAMPTZ;
    v_reward_record_id UUID;
    v_result JSON;
BEGIN
    -- Load the referred business
    SELECT * INTO v_referred_business 
    FROM public.businesses 
    WHERE id = p_referred_business_id;
    
    -- Fail if business not found
    IF NOT FOUND THEN
        v_result := json_build_object(
            'success', false, 
            'error', 'Referred business not found',
            'action', 'none'
        );
        RETURN v_result;
    END IF;
    
    -- Check eligibility using our helper function
    IF NOT public.is_business_referral_reward_eligible(p_referred_business_id) THEN
        v_result := json_build_object(
            'success', false, 
            'error', 'Business not eligible for referral reward',
            'reason', public.get_business_referral_reward_eligibility_reason(p_referred_business_id),
            'action', 'none'
        );
        RETURN v_result;
    END IF;
    
    -- Check for existing reward record (any status)
    SELECT * INTO v_existing_reward
    FROM public.business_referral_rewards 
    WHERE referred_business_id = p_referred_business_id
    LIMIT 1;
    
    -- If reward already applied, return success (idempotent)
    IF v_existing_reward.status = 'applied' THEN
        v_result := json_build_object(
            'success', true, 
            'message', 'Referral reward already applied',
            'action', 'already_applied',
            'reward_id', v_existing_reward.id,
            'applied_at', v_existing_reward.applied_at
        );
        RETURN v_result;
    END IF;
    
    -- Load referrer business
    SELECT * INTO v_referrer_business 
    FROM public.businesses 
    WHERE id = v_referred_business.referred_by_business_id;
    
    -- Calculate new expiry dates for both businesses (additive logic)
    -- For referrer business:
    IF v_referrer_business.tier_expires_at IS NOT NULL 
       AND v_referrer_business.tier_expires_at > now() 
       AND v_referrer_business.subscription_tier = 'moana' THEN
        v_referrer_expiry_date := v_referrer_business.tier_expires_at + interval '31 days';
    ELSE
        v_referrer_expiry_date := now() + interval '31 days';
    END IF;
    
    -- For referred business:
    IF v_referred_business.tier_expires_at IS NOT NULL 
       AND v_referred_business.tier_expires_at > now() 
       AND v_referred_business.subscription_tier = 'moana' THEN
        v_referred_expiry_date := v_referred_business.tier_expires_at + interval '31 days';
    ELSE
        v_referred_expiry_date := now() + interval '31 days';
    END IF;
    
    -- Start transaction
    BEGIN
        -- Update or create reward record
        IF v_existing_reward IS NOT NULL THEN
            -- Update existing pending/skipped/failed record
            UPDATE public.business_referral_rewards 
            SET 
                status = 'applied',
                eligibility_reason = 'Referred business became active',
                applied_at = now(),
                updated_at = now()
            WHERE id = v_existing_reward.id;
            
            v_reward_record_id := v_existing_reward.id;
        ELSE
            -- Create new reward record
            INSERT INTO public.business_referral_rewards (
                referrer_business_id,
                referred_business_id,
                reward_type,
                reward_days,
                status,
                eligibility_reason,
                applied_at,
                applied_by
            ) VALUES (
                v_referrer_business.id,
                v_referred_business.id,
                'moana_extension',
                31,
                'applied',
                'Referred business became active',
                now(),
                'system'
            ) RETURNING id INTO v_reward_record_id;
        END IF;
        
        -- Update referrer business with extended Moana access + homepage visibility
        UPDATE public.businesses 
        SET 
            subscription_tier = 'moana',
            visibility_tier = CASE WHEN visibility_mode = 'manual' THEN visibility_tier ELSE 'homepage' END,
            tier_expires_at = v_referrer_expiry_date,
            referral_count = referral_count + 1,
            updated_at = now()
        WHERE id = v_referrer_business.id;
        
        -- Update referred business with extended Moana access + homepage visibility
        UPDATE public.businesses 
        SET 
            subscription_tier = 'moana',
            visibility_tier = CASE WHEN visibility_mode = 'manual' THEN visibility_tier ELSE 'homepage' END,
            tier_expires_at = v_referred_expiry_date,
            referral_reward_applied = true,
            referral_reward_applied_at = now(),
            updated_at = now()
        WHERE id = p_referred_business_id;
        
    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback and return error
            v_result := json_build_object(
                'success', false, 
                'error', 'Failed to apply referral reward: ' || SQLERRM,
                'detail', SQLSTATE,
                'action', 'rollback'
            );
            RETURN v_result;
    END;
    
    -- Return success result
    v_result := json_build_object(
        'success', true,
        'message', 'Referral rewards applied successfully to both businesses',
        'action', 'applied',
        'reward_id', v_reward_record_id,
        'referrer_business_id', v_referrer_business.id,
        'referrer_business_name', v_referrer_business.business_name,
        'referred_business_id', v_referred_business.id,
        'referred_business_name', v_referred_business.business_name,
        'reward_days', 31,
        'referrer_expiry_date', v_referrer_expiry_date,
        'referred_expiry_date', v_referred_expiry_date,
        'applied_at', now()
    );
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        v_result := json_build_object(
            'success', false, 
            'error', 'Unexpected error in referral reward application: ' || SQLERRM,
            'detail', SQLSTATE,
            'action', 'error'
        );
        RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. Update apply_referral_moana_reward for consistency
-- ============================================================
CREATE OR REPLACE FUNCTION public.apply_referral_moana_reward(p_new_business_id UUID)
RETURNS JSON AS $$
DECLARE
    v_new_business RECORD;
    v_referrer_business RECORD;
    v_new_expiry_date TIMESTAMPTZ;
    v_referrer_expiry_date TIMESTAMPTZ;
    v_result JSON;
BEGIN
    -- Load the new business with status check
    SELECT * INTO v_new_business 
    FROM public.businesses 
    WHERE id = p_new_business_id;
    
    -- Fail if new business not found
    IF NOT FOUND THEN
        v_result := json_build_object('success', false, 'error', 'New business not found');
        RETURN v_result;
    END IF;
    
    -- Fail if business is not active (must be active to receive rewards)
    IF v_new_business.status != 'active' THEN
        v_result := json_build_object('success', false, 'error', 'Business must be active before referral rewards can be applied');
        RETURN v_result;
    END IF;
    
    -- Fail if no referral
    IF v_new_business.referred_by_business_id IS NULL THEN
        v_result := json_build_object('success', false, 'error', 'No referral found for this business');
        RETURN v_result;
    END IF;
    
    -- Fail if reward already applied
    IF v_new_business.referral_reward_applied = true THEN
        v_result := json_build_object('success', false, 'error', 'Referral reward already applied');
        RETURN v_result;
    END IF;
    
    -- Fail if self-referral
    IF v_new_business.referred_by_business_id = p_new_business_id THEN
        v_result := json_build_object('success', false, 'error', 'Self-referral not allowed');
        RETURN v_result;
    END IF;
    
    -- Load referrer business with status check
    SELECT * INTO v_referrer_business 
    FROM public.businesses 
    WHERE id = v_new_business.referred_by_business_id;
    
    -- Fail if referrer not found
    IF NOT FOUND THEN
        v_result := json_build_object('success', false, 'error', 'Referrer business not found');
        RETURN v_result;
    END IF;
    
    -- Fail if referrer is not active
    IF v_referrer_business.status != 'active' THEN
        v_result := json_build_object('success', false, 'error', 'Referrer business must be active to receive rewards');
        RETURN v_result;
    END IF;
    
    -- Calculate expiry dates (additive logic)
    IF v_new_business.tier_expires_at IS NOT NULL AND v_new_business.tier_expires_at > now() THEN
        v_new_expiry_date := v_new_business.tier_expires_at + interval '1 month';
    ELSE
        v_new_expiry_date := now() + interval '1 month';
    END IF;
    
    IF v_referrer_business.tier_expires_at IS NOT NULL AND v_referrer_business.tier_expires_at > now() THEN
        v_referrer_expiry_date := v_referrer_business.tier_expires_at + interval '1 month';
    ELSE
        v_referrer_expiry_date := now() + interval '1 month';
    END IF;
    
    -- Update new business with Moana tier + homepage visibility
    UPDATE public.businesses 
    SET 
        subscription_tier = 'moana',
        visibility_tier = CASE WHEN visibility_mode = 'manual' THEN visibility_tier ELSE 'homepage' END,
        tier_expires_at = v_new_expiry_date,
        referral_reward_applied = true,
        referral_reward_applied_at = now(),
        updated_at = now()
    WHERE id = p_new_business_id;
    
    -- Update referrer business with Moana tier + homepage visibility and increment referral count
    UPDATE public.businesses 
    SET 
        subscription_tier = 'moana',
        visibility_tier = CASE WHEN visibility_mode = 'manual' THEN visibility_tier ELSE 'homepage' END,
        tier_expires_at = v_referrer_expiry_date,
        referral_count = referral_count + 1,
        updated_at = now()
    WHERE id = v_new_business.referred_by_business_id;
    
    -- Return success result with detailed information
    v_result := json_build_object(
        'success', true,
        'message', 'Referral reward applied successfully',
        'new_business_expiry', v_new_expiry_date,
        'referrer_business_expiry', v_referrer_expiry_date,
        'new_business_name', v_new_business.business_name,
        'referrer_business_name', v_referrer_business.business_name
    );
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        v_result := json_build_object(
            'success', false, 
            'error', SQLERRM,
            'detail', SQLSTATE
        );
        RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. Backfill: Fix any existing moana businesses missing homepage visibility
-- ============================================================
UPDATE public.businesses
SET visibility_tier = 'homepage',
    updated_at = now()
WHERE subscription_tier = 'moana'
  AND status = 'active'
  AND visibility_tier != 'homepage'
  AND visibility_mode != 'manual';

-- ============================================================
-- 6. Verify the fix
-- ============================================================
-- This SELECT shows all moana businesses and their visibility status
-- After this migration, all auto-mode moana businesses should have visibility_tier = 'homepage'
SELECT 
    id,
    business_name,
    subscription_tier,
    visibility_tier,
    visibility_mode,
    status,
    referral_reward_applied,
    referred_by_business_id IS NOT NULL as has_referrer
FROM public.businesses
WHERE subscription_tier = 'moana'
ORDER BY business_name;
