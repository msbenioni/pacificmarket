-- Ensure profiles table only allows 'owner' role
-- Every user will have either 'admin' (in admin_users) or 'owner' (in profiles)

-- Add constraint to profiles table to only allow 'owner' role
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = 'owner');

-- Update any existing non-owner profiles to be 'owner'
UPDATE public.profiles 
SET role = 'owner' 
WHERE role IS NULL OR role != 'owner';

-- Verify the changes
SELECT role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role;

-- Also ensure admin_users table only allows 'admin' role (redundant but safe)
ALTER TABLE public.admin_users 
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role = 'admin');
