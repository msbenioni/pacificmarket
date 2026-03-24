-- Add visibility_mode column for homepage visibility governance
-- This allows distinguishing between automatic and manual visibility settings

-- Add the new column with default "auto" behavior
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS visibility_mode TEXT DEFAULT 'auto' CHECK (visibility_mode IN ('auto', 'manual'));

-- Add comment explaining the purpose
COMMENT ON COLUMN businesses.visibility_mode IS 'Controls whether homepage visibility is automatic (tier-based) or manual (admin-set)';

-- Update existing records to have "auto" mode (they should already have this as default)
-- This ensures existing behavior is preserved
UPDATE businesses 
SET visibility_mode = 'auto' 
WHERE visibility_mode IS NULL;

-- Create index for better query performance on visibility checks
CREATE INDEX IF NOT EXISTS idx_businesses_visibility_mode ON businesses(visibility_mode);
