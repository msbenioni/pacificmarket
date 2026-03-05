-- Fix Role Enum and Remove Duplicate Views
-- This migration fixes the role system and removes unnecessary duplicate views

-- Step 1: Update existing profiles to remove buyer/seller roles
-- Set all non-admin roles to NULL
UPDATE profiles 
SET role = NULL 
WHERE role NOT IN ('admin');

-- Step 2: Create a new simplified role enum (only admin)
-- First, we need to drop the existing enum and recreate it
-- This requires dropping the column that uses it temporarily

-- Temporarily drop the role column
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- Drop the old enum
DROP TYPE IF EXISTS app_role;

-- Create new simplified enum (only admin)
CREATE TYPE app_role AS ENUM ('admin');

-- Add the role column back as NULLABLE first (to avoid constraint violations)
ALTER TABLE profiles ADD COLUMN role app_role DEFAULT NULL;

-- Step 3: Update existing rows to have NULL values (for non-admins)
-- This ensures all existing non-admin users have NULL role
UPDATE profiles 
SET role = NULL 
WHERE role IS NOT NULL AND role != 'admin';

-- Step 4: Restore admin roles
-- Set admin users back to admin role
UPDATE profiles SET role = 'admin' WHERE id IN (SELECT owner_user_id FROM admin_users WHERE role = 'admin');

-- Step 4: Drop the duplicate public_profiles view since it's redundant
-- The main profiles table already serves this purpose
DROP VIEW IF EXISTS public_profiles CASCADE;

-- Step 5: Update the analytics_profiles view to use the main table directly
-- Remove the redundant public_profiles view reference
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

-- Step 6: Grant permissions on the updated analytics view
GRANT SELECT ON analytics_profiles TO authenticated;

-- Step 7: Add comment explaining the role system
COMMENT ON COLUMN profiles.role IS 'User role - NULL for regular users, admin only for administrators';
COMMENT ON TABLE profiles IS 'User profiles - role is NULL for regular users, admin only for administrators';

-- Step 8: Update any application code that references the old role values
-- This would need to be done in the application codebase

-- Verification queries:
-- Check current role distribution
-- SELECT role, COUNT(*) FROM profiles GROUP BY role;

-- Check that admin_users still have proper roles
-- SELECT p.id, p.role, au.owner_user_id FROM profiles p 
-- LEFT JOIN admin_users au ON p.id = au.owner_user_id 
-- WHERE au.owner_user_id IS NOT NULL;
