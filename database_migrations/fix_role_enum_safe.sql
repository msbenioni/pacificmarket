-- Safe Role System Fix - Avoids Constraint Violations
-- This approach updates data in place without dropping columns

-- Step 1: Update all existing non-admin roles to NULL first
-- This ensures we don't violate any constraints when changing the enum
UPDATE profiles 
SET role = NULL 
WHERE role NOT IN ('admin');

-- Step 2: Create a new enum type (we'll rename the old one first)
ALTER TYPE app_role RENAME TO app_role_old;

-- Step 3: Create the new simplified enum
CREATE TYPE app_role AS ENUM ('admin');

-- Step 4: Use ALTER TABLE to convert the column to the new enum type
-- This works because all non-admin values are now NULL
ALTER TABLE profiles 
ALTER COLUMN role TYPE app_role 
USING role::text::app_role;

-- Step 5: Clean up the old enum type
DROP TYPE app_role_old;

-- Step 6: Restore admin roles (in case any were lost)
UPDATE profiles SET role = 'admin' WHERE id IN (SELECT owner_user_id FROM admin_users WHERE role = 'admin');

-- Step 7: Drop the duplicate public_profiles view since it's redundant
DROP VIEW IF EXISTS public_profiles CASCADE;

-- Step 8: Update the analytics_profiles view to use the main table directly
CREATE OR REPLACE VIEW analytics_profiles AS
SELECT 
    -- Public fields from main profiles table
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

-- Step 9: Grant permissions on the updated analytics view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Step 10: Add comment explaining the role system
COMMENT ON COLUMN profiles.role IS 'User role - NULL for regular users, admin only for administrators';
COMMENT ON TABLE profiles IS 'User profiles - role is NULL for regular users, admin only for administrators';

-- Verification queries:
-- Check current role distribution
-- SELECT role, COUNT(*) FROM profiles GROUP BY role;

-- Check that admin_users still have proper roles
-- SELECT p.id, p.role, au.owner_user_id FROM profiles p 
-- LEFT JOIN admin_users au ON p.id = au.owner_user_id 
-- WHERE au.owner_user_id IS NOT NULL;
