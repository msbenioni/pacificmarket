-- SQL to update specific cultural identity variations found in your database
-- This handles the exact variations you provided

-- Show current state before update
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 3) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'
  AND cultural_identity != ''
GROUP BY cultural_identity
ORDER BY business_count DESC;

-- Update function to handle your specific variations
CREATE OR REPLACE FUNCTION normalize_specific_cultural_identities(identity_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
  result TEXT[] := '{}';
  identity_item TEXT;
BEGIN
  -- Handle different input formats
  IF identity_text IS NULL OR identity_text = '' THEN
    RETURN result;
  END IF;
  
  -- If it's already a JSON array, parse it
  IF identity_text::text ~ '^\[' THEN
    SELECT array_agg(trim(item)) INTO result
    FROM jsonb_array_elements_text(identity_text::jsonb) AS item;
  ELSE
    -- Treat as single identity or comma-separated
    IF identity_text::text ~ ',' THEN
      -- Handle comma-separated identities
      SELECT array_agg(trim(item)) INTO result
      FROM unnest(string_to_array(identity_text, ',')) AS item;
    ELSE
      -- Single identity
      result := ARRAY[trim(identity_text)];
    END IF;
  END IF;
  
  -- Normalize each identity based on your specific data
  FOR i IN 1..array_length(result, 1) LOOP
    identity_item := lower(trim(result[i]));
    
    CASE
      -- Single identity mappings
      WHEN identity_item = 'new zealand maori' THEN
        result[i] := 'New Zealand Maori';
      WHEN identity_item = 'cook islands' THEN
        result[i] := 'Cook Islands Maori';
      WHEN identity_item = 'papua new guinea' THEN
        result[i] := 'Papuan';
      WHEN identity_item = 'new zealand' THEN
        result[i] := 'New Zealand';
      WHEN identity_item = 'samoa' THEN
        result[i] := 'Samoan';
      WHEN identity_item = 'new caledonia' THEN
        result[i] := 'New Caledonia';
      WHEN identity_item = 'french polynesia' THEN
        result[i] := 'French Polynesia';
      WHEN identity_item = 'wallis and futuna' THEN
        result[i] := 'Wallis and Futuna';
      WHEN identity_item = 'tonga' THEN
        result[i] := 'Tongan';
      WHEN identity_item = 'fiji' THEN
        result[i] := 'Fijian';
      WHEN identity_item = 'ireland' THEN
        result[i] := 'Ireland';
      WHEN identity_item = 'italy' THEN
        result[i] := 'Italy';
      WHEN identity_item = 'china' THEN
        result[i] := 'China';
      WHEN identity_item = 'india' THEN
        result[i] := 'India';
      
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

-- Update the businesses table with normalized cultural identities
UPDATE businesses 
SET cultural_identity = normalize_specific_cultural_identities(cultural_identity::text)
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'
  AND cultural_identity != '';

-- Show results after update
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 3) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'
  AND cultural_identity != ''
GROUP BY cultural_identity
ORDER BY business_count DESC, cultural_identity;

-- Show businesses that lost all cultural identities (for manual review)
SELECT 
  business_name,
  country,
  cultural_identity as original_cultural_identity,
  'Cleared - needs manual review' as status
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND (cultural_identity = '[]' OR array_length(cultural_identity::text[], 1) = 0)
ORDER BY business_name;

-- Clean up the function
DROP FUNCTION IF EXISTS normalize_specific_cultural_identities(TEXT);
