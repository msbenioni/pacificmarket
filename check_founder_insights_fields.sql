-- Check what fields exist in founder_insights table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'founder_insights' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
