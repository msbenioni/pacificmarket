-- Remove the enum constraint and convert role to text
-- First, let's modify the profiles table to use text instead of enum

-- Create a backup of current data
CREATE TEMP TABLE profiles_backup AS SELECT * FROM public.profiles;

-- Drop the enum type constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Change the role column from enum to text
ALTER TABLE public.profiles ALTER COLUMN role TYPE text USING 'buyer'::text;

-- Update the function to use 'user' role (more generic)
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    'user'  -- Use 'user' as a generic role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END $$;

-- Update existing profiles to have 'user' role
UPDATE public.profiles SET role = 'user' WHERE role IN ('buyer', 'seller');

-- Drop the unused enum types
DROP TYPE IF EXISTS public.app_role;
