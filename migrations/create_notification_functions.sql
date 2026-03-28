-- Function to send admin notification for new business
CREATE OR REPLACE FUNCTION handle_business_created_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for user-created businesses, not admin-created
    IF NEW.created_via IN ('user_claim_modal', 'user_portal') THEN
        -- This will be called by a webhook/edge function
        -- For now, we'll mark it as needing notification
        PERFORM pg_notify('admin_notification', 
            json_build_object(
                'type', 'business_created',
                'business_id', NEW.id,
                'business_name', NEW.business_name,
                'owner_id', NEW.owner_user_id,
                'created_via', NEW.created_via
            )::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to send admin notification for new claim
CREATE OR REPLACE FUNCTION handle_claim_created_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for user-submitted claims, not admin-created
    IF NEW.created_via IN ('user_claim_modal', 'user_portal') THEN
        -- This will be called by a webhook/edge function
        PERFORM pg_notify('admin_notification', 
            json_build_object(
                'type', 'claim_created',
                'claim_id', NEW.id,
                'business_id', NEW.business_id,
                'user_id', NEW.user_id,
                'created_via', NEW.created_via
            )::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
