-- ================================================================
-- CHECK INSIGHTS TABLES STATUS
-- ================================================================

-- Check if insights tables exist
DO $$
DECLARE
    business_insights_exists BOOLEAN;
    founder_insights_exists BOOLEAN;
    business_count INTEGER;
    founder_count INTEGER;
BEGIN
    RAISE NOTICE '=== Insights Tables Status ===';
    
    -- Check business_insights table
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'business_insights'
    ) INTO business_insights_exists;
    
    -- Check founder_insights table
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'founder_insights'
    ) INTO founder_insights_exists;
    
    RAISE NOTICE 'business_insights table exists: %', business_insights_exists;
    RAISE NOTICE 'founder_insights table exists: %', founder_insights_exists;
    
    -- Count records if tables exist
    IF business_insights_exists THEN
        SELECT COUNT(*) INTO business_count FROM business_insights;
        RAISE NOTICE 'business_insights records: %', business_count;
    ELSE
        RAISE NOTICE 'business_insights records: N/A (table missing)';
    END IF;
    
    IF founder_insights_exists THEN
        SELECT COUNT(*) INTO founder_count FROM founder_insights;
        RAISE NOTICE 'founder_insights records: %', founder_count;
    ELSE
        RAISE NOTICE 'founder_insights records: N/A (table missing)';
    END IF;
    
    RAISE NOTICE '=== End Status Check ===';
END $$;

-- Show table structure if they exist
SELECT 
    'business_insights' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'business_insights'
ORDER BY ordinal_position

UNION ALL

SELECT 
    'founder_insights' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'founder_insights'
ORDER BY ordinal_position;

-- Check RLS policies on insights tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('business_insights', 'founder_insights')
ORDER BY tablename, policyname;

-- Sample data from insights tables (if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_insights') THEN
        RAISE NOTICE '=== Sample business_insights data ===';
        PERFORM dblink('host=localhost dbname=postgres user=postgres', 
            format('SELECT (business_id, snapshot_year, business_stage, revenue_band) FROM business_insights LIMIT 3'));
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founder_insights') THEN
        RAISE NOTICE '=== Sample founder_insights data ===';
        PERFORM dblink('host=localhost dbname=postgres user=postgres', 
            format('SELECT (user_id, snapshot_year, gender, age_range) FROM founder_insights LIMIT 3'));
    END IF;
END $$;
