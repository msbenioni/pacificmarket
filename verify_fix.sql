-- Verify the cultural identity fix worked correctly
-- Check sample data from both tables

-- Check profiles table
SELECT 
    display_name,
    cultural_identity,
    CASE 
        WHEN cultural_identity ~ '^\[.*\]$' THEN 'JSON Array (Correct)'
        WHEN cultural_identity ~ '^\{.*\}$' THEN 'Brace Format (Incorrect)'
        ELSE 'Other Format'
    END as format_status
FROM profiles 
WHERE cultural_identity IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- Check businesses table  
SELECT 
    business_name,
    cultural_identity,
    CASE 
        WHEN cultural_identity ~ '^\[.*\]$' THEN 'JSON Array (Correct)'
        WHEN cultural_identity ~ '^\{.*\}$' THEN 'Brace Format (Incorrect)'
        ELSE 'Other Format'
    END as format_status
FROM businesses 
WHERE cultural_identity IS NOT NULL
ORDER BY updated_at DESC
LIMIT 10;

-- Count formats in profiles
SELECT 
    CASE 
        WHEN cultural_identity ~ '^\[.*\]$' THEN 'JSON Array (Correct)'
        WHEN cultural_identity ~ '^\{.*\}$' THEN 'Brace Format (Incorrect)'
        ELSE 'Other Format'
    END as format_status,
    COUNT(*) as count
FROM profiles 
WHERE cultural_identity IS NOT NULL
GROUP BY format_status;

-- Count formats in businesses
SELECT 
    CASE 
        WHEN cultural_identity ~ '^\[.*\]$' THEN 'JSON Array (Correct)'
        WHEN cultural_identity ~ '^\{.*\}$' THEN 'Brace Format (Incorrect)'
        ELSE 'Other Format'
    END as format_status,
    COUNT(*) as count
FROM businesses 
WHERE cultural_identity IS NOT NULL
GROUP BY format_status;
