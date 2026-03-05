-- Rollback Role Enum and Views Fix
-- This script reverts the role enum changes and restores the previous state

-- Step 1: Drop the simplified enum and column
ALTER TABLE profiles DROP COLUMN IF EXISTS role;
DROP TYPE IF EXISTS app_role;

-- Step 2: Recreate the original enum with buyer, seller, admin
CREATE TYPE app_role AS ENUM ('buyer', 'seller', 'admin');

-- Step 3: Add the role column back with buyer as default
ALTER TABLE profiles ADD COLUMN role app_role DEFAULT 'buyer' NOT NULL;

-- Step 4: Restore the public_profiles view (if needed)
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
    id,
    role,
    display_name,
    email,
    country,
    primary_cultural,
    cultural_other,
    cultural_tags,
    potential_seller_handle,
    country_other,
    created_at,
    updated_at
FROM profiles;

-- Step 5: Grant permissions on the restored view
GRANT SELECT ON public_profiles TO authenticated, anon;

-- Step 6: Update analytics_profiles view
CREATE OR REPLACE VIEW analytics_profiles AS
SELECT 
    -- Public fields
    id,
    role,
    display_name,
    email,
    country,
    primary_cultural,
    cultural_other,
    cultural_tags,
    potential_seller_handle,
    country_other,
    created_at,
    updated_at,
    
    -- Private analytics fields (added by migration)
    education_level,
    professional_background,
    business_networks,
    mentorship_availability,
    investment_interest,
    community_involvement,
    skills_expertise,
    business_goals,
    challenges_faced,
    success_factors,
    preferred_collaboration
FROM profiles;

-- Step 7: Grant permissions on analytics view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Note: This rollback will lose any role changes made after the fix
-- You may need to manually restore admin roles for admin users
