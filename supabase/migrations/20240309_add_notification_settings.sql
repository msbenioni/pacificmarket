-- Create admin notification settings table
CREATE TABLE IF NOT EXISTS admin_notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  admin_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure one settings record per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_notification_settings_user_id ON admin_notification_settings(user_id);

-- Create index for JSONB settings queries
CREATE INDEX IF NOT EXISTS idx_admin_notification_settings_settings ON admin_notification_settings USING GIN(settings);

-- RLS policy for notification settings
ALTER TABLE admin_notification_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own notification settings
CREATE POLICY "Users can view own notification settings" ON admin_notification_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only update their own notification settings  
CREATE POLICY "Users can update own notification settings" ON admin_notification_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only insert their own notification settings
CREATE POLICY "Users can insert own notification settings" ON admin_notification_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_admin_notification_settings_updated_at
  BEFORE UPDATE ON admin_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
