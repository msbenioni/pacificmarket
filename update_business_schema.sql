-- Update business schema to support new ownership and contact structure
-- Run this migration to add the new fields to the businesses table

-- Add new business ownership fields
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS business_owner TEXT,
ADD COLUMN IF NOT EXISTS business_owner_email TEXT,
ADD COLUMN IF NOT EXISTS additional_owner_emails TEXT[], -- Array of additional owner emails
ADD COLUMN IF NOT EXISTS public_phone TEXT;

-- Add comments to explain field purposes
COMMENT ON COLUMN businesses.business_owner IS 'Primary business owner name for portal access and management';
COMMENT ON COLUMN businesses.business_owner_email IS 'Primary business owner email for portal access';
COMMENT ON COLUMN businesses.additional_owner_emails IS 'Array of additional owner emails for portal access';
COMMENT ON COLUMN businesses.public_phone IS 'Public phone number displayed on business listing';

-- Note: Private business contact fields should be moved to user profiles or business insights
-- Private fields like private_business_phone and private_business_email 
-- should be stored in user profiles or business insights tables, not the main businesses table

-- Create index for faster queries on owner email
CREATE INDEX IF NOT EXISTS idx_businesses_business_owner_email ON businesses(business_owner_email);

-- Create index for faster queries on additional owner emails (using GIN for array)
CREATE INDEX IF NOT EXISTS idx_businesses_additional_owner_emails ON businesses USING GIN(additional_owner_emails);
