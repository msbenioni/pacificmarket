-- =====================================================
-- Update subscriptions.plan_type enum to use correct Pacific Market tiers
-- =====================================================

-- Step 1: Drop the existing constraint
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Step 2: Update existing data to use correct tier names
UPDATE subscriptions 
SET plan_type = CASE 
    WHEN plan_type = 'featured_plus' THEN 'vaka'
    WHEN plan_type = 'featured' THEN 'mana'
    WHEN plan_type = 'verified' THEN 'basic'
    ELSE plan_type
END
WHERE plan_type IN ('featured_plus', 'featured', 'verified');

-- Step 3: Add the new constraint with correct Pacific Market tiers
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('basic', 'mana', 'vaka', 'moana'));

-- Step 4: Verify the update
SELECT 
    plan_type,
    COUNT(*) as count
FROM subscriptions 
GROUP BY plan_type 
ORDER BY plan_type;
