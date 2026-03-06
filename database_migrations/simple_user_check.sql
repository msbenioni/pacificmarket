-- Simple check for msbenioni@gmail.com user relationships

-- Show auth user ID
SELECT 'AUTH USER ID:' as info, id, email FROM auth.users WHERE email = 'msbenioni@gmail.com';

-- Show profiles linked to this user
SELECT 'PROFILE:' as info, id, email, role FROM public.profiles WHERE email = 'msbenioni@gmail.com';

-- Show admin_users linked to this user (by user ID)
SELECT 'ADMIN_USER:' as info, id, owner_user_id, role FROM public.admin_users WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1);

-- Show what role the authentication system will return
SELECT 'EXPECTED AUTH RESULT:' as info, 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.admin_users WHERE owner_user_id = (SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1)) 
    THEN 'admin'
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'msbenioni@gmail.com')
    THEN 'owner'
    ELSE 'no_role_found'
  END as expected_role;
