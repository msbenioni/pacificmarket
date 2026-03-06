-- Verify the final state for msbenioni@gmail.com
-- Both tables should now be correctly linked

-- Show your auth user ID
SELECT '=== YOUR AUTH USER ===' as section;
SELECT id, email, created_at FROM auth.users WHERE email = 'msbenioni@gmail.com';

-- Show your admin_users record (linked by user_id)
SELECT '';
SELECT '=== YOUR ADMIN RECORD ===' as section;
SELECT id, owner_user_id, role, permissions FROM public.admin_users 
WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1);

-- Show your profiles record (now linked by user_id)
SELECT '';
SELECT '=== YOUR PROFILE RECORD ===' as section;
SELECT id, email, role, display_name FROM public.profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1);

-- Show what authentication will return
SELECT '';
SELECT '=== AUTHENTICATION RESULT ===' as section;
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.admin_users WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1)) 
    THEN 'ADMIN (admin_users table takes precedence)'
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1))
    THEN 'OWNER (profiles table)'
    ELSE 'NO ROLE FOUND'
  END as expected_role;
