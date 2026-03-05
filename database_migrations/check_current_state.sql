-- Database State Diagnostic Script
-- Run this first to understand what currently exists

-- Check what tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%profile%'
ORDER BY table_name;

-- Check what views exist
SELECT table_name, view_definition 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE '%profile%'
ORDER BY table_name;

-- Check the current enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')
ORDER BY enumlabel;

-- Check current role distribution in profiles table
SELECT role, COUNT(*) as count 
FROM profiles 
GROUP BY role 
ORDER BY count DESC;

-- Check if there are any rows in public_profiles (if it exists)
-- This will fail if the view doesn't exist, but that's ok
-- SELECT COUNT(*) as public_profiles_count FROM public_profiles;

-- Check column info for profiles table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies that reference profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' 
OR qual LIKE '%profiles%'
ORDER BY tablename, policyname;
