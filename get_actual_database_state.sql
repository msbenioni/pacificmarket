-- ACTUAL DATABASE DUMP USING SQL
-- Run this script via psql to get actual database state

-- Connect using: psql "postgresql://postgres:MontBlanc3001@db.mnmisprswpucojnbip.supabase.co:5432/postgres"

-- ====================================================================
-- TABLE STRUCTURE AND DATA
-- ====================================================================

-- Get all tables
SELECT 
    table_name,
    table_type,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Get table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Get row counts
SELECT 
    schemaname,
    tablename,
    n_tupins
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY n_tupins DESC;

-- Sample data from key tables
SELECT '=== BUSINES ===' as section, COUNT(*) as count FROM businesses
UNION ALL
SELECT '=== FOUNDER_INSIGHTS ===' as section, COUNT(*) as count FROM founder_insights
UNION ALL  
SELECT '=== BUSINESS_INSIGHTS ===' as section, COUNT(*) as count FROM business_insights;

-- Sample records (limit 5 each)
SELECT '--- BUSINES SAMPLE ---' as section, * FROM businesses ORDER BY created_at DESC LIMIT 5;
SELECT '--- FOUNDER_INSIGHTS SAMPLE ---' as section, * FROM founder_insights ORDER BY submitted_date DESC LIMIT 5;
SELECT '--- BUSINESS_INSIGHTS SAMPLE ---' as section, * FROM business_insights ORDER BY submitted_date DESC LIMIT 5;
