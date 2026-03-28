-- Migration: Fix remaining referral system risks
-- 
-- FIX 1: Tier expiry enforcement via pg_cron (daily downgrade of expired moana tiers)
-- FIX 2: Unify duplicate RPC functions (apply_referral_moana_reward wraps canonical)
-- FIX 3: Improve trigger error handling (log to audit_logs instead of silent swallow)

-- ============================================================
-- FIX 1: Enable pg_cron + tier expiry enforcement
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.expire_moana_tiers()
RETURNS JSON AS $$
DECLARE
    v_expired_count INTEGER;
    v_result JSON;
BEGIN
    -- Downgrade businesses whose moana tier has expired
    WITH expired AS (
        UPDATE public.businesses
        SET 
            subscription_tier = 'vaka',
            visibility_tier = CASE 
                WHEN visibility_mode = 'manual' THEN visibility_tier 
                ELSE 'none' 
            END,
            updated_at = now()
        WHERE subscription_tier = 'moana'
          AND tier_expires_at IS NOT NULL
          AND tier_expires_at < now()
          AND status = 'active'
        RETURNING id, business_name, tier_expires_at
    )
    SELECT COUNT(*) INTO v_expired_count FROM expired;

    -- Log each expiry to audit_logs for traceability
    IF v_expired_count > 0 THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, new_data, user_id)
        SELECT 
            'businesses',
            b.id,
            'tier_expired',
            jsonb_build_object(
                'previous_tier', 'moana',
                'new_tier', 'vaka',
                'expired_at', b.tier_expires_at,
                'processed_at', now()
            ),
            NULL
        FROM public.businesses b
        WHERE b.subscription_tier = 'vaka'
          AND b.updated_at >= now() - interval '1 minute'
          AND b.tier_expires_at IS NOT NULL
          AND b.tier_expires_at < now();

        RAISE LOG 'Expired % moana tier(s)', v_expired_count;
    END IF;

    v_result := json_build_object(
        'success', true,
        'expired_count', v_expired_count,
        'processed_at', now()
    );
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        v_result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'detail', SQLSTATE
        );
        RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule daily at midnight UTC
SELECT cron.schedule(
    'expire-moana-tiers',
    '0 0 * * *',
    $$SELECT public.expire_moana_tiers()$$
);

-- ============================================================
-- FIX 2: Unify duplicate RPC functions
-- apply_referral_moana_reward becomes a thin wrapper that delegates
-- to the canonical apply_referral_reward_for_business function
-- ============================================================
CREATE OR REPLACE FUNCTION public.apply_referral_moana_reward(p_new_business_id UUID)
RETURNS JSON AS $$
DECLARE
    v_canonical_result JSON;
    v_result JSON;
BEGIN
    -- Delegate to the canonical function (single source of truth)
    v_canonical_result := public.apply_referral_reward_for_business(p_new_business_id);

    -- If it failed, return the error as-is
    IF (v_canonical_result->>'success')::boolean IS NOT TRUE THEN
        RETURN v_canonical_result;
    END IF;

    -- Remap response fields for backward compatibility with admin API route
    v_result := json_build_object(
        'success', true,
        'message', COALESCE(v_canonical_result->>'message', 'Referral reward applied successfully'),
        'new_business_expiry', v_canonical_result->>'referred_expiry_date',
        'referrer_business_expiry', v_canonical_result->>'referrer_expiry_date',
        'new_business_name', v_canonical_result->>'referred_business_name',
        'referrer_business_name', v_canonical_result->>'referrer_business_name'
    );

    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'detail', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FIX 3: Improve trigger error handling with audit logging
-- Logs success, failure, and exceptions to audit_logs table
-- instead of silently swallowing errors
-- ============================================================
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
        
        IF (v_result->>'success')::boolean = true THEN
            RAISE LOG 'Referral reward applied for business %: %', NEW.id, v_result;
            
            INSERT INTO public.audit_logs (table_name, record_id, action, new_data)
            VALUES (
                'businesses',
                NEW.id,
                'referral_reward_applied',
                jsonb_build_object(
                    'result', v_result::text,
                    'referred_business_id', NEW.id,
                    'referrer_business_id', NEW.referred_by_business_id,
                    'triggered_by', 'on_activation'
                )
            );
        ELSE
            RAISE WARNING 'Referral reward application FAILED for business %: %', NEW.id, v_result;
            
            INSERT INTO public.audit_logs (table_name, record_id, action, new_data)
            VALUES (
                'businesses',
                NEW.id,
                'referral_reward_failed',
                jsonb_build_object(
                    'error', v_result->>'error',
                    'reason', v_result->>'reason',
                    'referred_business_id', NEW.id,
                    'referrer_business_id', NEW.referred_by_business_id,
                    'triggered_by', 'on_activation'
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error to audit_logs instead of silently swallowing
        BEGIN
            INSERT INTO public.audit_logs (table_name, record_id, action, new_data)
            VALUES (
                'businesses',
                NEW.id,
                'referral_reward_exception',
                jsonb_build_object(
                    'error', SQLERRM,
                    'sqlstate', SQLSTATE,
                    'referred_business_id', NEW.id,
                    'referrer_business_id', NEW.referred_by_business_id,
                    'triggered_by', 'on_activation'
                )
            );
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Failed to log referral trigger error: %', SQLERRM;
        END;
        
        RAISE WARNING 'Referral reward trigger exception for business %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
