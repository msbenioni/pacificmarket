-- Update triggers to use Supabase webhooks instead of pg_notify
-- This will be configured in Supabase dashboard to call our Edge Function

-- Drop old triggers
DROP TRIGGER IF EXISTS trigger_business_created_notification ON businesses;
DROP TRIGGER IF EXISTS trigger_claim_created_notification ON claim_requests;

-- Update functions to prepare for webhook calls
CREATE OR REPLACE FUNCTION handle_business_created_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for user-created businesses, not admin-created
    IF NEW.created_via IN ('user_claim_modal', 'user_portal') THEN
        -- Webhook will be triggered by Supabase based on this trigger
        -- The webhook payload will include the NEW row data
        RAISE LOG 'Business created notification: % (%)', NEW.business_name, NEW.created_via;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_claim_created_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for user-submitted claims, not admin-created
    -- Skip direct claims to avoid duplicate notifications
    IF NEW.created_via IN ('user_claim_modal', 'user_portal') AND NEW.claim_type = 'request' THEN
        -- Webhook will be triggered by Supabase based on this trigger
        RAISE LOG 'Claim created notification: % (%)', NEW.business_id, NEW.created_via;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers
CREATE TRIGGER trigger_business_created_notification
    AFTER INSERT ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION handle_business_created_notification();

CREATE TRIGGER trigger_claim_created_notification
    AFTER INSERT ON claim_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_claim_created_notification();
