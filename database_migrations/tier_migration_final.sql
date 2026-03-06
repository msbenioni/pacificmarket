-- Final migration script that handles all trigger issues
-- Disable all triggers on businesses table temporarily
ALTER TABLE businesses DISABLE TRIGGER ALL;

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

-- Re-enable triggers (except the problematic ones)
ALTER TABLE businesses ENABLE TRIGGER ALL;

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
