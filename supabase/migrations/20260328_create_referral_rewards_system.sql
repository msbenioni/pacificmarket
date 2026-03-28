-- Create automated referral reward system
-- Created: 2026-03-28
-- Purpose: Track and automatically apply referral rewards for referrers only

-- Create referral rewards tracking table
CREATE TABLE IF NOT EXISTS public.business_referral_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    referred_business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL DEFAULT 'moana_extension',
    reward_days INTEGER NOT NULL DEFAULT 31,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'skipped', 'failed')),
    eligibility_reason TEXT,
    applied_at TIMESTAMPTZ NULL,
    applied_by TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure one reward per referred business
    UNIQUE (referred_business_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON public.business_referral_rewards(referrer_business_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referred ON public.business_referral_rewards(referred_business_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON public.business_referral_rewards(status);

-- Add comments
COMMENT ON TABLE public.business_referral_rewards IS 'Tracks referral rewards applied to referrer businesses when referred businesses become active';
COMMENT ON COLUMN public.business_referral_rewards.reward_type IS 'Type of reward granted (currently only moana_extension)';
COMMENT ON COLUMN public.business_referral_rewards.reward_days IS 'Number of days added to referrer Moana plan';
COMMENT ON COLUMN public.business_referral_rewards.status IS 'pending=awaiting activation, applied=reward granted, skipped=not eligible, failed=error occurred';
COMMENT ON COLUMN public.business_referral_rewards.eligibility_reason IS 'Why the reward was granted or skipped';
COMMENT ON COLUMN public.business_referral_rewards.applied_at IS 'When the reward was actually applied to referrer';
COMMENT ON COLUMN public.business_referral_rewards.applied_by IS 'System or user who applied the reward';

-- Enable RLS
ALTER TABLE public.business_referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can view all referral rewards" ON public.business_referral_rewards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Business owners can view their referral rewards" ON public.business_referral_rewards
    FOR SELECT USING (
        auth.uid() = (
            SELECT owner_user_id FROM public.businesses 
            WHERE businesses.id = business_referral_rewards.referrer_business_id
        )
    );

CREATE POLICY "Service role can manage referral rewards" ON public.business_referral_rewards
    FOR ALL USING (auth.role() = 'service_role');

-- Function to check if a business is eligible for referral reward
CREATE OR REPLACE FUNCTION public.is_business_referral_reward_eligible(p_business_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_business RECORD;
    v_existing_reward_count INTEGER;
BEGIN
    -- Load the business
    SELECT * INTO v_business 
    FROM public.businesses 
    WHERE id = p_business_id;
    
    -- Not found
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Must have a referrer
    IF v_business.referred_by_business_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Must be active
    IF v_business.status != 'active' THEN
        RETURN FALSE;
    END IF;
    
    -- Must not have already produced an applied reward
    SELECT COUNT(*) INTO v_existing_reward_count
    FROM public.business_referral_rewards 
    WHERE referred_business_id = p_business_id 
    AND status = 'applied';
    
    IF v_existing_reward_count > 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Referrer must exist and be active
    IF NOT EXISTS (
        SELECT 1 FROM public.businesses 
        WHERE id = v_business.referred_by_business_id 
        AND status = 'active'
    ) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get eligibility reason
CREATE OR REPLACE FUNCTION public.get_business_referral_reward_eligibility_reason(p_business_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_business RECORD;
    v_existing_reward RECORD;
BEGIN
    -- Load the business
    SELECT * INTO v_business 
    FROM public.businesses 
    WHERE id = p_business_id;
    
    -- Not found
    IF NOT FOUND THEN
        RETURN 'Business not found';
    END IF;
    
    -- No referrer
    IF v_business.referred_by_business_id IS NULL THEN
        RETURN 'No referral relationship found';
    END IF;
    
    -- Not active
    IF v_business.status != 'active' THEN
        RETURN 'Business is not active (status: ' || COALESCE(v_business.status, 'null') || ')';
    END IF;
    
    -- Check for existing applied reward
    SELECT * INTO v_existing_reward
    FROM public.business_referral_rewards 
    WHERE referred_business_id = p_business_id 
    AND status = 'applied'
    LIMIT 1;
    
    IF FOUND THEN
        RETURN 'Reward already applied on ' || TO_CHAR(v_existing_reward.applied_at, 'YYYY-MM-DD HH24:MI:SS');
    END IF;
    
    -- Check referrer status
    IF NOT EXISTS (
        SELECT 1 FROM public.businesses 
        WHERE id = v_business.referred_by_business_id 
        AND status = 'active'
    ) THEN
        RETURN 'Referrer business is not active';
    END IF;
    
    RETURN 'Eligible for referral reward';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_business_referral_reward_eligible TO service_role;
GRANT EXECUTE ON FUNCTION public.get_business_referral_reward_eligibility_reason TO service_role;

-- Add comment documenting the new system
COMMENT ON FUNCTION public.is_business_referral_reward_eligible(UUID) IS 'Checks if a business is eligible for referral reward application. Returns true only for active businesses with referrers that have not yet received rewards.';
COMMENT ON FUNCTION public.get_business_referral_reward_eligibility_reason(UUID) IS 'Returns human-readable reason why a business is or is not eligible for referral rewards.';
