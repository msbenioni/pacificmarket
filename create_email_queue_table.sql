-- Migration: Create email campaign queue table for background processing
-- This enables reliable email sending without request timeouts

CREATE TABLE IF NOT EXISTS email_campaign_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'queued', -- queued, processing, completed, failed
    priority VARCHAR(20) DEFAULT 'normal', -- high, normal, low
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3
);

-- Enable RLS for queue table
ALTER TABLE email_campaign_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_campaign_queue
DROP POLICY IF EXISTS "Admins full access to email_campaign_queue" ON email_campaign_queue;

CREATE POLICY "Admins full access to email_campaign_queue" ON email_campaign_queue
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_campaign_queue_status ON email_campaign_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_campaign_queue_priority ON email_campaign_queue(priority);
CREATE INDEX IF NOT EXISTS idx_email_campaign_queue_created_at ON email_campaign_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_email_campaign_queue_campaign_id ON email_campaign_queue(campaign_id);

-- Add comments
COMMENT ON TABLE email_campaign_queue IS 'Queue for processing email campaigns in background jobs';
COMMENT ON COLUMN email_campaign_queue.status IS 'Processing status: queued, processing, completed, failed';
COMMENT ON COLUMN email_campaign_queue.priority IS 'Processing priority: high, normal, low';
COMMENT ON COLUMN email_campaign_queue.retry_count IS 'Number of retry attempts made';
COMMENT ON COLUMN email_campaign_queue.max_retries IS 'Maximum number of retry attempts allowed';
