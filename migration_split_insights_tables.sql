-- =====================================================
-- MIGRATION PLAN: Split business_insights_snapshots into two tables
-- =====================================================

-- STEP 1: Create the new focused tables
-- =====================================================

-- Founder Insights Table (user-focused, no business_id)
CREATE TABLE founder_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Founder Background
    gender TEXT,
    age_range TEXT,
    years_entrepreneurial TEXT,
    businesses_founded TEXT,
    founder_role TEXT,
    founder_motivation_array TEXT[],
    founder_story TEXT,
    
    -- Pacific Context
    serves_pacific_communities TEXT,
    culture_influences_business BOOLEAN,
    culture_influence_details TEXT,
    family_community_responsibilities_affect_business TEXT[],
    responsibilities_impact_details TEXT,
    
    -- Financial & Investment (founder's personal perspective)
    angel_investor_interest TEXT,
    investor_capacity TEXT,
    
    -- Community & Impact (founder's personal involvement)
    collaboration_interest BOOLEAN,
    mentorship_offering BOOLEAN,
    open_to_future_contact BOOLEAN,
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one founder insight per user per year
    UNIQUE(user_id, snapshot_year)
);

-- Business Insights Table (business-focused, no user_id)
CREATE TABLE business_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Business Model & Stage
    business_stage TEXT,
    business_model TEXT,
    problem_solved TEXT,
    primary_industry TEXT,
    
    -- Financial & Funding (business-specific)
    current_funding_source TEXT,
    investment_stage TEXT,
    revenue_streams TEXT[],
    financial_challenges TEXT,
    funding_amount_needed TEXT,
    funding_purpose TEXT,
    
    -- Challenges & Support (business-specific)
    top_challenges TEXT[],
    support_needed_next TEXT[],
    
    -- Growth & Future (business-specific)
    growth_stage TEXT,
    goals_next_12_months_array TEXT[],
    goals_details TEXT,
    expansion_plans BOOLEAN,
    
    -- Community Impact (business-specific)
    community_impact_areas TEXT[],
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one business insight per business per year
    UNIQUE(business_id, snapshot_year)
);

-- STEP 2: Create proper indexes
-- =====================================================

-- Founder insights indexes
CREATE INDEX idx_founder_insights_user_year ON founder_insights(user_id, snapshot_year);
CREATE INDEX idx_founder_insights_submitted_date ON founder_insights(submitted_date DESC);

-- Business insights indexes
CREATE INDEX idx_business_insights_business_year ON business_insights(business_id, snapshot_year);
CREATE INDEX idx_business_insights_submitted_date ON business_insights(submitted_date DESC);

-- STEP 3: Migrate existing data
-- =====================================================

-- Migrate founder insights (records without business_id)
INSERT INTO founder_insights (
    user_id,
    snapshot_year,
    submitted_date,
    gender,
    age_range,
    years_entrepreneurial,
    businesses_founded,
    founder_role,
    founder_motivation_array,
    founder_story,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    mentorship_offering,
    open_to_future_contact,
    created_date,
    updated_at
)
SELECT 
    user_id,
    snapshot_year,
    submitted_date,
    gender,
    age_range,
    years_entrepreneurial,
    businesses_founded,
    founder_role,
    founder_motivation_array,
    founder_story,
    serves_pacific_communities,
    culture_influences_business,
    culture_influence_details,
    family_community_responsibilities_affect_business,
    responsibilities_impact_details,
    angel_investor_interest,
    investor_capacity,
    collaboration_interest,
    mentorship_offering,
    open_to_future_contact,
    created_date,
    updated_at
FROM business_insights_snapshots 
WHERE business_id IS NULL;

-- Migrate business insights (records with business_id)
INSERT INTO business_insights (
    business_id,
    snapshot_year,
    submitted_date,
    business_stage,
    business_model,
    problem_solved,
    primary_industry,
    current_funding_source,
    investment_stage,
    revenue_streams,
    financial_challenges,
    funding_amount_needed,
    funding_purpose,
    top_challenges,
    support_needed_next,
    growth_stage,
    goals_next_12_months_array,
    goals_details,
    expansion_plans,
    community_impact_areas,
    created_date,
    updated_at
)
SELECT 
    business_id,
    snapshot_year,
    submitted_date,
    business_stage,
    business_model,
    problem_solved,
    primary_industry,
    current_funding_source,
    investment_stage,
    revenue_streams,
    financial_challenges,
    funding_amount_needed,
    funding_purpose,
    top_challenges,
    support_needed_next,
    growth_stage,
    goals_next_12_months_array,
    goals_details,
    expansion_plans,
    community_impact_areas,
    created_date,
    updated_at
FROM business_insights_snapshots 
WHERE business_id IS NOT NULL;

-- STEP 4: Set up RLS policies for new tables
-- =====================================================

-- Founder Insights RLS
ALTER TABLE founder_insights ENABLE ROW LEVEL SECURITY;

-- Users can view their own founder insights
CREATE POLICY "Users can view own founder insights" ON founder_insights 
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert/update their own founder insights
CREATE POLICY "Users can manage own founder insights" ON founder_insights 
FOR ALL USING (auth.uid() = user_id);

-- Public can view founder insights for analytics (anonymized data)
CREATE POLICY "Public can view founder insights analytics" ON founder_insights 
FOR SELECT USING (true);

-- Business Insights RLS
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;

-- Business owners can view their business insights
CREATE POLICY "Business owners can view own business insights" ON business_insights 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = business_insights.business_id 
        AND businesses.owner_user_id = auth.uid()
    )
);

-- Business owners can manage their business insights
CREATE POLICY "Business owners can manage own business insights" ON business_insights 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = business_insights.business_id 
        AND businesses.owner_user_id = auth.uid()
    )
);

-- Public can view business insights for analytics
CREATE POLICY "Public can view business insights analytics" ON business_insights 
FOR SELECT USING (true);

-- Admins can view all
CREATE POLICY "Admins can view all insights" ON founder_insights 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admins can view all business insights" ON business_insights 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- STEP 5: Verify migration
-- =====================================================

-- Check founder insights migration
SELECT 
    COUNT(*) as founder_insights_count,
    COUNT(DISTINCT user_id) as unique_founders,
    MIN(snapshot_year) as earliest_year,
    MAX(snapshot_year) as latest_year
FROM founder_insights;

-- Check business insights migration
SELECT 
    COUNT(*) as business_insights_count,
    COUNT(DISTINCT business_id) as unique_businesses,
    MIN(snapshot_year) as earliest_year,
    MAX(snapshot_year) as latest_year
FROM business_insights;

-- Compare with original table
SELECT 
    (SELECT COUNT(*) FROM business_insights_snapshots WHERE business_id IS NULL) as original_founder_count,
    (SELECT COUNT(*) FROM business_insights_snapshots WHERE business_id IS NOT NULL) as original_business_count,
    (SELECT COUNT(*) FROM founder_insights) as migrated_founder_count,
    (SELECT COUNT(*) FROM business_insights) as migrated_business_count;

-- STEP 6: Backup and cleanup (run after verification)
-- =====================================================

-- First, backup the original table
CREATE TABLE business_insights_snapshots_backup AS 
SELECT * FROM business_insights_snapshots;

-- Then drop the original table
-- DROP TABLE business_insights_snapshots;

-- STEP 7: Update application code
-- =====================================================
-- (This will be done separately - update components to use new tables)
