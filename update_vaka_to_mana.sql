-- Update all existing 'vaka' subscription tiers to 'mana'
UPDATE businesses 
SET subscription_tier = 'mana' 
WHERE subscription_tier = 'vaka';

-- Verify the update
SELECT 
    subscription_tier, 
    COUNT(*) as count 
FROM businesses 
GROUP BY subscription_tier 
ORDER BY subscription_tier;

-- Also update any other tables that might have subscription tier data
-- Check for subscription_tier columns in other tables
SELECT 
    table_name, 
    column_name 
FROM information_schema.columns 
WHERE column_name = 'subscription_tier' 
    AND table_schema = 'public'
    AND table_name != 'businesses';
