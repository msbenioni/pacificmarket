-- Fix business_insights schema issue
-- Add missing user_id column if it doesn't exist

DO $$ 
BEGIN
    -- Check if user_id column exists in business_insights
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'business_insights' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE business_insights 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added missing user_id column to business_insights table';
    END IF;
END $$;
