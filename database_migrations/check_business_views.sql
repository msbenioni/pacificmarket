-- Check Business Views and Tables
-- Run this to see what business-related objects exist

-- Check business tables
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%business%'
ORDER BY table_name;

-- Check business views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE '%business%'
ORDER BY table_name;

-- Check what's in public_businesses view (if it exists)
-- SELECT COUNT(*) as count FROM public_businesses;

-- Check what's in analytics_businesses view (if it exists)  
-- SELECT COUNT(*) as count FROM analytics_businesses;

-- Check main businesses table count
SELECT COUNT(*) as main_businesses_count FROM businesses;

-- Check permissions on business views
SELECT table_name, privilege_type, grantee
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name LIKE '%business%'
ORDER BY table_name, privilege_type;
