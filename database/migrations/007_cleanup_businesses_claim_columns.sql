-- Cleanup script: Remove redundant claim columns from businesses table
-- Run this AFTER the migration script has successfully migrated data

-- Step 1: Create a backup of the businesses table (safety measure)
CREATE TABLE businesses_backup_claim_columns AS 
SELECT * FROM businesses;

-- Step 2: Remove redundant claim-related columns from businesses table
-- Note: We keep owner_user_id as it's still useful for business ownership reference

ALTER TABLE businesses 
DROP COLUMN IF EXISTS is_claimed,
DROP COLUMN IF EXISTS claimed_at,
DROP COLUMN IF EXISTS claimed_by;

-- Step 3: Add index for better performance on owner_user_id
CREATE INDEX IF NOT EXISTS idx_businesses_owner_user_id ON businesses(owner_user_id);

-- Step 4: Verification queries
SELECT 
  'Businesses with owner_user_id (after cleanup)' as status,
  COUNT(*) as count
FROM businesses 
WHERE owner_user_id IS NOT NULL

UNION ALL

SELECT 
  'Total claim requests (should include migrated ones)' as status,
  COUNT(*) as count
FROM claim_requests

UNION ALL

SELECT 
  'Direct claim requests (migrated)' as status,
  COUNT(*) as count
FROM claim_requests 
WHERE claim_type = 'direct';
