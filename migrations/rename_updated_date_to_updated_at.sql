-- Migration: Change updated_date to updated_at in business_insights_snapshots table
-- This makes the column name consistent with the businesses table

-- First, drop any existing default value constraint
ALTER TABLE business_insights_snapshots ALTER COLUMN updated_date DROP DEFAULT;

-- Rename the column from updated_date to updated_at
ALTER TABLE business_insights_snapshots RENAME COLUMN updated_date TO updated_at;

-- Set the default value to CURRENT_TIMESTAMP
ALTER TABLE business_insights_snapshots ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Add comment to document the change
COMMENT ON COLUMN business_insights_snapshots.updated_at IS 'Timestamp when the record was last updated. Renamed from updated_date for consistency with businesses table.';
