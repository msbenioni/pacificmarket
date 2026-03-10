-- Add missing business operations columns to businesses table
-- Migration: 001_add_business_operations_fields.sql

-- Add business operating status column
ALTER TABLE businesses 
ADD COLUMN business_operating_status TEXT;

-- Add business age column  
ALTER TABLE businesses 
ADD COLUMN business_age TEXT;

-- Add team size band column
ALTER TABLE businesses 
ADD COLUMN team_size_band TEXT;

-- Add business registration status column
ALTER TABLE businesses 
ADD COLUMN business_registered BOOLEAN DEFAULT FALSE;

-- Add employment fields
ALTER TABLE businesses 
ADD COLUMN employs_anyone BOOLEAN DEFAULT FALSE;

ALTER TABLE businesses 
ADD COLUMN employs_family_community BOOLEAN DEFAULT FALSE;

-- Add sales channels column (JSON array)
ALTER TABLE businesses 
ADD COLUMN sales_channels JSONB DEFAULT '[]'::jsonb;

-- Add primary industry column (may be different from main industry)
ALTER TABLE businesses 
ADD COLUMN primary_industry TEXT;

-- Add business stage column
ALTER TABLE businesses 
ADD COLUMN business_stage TEXT;

-- Add import/export status
ALTER TABLE businesses 
ADD COLUMN import_export_status TEXT;

-- Add revenue band
ALTER TABLE businesses 
ADD COLUMN revenue_band TEXT;

-- Add comments for documentation
COMMENT ON COLUMN businesses.business_operating_status IS 'Current operating status of the business (planning, operating, paused, etc.)';
COMMENT ON COLUMN businesses.business_age IS 'How long the business has been operating';
COMMENT ON COLUMN businesses.team_size_band IS 'Current team size category';
COMMENT ON COLUMN businesses.business_registered IS 'Whether the business is formally registered';
COMMENT ON COLUMN businesses.employs_anyone IS 'Whether the business employs any staff';
COMMENT ON COLUMN businesses.employs_family_community IS 'Whether the business employs family or community members';
COMMENT ON COLUMN businesses.sales_channels IS 'Array of sales channels used by the business';
COMMENT ON COLUMN businesses.primary_industry IS 'Primary industry sector';
COMMENT ON COLUMN businesses.business_stage IS 'Current business stage (idea, startup, growth, mature)';
COMMENT ON COLUMN businesses.import_export_status IS 'Import/export activities status';
COMMENT ON COLUMN businesses.revenue_band IS 'Revenue range category';

-- Update the BUSINESS_PUBLIC_FIELDS in the shared queries to include these new fields
-- This will need to be updated in: src/lib/supabase/queries/businesses.ts
