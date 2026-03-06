-- Complete migration script that handles constraints
-- First, let's see the current constraint
SELECT conname, consrc FROM pg_constraint WHERE conrelid = 'businesses'::regclass AND contype = 'c';

-- Drop the old constraint
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_subscription_tier_check;

-- Add new constraint for the new tier system
ALTER TABLE businesses ADD CONSTRAINT businesses_subscription_tier_check 
CHECK (subscription_tier IN ('vaka', 'mana', 'moana'));

-- Now perform the tier updates
UPDATE businesses 
SET subscription_tier = 'vaka' 
WHERE subscription_tier = 'basic' OR subscription_tier = 'free';

UPDATE businesses 
SET subscription_tier = 'mana' 
WHERE subscription_tier = 'verified';

UPDATE businesses 
SET subscription_tier = 'moana' 
WHERE subscription_tier = 'featured_plus';

-- Verify the results
SELECT 
    subscription_tier,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM businesses), 2) as percentage
FROM businesses 
GROUP BY subscription_tier 
ORDER BY 
    CASE subscription_tier
        WHEN 'vaka' THEN 1
        WHEN 'mana' THEN 2
        WHEN 'moana' THEN 3
        ELSE 4
    END;
