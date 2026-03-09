-- Add subscription_tier column to businesses table
-- This will store the actual Pacific Market subscription tier (vaka, mana, moana)

-- Step 1: Add the column
ALTER TABLE businesses 
ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'vaka';

-- Step 2: Add constraint for valid tier values
ALTER TABLE businesses 
ADD CONSTRAINT businesses_subscription_tier_check 
CHECK (subscription_tier IN ('vaka', 'mana', 'moana', 'basic'));

-- Step 3: Create index for performance
CREATE INDEX idx_businesses_subscription_tier ON businesses(subscription_tier);

-- Step 4: Update existing businesses to have subscription_tier based on visibility_tier
-- For now, set all to 'vaka' as default, you can update manually later
UPDATE businesses 
SET subscription_tier = 'vaka' 
WHERE subscription_tier IS NULL;

-- Step 5: Verify the column was added
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name = 'subscription_tier';

-- Step 6: Show sample data
SELECT 
    id, 
    name, 
    visibility_tier, 
    subscription_tier,
    created_at
FROM businesses 
LIMIT 5;
