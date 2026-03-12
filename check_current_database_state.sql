-- Check current RLS policies on all tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
ORDER BY schemaname, tablename, policyname;

-- Check all tables and their RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check columns in business_insights_snapshots table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check triggers on business_insights_snapshots
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_condition,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'business_insights_snapshots'
ORDER BY trigger_name;

-- Check all constraints on business_insights_snapshots
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'business_insights_snapshots'
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;
