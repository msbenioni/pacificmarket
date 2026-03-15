-- ================================================================
-- PROFILES TABLE & AUTH SYSTEM ANALYSIS
-- Purpose: Check RLS policies, functions, triggers for profiles and auth
-- Generated: 2026-03-16
-- ================================================================

-- ================================================================
-- PROFILES TABLE STRUCTURE
-- ================================================================
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================================================
-- AUTH.USERS TABLE STRUCTURE (what we can access)
-- ================================================================
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'auth'
ORDER BY ordinal_position;

-- ================================================================
-- CURRENT RLS POLICIES FOR PROFILES
-- ================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- ================================================================
-- RLS STATUS FOR PROFILES
-- ================================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerlspolicy
FROM pg_tables 
WHERE tablename = 'profiles';

-- ================================================================
-- TRIGGERS ON PROFILES TABLE
-- ================================================================
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_condition,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles'
AND trigger_schema = 'public';

-- ================================================================
-- FUNCTIONS RELATED TO PROFILES/AUTH
-- ================================================================
SELECT 
    routine_name,
    routine_type,
    data_type,
    external_language
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND (routine_name LIKE '%profile%' OR routine_name LIKE '%auth%' OR routine_name LIKE '%user%');

-- ================================================================
-- SAMPLE PROFILES DATA
-- ================================================================
SELECT 
    id,
    user_id,
    email,
    display_name,
    full_name,
    city,
    country,
    primary_cultural,
    languages,
    role,
    created_at,
    updated_at
FROM profiles 
LIMIT 3;

-- ================================================================
-- CHECK AUTH.USER METADATA ACCESS
-- ================================================================
-- This shows what metadata fields are available
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    updated_at
FROM auth.users 
LIMIT 2;

-- ================================================================
-- CURRENT USER CONTEXT TEST
-- ================================================================
-- Test what the current user can access
SELECT 
    auth.uid() as current_user_id,
    auth.jwt() as current_jwt,
    auth.role() as current_role;

-- ================================================================
-- PROFILE ACCESS TEST
-- ================================================================
-- Test if current user can access their own profile
SELECT 
    COUNT(*) as accessible_profiles,
    array_agg(id) as accessible_profile_ids
FROM profiles 
WHERE user_id = auth.uid();

-- ================================================================
-- INDEXES ON PROFILES
-- ================================================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'profiles'
AND schemaname = 'public';

-- ================================================================
-- FOREIGN KEY CONSTRAINTS
-- ================================================================
SELECT
    tc.constraint_name,
    tc.constraint_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'profiles'
AND tc.constraint_schema = 'public';
