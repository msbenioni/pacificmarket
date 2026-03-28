-- Create triggers for automatic notifications
CREATE TRIGGER trigger_business_created_notification
    AFTER INSERT ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION handle_business_created_notification();

CREATE TRIGGER trigger_claim_created_notification
    AFTER INSERT ON claim_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_claim_created_notification();
