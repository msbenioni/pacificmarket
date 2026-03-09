-- =====================================================
-- Final Mapping Status Check
-- =====================================================

-- 1. Check if any businesses still have billing columns that need migration
SELECT 
    'Businesses with unmigrated billing data' as check_type,
    COUNT(*) as count
FROM businesses 
WHERE (
    subscription_tier IS NOT NULL 
    OR stripe_customer_id IS NOT NULL
)
AND owner_user_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.business_id = businesses.id
);

-- 2. Show any remaining businesses with billing data
SELECT 
    b.id,
    b.name,
    b.subscription_tier,
    b.stripe_customer_id,
    CASE 
        WHEN s.id IS NOT NULL THEN 'Has subscription'
        ELSE 'Missing subscription'
    END as status
FROM businesses b
LEFT JOIN subscriptions s ON b.id = s.business_id
WHERE (
    b.subscription_tier IS NOT NULL 
    OR b.stripe_customer_id IS NOT NULL
)
AND b.owner_user_id IS NOT NULL
ORDER BY status;

-- 3. Check subscription table health
SELECT 
    'Subscriptions by tier' as check_type,
    plan_type,
    COUNT(*) as count
FROM subscriptions 
GROUP BY plan_type 
ORDER BY plan_type;

-- 4. Check for any code references to old column names (would need manual code check)
-- This is a placeholder - actual code search would be done separately

-- 5. Verify views are working
SELECT 
    'Views created successfully' as check_type,
    COUNT(*) as view_count
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('v_owner_business_summary', 'v_latest_business_insights', 'v_business_subscription_status', 'v_business_admin_full');

-- 6. Summary of mapping completion
SELECT 
    'Mapping Status Summary' as check_type,
    CASE 
        WHEN (SELECT COUNT(*) FROM businesses WHERE subscription_tier IS NOT NULL AND owner_user_id IS NOT NULL) = 0 THEN 'No businesses with billing data'
        WHEN (SELECT COUNT(*) FROM businesses WHERE subscription_tier IS NOT NULL AND owner_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM subscriptions s WHERE s.business_id = businesses.id)) = 0 THEN 'All billing data migrated'
        ELSE 'Migration incomplete'
    END as businesses_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('v_owner_business_summary', 'v_latest_business_insights', 'v_business_subscription_status', 'v_business_admin_full')) = 4 THEN 'All views created'
        ELSE 'Views missing'
    END as views_status,
    CASE 
        WHEN (SELECT COUNT(DISTINCT plan_type) FROM subscriptions) <= 3 THEN 'Tiers normalized'
        ELSE 'Multiple tier systems'
    END as tiers_status;
