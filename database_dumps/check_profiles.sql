-- Check profiles table structure and data
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public' 
ORDER BY ordinal_position;

-- Check existing profiles
SELECT 
    id, 
    email, 
    display_name, 
    role, 
    status, 
    created_at,
    invited_by,
    pending_business_id
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for users in auth.users that don't have profiles
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.id as profile_id,
    p.role as profile_role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;
