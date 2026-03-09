-- Quick fix: Disable RLS on subscriptions table to allow basic operations
-- This will allow the anon key to perform INSERT/UPDATE operations

ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    relname,
    rowsecurity 
FROM pg_stat_user_tables 
WHERE relname = 'subscriptions';
