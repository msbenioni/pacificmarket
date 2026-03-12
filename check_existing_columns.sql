-- First, let's see what columns actually exist in the original table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Let's also check what we created in the new tables
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
