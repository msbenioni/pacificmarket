-- Create referral system for Pacific Market
-- This adds the referral functionality as described in the email announcement

-- 1. Add referral_code column to businesses table
-- We'll use the existing business_handle as the referral code for simplicity
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Update existing businesses to use their handle as referral code
UPDATE businesses 
SET referral_code = business_handle 
WHERE referral_code IS NULL AND business_handle IS NOT NULL;

-- 2. Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    referred_business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
    
    -- Ensure a business can't refer the same business twice
    UNIQUE(referrer_business_id, referred_business_id)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_business_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_business_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_businesses_referral_code ON businesses(referral_code);

-- 4. Add RLS (Row Level Security) policies
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see referrals they are involved in (either as referrer or referred)
CREATE POLICY "Users can view their own referrals" ON referrals
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            -- Business owners can see referrals they made or received
            EXISTS (
                SELECT 1 FROM businesses b 
                WHERE b.id = referrer_business_id 
                AND b.owner_user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM businesses b 
                WHERE b.id = referred_business_id 
                AND b.owner_user_id = auth.uid()
            )
        )
    );

-- Policy: System can insert referrals (this will be handled by backend functions)
CREATE POLICY "System can insert referrals" ON referrals
    FOR INSERT WITH CHECK (true);

-- Policy: System can update referrals (for admin approval)
CREATE POLICY "System can update referrals" ON referrals
    FOR UPDATE USING (true);

-- 5. Create function to handle referral creation during signup
CREATE OR REPLACE FUNCTION create_referral_if_present(
    p_referrer_code TEXT,
    p_referred_business_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referrer_business_id UUID;
BEGIN
    -- Only proceed if we have a valid referral code
    IF p_referrer_code IS NOT NULL AND p_referrer_code != '' THEN
        -- Find the referrer business by their referral code
        SELECT id INTO v_referrer_business_id
        FROM businesses
        WHERE referral_code = p_referrer_code;
        
        -- If we found a valid referrer and it's not self-referral
        IF v_referrer_business_id IS NOT NULL AND v_referrer_business_id != p_referred_business_id THEN
            -- Insert the referral record
            INSERT INTO referrals (referrer_business_id, referred_business_id, status)
            VALUES (v_referrer_business_id, p_referred_business_id, 'approved')
            ON CONFLICT (referrer_business_id, referred_business_id) DO NOTHING;
        END IF;
    END IF;
END;
$$;

-- 6. Create function to get referral stats for a business
CREATE OR REPLACE FUNCTION get_referral_stats(p_business_id UUID)
RETURNS TABLE(
    total_referrals BIGINT,
    pending_referrals BIGINT,
    approved_referrals BIGINT,
    draw_entries BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_referrals,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_referrals,
        COUNT(*) FILTER (WHERE status = 'approved') as draw_entries
    FROM referrals
    WHERE referrer_business_id = p_business_id;
END;
$$;

-- 7. Create function for admin to select monthly winner
CREATE OR REPLACE FUNCTION select_monthly_referral_winner()
RETURNS TABLE(
    business_id UUID,
    business_name TEXT,
    referral_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH referral_counts AS (
        SELECT 
            referrer_business_id,
            COUNT(*) as count
        FROM referrals
        WHERE status = 'approved'
        GROUP BY referrer_business_id
    ),
    winner_selection AS (
        SELECT 
            rc.referrer_business_id,
            rc.count,
            -- This gives each referral an equal chance, not businesses with more referrals
            ROW_NUMBER() OVER (ORDER BY random()) as rn
        FROM referral_counts rc
    )
    SELECT 
        b.id as business_id,
        b.name as business_name,
        ws.count as referral_count
    FROM winner_selection ws
    JOIN businesses b ON b.id = ws.referrer_business_id
    WHERE ws.rn = 1;
END;
$$;

-- 8. Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_referral_if_present TO authenticated;
GRANT EXECUTE ON FUNCTION get_referral_stats TO authenticated;
GRANT EXECUTE ON FUNCTION select_monthly_referral_winner TO authenticated;
