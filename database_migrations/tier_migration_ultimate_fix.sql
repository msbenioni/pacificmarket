-- Ultimate corrected migration
-- Current: 33 'mana' should stay 'mana', 3 'vaka' should be 'moana'

-- First, let's see current state
SELECT 
    subscription_tier,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY name) as sample_names
FROM businesses 
GROUP BY subscription_tier 
ORDER BY count DESC;

-- Correct the mapping:
-- 33 businesses currently 'mana' -> should stay 'mana' (verified tier)
-- 3 businesses currently 'vaka' -> should be 'moana' (premium tier)

UPDATE businesses 
SET subscription_tier = 'moana' 
WHERE subscription_tier = 'vaka';

-- Keep the 33 mana businesses as they are (verified tier)

-- Verify the final correct results
SELECT 
    subscription_tier,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM businesses), 2) as percentage,
    STRING_AGG(name, ', ' ORDER BY name) as sample_names
FROM businesses 
GROUP BY subscription_tier 
ORDER BY 
    CASE subscription_tier
        WHEN 'vaka' THEN 1
        WHEN 'mana' THEN 2
        WHEN 'moana' THEN 3
        ELSE 4
    END;
