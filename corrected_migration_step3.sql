-- CORRECTED STEP 3: Migrate existing data (only using existing columns)
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
    businesses_founded,
    founder_role,
    founder_motivation_array,
    founder_story,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    mentorship_offering,
    open_to_future_contact,
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
    businesses_founded,
    founder_role,
    founder_motivation_array,
    founder_story,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    mentorship_offering,
    open_to_future_contact,
    created_date,
    updated_at
FROM business_insights_snapshots 
WHERE business_id IS NULL;

-- Migrate business insights (records with business_id) - ONLY using existing columns
INSERT INTO business_insights (
    business_id,
    snapshot_year,
    submitted_date,
    business_stage,
    business_model,
    problem_solved,
    primary_industry,
    current_funding_source,
    investment_stage,
    revenue_streams,
    financial_challenges,
    funding_amount_needed,
    funding_purpose,
    top_challenges,
    support_needed_next,
    expansion_plans,
    community_impact_areas,
    created_date,
    updated_at
)
SELECT 
    business_id,
    snapshot_year,
    submitted_date,
    business_stage,
    business_model,
    problem_solved,
    primary_industry,
    current_funding_source,
    investment_stage,
    revenue_streams,
    financial_challenges,
    funding_amount_needed,
    funding_purpose,
    top_challenges,
    support_needed_next,
    expansion_plans,
    community_impact_areas,
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
    COUNT(DISTINCT business_id) as unique_users
FROM business_insights;
