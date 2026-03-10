-- Check claim_requests table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'claim_requests' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check a sample of the data to see what date fields exist
SELECT 
    id,
    business_id,
    user_id,
    status,
    created_at,
    created_date,
    updated_at,
    updated_date
FROM claim_requests 
LIMIT 5;
