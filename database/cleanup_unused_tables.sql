-- ================================================================
-- CLEANUP UNUSED TABLES
-- Remove tables that are not used in Pacific Market
-- ================================================================

-- Drop unused tables with CASCADE to remove all dependencies
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS shop_analytics CASCADE;
DROP TABLE IF EXISTS feature_templates CASCADE;
DROP TABLE IF EXISTS pacific_places CASCADE;
DROP TABLE IF EXISTS product_services CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS email_campaign_recipients CASCADE;
DROP TABLE IF EXISTS email_campaign_queue CASCADE;
DROP TABLE IF EXISTS email_events CASCADE;
DROP TABLE IF EXISTS email_subscribers CASCADE;
DROP TABLE IF EXISTS email_subscriber_entities CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS email_unsubscribe_tokens CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS business_invoice_settings CASCADE;
DROP TABLE IF EXISTS business_signature_settings CASCADE;
DROP TABLE IF EXISTS business_insights_snapshots CASCADE;
DROP TABLE IF EXISTS claim_requests CASCADE;
DROP TABLE IF EXISTS contact_access_logs CASCADE;
DROP TABLE IF EXISTS admin_notification_settings CASCADE;

-- Drop unused views
DROP VIEW IF EXISTS analytics_businesses CASCADE;
DROP VIEW IF EXISTS v_business_subscription_status CASCADE;
DROP VIEW IF EXISTS v_owner_business_summary CASCADE;

-- Remove unused indexes that reference dropped tables
DROP INDEX IF EXISTS idx_referrals_referred;
DROP INDEX IF EXISTS idx_referrals_referrer;
DROP INDEX IF EXISTS idx_referrals_status;
DROP INDEX IF EXISTS referrals_pkey;
DROP INDEX IF EXISTS idx_referrals_referrer_business_id_referred_business_id_key;

DROP INDEX IF EXISTS idx_shop_analytics_admin_listing_date;
DROP INDEX IF EXISTS idx_shop_analytics_admin_listing_event;
DROP INDEX IF EXISTS idx_shop_analytics_created_at;
DROP INDEX IF EXISTS idx_shop_analytics_event_type;
DROP INDEX IF EXISTS idx_shop_analytics_seller_date;
DROP INDEX IF EXISTS idx_shop_analytics_seller_event;
DROP INDEX IF EXISTS idx_shop_analytics_seller_id;
DROP INDEX IF EXISTS idx_shop_analytics_session;
DROP INDEX IF EXISTS idx_shop_analytics_visitor;
DROP INDEX IF EXISTS shop_analytics_pkey;
DROP INDEX IF EXISTS idx_shop_analytics_seller_id_date_key;

DROP INDEX IF EXISTS idx_feature_templates_name_key;
DROP INDEX IF EXISTS feature_templates_pkey;

DROP INDEX IF EXISTS idx_pacific_places_country;
DROP INDEX IF EXISTS idx_pacific_places_region;
DROP INDEX IF EXISTS pacific_places_pkey;

DROP INDEX IF EXISTS idx_platform_settings_key;
DROP INDEX IF EXISTS platform_settings_key_key;
DROP INDEX IF EXISTS platform_settings_pkey;

DROP INDEX IF EXISTS product_services_pkey;

-- Remove unused indexes from profiles table
DROP INDEX IF EXISTS idx_profiles_education_level;
DROP INDEX IF EXISTS idx_profiles_gdpr_consent;
DROP INDEX IF EXISTS idx_profiles_investment_interest;
DROP INDEX IF EXISTS idx_profiles_mentorship_availability;
DROP INDEX IF EXISTS idx_profiles_pending_business_id;

-- Verify cleanup
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    RAISE NOTICE '=== Cleanup Verification ===';
    RAISE NOTICE 'Total tables remaining: %', table_count;
    RAISE NOTICE 'Unused tables removed successfully!';
    RAISE NOTICE 'Core tables should remain: profiles, businesses, business_insights, founder_insights, notifications';
END $$;

-- Show remaining tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
