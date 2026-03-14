-- ================================================================
-- DATABASE VERIFICATION SCRIPT
-- ================================================================

-- Check if tables exist and count records
DO $$
DECLARE
    result RECORD;
BEGIN
    RAISE NOTICE '=== Pacific Market Database Verification ===';
    
    -- Check profiles
    BEGIN
        SELECT COUNT(*) as count INTO result FROM profiles;
        RAISE NOTICE '✅ Profiles: % records', result.count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Profiles: Table not found';
    END;
    
    -- Check businesses
    BEGIN
        SELECT COUNT(*) as count INTO result FROM businesses;
        RAISE NOTICE '✅ Businesses: % records', result.count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Businesses: Table not found';
    END;
    
    -- Check business_insights
    BEGIN
        SELECT COUNT(*) as count INTO result FROM business_insights;
        RAISE NOTICE '✅ Business Insights: % records', result.count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Business Insights: Table not found';
    END;
    
    -- Check founder_insights
    BEGIN
        SELECT COUNT(*) as count INTO result FROM founder_insights;
        RAISE NOTICE '✅ Founder Insights: % records', result.count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Founder Insights: Table not found';
    END;
    
    -- Check notifications
    BEGIN
        SELECT COUNT(*) as count INTO result FROM notifications;
        RAISE NOTICE '✅ Notifications: % records', result.count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Notifications: Table not found';
    END;
    
    RAISE NOTICE '=== Verification Complete ===';
END $$;

-- Sample data check
SELECT 
    'profiles' as table_name, 
    COUNT(*) as record_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_record
FROM profiles
UNION ALL
SELECT 
    'businesses' as table_name, 
    COUNT(*) as record_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_record
FROM businesses
UNION ALL
SELECT 
    'business_insights' as table_name, 
    COUNT(*) as record_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_record
FROM business_insights
UNION ALL
SELECT 
    'founder_insights' as table_name, 
    COUNT(*) as record_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_record
FROM founder_insights
WHERE table_name IS NOT NULL
ORDER BY table_name;

-- Check RLS policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
    schemaname, 
    tablename, 
    indexname, 
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
