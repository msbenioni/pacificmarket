-- Refactor Campaign Audience Structure for PDN
-- Add new audience_type and audience_value fields
-- Keep backward compatibility with existing audience field

-- Add new fields to email_campaigns
ALTER TABLE email_campaigns 
ADD COLUMN IF NOT EXISTS audience_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS audience_value VARCHAR(100);

-- Update CHECK constraint to include new audience types and maintain backward compatibility
ALTER TABLE email_campaigns 
DROP CONSTRAINT IF EXISTS email_campaigns_audience_check;

-- Add new constraint that allows both old and new audience formats
ALTER TABLE email_campaigns 
ADD CONSTRAINT email_campaigns_audience_check 
CHECK (
  -- Legacy audience values (for backward compatibility)
  (audience IN ('all', 'business_owners', 'mana_plan', 'moana_plan', 'referral_participants') AND audience_type IS NULL AND audience_value IS NULL) OR
  -- New audience structure
  (
    audience_type IN ('all_businesses', 'plan', 'language', 'country') AND
    (
      (audience_type = 'all_businesses' AND audience_value IS NULL) OR
      (audience_type = 'plan' AND audience_value IN ('vaka', 'mana', 'moana')) OR
      (audience_type = 'language' AND audience_value IS NOT NULL) OR
      (audience_type = 'country' AND audience_value IS NOT NULL)
    )
  )
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_email_campaigns_audience_type 
ON email_campaigns(audience_type, audience_value);

-- Add comment to explain the structure
COMMENT ON COLUMN email_campaigns.audience_type IS 'Type of audience targeting: all_businesses, plan, language, country';
COMMENT ON COLUMN email_campaigns.audience_value IS 'Specific value for audience type (e.g., plan name, language code, country code)';
