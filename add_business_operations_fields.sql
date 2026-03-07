-- Add Business Operations Fields to Businesses Table
-- Migration script to add fields collected during business claim/add process

-- Add business operations fields
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS business_operating_status TEXT CHECK (business_operating_status IN ('planning', 'operating', 'paused', 'closed')),
ADD COLUMN IF NOT EXISTS business_age INTEGER CHECK (business_age >= 0),
ADD COLUMN IF NOT EXISTS team_size_band TEXT CHECK (team_size_band IN ('solo', '2-5', '6-10', '11-50', '51+')),
ADD COLUMN IF NOT EXISTS business_registered BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS employs_anyone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS employs_family_community BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sales_channels TEXT[], -- Array of sales channel values
ADD COLUMN IF NOT EXISTS revenue_band TEXT CHECK (revenue_band IN ('0-10k', '10k-25k', '25k-50k', '50k-100k', '100k-250k', '250k+', 'prefer-not-to-say'));

-- Add comments for documentation
COMMENT ON COLUMN businesses.business_operating_status IS 'Current operating status of the business (planning/operating/paused/closed)';
COMMENT ON COLUMN businesses.business_age IS 'Age of business in years since founding/operation began';
COMMENT ON COLUMN businesses.team_size_band IS 'Current team size category (solo/2-5/6-10/11-50/51+)';
COMMENT ON COLUMN businesses.business_registered IS 'Whether the business is officially registered with authorities';
COMMENT ON COLUMN businesses.employs_anyone IS 'Whether the business employs any staff beyond the owner';
COMMENT ON COLUMN businesses.employs_family_community IS 'Whether the business employs family or community members';
COMMENT ON COLUMN businesses.sales_channels IS 'Array of sales channels the business uses (online/retail/market/direct/wholesale/export/services/other)';
COMMENT ON COLUMN businesses.revenue_band IS 'Annual revenue band for the business';

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_businesses_operating_status ON businesses(business_operating_status);
CREATE INDEX IF NOT EXISTS idx_businesses_team_size ON businesses(team_size_band);
CREATE INDEX IF NOT EXISTS idx_businesses_revenue_band ON businesses(revenue_band);
CREATE INDEX IF NOT EXISTS idx_businesses_registered ON businesses(business_registered);

-- Add RLS policies for new columns (if RLS is enabled)
-- Note: Adjust these policies based on your existing RLS setup

-- Example: Allow authenticated users to read business operations data
-- CREATE POLICY "Users can view business operations" ON businesses
--   FOR SELECT USING (auth.role() = 'authenticated');

-- Example: Allow business owners to update their business operations data  
-- CREATE POLICY "Business owners can update operations" ON businesses
--   FOR UPDATE USING (
--     owner_user_id = auth.uid()
--   )
--   WITH CHECK (
--     owner_user_id = auth.uid()
--   );

-- Example: Allow admin users to manage business operations data
-- CREATE POLICY "Admins can manage business operations" ON businesses
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role = 'admin'
--     )
--   );

-- Update profile_completeness trigger to include new fields
-- This assumes you have a profile_completeness trigger function
-- You may need to modify your existing trigger function

CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
  completeness_score INTEGER := 0;
  max_score INTEGER := 100;
BEGIN
  -- Basic identity fields (40 points)
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    completeness_score := completeness_score + 10;
  END IF;
  
  IF NEW.industry IS NOT NULL AND NEW.industry != '' THEN
    completeness_score := completeness_score + 10;
  END IF;
  
  IF NEW.country IS NOT NULL AND NEW.country != '' THEN
    completeness_score := completeness_score + 10;
  END IF;
  
  IF NEW.city IS NOT NULL AND NEW.city != '' THEN
    completeness_score := completeness_score + 10;
  END IF;
  
  -- Business operations fields (30 points)
  IF NEW.business_operating_status IS NOT NULL AND NEW.business_operating_status != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.team_size_band IS NOT NULL AND NEW.team_size_band != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.revenue_band IS NOT NULL AND NEW.revenue_band != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.sales_channels IS NOT NULL AND array_length(NEW.sales_channels, 1) > 0 THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.business_registered IS NOT NULL THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.employs_anyone IS NOT NULL THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  -- Contact fields (20 points)
  IF NEW.contact_email IS NOT NULL AND NEW.contact_email != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.website IS NOT NULL AND NEW.website != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.logo_url IS NOT NULL AND NEW.logo_url != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  IF NEW.description IS NOT NULL AND NEW.description != '' THEN
    completeness_score := completeness_score + 5;
  END IF;
  
  -- Social media (10 points)
  IF NEW.social_links IS NOT NULL AND json_typeof(NEW.social_links) = 'object' THEN
    completeness_score := completeness_score + 10;
  END IF;
  
  NEW.profile_completeness := (completeness_score::FLOAT / max_score) * 100;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger for profile completeness
DROP TRIGGER IF EXISTS update_profile_completeness ON businesses;
CREATE TRIGGER update_profile_completeness
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completeness();

-- Add validation function for business operations data
CREATE OR REPLACE FUNCTION validate_business_operations()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate business_age is reasonable (0-100 years)
  IF NEW.business_age < 0 OR NEW.business_age > 100 THEN
    RAISE EXCEPTION 'Business age must be between 0 and 100 years';
  END IF;
  
  -- Validate sales_channels contains valid values
  IF NEW.sales_channels IS NOT NULL THEN
    FOR i IN 1..array_length(NEW.sales_channels, 1) LOOP
      IF NEW.sales_channels[i] NOT IN ('online', 'retail', 'market', 'direct', 'wholesale', 'export', 'services', 'other') THEN
        RAISE EXCEPTION 'Invalid sales channel: %', NEW.sales_channels[i];
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_business_operations_trigger ON businesses;
CREATE TRIGGER validate_business_operations_trigger
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION validate_business_operations();

-- Output success message
SELECT 'Business operations fields added successfully to businesses table' as result;
