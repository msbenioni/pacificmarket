-- Phase 2 Migration: Clean up legacy is_homepage_featured field
-- This migration removes the legacy boolean field since we now use visibility_tier only

-- Step 1: Create a backup of any businesses that might have conflicting data
CREATE TABLE IF NOT EXISTS homepage_featured_backup AS
SELECT id, business_name, visibility_tier, is_homepage_featured, updated_at
FROM businesses 
WHERE is_homepage_featured IS NOT NULL 
  AND visibility_tier IS NOT NULL
  AND (
    (is_homepage_featured = true AND visibility_tier != 'homepage') OR
    (is_homepage_featured = false AND visibility_tier = 'homepage')
  );

-- Step 2: Drop the legacy column
ALTER TABLE businesses DROP COLUMN IF EXISTS is_homepage_featured;

-- Step 3: Add comment explaining the migration
COMMENT ON TABLE businesses IS 'Homepage visibility is now controlled by visibility_tier field only. Legacy is_homepage_featured column removed in Phase 2 migration.';

-- Step 4: Update any admin documentation or references (manual step)
-- NOTE: Update any remaining code references to use visibility_tier instead of is_homepage_featured
