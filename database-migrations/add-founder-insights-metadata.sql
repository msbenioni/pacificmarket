-- Add metadata columns to business_insights_snapshots for better analytics
-- This enables tracking of submission types and completion status

-- Add submission_type column to track how data was submitted
ALTER TABLE business_insights_snapshots
ADD COLUMN submission_type text NOT NULL DEFAULT 'full';

-- Add completion_status column to track the state of the submission
ALTER TABLE business_insights_snapshots
ADD COLUMN completion_status text NOT NULL DEFAULT 'in_progress';

-- Add constraints to ensure data integrity
ALTER TABLE business_insights_snapshots
ADD CONSTRAINT business_insights_snapshots_submission_type_check
CHECK (submission_type IN ('section', 'full', 'autosave', 'admin'));

ALTER TABLE business_insights_snapshots
ADD CONSTRAINT business_insights_snapshots_completion_status_check
CHECK (completion_status IN ('in_progress', 'completed', 'abandoned', 'archived'));

-- Create indexes for better query performance on analytics queries
CREATE INDEX idx_business_insights_snapshots_submission_type ON business_insights_snapshots(submission_type);
CREATE INDEX idx_business_insights_snapshots_completion_status ON business_insights_snapshots(completion_status);
CREATE INDEX idx_business_insights_snapshots_user_completion ON business_insights_snapshots(user_id, completion_status);

-- Example queries for analytics:
-- 1. Count completed founder insights by year
-- SELECT COUNT(*) FROM business_insights_snapshots 
-- WHERE submission_type = 'full' AND completion_status = 'completed' 
-- AND snapshot_year = 2026;

-- 2. Track founder completion funnel
-- SELECT 
--   completion_status,
--   COUNT(*) as count,
--   COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
-- FROM business_insights_snapshots 
-- WHERE snapshot_year = 2026
-- GROUP BY completion_status;

-- 3. Find most commonly saved sections (partial progress)
-- SELECT 
--   COUNT(*) as saves,
--   submitted_date
-- FROM business_insights_snapshots 
-- WHERE submission_type = 'section' 
-- AND completion_status = 'in_progress'
-- GROUP BY DATE_TRUNC('day', submitted_date)
-- ORDER BY saves DESC;
