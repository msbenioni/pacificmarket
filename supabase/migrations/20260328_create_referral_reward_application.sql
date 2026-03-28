-- Create automated referral reward application system
-- Created: 2026-03-28
-- Purpose: Apply referral rewards to both referrer and referred businesses when referred business becomes active

-- Main function to apply referral reward for a business
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
        
        -- Update referrer business with extended Moana access
        UPDATE public.businesses 
        SET 
            subscription_tier = 'moana',
            tier_expires_at = v_referrer_expiry_date,
            referral_count = referral_count + 1,
            updated_at = now()
        WHERE id = v_referrer_business.id;
        
        -- Update referred business with extended Moana access
        UPDATE public.businesses 
        SET 
            subscription_tier = 'moana',
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

-- Helper function to create pending reward records when businesses are created with referrals
CREATE OR REPLACE FUNCTION public.create_pending_referral_reward(p_referred_business_id UUID)
RETURNS VOID AS $$
DECLARE
    v_referred_business RECORD;
BEGIN
    -- Load the business
    SELECT * INTO v_referred_business 
    FROM public.businesses 
    WHERE id = p_referred_business_id;
    
    -- Exit if no business or no referrer
    IF NOT FOUND OR v_referred_business.referred_by_business_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Check if reward record already exists
    IF EXISTS (
        SELECT 1 FROM public.business_referral_rewards 
        WHERE referred_business_id = p_referred_business_id
    ) THEN
        RETURN;
    END IF;
    
    -- Create pending reward record
    INSERT INTO public.business_referral_rewards (
        referrer_business_id,
        referred_business_id,
        reward_type,
        reward_days,
        status,
        eligibility_reason,
        applied_by
    ) VALUES (
        v_referred_business.referred_by_business_id,
        v_referred_business.id,
        'moana_extension',
        31,
        'pending',
        'Awaiting business activation',
        'system'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the operation
        RAISE WARNING 'Failed to create pending referral reward for business %: %', p_referred_business_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get referral reward summary for a business
CREATE OR REPLACE FUNCTION public.get_business_referral_summary(p_business_id UUID)
RETURNS JSON AS $$
DECLARE
    v_business RECORD;
    v_rewards_given JSON;
    v_rewards_received JSON;
    v_result JSON;
BEGIN
    -- Load business
    SELECT * INTO v_business 
    FROM public.businesses 
    WHERE id = p_business_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Business not found');
    END IF;
    
    -- Get rewards this business has given (as referrer)
    SELECT json_agg(
        json_build_object(
            'reward_id', r.id,
            'referred_business_id', r.referred_business_id,
            'referred_business_name', b.business_name,
            'status', r.status,
            'reward_days', r.reward_days,
            'applied_at', r.applied_at,
            'eligibility_reason', r.eligibility_reason
        )
    ) INTO v_rewards_given
    FROM public.business_referral_rewards r
    JOIN public.businesses b ON r.referred_business_id = b.id
    WHERE r.referrer_business_id = p_business_id;
    
    -- Get rewards this business has received (as referred)
    SELECT json_agg(
        json_build_object(
            'reward_id', r.id,
            'referrer_business_id', r.referrer_business_id,
            'referrer_business_name', b.business_name,
            'status', r.status,
            'reward_days', r.reward_days,
            'applied_at', r.applied_at,
            'eligibility_reason', r.eligibility_reason
        )
    ) INTO v_rewards_received
    FROM public.business_referral_rewards r
    JOIN public.businesses b ON r.referrer_business_id = b.id
    WHERE r.referred_business_id = p_business_id;
    
    v_result := json_build_object(
        'business_id', p_business_id,
        'business_name', v_business.business_name,
        'current_tier', v_business.subscription_tier,
        'tier_expires_at', v_business.tier_expires_at,
        'referral_count', v_business.referral_count,
        'referred_by_business_id', v_business.referred_by_business_id,
        'rewards_given', COALESCE(v_rewards_given, '[]'::json),
        'rewards_received', COALESCE(v_rewards_received, '[]'::json),
        'total_reward_days_given', (
            SELECT COALESCE(SUM(r.reward_days), 0)
            FROM public.business_referral_rewards r
            WHERE r.referrer_business_id = p_business_id 
            AND r.status = 'applied'
        )
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.apply_referral_reward_for_business TO service_role;
GRANT EXECUTE ON FUNCTION public.create_pending_referral_reward TO service_role;
GRANT EXECUTE ON FUNCTION public.get_business_referral_summary TO service_role;

-- Add comments
COMMENT ON FUNCTION public.apply_referral_reward_for_business(UUID) IS 'Applies referral rewards to both referrer and referred businesses when referred business becomes eligible. Idempotent and transaction-safe. Gives +31 days Moana extension to both parties.';
COMMENT ON FUNCTION public.create_pending_referral_reward(UUID) IS 'Creates pending reward record when business with referral is created. Does not apply rewards immediately.';
COMMENT ON FUNCTION public.get_business_referral_summary(UUID) IS 'Returns comprehensive referral summary for a business including rewards given and received.';
