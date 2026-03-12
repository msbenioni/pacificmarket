-- Now run the analysis safely (no empty strings to worry about)
SELECT 
    COUNT(*) as total_insights,
    MIN(submitted_date) as earliest_submission,
    MAX(submitted_date) as latest_submission,
    COUNT(CASE WHEN problem_solved IS NOT NULL AND problem_solved != '' THEN 1 END) as has_problem_solved,
    COUNT(CASE WHEN business_model IS NOT NULL AND business_model != '' THEN 1 END) as has_business_model,
    COUNT(CASE WHEN business_stage IS NOT NULL THEN 1 END) as has_business_stage,
    COUNT(CASE WHEN top_challenges IS NOT NULL THEN 1 END) as has_top_challenges,
    COUNT(CASE WHEN founder_motivation_array IS NOT NULL THEN 1 END) as has_motivation_array,
    COUNT(CASE WHEN gender IS NOT NULL AND gender != '' THEN 1 END) as has_gender,
    COUNT(CASE WHEN age_range IS NOT NULL AND age_range != '' THEN 1 END) as has_age_range,
    COUNT(CASE WHEN based_in_country IS NOT NULL AND based_in_country != '' THEN 1 END) as has_country,
    COUNT(CASE WHEN revenue_band IS NOT NULL AND revenue_band != '' THEN 1 END) as has_revenue
FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI');

-- Create a consolidated single record with the most complete data
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
    b.id as business_id,
    b.user_id,
    2026 as snapshot_year,
    i.submitted_date,
    i.problem_solved,
    i.business_model,
    i.business_stage,
    i.top_challenges,
    i.founder_motivation_array,
    i.gender,
    i.age_range,
    i.based_in_country,
    i.revenue_band,
    i.years_entrepreneurial,
    i.entrepreneurial_background,
    i.businesses_founded,
    i.primary_industry,
    i.expansion_plans,
    i.collaboration_interest,
    i.mentorship_offering,
    i.angel_investor_interest,
    i.current_funding_source,
    NOW() as created_date,
    NOW() as updated_at
FROM businesses b
JOIN business_insights_snapshots i ON b.id = i.business_id
WHERE b.name = 'SenseAI'
ORDER BY i.submitted_date DESC
LIMIT 1;

-- Delete the old 78 records
DELETE FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI')
  AND id != (SELECT id FROM business_insights_snapshots WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI') ORDER BY submitted_date DESC LIMIT 1);

-- Verify the result
SELECT COUNT(*) as remaining_senseai_insights 
FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI');
