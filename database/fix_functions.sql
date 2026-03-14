-- Fix functions to use new field names after standardization

-- Fix get_public_insights_stats function
CREATE OR REPLACE FUNCTION get_public_insights_stats() 
RETURNS TABLE (
    total_businesses bigint, 
    vaka_count bigint, 
    mana_count bigint, 
    moana_count bigint, 
    verified_count bigint, 
    active_count bigint, 
    unique_industries bigint, 
    unique_countries bigint, 
    latest_month timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        count(*) AS total_businesses,
        count(*) FILTER (WHERE ((subscription_tier)::text = 'vaka'::text)) AS vaka_count,
        count(*) FILTER (WHERE ((subscription_tier)::text = 'mana'::text)) AS mana_count,
        count(*) FILTER (WHERE ((subscription_tier)::text = 'moana'::text)) AS moana_count,
        count(*) FILTER (WHERE (is_verified = true)) AS verified_count,
        count(*) FILTER (WHERE ((status)::text = 'active'::text)) AS active_count,
        count(DISTINCT industry) AS unique_industries,
        count(DISTINCT country) AS unique_countries,
        date_trunc('month'::text, max(created_at)) AS latest_month
    FROM businesses 
    WHERE (((status)::text = 'active'::text) AND (is_verified = true));
END;
$$ LANGUAGE plpgsql;

-- Fix get_business_stats function
CREATE OR REPLACE FUNCTION get_business_stats() 
RETURNS TABLE (
    total_businesses bigint,
    verified_businesses bigint,
    countries_represented bigint,
    industries_count bigint,
    cultural_identities_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_businesses,
        COUNT(*) FILTER (WHERE is_verified = true) as verified_businesses,
        COUNT(DISTINCT country) as countries_represented,
        COUNT(DISTINCT industry) as industries_count,
        COUNT(DISTINCT cultural_identity) as cultural_identities_count
    FROM businesses 
    WHERE status = 'active';
END;
$$ LANGUAGE plpgsql;
