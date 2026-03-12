-- First, let's see the actual values in business_stage to understand the issue
SELECT DISTINCT business_stage, COUNT(*) as count
FROM business_insights_snapshots 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI')
GROUP BY business_stage
ORDER BY count DESC;

-- Clean up empty strings in enum fields first
UPDATE business_insights_snapshots 
SET business_stage = NULL 
WHERE business_id = (SELECT id FROM businesses WHERE name = 'SenseAI')
  AND (business_stage = '' OR business_stage = 'none');

-- Now run the analysis safely
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
