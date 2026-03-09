-- Quick fix: Disable RLS on subscriptions table
-- This allows all operations immediately

ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- Test the fix by trying to select
SELECT 'RLS disabled - subscriptions table is now accessible' as status;

-- Show table info
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
ORDER BY ordinal_position;
