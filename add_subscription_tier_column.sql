-- Add subscription_tier column to businesses table
-- This column will store the Pacific Market subscription tier (vaka, mana, moana)

-- Step 1: Add the column
ALTER TABLE businesses 
ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'vaka';

-- Step 2: Add constraint for valid tier values
ALTER TABLE businesses 
ADD CONSTRAINT businesses_subscription_tier_check 
CHECK (subscription_tier IN ('vaka', 'mana', 'moana', 'basic'));

-- Step 3: Create index for performance
CREATE INDEX idx_businesses_subscription_tier ON businesses(subscription_tier);

-- Step 4: Verify the column was added
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name = 'subscription_tier';
