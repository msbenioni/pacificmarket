-- Fix RLS policies for profiles table
-- Allow authenticated users to manage their own profiles

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profiles" ON profiles;

-- Create new policies that allow user-specific access

-- Allow authenticated users to read their own profile
CREATE POLICY "Allow users to read own profiles" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Allow users to insert own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Allow users to delete own profiles" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
