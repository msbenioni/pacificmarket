-- Check why founder insights didn't migrate
SELECT COUNT(*) as total_records,
       COUNT(CASE WHEN business_id IS NULL THEN 1 END) as founder_records,
       COUNT(CASE WHEN business_id IS NOT NULL THEN 1 END) as business_records
FROM business_insights_snapshots;

-- Check what founder records actually exist
SELECT 
    user_id,
    snapshot_year,
    submitted_date,
    gender,
    age_range,
    years_entrepreneurial,
    founder_role
FROM business_insights_snapshots 
WHERE business_id IS NULL
LIMIT 5;

-- Check if there are any NULL business_id records at all
SELECT COUNT(*) as null_business_id_count
FROM business_insights_snapshots 
WHERE business_id IS NULL;
