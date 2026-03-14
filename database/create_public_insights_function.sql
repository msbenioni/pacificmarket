-- ================================================================
-- PUBLIC INSIGHTS FUNCTION
-- Provides aggregated, non-sensitive insights data for public viewing
-- ================================================================

-- Create function to get public insights statistics
CREATE OR REPLACE FUNCTION get_public_insights_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Get aggregated business statistics from public data only
    SELECT json_build_object(
        'totalBusinesses', COUNT(*),
        'topIndustries', (
            SELECT json_agg(
                json_build_object(
                    'industry', industry,
                    'count', industry_count
                )
            )
            FROM (
                SELECT 
                    industry,
                    COUNT(*) as industry_count
                FROM public_business_listings 
                WHERE status = 'active' AND verified = true
                GROUP BY industry
                ORDER BY industry_count DESC
                LIMIT 10
            ) top_industries
        ),
        'topCountries', (
            SELECT json_agg(
                json_build_object(
                    'country', country,
                    'count', country_count
                )
            )
            FROM (
                SELECT 
                    country,
                    COUNT(*) as country_count
                FROM public_business_listings 
                WHERE status = 'active' AND verified = true
                GROUP BY country
                ORDER BY country_count DESC
                LIMIT 10
            ) top_countries
        ),
        'subscriptionStats', (
            SELECT json_agg(
                json_build_object(
                    'tier', subscription_tier,
                    'count', tier_count
                )
            )
            FROM (
                SELECT 
                    subscription_tier,
                    COUNT(*) as tier_count
                FROM public_business_listings 
                WHERE status = 'active' AND verified = true
                GROUP BY subscription_tier
                ORDER BY tier_count DESC
            ) tier_stats
        ),
        'monthlyGrowth', (
            SELECT json_agg(
                json_build_object(
                    'month', to_char(created_at, 'YYYY-MM'),
                    'count', monthly_count
                )
            )
            FROM (
                SELECT 
                    date_trunc('month', created_at) as month,
                    to_char(created_at, 'YYYY-MM') as month_label,
                    COUNT(*) as monthly_count
                FROM public_business_listings 
                WHERE status = 'active' AND verified = true
                AND created_at >= date_trunc('month', NOW()) - interval '12 months'
                GROUP BY date_trunc('month', created_at), to_char(created_at, 'YYYY-MM')
                ORDER BY month DESC
            ) monthly_stats
        )
    ) INTO result
    FROM public_business_listings 
    WHERE status = 'active' AND verified = true;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant public access to the function
GRANT EXECUTE ON FUNCTION get_public_insights_stats() TO anon, authenticated;

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
FROM public_business_listings;

-- Grant public access to the statistics view
GRANT SELECT ON public_business_statistics TO anon, authenticated;

-- Create a view for public business directory
CREATE OR REPLACE VIEW public_business_directory AS
SELECT 
    id,
    name,
    business_handle,
    tagline,
    logo_url,
    industry,
    country,
    city,
    subscription_tier,
    verified,
    status,
    created_at,
    -- Owner information (public only)
    (SELECT full_name FROM profiles WHERE user_id = owner_user_id LIMIT 1) as owner_name,
    (SELECT avatar_url FROM profiles WHERE user_id = owner_user_id LIMIT 1) as owner_avatar
FROM businesses
WHERE status = 'active' 
  AND verified = true
  AND visibility_tier = 'public';

-- Grant public access to the directory view
GRANT SELECT ON public_business_directory TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=== Public Insights Setup Complete ===';
    RAISE NOTICE 'Function get_public_insights_stats() created';
    RAISE NOTICE 'View public_business_statistics created';
    RAISE NOTICE 'View public_business_directory created';
    RAISE NOTICE 'Public access granted to all public views';
    RAISE NOTICE '=== Setup Complete ===';
END $$;
