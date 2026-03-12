-- Rename primary_industry to industry in the original table
-- =====================================================

ALTER TABLE business_insights_snapshots 
RENAME COLUMN primary_industry TO industry;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND table_schema = 'public'
  AND column_name IN ('industry')
ORDER BY ordinal_position;
