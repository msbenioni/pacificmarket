-- Add unique constraint to prevent duplicate recipient rows
-- This ensures campaigns can't be retried without creating duplicates

-- Add unique constraint on campaign_id + email
ALTER TABLE email_campaign_recipients 
ADD CONSTRAINT email_campaign_recipients_unique_campaign_email 
UNIQUE (campaign_id, email);

-- Create index for performance (helps with constraint enforcement)
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign_email 
ON email_campaign_recipients (campaign_id, email);

-- Add comment to table about the constraint
COMMENT ON TABLE email_campaign_recipients IS 'Contains unique constraint (campaign_id, email) to prevent duplicate recipient entries';
