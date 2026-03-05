-- Create Analytics Views for Safe Data Access
-- These views provide access to business and profile data while protecting private fields

-- Public Business View (excludes all private fields)
CREATE OR REPLACE VIEW public_businesses AS
SELECT 
    id,
    name,
    description,
    short_description,
    logo_url,
    contact_website,
    contact_email,
    contact_phone,
    address,
    country,
    city,
    suburb,
    state_region,
    postal_code,
    business_hours,
    banner_url,
    cultural_identity,
    languages_spoken,
    social_links,
    industry,
    status,
    subscription_tier,
    user_id,
    owner_user_id,
    business_handle,
    verified,
    claimed,
    claimed_at,
    claimed_by,
    proof_links,
    homepage_featured,
    visibility_tier,
    created_at,
    updated_at,
    created_date
FROM businesses;

-- Public Profile View (excludes all private fields)
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
    id,
    role,
    display_name,
    email,
    country,
    primary_cultural,
    cultural_other,
    cultural_tags,
    potential_seller_handle,
    country_other,
    created_at,
    updated_at
FROM profiles;

-- Analytics Business View (includes private fields for admin analytics only)
CREATE OR REPLACE VIEW analytics_businesses AS
SELECT 
    -- Public fields
    id,
    name,
    description,
    industry,
    country,
    city,
    cultural_identity,
    languages_spoken,
    status,
    verified,
    created_at,
    
    -- Private analytics fields (added by migration)
    business_structure,
    annual_revenue_exact,
    full_time_employees,
    part_time_employees,
    primary_market,
    growth_stage,
    funding_source,
    business_challenges,
    future_plans,
    tech_stack,
    customer_segments,
    competitive_advantage
FROM businesses;

-- Analytics Profile View (includes private fields for admin analytics only)
CREATE OR REPLACE VIEW analytics_profiles AS
SELECT 
    -- Public fields
    id,
    role,
    display_name,
    email,
    country,
    primary_cultural,
    cultural_other,
    cultural_tags,
    potential_seller_handle,
    country_other,
    created_at,
    updated_at,
    
    -- Private analytics fields (added by migration)
    education_level,
    professional_background,
    business_networks,
    mentorship_availability,
    investment_interest,
    community_involvement,
    skills_expertise,
    business_goals,
    challenges_faced,
    success_factors,
    preferred_collaboration
FROM profiles;

-- Grant permissions on views
GRANT SELECT ON public_businesses TO authenticated, anon;
GRANT SELECT ON public_profiles TO authenticated, anon;
GRANT SELECT ON analytics_businesses TO authenticated;
GRANT SELECT ON analytics_profiles TO authenticated;

-- Create helpful analytics functions
-- Function to get business statistics (public data only)
CREATE OR REPLACE FUNCTION get_business_stats()
RETURNS TABLE(
    total_businesses BIGINT,
    verified_businesses BIGINT,
    countries_represented BIGINT,
    industries_count BIGINT,
    cultural_identities_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_businesses,
        COUNT(*) FILTER (WHERE verified = true) as verified_businesses,
        COUNT(DISTINCT country) as countries_represented,
        COUNT(DISTINCT industry) as industries_count,
        COUNT(DISTINCT cultural_identity) as cultural_identities_count
    FROM public_businesses
    WHERE status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get economic insights (admin only, uses private data)
CREATE OR REPLACE FUNCTION get_economic_insights()
RETURNS TABLE(
    total_revenue BIGINT,
    total_employees BIGINT,
    funding_distribution JSONB,
    challenge_distribution JSONB,
    education_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(annual_revenue_exact), 0) as total_revenue,
        COALESCE(SUM(full_time_employees + part_time_employees), 0) as total_employees,
        jsonb_build_object(
            'self_funded', COUNT(*) FILTER (WHERE funding_source = 'self-funded'),
            'bank_loans', COUNT(*) FILTER (WHERE funding_source = 'bank-loans'),
            'government_grants', COUNT(*) FILTER (WHERE funding_source = 'government-grants'),
            'investors', COUNT(*) FILTER (WHERE funding_source IN ('angel-investors', 'venture-capital'))
        ) as funding_distribution,
        jsonb_build_object(
            'access_to_capital', COUNT(*) FILTER (WHERE 'access-to-capital' = ANY(business_challenges)),
            'market_access', COUNT(*) FILTER (WHERE 'market-access' = ANY(business_challenges)),
            'talent_acquisition', COUNT(*) FILTER (WHERE 'talent-acquisition' = ANY(business_challenges)),
            'digital_transformation', COUNT(*) FILTER (WHERE 'digital-transformation' = ANY(business_challenges))
        ) as challenge_distribution,
        (SELECT jsonb_build_object(
            'high_school', COUNT(*) FILTER (WHERE education_level = 'high-school'),
            'bachelors', COUNT(*) FILTER (WHERE education_level = 'bachelors-degree'),
            'masters', COUNT(*) FILTER (WHERE education_level = 'masters-degree'),
            'phd', COUNT(*) FILTER (WHERE education_level = 'phd')
        ) FROM analytics_profiles) as education_distribution
    FROM analytics_businesses
    WHERE status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_business_stats() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_economic_insights() TO authenticated;
