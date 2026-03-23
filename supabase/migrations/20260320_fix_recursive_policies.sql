-- Fix infinite recursion in profiles RLS policies
-- The issue is that the admin policies are checking for admin status in the same table they're protecting

-- Drop all existing policies first
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create non-recursive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Service role has full access (for system operations)
CREATE POLICY "Service role full access profiles" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- For admin access, we'll use a different approach - check auth.jwt() instead of querying profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    auth.jwt() ->> 'role' = 'admin'
  ) WITH CHECK (
    auth.role() = 'service_role' OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
