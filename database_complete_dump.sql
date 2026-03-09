-- COMPREHENSIVE DATABASE DUMP FOR PACIFIC MARKET
-- This script will dump the complete database structure including:
-- - All tables with columns, data types, and constraints
-- - All indexes (unique, primary key, foreign key)
-- - All RLS (Row Level Security) policies
-- - All triggers
-- - All functions
-- - Sample data from each table
-- This will help us compare the actual database with the codebase expectations

-- =====================================================
-- 1. TABLE STRUCTURES
-- =====================================================

-- Get all tables in the database
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;

-- =====================================================
-- 2. DETAILED TABLE SCHEMAS
-- =====================================================

-- Businesses table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns 
WHERE table_name = 'businesses' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Other key tables structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN (
        'profiles', 'auth.users', 'claim_requests', 
        'business_insights_snapshots', 'email_campaigns', 
        'email_campaign_recipients', 'email_queue'
    )
ORDER BY table_name, ordinal_position;

-- =====================================================
-- 3. CONSTRAINTS AND INDEXES
-- =====================================================

-- Primary keys
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    kcu.ordinal_position
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.ordinal_position;

-- Foreign keys
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints rc 
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Unique constraints
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.ordinal_position;

-- All indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 4. RLS (ROW LEVEL SECURITY) POLICIES
-- =====================================================

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

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

SELECT 
    event_object_schema,
    event_object_table,
    trigger_name,
    action_timing,
    action_condition,
    action_orientation,
    action_statement,
    action_reference_old_table,
    action_reference_new_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 6. FUNCTIONS
-- =====================================================

SELECT 
    routine_name,
    routine_type,
    routine_schema,
    data_type,
    external_name,
    external_language,
    security_type,
    sql_data_access,
    is_deterministic,
    created,
    last_altered
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- =====================================================
-- 7. SAMPLE DATA (First 3 rows from each table)
-- =====================================================

-- Sample businesses data
SELECT * FROM businesses LIMIT 3;

-- Sample profiles data  
SELECT * FROM profiles LIMIT 3;

-- Sample claim requests data
SELECT * FROM claim_requests LIMIT 3;

-- Sample business insights snapshots data
SELECT * FROM business_insights_snapshots LIMIT 3;

-- Sample email campaigns data
SELECT * FROM email_campaigns LIMIT 3;

-- Sample email campaign recipients data
SELECT * FROM email_campaign_recipients LIMIT 3;

-- Sample email queue data
SELECT * FROM email_queue LIMIT 3;

-- =====================================================
-- 8. ROW COUNTS FOR ALL TABLES
-- =====================================================

SELECT 
    schemaname,
    tablename,
    n_tup_ins AS row_count,
    n_tup_upd AS updated_count,
    n_tup_del AS deleted_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- 9. DATABASE VERSION AND INFO
-- =====================================================

SELECT version();

SELECT current_database(), current_schema(), current_user();

-- =====================================================
-- 10. ENUM TYPES (if any)
-- =====================================================

SELECT 
    t.typname AS enum_type,
    e.enumlabel AS enum_value,
    e.enumsort
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typtype = 'e'
ORDER BY t.typname, e.enumsort;

-- =====================================================
-- 11. SEQUENCES
-- =====================================================

SELECT 
    sequence_name,
    start_value,
    increment_by,
    max_value,
    min_value,
    cache_value,
    log_cnt,
    is_cycled,
    is_called
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;
