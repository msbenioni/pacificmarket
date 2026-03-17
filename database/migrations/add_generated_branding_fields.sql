-- Add generated branding fields to businesses table
-- These will store the URLs for auto-generated starter branding

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS generated_logo_url TEXT,
ADD COLUMN IF NOT EXISTS generated_banner_url TEXT,
ADD COLUMN IF NOT EXISTS generated_mobile_banner_url TEXT;

-- Add indexes for performance if needed
CREATE INDEX IF NOT EXISTS idx_businesses_generated_logo_url ON businesses(generated_logo_url) WHERE generated_logo_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_businesses_generated_banner_url ON businesses(generated_banner_url) WHERE generated_banner_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_businesses_generated_mobile_banner_url ON businesses(generated_mobile_banner_url) WHERE generated_mobile_banner_url IS NOT NULL;
