-- Add unique constraint with normalized email for recipient rows
-- This prevents duplicate recipient records across retries and race conditions

-- Create unique index on campaign_id + normalized email
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign_email 
ON email_campaign_recipients (campaign_id, lower(email));

-- Add comment for documentation
COMMENT ON INDEX idx_email_campaign_recipients_campaign_email IS 'Prevents duplicate recipient entries for the same campaign (case-insensitive email matching)';

-- This ensures:
-- 1. No duplicate emails per campaign
-- 2. Case-insensitive email matching (john@example.com = John@example.com)
-- 3. Database-level enforcement (application-level protection alone is insufficient)
-- 4. Efficient lookup for both uniqueness checks and queries
