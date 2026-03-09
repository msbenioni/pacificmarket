-- Schema verification for email marketing system
-- Run this to verify all required columns exist

-- Check if email_campaign_recipients table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_campaign_recipients'
    ) THEN
        RAISE EXCEPTION 'email_campaign_recipients table does not exist';
    END IF;
END $$;

-- Check if provider_message_id column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'email_campaign_recipients' 
        AND column_name = 'provider_message_id'
    ) THEN
        RAISE EXCEPTION 'provider_message_id column does not exist in email_campaign_recipients table';
    END IF;
END $$;

-- Check if error_message column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'email_campaign_recipients' 
        AND column_name = 'error_message'
    ) THEN
        RAISE EXCEPTION 'error_message column does not exist in email_campaign_recipients table';
    END IF;
END $$;

-- Check if unique constraint exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'email_campaign_recipients_unique_campaign_email'
        AND table_schema = 'public'
        AND table_name = 'email_campaign_recipients'
    ) THEN
        RAISE EXCEPTION 'unique constraint email_campaign_recipients_unique_campaign_email does not exist';
    END IF;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All required schema elements verified:';
    RAISE NOTICE '   - email_campaign_recipients table exists';
    RAISE NOTICE '   - provider_message_id column exists';
    RAISE NOTICE '   - error_message column exists';
    RAISE NOTICE '   - unique constraint exists';
    RAISE NOTICE '✅ Email marketing system schema is ready!';
END $$;
