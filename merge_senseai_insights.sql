-- First, let's see what data we have across all SenseAI insights
SELECT 
    COUNT(*) as total_insights,
    MIN(submitted_date) as earliest_submission,
    MAX(submitted_date) as latest_submission,
    COUNT(CASE WHEN problem_solved IS NOT NULL AND problem_solved != '' THEN 1 END) as has_problem_solved,
    COUNT(CASE WHEN business_model IS NOT NULL AND business_model != '' THEN 1 END) as has_business_model,
    COUNT(CASE WHEN business_stage IS NOT NULL AND business_stage != '' AND business_stage != 'none' THEN 1 END) as has_business_stage,
    COUNT(CASE WHEN top_challenges IS NOT NULL THEN 1 END) as has_top_challenges,
    COUNT(CASE WHEN founder_motivation_array IS NOT NULL THEN 1 END) as has_motivation_array,
    COUNT(CASE WHEN gender IS NOT NULL AND gender != '' THEN 1 END) as has_gender,
    COUNT(CASE WHEN age_range IS NOT NULL AND age_range != '' THEN 1 END) as has_age_range,
    COUNT(CASE WHEN based_in_country IS NOT NULL AND based_in_country != '' THEN 1 END) as has_country,
    COUNT(CASE WHEN revenue_band IS NOT NULL AND revenue_band != '' THEN 1 END) as has_revenue
FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI');

-- Now create a consolidated single record with the most complete data
INSERT INTO business_insights_snapshots (
    business_id,
    user_id,
    snapshot_year,
    submitted_date,
    problem_solved,
    business_model,
    business_stage,
    top_challenges,
    founder_motivation_array,
    gender,
    age_range,
    based_in_country,
    revenue_band,
    years_entrepreneurial,
    entrepreneurial_background,
    businesses_founded,
    primary_industry,
    expansion_plans,
    collaboration_interest,
    mentorship_offering,
    angel_investor_interest,
    current_funding_source,
    created_date,
    updated_at
)
SELECT 
    business_id,
    user_id,
    snapshot_year,
    MAX(submitted_date) as submitted_date, -- Use latest submission date
    -- Use COALESCE to get the first non-null value across all records
    COALESCE(
        MAX(CASE WHEN problem_solved IS NOT NULL AND problem_solved != '' THEN problem_solved END),
        (SELECT problem_solved FROM business_insights_snapshots WHERE business_id = b.id AND problem_solved IS NOT NULL AND problem_solved != '' ORDER BY submitted_date DESC LIMIT 1)
    ) as problem_solved,
    COALESCE(
        MAX(CASE WHEN business_model IS NOT NULL AND business_model != '' THEN business_model END),
        (SELECT business_model FROM business_insights_snapshots WHERE business_id = b.id AND business_model IS NOT NULL AND business_model != '' ORDER BY submitted_date DESC LIMIT 1)
    ) as business_model,
    COALESCE(
        MAX(CASE WHEN business_stage IS NOT NULL AND business_stage != '' AND business_stage != 'none' THEN business_stage END),
        (SELECT business_stage FROM business_insights_snapshots WHERE business_id = b.id AND business_stage IS NOT NULL AND business_stage != '' AND business_stage != 'none' ORDER BY submitted_date DESC LIMIT 1)
    ) as business_stage,
    -- For arrays, use the most recent non-null array
    (SELECT top_challenges FROM business_insights_snapshots WHERE business_id = b.id AND top_challenges IS NOT NULL ORDER BY submitted_date DESC LIMIT 1) as top_challenges,
    (SELECT founder_motivation_array FROM business_insights_snapshots WHERE business_id = b.id AND founder_motivation_array IS NOT NULL ORDER BY submitted_date DESC LIMIT 1) as founder_motivation_array,
    (SELECT gender FROM business_insights_snapshots WHERE business_id = b.id AND gender IS NOT NULL AND gender != '' ORDER BY submitted_date DESC LIMIT 1) as gender,
    (SELECT age_range FROM business_insights_snapshots WHERE business_id = b.id AND age_range IS NOT NULL AND age_range != '' ORDER BY submitted_date DESC LIMIT 1) as age_range,
    (SELECT based_in_country FROM business_insights_snapshots WHERE business_id = b.id AND based_in_country IS NOT NULL AND based_in_country != '' ORDER BY submitted_date DESC LIMIT 1) as based_in_country,
    (SELECT revenue_band FROM business_insights_snapshots WHERE business_id = b.id AND revenue_band IS NOT NULL AND revenue_band != '' ORDER BY submitted_date DESC LIMIT 1) as revenue_band,
    (SELECT years_entrepreneurial FROM business_insights_snapshots WHERE business_id = b.id AND years_entrepreneurial IS NOT NULL AND years_entrepreneurial != '' ORDER BY submitted_date DESC LIMIT 1) as years_entrepreneurial,
    (SELECT entrepreneurial_background FROM business_insights_snapshots WHERE business_id = b.id AND entrepreneurial_background IS NOT NULL AND entrepreneurial_background != '' ORDER BY submitted_date DESC LIMIT 1) as entrepreneurial_background,
    (SELECT businesses_founded FROM business_insights_snapshots WHERE business_id = b.id AND businesses_founded IS NOT NULL AND businesses_founded != '' ORDER BY submitted_date DESC LIMIT 1) as businesses_founded,
    (SELECT primary_industry FROM business_insights_snapshots WHERE business_id = b.id AND primary_industry IS NOT NULL AND primary_industry != '' ORDER BY submitted_date DESC LIMIT 1) as primary_industry,
    (SELECT expansion_plans FROM business_insights_snapshots WHERE business_id = b.id ORDER BY submitted_date DESC LIMIT 1) as expansion_plans,
    (SELECT collaboration_interest FROM business_insights_snapshots WHERE business_id = b.id ORDER BY submitted_date DESC LIMIT 1) as collaboration_interest,
    (SELECT mentorship_offering FROM business_insights_snapshots WHERE business_id = b.id ORDER BY submitted_date DESC LIMIT 1) as mentorship_offering,
    (SELECT angel_investor_interest FROM business_insights_snapshots WHERE business_id = b.id AND angel_investor_interest IS NOT NULL ORDER BY submitted_date DESC LIMIT 1) as angel_investor_interest,
    (SELECT current_funding_source FROM business_insights_snapshots WHERE business_id = b.id AND current_funding_source IS NOT NULL AND current_funding_source != '' ORDER BY submitted_date DESC LIMIT 1) as current_funding_source,
    NOW() as created_date,
    NOW() as updated_at
FROM businesses b
WHERE b.name = 'SenseAI';

-- Delete the old 78 records
DELETE FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI')
  AND id != (SELECT id FROM business_insights_snapshots WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI') ORDER BY submitted_date DESC LIMIT 1);

-- Verify the result
SELECT COUNT(*) as remaining_senseai_insights 
FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI');
