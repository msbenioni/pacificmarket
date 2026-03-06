-- Check current state of businesses
SELECT subscription_tier, COUNT(*) as count FROM businesses GROUP BY subscription_tier ORDER BY count DESC;

-- Show the actual business names by tier
SELECT subscription_tier, name FROM businesses ORDER BY subscription_tier, name;
