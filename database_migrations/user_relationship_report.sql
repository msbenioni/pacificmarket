-- Comprehensive user relationship report for msbenioni@gmail.com

WITH auth_user AS (
  SELECT id as auth_id, email FROM auth.users WHERE email = 'msbenioni@gmail.com' LIMIT 1
),
all_relationships AS (
  SELECT 
    'AUTH_USER' as record_type,
    au.auth_id as id,
    au.email,
    NULL as role,
    NULL as owner_user_id,
    NULL as created_at
  FROM auth_user au
  
  UNION ALL
  
  SELECT 
    'PROFILE' as record_type,
    p.id,
    p.email,
    p.role::text as role,
    NULL as owner_user_id,
    p.created_at
  FROM public.profiles p
  WHERE p.email = 'msbenioni@gmail.com'
  
  UNION ALL
  
  SELECT 
    'ADMIN_USER' as record_type,
    au.id,
    NULL as email,
    au.role::text as role,
    au.owner_user_id,
    au.created_at
  FROM public.admin_users au
  WHERE au.owner_user_id = (SELECT auth_id FROM auth_user)
)

SELECT 
  record_type,
  id,
  email,
  role,
  owner_user_id,
  created_at
FROM all_relationships
ORDER BY 
  CASE record_type 
    WHEN 'AUTH_USER' THEN 1 
    WHEN 'PROFILE' THEN 2 
    WHEN 'ADMIN_USER' THEN 3 
  END;
