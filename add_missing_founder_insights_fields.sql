-- Add Missing Founder Insights Fields to business_insights_snapshots Table
-- Migration script to add all missing columns from the Founder Insights form

-- Add missing fields that are in the form but not in the database
ALTER TABLE business_insights_snapshots 
ADD COLUMN IF NOT EXISTS top_challenges TEXT[], -- Array of top challenges (from BUSINESS_CHALLENGES)
ADD COLUMN IF NOT EXISTS business_stage TEXT CHECK (business_stage IN ('idea', 'startup', 'growth', 'mature')), -- Business growth stage
ADD COLUMN IF NOT EXISTS hiring_intentions BOOLEAN DEFAULT FALSE, -- Plan to hire in next 12 months
ADD COLUMN IF NOT EXISTS community_impact_areas TEXT[], -- Array of community impact areas
ADD COLUMN IF NOT EXISTS collaboration_interest BOOLEAN DEFAULT FALSE; -- Interest in collaborating with other founders

-- Add comments for documentation
COMMENT ON COLUMN business_insights_snapshots.top_challenges IS 'Array of top challenges faced by the founder (from BUSINESS_CHALLENGES constants)';
COMMENT ON COLUMN business_insights_snapshots.business_stage IS 'Current growth stage of the business (idea, startup, growth, mature)';
COMMENT ON COLUMN business_insights_snapshots.hiring_intentions IS 'Whether the founder plans to hire staff in the next 12 months';
COMMENT ON COLUMN business_insights_snapshots.community_impact_areas IS 'Array of community impact areas the founder focuses on';
COMMENT ON COLUMN business_insights_snapshots.collaboration_interest IS 'Whether the founder is interested in collaborating with other Pacific founders';

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_insights_top_challenges ON business_insights_snapshots USING GIN(top_challenges);
CREATE INDEX IF NOT EXISTS idx_insights_business_stage ON business_insights_snapshots(business_stage);
CREATE INDEX IF NOT EXISTS idx_insights_hiring_intentions ON business_insights_snapshots(hiring_intentions);
CREATE INDEX IF NOT EXISTS idx_insights_community_impact ON business_insights_snapshots USING GIN(community_impact_areas);
CREATE INDEX IF NOT EXISTS idx_insights_collaboration ON business_insights_snapshots(collaboration_interest);

-- Update validation function to include new fields
CREATE OR REPLACE FUNCTION validate_founder_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate business_stage
  IF NEW.business_stage IS NOT NULL AND NEW.business_stage NOT IN ('idea', 'startup', 'growth', 'mature') THEN
    RAISE EXCEPTION 'Invalid business stage: %', NEW.business_stage;
  END IF;
  
  -- Validate top_challenges array contains valid values (if we want strict validation)
  -- Note: This is optional validation - uncomment if needed
  -- IF NEW.top_challenges IS NOT NULL THEN
  --   FOR i IN 1..array_length(NEW.top_challenges, 1) LOOP
  --     IF NEW.top_challenges[i] NOT IN ('funding', 'marketing', 'hiring', 'regulations', 'competition', 'technology', 'skills', 'network', 'time', 'cash-flow') THEN
  --       RAISE EXCEPTION 'Invalid challenge: %', NEW.top_challenges[i];
  --     END IF;
  --   END LOOP;
  -- END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_founder_insights_trigger ON business_insights_snapshots;
CREATE TRIGGER validate_founder_insights_trigger
  BEFORE INSERT OR UPDATE ON business_insights_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION validate_founder_insights();

-- Add function to get founder insights summary for analytics
CREATE OR REPLACE FUNCTION get_founder_insights_summary()
RETURNS TABLE (
  total_founders BIGINT,
  avg_businesses_founded NUMERIC,
  top_business_stages TEXT,
  common_challenges TEXT[],
  hiring_plans_percentage NUMERIC,
  collaboration_interest_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_founders,
    ROUND(AVG(CASE WHEN businesses_founded ~ '^[0-9]+$' THEN CAST(businesses_founded AS INTEGER) ELSE 0 END), 2) as avg_businesses_founded,
    MODE() WITHIN GROUP (ORDER BY business_stage) as top_business_stages,
    ARRAY_AGG(DISTINCT unnest(top_challenges)) FILTER (WHERE top_challenges IS NOT NULL) as common_challenges,
    ROUND(AVG(CASE WHEN hiring_intentions = true THEN 100 ELSE 0 END), 2) as hiring_plans_percentage,
    ROUND(AVG(CASE WHEN collaboration_interest = true THEN 100 ELSE 0 END), 2) as collaboration_interest_percentage
  FROM business_insights_snapshots
  WHERE snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Add function to get challenges analysis
CREATE OR REPLACE FUNCTION get_challenges_analysis()
RETURNS TABLE (
  challenge TEXT,
  frequency BIGINT,
  percentage NUMERIC,
  business_stage TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    challenge,
    COUNT(*) as frequency,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
    business_stage
  FROM business_insights_snapshots, 
       unnest(top_challenges) as challenge
  WHERE top_challenges IS NOT NULL
    AND snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY challenge, business_stage
  ORDER BY frequency DESC;
END;
$$ LANGUAGE plpgsql;

-- Add function to get hiring and collaboration insights
CREATE OR REPLACE FUNCTION get_ecosystem_insights()
RETURNS TABLE (
  hiring_intentions BOOLEAN,
  collaboration_interest BOOLEAN,
  founder_count BIGINT,
  avg_business_stage TEXT,
  common_impact_areas TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hiring_intentions,
    collaboration_interest,
    COUNT(*) as founder_count,
    MODE() WITHIN GROUP (ORDER BY business_stage) as avg_business_stage,
    ARRAY_AGG(DISTINCT unnest(community_impact_areas)) FILTER (WHERE community_impact_areas IS NOT NULL) as common_impact_areas
  FROM business_insights_snapshots
  WHERE snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY hiring_intentions, collaboration_interest
  ORDER BY founder_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Update RLS policies for new columns (if RLS is enabled)
-- Note: Adjust these policies based on your existing RLS setup

-- Example: Allow authenticated users to read new fields
-- CREATE POLICY "Users can view founder insights" ON business_insights_snapshots
--   FOR SELECT USING (auth.role() = 'authenticated');

-- Example: Allow users to update their own insights data  
-- CREATE POLICY "Users can update own founder insights" ON business_insights_snapshots
--   FOR UPDATE USING (
--     user_id = auth.uid()
--   )
--   WITH CHECK (
--     user_id = auth.uid()
--   );

-- Example: Allow admin users to manage insights data
-- CREATE POLICY "Admins can manage founder insights" ON business_insights_snapshots
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role = 'admin'
--     )
--   );

-- Output success message
SELECT 'Missing founder insights fields added successfully to business_insights_snapshots table' as result;
