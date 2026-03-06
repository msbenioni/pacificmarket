-- Update msbenioni@gmail.com role from owner to admin in profiles table

-- Show current role
SELECT '=== CURRENT ROLE ===' as section;
SELECT email, role, display_name FROM public.profiles WHERE email = 'msbenioni@gmail.com';

-- Update role to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'msbenioni@gmail.com';

-- Show updated role
SELECT '';
SELECT '=== UPDATED ROLE ===' as section;
SELECT email, role, display_name FROM public.profiles WHERE email = 'msbenioni@gmail.com';

-- Verify the change
SELECT '';
SELECT '=== VERIFICATION ===' as section;
SELECT 
  'Your authentication will now return:' as info,
  role as new_role,
  CASE 
    WHEN role = 'admin' THEN '✅ Full admin access'
    ELSE '❌ Not admin'
  END as access_level
FROM public.profiles 
WHERE email = 'msbenioni@gmail.com';
