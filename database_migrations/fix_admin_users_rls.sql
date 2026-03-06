-- Fix admin_users RLS policies to work with role-based authentication
-- Instead of checking JWT role claims, check the admin_users table directly

-- Drop existing policies
DROP POLICY IF EXISTS "admin_users_admin_manage" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_select_own" ON public.admin_users;

-- Create new policies that check admin_users table directly
CREATE POLICY "admin_users_admin_manage" ON public.admin_users TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au2 
    WHERE au2.owner_user_id = auth.uid() 
    AND au2.role IN ('admin', 'super_admin')
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au2 
    WHERE au2.owner_user_id = auth.uid() 
    AND au2.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT TO authenticated 
USING (owner_user_id = auth.uid());

-- Also fix other admin-related policies that were checking JWT role
-- These should check admin_users table instead

-- Update businesses policies
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" ON public.businesses FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
  )
);

DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;
CREATE POLICY "Admins can insert businesses" ON public.businesses FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can update businesses" ON public.businesses;
CREATE POLICY "Admins can update businesses" ON public.businesses FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid()
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can delete businesses" ON public.businesses;
CREATE POLICY "Admins can delete businesses" ON public.businesses FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.owner_user_id = auth.uid()
  )
);
