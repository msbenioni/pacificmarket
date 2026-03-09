-- Verify billing migration results
SELECT 
    'Migration Summary' as metric,
    COUNT(*) as value
FROM subscriptions 
WHERE created_at >= NOW() - INTERVAL '1 hour';

-- Show migrated subscriptions
SELECT 
    s.id as subscription_id,
    s.business_id,
    b.name as business_name,
    s.user_id,
    s.plan_type,
    s.status,
    s.stripe_customer_id,
    s.created_at as subscription_created
FROM subscriptions s
JOIN businesses b ON s.business_id = b.id
WHERE s.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY s.created_at DESC;

-- Check businesses with billing data that should have been migrated
SELECT 
    b.id as business_id,
    b.name as business_name,
    b.subscription_tier,
    b.stripe_customer_id,
    CASE 
        WHEN s.id IS NOT NULL THEN 'Migrated'
        ELSE 'Not Migrated'
    END as migration_status
FROM businesses b
LEFT JOIN subscriptions s ON b.id = s.business_id
WHERE (
    b.subscription_tier IS NOT NULL 
    OR b.stripe_customer_id IS NOT NULL
)
AND b.owner_user_id IS NOT NULL
ORDER BY migration_status, b.name;
