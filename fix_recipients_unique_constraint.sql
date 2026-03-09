-- Migration: Update email campaign recipients for better deduplication
-- Changes from unique(campaign_id, subscriber_id) to unique(campaign_id, email)

-- Drop the existing unique constraint
ALTER TABLE email_campaign_recipients DROP CONSTRAINT IF EXISTS email_campaign_recipients_campaign_id_subscriber_id_key;

-- Add new unique constraint on campaign_id and email
ALTER TABLE email_campaign_recipients 
ADD CONSTRAINT email_campaign_recipients_campaign_id_email_key 
UNIQUE(campaign_id, email);

-- Add comment explaining the change
COMMENT ON CONSTRAINT email_campaign_recipients_campaign_id_email_key ON email_campaign_recipients IS 'Prevents duplicate emails per campaign';
