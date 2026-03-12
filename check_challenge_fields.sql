-- Check what challenge-related fields exist in each table
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('founder_insights', 'business_insights')
  AND (column_name LIKE '%challenge%' OR column_name LIKE '%support%')
ORDER BY table_name, column_name;
