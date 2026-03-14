-- Create sample insights data for testing the Insights page
-- This will populate the founder_insights table with sample data

-- Get some sample businesses to create insights for
WITH sample_businesses AS (
  SELECT id, owner_user_id, industry, country 
  FROM businesses 
  WHERE status = 'active' 
  LIMIT 5
)
INSERT INTO founder_insights (
  user_id,
  snapshot_year,
  gender,
  age_range,
  years_entrepreneurial,
  businesses_founded,
  founder_role,
  founder_motivation_array,
  pacific_identity_array,
  based_in_country,
  based_in_city,
  serves_pacific_communities,
  culture_influences_business,
  family_community_responsibilities_impact,
  has_mentorship_access,
  offers_mentorship,
  barriers_to_mentorship,
  angel_investor_interest,
  investor_capacity,
  has_collaboration_interest,
  is_open_to_future_contact,
  goals_next_12_months_array,
  created_at,
  updated_at
)
SELECT 
  owner_user_id,
  2024,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 0 THEN 'female'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 1 THEN 'male'
       ELSE 'non-binary'
  END,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 4 = 0 THEN '25-34'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 4 = 1 THEN '35-44'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 4 = 2 THEN '45-54'
       ELSE '55-64'
  END,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 0 THEN '1-3 years'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 1 THEN '4-6 years'
       ELSE '7-10 years'
  END,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 2 = 0 THEN 1 ELSE 2 END,
  'founder',
  ARRAY['financial_independence', 'community_impact', 'cultural_preservation'],
  ARRAY['māori', 'pacific_islander'],
  country,
  'Auckland',
  'yes',
  true,
  ARRAY['family_care', 'community_obligations'],
  true,
  true,
  'lack_of_access_to_capital',
  'considering_future',
  'under_$10k',
  true,
  true,
  ARRAY['increase_revenue', 'expand_team', 'new_markets'],
  NOW(),
  NOW()
FROM sample_businesses;

-- Also create some business_insights data
WITH sample_businesses AS (
  SELECT id, owner_user_id, industry, country 
  FROM businesses 
  WHERE status = 'active' 
  LIMIT 5
)
INSERT INTO business_insights (
  business_id,
  user_id,
  snapshot_year,
  business_stage,
  top_challenges_array,
  business_operating_status,
  business_age,
  is_business_registered,
  employs_anyone,
  employs_family_community,
  team_size_band,
  revenue_band,
  current_funding_source,
  funding_amount_needed,
  funding_purpose,
  investment_stage,
  community_impact_areas_array,
  support_needed_next_array,
  current_support_sources_array,
  industry,
  created_at,
  updated_at
)
SELECT 
  id,
  owner_user_id,
  2024,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 0 THEN 'growth'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 1 THEN 'established'
       ELSE 'startup'
  END,
  ARRAY['access_to_capital', 'market_size', 'competition'],
  'operating',
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 0 THEN '1-2 years'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 1 THEN '3-5 years'
       ELSE '6-10 years'
  END,
  true,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 2 = 0 THEN true ELSE false END,
  false,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 0 THEN '1-5'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 1 THEN '6-10'
       ELSE '11-50'
  END,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY id) % 4 = 0 THEN 'under_$50k'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 4 = 1 THEN '$50k-$100k'
       WHEN ROW_NUMBER() OVER (ORDER BY id) % 4 = 2 THEN '$100k-$500k'
       ELSE '$500k-$1m'
  END,
  'personal_savings',
  '$10000-$50000',
  'marketing_expansion',
  'early_stage',
  ARRAY['local_community', 'cultural_preservation', 'economic_development'],
  ARRAY['funding', 'mentorship', 'business_networking'],
  ARRAY['family', 'friends', 'local_business_association'],
  industry,
  NOW(),
  NOW()
FROM sample_businesses;
