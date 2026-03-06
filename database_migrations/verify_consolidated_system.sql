-- Verify the consolidated system works correctly

-- 1. Check that admin_users table is gone
SELECT '=== TABLES IN DATABASE ===' as section;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%admin%' OR tablename LIKE '%profile%';

-- 2. Check your role in profiles table
SELECT '';
SELECT '=== YOUR PROFILE ===' as section;
SELECT id, email, role, display_name FROM public.profiles WHERE email = 'msbenioni@gmail.com';

-- 3. Show role distribution
SELECT '';
SELECT '=== ROLE DISTRIBUTION ===' as section;
SELECT role, COUNT(*) as count FROM public.profiles GROUP BY role ORDER BY role;

-- 4. Test authentication logic simulation
SELECT '';
SELECT '=== AUTHENTICATION SIMULATION ===' as section;
SELECT 
  'Your authentication will return:' as info,
  (SELECT role FROM public.profiles WHERE email = 'msbenioni@gmail.com' LIMIT 1) as your_role,
  CASE 
    WHEN (SELECT role FROM public.profiles WHERE email = 'msbenioni@gmail.com' LIMIT 1) = 'admin' 
    THEN 'Full admin access'
    WHEN (SELECT role FROM public.profiles WHERE email = 'msbenioni@gmail.com' LIMIT 1) = 'owner' 
    THEN 'Business owner access'
    ELSE 'No access'
  END as access_level;
