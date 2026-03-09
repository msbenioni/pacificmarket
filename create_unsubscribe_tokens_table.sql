-- Migration: Create unsubscribe tokens table for token-based unsubscribe links
-- This enables secure, privacy-focused unsubscribe links

CREATE TABLE IF NOT EXISTS email_unsubscribe_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for unsubscribe tokens table
ALTER TABLE email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_unsubscribe_tokens
DROP POLICY IF EXISTS "Admins full access to email_unsubscribe_tokens" ON email_unsubscribe_tokens;

CREATE POLICY "Admins full access to email_unsubscribe_tokens" ON email_unsubscribe_tokens
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_unsubscribe_tokens_token ON email_unsubscribe_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_unsubscribe_tokens_email ON email_unsubscribe_tokens(email);
CREATE INDEX IF NOT EXISTS idx_email_unsubscribe_tokens_expires_at ON email_unsubscribe_tokens(expires_at);

-- Add comments
COMMENT ON TABLE email_unsubscribe_tokens IS 'Secure tokens for email unsubscribe links';
COMMENT ON COLUMN email_unsubscribe_tokens.token IS 'Secure random token for unsubscribe verification';
COMMENT ON COLUMN email_unsubscribe_tokens.expires_at IS 'Token expiration time (30 days default)';
COMMENT ON COLUMN email_unsubscribe_tokens.used_at IS 'When the token was used for unsubscribe';

-- Clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_unsubscribe_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_unsubscribe_tokens 
    WHERE expires_at < NOW() - INTERVAL '7 days';
    
    -- Get count of deleted rows
    SELECT COUNT(*) INTO deleted_count FROM email_unsubscribe_tokens;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
