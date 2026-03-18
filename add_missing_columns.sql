-- Add back cultural_identity and languages_spoken columns to businesses table
-- Run this in Supabase SQL Editor first

-- Add cultural_identity column
ALTER TABLE businesses 
ADD COLUMN cultural_identity TEXT;

-- Add languages_spoken column  
ALTER TABLE businesses 
ADD COLUMN languages_spoken TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name IN ('cultural_identity', 'languages_spoken');
