-- Check current business_insights schema
\d business_insights

-- Show sample data to see actual column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
ORDER BY ordinal_position;
