-- Simple database check script
-- Run this to verify current business_insights table structure

-- Check current columns in business_insights table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if table exists and has any data
SELECT 
    COUNT(*) as total_records,
    MIN(created_date) as earliest_record,
    MAX(created_date) as latest_record
FROM business_insights;

-- Show sample data (if any exists)
SELECT 
    business_id,
    user_id, 
    snapshot_year,
    business_stage,
    team_size_band,
    revenue_band,
    business_operating_status,
    created_date
FROM business_insights 
LIMIT 5;
