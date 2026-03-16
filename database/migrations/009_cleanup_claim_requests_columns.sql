-- Database cleanup: Remove unused columns from claim_requests table
-- Based on actual usage analysis

-- Analysis of what's actually used:
-- USED: id, business_id, user_id, status, contact_email, contact_phone, role, proof_url, created_at, claim_type, message
-- UNUSED: verification_documents, rejection_reason, reviewed_by, reviewed_at, business_name, user_email, listing_contact_email, listing_contact_phone, updated_at

-- Step 1: Create backup of current table
CREATE TABLE claim_requests_backup_cleanup AS 
SELECT * FROM claim_requests;

-- Step 2: Remove unused columns
ALTER TABLE claim_requests 
DROP COLUMN IF EXISTS verification_documents,
DROP COLUMN IF EXISTS rejection_reason,
DROP COLUMN IF EXISTS reviewed_by,
DROP COLUMN IF EXISTS reviewed_at,
DROP COLUMN IF EXISTS business_name,
DROP COLUMN IF EXISTS user_email,
DROP COLUMN IF EXISTS listing_contact_email,
DROP COLUMN IF EXISTS listing_contact_phone,
DROP COLUMN IF EXISTS updated_at;

-- Step 3: Add useful columns that might be needed for approval workflow
ALTER TABLE claim_requests 
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Step 4: Set proper defaults and constraints
ALTER TABLE claim_requests 
ALTER COLUMN claim_type SET DEFAULT 'request',
ALTER COLUMN status SET DEFAULT 'pending';

-- Step 5: Update claim submission to use business name from businesses table when needed
-- (This will be handled in the application code)

-- Step 6: Verification - Show remaining columns
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'claim_requests' 
  AND table_schema = 'public'
ORDER BY column_name;

-- Step 7: Show sample data to verify cleanup worked
SELECT * FROM claim_requests LIMIT 1;
