-- SQL to standardize cultural identities in the profiles table
-- This handles the profile cultural identity data you provided

-- Show current state before update
SELECT 
  cultural_identity,
  COUNT(*) as profile_count,
  (SELECT ARRAY_AGG(id::text ORDER BY id) 
   FROM (SELECT id FROM profiles p2 
         WHERE p2.cultural_identity = p1.cultural_identity 
         ORDER BY id LIMIT 3) AS subquery) as sample_profiles
FROM profiles p1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '{}'
GROUP BY cultural_identity
ORDER BY profile_count DESC;

-- Update function to standardize profile cultural identities
CREATE OR REPLACE FUNCTION normalize_profile_cultural_identities(identity_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
  result TEXT[] := '{}';
  identity_item TEXT;
BEGIN
  -- Handle different input formats
  IF identity_text IS NULL OR identity_text = '' THEN
    RETURN result;
  END IF;
  
  -- Parse JSON array
  IF identity_text::text ~ '^\[' THEN
    SELECT array_agg(trim(item)) INTO result
    FROM jsonb_array_elements_text(identity_text::jsonb) AS item;
  ELSE
    -- Treat as single identity
    result := ARRAY[trim(identity_text)];
  END IF;
  
  -- Normalize each identity
  FOR i IN 1..array_length(result, 1) LOOP
    identity_item := lower(trim(result[i]));
    
    CASE
      -- Single identity mappings
      WHEN identity_item = 'samoa' THEN
        result[i] := 'Samoan';
      WHEN identity_item = 'cook-islands' THEN
        result[i] := 'Cook Islands Maori';
      WHEN identity_item = 'french-polynesia' THEN
        result[i] := 'French Polynesia';
      WHEN identity_item = 'new-zealand' THEN
        result[i] := 'New Zealand';
      
      -- Remove invalid/unknown identities
      ELSE
        result[i] := NULL;
    END CASE;
  END LOOP;
  
  -- Remove NULLs and duplicates
  SELECT array_agg(DISTINCT item ORDER BY item) INTO result
  FROM unnest(result) AS item
  WHERE item IS NOT NULL;
  
  RETURN COALESCE(result, '{}'::text[]);
END;
$$ LANGUAGE plpgsql;

-- Update the profiles table with standardized cultural identities
UPDATE profiles 
SET cultural_identity = normalize_profile_cultural_identities(cultural_identity::text)
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '{}';

-- Show results after update
SELECT 
  cultural_identity,
  COUNT(*) as profile_count,
  (SELECT ARRAY_AGG(id::text ORDER BY id) 
   FROM (SELECT id FROM profiles p2 
         WHERE p2.cultural_identity = p1.cultural_identity 
         ORDER BY id LIMIT 3) AS subquery) as sample_profiles
FROM profiles p1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '{}'
GROUP BY cultural_identity
ORDER BY profile_count DESC, cultural_identity;

-- Show profiles that lost all cultural identities (for manual review)
SELECT 
  id::text,
  'Lost all cultural identities - needs manual review' as status
FROM profiles 
WHERE cultural_identity IS NOT NULL 
  AND (cultural_identity = '{}' OR array_length(cultural_identity::text[], 1) = 0)
ORDER BY id::text;

-- Clean up the function
DROP FUNCTION IF EXISTS normalize_profile_cultural_identities(TEXT);
