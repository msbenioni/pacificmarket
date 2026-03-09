-- Add provider_message_id column to email_campaign_recipients
-- This will store the Resend message ID for webhook integration

-- Add the column
ALTER TABLE email_campaign_recipients 
ADD COLUMN IF NOT EXISTS provider_message_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN email_campaign_recipients.provider_message_id IS 'Provider message ID (e.g., Resend) for webhook integration and event tracking';

-- Create index for better query performance on provider lookups
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_provider_message_id 
ON email_campaign_recipients (provider_message_id) 
WHERE provider_message_id IS NOT NULL;
