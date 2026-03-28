-- Add created_via field to track business creation origin
ALTER TABLE businesses 
ADD COLUMN created_via TEXT DEFAULT 'admin';

-- Add created_via to claim_requests as well for consistency
ALTER TABLE claim_requests 
ADD COLUMN created_via TEXT DEFAULT 'admin';

-- Create indexes for performance
CREATE INDEX idx_businesses_created_via ON businesses(created_via);
CREATE INDEX idx_claim_requests_created_via ON claim_requests(created_via);

-- Update existing records to have proper created_via values
-- This assumes existing records were admin-created
UPDATE businesses SET created_via = 'admin' WHERE created_via IS NULL;
UPDATE claim_requests SET created_via = 'admin' WHERE created_via IS NULL;
