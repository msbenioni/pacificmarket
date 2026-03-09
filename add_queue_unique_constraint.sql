-- Add database-level protection against duplicate queue entries
-- This prevents race conditions where two requests might pass the app-level check simultaneously

-- Step 1: Create a partial unique index that allows only one active queue record per campaign
-- This allows historical records (completed, failed, cancelled) but prevents duplicates of active ones

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_campaign_queue_active_campaign 
ON email_campaign_queue (campaign_id) 
WHERE status IN ('queued', 'processing');

-- Step 2: Add a check constraint to ensure status values are valid
-- Note: PostgreSQL doesn't support IF NOT EXISTS with ADD CONSTRAINT, so we check first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_email_campaign_queue_status'
    ) THEN
        ALTER TABLE email_campaign_queue 
        ADD CONSTRAINT chk_email_campaign_queue_status 
        CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled'));
    END IF;
END $$;

-- Step 3: Create a composite index for better query performance on queue operations
CREATE INDEX IF NOT EXISTS idx_email_campaign_queue_status_priority_created 
ON email_campaign_queue (status, priority DESC, created_at ASC);

-- Step 4: Add comments for documentation
COMMENT ON INDEX idx_email_campaign_queue_active_campaign IS 'Prevents duplicate active queue entries per campaign (race condition protection)';
COMMENT ON INDEX idx_email_campaign_queue_status_priority_created IS 'Optimizes queue processing queries by status, priority, and creation time';
