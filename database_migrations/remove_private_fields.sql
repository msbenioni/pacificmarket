-- Remove Private Fields from Businesses Table
-- Rollback migration for enhanced business profile data capture

-- Drop indexes first
DROP INDEX IF EXISTS idx_businesses_business_structure;
DROP INDEX IF EXISTS idx_businesses_funding_source;
DROP INDEX IF EXISTS idx_businesses_annual_revenue_exact;

-- Remove private business analytics fields from businesses table
ALTER TABLE businesses 
DROP COLUMN IF EXISTS business_structure,
DROP COLUMN IF EXISTS annual_revenue_exact,
DROP COLUMN IF EXISTS full_time_employees,
DROP COLUMN IF EXISTS part_time_employees,
DROP COLUMN IF EXISTS primary_market,
DROP COLUMN IF EXISTS growth_stage,
DROP COLUMN IF EXISTS funding_source,
DROP COLUMN IF EXISTS business_challenges,
DROP COLUMN IF EXISTS future_plans,
DROP COLUMN IF EXISTS tech_stack,
DROP COLUMN IF EXISTS customer_segments,
DROP COLUMN IF EXISTS competitive_advantage;

-- Remove Private Fields from Profiles Table  
-- Rollback migration for enhanced owner profile data capture

-- Drop indexes first
DROP INDEX IF EXISTS idx_profiles_education_level;
DROP INDEX IF EXISTS idx_profiles_mentorship_availability;
DROP INDEX IF EXISTS idx_profiles_investment_interest;

-- Remove private user analytics fields from profiles table
ALTER TABLE profiles 
DROP COLUMN IF EXISTS education_level,
DROP COLUMN IF EXISTS professional_background,
DROP COLUMN IF EXISTS business_networks,
DROP COLUMN IF EXISTS mentorship_availability,
DROP COLUMN IF EXISTS investment_interest,
DROP COLUMN IF EXISTS community_involvement,
DROP COLUMN IF EXISTS skills_expertise,
DROP COLUMN IF EXISTS business_goals,
DROP COLUMN IF EXISTS challenges_faced,
DROP COLUMN IF EXISTS success_factors,
DROP COLUMN IF EXISTS preferred_collaboration;

-- Note: RLS policies are recreated in the main migration, so no need to drop them here
-- They will be updated automatically when the main migration is applied
