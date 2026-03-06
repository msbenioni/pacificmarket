-- Final corrected migration
-- Current: 33 'moana' should be 'mana', 3 'vaka' should stay 'vaka'

-- First, let's see current state
SELECT 
    subscription_tier,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY name) as sample_names
FROM businesses 
GROUP BY subscription_tier 
ORDER BY count DESC;

-- Correct the mapping:
-- 33 businesses currently 'moana' -> should be 'mana' (verified tier)
-- 3 businesses currently 'vaka' -> should stay 'vaka' (basic tier)

UPDATE businesses 
SET subscription_tier = 'mana' 
WHERE subscription_tier = 'moana';

-- Keep the 3 vaka businesses as they are (basic tier)

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
