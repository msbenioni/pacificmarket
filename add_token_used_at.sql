-- Add used_at field to unsubscribe tokens for better hygiene
-- This allows tracking when tokens have been used and prevents reuse

-- Add used_at column (nullable for backward compatibility)
ALTER TABLE email_unsubscribe_tokens 
ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN email_unsubscribe_tokens.used_at IS 'Timestamp when token was used for unsubscribe (null if unused)';

-- Create index for better query performance on used tokens
CREATE INDEX IF NOT EXISTS idx_email_unsubscribe_tokens_used_at 
ON email_unsubscribe_tokens (used_at) 
WHERE used_at IS NOT NULL;
