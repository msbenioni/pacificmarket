-- Update specific business IDs to Moana tier
UPDATE businesses 
SET subscription_tier = 'moana' 
WHERE id IN (
    '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb',
    'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c', 
    '669c26b2-ceec-498e-9e38-17329d6b05ec'
);

-- Verify the update
SELECT id, name, subscription_tier 
FROM businesses 
WHERE id IN (
    '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb',
    'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c', 
    '669c26b2-ceec-498e-9e38-17329d6b05ec'
);

-- Show final tier distribution
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
