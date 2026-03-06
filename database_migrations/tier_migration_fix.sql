-- Fix the constraint issue
-- Drop the old constraint (ignore if it doesn't exist)
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_subscription_tier_check;

-- Add new constraint that includes both old and new values for compatibility
ALTER TABLE businesses ADD CONSTRAINT businesses_subscription_tier_check 
CHECK (subscription_tier IN ('vaka', 'mana', 'moana', 'basic', 'verified', 'featured_plus', 'free'));

-- Now perform the remaining tier updates
UPDATE businesses 
SET subscription_tier = 'moana' 
WHERE subscription_tier = 'featured_plus';

-- Verify the final results
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
        WHEN 'basic' THEN 4
        WHEN 'verified' THEN 5
        WHEN 'featured_plus' THEN 6
        WHEN 'free' THEN 7
        ELSE 8
    END;

-- Show sample of updated records
SELECT name, subscription_tier FROM businesses LIMIT 5;
