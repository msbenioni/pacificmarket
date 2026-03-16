-- Comprehensive RLS policy fix for claim_requests table
-- This drops ALL possible existing policies first

DROP POLICY IF EXISTS "Users can view own claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Users can insert own claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Users can update own claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Users can delete own claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Allow users to insert own claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Allow users to update own claim_requests" ON claim_requests;
DROP POLICY IF EXISTS "Allow users to delete own claim_requests" ON claim_requests;

-- Now create the correct policies

-- Allow authenticated users to read all claim requests (for admin dashboard)
CREATE POLICY "Allow authenticated users to read claim_requests" ON claim_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to insert their own claim requests
CREATE POLICY "Allow users to insert own claim_requests" ON claim_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own claim requests
CREATE POLICY "Allow users to update own claim_requests" ON claim_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own claim requests
CREATE POLICY "Allow users to delete own claim_requests" ON claim_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;
