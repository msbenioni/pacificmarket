-- Update current user back to admin role
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE private_email = 'msbenioni@gmail.com' 
   OR private_email LIKE '%msbenioni%';

-- Verify the update
SELECT id, display_name, private_email, role 
FROM profiles 
WHERE private_email LIKE '%msbenioni%' 
   OR role = 'admin'
ORDER BY role, display_name;
