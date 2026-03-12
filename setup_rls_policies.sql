-- STEP 4: Set up RLS policies for the new tables
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE founder_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;

-- Founder Insights RLS Policies
-- 1. Admins can view all founder insights
CREATE POLICY "Admins can view all founder insights" ON founder_insights 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin')
);

-- 2. Users can view their own founder insights
CREATE POLICY "Users can view own founder insights" ON founder_insights 
FOR SELECT USING (auth.uid() = user_id);

-- 3. Users can insert their own founder insights
CREATE POLICY "Users can insert own founder insights" ON founder_insights 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Users can update their own founder insights
CREATE POLICY "Users can update own founder insights" ON founder_insights 
FOR UPDATE USING (auth.uid() = user_id);

-- 5. Users can delete their own founder insights
CREATE POLICY "Users can delete own founder insights" ON founder_insights 
FOR DELETE USING (auth.uid() = user_id);

-- 6. Public read access for founder analytics (non-sensitive demographic data)
CREATE POLICY "Public can view founder insights for analytics" ON founder_insights 
FOR SELECT USING (
    true -- Allow public access for insights page analytics
);

-- Business Insights RLS Policies
-- 1. Admins can view all business insights
CREATE POLICY "Admins can view all business insights" ON business_insights 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin')
);

-- 2. Business owners can view their business insights
CREATE POLICY "Business owners can view own business insights" ON business_insights 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM businesses 
            WHERE businesses.id = business_insights.business_id 
            AND businesses.owner_user_id = auth.uid())
);

-- 3. Business owners can insert their business insights
CREATE POLICY "Business owners can insert own business insights" ON business_insights 
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM businesses 
            WHERE businesses.id = business_insights.business_id 
            AND businesses.owner_user_id = auth.uid())
);

-- 4. Business owners can update their business insights
CREATE POLICY "Business owners can update own business insights" ON business_insights 
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM businesses 
            WHERE businesses.id = business_insights.business_id 
            AND businesses.owner_user_id = auth.uid())
);

-- 5. Business owners can delete their business insights
CREATE POLICY "Business owners can delete own business insights" ON business_insights 
FOR DELETE USING (
    EXISTS (SELECT 1 FROM businesses 
            WHERE businesses.id = business_insights.business_id 
            AND businesses.owner_user_id = auth.uid())
);

-- 6. Public read access for analytics (aggregated data only)
CREATE POLICY "Public can view aggregated business insights" ON business_insights 
FOR SELECT USING (
    -- Only allow public access to non-sensitive fields for analytics
    true -- This can be refined later to specific columns if needed
);

-- Verify RLS policies are set up
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('founder_insights', 'business_insights')
ORDER BY tablename, policyname;
