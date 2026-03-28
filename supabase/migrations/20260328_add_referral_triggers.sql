-- Add database triggers for automated referral reward processing
-- Created: 2026-03-28
-- Purpose: Automatically create pending rewards and apply them when businesses become active

-- Trigger 1: Create pending reward when business with referral is created
CREATE OR REPLACE FUNCTION public.trigger_create_pending_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create pending reward if business has a referrer
    IF NEW.referred_by_business_id IS NOT NULL THEN
        PERFORM public.create_pending_referral_reward(NEW.id);
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the insert
        RAISE WARNING 'Failed to create pending referral reward in trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for business inserts
DROP TRIGGER IF EXISTS on_business_insert_create_pending_referral_reward ON public.businesses;
CREATE TRIGGER on_business_insert_create_pending_referral_reward
    AFTER INSERT ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_create_pending_referral_reward();

-- Trigger 2: Apply referral reward when business becomes active
CREATE OR REPLACE FUNCTION public.trigger_apply_referral_reward_on_activation()
RETURNS TRIGGER AS $$
DECLARE
    v_result JSON;
BEGIN
    -- Only apply reward if status changed to 'active' and business has a referrer
    IF NEW.status = 'active' 
       AND OLD.status != 'active' 
       AND NEW.referred_by_business_id IS NOT NULL THEN
        
        -- Apply the referral reward
        v_result := public.apply_referral_reward_for_business(NEW.id);
        
        -- Log the result for debugging
        IF v_result->>'success' = 'true' THEN
            RAISE LOG 'Referral reward applied: %', v_result;
        ELSE
            RAISE WARNING 'Referral reward application failed: %', v_result;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the update
        RAISE WARNING 'Failed to apply referral reward in trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for business updates
DROP TRIGGER IF EXISTS on_business_update_apply_referral_reward ON public.businesses;
CREATE TRIGGER on_business_update_apply_referral_reward
    AFTER UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_apply_referral_reward_on_activation();

-- Trigger 3: Handle business updates that affect eligibility
CREATE OR REPLACE FUNCTION public.trigger_update_referral_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    -- Update reward eligibility when referrer or referred business changes
    -- This handles cases where a referrer becomes inactive or a referral is removed
    
    -- If referrer changed or referrer status changed, update eligibility
    IF (OLD.referred_by_business_id IS DISTINCT FROM NEW.referred_by_business_id) THEN
        -- Referral was added or removed, update/create pending record
        IF NEW.referred_by_business_id IS NOT NULL THEN
            PERFORM public.create_pending_referral_reward(NEW.id);
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the update
        RAISE WARNING 'Failed to update referral eligibility in trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for business updates affecting eligibility
DROP TRIGGER IF EXISTS on_business_update_referral_eligibility ON public.businesses;
CREATE TRIGGER on_business_update_referral_eligibility
    AFTER UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_referral_eligibility();

-- Add comments for triggers
COMMENT ON FUNCTION public.trigger_create_pending_referral_reward() IS 'Creates pending referral reward records when businesses with referrals are inserted.';
COMMENT ON FUNCTION public.trigger_apply_referral_reward_on_activation() IS 'Applies referral rewards when businesses become active status.';
COMMENT ON FUNCTION public.trigger_update_referral_eligibility() IS 'Updates referral eligibility when business relationships change.';

-- Create a helper function for manual reward processing (admin use)
CREATE OR REPLACE FUNCTION public.process_pending_referral_rewards()
RETURNS JSON AS $$
DECLARE
    v_pending_rewards RECORD;
    v_processed_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    v_skipped_count INTEGER := 0;
    v_result JSON;
BEGIN
    -- Process all pending rewards for eligible businesses
    FOR v_pending_rewards IN 
        SELECT r.id, r.referred_business_id
        FROM public.business_referral_rewards r
        WHERE r.status = 'pending'
    LOOP
        BEGIN
            -- Try to apply the reward
            v_result := public.apply_referral_reward_for_business(v_pending_rewards.referred_business_id);
            
            IF v_result->>'success' = 'true' THEN
                v_processed_count := v_processed_count + 1;
            ELSIF v_result->>'action' = 'already_applied' THEN
                v_skipped_count := v_skipped_count + 1;
            ELSE
                v_failed_count := v_failed_count + 1;
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                v_failed_count := v_failed_count + 1;
                RAISE WARNING 'Failed to process pending reward %: %', v_pending_rewards.id, SQLERRM;
        END;
    END LOOP;
    
    RETURN json_build_object(
        'success', true,
        'processed', v_processed_count,
        'skipped', v_skipped_count,
        'failed', v_failed_count,
        'total_attempted', v_processed_count + v_skipped_count + v_failed_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission for manual processing
GRANT EXECUTE ON FUNCTION public.process_pending_referral_rewards TO service_role;

COMMENT ON FUNCTION public.process_pending_referral_rewards() IS 'Processes all pending referral rewards for eligible businesses. Useful for backfills and manual corrections.';
