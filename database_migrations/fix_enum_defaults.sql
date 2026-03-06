-- Fix enum column default values
-- This handles the default value casting issues

-- Drop and recreate the enum columns with proper defaults
ALTER TABLE businesses ALTER COLUMN subscription_tier DROP DEFAULT;
ALTER TABLE businesses ALTER COLUMN status DROP DEFAULT;

-- Update existing data to ensure all values are valid
UPDATE businesses SET subscription_tier = 'basic' WHERE subscription_tier IS NULL OR subscription_tier = 'free';
UPDATE businesses SET status = 'pending' WHERE status IS NULL;

-- Set proper defaults
ALTER TABLE businesses ALTER COLUMN subscription_tier SET DEFAULT 'basic';
ALTER TABLE businesses ALTER COLUMN status SET DEFAULT 'pending';

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name IN ('subscription_tier', 'status')
ORDER BY column_name;
