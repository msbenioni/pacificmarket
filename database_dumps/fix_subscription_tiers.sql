-- =====================================================
-- Fix subscription tiers to match Pacific Market structure
-- vaka = basic/free, mana = verified, moana = featured/featured_plus
-- =====================================================

-- Step 1: Drop the existing constraint
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Step 2: Update existing data to use correct tier mapping
UPDATE subscriptions 
SET plan_type = CASE 
    WHEN plan_type = 'featured_plus' THEN 'moana'
    WHEN plan_type = 'featured' THEN 'moana'
    WHEN plan_type = 'verified' THEN 'mana'
    WHEN plan_type = 'basic' THEN 'vaka'
    ELSE plan_type
END
WHERE plan_type IN ('featured_plus', 'featured', 'verified', 'basic');

-- Step 3: Add the new constraint with correct Pacific Market tiers
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('vaka', 'mana', 'moana'));

-- Step 4: Verify the update
SELECT 
    plan_type,
    COUNT(*) as count
FROM subscriptions 
GROUP BY plan_type 
ORDER BY plan_type;
