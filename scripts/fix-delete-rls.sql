-- Fix RLS policies for business deletion
-- Run this in your Supabase SQL Editor (Database > SQL Editor)

-- First, check if RLS is enabled on the businesses table
SELECT relrowsecurity FROM pg_class WHERE relname = 'businesses';

-- Check existing RLS policies on businesses table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'businesses' 
ORDER BY policyname;

-- Drop existing delete policies if they exist (optional)
DROP POLICY IF EXISTS "Users can delete own businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can delete any business" ON businesses;

-- Create RLS policy for business owners to delete their own businesses
CREATE POLICY "Users can delete own businesses" ON businesses
FOR DELETE USING (auth.uid() = owner_user_id);

-- Create RLS policy for admins to delete any business
CREATE POLICY "Admins can delete any business" ON businesses
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'businesses' AND cmd = 'DELETE'
ORDER BY policyname;

-- Test the policy by checking if a specific business can be deleted
-- Replace the UUID below with an actual business ID from your database
SELECT 
  auth.uid() as user_id,
  owner_user_id,
  CASE 
    WHEN auth.uid() = owner_user_id THEN 'Can delete (owner)'
    WHEN EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    ) THEN 'Can delete (admin)'
    ELSE 'Cannot delete'
  END as delete_permission
FROM businesses 
WHERE id = 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c'::uuid  -- Example UUID - replace with actual business ID
LIMIT 1;
