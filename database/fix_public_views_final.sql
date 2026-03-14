-- ================================================================
-- FIX PUBLIC VIEWS - FINAL VERSION
-- Use correct column names and structure
-- ================================================================

-- Drop and recreate views with correct references
DROP VIEW IF EXISTS public_business_directory CASCADE;
DROP VIEW IF EXISTS public_business_statistics CASCADE;

-- Create a view for public business statistics
CREATE OR REPLACE VIEW public_business_statistics AS
SELECT 
    COUNT(*) as total_businesses,
    COUNT(*) FILTER (WHERE subscription_tier = 'vaka') as vaka_count,
    COUNT(*) FILTER (WHERE subscription_tier = 'mana') as mana_count,
    COUNT(*) FILTER (WHERE subscription_tier = 'moana') as moana_count,
    COUNT(*) FILTER (WHERE verified = true) as verified_count,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(DISTINCT industry) as unique_industries,
    COUNT(DISTINCT country) as unique_countries,
    DATE_TRUNC('month', MAX(created_at)) as latest_month
FROM businesses
WHERE status = 'active' AND verified = true;

-- Grant public access to the statistics view
GRANT SELECT ON public_business_statistics TO anon, authenticated;

-- Create a simplified public business directory view
CREATE OR REPLACE VIEW public_business_directory AS
SELECT 
    b.id,
    b.name,
    b.business_handle,
    b.tagline,
    b.logo_url,
    b.industry,
    b.country,
    b.city,
    b.subscription_tier,
    b.verified,
    b.status,
    b.created_at,
    -- Basic owner info (avoid complex joins for now)
    b.owner_user_id
FROM businesses b
WHERE b.status = 'active' 
  AND b.verified = true
  AND b.visibility_tier = 'public';

-- Grant public access to the directory view
GRANT SELECT ON public_business_directory TO anon, authenticated;

-- Create a simple public insights summary view
CREATE OR REPLACE VIEW public_insights_summary AS
SELECT 
    'business_directory' as data_type,
    COUNT(*) as count,
    MAX(created_at) as latest_update
FROM public_business_directory
GROUP BY 'business_directory'

UNION ALL

SELECT 
    'business_statistics' as data_type,
    1 as count,
    NOW() as latest_update
FROM public_business_statistics

UNION ALL

SELECT 
    'insights_stats' as data_type,
    1 as count,
    NOW() as latest_update
WHERE EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_public_insights_stats');

-- Grant public access to the summary view
GRANT SELECT ON public_insights_summary TO anon, authenticated;

-- Test the function
SELECT get_public_insights_stats() as test_result;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=== Public Views Final Fix ===';
    RAISE NOTICE 'View public_business_statistics created';
    RAISE NOTICE 'View public_business_directory created (simplified)';
    RAISE NOTICE 'View public_insights_summary created';
    RAISE NOTICE 'Public access granted to all views';
    RAISE NOTICE 'Function get_public_insights_stats() tested';
    RAISE NOTICE '=== Final Fix Complete ===';
END $$;
