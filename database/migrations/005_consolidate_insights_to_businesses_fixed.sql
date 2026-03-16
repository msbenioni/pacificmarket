-- ================================================================
-- CONSOLIDATE INSIGHTS DATA INTO BUSINESSES TABLE
-- Purpose: Move all insights fields from business_insights and founder_insights into businesses table
-- Then drop the redundant insights tables
-- ================================================================

-- Add missing fields to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS founder_story TEXT,
ADD COLUMN IF NOT EXISTS age_range TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS collaboration_interest BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mentorship_offering BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS open_to_future_contact BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS business_acquisition_interest BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS business_stage TEXT;

-- Check if insights tables exist before trying to migrate data
DO $$
BEGIN
    -- Only migrate data if the insights tables exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'founder_insights') THEN
        -- Migrate data from founder_insights to businesses (if any exists)
        UPDATE businesses b
        SET 
            founder_story = fi.founder_story,
            age_range = fi.age_range,
            gender = fi.gender,
            collaboration_interest = fi.collaboration_interest,
            mentorship_offering = fi.mentorship_offering,
            open_to_future_contact = fi.open_to_future_contact,
            updated_at = NOW()
        FROM founder_insights fi
        WHERE b.id = fi.business_id 
        AND fi.snapshot_year = EXTRACT(YEAR FROM NOW());
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'business_insights') THEN
        -- Migrate data from business_insights to businesses (if any exists)
        UPDATE businesses b
        SET 
            business_stage = bi.business_stage,
            updated_at = NOW()
        FROM business_insights bi
        WHERE b.id = bi.business_id 
        AND bi.snapshot_year = EXTRACT(YEAR FROM NOW());
    END IF;
END $$;

-- Drop the redundant insights tables if they exist
DROP TABLE IF EXISTS business_insights CASCADE;
DROP TABLE IF EXISTS founder_insights CASCADE;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_businesses_stage ON businesses(business_stage);
CREATE INDEX IF NOT EXISTS idx_businesses_collaboration ON businesses(collaboration_interest);
CREATE INDEX IF NOT EXISTS idx_businesses_mentorship ON businesses(mentorship_offering);

-- Update RLS policies to include new fields
-- (This would need to be updated in your RLS policy definitions)

COMMENT ON COLUMN businesses.founder_story IS 'Founder story and journey';
COMMENT ON COLUMN businesses.age_range IS 'Founder age range';
COMMENT ON COLUMN businesses.gender IS 'Founder gender';
COMMENT ON COLUMN businesses.collaboration_interest IS 'Interest in collaboration opportunities';
COMMENT ON COLUMN businesses.mentorship_offering IS 'Willing to mentor other founders';
COMMENT ON COLUMN businesses.open_to_future_contact IS 'Open to future contact from Pacific Market';
COMMENT ON COLUMN businesses.business_acquisition_interest IS 'Interested in business acquisition opportunities';
COMMENT ON COLUMN businesses.business_stage IS 'Current business development stage';
