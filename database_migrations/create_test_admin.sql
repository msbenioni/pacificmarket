-- Create a test admin user for the current user ID
-- Replace 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4' with the actual user ID from the error logs

INSERT INTO public.admin_users (
  owner_user_id, 
  role, 
  permissions,
  created_at,
  updated_at
) VALUES (
  'd5cf35f3-321d-4fb1-9a68-9e16cab473e4',
  'admin',
  ARRAY['read', 'write', 'delete'],
  NOW(),
  NOW()
);

-- Verify the admin user was created
SELECT id, owner_user_id, role, permissions FROM public.admin_users WHERE owner_user_id = 'd5cf35f3-321d-4fb1-9a68-9e16cab473e4';
