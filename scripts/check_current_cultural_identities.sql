-- SQL to check current cultural identity data that needs updating
-- Run this first to see what exists in the database

-- Show all current cultural identity values with counts and sample businesses
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 5) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'
  AND cultural_identity != ''
GROUP BY cultural_identity
ORDER BY business_count DESC, cultural_identity;

-- Show total businesses with cultural identity data
SELECT 
  COUNT(*) as total_businesses_with_cultural_identity,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM businesses WHERE status = 'active'), 2) as percentage_of_active
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'
  AND cultural_identity != ''
  AND status = 'active';

-- Show businesses that would lose cultural identity after validation (for manual review)
SELECT 
  business_name,
  country,
  cultural_identity as current_cultural_identity,
  'Will be cleared - needs manual review' as status
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND NOT (
    -- Pacific identities
    cultural_identity IN ('Australia', 'Australia - Torres Strait Islander', 'Australia - Aboriginal',
                          'Cook Islands Maori', 'Fijian', 'Indo-Fijian', 'Rotuman', 'French Polynesia',
                          'I-Kiribati', 'Marshallese', 'Chuukese', 'Pohnpeian', 'Yapese', 'Kosraean',
                          'Nauruan', 'New Caledonia', 'New Zealand', 'New Zealand Maori', 'Niuean',
                          'Palauan', 'Papuan', 'Samoan', 'Solomon Islands', 'Tongan', 'Tuvaluan',
                          'Vanuatu', 'Ni-Vanuatu', 'Wallis and Futuna')
    -- Global countries (sample - you may need to add more based on your data)
    OR cultural_identity IN ('United States', 'Canada', 'United Kingdom', 'Ireland', 'China', 'India', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Austria', 'Portugal', 'Greece', 'Russia', 'Turkey', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ghana', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Saudi Arabia', 'UAE', 'Israel', 'Iran', 'Iraq', 'Pakistan', 'Bangladesh', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia', 'Singapore', 'South Korea', 'Japan', 'Australia', 'New Zealand')
  )
ORDER BY business_name;
