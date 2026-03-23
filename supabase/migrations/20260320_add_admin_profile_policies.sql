-- Migration: Add RLS policy for admin profile creation
-- Purpose: Allow admins to create new user profiles when adding admin users

-- Policy to allow admins to insert profiles
-- This enables the addAdminUser function in ProfileSettings.jsx to work properly
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    -- Allow service role (for system operations)
    auth.role() = 'service_role' OR 
    -- Allow existing admins to create new admin profiles
    (auth.uid() IS NOT NULL AND 
     EXISTS (
       SELECT 1 FROM public.profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role = 'admin'
     ))
  );

-- Also ensure admins can update profiles (needed for role assignment)
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND 
     EXISTS (
       SELECT 1 FROM public.profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role = 'admin'
     ))
  ) WITH CHECK (
    auth.role() = 'service_role' OR 
    (auth.uid() IS NOT NULL AND 
     EXISTS (
       SELECT 1 FROM public.profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role = 'admin'
     ))
  );

-- Allow admins to view all profiles (for admin management)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    -- Users can always view their own profile
    auth.uid() = id OR
    -- Admins can view all profiles
    (auth.uid() IS NOT NULL AND 
     EXISTS (
       SELECT 1 FROM public.profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role = 'admin'
     )) OR
    -- Service role has full access
    auth.role() = 'service_role'
  );

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
