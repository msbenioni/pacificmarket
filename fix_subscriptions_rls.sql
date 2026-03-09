-- Fix RLS policies for subscriptions table
-- Currently RLS is enabled but no policies exist, blocking all access

-- Step 1: Enable RLS on subscriptions table (if not already enabled)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies (to start fresh)
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;

-- Step 3: Create policies for authenticated users
-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 4: Create policy for service role (admin access)
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Step 5: Create policy for anon users (read-only access to public info)
CREATE POLICY "Anonymous users can view basic subscription info" ON subscriptions
    FOR SELECT USING (true);

-- Step 6: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'subscriptions'
ORDER BY policyname;
