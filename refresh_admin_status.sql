-- Force refresh your admin status and clear any session issues
-- This updates your profile and ensures proper admin role

-- First, let's verify your current role
SELECT id, display_name, private_email, role, updated_at 
FROM profiles 
WHERE private_email = 'msbenioni@gmail.com';

-- Force update your profile to trigger role refresh
UPDATE profiles 
SET role = 'admin', 
    updated_at = NOW()
WHERE private_email = 'msbenioni@gmail.com';

-- Verify the update
SELECT id, display_name, private_email, role, updated_at 
FROM profiles 
WHERE private_email = 'msbenioni@gmail.com';
