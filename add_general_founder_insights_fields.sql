-- Migration: Add general founder insights fields to business_insights_snapshots table
-- This migration updates the table to support general founder journey questions
-- instead of business-specific questions

-- Add new general founder fields
ALTER TABLE business_insights_snapshots 
ADD COLUMN IF NOT EXISTS years_entrepreneurial TEXT,
ADD COLUMN IF NOT EXISTS entrepreneurial_background TEXT,
ADD COLUMN IF NOT EXISTS businesses_founded TEXT,
ADD COLUMN IF NOT EXISTS primary_industry TEXT,
ADD COLUMN IF NOT EXISTS family_entrepreneurial_background BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS support_sources TEXT[],
ADD COLUMN IF NOT EXISTS mentorship_access BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mentorship_offering BOOLEAN DEFAULT FALSE;

-- Update existing business-specific fields to be optional (since we're now general)
ALTER TABLE business_insights_snapshots 
ALTER COLUMN business_id DROP NOT NULL,
ALTER COLUMN year_started DROP NOT NULL,
ALTER COLUMN problem_solved DROP NOT NULL,
ALTER COLUMN business_model DROP NOT NULL,
ALTER COLUMN customer_region DROP NOT NULL,
ALTER COLUMN sales_channels DROP NOT NULL,
ALTER COLUMN import_export_status DROP NOT NULL;

-- Add comments to document the change
COMMENT ON TABLE business_insights_snapshots IS 'Stores founder insights snapshots - now supports general founder journey questions in addition to business-specific ones';
COMMENT ON COLUMN business_insights_snapshots.business_id IS 'Optional business ID - null for general founder surveys, specific ID for business-associated surveys';
COMMENT ON COLUMN business_insights_snapshots.years_entrepreneurial IS 'How many years the founder has been an entrepreneur (e.g., "0-1", "1-3", "3-5", "5-10", "10+")';
COMMENT ON COLUMN business_insights_snapshots.entrepreneurial_background IS 'Founder''s background and journey to entrepreneurship';
COMMENT ON COLUMN business_insights_snapshots.businesses_founded IS 'Number of businesses the founder has founded (e.g., "1", "2-3", "4-5", "6+")';
COMMENT ON COLUMN business_insights_snapshots.primary_industry IS 'Primary industry the founder works in';
COMMENT ON COLUMN business_insights_snapshots.family_entrepreneurial_background IS 'Whether the founder comes from a family of entrepreneurs';
COMMENT ON COLUMN business_insights_snapshots.support_sources IS 'Array of support sources the founder uses (family, networks, government programs, mentors, etc.)';
COMMENT ON COLUMN business_insights_snapshots.mentorship_access IS 'Whether the founder has access to mentors or advisors';
COMMENT ON COLUMN business_insights_snapshots.mentorship_offering IS 'Whether the founder is willing to mentor other entrepreneurs';

-- Create index for faster queries on general vs business-specific insights
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_business_id ON business_insights_snapshots(business_id);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_submitted_date ON business_insights_snapshots(submitted_date);

-- Verify the migration completed successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
    AND column_name IN ('years_entrepreneurial', 'entrepreneurial_background', 'businesses_founded', 'primary_industry', 'family_entrepreneurial_background', 'support_sources', 'mentorship_access', 'mentorship_offering')
ORDER BY column_name;
