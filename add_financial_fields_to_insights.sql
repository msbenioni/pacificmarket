-- Add Financial Fields to business_insights_snapshots Table
-- Migration script to add financial and investment fields to founder insights

-- Add financial and investment fields to business_insights_snapshots table
ALTER TABLE business_insights_snapshots 
ADD COLUMN IF NOT EXISTS current_funding_source TEXT CHECK (current_funding_source IN ('personal-savings', 'family-friends', 'bank-loan', 'government-grant', 'angel-investor', 'venture-capital', 'crowdfunding', 'revenue-profit', 'no-funding', 'other')),
ADD COLUMN IF NOT EXISTS funding_amount_needed TEXT CHECK (funding_amount_needed IN ('0-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k-250k', '250k-500k', '500k-1m', '1m+', 'not-sure')),
ADD COLUMN IF NOT EXISTS funding_purpose TEXT CHECK (funding_purpose IN ('product-development', 'marketing-sales', 'hiring-staff', 'equipment-assets', 'operations-expansion', 'working-capital', 'debt-consolidation', 'international-expansion', 'technology-upgrade', 'other')),
ADD COLUMN IF NOT EXISTS investment_stage TEXT CHECK (investment_stage IN ('pre-seed', 'seed', 'early-stage', 'growth-stage', 'established', 'not-seeking')),
ADD COLUMN IF NOT EXISTS angel_investor_interest TEXT CHECK (angel_investor_interest IN ('actively-investing', 'considering-future', 'exploring-options', 'interested-learning', 'not-interested', 'already-investing')),
ADD COLUMN IF NOT EXISTS investor_capacity TEXT CHECK (investor_capacity IN ('under-5k', '5k-25k', '25k-100k', '100k-500k', '500k+', 'varies', 'prefer-not-to-say')),
ADD COLUMN IF NOT EXISTS revenue_streams TEXT[], -- Array of revenue stream values
ADD COLUMN IF NOT EXISTS financial_challenges TEXT;

-- Add comments for documentation
COMMENT ON COLUMN business_insights_snapshots.current_funding_source IS 'Current primary funding source for the business';
COMMENT ON COLUMN business_insights_snapshots.funding_amount_needed IS 'Amount of funding needed if seeking investment';
COMMENT ON COLUMN business_insights_snapshots.funding_purpose IS 'Primary purpose for any funding needed';
COMMENT ON COLUMN business_insights_snapshots.investment_stage IS 'Current investment readiness stage of the business';
COMMENT ON COLUMN business_insights_snapshots.angel_investor_interest IS 'Interest level in angel investing in other Pacific businesses';
COMMENT ON COLUMN business_insights_snapshots.investor_capacity IS 'Investment capacity per deal for angel investing';
COMMENT ON COLUMN business_insights_snapshots.revenue_streams IS 'Array of revenue streams the business utilizes';
COMMENT ON COLUMN business_insights_snapshots.financial_challenges IS 'Text description of main financial challenges';

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_insights_funding_source ON business_insights_snapshots(current_funding_source);
CREATE INDEX IF NOT EXISTS idx_insights_investment_stage ON business_insights_snapshots(investment_stage);
CREATE INDEX IF NOT EXISTS idx_insights_funding_amount ON business_insights_snapshots(funding_amount_needed);

-- Add validation function for financial data
CREATE OR REPLACE FUNCTION validate_financial_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate revenue_streams contains valid values
  IF NEW.revenue_streams IS NOT NULL THEN
    FOR i IN 1..array_length(NEW.revenue_streams, 1) LOOP
      IF NEW.revenue_streams[i] NOT IN ('product-sales', 'service-fees', 'subscription', 'consulting', 'licensing', 'advertising', 'commission', 'rental', 'other') THEN
        RAISE EXCEPTION 'Invalid revenue stream: %', NEW.revenue_streams[i];
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_financial_insights_trigger ON business_insights_snapshots;
CREATE TRIGGER validate_financial_insights_trigger
  BEFORE INSERT OR UPDATE ON business_insights_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION validate_financial_insights();

-- Update RLS policies for new columns (if RLS is enabled)
-- Note: Adjust these policies based on your existing RLS setup

-- Example: Allow authenticated users to read financial insights data
-- CREATE POLICY "Users can view financial insights" ON business_insights_snapshots
--   FOR SELECT USING (auth.role() = 'authenticated');

-- Example: Allow users to update their own financial insights data  
-- CREATE POLICY "Users can update own financial insights" ON business_insights_snapshots
--   FOR UPDATE USING (
--     user_id = auth.uid()
--   )
--   WITH CHECK (
--     user_id = auth.uid()
--   );

-- Example: Allow admin users to manage financial insights data
-- CREATE POLICY "Admins can manage financial insights" ON business_insights_snapshots
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role = 'admin'
--     )
--   );

-- Add function to get financial insights summary for analytics
CREATE OR REPLACE FUNCTION get_financial_insights_summary()
RETURNS TABLE (
  funding_source TEXT,
  funding_amount TEXT,
  investment_stage TEXT,
  business_count BIGINT,
  avg_funding_needed TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bis.current_funding_source as funding_source,
    bis.funding_amount_needed as funding_amount,
    bis.investment_stage as investment_stage,
    COUNT(*) as business_count,
    MODE() WITHIN GROUP (ORDER BY bis.funding_amount_needed) as avg_funding_needed
  FROM business_insights_snapshots bis
  WHERE bis.current_funding_source IS NOT NULL
  GROUP BY bis.current_funding_source, bis.funding_amount_needed, bis.investment_stage
  ORDER BY business_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Add function to get funding gaps analysis
CREATE OR REPLACE FUNCTION get_funding_gaps_analysis()
RETURNS TABLE (
  funding_source TEXT,
  seeking_funding BIGINT,
  avg_amount_needed TEXT,
  common_purposes TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bis.current_funding_source,
    COUNT(CASE WHEN bis.funding_amount_needed != 'not-sure' THEN 1 END) as seeking_funding,
    MODE() WITHIN GROUP (ORDER BY bis.funding_amount_needed) as avg_amount_needed,
    ARRAY_AGG(DISTINCT bis.funding_purpose) FILTER (WHERE bis.funding_purpose IS NOT NULL) as common_purposes
  FROM business_insights_snapshots bis
  WHERE bis.current_funding_source IS NOT NULL
  GROUP BY bis.current_funding_source
  ORDER BY seeking_funding DESC;
END;
$$ LANGUAGE plpgsql;

-- Output success message
SELECT 'Financial fields added successfully to business_insights_snapshots table' as result;
