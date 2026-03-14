-- ================================================================
-- PACIFIC MARKET DATABASE MIGRATION SCRIPT
-- Purpose: Safely migrate to the new clean schema
-- ================================================================

-- ================================================================
-- BACKUP EXISTING DATA
-- ================================================================

-- Create backup tables if they don't exist
CREATE TABLE IF NOT EXISTS backup_businesses AS SELECT * FROM businesses;
CREATE TABLE IF NOT EXISTS backup_business_insights AS SELECT * FROM business_insights;
CREATE TABLE IF NOT EXISTS backup_founder_insights AS SELECT * FROM founder_insights;
CREATE TABLE IF NOT EXISTS backup_profiles AS SELECT * FROM profiles;

-- ================================================================
-- CLEANUP - DROP OLD OBJECTS
-- ================================================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS public_business_listings;
DROP VIEW IF EXISTS business_insights_summary;

-- Drop triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
DROP TRIGGER IF EXISTS update_business_insights_updated_at ON business_insights;
DROP TRIGGER IF EXISTS update_founder_insights_updated_at ON founder_insights;

-- Drop RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view basic profile info" ON profiles;

DROP POLICY IF EXISTS "Users can view own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can insert own businesses" ON businesses;
DROP POLICY IF EXISTS "Admins full access to businesses" ON businesses;
DROP POLICY IF EXISTS "Public can view active business listings" ON businesses;
DROP POLICY IF EXISTS "Additional owners can view business" ON businesses;

DROP POLICY IF EXISTS "Users can view own business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can update own business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can insert own business insights" ON business_insights;
DROP POLICY IF EXISTS "Admins full access to business_insights" ON business_insights;
DROP POLICY IF EXISTS "Business owners can view business insights" ON business_insights;

DROP POLICY IF EXISTS "Users can view own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can update own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can insert own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Admins full access to founder_insights" ON founder_insights;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins full access to notifications" ON notifications;

-- Disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights DISABLE ROW LEVEL SECURITY;
ALTER TABLE founder_insights DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS generate_unique_business_handle();

-- Drop tables (in correct order to handle dependencies)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS founder_insights;
DROP TABLE IF EXISTS business_insights;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS profiles;

-- ================================================================
-- APPLY NEW SCHEMA
-- ================================================================

-- Run the complete schema creation
-- Note: This should be replaced with: \i pacific_market_complete_schema.sql

-- ================================================================
-- MIGRATE DATA FROM BACKUP
-- ================================================================

-- Migrate profiles data
INSERT INTO profiles (user_id, email, full_name, avatar_url, created_at, updated_at, profile_completeness)
SELECT 
    user_id,
    email,
    full_name,
    avatar_url,
    created_at,
    updated_at,
    COALESCE(profile_completeness, 0)
FROM backup_profiles
WHERE user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Migrate businesses data
INSERT INTO businesses (
    id, owner_user_id, created_at, updated_at, name, business_handle, 
    short_description, description, tagline, contact_name, contact_email, 
    contact_phone, contact_website, business_hours, public_phone, country, 
    city, suburb, address, state_region, postal_code, industry, 
    business_type, business_structure, logo_url, banner_url, 
    business_owner, business_owner_email, additional_owner_emails, 
    year_started, team_size_band, employee_count, annual_revenue, 
    revenue_band, status, verified, claimed, claimed_at, claimed_by, 
    subscription_tier, visibility_tier, homepage_featured, 
    business_operating_status, business_registered, social_links, 
    website, cultural_identity, languages_spoken, source, referral_code
)
SELECT 
    id,
    owner_user_id,
    created_at,
    updated_at,
    name,
    business_handle,
    short_description,
    description,
    tagline,
    contact_name,
    contact_email,
    contact_phone,
    contact_website,
    business_hours,
    public_phone,
    country,
    city,
    suburb,
    address,
    state_region,
    postal_code,
    industry,
    business_type,
    business_structure,
    logo_url,
    banner_url,
    business_owner,
    business_owner_email,
    additional_owner_emails,
    year_started,
    team_size_band,
    employee_count,
    annual_revenue,
    revenue_band,
    status,
    verified,
    claimed,
    claimed_at,
    claimed_by,
    subscription_tier,
    visibility_tier,
    homepage_featured,
    business_operating_status,
    business_registered,
    social_links,
    website,
    cultural_identity,
    languages_spoken,
    source,
    referral_code
FROM backup_businesses
WHERE id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Migrate business insights data
INSERT INTO business_insights (
    id, business_id, user_id, snapshot_year, submitted_date, created_at, updated_at,
    year_started, problem_solved, team_size_band, business_model, family_involvement,
    customer_region, sales_channels, import_export_status, import_countries,
    export_countries, business_stage, top_challenges, hiring_intentions,
    business_operating_status, business_age, business_registered, employs_anyone,
    employs_family_community, team_size, revenue_band, current_funding_source,
    funding_amount_needed, funding_purpose, investment_stage, revenue_streams,
    financial_challenges, investment_exploration, community_impact_areas,
    support_needed_next, current_support_sources, expansion_plans, industry,
    private_business_phone, private_business_email
)
SELECT 
    id,
    business_id,
    user_id,
    snapshot_year,
    submitted_date,
    created_at,
    updated_at,
    year_started,
    problem_solved,
    team_size_band,
    business_model,
    family_involvement,
    customer_region,
    sales_channels,
    import_export_status,
    import_countries,
    export_countries,
    business_stage,
    top_challenges,
    hiring_intentions,
    business_operating_status,
    business_age,
    business_registered,
    employs_anyone,
    employs_family_community,
    team_size,
    revenue_band,
    current_funding_source,
    funding_amount_needed,
    funding_purpose,
    investment_stage,
    revenue_streams,
    financial_challenges,
    investment_exploration,
    community_impact_areas,
    support_needed_next,
    current_support_sources,
    expansion_plans,
    industry,
    private_business_phone,
    private_business_email
FROM backup_business_insights
WHERE id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Migrate founder insights data
INSERT INTO founder_insights (
    id, user_id, snapshot_year, submitted_date, created_at, updated_at,
    gender, age_range, years_entrepreneurial, entrepreneurial_background,
    businesses_founded, family_entrepreneurial_background, founder_role,
    founder_story, founder_motivation_array, pacific_identity, based_in_country,
    based_in_city, serves_pacific_communities, culture_influences_business,
    culture_influence_details, family_community_responsibilities_affect_business,
    responsibilities_impact_details, mentorship_access, mentorship_offering,
    barriers_to_mentorship, angel_investor_interest, investor_capacity,
    collaboration_interest, open_to_future_contact, goals_details,
    goals_next_12_months_array
)
SELECT 
    id,
    user_id,
    snapshot_year,
    submitted_date,
    created_at,
    updated_at,
    gender,
    age_range,
    years_entrepreneurial,
    entrepreneurial_background,
    businesses_founded,
    family_entrepreneurial_background,
    founder_role,
    founder_story,
    founder_motivation_array,
    pacific_identity,
    based_in_country,
    based_in_city,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    mentorship_access,
    mentorship_offering,
    barriers_to_mentorship,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    open_to_future_contact,
    goals_details,
    goals_next_12_months_array
FROM backup_founder_insights
WHERE id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Check data migration
DO $$
DECLARE
    profiles_count INTEGER;
    businesses_count INTEGER;
    insights_count INTEGER;
    founder_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profiles_count FROM profiles;
    SELECT COUNT(*) INTO businesses_count FROM businesses;
    SELECT COUNT(*) INTO insights_count FROM business_insights;
    SELECT COUNT(*) INTO founder_count FROM founder_insights;
    
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE '- Profiles: %', profiles_count;
    RAISE NOTICE '- Businesses: %', businesses_count;
    RAISE NOTICE '- Business Insights: %', insights_count;
    RAISE NOTICE '- Founder Insights: %', founder_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Migration completed successfully!';
END $$;

-- ================================================================
-- CLEANUP BACKUP TABLES (Optional)
-- ================================================================

-- Uncomment the following lines after verifying migration is successful:
-- DROP TABLE IF EXISTS backup_businesses;
-- DROP TABLE IF EXISTS backup_business_insights;
-- DROP TABLE IF EXISTS backup_founder_insights;
-- DROP TABLE IF EXISTS backup_profiles;
