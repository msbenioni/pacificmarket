-- Check actual businesses table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if private business contact fields exist in businesses table
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public'
AND column_name IN ('private_business_phone', 'private_business_email');

-- Show sample data from businesses table
SELECT 
    id, 
    name, 
    business_handle,
    contact_email,
    private_business_phone,
    private_business_email,
    logo_url,
    banner_url,
    business_owner,
    business_owner_email
FROM businesses 
LIMIT 3;
