-- Backfill and repair script for historic referral rewards
-- Created: 2026-03-28
-- Purpose: Process existing referrals that may have missed rewards under the new system

-- Create a temporary function to safely backfill missed rewards
CREATE OR REPLACE FUNCTION public.backfill_historic_referral_rewards()
RETURNS JSON AS $$
DECLARE
    v_businesses_with_referrals RECORD;
    v_processed_count INTEGER := 0;
    v_skipped_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    v_result JSON;
    v_reward_result JSON;
BEGIN
    -- RAISE NOTICE 'Starting backfill of historic referral rewards...';
    
    -- Find all businesses with referrals that might need reward processing
    FOR v_businesses_with_referrals IN 
        SELECT 
            b.id as business_id,
            b.business_name,
            b.referred_by_business_id,
            b.status,
            b.referral_reward_applied,
            b.tier_expires_at,
            b.referral_count,
            rb.id as existing_reward_id,
            rb.status as reward_status,
            rb.applied_at as reward_applied_at
        FROM public.businesses b
        LEFT JOIN public.business_referral_rewards rb ON b.id = rb.referred_business_id
        WHERE b.referred_by_business_id IS NOT NULL
        ORDER BY b.created_at ASC
    LOOP
        BEGIN
            -- RAISE NOTICE 'Processing business: % (referrer: %)', v_businesses_with_referrals.business_name, v_businesses_with_referrals.referred_by_business_id;
            
            -- Check if this business already has a processed reward in the new system
            IF v_businesses_with_referrals.existing_reward_id IS NOT NULL 
               AND v_businesses_with_referrals.reward_status = 'applied' THEN
                -- Already processed, skip
                v_skipped_count := v_skipped_count + 1;
                -- RAISE NOTICE 'Skipping % - reward already applied on %', v_businesses_with_referrals.business_name, v_businesses_with_referrals.reward_applied_at;
                CONTINUE;
            END IF;
            
            -- Try to apply the reward using our canonical function
            v_reward_result := public.apply_referral_reward_for_business(v_businesses_with_referrals.business_id);
            
            IF v_reward_result->>'success' = 'true' THEN
                v_processed_count := v_processed_count + 1;
                -- RAISE NOTICE 'Applied reward for %: %', v_businesses_with_referrals.business_name, v_reward_result->>'message';
            ELSIF v_reward_result->>'action' = 'already_applied' THEN
                v_skipped_count := v_skipped_count + 1;
                -- RAISE NOTICE 'Reward already applied for %: %', v_businesses_with_referrals.business_name, v_reward_result->>'message';
            ELSIF v_reward_result->>'action' = 'none' THEN
                -- Not eligible, but that's expected
                v_skipped_count := v_skipped_count + 1;
                -- RAISE NOTICE 'Business % not eligible: %', v_businesses_with_referrals.business_name, v_reward_result->>'reason';
            ELSE
                v_failed_count := v_failed_count + 1;
                -- RAISE WARNING 'Failed to process reward for %: %', v_businesses_with_referrals.business_name, v_reward_result->>'error';
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                v_failed_count := v_failed_count + 1;
                RAISE WARNING 'Exception processing business %: %', v_businesses_with_referrals.business_name, SQLERRM;
        END;
    END LOOP;
    
    -- Return summary
    v_result := json_build_object(
        'success', true,
        'message', 'Backfill completed',
        'processed', v_processed_count,
        'skipped', v_skipped_count,
        'failed', v_failed_count,
        'total_attempted', v_processed_count + v_skipped_count + v_failed_count,
        'completed_at', now()
    );
    
    -- RAISE NOTICE 'Backfill summary: % processed, % skipped, % failed', v_processed_count, v_skipped_count, v_failed_count;
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
    v_result := json_build_object(
        'success', false,
        'error', 'Backfill failed: ' || SQLERRM,
        'detail', SQLSTATE,
        'processed', v_processed_count,
        'skipped', v_skipped_count,
        'failed', v_failed_count
    );
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get backfill eligibility report without applying rewards
CREATE OR REPLACE FUNCTION public.get_referral_backfill_report()
RETURNS JSON AS $$
DECLARE
    v_report JSON;
    v_eligible_count INTEGER := 0;
    v_pending_count INTEGER := 0;
    v_applied_count INTEGER := 0;
    v_ineligible_count INTEGER := 0;
    v_total_referrals INTEGER := 0;
BEGIN
    -- Count total businesses with referrals
    SELECT COUNT(*) INTO v_total_referrals
    FROM public.businesses 
    WHERE referred_by_business_id IS NOT NULL;
    
    -- Count eligible for reward (active with referrer, no reward applied)
    SELECT COUNT(*) INTO v_eligible_count
    FROM public.businesses b
    WHERE b.referred_by_business_id IS NOT NULL
    AND b.status = 'active'
    AND NOT EXISTS (
        SELECT 1 FROM public.business_referral_rewards r 
        WHERE r.referred_business_id = b.id 
        AND r.status = 'applied'
    );
    
    -- Count pending rewards in new system
    SELECT COUNT(*) INTO v_pending_count
    FROM public.business_referral_rewards 
    WHERE status = 'pending';
    
    -- Count already applied rewards in new system
    SELECT COUNT(*) INTO v_applied_count
    FROM public.business_referral_rewards 
    WHERE status = 'applied';
    
    -- Count ineligible (not active or other issues)
    v_ineligible_count := v_total_referrals - v_eligible_count - v_applied_count;
    
    v_report := json_build_object(
        'total_referrals', v_total_referrals,
        'eligible_for_reward', v_eligible_count,
        'pending_rewards', v_pending_count,
        'already_applied', v_applied_count,
        'ineligible', v_ineligible_count,
        'report_generated_at', now()
    );
    
    RETURN v_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.backfill_historic_referral_rewards TO service_role;
GRANT EXECUTE ON FUNCTION public.get_referral_backfill_report TO service_role;

-- Add comments
COMMENT ON FUNCTION public.backfill_historic_referral_rewards() IS 'Processes all existing referral relationships and applies missed rewards using the new canonical system. Safe to run multiple times (idempotent).';
COMMENT ON FUNCTION public.get_referral_backfill_report() IS 'Returns a report of referral reward eligibility without applying any rewards. Useful for planning backfills.';

-- Create an API endpoint for admin backfill (optional - can be called manually)
-- This would go in a separate file: src/app/api/admin/referrals/backfill/route.js

-- Sample backfill execution query (for manual execution):
-- SELECT public.backfill_historic_referral_rewards();

-- Sample backfill report query:
-- SELECT public.get_referral_backfill_report();
