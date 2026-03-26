-- SQL script to clean up cultural identities to match standardized list exactly
-- Run this script in your Supabase SQL editor

-- First, let's see what we currently have
SELECT 
  cultural_identity,
  COUNT(*) as count,
  ARRAY_AGG(business_name ORDER BY business_name) as businesses
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'::jsonb
GROUP BY cultural_identity
ORDER BY count DESC;

-- Create function to validate and clean cultural identities
CREATE OR REPLACE FUNCTION validate_cultural_identity(identity_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
  result TEXT[] := '{}';
  valid_identities TEXT[] := ARRAY[
    'Australia', 'Australia - Torres Strait Islander', 'Australia - Aboriginal',
    'Cook Islands Maori',
    'Fijian', 'Indo-Fijian', 'Rotuman',
    'French Polynesia',
    'I-Kiribati',
    'Marshallese',
    'Chuukese', 'Pohnpeian', 'Yapese', 'Kosraean',
    'Nauruan',
    'New Caledonia',
    'New Zealand', 'New Zealand Maori',
    'Niuean',
    'Palauan',
    'Papuan',
    'Samoan',
    'Solomon Islands',
    'Tongan',
    'Tuvaluan',
    'Vanuatu', 'Ni-Vanuatu',
    'Wallis and Futuna',
    -- Global countries (same as unifiedConstants)
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
    'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
    'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Gabon', 'Gambia',
    'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal',
    'Netherlands', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru',
    'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal',
    'Serbia', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain',
    'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
    'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];
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
    -- Treat as single identity
    result := ARRAY[trim(identity_text)];
  END IF;
  
  -- Validate each identity against the standard list
  FOR i IN 1..array_length(result, 1) LOOP
    identity_item := trim(result[i]);
    
    -- Check if identity is in the valid list (case-insensitive)
    IF identity_item IN (SELECT unnest(valid_identities)) THEN
      -- Keep exact case from valid list
      SELECT value INTO result[i]
      FROM unnest(valid_identities) AS value
      WHERE lower(value) = lower(identity_item)
      LIMIT 1;
    ELSE
      -- Remove invalid identities
      result[i] := NULL;
    END IF;
  END LOOP;
  
  -- Remove NULLs and duplicates
  SELECT array_agg(DISTINCT item ORDER BY item) INTO result
  FROM unnest(result) AS item
  WHERE item IS NOT NULL;
  
  RETURN COALESCE(result, '{}'::text[]);
END;
$$ LANGUAGE plpgsql;

-- Update the businesses table - keep only valid cultural identities
UPDATE businesses 
SET cultural_identity = validate_cultural_identity(cultural_identity::text)
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'::jsonb;

-- Show the results
SELECT 
  cultural_identity,
  COUNT(*) as count
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != '[]'::jsonb
GROUP BY cultural_identity
ORDER BY count DESC;

-- Show businesses that lost all cultural identities (for manual review)
SELECT 
  business_name,
  'Lost all cultural identities - needs manual review' as status
FROM businesses 
WHERE cultural_identity IS NOT NULL 
  AND (cultural_identity = '[]'::jsonb OR array_length(cultural_identity::text[], 1) = 0);

-- Clean up the function
DROP FUNCTION IF EXISTS validate_cultural_identity(TEXT);
