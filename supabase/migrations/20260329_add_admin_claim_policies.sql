-- Add RLS policies for admin claim and business management
-- Allows admin users to update claim_requests and businesses tables

-- First, ensure RLS is enabled on both tables
ALTER TABLE IF EXISTS public.claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.businesses ENABLE ROW LEVEL SECURITY;

-- Policy for admins to update claim_requests
CREATE POLICY "Admins can update claim_requests" ON public.claim_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to update businesses (for claim approval ownership transfer)
CREATE POLICY "Admins can update businesses" ON public.businesses
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to select claim_requests (if not already exists)
DROP POLICY IF EXISTS "Admins can view all claim_requests" ON public.claim_requests;
CREATE POLICY "Admins can view all claim_requests" ON public.claim_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to select businesses (if not already exists)
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" ON public.businesses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
