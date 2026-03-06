-- Simple relationship check for msbenioni@gmail.com

-- 1. Get your auth user ID
SELECT '=== AUTH USER ===' as section;
SELECT id, email, created_at FROM auth.users WHERE email = 'msbenioni@gmail.com';

-- 2. Get your profile record (by email)
SELECT '';
SELECT '=== PROFILE RECORD ===' as section;
SELECT id, email, role, created_at FROM public.profiles WHERE email = 'msbenioni@gmail.com';

-- 3. Get your admin_users record (by linking to auth user ID)
SELECT '';
SELECT '=== ADMIN USER RECORD ===' as section;
SELECT id, owner_user_id, role, created_at FROM public.admin_users 
WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1);

-- 4. Show what the authentication will return
SELECT '';
SELECT '=== AUTHENTICATION RESULT ===' as section;
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.admin_users WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1)) 
    THEN 'ADMIN (from admin_users table)'
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'msbenioni@gmail.com')
    THEN 'OWNER (from profiles table)'
    ELSE 'NO ROLE FOUND'
  END as authentication_result;
