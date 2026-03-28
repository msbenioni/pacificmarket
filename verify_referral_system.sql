-- Verify Referral System Installation
SELECT 'Referral System Verification' as status;

-- Check if referral columns exist in businesses table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public' 
AND column_name LIKE '%referral%'
ORDER BY column_name;

-- Check if referral rewards table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'business_referral_rewards' 
AND table_schema = 'public';

-- Check if referral functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%referral%'
ORDER BY routine_name;

-- Check if triggers exist
SELECT trigger_name, event_manipulation 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%referral%'
ORDER BY trigger_name;

-- Test basic referral eligibility function
SELECT 'Testing eligibility function with null ID' as test;
SELECT public.is_business_referral_reward_eligible(NULL::uuid) as eligibility_test;

-- Show current businesses with referrals (if any)
SELECT 
    business_name,
    referred_by_business_id,
    referral_reward_applied,
    status,
    subscription_tier,
    tier_expires_at
FROM public.businesses 
WHERE referred_by_business_id IS NOT NULL
LIMIT 5;
