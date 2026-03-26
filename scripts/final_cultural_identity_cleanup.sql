-- SQL to set cultural identities for businesses that still need them
-- Based on country and business context

-- Set cultural identities for USA businesses
UPDATE businesses SET cultural_identity = '{"United States"}' WHERE business_name = 'Avalon Wellness and Performance';
UPDATE businesses SET cultural_identity = '{"United States"}' WHERE business_name = 'Da Utah Taro Leaf Man';
UPDATE businesses SET cultural_identity = '{"United States"}' WHERE business_name = 'Pacific Stain';

-- Set cultural identities for New Zealand businesses
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'EverySec VA Services';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Good Day Catering';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Inailau';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Pacific Discovery Network';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Paulo Mauia';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Rebalance Qi Acupuncture';
UPDATE businesses SET cultural_identity = '{"New Zealand"}' WHERE business_name = 'Tuhono Design';

-- Set cultural identity for Samoa business
UPDATE businesses SET cultural_identity = '{Samoan}' WHERE business_name = 'NAUNA';

-- Show final results
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 5) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '{}'
GROUP BY cultural_identity
ORDER BY business_count DESC, cultural_identity;

-- Show any businesses still without cultural identities
SELECT 
  business_name,
  country,
  'Still needs cultural identity' as status
FROM businesses 
WHERE cultural_identity IS NULL OR cultural_identity = '{}'
ORDER BY business_name;
