-- Add unique constraint to prevent duplicate admin users
-- This ensures each user can only have one admin record

-- Add unique constraint on owner_user_id
ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_owner_user_id_unique 
UNIQUE (owner_user_id);

-- Verify the constraint was added
SELECT conname, contype FROM pg_constraint 
WHERE conrelid = 'public.admin_users'::regclass 
AND conname = 'admin_users_owner_user_id_unique';
