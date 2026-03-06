-- Check current roles in profiles table and fix any invalid ones
SELECT role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role;

-- Update any non-owner profiles to be 'owner'
UPDATE public.profiles 
SET role = 'owner' 
WHERE role IS NULL OR role != 'owner';

-- Now add the constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = 'owner');

-- Verify the fix
SELECT role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role;
