-- COMPLETE EXECUTION PLAN
-- =====================================================

-- STEP 1: Rename column in original table
-- Run: rename_column_to_industry.sql

-- STEP 2: Clean up and recreate tables
-- Run: cleaned_business_insights_table.sql (if needed)
-- The founder_insights table should already be correct

-- STEP 3: Run the migration
-- Run: cleaned_final_migration.sql

-- STEP 4: Set up RLS policies
-- Run the RLS section from migration_split_insights_tables.sql

-- STEP 5: Verify results
SELECT 
    'Original Table' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN business_id IS NULL THEN 1 END) as founder_records,
    COUNT(CASE WHEN business_id IS NOT NULL THEN 1 END) as business_records
FROM business_insights_snapshots

UNION ALL

SELECT 
    'Founder Insights' as table_name,
    COUNT(*) as migrated_count,
    COUNT(DISTINCT user_id) as unique_users,
    0 as business_records
FROM founder_insights

UNION ALL

SELECT 
    'Business Insights' as table_name,
    COUNT(*) as migrated_count,
    0 as founder_records,
    COUNT(DISTINCT business_id) as unique_businesses
FROM business_insights;
