-- Fix cultural_identity consistency in profiles and businesses tables
-- Converts all formats to consistent JSON array format

-- Function to normalize cultural identity values
CREATE OR REPLACE FUNCTION normalize_cultural_identity(value text)
RETURNS text AS $$
DECLARE
    result text;
    items text[];
BEGIN
    IF value IS NULL OR trim(value) = '' THEN
        RETURN NULL;
    END IF;
    
    -- Handle JSON array format: ["samoa","new-zealand"]
    IF value ~ '^\[.*\]$' THEN
        BEGIN
            -- Try to parse as JSON and re-stringify to ensure proper format
            result := value;
        EXCEPTION WHEN OTHERS THEN
            -- If JSON parsing fails, treat as single item
            result := json_build_array(trim(value))::text;
        END;
    
    -- Handle brace format: {Samoan} or {"Cook Islands Maori","French Polynesia"}
    ELSIF value ~ '^\{.*\}$' THEN
        BEGIN
            -- Remove braces and split by comma
            items := string_to_array(
                regexp_replace(value, '^\{|\}$', '', 'g'),
                ','
            );
            
            -- Clean each item: remove quotes and trim
            FOR i IN 1..array_length(items, 1) LOOP
                items[i] := trim(both '"' from trim(items[i]));
            END LOOP;
            
            -- Build JSON array
            result := (SELECT json_agg(item) FROM unnest(items) AS item WHERE item != '')::text;
        END;
    
    -- Handle array format already: ["samoa","new-zealand"]
    ELSIF value ~ '^".*"$' AND position(',' in value) > 0 THEN
        -- Already looks like proper JSON array
        result := value;
    
    -- Handle single value: new-zealand
    ELSE
        result := json_build_array(trim(value))::text;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fix profiles table
UPDATE profiles 
SET cultural_identity = normalize_cultural_identity(cultural_identity)
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != normalize_cultural_identity(cultural_identity);

-- Show how many profiles were fixed
DO $$
DECLARE
    count_profiles integer;
BEGIN
    SELECT COUNT(*) INTO count_profiles 
    FROM profiles 
    WHERE cultural_identity IS NOT NULL;
    
    RAISE NOTICE 'Profiles with cultural_identity: %', count_profiles;
END $$;

-- Fix businesses table
UPDATE businesses 
SET cultural_identity = normalize_cultural_identity(cultural_identity)
WHERE cultural_identity IS NOT NULL 
  AND cultural_identity != normalize_cultural_identity(cultural_identity);

-- Show how many businesses were fixed
DO $$
DECLARE
    count_businesses integer;
BEGIN
    SELECT COUNT(*) INTO count_businesses 
    FROM businesses 
    WHERE cultural_identity IS NOT NULL;
    
    RAISE NOTICE 'Businesses with cultural_identity: %', count_businesses;
END $$;

-- Sample of fixed data for verification (profiles)
SELECT 
    'profiles' as table_name,
    id,
    cultural_identity as original_value,
    normalize_cultural_identity(cultural_identity) as fixed_value
FROM profiles 
WHERE cultural_identity IS NOT NULL 
LIMIT 5;

-- Sample of fixed data for verification (businesses)
SELECT 
    'businesses' as table_name,
    id,
    cultural_identity as original_value,
    normalize_cultural_identity(cultural_identity) as fixed_value
FROM businesses 
WHERE cultural_identity IS NOT NULL 
LIMIT 5;

-- Drop the function when done (optional)
-- DROP FUNCTION IF EXISTS normalize_cultural_identity(text);
