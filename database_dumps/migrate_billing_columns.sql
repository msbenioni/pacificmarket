-- =====================================================
-- Migrate Billing Columns from businesses to subscriptions
-- =====================================================

-- Step 1: Check current state of billing columns in businesses
SELECT 
    id, name, owner_user_id,
    subscription_tier, 
    stripe_customer_id,
    created_at,
    updated_at
FROM businesses 
WHERE subscription_tier IS NOT NULL 
   OR stripe_customer_id IS NOT NULL;

-- Step 2: Create subscription records from existing businesses billing data
INSERT INTO subscriptions (
    business_id,
    user_id,
    stripe_subscription_id,
    stripe_customer_id,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    created_at,
    updated_at
)
SELECT 
    b.id as business_id,
    b.owner_user_id as user_id,
    NULL as stripe_subscription_id, -- Will be populated when Stripe webhooks run
    b.stripe_customer_id,
    COALESCE(
        CASE 
            WHEN b.subscription_tier = 'vaka' THEN 'vaka'
            WHEN b.subscription_tier = 'mana' THEN 'mana'
            WHEN b.subscription_tier = 'moana' THEN 'moana'
            ELSE 'vaka' -- Default to vaka (basic/free)
        END, 
        'vaka'
    ) as plan_type,
    'active' as status, -- Default to active for existing paid tiers
    b.created_at as current_period_start,
    b.created_at + INTERVAL '1 month' as current_period_end, -- Default 1 month
    false as cancel_at_period_end,
    b.created_at,
    b.updated_at
FROM businesses b
WHERE (
    b.subscription_tier IS NOT NULL 
    OR b.stripe_customer_id IS NOT NULL
)
AND b.owner_user_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.business_id = b.id
);

-- Step 3: Verify the migration
SELECT 
    s.id as subscription_id,
    s.business_id,
    b.name as business_name,
    s.user_id,
    s.plan_type,
    s.status,
    s.stripe_customer_id,
    s.current_period_start,
    s.current_period_end,
    s.created_at
FROM subscriptions s
JOIN businesses b ON s.business_id = b.id
ORDER BY s.created_at DESC;

-- Step 4: Check for any businesses that still have billing data but no subscription
SELECT 
    b.id,
    b.name,
    b.subscription_tier,
    b.stripe_customer_id
FROM businesses b
LEFT JOIN subscriptions s ON b.id = s.business_id
WHERE (
    b.subscription_tier IS NOT NULL 
    OR b.stripe_customer_id IS NOT NULL
)
AND s.id IS NULL;

-- =====================================================
-- CLEANUP: Remove billing columns from businesses (RUN AFTER VERIFICATION)
-- =====================================================

-- Uncomment and run these AFTER verifying the migration worked correctly

-- Step 5: Remove billing columns from businesses table
-- ALTER TABLE businesses 
-- DROP COLUMN IF EXISTS subscription_tier,
-- DROP COLUMN IF EXISTS stripe_customer_id;

-- Step 6: Verify cleanup
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'businesses' 
-- AND table_schema = 'public'
-- ORDER BY ordinal_position;

-- =====================================================
-- BACKUP: Rollback script (if needed)
-- =====================================================

-- To rollback, you would need to:
-- 1. Add the columns back to businesses
-- 2. Copy data back from subscriptions
-- 3. Drop the subscription records

-- ALTER TABLE businesses ADD COLUMN subscription_tier TEXT;
-- ALTER TABLE businesses ADD COLUMN stripe_customer_id TEXT;

-- UPDATE businesses b
-- SET 
--     subscription_tier = s.plan_type,
--     stripe_customer_id = s.stripe_customer_id
-- FROM subscriptions s
-- WHERE b.id = s.business_id;
