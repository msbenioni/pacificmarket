SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%insights%' OR table_name = 'businesses')
ORDER BY table_name;
