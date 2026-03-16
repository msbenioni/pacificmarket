-- Quick fix: Add missing columns to claim_requests table
-- This adds the columns needed for the consolidated claims system

-- Step 1: Add claim_type column
ALTER TABLE claim_requests 
ADD COLUMN IF NOT EXISTS claim_type VARCHAR(20) DEFAULT 'request';

-- Step 2: Add listing_contact_email and listing_contact_phone columns (for claim submission)
ALTER TABLE claim_requests 
ADD COLUMN IF NOT EXISTS listing_contact_email TEXT,
ADD COLUMN IF NOT EXISTS listing_contact_phone TEXT;

-- Step 3: Add message column for claim details
ALTER TABLE claim_requests 
ADD COLUMN IF NOT EXISTS message TEXT;

-- Step 4: Update existing records to have claim_type
UPDATE claim_requests 
SET claim_type = 'request' 
WHERE claim_type IS NULL;

-- Step 5: Verification
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'claim_requests' 
  AND table_schema = 'public'
ORDER BY column_name;
