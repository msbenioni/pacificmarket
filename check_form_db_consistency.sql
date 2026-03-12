-- CHECK FORM-FIELD TO DB-COLUMN CONSISTENCY
-- =====================================================

-- STEP 1: Check what columns actually exist in each table
SELECT 
  'founder_insights' as table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'founder_insights' 
  AND table_schema = 'public'
ORDER BY ordinal_position

UNION ALL

SELECT 
  'business_insights' as table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
