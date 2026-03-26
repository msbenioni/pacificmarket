-- Simple query to see current cultural identity data
-- Run this in Supabase SQL Editor first

-- Show all unique cultural identities with counts
SELECT 
  cultural_identity,
  COUNT(*) as business_count
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'::jsonb
  AND cultural_identity != ''::text
GROUP BY cultural_identity
ORDER BY business_count DESC, cultural_identity;

-- Show sample businesses with their cultural identities
SELECT 
  business_name,
  cultural_identity
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'::jsonb
  AND cultural_identity != ''::text
ORDER BY business_name
LIMIT 20;

-- Show total businesses with cultural identity data
SELECT 
  COUNT(*) as total_with_cultural_identity,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM businesses WHERE status = 'active'), 2) as percentage
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'::jsonb
  AND cultural_identity != ''::text
  AND status = 'active';
