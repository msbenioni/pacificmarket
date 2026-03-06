-- Phase 1, Task 4: Create business_insights_snapshots table
-- This table stores founder insights data separate from businesses table for time-series tracking

-- Create enum types for insights data
DO $$
BEGIN
    -- Team size bands
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'team_size_band_enum') THEN
        CREATE TYPE team_size_band_enum AS ENUM ('solo', '2-5', '6-10', '11-50', '51+');
    END IF;
    
    -- Business stages
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_stage_enum') THEN
        CREATE TYPE business_stage_enum AS ENUM ('idea', 'startup', 'growth', 'mature');
    END IF;
    
    -- Import export status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'import_export_status_enum') THEN
        CREATE TYPE import_export_status_enum AS ENUM ('none', 'import_only', 'export_only', 'both');
    END IF;
END $$;

-- Create the business_insights_snapshots table
CREATE TABLE IF NOT EXISTS business_insights_snapshots (
    -- Core identifiers
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    snapshot_year integer NOT NULL,
    submitted_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    
    -- Founder journey
    year_started integer,
    founder_motivation text,
    problem_solved text,
    
    -- Business operations
    team_size_band team_size_band_enum,
    business_model text,
    family_involvement boolean DEFAULT false,
    
    -- Markets
    customer_region text,
    sales_channels jsonb,
    import_export_status import_export_status_enum DEFAULT 'none',
    import_countries jsonb,
    export_countries jsonb,
    
    -- Growth stage
    business_stage business_stage_enum,
    
    -- Challenges
    top_challenges jsonb,
    support_needed jsonb,
    
    -- Future outlook
    goals_next_12_months text,
    hiring_intentions boolean DEFAULT false,
    
    -- Community impact
    community_impact_areas jsonb,
    collaboration_interest boolean DEFAULT false,
    
    -- Metadata
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid REFERENCES auth.users(id)
);

-- Add constraints for data integrity
ALTER TABLE business_insights_snapshots ADD CONSTRAINT insights_snapshot_year_check CHECK (snapshot_year >= 1900 AND snapshot_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);
ALTER TABLE business_insights_snapshots ADD CONSTRAINT insights_year_started_check CHECK (year_started >= 1900 AND year_started <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);
ALTER TABLE business_insights_snapshots ADD CONSTRAINT insights_unique_business_year UNIQUE (business_id, snapshot_year);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_business_id ON business_insights_snapshots(business_id);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_snapshot_year ON business_insights_snapshots(snapshot_year);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_submitted_date ON business_insights_snapshots(submitted_date);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_business_stage ON business_insights_snapshots(business_stage);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_team_size_band ON business_insights_snapshots(team_size_band);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_import_export_status ON business_insights_snapshots(import_export_status);

-- Create trigger for updated_date
CREATE TRIGGER update_business_insights_snapshots_updated_date 
    BEFORE UPDATE ON business_insights_snapshots 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_date_column();

-- Create RLS policies for insights table
ALTER TABLE business_insights_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view insights for their own businesses
CREATE POLICY "Users can view own business insights" ON business_insights_snapshots
    FOR SELECT USING (
        auth.uid() = (
            SELECT owner_user_id FROM businesses WHERE id = business_insights_snapshots.business_id
        )
    );

-- Policy: Users can insert insights for their own businesses
CREATE POLICY "Users can insert own business insights" ON business_insights_snapshots
    FOR INSERT WITH CHECK (
        auth.uid() = (
            SELECT owner_user_id FROM businesses WHERE id = business_insights_snapshots.business_id
        )
    );

-- Policy: Users can update insights for their own businesses
CREATE POLICY "Users can update own business insights" ON business_insights_snapshots
    FOR UPDATE USING (
        auth.uid() = (
            SELECT owner_user_id FROM businesses WHERE id = business_insights_snapshots.business_id
        )
    );

-- Policy: Admins can manage all insights
CREATE POLICY "Admins can manage all insights" ON business_insights_snapshots
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create view for latest insights per business
CREATE OR REPLACE VIEW latest_business_insights AS
SELECT DISTINCT ON (business_id)
    id,
    business_id,
    snapshot_year,
    submitted_date,
    year_started,
    founder_motivation,
    problem_solved,
    team_size_band,
    business_model,
    family_involvement,
    customer_region,
    sales_channels,
    import_export_status,
    import_countries,
    export_countries,
    business_stage,
    top_challenges,
    support_needed,
    goals_next_12_months,
    hiring_intentions,
    community_impact_areas,
    collaboration_interest,
    created_date,
    updated_date,
    created_by
FROM business_insights_snapshots
ORDER BY business_id, submitted_date DESC;

-- Create view for insights analytics
CREATE OR REPLACE VIEW insights_analytics AS
SELECT 
    b.id as business_id,
    b.name as business_name,
    b.industry,
    b.country,
    b.city,
    i.snapshot_year,
    i.submitted_date,
    i.year_started,
    i.founder_motivation,
    i.problem_solved,
    i.team_size_band,
    i.business_model,
    i.family_involvement,
    i.customer_region,
    i.sales_channels,
    i.import_export_status,
    i.business_stage,
    i.top_challenges,
    i.support_needed,
    i.goals_next_12_months,
    i.hiring_intentions,
    i.community_impact_areas,
    i.collaboration_interest,
    EXTRACT(YEAR FROM CURRENT_DATE) - i.year_started as years_in_business
FROM businesses b
LEFT JOIN latest_business_insights i ON b.id = i.business_id
WHERE b.status = 'active';

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data (will be empty initially)
SELECT * FROM business_insights_snapshots LIMIT 3;
