-- Simple Role Fix - Just Update Data, Keep Enum Structure
-- This is the safest approach that avoids enum changes entirely

-- Step 1: Update all existing profiles to have NULL role for non-admins
-- This converts 'buyer' and 'seller' roles to NULL
UPDATE profiles 
SET role = NULL 
WHERE role IN ('buyer', 'seller');

-- Step 2: Drop the duplicate public_profiles view since it's redundant
DROP VIEW IF EXISTS public_profiles CASCADE;

-- Step 3: Update the analytics_profiles view to use the main table directly
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

-- Step 4: Grant permissions on the updated analytics view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Step 5: Add comment explaining the role system
COMMENT ON COLUMN profiles.role IS 'User role - NULL for regular users, admin only for administrators (buyer/seller roles deprecated)';
COMMENT ON TABLE profiles IS 'User profiles - role is NULL for regular users, admin only for administrators';

-- Step 6: Ensure admin users have correct roles
UPDATE profiles SET role = 'admin' WHERE id IN (SELECT owner_user_id FROM admin_users WHERE role = 'admin');

-- Verification queries:
-- Check current role distribution
SELECT role, COUNT(*) FROM profiles GROUP BY role ORDER BY role DESC NULLS LAST;

-- Check that admin_users still have proper roles  
SELECT p.id, p.role, au.owner_user_id FROM profiles p 
LEFT JOIN admin_users au ON p.id = au.owner_user_id 
WHERE au.owner_user_id IS NOT NULL;

-- Check that public_profiles view is gone
SELECT table_name FROM information_schema.views WHERE table_name = 'public_profiles';
