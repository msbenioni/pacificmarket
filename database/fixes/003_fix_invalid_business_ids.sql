-- Fix invalid business ID issue
-- The id column is UUID type with gen_random_uuid() default, so "BusinessProfile" shouldn't exist

-- Step 1: Check specifically for the "BusinessProfile" ID issue
SELECT 
    id, 
    name, 
    business_handle, 
    created_at,
    'BUSINESSPROFILE_ID' as issue_type
FROM businesses 
WHERE id::text = 'BusinessProfile';

-- Step 2: Delete the invalid record (this should not exist in a proper UUID column)
DELETE FROM businesses WHERE id::text = 'BusinessProfile';

-- Step 3: Verify the fix
SELECT 
    id, 
    name, 
    business_handle, 
    created_at
FROM businesses 
WHERE id::text = 'BusinessProfile';

-- Step 4: Check for any other invalid UUIDs (should return empty if schema is correct)
SELECT 
    id, 
    name, 
    business_handle, 
    created_at,
    'INVALID_UUID' as issue_type
FROM businesses 
WHERE 
    id::text NOT LIKE '____-____-____-____-____-____-____-__' 
    OR id IS NULL
ORDER BY created_at;
