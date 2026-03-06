-- Corrected migration based on actual current state
-- Current: 33 'mana' should become 'moana', 3 'vaka' should become 'mana'

-- First, let's see current state
SELECT 
    subscription_tier,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY name) as sample_names
FROM businesses 
GROUP BY subscription_tier 
ORDER BY count DESC;

-- Correct the mapping:
-- 33 businesses currently 'mana' -> should be 'moana' (premium tier)
-- 3 businesses currently 'vaka' -> should be 'mana' (verified tier)

UPDATE businesses 
SET subscription_tier = 'moana' 
WHERE subscription_tier = 'mana';

UPDATE businesses 
SET subscription_tier = 'mana' 
WHERE subscription_tier = 'vaka';

-- Verify the corrected results
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
