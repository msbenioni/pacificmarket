-- SQL to restore cultural identities that were incorrectly cleared
-- This will restore valid cultural identities and only clear truly invalid ones

-- First, let's see what we have now (should be mostly {})
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  ARRAY_AGG(business_name ORDER BY business_name LIMIT 3) as sample_businesses
FROM businesses 
WHERE cultural_identity IS NOT NULL 
GROUP BY cultural_identity
ORDER BY business_count DESC;

-- Create function to restore valid cultural identities
CREATE OR REPLACE FUNCTION restore_valid_cultural_identities(identity_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
  result TEXT[] := '{}';
  identity_item TEXT;
BEGIN
  -- Handle different input formats
  IF identity_text IS NULL OR identity_text = '' OR identity_text = '{}' THEN
    RETURN result;
  END IF;
  
  -- If it's already a JSON array, parse it
  IF identity_text::text ~ '^\[' THEN
    SELECT array_agg(trim(item)) INTO result
    FROM jsonb_array_elements_text(identity_text::jsonb) AS item;
  ELSIF identity_text::text ~ '^\{' THEN
    -- Handle {item1,item2} format (no quotes)
    SELECT array_agg(trim(item)) INTO result
    FROM unnest(regexp_split_to_array(identity_text::text, '[{},]', 'g')) AS item
    WHERE trim(item) != '';
  ELSE
    -- Single identity
    result := ARRAY[trim(identity_text)];
  END IF;
  
  -- Keep only valid cultural identities
  FOR i IN 1..array_length(result, 1) LOOP
    identity_item := lower(trim(result[i]));
    
    CASE
      -- Pacific identities (keep these)
      WHEN identity_item IN ('new zealand maori', 'cook islands maori', 'fijian', 'indo-fijian', 'rotuman', 'french polynesia', 'i-kiribati', 'marshallese', 'chuukese', 'pohnpeian', 'yapese', 'kosraean', 'nauruan', 'new caledonia', 'new zealand', 'niuean', 'palauan', 'papuan', 'samoan', 'solomon islands', 'tongan', 'tuvaluan', 'ni-vanuatu', 'wallis and futuna') THEN
        -- Capitalize properly
        result[i] := CASE
          WHEN identity_item = 'new zealand maori' THEN 'New Zealand Maori'
          WHEN identity_item = 'cook islands maori' THEN 'Cook Islands Maori'
          WHEN identity_item = 'indo-fijian' THEN 'Indo-Fijian'
          WHEN identity_item = 'i-kiribati' THEN 'I-Kiribati'
          WHEN identity_item = 'ni-vanuatu' THEN 'Ni-Vanuatu'
          WHEN identity_item = 'solomon islands' THEN 'Solomon Islands'
          WHEN identity_item = 'wallis and futuna' THEN 'Wallis and Futuna'
          ELSE INITCAP(identity_item)
        END;
      
      -- Global countries (keep these)
      WHEN identity_item IN ('afghanistan', 'albania', 'algeria', 'andorra', 'angola', 'argentina', 'armenia', 'austria', 'azerbaijan', 'bahamas', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benin', 'bhutan', 'bolivia', 'bosnia and herzegovina', 'botswana', 'brazil', 'bulgaria', 'burkina faso', 'burundi', 'cambodia', 'cameroon', 'canada', 'central african republic', 'chad', 'chile', 'china', 'colombia', 'comoros', 'congo', 'costa rica', 'croatia', 'cuba', 'cyprus', 'czech republic', 'denmark', 'djibouti', 'dominican republic', 'ecuador', 'egypt', 'el salvador', 'estonia', 'ethiopia', 'finland', 'france', 'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'greece', 'grenada', 'guatemala', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'honduras', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy', 'jamaica', 'japan', 'jordan', 'kazakhstan', 'kenya', 'kosovo', 'kuwait', 'kyrgyzstan', 'laos', 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'mauritania', 'mauritius', 'mexico', 'moldova', 'monaco', 'mongolia', 'montenegro', 'morocco', 'mozambique', 'myanmar', 'namibia', 'nepal', 'netherlands', 'nigeria', 'north macedonia', 'norway', 'oman', 'pakistan', 'panama', 'paraguay', 'peru', 'philippines', 'poland', 'portugal', 'qatar', 'romania', 'russia', 'rwanda', 'saudi arabia', 'senegal', 'serbia', 'sierra leone', 'singapore', 'slovakia', 'slovenia', 'south africa', 'south korea', 'spain', 'sri lanka', 'sudan', 'sweden', 'switzerland', 'syria', 'taiwan', 'tajikistan', 'tanzania', 'thailand', 'tunisia', 'turkey', 'turkmenistan', 'uganda', 'ukraine', 'united arab emirates', 'united kingdom', 'united states', 'uruguay', 'uzbekistan', 'venezuela', 'vietnam', 'yemen', 'zambia', 'zimbabwe') THEN
        result[i] := INITCAP(identity_item);
      
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

-- Restore valid cultural identities (this will fix the {} issue)
UPDATE businesses 
SET cultural_identity = restore_valid_cultural_identities(cultural_identity::text)
WHERE cultural_identity IS NOT NULL;

-- Show results after restoration
SELECT 
  cultural_identity,
  COUNT(*) as business_count,
  (SELECT ARRAY_AGG(business_name ORDER BY business_name) 
   FROM (SELECT business_name FROM businesses b2 
         WHERE b2.cultural_identity = b1.cultural_identity 
         ORDER BY business_name LIMIT 3) AS subquery) as sample_businesses
FROM businesses b1
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '{}'
GROUP BY cultural_identity
ORDER BY business_count DESC, cultural_identity;

-- Show businesses that still have no cultural identities (for manual review)
SELECT 
  business_name,
  country,
  'No cultural identity - needs manual review' as status
FROM businesses 
WHERE cultural_identity IS NULL OR cultural_identity = '{}'
ORDER BY business_name;

-- Clean up the function
DROP FUNCTION IF EXISTS restore_valid_cultural_identities(TEXT);
