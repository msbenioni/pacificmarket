-- Add Private Fields to Businesses Table
-- Migration for enhanced business profile data capture

-- Add private business analytics fields to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS business_structure TEXT,
ADD COLUMN IF NOT EXISTS annual_revenue_exact INTEGER,
ADD COLUMN IF NOT EXISTS full_time_employees INTEGER,
ADD COLUMN IF NOT EXISTS part_time_employees INTEGER,
ADD COLUMN IF NOT EXISTS primary_market TEXT,
ADD COLUMN IF NOT EXISTS growth_stage TEXT,
ADD COLUMN IF NOT EXISTS funding_source TEXT,
ADD COLUMN IF NOT EXISTS business_challenges TEXT[],
ADD COLUMN IF NOT EXISTS future_plans TEXT,
ADD COLUMN IF NOT EXISTS tech_stack TEXT[],
ADD COLUMN IF NOT EXISTS customer_segments TEXT[],
ADD COLUMN IF NOT EXISTS competitive_advantage TEXT;

-- Add indexes for better query performance on private fields
CREATE INDEX IF NOT EXISTS idx_businesses_business_structure ON businesses(business_structure);
CREATE INDEX IF NOT EXISTS idx_businesses_funding_source ON businesses(funding_source);
CREATE INDEX IF NOT EXISTS idx_businesses_annual_revenue_exact ON businesses(annual_revenue_exact);

-- Add comments to document private fields
COMMENT ON COLUMN businesses.business_structure IS 'Legal business structure (private data for analytics)';
COMMENT ON COLUMN businesses.annual_revenue_exact IS 'Exact annual revenue in USD (private data for analytics)';
COMMENT ON COLUMN businesses.full_time_employees IS 'Exact full-time employee count (private data for analytics)';
COMMENT ON COLUMN businesses.part_time_employees IS 'Exact part-time employee count (private data for analytics)';
COMMENT ON COLUMN businesses.primary_market IS 'Primary target market (private data for analytics)';
COMMENT ON COLUMN businesses.growth_stage IS 'Detailed growth stage (private data for analytics)';
COMMENT ON COLUMN businesses.funding_source IS 'Primary funding source (private data for analytics)';
COMMENT ON COLUMN businesses.business_challenges IS 'Key business challenges array (private data for analytics)';
COMMENT ON COLUMN businesses.future_plans IS 'Growth and expansion plans (private data for analytics)';
COMMENT ON COLUMN businesses.tech_stack IS 'Technologies used array (private data for analytics)';
COMMENT ON COLUMN businesses.customer_segments IS 'Primary customer types array (private data for analytics)';
COMMENT ON COLUMN businesses.competitive_advantage IS 'Unique selling proposition (private data for analytics)';

-- Add Private Fields to Profiles Table  
-- Migration for enhanced owner profile data capture

-- Add private user analytics fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS professional_background TEXT[],
ADD COLUMN IF NOT EXISTS business_networks TEXT[],
ADD COLUMN IF NOT EXISTS mentorship_availability BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS investment_interest TEXT,
ADD COLUMN IF NOT EXISTS community_involvement TEXT[],
ADD COLUMN IF NOT EXISTS skills_expertise TEXT[],
ADD COLUMN IF NOT EXISTS business_goals TEXT,
ADD COLUMN IF NOT EXISTS challenges_faced TEXT[],
ADD COLUMN IF NOT EXISTS success_factors TEXT[],
ADD COLUMN IF NOT EXISTS preferred_collaboration TEXT[];

-- Add indexes for better query performance on private fields
CREATE INDEX IF NOT EXISTS idx_profiles_education_level ON profiles(education_level);
CREATE INDEX IF NOT EXISTS idx_profiles_mentorship_availability ON profiles(mentorship_availability);
CREATE INDEX IF NOT EXISTS idx_profiles_investment_interest ON profiles(investment_interest);

-- Add comments to document private fields
COMMENT ON COLUMN profiles.education_level IS 'Highest education achieved (private data for analytics)';
COMMENT ON COLUMN profiles.professional_background IS 'Previous industries/roles array (private data for analytics)';
COMMENT ON COLUMN profiles.business_networks IS 'Professional networks array (private data for analytics)';
COMMENT ON COLUMN profiles.mentorship_availability IS 'Available to mentor others (private data for analytics)';
COMMENT ON COLUMN profiles.investment_interest IS 'Interest in investing (private data for analytics)';
COMMENT ON COLUMN profiles.community_involvement IS 'Community organizations array (private data for analytics)';
COMMENT ON COLUMN profiles.skills_expertise IS 'Professional skills array (private data for analytics)';
COMMENT ON COLUMN profiles.business_goals IS '1-5 year business objectives (private data for analytics)';
COMMENT ON COLUMN profiles.challenges_faced IS 'Business challenges array (private data for analytics)';
COMMENT ON COLUMN profiles.success_factors IS 'Key success factors array (private data for analytics)';
COMMENT ON COLUMN profiles.preferred_collaboration IS 'Collaboration preferences array (private data for analytics)';

-- Create Row Level Security (RLS) policies to ensure private fields are only accessible to the user
-- This ensures privacy protection for sensitive data

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own business data" ON businesses;
DROP POLICY IF EXISTS "Users can update own business data" ON businesses;
DROP POLICY IF EXISTS "Users can insert own business data" ON businesses;

DROP POLICY IF EXISTS "Users can view own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile data" ON profiles;

-- Create new RLS policies for businesses table
CREATE POLICY "Users can view own business data" ON businesses
    FOR SELECT USING (auth.uid() = owner_user_id OR auth.uid() = user_id);

CREATE POLICY "Users can update own business data" ON businesses
    FOR UPDATE USING (auth.uid() = owner_user_id OR auth.uid() = user_id);

CREATE POLICY "Users can insert own business data" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = owner_user_id OR auth.uid() = user_id);

-- Create new RLS policies for profiles table  
CREATE POLICY "Users can view own profile data" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile data" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile data" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create admin policies for analytics access
-- Admin users can access aggregated data but not individual private fields
CREATE POLICY "Admins can view business analytics" ON businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.owner_user_id = auth.uid() 
            AND admin_users.role = 'admin'
        )
        AND (
            -- Only allow access to non-private fields for analytics
            id IS NOT NULL
        )
    );

CREATE POLICY "Admins can view profile analytics" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.owner_user_id = auth.uid() 
            AND admin_users.role = 'admin'
        )
        AND (
            -- Only allow access to non-private fields for analytics
            id IS NOT NULL
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON businesses TO authenticated;
GRANT ALL ON profiles TO authenticated;
