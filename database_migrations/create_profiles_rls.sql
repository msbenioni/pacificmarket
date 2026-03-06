-- Create RLS policies using profiles table for role-based access
-- This replaces the old admin_users table policies

-- Enable RLS on businesses table if not already enabled
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create admin policies using profiles table
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" ON public.businesses FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to see their own businesses
);

DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;
CREATE POLICY "Admins can insert businesses" ON public.businesses FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to insert their own businesses
);

DROP POLICY IF EXISTS "Admins can update businesses" ON public.businesses;
CREATE POLICY "Admins can update businesses" ON public.businesses FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to update their own businesses
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to update their own businesses
);

DROP POLICY IF EXISTS "Admins can delete businesses" ON public.businesses;
CREATE POLICY "Admins can delete businesses" ON public.businesses FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
  OR owner_user_id = auth.uid() -- Also allow business owners to delete their own businesses
);

-- Verify the policies were created
SELECT '';
SELECT '=== CREATED POLICIES ===' as section;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'businesses' 
AND policyname LIKE 'Admins can%'
ORDER BY policyname;
