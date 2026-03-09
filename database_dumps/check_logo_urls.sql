-- Check logo_url values in businesses table
SELECT 
    id, 
    name, 
    logo_url,
    CASE 
        WHEN logo_url IS NULL THEN 'NULL'
        WHEN logo_url = '' THEN 'EMPTY'
        ELSE 'HAS_VALUE'
    END as logo_status
FROM businesses 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- Check if any businesses have logo_url values
SELECT 
    COUNT(*) as total_businesses,
    COUNT(logo_url) as businesses_with_logo,
    COUNT(*) - COUNT(logo_url) as businesses_without_logo
FROM businesses 
WHERE status = 'active';
