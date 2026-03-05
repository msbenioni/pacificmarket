-- Clean Up Deprecated Enum Values
-- Remove 'buyer' and 'seller' from the app_role enum now that they're converted to 'owner'

-- Step 1: Verify no profiles still use 'buyer' or 'seller' roles
-- This should return 0 rows if the previous migration worked
SELECT role, COUNT(*) 
FROM profiles 
WHERE role IN ('buyer', 'seller') 
GROUP BY role;

-- Step 2: Create a new clean enum with only 'owner' and 'admin'
CREATE TYPE app_role_clean AS ENUM ('owner', 'admin');

-- Step 3: Add a temporary column with the clean enum
ALTER TABLE profiles ADD COLUMN role_clean app_role_clean DEFAULT 'owner';

-- Step 4: Copy data from old role to new role
UPDATE profiles 
SET role_clean = CASE 
  WHEN role = 'owner' THEN 'owner'::app_role_clean
  WHEN role = 'admin' THEN 'admin'::app_role_clean
  ELSE 'owner'::app_role_clean
END;

-- Step 5: Drop the old role column (with CASCADE to handle dependencies)
ALTER TABLE profiles DROP COLUMN role CASCADE;

-- Step 6: Rename the new column to replace the old one
ALTER TABLE profiles RENAME COLUMN role_clean TO role;

-- Step 7: Drop the old enum type
DROP TYPE app_role;

-- Step 8: Rename the clean enum to the original name
ALTER TYPE app_role_clean RENAME TO app_role;

-- Step 9: Recreate the analytics_profiles view (it was dropped by CASCADE)
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

-- Step 10: Grant permissions on the recreated view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Step 11: Add comment explaining the clean role system
COMMENT ON COLUMN profiles.role IS 'User role - owner for business users, admin for administrators';
COMMENT ON TABLE profiles IS 'User profiles - owner for business users, admin for administrators';

-- Step 12: Ensure admin users have correct roles
UPDATE profiles SET role = 'admin' WHERE id IN (SELECT owner_user_id FROM admin_users WHERE role = 'admin');

-- Verification queries:
-- Check current role distribution (should only show owner and admin)
SELECT role, COUNT(*) FROM profiles GROUP BY role ORDER BY role DESC;

-- Check that admin_users still have proper roles  
SELECT p.id, p.role, au.owner_user_id FROM profiles p 
LEFT JOIN admin_users au ON p.id = au.owner_user_id 
WHERE au.owner_user_id IS NOT NULL;

-- Check the clean enum values (should only show owner and admin)
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role') ORDER BY enumlabel;

-- Check that analytics_profiles view exists
SELECT table_name FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'analytics_profiles';
