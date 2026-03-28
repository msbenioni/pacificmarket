-- Harden referral system with improved security and validation
-- Created: 2026-03-28
-- Purpose: Secure referral reward application with proper business status checks

-- Drop existing function and recreate with improved security
DROP FUNCTION IF EXISTS public.apply_referral_moana_reward(UUID);

-- Create improved SQL function with proper status validation
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
    -- For new business: extend from existing expiry if in future, otherwise from now
    IF v_new_business.tier_expires_at IS NOT NULL AND v_new_business.tier_expires_at > now() THEN
        v_new_expiry_date := v_new_business.tier_expires_at + interval '1 month';
    ELSE
        v_new_expiry_date := now() + interval '1 month';
    END IF;
    
    -- For referrer: extend from existing expiry if in future, otherwise from now
    IF v_referrer_business.tier_expires_at IS NOT NULL AND v_referrer_business.tier_expires_at > now() THEN
        v_referrer_expiry_date := v_referrer_business.tier_expires_at + interval '1 month';
    ELSE
        v_referrer_expiry_date := now() + interval '1 month';
    END IF;
    
    -- Update new business with Moana tier
    UPDATE public.businesses 
    SET 
        subscription_tier = 'moana',
        tier_expires_at = v_new_expiry_date,
        referral_reward_applied = true,
        referral_reward_applied_at = now(),
        updated_at = now()
    WHERE id = p_new_business_id;
    
    -- Update referrer business with Moana tier and increment referral count
    UPDATE public.businesses 
    SET 
        subscription_tier = 'moana',
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

-- Revoke broad permissions and only grant to service role
REVOKE ALL ON FUNCTION public.apply_referral_moana_reward(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.apply_referral_moana_reward(UUID) FROM authenticated;
REVOKE ALL ON FUNCTION public.apply_referral_moana_reward(UUID) FROM anon;

-- Grant execute only to service role (for admin API calls)
GRANT EXECUTE ON FUNCTION public.apply_referral_moana_reward(UUID) TO service_role;

-- Add comment documenting the security model
COMMENT ON FUNCTION public.apply_referral_moana_reward(UUID) IS 'Securely applies referral rewards to both new and referrer businesses. Only callable by service role through admin API. Requires both businesses to be active status (no verification requirement).';
