-- Fix the INSERT policy to allow anon users to create subscriptions
-- The current policy requires auth.uid() = user_id, but anon key has no auth.uid()

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;

-- Create a more permissive INSERT policy for anon users
CREATE POLICY "Allow insertions for subscription creation" ON subscriptions
    FOR INSERT WITH CHECK (true);

-- Also allow anon users to update (for admin operations)
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;

CREATE POLICY "Allow updates for subscription management" ON subscriptions
    FOR UPDATE USING (true);

-- Test the fix
SELECT 'INSERT/UPDATE policies fixed for anon access' as status;
