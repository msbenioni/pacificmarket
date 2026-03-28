-- Add referral system to businesses table
-- Created: 2026-03-28
-- Purpose: Track business referrals and apply rewards

-- Add referral fields to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS referred_by_business_id UUID NULL REFERENCES public.businesses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS referral_reward_applied BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS referral_reward_applied_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS tier_expires_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS referral_count INTEGER NOT NULL DEFAULT 0;

-- Create index for referral queries
CREATE INDEX IF NOT EXISTS idx_businesses_referred_by ON public.businesses(referred_by_business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_referral_reward_applied ON public.businesses(referral_reward_applied);

-- Create SQL function to apply referral rewards
CREATE OR REPLACE FUNCTION public.apply_referral_moana_reward(p_new_business_id UUID)
RETURNS JSON AS $$
DECLARE
    v_new_business RECORD;
    v_referrer_business RECORD;
    v_new_expiry_date TIMESTAMPTZ;
    v_referrer_expiry_date TIMESTAMPTZ;
    v_result JSON;
BEGIN
    -- Load the new business
    SELECT * INTO v_new_business 
    FROM public.businesses 
    WHERE id = p_new_business_id;
    
    -- Fail if new business not found
    IF NOT FOUND THEN
        v_result := json_build_object('success', false, 'error', 'New business not found');
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
    
    -- Load referrer business
    SELECT * INTO v_referrer_business 
    FROM public.businesses 
    WHERE id = v_new_business.referred_by_business_id;
    
    -- Fail if referrer not found
    IF NOT FOUND THEN
        v_result := json_build_object('success', false, 'error', 'Referrer business not found');
        RETURN v_result;
    END IF;
    
    -- Calculate expiry dates
    -- For new business: extend from existing expiry or now
    IF v_new_business.tier_expires_at IS NOT NULL AND v_new_business.tier_expires_at > now() THEN
        v_new_expiry_date := v_new_business.tier_expires_at + interval '1 month';
    ELSE
        v_new_expiry_date := now() + interval '1 month';
    END IF;
    
    -- For referrer: extend from existing expiry or now
    IF v_referrer_business.tier_expires_at IS NOT NULL AND v_referrer_business.tier_expires_at > now() THEN
        v_referrer_expiry_date := v_referrer_business.tier_expires_at + interval '1 month';
    ELSE
        v_referrer_expiry_date := now() + interval '1 month';
    END IF;
    
    -- Update new business
    UPDATE public.businesses 
    SET 
        subscription_tier = 'moana',
        tier_expires_at = v_new_expiry_date,
        referral_reward_applied = true,
        referral_reward_applied_at = now(),
        updated_at = now()
    WHERE id = p_new_business_id;
    
    -- Update referrer business
    UPDATE public.businesses 
    SET 
        subscription_tier = 'moana',
        tier_expires_at = v_referrer_expiry_date,
        referral_count = referral_count + 1,
        updated_at = now()
    WHERE id = v_new_business.referred_by_business_id;
    
    -- Return success result
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.apply_referral_moana_reward TO authenticated;

-- Add RLS policy for referral fields (allow admins to see referral info)
DROP POLICY IF EXISTS "Admins can view referral info" ON public.businesses;
CREATE POLICY "Admins can view referral info" ON public.businesses
FOR SELECT USING (
    exists (
        select 1 from public.profiles 
        where profiles.id = auth.uid() 
        and profiles.role = 'admin'
    )
    OR auth.uid() = owner_user_id
);

-- Add RLS policy for updating referral fields (service role only for reward application)
DROP POLICY IF EXISTS "Service role can apply referral rewards" ON public.businesses;
CREATE POLICY "Service role can apply referral rewards" ON public.businesses
FOR UPDATE USING (
    auth.role() = 'service_role'
) WITH CHECK (
    auth.role() = 'service_role'
);
