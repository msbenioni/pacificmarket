-- STEP 3: Run the migration now that tables are ready
-- =====================================================

-- First, let's see what we're working with
SELECT COUNT(*) as total_records,
       COUNT(CASE WHEN business_id IS NULL THEN 1 END) as founder_records,
       COUNT(CASE WHEN business_id IS NOT NULL THEN 1 END) as business_records
FROM business_insights_snapshots;

-- This should show the data distribution before migration
