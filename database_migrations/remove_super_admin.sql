-- Remove super_admin references from database policies and constraints
-- Simplify the role system to just 'admin' and 'owner'

-- Update admin_users constraint to only allow 'admin' role
ALTER TABLE public.admin_users 
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role = 'admin');

-- Update RLS policies to remove super_admin references
DROP POLICY IF EXISTS "admin_users_admin_manage" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_select_own" ON public.admin_users;

-- Create simplified admin policies (only admin role)
CREATE POLICY "admin_users_admin_manage" ON public.admin_users TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au2 
    WHERE au2.owner_user_id = auth.uid() 
    AND au2.role = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au2 
    WHERE au2.owner_user_id = auth.uid() 
    AND au2.role = 'admin'
  )
);

CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT TO authenticated 
USING (owner_user_id = auth.uid());

-- Update business policies to remove super_admin
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" ON public.businesses FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to see their own businesses
);

DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;
CREATE POLICY "Admins can insert businesses" ON public.businesses FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to insert their own businesses
);

DROP POLICY IF EXISTS "Admins can update businesses" ON public.businesses;
CREATE POLICY "Admins can update businesses" ON public.businesses FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to update their own businesses
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to update their own businesses
);

DROP POLICY IF EXISTS "Admins can delete businesses" ON public.businesses;
CREATE POLICY "Admins can delete businesses" ON public.businesses FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to delete their own businesses
);

-- Update any existing super_admin records to be admin
UPDATE public.admin_users 
SET role = 'admin' 
WHERE role = 'super_admin';

-- Verify the changes
SELECT role, COUNT(*) as count 
FROM public.admin_users 
GROUP BY role;
