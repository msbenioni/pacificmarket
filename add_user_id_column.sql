-- Add user_id column to business_insights_snapshots table
-- This will allow linking general founder insights to users

ALTER TABLE business_insights_snapshots 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add comment for documentation
COMMENT ON COLUMN business_insights_snapshots.user_id IS 'UUID of the user who submitted the founder insights (for general surveys)';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_user_id ON business_insights_snapshots(user_id);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
    AND column_name = 'user_id';
