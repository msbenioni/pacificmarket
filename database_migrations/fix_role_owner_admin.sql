-- Fix Role System - Change to Owner/Admin Only
-- This converts the enum to just 'owner' and 'admin' - much cleaner!

-- Step 1: Update all existing 'buyer' and 'seller' roles to 'owner'
-- This converts business users to the new 'owner' role
UPDATE profiles 
SET role = 'owner' 
WHERE role IN ('buyer', 'seller');

-- Step 2: Create the new simplified enum type
-- First rename the old enum to avoid conflicts
ALTER TYPE app_role RENAME TO app_role_old;

-- Step 3: Create new enum with only owner and admin
CREATE TYPE app_role AS ENUM ('owner', 'admin');

-- Step 4: Convert the column to use the new enum type
-- This works because all existing values are now 'owner' or 'admin'
ALTER TABLE profiles 
ALTER COLUMN role TYPE app_role 
USING role::text::app_role;

-- Step 5: Clean up the old enum type
DROP TYPE app_role_old;

-- Step 6: Drop the duplicate public_profiles view since it's redundant
DROP VIEW IF EXISTS public_profiles CASCADE;

-- Step 7: Update the analytics_profiles view to use the main table directly
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

-- Step 8: Grant permissions on the updated analytics view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Step 9: Add comment explaining the new role system
COMMENT ON COLUMN profiles.role IS 'User role - owner for business users, admin for administrators';
COMMENT ON TABLE profiles IS 'User profiles - owner for business users, admin for administrators';

-- Step 10: Ensure admin users have correct roles
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
