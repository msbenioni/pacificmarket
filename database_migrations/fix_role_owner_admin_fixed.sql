-- Fix Role System - Change to Owner/Admin (Fixed Version)
-- This properly handles the enum conversion without invalid value errors

-- Step 1: Create the new enum type first (alongside the old one)
CREATE TYPE app_role_new AS ENUM ('owner', 'admin');

-- Step 2: Add a temporary column with the new enum type
ALTER TABLE profiles ADD COLUMN role_new app_role_new DEFAULT 'owner';

-- Step 3: Copy data from old role to new role with proper mapping
UPDATE profiles 
SET role_new = CASE 
  WHEN role IN ('buyer', 'seller') THEN 'owner'::app_role_new
  WHEN role = 'admin' THEN 'admin'::app_role_new
  ELSE 'owner'::app_role_new
END;

-- Step 4: Drop the old role column
ALTER TABLE profiles DROP COLUMN role;

-- Step 5: Rename the new column to replace the old one
ALTER TABLE profiles RENAME COLUMN role_new TO role;

-- Step 6: Drop the old enum type
DROP TYPE app_role;

-- Step 7: Rename the new enum to the original name
ALTER TYPE app_role_new RENAME TO app_role;

-- Step 8: Drop the duplicate public_profiles view since it's redundant
DROP VIEW IF EXISTS public_profiles CASCADE;

-- Step 9: Update the analytics_profiles view to use the main table directly
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

-- Step 10: Grant permissions on the updated analytics view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Step 11: Add comment explaining the new role system
COMMENT ON COLUMN profiles.role IS 'User role - owner for business users, admin for administrators';
COMMENT ON TABLE profiles IS 'User profiles - owner for business users, admin for administrators';

-- Step 12: Ensure admin users have correct roles
UPDATE profiles SET role = 'admin' WHERE id IN (SELECT owner_user_id FROM admin_users WHERE role = 'admin');

-- Verification queries:
-- Check current role distribution
SELECT role, COUNT(*) FROM profiles GROUP BY role ORDER BY role DESC;

-- Check that admin_users still have proper roles  
SELECT p.id, p.role, au.owner_user_id FROM profiles p 
LEFT JOIN admin_users au ON p.id = au.owner_user_id 
WHERE au.owner_user_id IS NOT NULL;

-- Check that public_profiles view is gone
SELECT table_name FROM information_schema.views WHERE table_name = 'public_profiles';

-- Check the new enum type
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role');
