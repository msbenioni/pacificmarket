-- Check all database relationships for msbenioni@gmail.com
-- This will show what's linked to what

-- 1. Find auth.users record(s) for this email
SELECT 'AUTH USERS' as table_name, id, email, created_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'msbenioni@gmail.com'
ORDER BY created_at;

-- 2. Find profiles records linked to these user IDs
SELECT 'PROFILES' as table_name, id, email, display_name, role, created_at, updated_at
FROM public.profiles 
WHERE email = 'msbenioni@gmail.com' OR id IN (
    SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com'
)
ORDER BY created_at;

-- 3. Find admin_users records linked to these user IDs
SELECT 'ADMIN_USERS' as table_name, id, owner_user_id, role, permissions, created_at, updated_at
FROM public.admin_users 
WHERE owner_user_id IN (
    SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com'
)
ORDER BY created_at;

-- 4. Find any businesses owned by these user IDs
SELECT 'BUSINESSES' as table_name, id, name, owner_user_id, status, created_at
FROM public.businesses 
WHERE owner_user_id IN (
    SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com'
)
ORDER BY created_at;

-- 5. Find any claim requests from these user IDs
SELECT 'CLAIM_REQUESTS' as table_name, id, user_id, user_email, business_name, status, created_at
FROM public.claim_requests 
WHERE user_email = 'msbenioni@gmail.com' OR user_id IN (
    SELECT id FROM auth.users WHERE email = 'msbenioni@gmail.com'
)
ORDER BY created_at;
