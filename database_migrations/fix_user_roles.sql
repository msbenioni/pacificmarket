-- Fix user roles for msbenioni@gmail.com
-- Ensure admin_users has 'admin' and profiles has 'owner'

-- 1. Ensure admin_users record has correct role
UPDATE public.admin_users 
SET role = 'admin' 
WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1);

-- 2. Ensure profiles record has correct role  
UPDATE public.profiles 
SET role = 'owner' 
WHERE email = 'msbenioni@gmail.com';

-- 3. Show the final result
SELECT '=== FINAL ROLES ===' as section;
SELECT 
  'admin_users' as table_name, 
  role, 
  owner_user_id,
  CASE WHEN role = 'admin' THEN '✅ CORRECT' ELSE '❌ WRONG' END as status
FROM public.admin_users 
WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1)

UNION ALL

SELECT 
  'profiles' as table_name,
  role,
  NULL as owner_user_id,
  CASE WHEN role = 'owner' THEN '✅ CORRECT' ELSE '❌ WRONG' END as status
FROM public.profiles 
WHERE email = 'msbenioni@gmail.com';
