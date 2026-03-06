-- Add business invitation fields to profiles table
-- These fields allow tracking pending business ownership invitations

-- Add invitation tracking fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS pending_business_id UUID REFERENCES businesses(id),
ADD COLUMN IF NOT EXISTS pending_business_name TEXT,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS invited_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add index for faster lookups of pending invitations
CREATE INDEX IF NOT EXISTS idx_profiles_pending_business_id ON profiles(pending_business_id) WHERE pending_business_id IS NOT NULL;

-- Add comment to explain the new fields
COMMENT ON COLUMN profiles.pending_business_id IS 'ID of business the user is invited to manage (null if no pending invitation)';
COMMENT ON COLUMN profiles.pending_business_name IS 'Name of business the user is invited to manage (for display purposes)';
COMMENT ON COLUMN profiles.invited_by IS 'ID of user who sent the business invitation';
COMMENT ON COLUMN profiles.invited_date IS 'When the business invitation was sent';
COMMENT ON COLUMN profiles.status IS 'Profile status: active, pending_invitation, etc.';
