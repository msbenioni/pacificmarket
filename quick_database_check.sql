-- Quick check of current database state
-- 1. Check if completion_status column still exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND table_schema = 'public'
  AND column_name IN ('completion_status', 'is_autosave', 'submission_type')
ORDER BY column_name;

-- 2. Check current RLS policies
SELECT policyname, tablename, cmd, roles
FROM pg_policies 
WHERE tablename = 'business_insights_snapshots'
ORDER BY policyname;

-- 3. Check if views still exist
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%insight%'
ORDER BY table_name;

-- 4. Check constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'business_insights_snapshots'
  AND table_schema = 'public'
ORDER BY constraint_type, constraint_name;
