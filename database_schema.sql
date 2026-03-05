


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'Subscription tables removed - platform is now directory-focused';



CREATE TYPE "public"."app_role" AS ENUM (
    'buyer',
    'seller',
    'admin'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."boost_placement" AS ENUM (
    'homepage',
    'category',
    'search_priority'
);


ALTER TYPE "public"."boost_placement" OWNER TO "postgres";


CREATE TYPE "public"."coupon_type" AS ENUM (
    'PERCENT',
    'FIXED'
);


ALTER TYPE "public"."coupon_type" OWNER TO "postgres";


CREATE TYPE "public"."item_status" AS ENUM (
    'new',
    'processing',
    'shipped',
    'delivered',
    'refunded'
);


ALTER TYPE "public"."item_status" OWNER TO "postgres";


CREATE TYPE "public"."member_role" AS ENUM (
    'owner',
    'admin',
    'staff'
);


ALTER TYPE "public"."member_role" OWNER TO "postgres";


CREATE TYPE "public"."message_status" AS ENUM (
    'unread',
    'read',
    'archived'
);


ALTER TYPE "public"."message_status" OWNER TO "postgres";


CREATE TYPE "public"."mod_status" AS ENUM (
    'open',
    'approved',
    'rejected'
);


ALTER TYPE "public"."mod_status" OWNER TO "postgres";


CREATE TYPE "public"."mod_target" AS ENUM (
    'product',
    'seller'
);


ALTER TYPE "public"."mod_target" OWNER TO "postgres";


CREATE TYPE "public"."order_status" AS ENUM (
    'pending',
    'paid',
    'processing',
    'shipped',
    'completed',
    'cancelled',
    'refunded'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'requires_payment',
    'processing',
    'paid',
    'failed',
    'cancelled',
    'refunded',
    'partial_refund'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."product_type" AS ENUM (
    'physical',
    'digital',
    'service'
);


ALTER TYPE "public"."product_type" OWNER TO "postgres";


CREATE TYPE "public"."publish_status" AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE "public"."publish_status" OWNER TO "postgres";


CREATE TYPE "public"."review_status" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'hidden'
);


ALTER TYPE "public"."review_status" OWNER TO "postgres";


CREATE TYPE "public"."seller_offering_type" AS ENUM (
    'physical_product',
    'digital_product',
    'service'
);


ALTER TYPE "public"."seller_offering_type" OWNER TO "postgres";


CREATE TYPE "public"."seller_type" AS ENUM (
    'products',
    'services',
    'hybrid'
);


ALTER TYPE "public"."seller_type" OWNER TO "postgres";


CREATE TYPE "public"."service_status" AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE "public"."service_status" OWNER TO "postgres";


CREATE TYPE "public"."shipping_method" AS ENUM (
    'pass_the_parcel',
    'manual',
    'pickup',
    'free'
);


ALTER TYPE "public"."shipping_method" OWNER TO "postgres";


CREATE TYPE "public"."subscription_plan_type" AS ENUM (
    'free',
    'pro'
);


ALTER TYPE "public"."subscription_plan_type" OWNER TO "postgres";


CREATE TYPE "public"."subscription_status" AS ENUM (
    'trial',
    'active',
    'past_due',
    'canceled',
    'inactive'
);


ALTER TYPE "public"."subscription_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_shipment_tracking_event"("p_shipment_id" bigint, "p_status" "text", "p_location" "text" DEFAULT NULL::"text", "p_description" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_event jsonb;
BEGIN
  v_event := jsonb_build_object(
    'timestamp', now(),
    'status', p_status,
    'location', p_location,
    'description', p_description
  );
  
  UPDATE public.shipments
  SET 
    tracking_events = tracking_events || v_event,
    last_tracking_update = now(),
    status = p_status
  WHERE id = p_shipment_id;
END;
$$;


ALTER FUNCTION "public"."add_shipment_tracking_event"("p_shipment_id" bigint, "p_status" "text", "p_location" "text", "p_description" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."allocate_monthly_boost_credits"() RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_seller RECORD;
  v_allocation_cents integer;
BEGIN
  -- Get Pro sellers who need monthly credit allocation
  FOR v_seller IN
    SELECT s.id, s.last_credit_allocation_at
    FROM public.sellers s
    WHERE s.current_plan = 'pro'
      AND (
        s.last_credit_allocation_at IS NULL
        OR s.last_credit_allocation_at < date_trunc('month', CURRENT_DATE)
      )
  LOOP
    -- Get monthly allocation amount
    SELECT monthly_boost_credits_cents INTO v_allocation_cents
    FROM public.subscription_plans
    WHERE id = 'pro';

    -- Add credits
    INSERT INTO public.boost_credits (seller_id, amount_cents, balance_cents, type, description)
    SELECT
      v_seller.id,
      v_allocation_cents,
      COALESCE(
        (SELECT boost_credits_cents FROM public.sellers WHERE id = v_seller.id),
        0
      ) + v_allocation_cents,
      'monthly_allocation',
      'Monthly Pro plan boost credits';

    -- Update seller balance
    UPDATE public.sellers
    SET
      boost_credits_cents = boost_credits_cents + v_allocation_cents,
      last_credit_allocation_at = CURRENT_DATE
    WHERE id = v_seller.id;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."allocate_monthly_boost_credits"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_trigger_function"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."audit_trigger_function"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_initialize_service_subscription"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Pro sellers get service subscription trial
  IF NEW.seller_tier = 'pro' AND NEW.service_subscription_status IS NULL THEN
    NEW.service_subscription_status := 'trial';
    NEW.trial_ends_at := now() + interval '1 month';
    NEW.service_subscription_started_at := now();
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_initialize_service_subscription"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_commission_bps"("p_seller_id" bigint) RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_seller_tier TEXT;
BEGIN
  SELECT seller_tier INTO v_seller_tier
  FROM sellers
  WHERE id = p_seller_id;

  -- All sellers pay 6.5% commission (650 basis points)
  -- Both fixed_price and pro sellers have the same commission rate
  RETURN 650;
END;
$$;


ALTER FUNCTION "public"."calculate_commission_bps"("p_seller_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_commission_for_seller"("p_seller_id" "uuid", "p_subtotal_cents" integer) RETURNS integer
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_seller_type seller_type;
  v_commission_bps integer;
BEGIN
  -- Get seller type and commission rate
  SELECT seller_type, commission_bps
  INTO v_seller_type, v_commission_bps
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Service-only sellers have no commission
  IF v_seller_type = 'services' THEN
    RETURN 0;
  END IF;

  -- Product and hybrid sellers pay 6% commission on products
  IF v_commission_bps IS NOT NULL THEN
    RETURN ROUND(p_subtotal_cents * v_commission_bps / 10000.0)::integer;
  END IF;

  RETURN 0;
END;
$$;


ALTER FUNCTION "public"."calculate_commission_for_seller"("p_seller_id" "uuid", "p_subtotal_cents" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_monthly_fee"("p_seller_id" bigint) RETURNS numeric
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $_$
DECLARE
  v_seller_tier TEXT;
  v_subscription_status TEXT;
BEGIN
  SELECT seller_tier, service_subscription_status INTO v_seller_tier, v_subscription_status
  FROM sellers
  WHERE id = p_seller_id;

  -- Fixed price sellers pay no monthly fee (FREE tier)
  IF v_seller_tier = 'fixed_price' THEN
    RETURN 0;
  END IF;

  -- Pro sellers pay $24.99/month (after trial)
  IF v_seller_tier = 'pro' THEN
    -- If in trial, no charge
    IF v_subscription_status = 'trial' THEN
      RETURN 0;
    END IF;
    
    -- Active subscription
    IF v_subscription_status = 'active' THEN
      RETURN 24.99;
    END IF;
  END IF;

  RETURN 0;
END;
$_$;


ALTER FUNCTION "public"."calculate_monthly_fee"("p_seller_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_platform_fee"("p_order_id" bigint, "p_seller_id" bigint, "p_subtotal_cents" integer, "p_fee_rate" numeric DEFAULT 9.50) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_fee_cents int;
  v_net_payout_cents int;
BEGIN
  -- Calculate fee (rounded)
  v_fee_cents := ROUND(p_subtotal_cents * p_fee_rate / 100.0);
  
  -- Calculate net payout
  v_net_payout_cents := p_subtotal_cents - v_fee_cents;
  
  -- Insert or update platform fee
  INSERT INTO public.platform_fees (
    order_id,
    seller_id,
    subtotal_cents,
    fee_rate,
    fee_cents,
    net_seller_payout_cents
  ) VALUES (
    p_order_id,
    p_seller_id,
    p_subtotal_cents,
    p_fee_rate,
    v_fee_cents,
    v_net_payout_cents
  )
  ON CONFLICT (order_id) DO UPDATE SET
    subtotal_cents = EXCLUDED.subtotal_cents,
    fee_rate = EXCLUDED.fee_rate,
    fee_cents = EXCLUDED.fee_cents,
    net_seller_payout_cents = EXCLUDED.net_seller_payout_cents;
END;
$$;


ALTER FUNCTION "public"."calculate_platform_fee"("p_order_id" bigint, "p_seller_id" bigint, "p_subtotal_cents" integer, "p_fee_rate" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_seller_commission"("p_seller_id" bigint, "p_subtotal_cents" integer) RETURNS integer
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_commission_bps integer;
BEGIN
  -- Get seller's commission rate
  SELECT commission_bps INTO v_commission_bps
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Calculate commission (subtotal only, excludes shipping)
  RETURN ROUND(p_subtotal_cents * v_commission_bps / 10000.0)::integer;
END;
$$;


ALTER FUNCTION "public"."calculate_seller_commission"("p_seller_id" bigint, "p_subtotal_cents" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_seller_net"("p_gross_cents" integer, "p_commission_rate" numeric DEFAULT 0.06, "p_reserve_bps" integer DEFAULT 0) RETURNS TABLE("net_cents" integer, "commission_cents" integer, "reserve_cents" integer)
    LANGUAGE "plpgsql" IMMUTABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN QUERY SELECT
    (p_gross_cents - ROUND(p_gross_cents * p_commission_rate) - ROUND(p_gross_cents * p_reserve_bps / 10000.0))::integer AS net_cents,
    ROUND(p_gross_cents * p_commission_rate)::integer AS commission_cents,
    ROUND(p_gross_cents * p_reserve_bps / 10000.0)::integer AS reserve_cents;
END;
$$;


ALTER FUNCTION "public"."calculate_seller_net"("p_gross_cents" integer, "p_commission_rate" numeric, "p_reserve_bps" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_expired_directory_subscriptions"() RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Update sellers with expired subscriptions
  UPDATE sellers s
  SET 
    directory_tier = 'free',
    directory_subscription_status = 'expired'
  FROM directory_subscriptions ds
  WHERE 
    s.id = ds.seller_id
    AND ds.status = 'active'
    AND ds.expires_at < NOW()
    AND s.directory_tier = 'standard';
    
  -- Update subscription records
  UPDATE directory_subscriptions
  SET status = 'expired'
  WHERE 
    status = 'active'
    AND expires_at < NOW();
END;
$$;


ALTER FUNCTION "public"."check_expired_directory_subscriptions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_order_item_target"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Exactly one of product_id or service_id must be set
  IF (NEW.product_id IS NULL AND NEW.service_id IS NULL) THEN
    RAISE EXCEPTION 'Either product_id or service_id must be set';
  END IF;

  IF (NEW.product_id IS NOT NULL AND NEW.service_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Cannot set both product_id and service_id';
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_order_item_target"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_follower_notifications"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Insert notification for each follower of this seller
  INSERT INTO follower_notifications (buyer_id, seller_id, activity_id)
  SELECT buyer_id, NEW.seller_id, NEW.id
  FROM seller_follows
  WHERE seller_id = NEW.seller_id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_follower_notifications"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_product_boost"("p_seller_id" bigint, "p_product_id" bigint, "p_placement" "public"."boost_placement", "p_duration_days" integer, "p_cost_cents" integer) RETURNS bigint
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_boost_id bigint;
  v_current_balance integer;
BEGIN
  -- Check seller has enough credits
  SELECT boost_credits_cents INTO v_current_balance
  FROM public.sellers
  WHERE id = p_seller_id;

  IF v_current_balance < p_cost_cents THEN
    RAISE EXCEPTION 'Insufficient boost credits. Current balance: %', v_current_balance;
  END IF;

  -- Create boost
  INSERT INTO public.product_boosts (
    seller_id,
    product_id,
    placement,
    cost_cents,
    starts_at,
    ends_at,
    status
  ) VALUES (
    p_seller_id,
    p_product_id,
    p_placement,
    p_cost_cents,
    now(),
    now() + (p_duration_days || ' days')::interval,
    'active'
  )
  RETURNING id INTO v_boost_id;

  -- Deduct credits
  INSERT INTO public.boost_credits (seller_id, amount_cents, balance_cents, type, reference_id, description)
  VALUES (
    p_seller_id,
    -p_cost_cents,
    v_current_balance - p_cost_cents,
    'spent',
    v_boost_id::text,
    'Boost: ' || p_placement || ' for ' || p_duration_days || ' days'
  );

  -- Update seller balance
  UPDATE public.sellers
  SET boost_credits_cents = boost_credits_cents - p_cost_cents
  WHERE id = p_seller_id;

  RETURN v_boost_id;
END;
$$;


ALTER FUNCTION "public"."create_product_boost"("p_seller_id" bigint, "p_product_id" bigint, "p_placement" "public"."boost_placement", "p_duration_days" integer, "p_cost_cents" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ensure_single_default_address"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- If setting as default shipping, unset others
  IF NEW.is_default_shipping = true THEN
    UPDATE public.addresses 
    SET is_default_shipping = false 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default_shipping = true;
  END IF;
  
  -- If setting as default billing, unset others
  IF NEW.is_default_billing = true THEN
    UPDATE public.addresses 
    SET is_default_billing = false 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default_billing = true;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."ensure_single_default_address"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_claim_code"("listing_id" bigint) RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_handle TEXT;
  v_random TEXT;
  v_claim_code TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Get the shop handle
  SELECT business_handle INTO v_handle
  FROM admin_directory_listings
  WHERE id = listing_id;
  
  IF v_handle IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;
  
  -- Generate unique code
  LOOP
    -- Generate random 4-character suffix
    v_random := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    
    -- Format: PM-{HANDLE}-{RANDOM}
    v_claim_code := 'PM-' || UPPER(REPLACE(v_handle, '-', '-')) || '-' || v_random;
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM admin_directory_listings WHERE claim_code = v_claim_code
    ) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  -- Update the listing with the claim code
  UPDATE admin_directory_listings
  SET claim_code = v_claim_code
  WHERE id = listing_id;
  
  RETURN v_claim_code;
END;
$$;


ALTER FUNCTION "public"."generate_claim_code"("listing_id" bigint) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."generate_claim_code"("listing_id" bigint) IS 'Generates a unique claim code for an admin directory listing. Format: PM-{HANDLE}-{RANDOM4}. Can only be called by admins. Uses fixed search_path for security.';



CREATE OR REPLACE FUNCTION "public"."generate_order_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  new_number text;
  exists_check boolean;
BEGIN
  LOOP
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN new_number;
END;
$$;


ALTER FUNCTION "public"."generate_order_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_quote_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  next_num INT;
  year_str TEXT;
BEGIN
  year_str := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 'QUOTE-\d{4}-(\d+)') AS INT)), 0) + 1
  INTO next_num
  FROM quotes
  WHERE quote_number LIKE 'QUOTE-' || year_str || '-%';
  
  RETURN 'QUOTE-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$;


ALTER FUNCTION "public"."generate_quote_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_transfer_group"("p_order_id" bigint) RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN 'order_' || p_order_id::text;
END;
$$;


ALTER FUNCTION "public"."generate_transfer_group"("p_order_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint) RETURNS TABLE("seller_id" bigint, "shop_name" "text", "currency" "text", "subtotal_cents" bigint, "platform_fee_percentage" numeric, "platform_fee_cents" bigint)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as seller_id,
    s.shop_name,
    COALESCE(ci.currency, 'NZD') as currency,
    SUM(ci.price_cents * ci.quantity)::bigint as subtotal_cents,
    COALESCE(s.platform_fee_percentage, 6.5) as platform_fee_percentage,
    FLOOR(SUM(ci.price_cents * ci.quantity) * COALESCE(s.platform_fee_percentage, 6.5) / 100)::bigint as platform_fee_cents
  FROM cart_items ci
  INNER JOIN sellers s ON ci.seller_id = s.id
  WHERE ci.cart_id = p_cart_id
  GROUP BY s.id, s.shop_name, ci.currency, s.platform_fee_percentage
  ORDER BY s.shop_name;
END;
$$;


ALTER FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint, "p_coupons" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("seller_id" bigint, "seller_name" "text", "seller_currency" "text", "platform_fee_percentage" numeric, "items" "jsonb", "subtotal_cents" bigint, "discount_cents" bigint, "shipping_cents" bigint, "tax_cents" bigint, "platform_fee_cents" bigint, "total_cents" bigint)
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
declare
begin
  return query
  with raw_items as (
    select
      ci.seller_id,
      jsonb_agg(jsonb_build_object(
        'cart_item_id', ci.id,
        'product_id',  ci.product_id,
        'quantity',    ci.quantity,
        'unit_amount', ci.price_cents,  -- minor units
        'currency',    ci.currency
      ) order by ci.id) as items,
      sum(ci.price_cents * ci.quantity)::bigint as subtotal_cents,
      min(ci.currency) as currency
    from cart_items ci
    where ci.cart_id = p_cart_id
    group by ci.seller_id
  ),
  coupon_map as (
    -- p_coupons = {"123":"WELCOME10","456":"SPRING5"}
    select (key)::bigint as seller_id, value::text as code
    from jsonb_each_text(p_coupons)
  ),
  discounts as (
    select
      ri.seller_id,
      coalesce((
        select v.discount_cents
        from validate_coupon_for_seller(
          ri.seller_id,
          cm.code,
          ri.currency,
          ri.subtotal_cents
        ) v
        limit 1
      ), 0)::bigint as discount_cents
    from raw_items ri
    left join coupon_map cm on cm.seller_id = ri.seller_id
  )
  select
    s.id                                as seller_id,
    s.shop_name                         as seller_name,
    coalesce(s.currency_code, ri.currency) as seller_currency,
    s.platform_fee_percentage,
    ri.items,
    ri.subtotal_cents,
    greatest(d.discount_cents, 0)::bigint as discount_cents,
    0::bigint                             as shipping_cents, -- fill in later
    0::bigint                             as tax_cents,      -- fill in later
    floor(greatest(ri.subtotal_cents - d.discount_cents, 0)
          * (s.platform_fee_percentage / 100.0))::bigint     as platform_fee_cents,
    greatest(ri.subtotal_cents - d.discount_cents, 0)
      + 0 + 0                                               as total_cents
  from raw_items ri
  join sellers s on s.id = ri.seller_id
  left join discounts d on d.seller_id = ri.seller_id
  order by s.shop_name;
end;
$$;


ALTER FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint, "p_coupons" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_seller_boost_balance"("p_seller_id" bigint) RETURNS integer
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_balance integer;
BEGIN
  SELECT boost_credits_cents INTO v_balance
  FROM public.sellers
  WHERE id = p_seller_id;

  RETURN COALESCE(v_balance, 0);
END;
$$;


ALTER FUNCTION "public"."get_seller_boost_balance"("p_seller_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_seller_monthly_fee"("p_seller_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $_$
DECLARE
  v_seller_type seller_type;
  v_subscription_status subscription_status;
BEGIN
  SELECT seller_type, service_subscription_status
  INTO v_seller_type, v_subscription_status
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Products-only sellers pay no monthly fee
  IF v_seller_type = 'products' THEN
    RETURN 0;
  END IF;

  -- Service and hybrid sellers pay $9.99/month (after trial)
  IF v_seller_type IN ('services', 'hybrid') THEN
    -- If in trial, no charge
    IF v_subscription_status = 'trial' THEN
      RETURN 0;
    END IF;

    -- If active, charge $9.99
    IF v_subscription_status = 'active' THEN
      RETURN 999; -- $9.99 in cents
    END IF;
  END IF;

  RETURN 0;
END;
$_$;


ALTER FUNCTION "public"."get_seller_monthly_fee"("p_seller_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_seller_stripe_account"("p_seller_id" bigint) RETURNS "text"
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
  select stripe_connect_account_id
  from sellers
  where id = p_seller_id
    and stripe_connect_account_id is not null
    and stripe_charges_enabled = true
    and stripe_payouts_enabled  = true;
$$;


ALTER FUNCTION "public"."get_seller_stripe_account"("p_seller_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_shop_analytics_summary"("p_seller_id" integer DEFAULT NULL::integer, "p_admin_listing_id" integer DEFAULT NULL::integer, "p_days" integer DEFAULT 30) RETURNS TABLE("total_views" bigint, "unique_visitors" bigint, "product_clicks" bigint, "contact_submissions" bigint, "avg_time_on_page" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  -- Validate input
  IF p_seller_id IS NULL AND p_admin_listing_id IS NULL THEN
    RAISE EXCEPTION 'Either seller_id or admin_listing_id must be provided';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'page_view') as total_views,
    COUNT(DISTINCT visitor_id) as unique_visitors,
    COUNT(*) FILTER (WHERE event_type = 'product_click') as product_clicks,
    COUNT(*) FILTER (WHERE event_type = 'contact_submit') as contact_submissions,
    AVG(
      CASE 
        WHEN event_type = 'page_view' AND (event_data->>'duration')::INTEGER > 0 
        THEN (event_data->>'duration')::INTEGER 
        ELSE NULL
      END
    ) as avg_time_on_page
  FROM shop_analytics
  WHERE 
    (p_seller_id IS NOT NULL AND seller_id = p_seller_id)
    OR
    (p_admin_listing_id IS NOT NULL AND admin_listing_id = p_admin_listing_id)
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$;


ALTER FUNCTION "public"."get_shop_analytics_summary"("p_seller_id" integer, "p_admin_listing_id" integer, "p_days" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_shop_analytics_summary"("p_seller_id" integer, "p_admin_listing_id" integer, "p_days" integer) IS 'Returns analytics summary for a seller shop or admin listing. Uses fixed search_path for security.';



CREATE OR REPLACE FUNCTION "public"."get_unread_message_count"("user_uuid" "uuid") RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
    unread_count bigint;
BEGIN
    SELECT COUNT(DISTINCT m.thread_id) INTO unread_count
    FROM public.messages m
    JOIN public.message_threads mt ON mt.id = m.thread_id
    WHERE m.is_read = false
    AND m.sender_id != user_uuid
    AND (
        mt.buyer_id = user_uuid
        OR EXISTS (
            SELECT 1 FROM public.sellers s
            WHERE s.id = mt.seller_id AND s.user_id = user_uuid
        )
    );
    
    RETURN unread_count;
END;
$$;


ALTER FUNCTION "public"."get_unread_message_count"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END $$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_directory_analytics"("p_seller_id" integer, "p_event_type" "text", "p_metadata" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO directory_analytics (seller_id, event_type, event_date, count, metadata)
  VALUES (p_seller_id, p_event_type, CURRENT_DATE, 1, p_metadata)
  ON CONFLICT (seller_id, event_type, event_date)
  DO UPDATE SET 
    count = directory_analytics.count + 1,
    metadata = COALESCE(EXCLUDED.metadata, directory_analytics.metadata);
END;
$$;


ALTER FUNCTION "public"."increment_directory_analytics"("p_seller_id" integer, "p_event_type" "text", "p_metadata" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."increment_directory_analytics"("p_seller_id" integer, "p_event_type" "text", "p_metadata" "jsonb") IS 'Increments analytics count for a seller and event type, creates or updates daily record';



CREATE OR REPLACE FUNCTION "public"."increment_product_views"("product_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE public.products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$;


ALTER FUNCTION "public"."increment_product_views"("product_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_promo_code_usage"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    -- Increment the usage count
    UPDATE promo_codes 
    SET current_uses = current_uses + 1,
        updated_at = NOW()
    WHERE id = NEW.promo_code_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."increment_promo_code_usage"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."initialize_service_trial"("p_seller_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE public.sellers
  SET
    service_subscription_status = 'trial',
    trial_ends_at = now() + interval '1 month',
    service_subscription_started_at = now()
  WHERE id = p_seller_id;
END;
$$;


ALTER FUNCTION "public"."initialize_service_trial"("p_seller_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"("check_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"("check_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_service_subscription_active"("p_seller_id" integer) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_status subscription_status;
  v_trial_ends_at timestamptz;
  v_manual_override BOOLEAN;
BEGIN
  SELECT service_subscription_status, trial_ends_at, manual_subscription_override
  INTO v_status, v_trial_ends_at, v_manual_override
  FROM public.sellers
  WHERE id = p_seller_id;

  -- If manual override is set, always return true
  IF v_manual_override = TRUE THEN
    RETURN TRUE;
  END IF;

  -- Check if subscription is active
  IF v_status = 'active' THEN
    RETURN TRUE;
  END IF;

  -- Check if trial is still valid
  IF v_status = 'trial' AND v_trial_ends_at > now() THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."is_service_subscription_active"("p_seller_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_service_subscription_active"("p_seller_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_status subscription_status;
  v_trial_ends_at timestamptz;
BEGIN
  SELECT service_subscription_status, trial_ends_at
  INTO v_status, v_trial_ends_at
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Check if in trial period
  IF v_status = 'trial' AND v_trial_ends_at > now() THEN
    RETURN true;
  END IF;

  -- Check if active subscription
  IF v_status = 'active' THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;


ALTER FUNCTION "public"."is_service_subscription_active"("p_seller_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_shop_member"("p_seller_id" bigint, "p_user_id" "uuid", "p_min_role" "public"."member_role" DEFAULT 'staff'::"public"."member_role") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.shop_members sm
    WHERE sm.seller_id = p_seller_id
      AND sm.user_id = p_user_id
      AND sm.accepted_at IS NOT NULL
      AND (
        (p_min_role = 'staff') OR
        (p_min_role = 'admin' AND sm.role IN ('admin', 'owner')) OR
        (p_min_role = 'owner' AND sm.role = 'owner')
      )
  );
END;
$$;


ALTER FUNCTION "public"."is_shop_member"("p_seller_id" bigint, "p_user_id" "uuid", "p_min_role" "public"."member_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_super_admin"("check_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id AND role = 'super_admin'
  );
END;
$$;


ALTER FUNCTION "public"."is_super_admin"("check_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."link_business_to_signed_in_user"() RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_business_id uuid;
begin
  -- Find ONE unclaimed business that matches signed-in email
  select b.id
  into v_business_id
  from public.businesses b
  where lower(trim(b.contact_email)) = lower(trim(auth.email()))
    and (b.user_id is null)
    and (b.claimed = false)
  order by b.created_at desc
  limit 1;

  if v_business_id is null then
    raise exception 'No unclaimed business found for this email';
  end if;

  update public.businesses
  set user_id   = auth.uid(),
      claimed   = true,
      claimed_at = now(),
      claimed_by = auth.email()
  where id = v_business_id;

  return v_business_id;
end;
$$;


ALTER FUNCTION "public"."link_business_to_signed_in_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_service_publish_without_sub"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
DECLARE
  v_type TEXT;
  v_status TEXT;
  v_override BOOLEAN;
BEGIN
  -- Only check on INSERT or when status changes to 'published'
  IF TG_OP = 'UPDATE' AND OLD.status = 'published' AND NEW.status = 'published' THEN
    RETURN NEW;
  END IF;

  -- Only enforce for published services
  IF NEW.status != 'published' THEN
    RETURN NEW;
  END IF;

  -- Get seller info
  SELECT seller_tier, service_subscription_status, manual_subscription_override
  INTO v_type, v_status, v_override
  FROM sellers
  WHERE id = NEW.seller_id;

  -- Check if seller tier is pro (both fixed_price and pro can sell services, but pro has subscription)
  IF v_type != 'pro' THEN
    RAISE EXCEPTION 'Only Pro sellers can publish services. Please upgrade to Pro tier first.';
  END IF;

  -- Check subscription status (unless manual override)
  IF NOT v_override AND v_status NOT IN ('trial', 'active') THEN
    RAISE EXCEPTION 'Active service subscription required to publish services. Status: %', v_status;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_service_publish_without_sub"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."prevent_service_publish_without_sub"() IS 'Prevents publishing services without active subscription or valid trial';



CREATE OR REPLACE FUNCTION "public"."reset_unread_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    UPDATE conversation_threads
    SET 
      seller_unread_count = CASE 
        WHEN NEW.sender_type = 'buyer' AND seller_unread_count > 0 
        THEN seller_unread_count - 1 
        ELSE seller_unread_count 
      END,
      buyer_unread_count = CASE 
        WHEN NEW.sender_type = 'seller' AND buyer_unread_count > 0 
        THEN buyer_unread_count - 1 
        ELSE buyer_unread_count 
      END
    WHERE id = NEW.thread_id;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."reset_unread_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_commission_by_seller_type"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Products or hybrid sellers get 6% commission
  IF NEW.seller_type IN ('products', 'hybrid') THEN
    NEW.commission_bps := 600;
  END IF;

  -- Service-only sellers have no commission
  IF NEW.seller_type = 'services' THEN
    NEW.commission_bps := NULL;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_commission_by_seller_type"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_order_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_order_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_payout_method_by_country"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- If country is NZ or New Zealand, use stripe_connect, otherwise use manual
  IF NEW.country = 'NZ' OR NEW.country = 'New Zealand' THEN
    NEW.payout_method := 'stripe_connect';
  ELSIF NEW.country IS NOT NULL AND NEW.country != '' THEN
    NEW.payout_method := 'manual';
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_payout_method_by_country"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_quote_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_quote_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_seller_commission"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- All sellers get 6.5% commission (650 basis points)
  -- Both fixed_price and pro sellers have the same commission rate
  NEW.commission_bps := 650;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_seller_commission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end $$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_user_email_to_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Only update if email has actually changed
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles
    SET email = NEW.email
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_user_email_to_profile"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."sync_user_email_to_profile"() IS 'Automatically syncs email changes from auth.users to profiles table';



CREATE OR REPLACE FUNCTION "public"."track_shop_event"("p_event_type" character varying, "p_seller_id" integer DEFAULT NULL::integer, "p_admin_listing_id" integer DEFAULT NULL::integer, "p_event_data" "jsonb" DEFAULT '{}'::"jsonb", "p_visitor_id" character varying DEFAULT NULL::character varying, "p_session_id" character varying DEFAULT NULL::character varying, "p_user_agent" "text" DEFAULT NULL::"text", "p_referrer" "text" DEFAULT NULL::"text", "p_ip_address" "text" DEFAULT NULL::"text") RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_event_id BIGINT;
  v_device_type VARCHAR(20);
BEGIN
  -- Validate that either seller_id or admin_listing_id is provided
  IF p_seller_id IS NULL AND p_admin_listing_id IS NULL THEN
    RAISE EXCEPTION 'Either seller_id or admin_listing_id must be provided';
  END IF;

  IF p_seller_id IS NOT NULL AND p_admin_listing_id IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot provide both seller_id and admin_listing_id';
  END IF;

  -- Determine device type from user agent
  v_device_type := CASE
    WHEN p_user_agent ~* 'mobile' THEN 'mobile'
    WHEN p_user_agent ~* 'tablet|ipad' THEN 'tablet'
    ELSE 'desktop'
  END;

  INSERT INTO shop_analytics (
    seller_id,
    admin_listing_id,
    event_type,
    event_data,
    visitor_id,
    session_id,
    user_agent,
    referrer,
    ip_address,
    device_type
  ) VALUES (
    p_seller_id,
    p_admin_listing_id,
    p_event_type,
    p_event_data,
    p_visitor_id,
    p_session_id,
    p_user_agent,
    p_referrer,
    p_ip_address,
    v_device_type
  )
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$;


ALTER FUNCTION "public"."track_shop_event"("p_event_type" character varying, "p_seller_id" integer, "p_admin_listing_id" integer, "p_event_data" "jsonb", "p_visitor_id" character varying, "p_session_id" character varying, "p_user_agent" "text", "p_referrer" "text", "p_ip_address" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."track_shop_event"("p_event_type" character varying, "p_seller_id" integer, "p_admin_listing_id" integer, "p_event_data" "jsonb", "p_visitor_id" character varying, "p_session_id" character varying, "p_user_agent" "text", "p_referrer" "text", "p_ip_address" "text") IS 'Tracks a shop analytics event for both regular sellers and admin-created listings. Uses fixed search_path for security.';



CREATE OR REPLACE FUNCTION "public"."update_admin_directory_listings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_admin_directory_listings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_cart_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_cart_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_conversation_thread"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE conversation_threads
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.message, 100),
    updated_at = NEW.created_at,
    seller_unread_count = CASE 
      WHEN NEW.sender_type = 'buyer' THEN seller_unread_count + 1 
      ELSE seller_unread_count 
    END,
    buyer_unread_count = CASE 
      WHEN NEW.sender_type = 'seller' THEN buyer_unread_count + 1 
      ELSE buyer_unread_count 
    END
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_conversation_thread"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_creator_feature_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Insert or update stats
  INSERT INTO creator_feature_stats (
    listing_id,
    times_featured,
    first_featured_date,
    last_featured_date,
    total_shares,
    total_likes,
    total_comments,
    times_shared_by_creator
  )
  VALUES (
    NEW.listing_id,
    1,
    NEW.featured_date,
    NEW.featured_date,
    COALESCE(NEW.shares_count, 0),
    COALESCE(NEW.likes_count, 0),
    COALESCE(NEW.comments_count, 0),
    CASE WHEN NEW.creator_shared THEN 1 ELSE 0 END
  )
  ON CONFLICT (listing_id) DO UPDATE SET
    times_featured = creator_feature_stats.times_featured + 1,
    last_featured_date = NEW.featured_date,
    total_shares = creator_feature_stats.total_shares + COALESCE(NEW.shares_count, 0),
    total_likes = creator_feature_stats.total_likes + COALESCE(NEW.likes_count, 0),
    total_comments = creator_feature_stats.total_comments + COALESCE(NEW.comments_count, 0),
    times_shared_by_creator = creator_feature_stats.times_shared_by_creator + CASE WHEN NEW.creator_shared THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_creator_feature_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_directory_featured"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Standard tier gets featured badge automatically
  IF NEW.directory_tier = 'standard' THEN
    NEW.directory_featured := true;
  ELSE
    NEW.directory_featured := false;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_directory_featured"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_message_threads_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_message_threads_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_parent_cart_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE carts SET updated_at = NOW() 
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_parent_cart_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_product_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_promo_codes_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_promo_codes_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_quote_timestamps"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF NEW.status = 'sent' AND OLD.status != 'sent' THEN
    NEW.sent_at := NOW();
  ELSIF NEW.status = 'viewed' AND OLD.status != 'viewed' THEN
    NEW.viewed_at := NOW();
  ELSIF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    NEW.accepted_at := NOW();
  ELSIF NEW.status = 'declined' AND OLD.status != 'declined' THEN
    NEW.declined_at := NOW();
  ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at := NOW();
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_quote_timestamps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_rfp_proposal_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count + 1 
    WHERE id = NEW.rfp_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count - 1 
    WHERE id = OLD.rfp_request_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_rfp_proposal_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_rfp_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_rfp_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_rfq_proposal_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count + 1 
    WHERE id = NEW.rfp_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count - 1 
    WHERE id = OLD.rfp_request_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_rfq_proposal_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_rfq_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_rfq_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_seller_commission_on_plan_change"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- Update commission_bps from the plan
  IF NEW.current_plan IS DISTINCT FROM OLD.current_plan THEN
    SELECT commission_bps INTO NEW.commission_bps
    FROM public.subscription_plans
    WHERE id = NEW.current_plan;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_seller_commission_on_plan_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_seller_follower_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.sellers
        SET total_followers = total_followers + 1
        WHERE id = NEW.seller_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.sellers
        SET total_followers = GREATEST(0, total_followers - 1)
        WHERE id = OLD.seller_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_seller_follower_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_seller_product_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.sellers
    SET product_count = product_count + 1
    WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.sellers
    SET product_count = GREATEST(product_count - 1, 0)
    WHERE id = OLD.seller_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_seller_product_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_seller_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    -- Business name (highest weight)
    setweight(to_tsvector('english', COALESCE(NEW.business_name, '')), 'A') ||
    -- Primary category (high weight)
    setweight(to_tsvector('english', COALESCE(NEW.primary_category, '')), 'B') ||
    -- Location fields (medium weight)
    setweight(to_tsvector('english', COALESCE(NEW.country, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'C') ||
    -- Category tags (lower weight)
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.category_tags, ' '), '')), 'D');
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_seller_search_vector"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_seller_search_vector"() IS 'Updates search_vector for sellers table (brand_story removed - now in shop_templates)';



CREATE OR REPLACE FUNCTION "public"."update_seller_service_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment service count when new service is added
    UPDATE public.sellers
    SET service_count = service_count + 1
    WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement service count when service is deleted
    UPDATE public.sellers
    SET service_count = GREATEST(0, service_count - 1)
    WHERE id = OLD.seller_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle seller_id changes (rare but possible)
    IF OLD.seller_id != NEW.seller_id THEN
      UPDATE public.sellers
      SET service_count = GREATEST(0, service_count - 1)
      WHERE id = OLD.seller_id;
      
      UPDATE public.sellers
      SET service_count = service_count + 1
      WHERE id = NEW.seller_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_seller_service_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_sellers_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    -- Business name (highest weight)
    setweight(to_tsvector('english', COALESCE(NEW.business_name, '')), 'A') ||
    -- Primary category (high weight)
    setweight(to_tsvector('english', COALESCE(NEW.primary_category, '')), 'B') ||
    -- Location fields (medium weight)
    setweight(to_tsvector('english', COALESCE(NEW.country, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'C') ||
    -- Category tags (lower weight)
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.category_tags, ' '), '')), 'D');
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_sellers_search_vector"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_sellers_search_vector"() IS 'Updates search_vector for sellers table (brand_story removed - now in shop_templates)';



CREATE OR REPLACE FUNCTION "public"."update_service_request_response_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE service_requests
  SET response_count = (
    SELECT COUNT(*) FROM service_request_responses
    WHERE request_id = NEW.request_id
  )
  WHERE id = NEW.request_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_service_request_response_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_service_requests_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_service_requests_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_shipment_from_ptp"("p_shipment_id" bigint, "p_ptp_data" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE public.shipments
  SET 
    status = COALESCE(p_ptp_data->>'status', status),
    tracking_number = COALESCE(p_ptp_data->>'tracking_number', tracking_number),
    ptp_tracking_url = COALESCE(p_ptp_data->>'tracking_url', ptp_tracking_url),
    last_tracking_update = now(),
    ptp_response = ptp_response || p_ptp_data
  WHERE id = p_shipment_id;
END;
$$;


ALTER FUNCTION "public"."update_shipment_from_ptp"("p_shipment_id" bigint, "p_ptp_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_shipments_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_shipments_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_shipping_options_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_shipping_options_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_thread_last_message"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    UPDATE public.message_threads
    SET last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_thread_last_message"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_subtotal_cents" bigint, "p_currency" "text") RETURNS TABLE("valid" boolean, "discount_cents" bigint, "message" "text")
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $_$
DECLARE
  v_coupon RECORD;
  v_discount bigint := 0;
BEGIN
  -- Check if coupons table exists, if not return invalid
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'coupons'
  ) THEN
    RETURN QUERY SELECT false, 0::bigint, 'Coupon system not available'::text;
    RETURN;
  END IF;

  -- Try to find the coupon
  EXECUTE format('
    SELECT 
      id, 
      code, 
      discount_type, 
      discount_value, 
      min_purchase_cents,
      max_discount_cents,
      valid_from,
      valid_until,
      usage_limit,
      usage_count,
      active
    FROM coupons 
    WHERE seller_id = $1 
      AND UPPER(code) = UPPER($2)
      AND active = true
      AND (valid_from IS NULL OR valid_from <= NOW())
      AND (valid_until IS NULL OR valid_until >= NOW())
    LIMIT 1
  ') INTO v_coupon USING p_seller_id, p_code;

  -- If coupon not found or invalid
  IF v_coupon IS NULL THEN
    RETURN QUERY SELECT false, 0::bigint, 'Invalid or expired coupon code'::text;
    RETURN;
  END IF;

  -- Check usage limit
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
    RETURN QUERY SELECT false, 0::bigint, 'Coupon usage limit reached'::text;
    RETURN;
  END IF;

  -- Check minimum purchase
  IF v_coupon.min_purchase_cents IS NOT NULL AND p_subtotal_cents < v_coupon.min_purchase_cents THEN
    RETURN QUERY SELECT 
      false, 
      0::bigint, 
      format('Minimum purchase of %s required', 
        to_char(v_coupon.min_purchase_cents / 100.0, 'FM999999990.00')
      )::text;
    RETURN;
  END IF;

  -- Calculate discount based on type
  IF v_coupon.discount_type = 'percentage' THEN
    v_discount := FLOOR(p_subtotal_cents * v_coupon.discount_value / 100);
    -- Apply max discount cap if set
    IF v_coupon.max_discount_cents IS NOT NULL AND v_discount > v_coupon.max_discount_cents THEN
      v_discount := v_coupon.max_discount_cents;
    END IF;
  ELSIF v_coupon.discount_type = 'fixed' THEN
    v_discount := v_coupon.discount_value;
  END IF;

  -- Ensure discount doesn't exceed subtotal
  IF v_discount > p_subtotal_cents THEN
    v_discount := p_subtotal_cents;
  END IF;

  RETURN QUERY SELECT true, v_discount, 'Coupon applied successfully'::text;
END;
$_$;


ALTER FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_subtotal_cents" bigint, "p_currency" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_currency" "text", "p_subtotal_cents" bigint) RETURNS TABLE("coupon_id" bigint, "ctype" "public"."coupon_type", "percent_off" numeric, "amount_off" integer, "discount_cents" bigint)
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
  with c as (
    select *
    from coupons
    where seller_id = p_seller_id
      and lower(code) = lower(p_code)
      and is_active = true
      and (starts_at is null or starts_at <= now())
      and (ends_at   is null or ends_at   >= now())
    limit 1
  )
  select
    c.id,
    c.ctype,
    c.percent_off,
    c.amount_off,
    case
      when c.ctype = 'PERCENT' and c.percent_off is not null
        then floor(p_subtotal_cents * (c.percent_off / 100.0))::bigint
      when c.ctype = 'FIXED' and c.amount_off is not null
           and (c.currency is null or c.currency = p_currency)
        then least(c.amount_off, p_subtotal_cents)::bigint
      else 0::bigint
    end as discount_cents
  from c
  union all
  -- If coupon not found/valid, return a zero-discount row
  select null::bigint, null::coupon_type, null::numeric, null::integer, 0::bigint
  where not exists (select 1 from c);
$$;


ALTER FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_currency" "text", "p_subtotal_cents" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_purchase_for_review"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    -- If order_id is provided, verify the purchase
    IF NEW.order_id IS NOT NULL THEN
        -- Check if the user actually purchased this product in this order
        IF NOT EXISTS (
            SELECT 1 FROM public.order_items oi
            JOIN public.orders o ON o.id = oi.order_id
            WHERE oi.order_id = NEW.order_id
            AND oi.product_id = NEW.product_id
            AND o.user_id = NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Cannot review a product you have not purchased';
        END IF;
        
        -- Mark as verified purchase
        NEW.is_verified_purchase := true;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."verify_purchase_for_review"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_user_id" "uuid" NOT NULL,
    "role" character varying(20) DEFAULT 'admin'::character varying,
    "permissions" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "admin_users_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['admin'::character varying, 'super_admin'::character varying])::"text"[])))
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_name" character varying(50) NOT NULL,
    "record_id" "uuid" NOT NULL,
    "action" character varying(10) NOT NULL,
    "old_data" "jsonb",
    "new_data" "jsonb",
    "user_id" "uuid",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "audit_logs_action_check" CHECK ((("action")::"text" = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::"text"[])))
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."business_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "caption" "text",
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."business_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."business_owners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "is_primary" boolean DEFAULT false,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."business_owners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."businesses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "short_description" "text",
    "logo_url" "text",
    "contact_website" "text",
    "contact_email" character varying(255),
    "contact_phone" character varying(50),
    "address" "text",
    "country" character varying(100),
    "industry" character varying(100),
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "subscription_tier" character varying(20) DEFAULT 'basic'::character varying,
    "user_id" "uuid",
    "stripe_customer_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_date" "date" DEFAULT CURRENT_DATE,
    "contact_name" "text",
    "languages_spoken" "text"[],
    "social_links" "jsonb",
    "suburb" "text",
    "city" "text",
    "state_region" "text",
    "postal_code" "text",
    "business_hours" "text",
    "banner_url" "text",
    "cultural_identity" "text",
    "claimed" boolean DEFAULT false,
    "claimed_at" timestamp with time zone,
    "claimed_by" "text",
    "business_handle" "text",
    "verified" boolean DEFAULT false,
    "owner_user_id" "uuid",
    "proof_links" "text"[],
    "homepage_featured" boolean DEFAULT false NOT NULL,
    "visibility_tier" "text" DEFAULT 'none'::"text" NOT NULL,
    CONSTRAINT "businesses_business_handle_format" CHECK ((("business_handle" IS NULL) OR ("business_handle" = ''::"text") OR ("business_handle" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::"text"))),
    CONSTRAINT "businesses_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'inactive'::character varying, 'suspended'::character varying])::"text"[]))),
    CONSTRAINT "businesses_subscription_tier_check" CHECK ((("subscription_tier")::"text" = ANY ((ARRAY['basic'::character varying, 'verified'::character varying, 'featured_plus'::character varying])::"text"[]))),
    CONSTRAINT "businesses_visibility_tier_check" CHECK (("visibility_tier" = ANY (ARRAY['none'::"text", 'homepage'::"text", 'spotlight'::"text"])))
);


ALTER TABLE "public"."businesses" OWNER TO "postgres";


COMMENT ON COLUMN "public"."businesses"."contact_website" IS 'Contact website URL';



COMMENT ON COLUMN "public"."businesses"."contact_email" IS 'Contact email address';



COMMENT ON COLUMN "public"."businesses"."contact_phone" IS 'Contact phone number';



COMMENT ON COLUMN "public"."businesses"."contact_name" IS 'Primary contact person name';



COMMENT ON COLUMN "public"."businesses"."languages_spoken" IS 'Array of languages spoken by the business';



COMMENT ON COLUMN "public"."businesses"."social_links" IS 'Social media links stored as JSON';



COMMENT ON COLUMN "public"."businesses"."suburb" IS 'Suburb or local area';



COMMENT ON COLUMN "public"."businesses"."city" IS 'City or town';



COMMENT ON COLUMN "public"."businesses"."state_region" IS 'State, province, or region';



COMMENT ON COLUMN "public"."businesses"."postal_code" IS 'Postal code or ZIP code';



COMMENT ON COLUMN "public"."businesses"."business_hours" IS 'Business operating hours';



COMMENT ON COLUMN "public"."businesses"."banner_url" IS 'Banner image URL';



COMMENT ON COLUMN "public"."businesses"."cultural_identity" IS 'Combined cultural identity from primary_cultural and cultural_other';



CREATE TABLE IF NOT EXISTS "public"."claim_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "contact_email" character varying(255),
    "contact_phone" character varying(50),
    "verification_documents" "text"[],
    "rejection_reason" "text",
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_email" "text",
    "business_name" "text",
    "created_date" "date" DEFAULT CURRENT_DATE,
    "notes" "text",
    "message" "text",
    "admin_notes" "text",
    CONSTRAINT "claim_requests_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."claim_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_access_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid",
    "business_name" character varying(255) NOT NULL,
    "requester_email" character varying(255) NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contact_access_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."contact_access_logs" IS 'Logs of who requests to view business contact details';



COMMENT ON COLUMN "public"."contact_access_logs"."business_id" IS 'ID of the business whose contact details were requested';



COMMENT ON COLUMN "public"."contact_access_logs"."business_name" IS 'Name of the business (denormalized for easy access)';



COMMENT ON COLUMN "public"."contact_access_logs"."requester_email" IS 'Email of the person requesting contact details';



COMMENT ON COLUMN "public"."contact_access_logs"."ip_address" IS 'IP address of the requester (optional)';



COMMENT ON COLUMN "public"."contact_access_logs"."user_agent" IS 'Browser user agent (optional)';



CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "region" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feature_templates" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "format" "text" NOT NULL,
    "width" integer NOT NULL,
    "height" integer NOT NULL,
    "layout_config" "jsonb" DEFAULT '{}'::"jsonb",
    "style_config" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "is_default" boolean DEFAULT false,
    "usage_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "feature_templates_format_check" CHECK (("format" = ANY (ARRAY['square'::"text", 'vertical'::"text", 'story'::"text"])))
);


ALTER TABLE "public"."feature_templates" OWNER TO "postgres";


COMMENT ON TABLE "public"."feature_templates" IS 'Visual templates for generating feature cards';



CREATE SEQUENCE IF NOT EXISTS "public"."feature_templates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."feature_templates_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."feature_templates_id_seq" OWNED BY "public"."feature_templates"."id";



CREATE TABLE IF NOT EXISTS "public"."pacific_places" (
    "id" bigint NOT NULL,
    "region" "text" NOT NULL,
    "country" "text" NOT NULL,
    CONSTRAINT "pacific_places_region_check" CHECK (("region" = ANY (ARRAY['Polynesia'::"text", 'Micronesia'::"text", 'Melanesia'::"text", 'Rim'::"text"])))
);


ALTER TABLE "public"."pacific_places" OWNER TO "postgres";


ALTER TABLE "public"."pacific_places" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."pacific_places_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."platform_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" character varying(100) NOT NULL,
    "value" "text",
    "description" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."platform_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_services" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price_display" "text",
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_services" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "role" "public"."app_role" DEFAULT 'buyer'::"public"."app_role" NOT NULL,
    "display_name" "text",
    "email" "text",
    "country" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "primary_cultural" "text",
    "cultural_other" "text",
    "potential_seller_handle" "text",
    "country_other" "text",
    "cultural_tags" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'User profiles - preferred_languages column removed as platform translation was discontinued';



COMMENT ON COLUMN "public"."profiles"."updated_at" IS 'Timestamp of last profile update, automatically managed by trigger';



COMMENT ON COLUMN "public"."profiles"."primary_cultural" IS 'Primary cultural identity/heritage (country code, e.g., WS for Samoa, TO for Tonga)';



COMMENT ON COLUMN "public"."profiles"."cultural_other" IS 'Selected country/culture when primary_cultural is set to "Other"';



COMMENT ON COLUMN "public"."profiles"."potential_seller_handle" IS 'Pre-generated handle for potential sellers, created during signup';



COMMENT ON COLUMN "public"."profiles"."country_other" IS 'Selected country when country is set to "Other"';



COMMENT ON COLUMN "public"."profiles"."cultural_tags" IS 'Array of additional cultural backgrounds/identities';



CREATE TABLE IF NOT EXISTS "public"."shop_analytics" (
    "id" bigint NOT NULL,
    "seller_id" bigint,
    "date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "page_views" integer DEFAULT 0,
    "unique_visitors" integer DEFAULT 0,
    "contact_clicks" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "event_type" character varying(50),
    "event_data" "jsonb" DEFAULT '{}'::"jsonb",
    "visitor_id" character varying(100),
    "session_id" character varying(100),
    "admin_listing_id" integer,
    "user_agent" "text",
    "device_type" character varying(20),
    "referrer" "text",
    "ip_address" "text",
    CONSTRAINT "shop_analytics_listing_check" CHECK (((("seller_id" IS NOT NULL) AND ("admin_listing_id" IS NULL)) OR (("seller_id" IS NULL) AND ("admin_listing_id" IS NOT NULL))))
);


ALTER TABLE "public"."shop_analytics" OWNER TO "postgres";


COMMENT ON TABLE "public"."shop_analytics" IS 'Tracks shop views, clicks, and engagement metrics';



COMMENT ON COLUMN "public"."shop_analytics"."event_type" IS 'Type of event: page_view, product_click, service_click, contact_submit, section_view';



COMMENT ON COLUMN "public"."shop_analytics"."event_data" IS 'Flexible JSONB for event-specific data';



COMMENT ON COLUMN "public"."shop_analytics"."visitor_id" IS 'Anonymous visitor identifier for tracking unique visitors';



COMMENT ON COLUMN "public"."shop_analytics"."admin_listing_id" IS 'Reference to admin-created directory listing (mutually exclusive with seller_id)';



CREATE SEQUENCE IF NOT EXISTS "public"."shop_analytics_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shop_analytics_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shop_analytics_id_seq" OWNED BY "public"."shop_analytics"."id";



CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "business_id" "uuid",
    "stripe_subscription_id" "text",
    "stripe_customer_id" "text",
    "plan_type" character varying(50) NOT NULL,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "cancel_at_period_end" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "subscriptions_plan_type_check" CHECK ((("plan_type")::"text" = ANY ((ARRAY['basic'::character varying, 'verified'::character varying, 'featured'::character varying, 'featured_plus'::character varying])::"text"[]))),
    CONSTRAINT "subscriptions_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'canceled'::character varying, 'past_due'::character varying, 'unpaid'::character varying, 'trialing'::character varying])::"text"[])))
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."feature_templates" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."feature_templates_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shop_analytics" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shop_analytics_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business_images"
    ADD CONSTRAINT "business_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business_owners"
    ADD CONSTRAINT "business_owners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."businesses"
    ADD CONSTRAINT "businesses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contact_access_logs"
    ADD CONSTRAINT "contact_access_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feature_templates"
    ADD CONSTRAINT "feature_templates_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."feature_templates"
    ADD CONSTRAINT "feature_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pacific_places"
    ADD CONSTRAINT "pacific_places_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_services"
    ADD CONSTRAINT "product_services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shop_analytics"
    ADD CONSTRAINT "shop_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shop_analytics"
    ADD CONSTRAINT "shop_analytics_seller_id_date_key" UNIQUE ("seller_id", "date");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



CREATE INDEX "businesses_contact_email_idx" ON "public"."businesses" USING "btree" ("contact_email");



CREATE UNIQUE INDEX "businesses_business_handle_unique" ON "public"."businesses" USING "btree" ("lower"("business_handle")) WHERE (("business_handle" IS NOT NULL) AND ("business_handle" <> ''::"text"));



CREATE INDEX "businesses_user_id_idx" ON "public"."businesses" USING "btree" ("user_id");



CREATE UNIQUE INDEX "claim_requests_one_pending_per_business" ON "public"."claim_requests" USING "btree" ("business_id") WHERE (("status")::"text" = 'pending'::"text");



CREATE UNIQUE INDEX "claim_requests_one_pending_per_user_business" ON "public"."claim_requests" USING "btree" ("business_id", "user_id") WHERE (("status")::"text" = 'pending'::"text");



CREATE INDEX "idx_admin_users_role" ON "public"."admin_users" USING "btree" ("role");



CREATE INDEX "idx_admin_users_user_id" ON "public"."admin_users" USING "btree" ("owner_user_id");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "idx_audit_logs_record_id" ON "public"."audit_logs" USING "btree" ("record_id");



CREATE INDEX "idx_audit_logs_table_name" ON "public"."audit_logs" USING "btree" ("table_name");



CREATE INDEX "idx_audit_logs_user_id" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_businesses_city" ON "public"."businesses" USING "btree" ("city");



CREATE INDEX "idx_businesses_country" ON "public"."businesses" USING "btree" ("country");



CREATE INDEX "idx_businesses_cultural_identity" ON "public"."businesses" USING "btree" ("cultural_identity");



CREATE INDEX "idx_businesses_industry" ON "public"."businesses" USING "btree" ("industry");



CREATE INDEX "idx_businesses_languages_spoken" ON "public"."businesses" USING "gin" ("languages_spoken");



CREATE INDEX "idx_businesses_postal_code" ON "public"."businesses" USING "btree" ("postal_code");



CREATE INDEX "idx_businesses_social_links" ON "public"."businesses" USING "gin" ("social_links");



CREATE INDEX "idx_businesses_state_region" ON "public"."businesses" USING "btree" ("state_region");



CREATE INDEX "idx_businesses_status" ON "public"."businesses" USING "btree" ("status");



CREATE INDEX "idx_businesses_subscription_tier" ON "public"."businesses" USING "btree" ("subscription_tier");



CREATE INDEX "idx_businesses_suburb" ON "public"."businesses" USING "btree" ("suburb");



CREATE INDEX "idx_businesses_user_id" ON "public"."businesses" USING "btree" ("user_id");



CREATE INDEX "idx_claim_requests_business_id" ON "public"."claim_requests" USING "btree" ("business_id");



CREATE INDEX "idx_claim_requests_status" ON "public"."claim_requests" USING "btree" ("status");



CREATE INDEX "idx_claim_requests_user_id" ON "public"."claim_requests" USING "btree" ("user_id");



CREATE INDEX "idx_contact_access_logs_business_id" ON "public"."contact_access_logs" USING "btree" ("business_id");



CREATE INDEX "idx_contact_access_logs_created_at" ON "public"."contact_access_logs" USING "btree" ("created_at");



CREATE INDEX "idx_contact_access_logs_email" ON "public"."contact_access_logs" USING "btree" ("requester_email");



CREATE INDEX "idx_pacific_places_country" ON "public"."pacific_places" USING "btree" ("lower"("country"));



CREATE INDEX "idx_pacific_places_region" ON "public"."pacific_places" USING "btree" ("region");



CREATE INDEX "idx_platform_settings_key" ON "public"."platform_settings" USING "btree" ("key");



CREATE INDEX "idx_profiles_potential_seller_handle" ON "public"."profiles" USING "btree" ("potential_seller_handle");



CREATE INDEX "idx_shop_analytics_admin_listing_date" ON "public"."shop_analytics" USING "btree" ("admin_listing_id", "created_at" DESC) WHERE ("admin_listing_id" IS NOT NULL);



CREATE INDEX "idx_shop_analytics_admin_listing_event" ON "public"."shop_analytics" USING "btree" ("admin_listing_id", "event_type") WHERE ("admin_listing_id" IS NOT NULL);



CREATE INDEX "idx_shop_analytics_created_at" ON "public"."shop_analytics" USING "btree" ("created_at");



CREATE INDEX "idx_shop_analytics_event_type" ON "public"."shop_analytics" USING "btree" ("seller_id", "event_type");



CREATE INDEX "idx_shop_analytics_seller_date" ON "public"."shop_analytics" USING "btree" ("seller_id", "date" DESC);



CREATE INDEX "idx_shop_analytics_seller_event" ON "public"."shop_analytics" USING "btree" ("seller_id", "event_type");



CREATE INDEX "idx_shop_analytics_seller_id" ON "public"."shop_analytics" USING "btree" ("seller_id");



CREATE INDEX "idx_shop_analytics_session" ON "public"."shop_analytics" USING "btree" ("session_id");



CREATE INDEX "idx_shop_analytics_visitor" ON "public"."shop_analytics" USING "btree" ("visitor_id", "created_at" DESC);



CREATE INDEX "idx_subscriptions_business_id" ON "public"."subscriptions" USING "btree" ("business_id");



CREATE INDEX "idx_subscriptions_status" ON "public"."subscriptions" USING "btree" ("status");



CREATE INDEX "idx_subscriptions_stripe_subscription_id" ON "public"."subscriptions" USING "btree" ("stripe_subscription_id");



CREATE INDEX "idx_subscriptions_user_id" ON "public"."subscriptions" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "audit_businesses_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."businesses" FOR EACH ROW EXECUTE FUNCTION "public"."audit_trigger_function"();



CREATE OR REPLACE TRIGGER "audit_claim_requests_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."claim_requests" FOR EACH ROW EXECUTE FUNCTION "public"."audit_trigger_function"();



CREATE OR REPLACE TRIGGER "audit_subscriptions_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."audit_trigger_function"();



CREATE OR REPLACE TRIGGER "trg_claim_requests_updated_at" BEFORE UPDATE ON "public"."claim_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "update_admin_users_updated_at" BEFORE UPDATE ON "public"."admin_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_businesses_updated_at" BEFORE UPDATE ON "public"."businesses" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_claim_requests_updated_at" BEFORE UPDATE ON "public"."claim_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_subscriptions_updated_at" BEFORE UPDATE ON "public"."subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."businesses"
    ADD CONSTRAINT "businesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contact_access_logs"
    ADD CONSTRAINT "contact_access_logs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can delete businesses" ON "public"."businesses" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."owner_user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can insert businesses" ON "public"."businesses" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."owner_user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can manage templates" ON "public"."feature_templates" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Admins can read all settings" ON "public"."platform_settings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Admins can update businesses" ON "public"."businesses" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."owner_user_id" = "auth"."uid"())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."owner_user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can update settings" ON "public"."platform_settings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."app_role"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Admins can view all access logs" ON "public"."contact_access_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."owner_user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can view all businesses" ON "public"."businesses" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE (("au"."owner_user_id" = "auth"."uid"()) AND (("au"."role")::"text" = ANY ((ARRAY['admin'::character varying, 'super_admin'::character varying])::"text"[]))))));



CREATE POLICY "Anyone can insert analytics" ON "public"."shop_analytics" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can read countries" ON "public"."countries" FOR SELECT USING (true);



CREATE POLICY "Anyone can view active templates" ON "public"."feature_templates" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Business owners can view access logs" ON "public"."contact_access_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."businesses"
  WHERE (("businesses"."id" = "contact_access_logs"."business_id") AND ("businesses"."user_id" = "auth"."uid"())))));



CREATE POLICY "Owners can update own linked business" ON "public"."businesses" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Owners can view own linked business" ON "public"."businesses" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Public can insert contact access logs" ON "public"."contact_access_logs" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public can read public settings" ON "public"."platform_settings" FOR SELECT TO "anon" USING ((("key")::"text" = ANY (ARRAY[('banner_message'::character varying)::"text", ('banner_enabled'::character varying)::"text", ('site_name'::character varying)::"text"])));



CREATE POLICY "Public can view active businesses" ON "public"."businesses" FOR SELECT USING ((("status")::"text" = 'active'::"text"));



CREATE POLICY "System can insert analytics" ON "public"."shop_analytics" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can update analytics" ON "public"."shop_analytics" FOR UPDATE USING (true);



CREATE POLICY "Users can delete own business" ON "public"."businesses" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert claim requests" ON "public"."claim_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own business" ON "public"."businesses" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own subscription" ON "public"."subscriptions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own business" ON "public"."businesses" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own claim requests" ON "public"."claim_requests" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND (("status")::"text" = 'pending'::"text")));



CREATE POLICY "Users can update own subscription" ON "public"."subscriptions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own audit logs" ON "public"."audit_logs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own claim requests" ON "public"."claim_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own subscriptions" ON "public"."subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_users_admin_manage" ON "public"."admin_users" TO "authenticated" USING ((("auth"."jwt"() ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'super_admin'::"text"]))) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'super_admin'::"text"])));



CREATE POLICY "admin_users_select_own" ON "public"."admin_users" FOR SELECT TO "authenticated" USING (("owner_user_id" = "auth"."uid"()));



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."businesses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "businesses_insert_admin" ON "public"."businesses" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "businesses_insert_public_pending" ON "public"."businesses" FOR INSERT WITH CHECK ((("owner_user_id" IS NULL) AND (("status")::"text" = ANY ((ARRAY['pending'::character varying, 'submitted'::character varying])::"text"[]))));



CREATE POLICY "businesses_select_public" ON "public"."businesses" FOR SELECT USING (true);



CREATE POLICY "businesses_update_admin" ON "public"."businesses" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "businesses_update_owner" ON "public"."businesses" FOR UPDATE TO "authenticated" USING (("owner_user_id" = "auth"."uid"())) WITH CHECK (("owner_user_id" = "auth"."uid"()));



ALTER TABLE "public"."claim_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "claim_requests_insert_own" ON "public"."claim_requests" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "claim_requests_insert_self" ON "public"."claim_requests" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "claim_requests_select_admin" ON "public"."claim_requests" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "claim_requests_select_own" ON "public"."claim_requests" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "claim_requests_select_self" ON "public"."claim_requests" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "claim_requests_update_admin" ON "public"."claim_requests" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



ALTER TABLE "public"."contact_access_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feature_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pacific_places" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_admin" ON "public"."profiles" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles_update_admin" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "public read places" ON "public"."pacific_places" FOR SELECT USING (true);



CREATE POLICY "public read profiles" ON "public"."profiles" FOR SELECT USING (true);



ALTER TABLE "public"."shop_analytics" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "shop_analytics_public_insert" ON "public"."shop_analytics" FOR INSERT WITH CHECK (true);



ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "users update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."add_shipment_tracking_event"("p_shipment_id" bigint, "p_status" "text", "p_location" "text", "p_description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_shipment_tracking_event"("p_shipment_id" bigint, "p_status" "text", "p_location" "text", "p_description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_shipment_tracking_event"("p_shipment_id" bigint, "p_status" "text", "p_location" "text", "p_description" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."allocate_monthly_boost_credits"() TO "anon";
GRANT ALL ON FUNCTION "public"."allocate_monthly_boost_credits"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."allocate_monthly_boost_credits"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_trigger_function"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_trigger_function"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_trigger_function"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_initialize_service_subscription"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_initialize_service_subscription"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_initialize_service_subscription"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_commission_bps"("p_seller_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_commission_bps"("p_seller_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_commission_bps"("p_seller_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_commission_for_seller"("p_seller_id" "uuid", "p_subtotal_cents" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_commission_for_seller"("p_seller_id" "uuid", "p_subtotal_cents" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_commission_for_seller"("p_seller_id" "uuid", "p_subtotal_cents" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_monthly_fee"("p_seller_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_monthly_fee"("p_seller_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_monthly_fee"("p_seller_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_platform_fee"("p_order_id" bigint, "p_seller_id" bigint, "p_subtotal_cents" integer, "p_fee_rate" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_platform_fee"("p_order_id" bigint, "p_seller_id" bigint, "p_subtotal_cents" integer, "p_fee_rate" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_platform_fee"("p_order_id" bigint, "p_seller_id" bigint, "p_subtotal_cents" integer, "p_fee_rate" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_seller_commission"("p_seller_id" bigint, "p_subtotal_cents" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_seller_commission"("p_seller_id" bigint, "p_subtotal_cents" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_seller_commission"("p_seller_id" bigint, "p_subtotal_cents" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_seller_net"("p_gross_cents" integer, "p_commission_rate" numeric, "p_reserve_bps" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_seller_net"("p_gross_cents" integer, "p_commission_rate" numeric, "p_reserve_bps" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_seller_net"("p_gross_cents" integer, "p_commission_rate" numeric, "p_reserve_bps" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_expired_directory_subscriptions"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_expired_directory_subscriptions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_expired_directory_subscriptions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_order_item_target"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_order_item_target"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_order_item_target"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_follower_notifications"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_follower_notifications"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_follower_notifications"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_product_boost"("p_seller_id" bigint, "p_product_id" bigint, "p_placement" "public"."boost_placement", "p_duration_days" integer, "p_cost_cents" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."create_product_boost"("p_seller_id" bigint, "p_product_id" bigint, "p_placement" "public"."boost_placement", "p_duration_days" integer, "p_cost_cents" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_product_boost"("p_seller_id" bigint, "p_product_id" bigint, "p_placement" "public"."boost_placement", "p_duration_days" integer, "p_cost_cents" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."ensure_single_default_address"() TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_single_default_address"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_single_default_address"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_claim_code"("listing_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."generate_claim_code"("listing_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_claim_code"("listing_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_quote_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_quote_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_quote_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_transfer_group"("p_order_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."generate_transfer_group"("p_order_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_transfer_group"("p_order_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint, "p_coupons" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint, "p_coupons" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_cart_grouped_by_seller"("p_cart_id" bigint, "p_coupons" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_seller_boost_balance"("p_seller_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_seller_boost_balance"("p_seller_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_seller_boost_balance"("p_seller_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_seller_monthly_fee"("p_seller_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_seller_monthly_fee"("p_seller_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_seller_monthly_fee"("p_seller_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_seller_stripe_account"("p_seller_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_seller_stripe_account"("p_seller_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_seller_stripe_account"("p_seller_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_shop_analytics_summary"("p_seller_id" integer, "p_admin_listing_id" integer, "p_days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_shop_analytics_summary"("p_seller_id" integer, "p_admin_listing_id" integer, "p_days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_shop_analytics_summary"("p_seller_id" integer, "p_admin_listing_id" integer, "p_days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_unread_message_count"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_unread_message_count"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_unread_message_count"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_directory_analytics"("p_seller_id" integer, "p_event_type" "text", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_directory_analytics"("p_seller_id" integer, "p_event_type" "text", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_directory_analytics"("p_seller_id" integer, "p_event_type" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_product_views"("product_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_product_views"("product_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_product_views"("product_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_promo_code_usage"() TO "anon";
GRANT ALL ON FUNCTION "public"."increment_promo_code_usage"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_promo_code_usage"() TO "service_role";



GRANT ALL ON FUNCTION "public"."initialize_service_trial"("p_seller_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."initialize_service_trial"("p_seller_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."initialize_service_trial"("p_seller_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"("check_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("check_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("check_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_service_subscription_active"("p_seller_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."is_service_subscription_active"("p_seller_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_service_subscription_active"("p_seller_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_service_subscription_active"("p_seller_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_service_subscription_active"("p_seller_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_service_subscription_active"("p_seller_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_shop_member"("p_seller_id" bigint, "p_user_id" "uuid", "p_min_role" "public"."member_role") TO "anon";
GRANT ALL ON FUNCTION "public"."is_shop_member"("p_seller_id" bigint, "p_user_id" "uuid", "p_min_role" "public"."member_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_shop_member"("p_seller_id" bigint, "p_user_id" "uuid", "p_min_role" "public"."member_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_super_admin"("check_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_super_admin"("check_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_super_admin"("check_user_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."link_business_to_signed_in_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."link_business_to_signed_in_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."link_business_to_signed_in_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."link_business_to_signed_in_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_service_publish_without_sub"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_service_publish_without_sub"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_service_publish_without_sub"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_unread_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_unread_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_unread_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_commission_by_seller_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_commission_by_seller_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_commission_by_seller_type"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_order_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_order_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_order_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_payout_method_by_country"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_payout_method_by_country"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_payout_method_by_country"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_quote_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_quote_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_quote_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_seller_commission"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_seller_commission"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_seller_commission"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_user_email_to_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_user_email_to_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_user_email_to_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."track_shop_event"("p_event_type" character varying, "p_seller_id" integer, "p_admin_listing_id" integer, "p_event_data" "jsonb", "p_visitor_id" character varying, "p_session_id" character varying, "p_user_agent" "text", "p_referrer" "text", "p_ip_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."track_shop_event"("p_event_type" character varying, "p_seller_id" integer, "p_admin_listing_id" integer, "p_event_data" "jsonb", "p_visitor_id" character varying, "p_session_id" character varying, "p_user_agent" "text", "p_referrer" "text", "p_ip_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_shop_event"("p_event_type" character varying, "p_seller_id" integer, "p_admin_listing_id" integer, "p_event_data" "jsonb", "p_visitor_id" character varying, "p_session_id" character varying, "p_user_agent" "text", "p_referrer" "text", "p_ip_address" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_admin_directory_listings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_admin_directory_listings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_admin_directory_listings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_cart_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_cart_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_cart_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_conversation_thread"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_conversation_thread"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_conversation_thread"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_creator_feature_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_creator_feature_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_creator_feature_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_directory_featured"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_directory_featured"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_directory_featured"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_message_threads_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_message_threads_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_message_threads_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_parent_cart_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_parent_cart_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_parent_cart_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_promo_codes_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_promo_codes_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_promo_codes_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_quote_timestamps"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_quote_timestamps"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_quote_timestamps"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_rfp_proposal_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_rfp_proposal_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_rfp_proposal_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_rfp_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_rfp_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_rfp_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_rfq_proposal_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_rfq_proposal_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_rfq_proposal_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_rfq_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_rfq_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_rfq_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_seller_commission_on_plan_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_seller_commission_on_plan_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_seller_commission_on_plan_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_seller_follower_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_seller_follower_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_seller_follower_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_seller_product_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_seller_product_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_seller_product_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_seller_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_seller_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_seller_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_seller_service_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_seller_service_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_seller_service_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_sellers_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_sellers_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_sellers_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_service_request_response_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_service_request_response_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_service_request_response_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_service_requests_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_service_requests_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_service_requests_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_shipment_from_ptp"("p_shipment_id" bigint, "p_ptp_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_shipment_from_ptp"("p_shipment_id" bigint, "p_ptp_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_shipment_from_ptp"("p_shipment_id" bigint, "p_ptp_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_shipments_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_shipments_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_shipments_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_shipping_options_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_shipping_options_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_shipping_options_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_thread_last_message"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_thread_last_message"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_thread_last_message"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_subtotal_cents" bigint, "p_currency" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_subtotal_cents" bigint, "p_currency" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_subtotal_cents" bigint, "p_currency" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_currency" "text", "p_subtotal_cents" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_currency" "text", "p_subtotal_cents" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_coupon_for_seller"("p_seller_id" bigint, "p_code" "text", "p_currency" "text", "p_subtotal_cents" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_purchase_for_review"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_purchase_for_review"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_purchase_for_review"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."business_images" TO "anon";
GRANT ALL ON TABLE "public"."business_images" TO "authenticated";
GRANT ALL ON TABLE "public"."business_images" TO "service_role";



GRANT ALL ON TABLE "public"."business_owners" TO "anon";
GRANT ALL ON TABLE "public"."business_owners" TO "authenticated";
GRANT ALL ON TABLE "public"."business_owners" TO "service_role";



GRANT ALL ON TABLE "public"."businesses" TO "anon";
GRANT ALL ON TABLE "public"."businesses" TO "authenticated";
GRANT ALL ON TABLE "public"."businesses" TO "service_role";



GRANT ALL ON TABLE "public"."claim_requests" TO "anon";
GRANT ALL ON TABLE "public"."claim_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."claim_requests" TO "service_role";



GRANT ALL ON TABLE "public"."contact_access_logs" TO "anon";
GRANT ALL ON TABLE "public"."contact_access_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_access_logs" TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."feature_templates" TO "anon";
GRANT ALL ON TABLE "public"."feature_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."feature_templates" TO "service_role";



GRANT ALL ON SEQUENCE "public"."feature_templates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."feature_templates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."feature_templates_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pacific_places" TO "anon";
GRANT ALL ON TABLE "public"."pacific_places" TO "authenticated";
GRANT ALL ON TABLE "public"."pacific_places" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pacific_places_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pacific_places_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pacific_places_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."platform_settings" TO "anon";
GRANT ALL ON TABLE "public"."platform_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."platform_settings" TO "service_role";



GRANT ALL ON TABLE "public"."product_services" TO "anon";
GRANT ALL ON TABLE "public"."product_services" TO "authenticated";
GRANT ALL ON TABLE "public"."product_services" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."shop_analytics" TO "anon";
GRANT ALL ON TABLE "public"."shop_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."shop_analytics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shop_analytics_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shop_analytics_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shop_analytics_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







