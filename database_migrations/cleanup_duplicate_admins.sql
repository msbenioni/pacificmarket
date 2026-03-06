-- Clean up duplicate admin users for the test user ID
-- Keep only the most recent admin record

-- Show all admin records for this user first
SELECT id, owner_user_id, role, created_at FROM public.admin_users 
WHERE owner_user_id = 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4' 
ORDER BY created_at;

-- Delete all but the most recent admin record
DELETE FROM public.admin_users 
WHERE owner_user_id = 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4'
AND id NOT IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
    FROM public.admin_users 
    WHERE owner_user_id = 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4'
  ) ranked 
  WHERE rn = 1
);

-- Verify only one record remains
SELECT id, owner_user_id, role, created_at FROM public.admin_users 
WHERE owner_user_id = 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4';
