-- Fix profile records to be linked by user_id instead of email
-- This ensures profiles.id matches auth.users.id

-- 1. Get the auth user ID for msbenioni@gmail.com
-- 2. Update the profiles record to use the correct user_id

-- First, let's see what we have
SELECT '=== CURRENT STATE ===' as section;
SELECT 
  'AUTH USER' as table_name,
  id as auth_id, 
  email 
FROM auth.users 
WHERE email = 'msbenioni@gmail.com'

UNION ALL

SELECT 
  'PROFILE' as table_name,
  id as profile_id,
  email 
FROM public.profiles 
WHERE email = 'msbenioni@gmail.com';

-- Now fix the profile to use the correct user_id
UPDATE public.profiles 
SET id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1)
WHERE email = 'msbenioni@gmail.com';

-- Verify the fix
SELECT '';
SELECT '=== AFTER FIX ===' as section;
SELECT 
  'AUTH USER' as table_name,
  id as auth_id, 
  email 
FROM auth.users 
WHERE email = 'msbenioni@gmail.com'

UNION ALL

SELECT 
  'PROFILE' as table_name,
  id as profile_id,
  email,
  role
FROM public.profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1);
