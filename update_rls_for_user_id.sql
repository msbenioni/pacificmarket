-- Update RLS policies to support user_id-based queries for general founder insights

-- Drop existing general policies and recreate with user_id support
DROP POLICY IF EXISTS "Users can insert founder insights" ON business_insights_snapshots;
DROP POLICY IF EXISTS "Users can view all founder insights" ON business_insights_snapshots;
DROP POLICY IF EXISTS "Users can update own founder insights" ON business_insights_snapshots;
DROP POLICY IF EXISTS "Users can delete own founder insights" ON business_insights_snapshots;

-- Create policies based on user_id for general founder insights
CREATE POLICY "Users can insert own founder insights" ON business_insights_snapshots
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own founder insights" ON business_insights_snapshots
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own founder insights" ON business_insights_snapshots
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own founder insights" ON business_insights_snapshots
FOR DELETE USING (auth.uid() = user_id);

-- Keep business-specific policies for backward compatibility
CREATE POLICY "Users can insert insights for their businesses" ON business_insights_snapshots
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  (business_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = business_insights_snapshots.business_id 
    AND businesses.owner_user_id = auth.uid()
  ))
);

CREATE POLICY "Users can view business insights" ON business_insights_snapshots
FOR SELECT USING (
  auth.uid() = user_id OR 
  (business_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = business_insights_snapshots.business_id 
    AND (businesses.owner_user_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text)
  ))
);

-- Admin access
CREATE POLICY "Admins have full access to business insights" ON business_insights_snapshots
FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'admin'::text');

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'business_insights_snapshots'
ORDER BY policyname;
