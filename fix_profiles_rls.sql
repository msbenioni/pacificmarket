-- Migration: Ensure proper RLS policies for profiles table
-- This ensures users can read their own profile and admins can read all profiles

-- Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create RLS policies for profiles table

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (
        auth.uid() = id
    );

-- Policy 2: Admins can read all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (
        auth.uid() = id
    );

-- Policy 4: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy 5: Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id
    );

-- Policy 6: Admins can insert any profile
CREATE POLICY "Admins can insert any profile" ON profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Add comments for documentation
COMMENT ON POLICY "Users can view own profile" ON profiles IS 'Allows authenticated users to read their own profile data';
COMMENT ON POLICY "Admins can view all profiles" ON profiles IS 'Allows admin users to read all profiles for admin operations';
COMMENT ON POLICY "Users can update own profile" ON profiles IS 'Allows authenticated users to update their own profile data';
COMMENT ON POLICY "Admins can update all profiles" ON profiles IS 'Allows admin users to update any profile for admin operations';
COMMENT ON POLICY "Users can insert own profile" ON profiles IS 'Allows authenticated users to create their own profile during registration';
COMMENT ON POLICY "Admins can insert any profile" ON profiles IS 'Allows admin users to create any profile for admin operations';
