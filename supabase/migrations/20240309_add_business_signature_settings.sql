-- Create business_signature_settings table
CREATE TABLE IF NOT EXISTS business_signature_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Default signature fields
  default_full_name text,
  default_job_title text,
  default_department text,
  default_pronouns text,
  
  default_email text,
  default_phone text,
  default_website text,
  default_address text,
  
  -- Social media URLs
  linkedin_url text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  
  -- Template and styling
  template text DEFAULT 'modern',
  brand_primary text DEFAULT '#0a1628',
  brand_secondary text DEFAULT '#0d4f4f',
  brand_accent text DEFAULT '#00c4cc',
  text_color text DEFAULT '#0f172a',
  
  -- Display options
  include_logo boolean DEFAULT true,
  include_badge boolean DEFAULT true,
  include_socials boolean DEFAULT true,
  include_address boolean DEFAULT true,
  include_pronouns boolean DEFAULT false,
  
  -- Disclaimer
  disclaimer text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one settings record per business
  UNIQUE (business_id)
);

-- Enable RLS
ALTER TABLE business_signature_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own business signature settings
CREATE POLICY "Users can view own business signature settings" ON business_signature_settings
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses 
      WHERE owner_user_id = auth.uid()
    )
  );

-- Users can insert their own business signature settings
CREATE POLICY "Users can insert own business signature settings" ON business_signature_settings
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses 
      WHERE owner_user_id = auth.uid()
    )
  );

-- Users can update their own business signature settings
CREATE POLICY "Users can update own business signature settings" ON business_signature_settings
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses 
      WHERE owner_user_id = auth.uid()
    )
  );

-- Users can delete their own business signature settings
CREATE POLICY "Users can delete own business signature settings" ON business_signature_settings
  FOR DELETE USING (
    business_id IN (
      SELECT id FROM businesses 
      WHERE owner_user_id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_business_signature_settings_business_id ON business_signature_settings(business_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_signature_settings_updated_at 
  BEFORE UPDATE ON business_signature_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
