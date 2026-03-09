-- Add error_message column to email_campaign_recipients
-- This will store detailed error information for failed sends

-- Add the column
ALTER TABLE email_campaign_recipients 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add comment for documentation
COMMENT ON COLUMN email_campaign_recipients.error_message IS 'Detailed error message when email sending fails (for debugging and retry logic)';

-- Create index for better query performance on failed sends
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_status_error 
ON email_campaign_recipients (status) 
WHERE status = 'failed';
