-- Consolidate roles into profiles table and remove admin_users table
-- This simplifies the architecture by using only profiles table for role management

-- 1. First, migrate any admin_users records to profiles
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT owner_user_id FROM public.admin_users
);

-- 2. Show what was migrated
SELECT '=== MIGRATED ADMIN USERS ===' as section;
SELECT 
  p.id,
  p.email,
  p.role,
  'Migrated from admin_users' as source
FROM public.profiles p
WHERE p.id IN (SELECT owner_user_id FROM public.admin_users)
AND p.role = 'admin';

-- 3. Drop the redundant admin_users table
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 4. Update profiles constraint to allow both 'admin' and 'owner' roles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'owner'));

-- 5. Verify the final state
SELECT '';
SELECT '=== FINAL PROFILES ROLES ===' as section;
SELECT role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role
ORDER BY role;
