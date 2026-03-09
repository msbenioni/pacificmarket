-- CLEAN DATABASE DUMP FOR PACIFIC MARKET
-- Fixed version that works with PostgreSQL encoding and actual table names

-- 1. TABLE STRUCTURES
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 2. PRIMARY KEYS
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 3. FOREIGN KEYS
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. UNIQUE CONSTRAINTS
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 5. RLS POLICIES
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
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. SAMPLE DATA
SELECT 'businesses' as table_name, * FROM businesses LIMIT 2;
SELECT 'profiles' as table_name, * FROM profiles LIMIT 2;
SELECT 'claim_requests' as table_name, * FROM claim_requests LIMIT 2;
SELECT 'business_insights_snapshots' as table_name, * FROM business_insights_snapshots LIMIT 2;
SELECT 'email_campaigns' as table_name, * FROM email_campaigns LIMIT 2;
SELECT 'email_campaign_recipients' as table_name, * FROM email_campaign_recipients LIMIT 2;

-- 7. ROW COUNTS
SELECT 
    tablename,
    n_tup_ins AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;
