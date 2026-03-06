-- Migration: Update Tier System from Legacy to Vaka/Mana/Moana
-- This script updates existing business records to use the new Pacific-inspired tier system

-- Step 1: Update existing tier values to new system
UPDATE businesses 
SET subscription_tier = 'vaka' 
WHERE subscription_tier = 'basic' OR subscription_tier = 'free';

UPDATE businesses 
SET subscription_tier = 'mana' 
WHERE subscription_tier = 'verified';

UPDATE businesses 
SET subscription_tier = 'moana' 
WHERE subscription_tier = 'featured_plus';

-- Step 2: Verify the migration
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

-- Step 3: Update any Stripe subscription references if needed
-- Note: This assumes you have a stripe_subscriptions table
-- UPDATE stripe_subscriptions 
-- SET tier = 'vaka' 
-- WHERE tier = 'basic' OR tier = 'free';

-- UPDATE stripe_subscriptions 
-- SET tier = 'mana' 
-- WHERE tier = 'verified';

-- UPDATE stripe_subscriptions 
-- SET tier = 'moana' 
-- WHERE tier = 'featured_plus';

-- Step 4: Create a backup of old tier values (optional safety measure)
-- CREATE TABLE businesses_tier_backup AS
-- SELECT id, name, subscription_tier as old_tier, 'vaka' as new_tier
-- FROM businesses 
-- WHERE subscription_tier = 'basic' OR subscription_tier = 'free'
-- UNION ALL
-- SELECT id, name, subscription_tier as old_tier, 'mana' as new_tier
-- FROM businesses 
-- WHERE subscription_tier = 'verified'
-- UNION ALL
-- SELECT id, name, subscription_tier as old_tier, 'moana' as new_tier
-- FROM businesses 
-- WHERE subscription_tier = 'featured_plus';

-- Step 5: Add constraint to ensure only valid tier values (optional)
-- ALTER TABLE businesses 
-- ADD CONSTRAINT check_subscription_tier 
-- CHECK (subscription_tier IN ('vaka', 'mana', 'moana'));

-- Migration complete! 
-- New tier system:
-- - vaka (formerly basic/free)
-- - mana (formerly verified) 
-- - moana (formerly featured_plus)
