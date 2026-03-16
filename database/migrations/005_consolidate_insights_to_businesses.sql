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
ADD COLUMN IF NOT EXISTS business_stage TEXT,
ADD COLUMN IF NOT EXISTS top_challenges JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS business_operating_status TEXT DEFAULT 'operating',
ADD COLUMN IF NOT EXISTS business_age TEXT,
ADD COLUMN IF NOT EXISTS employs_anyone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS employs_family_community BOOLEAN DEFAULT FALSE;

-- Migrate data from business_insights to businesses (if any exists)
INSERT INTO businesses (
    id, 
    founder_story, 
    age_range, 
    gender, 
    collaboration_interest, 
    mentorship_offering, 
    open_to_future_contact, 
    business_acquisition_interest,
    business_stage,
    top_challenges,
    business_operating_status,
    business_age,
    employs_anyone,
    employs_family_community,
    updated_at
)
SELECT 
    b.id,
    fi.founder_story,
    fi.age_range,
    fi.gender,
    fi.collaboration_interest,
    fi.mentorship_offering,
    fi.open_to_future_contact,
    FALSE as business_acquisition_interest, -- Not in founder_insights, set default
    bi.business_stage,
    bi.top_challenges,
    bi.business_operating_status,
    bi.business_age,
    bi.employs_anyone,
    bi.employs_family_community,
    NOW()
FROM businesses b
LEFT JOIN founder_insights fi ON b.id = fi.business_id AND fi.snapshot_year = EXTRACT(YEAR FROM NOW())
LEFT JOIN business_insights bi ON b.id = bi.business_id AND bi.snapshot_year = EXTRACT(YEAR FROM NOW())
WHERE fi.id IS NOT NULL OR bi.id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    founder_story = EXCLUDED.founder_story,
    age_range = EXCLUDED.age_range,
    gender = EXCLUDED.gender,
    collaboration_interest = EXCLUDED.collaboration_interest,
    mentorship_offering = EXCLUDED.mentorship_offering,
    open_to_future_contact = EXCLUDED.open_to_future_contact,
    business_acquisition_interest = EXCLUDED.business_acquisition_interest,
    business_stage = EXCLUDED.business_stage,
    top_challenges = EXCLUDED.top_challenges,
    business_operating_status = EXCLUDED.business_operating_status,
    business_age = EXCLUDED.business_age,
    employs_anyone = EXCLUDED.employs_anyone,
    employs_family_community = EXCLUDED.employs_family_community,
    updated_at = NOW();

-- Drop the redundant insights tables
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
COMMENT ON COLUMN businesses.top_challenges IS 'Top business challenges (JSON array)';
COMMENT ON COLUMN businesses.business_operating_status IS 'Current operating status';
COMMENT ON COLUMN businesses.business_age IS 'Age of the business in years';
COMMENT ON COLUMN businesses.employs_anyone IS 'Business employs anyone besides owner';
COMMENT ON COLUMN businesses.employs_family_community IS 'Business employs family or community members';
