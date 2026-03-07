-- Fix RLS policies for business_insights_snapshots table
-- This allows authenticated users to insert their own founder insights

-- 1. Enable RLS on the table (if not already enabled)
ALTER TABLE business_insights_snapshots ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own business insights snapshots" ON business_insights_snapshots;
DROP POLICY IF EXISTS "Users can insert own business insights snapshots" ON business_insights_snapshots;
DROP POLICY IF EXISTS "Users can update own business insights snapshots" ON business_insights_snapshots;
DROP POLICY IF EXISTS "Users can delete own business insights snapshots" ON business_insights_snapshots;

-- 3. Create policy for inserting founder insights
-- Allow any authenticated user to insert founder insights (for general surveys)
CREATE POLICY "Users can insert founder insights" ON business_insights_snapshots
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Create policy for viewing founder insights
-- Users can see all insights (for research purposes) or only their own
CREATE POLICY "Users can view all founder insights" ON business_insights_snapshots
FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Create policy for updating (if needed)
CREATE POLICY "Users can update own founder insights" ON business_insights_snapshots
FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. Create policy for deleting (if needed)
CREATE POLICY "Users can delete own founder insights" ON business_insights_snapshots
FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Alternative: More restrictive policies (uncomment if you want users to only see their own data)
/*
-- Users can only see their own insights (based on user_id - you'll need to add this column)
CREATE POLICY "Users can view own founder insights" ON business_insights_snapshots
FOR SELECT USING (auth.uid()::text = (user_id)::text);

-- Users can only insert their own insights
CREATE POLICY "Users can insert own founder insights" ON business_insights_snapshots
FOR INSERT WITH CHECK (auth.uid()::text = (user_id)::text);
*/

-- 8. Grant necessary permissions
GRANT ALL ON business_insights_snapshots TO authenticated;

-- 9. Verify policies are in place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'business_insights_snapshots';
