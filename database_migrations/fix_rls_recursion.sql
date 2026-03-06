-- Fix infinite recursion in admin_users RLS policies
-- The issue was policies were checking the same table they were securing

-- Drop all problematic policies
DROP POLICY IF EXISTS "admin_users_admin_manage" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_select_own" ON public.admin_users;

-- Create simpler, non-recursive policies for admin_users
CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT TO authenticated 
USING (owner_user_id = auth.uid());

-- Admin management should be handled by a different approach
-- For now, allow authenticated users to see their own admin records only

-- Also fix the business policies that might have similar issues
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can delete businesses" ON public.businesses;

-- Create simpler admin policies that don't cause recursion
CREATE POLICY "Admins can view all businesses" ON public.businesses FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to see their own businesses
);

CREATE POLICY "Admins can insert businesses" ON public.businesses FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to insert their own businesses
);

CREATE POLICY "Admins can update businesses" ON public.businesses FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to update their own businesses
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to update their own businesses
);

CREATE POLICY "Admins can delete businesses" ON public.businesses FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to delete their own businesses
);
