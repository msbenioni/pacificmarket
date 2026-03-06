-- Fix all profile records to use correct user_id from auth.users
-- This ensures profiles.id matches auth.users.id for all users

-- Show how many profiles need fixing
SELECT '=== PROFILES NEEDING FIX ===' as section;
SELECT 
  COUNT(*) as profiles_to_fix,
  COUNT(CASE WHEN p.id != au.id THEN 1 END) as mismatched_ids
FROM public.profiles p
JOIN auth.users au ON p.email = au.email;

-- Fix all mismatched profile IDs
UPDATE public.profiles p
SET id = au.id
FROM auth.users au
WHERE p.email = au.email 
AND p.id != au.id;

-- Show the result
SELECT '';
SELECT '=== AFTER FIX ===' as section;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN p.id = au.id THEN 1 END) as correctly_linked
FROM public.profiles p
JOIN auth.users au ON p.email = au.email;
