-- Migration: Fix email template variables from object to array format
-- This fixes the data type mismatch between DB schema and frontend

-- Update any existing templates that have object format to array format
UPDATE email_templates 
SET variables = ARRAY(
    SELECT key 
    FROM jsonb_each_text(variables)
) 
WHERE jsonb_typeof(variables) = 'object';

-- Ensure all template variables are arrays
ALTER TABLE email_templates 
ALTER COLUMN variables SET DEFAULT '[]'::jsonb;

-- Add constraint to ensure variables is always an array
ALTER TABLE email_templates 
ADD CONSTRAINT check_variables_is_array 
CHECK (jsonb_typeof(variables) = 'array');

-- Add comment explaining the change
COMMENT ON COLUMN email_templates.variables IS 'Array of variable names used in template (e.g., ["first_name", "email"])';
