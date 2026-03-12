-- CORRECTED STEP 3: Migrate existing data using ACTUAL existing columns
-- =====================================================

-- First, let's see what we're working with
SELECT COUNT(*) as total_records,
       COUNT(CASE WHEN business_id IS NULL THEN 1 END) as founder_records,
       COUNT(CASE WHEN business_id IS NOT NULL THEN 1 END) as business_records
FROM business_insights_snapshots;

-- Migrate founder insights (records without business_id)
INSERT INTO founder_insights (
    user_id,
    snapshot_year,
    submitted_date,
    gender,
    age_range,
    years_entrepreneurial,
    entrepreneurial_background,
    businesses_founded,
    family_entrepreneurial_background,
    founder_role,
    founder_story,
    founder_motivation_array,
    pacific_identity,
    based_in_country,
    based_in_city,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    mentorship_access,
    mentorship_offering,
    barriers_to_mentorship,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    open_to_future_contact,
    goals_details,
    goals_next_12_months_array,
    created_date,
    updated_at
)
SELECT 
    user_id,
    snapshot_year,
    submitted_date,
    gender,
    age_range,
    years_entrepreneurial,
    entrepreneurial_background,
    businesses_founded,
    family_entrepreneurial_background,
    founder_role,
    founder_story,
    founder_motivation_array,
    pacific_identity,
    based_in_country,
    based_in_city,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    mentorship_access,
    mentorship_offering,
    barriers_to_mentorship,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    open_to_future_contact,
    goals_details,
    goals_next_12_months_array,
    created_date,
    updated_at
FROM business_insights_snapshots 
WHERE business_id IS NULL;

-- Migrate business insights (records with business_id) - ONLY business-specific columns
INSERT INTO business_insights (
    business_id,
    snapshot_year,
    submitted_date,
    year_started,
    problem_solved,
    team_size_band,
    business_model,
    family_involvement,
    customer_region,
    sales_channels,
    import_export_status,
    import_countries,
    export_countries,
    business_stage,
    top_challenges,
    hiring_intentions,
    community_impact_areas,
    business_operating_status,
    business_age,
    business_registered,
    employs_anyone,
    employs_family_community,
    team_size,
    revenue_band,
    current_funding_source,
    funding_amount_needed,
    funding_purpose,
    investment_stage,
    revenue_streams,
    financial_challenges,
    investment_exploration,
    support_needed_next,
    current_support_sources,
    expansion_plans,
    industry,
    created_date,
    updated_at
)
SELECT 
    business_id,
    snapshot_year,
    submitted_date,
    year_started,
    problem_solved,
    team_size_band,
    business_model,
    family_involvement,
    customer_region,
    sales_channels,
    import_export_status,
    import_countries,
    export_countries,
    business_stage,
    top_challenges,
    hiring_intentions,
    community_impact_areas,
    business_operating_status,
    business_age,
    business_registered,
    employs_anyone,
    employs_family_community,
    team_size,
    revenue_band,
    current_funding_source,
    funding_amount_needed,
    funding_purpose,
    investment_stage,
    revenue_streams,
    financial_challenges,
    investment_exploration,
    support_needed_next,
    current_support_sources,
    expansion_plans,
    industry,
    created_date,
    updated_at
FROM business_insights_snapshots 
WHERE business_id IS NOT NULL;

-- Verify the migration
SELECT 
    'Founder Insights' as table_name,
    COUNT(*) as migrated_count,
    COUNT(DISTINCT user_id) as unique_users
FROM founder_insights

UNION ALL

SELECT 
    'Business Insights' as table_name,
    COUNT(*) as migrated_count,
    COUNT(DISTINCT business_id) as unique_businesses
FROM business_insights;
