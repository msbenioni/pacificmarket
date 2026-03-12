-- Check what the 2 business records actually are
SELECT 
    bi.id,
    bi.business_id,
    b.name as business_name,
    b.user_id,
    bi.snapshot_year,
    bi.submitted_date,
    bi.gender,
    bi.age_range,
    bi.years_entrepreneurial,
    bi.founder_role,
    bi.business_stage,
    bi.industry
FROM business_insights bi
JOIN businesses b ON bi.business_id = b.id
ORDER BY bi.submitted_date DESC;

-- Also check the original table structure
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT business_id) as unique_businesses,
    COUNT(DISTINCT user_id) as unique_users,
    MIN(submitted_date) as earliest,
    MAX(submitted_date) as latest
FROM business_insights_snapshots;
