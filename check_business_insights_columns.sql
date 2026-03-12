-- Check what columns actually exist in business_insights table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in the original table for comparison
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND table_schema = 'public'
  AND column_name IN ('gender', 'age_range', 'years_entrepreneurial', 'founder_role', 'business_stage', 'industry')
ORDER BY column_name;
