-- Only keep msbenioni@ as admin, set others back to owner
UPDATE profiles 
SET role = 'owner' 
WHERE private_email LIKE '%msbenioni%' 
  AND private_email != 'msbenioni@gmail.com';

-- Verify the changes
SELECT id, display_name, private_email, role 
FROM profiles 
WHERE private_email LIKE '%msbenioni%' 
   OR role = 'admin'
ORDER BY role, display_name;
