-- Migration 001: Field Naming Convention Standardization
-- This script standardizes field names across all tables according to the new naming convention

-- ============================================================================
-- 🏢 businesses Table Updates
-- ============================================================================

-- 1. Rename columns for consistency
ALTER TABLE businesses RENAME COLUMN website TO contact_website;
ALTER TABLE businesses RENAME COLUMN verified TO is_verified;
ALTER TABLE businesses RENAME COLUMN claimed TO is_claimed;
ALTER TABLE businesses RENAME COLUMN homepage_featured TO is_homepage_featured;

-- 2. Migrate data from short_description to tagline
UPDATE businesses 
SET tagline = short_description 
WHERE short_description IS NOT NULL AND (tagline IS NULL OR tagline = '');

-- 3. Remove the old short_description column
ALTER TABLE businesses DROP COLUMN short_description;

-- ============================================================================
-- 📈 business_insights Table Updates
-- ============================================================================

-- Note: employs_anyone, employs_family_community, and business_stage are already correctly named
-- No changes needed for business_insights table

-- ============================================================================
-- 👤 founder_insights Table Updates
-- ============================================================================

-- 1. Rename boolean columns for consistency
ALTER TABLE founder_insights RENAME COLUMN mentorship_access TO has_mentorship_access;
ALTER TABLE founder_insights RENAME COLUMN mentorship_offering TO offers_mentorship;
ALTER TABLE founder_insights RENAME COLUMN collaboration_interest TO has_collaboration_interest;
ALTER TABLE founder_insights RENAME COLUMN open_to_future_contact TO is_open_to_future_contact;

-- 2. Shorten long field name
ALTER TABLE founder_insights RENAME COLUMN family_community_responsibilities_affect_business TO family_community_responsibilities_impact;

-- ============================================================================
-- ✅ Verification Queries
-- ============================================================================

-- Check if all renames were successful
SELECT 
    'businesses' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND column_name IN ('contact_website', 'is_verified', 'is_claimed', 'is_homepage_featured', 'tagline')
UNION ALL
SELECT 
    'founder_insights' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'founder_insights' 
    AND column_name IN ('has_mentorship_access', 'offers_mentorship', 'has_collaboration_interest', 'is_open_to_future_contact', 'family_community_responsibilities_impact')
ORDER BY table_name, column_name;

-- Verify data migration from short_description to tagline
SELECT 
    COUNT(*) as businesses_with_tagline,
    COUNT(CASE WHEN tagline IS NOT NULL AND tagline != '' THEN 1 END) as businesses_with_non_empty_tagline
FROM businesses;

-- ============================================================================
-- 🎉 Migration Complete
-- ============================================================================

-- This migration completes the standardization of field names across all tables
-- Next step: Update form components to use the new field names
