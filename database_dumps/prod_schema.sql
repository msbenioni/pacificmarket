--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'Subscription tables removed - platform is now directory-focused';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: hypopg; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hypopg WITH SCHEMA extensions;


--
-- Name: EXTENSION hypopg; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hypopg IS 'Hypothetical indexes for PostgreSQL';


--
-- Name: index_advisor; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS index_advisor WITH SCHEMA extensions;


--
-- Name: EXTENSION index_advisor; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION index_advisor IS 'Query index advisor';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'owner',
    'admin'
);


--
-- Name: boost_placement; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.boost_placement AS ENUM (
    'homepage',
    'category',
    'search_priority'
);


--
-- Name: business_growth_stage_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_growth_stage_enum AS ENUM (
    'idea_planning',
    'startup_0_2',
    'growth_2_5',
    'mature_5_plus'
);


--
-- Name: business_source_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_source_enum AS ENUM (
    'user',
    'admin',
    'import',
    'claim'
);


--
-- Name: business_stage_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_stage_enum AS ENUM (
    'idea',
    'startup',
    'growth',
    'mature'
);


--
-- Name: business_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_status_enum AS ENUM (
    'pending',
    'active',
    'rejected'
);


--
-- Name: coupon_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.coupon_type AS ENUM (
    'PERCENT',
    'FIXED'
);


--
-- Name: import_export_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.import_export_status_enum AS ENUM (
    'none',
    'import_only',
    'export_only',
    'both'
);


--
-- Name: item_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.item_status AS ENUM (
    'new',
    'processing',
    'shipped',
    'delivered',
    'refunded'
);


--
-- Name: member_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.member_role AS ENUM (
    'owner',
    'admin',
    'staff'
);


--
-- Name: message_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_status AS ENUM (
    'unread',
    'read',
    'archived'
);


--
-- Name: mod_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.mod_status AS ENUM (
    'open',
    'approved',
    'rejected'
);


--
-- Name: mod_target; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.mod_target AS ENUM (
    'product',
    'seller'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'paid',
    'processing',
    'shipped',
    'completed',
    'cancelled',
    'refunded'
);


--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status AS ENUM (
    'requires_payment',
    'processing',
    'paid',
    'failed',
    'cancelled',
    'refunded',
    'partial_refund'
);


--
-- Name: product_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.product_type AS ENUM (
    'physical',
    'digital',
    'service'
);


--
-- Name: publish_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publish_status AS ENUM (
    'draft',
    'published',
    'archived'
);


--
-- Name: review_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.review_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'hidden'
);


--
-- Name: seller_offering_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.seller_offering_type AS ENUM (
    'physical_product',
    'digital_product',
    'service'
);


--
-- Name: seller_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.seller_type AS ENUM (
    'products',
    'services',
    'hybrid'
);


--
-- Name: service_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.service_status AS ENUM (
    'draft',
    'published',
    'archived'
);


--
-- Name: shipping_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.shipping_method AS ENUM (
    'pass_the_parcel',
    'manual',
    'pickup',
    'free'
);


--
-- Name: subscription_plan_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_plan_type AS ENUM (
    'free',
    'pro'
);


--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_status AS ENUM (
    'trial',
    'active',
    'past_due',
    'canceled',
    'inactive'
);


--
-- Name: subscription_tier_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_tier_enum AS ENUM (
    'basic',
    'verified',
    'featured_plus'
);


--
-- Name: team_size_band_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.team_size_band_enum AS ENUM (
    'solo',
    '2-5',
    '6-10',
    '11-50',
    '51+'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: add_shipment_tracking_event(bigint, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_shipment_tracking_event(p_shipment_id bigint, p_status text, p_location text DEFAULT NULL::text, p_description text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: allocate_monthly_boost_credits(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.allocate_monthly_boost_credits() RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: audit_trigger_function(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_trigger_function() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: auto_initialize_service_subscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_initialize_service_subscription() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: calculate_commission_bps(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_commission_bps(p_seller_id bigint) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: calculate_commission_for_seller(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_commission_for_seller(p_seller_id uuid, p_subtotal_cents integer) RETURNS integer
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: calculate_monthly_fee(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_monthly_fee(p_seller_id bigint) RETURNS numeric
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: calculate_platform_fee(bigint, bigint, integer, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_platform_fee(p_order_id bigint, p_seller_id bigint, p_subtotal_cents integer, p_fee_rate numeric DEFAULT 9.50) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: calculate_seller_commission(bigint, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_seller_commission(p_seller_id bigint, p_subtotal_cents integer) RETURNS integer
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: calculate_seller_net(integer, numeric, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_seller_net(p_gross_cents integer, p_commission_rate numeric DEFAULT 0.06, p_reserve_bps integer DEFAULT 0) RETURNS TABLE(net_cents integer, commission_cents integer, reserve_cents integer)
    LANGUAGE plpgsql IMMUTABLE
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN QUERY SELECT
    (p_gross_cents - ROUND(p_gross_cents * p_commission_rate) - ROUND(p_gross_cents * p_reserve_bps / 10000.0))::integer AS net_cents,
    ROUND(p_gross_cents * p_commission_rate)::integer AS commission_cents,
    ROUND(p_gross_cents * p_reserve_bps / 10000.0)::integer AS reserve_cents;
END;
$$;


--
-- Name: cleanup_expired_unsubscribe_tokens(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_unsubscribe_tokens() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_unsubscribe_tokens 
    WHERE expires_at < NOW() - INTERVAL '7 days';
    
    -- Get count of deleted rows
    SELECT COUNT(*) INTO deleted_count FROM email_unsubscribe_tokens;
    
    RETURN deleted_count;
END;
$$;


--
-- Name: create_follower_notifications(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_follower_notifications() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: create_product_boost(bigint, bigint, public.boost_placement, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_product_boost(p_seller_id bigint, p_product_id bigint, p_placement public.boost_placement, p_duration_days integer, p_cost_cents integer) RETURNS bigint
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: create_referral_if_present(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_referral_if_present(p_referrer_code text, p_referred_business_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_referrer_business_id UUID;
BEGIN
    -- Only proceed if we have a valid referral code
    IF p_referrer_code IS NOT NULL AND p_referrer_code != '' THEN
        -- Find the referrer business by their referral code
        SELECT id INTO v_referrer_business_id
        FROM businesses
        WHERE referral_code = p_referrer_code;
        
        -- If we found a valid referrer and it's not self-referral
        IF v_referrer_business_id IS NOT NULL AND v_referrer_business_id != p_referred_business_id THEN
            -- Insert the referral record
            INSERT INTO referrals (referrer_business_id, referred_business_id, status)
            VALUES (v_referrer_business_id, p_referred_business_id, 'approved')
            ON CONFLICT (referrer_business_id, referred_business_id) DO NOTHING;
        END IF;
    END IF;
END;
$$;


--
-- Name: ensure_single_default_address(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.ensure_single_default_address() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: generate_order_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_order_number() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: generate_quote_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_quote_number() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: generate_transfer_group(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_transfer_group(p_order_id bigint) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN 'order_' || p_order_id::text;
END;
$$;


--
-- Name: get_business_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_business_stats() RETURNS TABLE(total_businesses bigint, verified_businesses bigint, countries_represented bigint, industries_count bigint, cultural_identities_count bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_businesses,
        COUNT(*) FILTER (WHERE verified = true) as verified_businesses,
        COUNT(DISTINCT country) as countries_represented,
        COUNT(DISTINCT industry) as industries_count,
        COUNT(DISTINCT cultural_identity) as cultural_identities_count
    FROM businesses
    WHERE status = 'active';
END;
$$;


--
-- Name: get_cart_grouped_by_seller(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_cart_grouped_by_seller(p_cart_id bigint) RETURNS TABLE(seller_id bigint, shop_name text, currency text, subtotal_cents bigint, platform_fee_percentage numeric, platform_fee_cents bigint)
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: get_cart_grouped_by_seller(bigint, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_cart_grouped_by_seller(p_cart_id bigint, p_coupons jsonb DEFAULT '{}'::jsonb) RETURNS TABLE(seller_id bigint, seller_name text, seller_currency text, platform_fee_percentage numeric, items jsonb, subtotal_cents bigint, discount_cents bigint, shipping_cents bigint, tax_cents bigint, platform_fee_cents bigint, total_cents bigint)
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: get_challenges_analysis(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_challenges_analysis() RETURNS TABLE(challenge text, frequency bigint, percentage numeric, business_stage text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    challenge,
    COUNT(*) as frequency,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
    business_stage
  FROM business_insights_snapshots, 
       unnest(top_challenges) as challenge
  WHERE top_challenges IS NOT NULL
    AND snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY challenge, business_stage
  ORDER BY frequency DESC;
END;
$$;


--
-- Name: get_economic_insights(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_economic_insights() RETURNS TABLE(total_revenue bigint, total_employees bigint, funding_distribution jsonb, challenge_distribution jsonb, education_distribution jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(annual_revenue_exact), 0) as total_revenue,
        COALESCE(SUM(full_time_employees + part_time_employees), 0) as total_employees,
        jsonb_build_object(
            'self_funded', COUNT(*) FILTER (WHERE funding_source = 'self-funded'),
            'bank_loans', COUNT(*) FILTER (WHERE funding_source = 'bank-loans'),
            'government_grants', COUNT(*) FILTER (WHERE funding_source = 'government-grants'),
            'investors', COUNT(*) FILTER (WHERE funding_source IN ('angel-investors', 'venture-capital'))
        ) as funding_distribution,
        jsonb_build_object(
            'access_to_capital', COUNT(*) FILTER (WHERE 'access-to-capital' = ANY(business_challenges)),
            'market_access', COUNT(*) FILTER (WHERE 'market-access' = ANY(business_challenges)),
            'talent_acquisition', COUNT(*) FILTER (WHERE 'talent-acquisition' = ANY(business_challenges)),
            'digital_transformation', COUNT(*) FILTER (WHERE 'digital-transformation' = ANY(business_challenges))
        ) as challenge_distribution,
        (SELECT jsonb_build_object(
            'high_school', COUNT(*) FILTER (WHERE education_level = 'high-school'),
            'bachelors', COUNT(*) FILTER (WHERE education_level = 'bachelors-degree'),
            'masters', COUNT(*) FILTER (WHERE education_level = 'masters-degree'),
            'phd', COUNT(*) FILTER (WHERE education_level = 'phd')
        ) FROM analytics_profiles) as education_distribution
    FROM analytics_businesses
    WHERE status = 'active';
END;
$$;


--
-- Name: get_ecosystem_insights(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_ecosystem_insights() RETURNS TABLE(hiring_intentions boolean, collaboration_interest boolean, founder_count bigint, avg_business_stage text, common_impact_areas text[])
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hiring_intentions,
    collaboration_interest,
    COUNT(*) as founder_count,
    MODE() WITHIN GROUP (ORDER BY business_stage) as avg_business_stage,
    ARRAY_AGG(DISTINCT unnest(community_impact_areas)) FILTER (WHERE community_impact_areas IS NOT NULL) as common_impact_areas
  FROM business_insights_snapshots
  WHERE snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY hiring_intentions, collaboration_interest
  ORDER BY founder_count DESC;
END;
$$;


--
-- Name: get_financial_insights_summary(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_financial_insights_summary() RETURNS TABLE(funding_source text, funding_amount text, investment_stage text, business_count bigint, avg_funding_needed text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bis.current_funding_source as funding_source,
    bis.funding_amount_needed as funding_amount,
    bis.investment_stage as investment_stage,
    COUNT(*) as business_count,
    MODE() WITHIN GROUP (ORDER BY bis.funding_amount_needed) as avg_funding_needed
  FROM business_insights_snapshots bis
  WHERE bis.current_funding_source IS NOT NULL
  GROUP BY bis.current_funding_source, bis.funding_amount_needed, bis.investment_stage
  ORDER BY business_count DESC;
END;
$$;


--
-- Name: get_founder_insights_summary(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_founder_insights_summary() RETURNS TABLE(total_founders bigint, avg_businesses_founded numeric, top_business_stages text, common_challenges text[], hiring_plans_percentage numeric, collaboration_interest_percentage numeric)
    LANGUAGE plpgsql
    AS $_$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_founders,
    ROUND(AVG(CASE WHEN businesses_founded ~ '^[0-9]+$' THEN CAST(businesses_founded AS INTEGER) ELSE 0 END), 2) as avg_businesses_founded,
    MODE() WITHIN GROUP (ORDER BY business_stage) as top_business_stages,
    ARRAY_AGG(DISTINCT unnest(top_challenges)) FILTER (WHERE top_challenges IS NOT NULL) as common_challenges,
    ROUND(AVG(CASE WHEN hiring_intentions = true THEN 100 ELSE 0 END), 2) as hiring_plans_percentage,
    ROUND(AVG(CASE WHEN collaboration_interest = true THEN 100 ELSE 0 END), 2) as collaboration_interest_percentage
  FROM business_insights_snapshots
  WHERE snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE);
END;
$_$;


--
-- Name: get_funding_gaps_analysis(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_funding_gaps_analysis() RETURNS TABLE(funding_source text, seeking_funding bigint, avg_amount_needed text, common_purposes text[])
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bis.current_funding_source,
    COUNT(CASE WHEN bis.funding_amount_needed != 'not-sure' THEN 1 END) as seeking_funding,
    MODE() WITHIN GROUP (ORDER BY bis.funding_amount_needed) as avg_amount_needed,
    ARRAY_AGG(DISTINCT bis.funding_purpose) FILTER (WHERE bis.funding_purpose IS NOT NULL) as common_purposes
  FROM business_insights_snapshots bis
  WHERE bis.current_funding_source IS NOT NULL
  GROUP BY bis.current_funding_source
  ORDER BY seeking_funding DESC;
END;
$$;


--
-- Name: get_referral_stats(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_referral_stats(p_business_id uuid) RETURNS TABLE(total_referrals bigint, pending_referrals bigint, approved_referrals bigint, draw_entries bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_referrals,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_referrals,
        COUNT(*) FILTER (WHERE status = 'approved') as draw_entries
    FROM referrals
    WHERE referrer_business_id = p_business_id;
END;
$$;


--
-- Name: get_seller_boost_balance(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_seller_boost_balance(p_seller_id bigint) RETURNS integer
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: get_seller_monthly_fee(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_seller_monthly_fee(p_seller_id uuid) RETURNS integer
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: get_seller_stripe_account(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_seller_stripe_account(p_seller_id bigint) RETURNS text
    LANGUAGE sql STABLE
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
  select stripe_connect_account_id
  from sellers
  where id = p_seller_id
    and stripe_connect_account_id is not null
    and stripe_charges_enabled = true
    and stripe_payouts_enabled  = true;
$$;


--
-- Name: get_shop_analytics_summary(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_shop_analytics_summary(p_seller_id integer DEFAULT NULL::integer, p_admin_listing_id integer DEFAULT NULL::integer, p_days integer DEFAULT 30) RETURNS TABLE(total_views bigint, unique_visitors bigint, product_clicks bigint, contact_submissions bigint, avg_time_on_page numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
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


--
-- Name: FUNCTION get_shop_analytics_summary(p_seller_id integer, p_admin_listing_id integer, p_days integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_shop_analytics_summary(p_seller_id integer, p_admin_listing_id integer, p_days integer) IS 'Returns analytics summary for a seller shop or admin listing. Uses fixed search_path for security.';


--
-- Name: get_unread_message_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_unread_message_count(user_uuid uuid) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: get_users_with_gdpr_consent(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_users_with_gdpr_consent() RETURNS TABLE(user_id uuid, email text, display_name text, gdpr_consent boolean, gdpr_consent_date timestamp with time zone, created_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.display_name,
        p.gdpr_consent,
        p.gdpr_consent_date,
        p.created_at
    FROM public.profiles p
    WHERE p.gdpr_consent = true
    ORDER BY p.created_at DESC;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, email, gdpr_consent, gdpr_consent_date)
  values (
    new.id, 
    new.email,
    (new.raw_user_meta_data->>'gdpr_consent')::boolean,
    (new.raw_user_meta_data->>'gdpr_consent_date')::timestamptz
  );
  return new;
end;
$$;


--
-- Name: increment_directory_analytics(integer, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_directory_analytics(p_seller_id integer, p_event_type text, p_metadata jsonb DEFAULT NULL::jsonb) RETURNS void
    LANGUAGE plpgsql
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


--
-- Name: FUNCTION increment_directory_analytics(p_seller_id integer, p_event_type text, p_metadata jsonb); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.increment_directory_analytics(p_seller_id integer, p_event_type text, p_metadata jsonb) IS 'Increments analytics count for a seller and event type, creates or updates daily record';


--
-- Name: increment_product_views(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_product_views(product_id bigint) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE public.products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$;


--
-- Name: increment_promo_code_usage(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_promo_code_usage() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: initialize_service_trial(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.initialize_service_trial(p_seller_id uuid) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;


--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin(check_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id
  );
END;
$$;


--
-- Name: is_service_subscription_active(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_service_subscription_active(p_seller_id integer) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: is_service_subscription_active(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_service_subscription_active(p_seller_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: is_shop_member(bigint, uuid, public.member_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_shop_member(p_seller_id bigint, p_user_id uuid, p_min_role public.member_role DEFAULT 'staff'::public.member_role) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: is_super_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_super_admin(check_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id AND role = 'super_admin'
  );
END;
$$;


--
-- Name: link_business_to_signed_in_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.link_business_to_signed_in_user() RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: prevent_service_publish_without_sub(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_service_publish_without_sub() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: FUNCTION prevent_service_publish_without_sub(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.prevent_service_publish_without_sub() IS 'Prevents publishing services without active subscription or valid trial';


--
-- Name: reset_unread_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.reset_unread_count() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: select_monthly_referral_winner(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.select_monthly_referral_winner() RETURNS TABLE(business_id uuid, business_name text, referral_count bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    WITH referral_counts AS (
        SELECT 
            referrer_business_id,
            COUNT(*) as count
        FROM referrals
        WHERE status = 'approved'
        GROUP BY referrer_business_id
    ),
    winner_selection AS (
        SELECT 
            rc.referrer_business_id,
            rc.count,
            -- This gives each referral an equal chance, not businesses with more referrals
            ROW_NUMBER() OVER (ORDER BY random()) as rn
        FROM referral_counts rc
    )
    SELECT 
        b.id as business_id,
        b.name as business_name,
        ws.count as referral_count
    FROM winner_selection ws
    JOIN businesses b ON b.id = ws.referrer_business_id
    WHERE ws.rn = 1;
END;
$$;


--
-- Name: set_commission_by_seller_type(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_commission_by_seller_type() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: set_order_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_order_number() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: set_payout_method_by_country(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_payout_method_by_country() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: set_quote_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_quote_number() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: set_seller_commission(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_seller_commission() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  -- All sellers get 6.5% commission (650 basis points)
  -- Both fixed_price and pro sellers have the same commission rate
  NEW.commission_bps := 650;

  RETURN NEW;
END;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end $$;


--
-- Name: sync_user_email_to_profile(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_user_email_to_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: FUNCTION sync_user_email_to_profile(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.sync_user_email_to_profile() IS 'Automatically syncs email changes from auth.users to profiles table';


--
-- Name: track_shop_event(character varying, integer, integer, jsonb, character varying, character varying, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.track_shop_event(p_event_type character varying, p_seller_id integer DEFAULT NULL::integer, p_admin_listing_id integer DEFAULT NULL::integer, p_event_data jsonb DEFAULT '{}'::jsonb, p_visitor_id character varying DEFAULT NULL::character varying, p_session_id character varying DEFAULT NULL::character varying, p_user_agent text DEFAULT NULL::text, p_referrer text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
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


--
-- Name: FUNCTION track_shop_event(p_event_type character varying, p_seller_id integer, p_admin_listing_id integer, p_event_data jsonb, p_visitor_id character varying, p_session_id character varying, p_user_agent text, p_referrer text, p_ip_address text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.track_shop_event(p_event_type character varying, p_seller_id integer, p_admin_listing_id integer, p_event_data jsonb, p_visitor_id character varying, p_session_id character varying, p_user_agent text, p_referrer text, p_ip_address text) IS 'Tracks a shop analytics event for both regular sellers and admin-created listings. Uses fixed search_path for security.';


--
-- Name: update_admin_directory_listings_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_admin_directory_listings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_cart_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_cart_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_conversation_thread(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_conversation_thread() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_creator_feature_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_creator_feature_stats() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_directory_featured(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_directory_featured() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_message_threads_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_message_threads_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


--
-- Name: update_parent_cart_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_parent_cart_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  UPDATE carts SET updated_at = NOW() 
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: update_product_search_vector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_product_search_vector() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$;


--
-- Name: update_promo_codes_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_promo_codes_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: update_quote_timestamps(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_quote_timestamps() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_rfp_proposal_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_rfp_proposal_count() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_rfp_search_vector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_rfp_search_vector() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$;


--
-- Name: update_rfq_proposal_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_rfq_proposal_count() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_rfq_search_vector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_rfq_search_vector() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$;


--
-- Name: update_seller_commission_on_plan_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_seller_commission_on_plan_change() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_seller_follower_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_seller_follower_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_seller_product_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_seller_product_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_seller_search_vector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_seller_search_vector() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: FUNCTION update_seller_search_vector(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.update_seller_search_vector() IS 'Updates search_vector for sellers table (brand_story removed - now in shop_templates)';


--
-- Name: update_seller_service_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_seller_service_count() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_sellers_search_vector(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_sellers_search_vector() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: FUNCTION update_sellers_search_vector(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.update_sellers_search_vector() IS 'Updates search_vector for sellers table (brand_story removed - now in shop_templates)';


--
-- Name: update_service_request_response_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_service_request_response_count() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_service_requests_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_service_requests_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_shipment_from_ptp(bigint, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_shipment_from_ptp(p_shipment_id bigint, p_ptp_data jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: update_shipments_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_shipments_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_shipping_options_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_shipping_options_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_thread_last_message(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_thread_last_message() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
    AS $$
BEGIN
    UPDATE public.message_threads
    SET last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: validate_coupon_for_seller(bigint, text, bigint, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_coupon_for_seller(p_seller_id bigint, p_code text, p_subtotal_cents bigint, p_currency text) RETURNS TABLE(valid boolean, discount_cents bigint, message text)
    LANGUAGE plpgsql
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: validate_coupon_for_seller(bigint, text, text, bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_coupon_for_seller(p_seller_id bigint, p_code text, p_currency text, p_subtotal_cents bigint) RETURNS TABLE(coupon_id bigint, ctype public.coupon_type, percent_off numeric, amount_off integer, discount_cents bigint)
    LANGUAGE sql STABLE
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: validate_financial_insights(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_financial_insights() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Validate revenue_streams contains valid values
  IF NEW.revenue_streams IS NOT NULL THEN
    FOR i IN 1..array_length(NEW.revenue_streams, 1) LOOP
      IF NEW.revenue_streams[i] NOT IN ('product-sales', 'service-fees', 'subscription', 'consulting', 'licensing', 'advertising', 'commission', 'rental', 'other') THEN
        RAISE EXCEPTION 'Invalid revenue stream: %', NEW.revenue_streams[i];
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: validate_founder_insights(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_founder_insights() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Validate business_stage
  IF NEW.business_stage IS NOT NULL AND NEW.business_stage NOT IN ('idea', 'startup', 'growth', 'mature') THEN
    RAISE EXCEPTION 'Invalid business stage: %', NEW.business_stage;
  END IF;
  
  -- Validate top_challenges array contains valid values (if we want strict validation)
  -- Note: This is optional validation - uncomment if needed
  -- IF NEW.top_challenges IS NOT NULL THEN
  --   FOR i IN 1..array_length(NEW.top_challenges, 1) LOOP
  --     IF NEW.top_challenges[i] NOT IN ('funding', 'marketing', 'hiring', 'regulations', 'competition', 'technology', 'skills', 'network', 'time', 'cash-flow') THEN
  --       RAISE EXCEPTION 'Invalid challenge: %', NEW.top_challenges[i];
  --     END IF;
  --   END LOOP;
  -- END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: verify_purchase_for_review(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.verify_purchase_for_review() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public, extensions, pg_temp'
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


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: admin_notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_notification_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    admin_email text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: businesses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.businesses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    short_description text,
    logo_url text,
    contact_website text,
    contact_email character varying(255),
    contact_phone character varying(50),
    address text,
    country character varying(100),
    industry character varying(100),
    status character varying(20) DEFAULT 'pending'::character varying,
    subscription_tier character varying(20) DEFAULT 'basic'::character varying,
    user_id uuid,
    stripe_customer_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_date date DEFAULT CURRENT_DATE,
    contact_name text,
    languages_spoken text[],
    social_links jsonb,
    suburb text,
    city text,
    state_region text,
    postal_code text,
    business_hours text,
    banner_url text,
    cultural_identity text,
    claimed boolean DEFAULT false,
    claimed_at timestamp with time zone,
    claimed_by text,
    business_handle text,
    verified boolean DEFAULT false,
    owner_user_id uuid,
    proof_links text[],
    homepage_featured boolean DEFAULT false NOT NULL,
    visibility_tier text DEFAULT 'none'::text NOT NULL,
    business_structure text,
    annual_revenue_exact integer,
    full_time_employees integer,
    part_time_employees integer,
    primary_market text,
    growth_stage text,
    funding_source text,
    business_challenges text[],
    future_plans text,
    tech_stack text[],
    customer_segments text[],
    competitive_advantage text,
    year_started integer,
    tagline text,
    created_by uuid,
    source text DEFAULT 'user'::text,
    profile_completeness numeric(3,2) DEFAULT 0.0,
    referral_code text,
    CONSTRAINT businesses_name_not_empty CHECK ((length(TRIM(BOTH FROM name)) > 0)),
    CONSTRAINT businesses_profile_completeness_check CHECK (((profile_completeness >= 0.0) AND (profile_completeness <= 1.0))),
    CONSTRAINT businesses_shop_handle_format CHECK (((business_handle IS NULL) OR (business_handle = ''::text) OR (business_handle ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text))),
    CONSTRAINT businesses_source_check CHECK ((source = ANY (ARRAY['user'::text, 'admin'::text, 'import'::text, 'claim'::text]))),
    CONSTRAINT businesses_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT businesses_subscription_tier_check CHECK (((subscription_tier)::text = ANY ((ARRAY['vaka'::character varying, 'mana'::character varying, 'moana'::character varying, 'basic'::character varying, 'verified'::character varying, 'featured_plus'::character varying, 'free'::character varying])::text[]))),
    CONSTRAINT businesses_visibility_tier_check CHECK ((visibility_tier = ANY (ARRAY['none'::text, 'homepage'::text, 'spotlight'::text]))),
    CONSTRAINT businesses_year_started_check CHECK (((year_started >= 1900) AND ((year_started)::numeric <= (EXTRACT(year FROM CURRENT_DATE) + (1)::numeric))))
);


--
-- Name: COLUMN businesses.contact_website; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.contact_website IS 'Contact website URL';


--
-- Name: COLUMN businesses.contact_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.contact_email IS 'Contact email address';


--
-- Name: COLUMN businesses.contact_phone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.contact_phone IS 'Contact phone number';


--
-- Name: COLUMN businesses.contact_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.contact_name IS 'Primary contact person name';


--
-- Name: COLUMN businesses.languages_spoken; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.languages_spoken IS 'Array of languages spoken by the business';


--
-- Name: COLUMN businesses.social_links; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.social_links IS 'Social media links stored as JSON';


--
-- Name: COLUMN businesses.suburb; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.suburb IS 'Suburb or local area';


--
-- Name: COLUMN businesses.city; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.city IS 'City or town';


--
-- Name: COLUMN businesses.state_region; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.state_region IS 'State, province, or region';


--
-- Name: COLUMN businesses.postal_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.postal_code IS 'Postal code or ZIP code';


--
-- Name: COLUMN businesses.business_hours; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.business_hours IS 'Business operating hours';


--
-- Name: COLUMN businesses.banner_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.banner_url IS 'Banner image URL';


--
-- Name: COLUMN businesses.cultural_identity; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.cultural_identity IS 'Combined cultural identity from primary_cultural and cultural_other';


--
-- Name: COLUMN businesses.business_structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.business_structure IS 'Legal business structure (private data for analytics)';


--
-- Name: COLUMN businesses.annual_revenue_exact; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.annual_revenue_exact IS 'Exact annual revenue in USD (private data for analytics)';


--
-- Name: COLUMN businesses.full_time_employees; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.full_time_employees IS 'Exact full-time employee count (private data for analytics)';


--
-- Name: COLUMN businesses.part_time_employees; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.part_time_employees IS 'Exact part-time employee count (private data for analytics)';


--
-- Name: COLUMN businesses.primary_market; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.primary_market IS 'Primary target market (private data for analytics)';


--
-- Name: COLUMN businesses.growth_stage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.growth_stage IS 'Detailed growth stage (private data for analytics)';


--
-- Name: COLUMN businesses.funding_source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.funding_source IS 'Primary funding source (private data for analytics)';


--
-- Name: COLUMN businesses.business_challenges; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.business_challenges IS 'Key business challenges array (private data for analytics)';


--
-- Name: COLUMN businesses.future_plans; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.future_plans IS 'Growth and expansion plans (private data for analytics)';


--
-- Name: COLUMN businesses.tech_stack; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.tech_stack IS 'Technologies used array (private data for analytics)';


--
-- Name: COLUMN businesses.customer_segments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.customer_segments IS 'Primary customer types array (private data for analytics)';


--
-- Name: COLUMN businesses.competitive_advantage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.businesses.competitive_advantage IS 'Unique selling proposition (private data for analytics)';


--
-- Name: analytics_businesses; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_businesses AS
 SELECT id,
    name,
    description,
    industry,
    country,
    city,
    cultural_identity,
    languages_spoken,
    status,
    verified,
    created_at,
    business_structure,
    annual_revenue_exact,
    full_time_employees,
    part_time_employees,
    primary_market,
    growth_stage,
    funding_source,
    business_challenges,
    future_plans,
    tech_stack,
    customer_segments,
    competitive_advantage
   FROM public.businesses;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_name character varying(50) NOT NULL,
    record_id uuid NOT NULL,
    action character varying(10) NOT NULL,
    old_data jsonb,
    new_data jsonb,
    user_id uuid,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT audit_logs_action_check CHECK (((action)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


--
-- Name: business_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    url text NOT NULL,
    caption text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: business_insights_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_insights_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid,
    snapshot_year integer NOT NULL,
    submitted_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    year_started integer,
    problem_solved text,
    team_size_band public.team_size_band_enum,
    business_model text,
    family_involvement boolean DEFAULT false,
    customer_region text,
    sales_channels jsonb,
    import_export_status public.import_export_status_enum DEFAULT 'none'::public.import_export_status_enum,
    import_countries jsonb,
    export_countries jsonb,
    business_stage public.business_stage_enum,
    top_challenges jsonb,
    hiring_intentions boolean DEFAULT false,
    community_impact_areas jsonb,
    collaboration_interest boolean DEFAULT false,
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    years_entrepreneurial text,
    entrepreneurial_background text,
    businesses_founded text,
    primary_industry text,
    family_entrepreneurial_background boolean DEFAULT false,
    mentorship_access boolean DEFAULT false,
    mentorship_offering boolean DEFAULT false,
    user_id uuid,
    founder_role text,
    founder_story text,
    business_operating_status text,
    business_age text,
    business_registered boolean DEFAULT false,
    employs_anyone boolean DEFAULT false,
    employs_family_community boolean DEFAULT false,
    revenue_band text,
    pacific_identity text[],
    based_in_country text,
    based_in_city text,
    serves_pacific_communities text,
    culture_influences_business boolean DEFAULT false,
    culture_influence_details text,
    family_community_responsibilities_affect_business text[] DEFAULT '{}'::text[],
    responsibilities_impact_details text,
    support_needed_next text[],
    current_support_sources text[],
    goals_details text,
    expansion_plans boolean DEFAULT false,
    open_to_future_contact boolean DEFAULT false,
    founder_motivation_array text[],
    goals_next_12_months_array text[],
    current_funding_source text,
    funding_amount_needed text,
    funding_purpose text,
    investment_stage text,
    angel_investor_interest text,
    investor_capacity text,
    revenue_streams text[],
    financial_challenges text,
    barriers_to_mentorship text,
    investment_exploration text,
    team_size text,
    is_autosave boolean DEFAULT false,
    submission_type text DEFAULT 'full'::text NOT NULL,
    completion_status text DEFAULT 'in_progress'::text NOT NULL,
    gender text DEFAULT ''::text,
    age_range text DEFAULT ''::text,
    CONSTRAINT business_insights_snapshots_angel_investor_interest_check CHECK ((angel_investor_interest = ANY (ARRAY['actively-investing'::text, 'considering-future'::text, 'exploring-options'::text, 'interested-learning'::text, 'not-interested'::text, 'already-investing'::text]))),
    CONSTRAINT business_insights_snapshots_completion_status_check CHECK ((completion_status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text, 'archived'::text]))),
    CONSTRAINT business_insights_snapshots_current_funding_source_check CHECK ((current_funding_source = ANY (ARRAY['personal-savings'::text, 'family-friends'::text, 'bank-loan'::text, 'government-grant'::text, 'angel-investor'::text, 'venture-capital'::text, 'crowdfunding'::text, 'revenue-profit'::text, 'no-funding'::text, 'other'::text]))),
    CONSTRAINT business_insights_snapshots_funding_amount_needed_check CHECK ((funding_amount_needed = ANY (ARRAY['0-5k'::text, '5k-10k'::text, '10k-25k'::text, '25k-50k'::text, '50k-100k'::text, '100k-250k'::text, '250k-500k'::text, '500k-1m'::text, '1m+'::text, 'not-sure'::text]))),
    CONSTRAINT business_insights_snapshots_funding_purpose_check CHECK ((funding_purpose = ANY (ARRAY['product-development'::text, 'marketing-sales'::text, 'hiring-staff'::text, 'equipment-assets'::text, 'operations-expansion'::text, 'working-capital'::text, 'debt-consolidation'::text, 'international-expansion'::text, 'technology-upgrade'::text, 'other'::text]))),
    CONSTRAINT business_insights_snapshots_investment_stage_check CHECK ((investment_stage = ANY (ARRAY['pre-seed'::text, 'seed'::text, 'early-stage'::text, 'growth-stage'::text, 'established'::text, 'not-seeking'::text]))),
    CONSTRAINT business_insights_snapshots_investor_capacity_check CHECK ((investor_capacity = ANY (ARRAY['under-5k'::text, '5k-25k'::text, '25k-100k'::text, '100k-500k'::text, '500k+'::text, 'varies'::text, 'prefer-not-to-say'::text]))),
    CONSTRAINT business_insights_snapshots_submission_type_check CHECK ((submission_type = ANY (ARRAY['section'::text, 'full'::text, 'autosave'::text, 'admin'::text]))),
    CONSTRAINT insights_snapshot_year_check CHECK (((snapshot_year >= 1900) AND ((snapshot_year)::numeric <= (EXTRACT(year FROM CURRENT_DATE) + (1)::numeric)))),
    CONSTRAINT insights_year_started_check CHECK (((year_started >= 1900) AND ((year_started)::numeric <= (EXTRACT(year FROM CURRENT_DATE) + (1)::numeric))))
);


--
-- Name: TABLE business_insights_snapshots; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.business_insights_snapshots IS 'Stores founder insights snapshots - now supports general founder journey questions in addition to business-specific ones';


--
-- Name: COLUMN business_insights_snapshots.business_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.business_id IS 'Optional business ID - null for general founder surveys, specific ID for business-associated surveys';


--
-- Name: COLUMN business_insights_snapshots.business_stage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.business_stage IS 'Current growth stage of the business (idea, startup, growth, mature)';


--
-- Name: COLUMN business_insights_snapshots.top_challenges; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.top_challenges IS 'Array of top challenges faced by the founder (from BUSINESS_CHALLENGES constants)';


--
-- Name: COLUMN business_insights_snapshots.hiring_intentions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.hiring_intentions IS 'Whether the founder plans to hire staff in the next 12 months';


--
-- Name: COLUMN business_insights_snapshots.community_impact_areas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.community_impact_areas IS 'Array of community impact areas the founder focuses on';


--
-- Name: COLUMN business_insights_snapshots.collaboration_interest; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.collaboration_interest IS 'Whether the founder is interested in collaborating with other Pacific founders';


--
-- Name: COLUMN business_insights_snapshots.years_entrepreneurial; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.years_entrepreneurial IS 'How many years the founder has been an entrepreneur (e.g., "0-1", "1-3", "3-5", "5-10", "10+")';


--
-- Name: COLUMN business_insights_snapshots.entrepreneurial_background; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.entrepreneurial_background IS 'Founder''s background and journey to entrepreneurship';


--
-- Name: COLUMN business_insights_snapshots.businesses_founded; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.businesses_founded IS 'Number of businesses the founder has founded (e.g., "1", "2-3", "4-5", "6+")';


--
-- Name: COLUMN business_insights_snapshots.primary_industry; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.primary_industry IS 'Primary industry the founder works in';


--
-- Name: COLUMN business_insights_snapshots.family_entrepreneurial_background; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.family_entrepreneurial_background IS 'Whether the founder comes from a family of entrepreneurs';


--
-- Name: COLUMN business_insights_snapshots.mentorship_access; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.mentorship_access IS 'Whether the founder has access to mentors or advisors';


--
-- Name: COLUMN business_insights_snapshots.mentorship_offering; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.mentorship_offering IS 'Whether the founder is willing to mentor other entrepreneurs';


--
-- Name: COLUMN business_insights_snapshots.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.user_id IS 'UUID of the user who submitted the founder insights (for general surveys)';


--
-- Name: COLUMN business_insights_snapshots.current_funding_source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.current_funding_source IS 'Current primary funding source for the business';


--
-- Name: COLUMN business_insights_snapshots.funding_amount_needed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.funding_amount_needed IS 'Amount of funding needed if seeking investment';


--
-- Name: COLUMN business_insights_snapshots.funding_purpose; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.funding_purpose IS 'Primary purpose for any funding needed';


--
-- Name: COLUMN business_insights_snapshots.investment_stage; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.investment_stage IS 'Current investment readiness stage of the business';


--
-- Name: COLUMN business_insights_snapshots.angel_investor_interest; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.angel_investor_interest IS 'Interest level in angel investing in other Pacific businesses';


--
-- Name: COLUMN business_insights_snapshots.investor_capacity; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.investor_capacity IS 'Investment capacity per deal for angel investing';


--
-- Name: COLUMN business_insights_snapshots.revenue_streams; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.revenue_streams IS 'Array of revenue streams the business utilizes';


--
-- Name: COLUMN business_insights_snapshots.financial_challenges; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.business_insights_snapshots.financial_challenges IS 'Text description of main financial challenges';


--
-- Name: business_insights_snapshots_backup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_insights_snapshots_backup (
    id uuid,
    business_id uuid,
    snapshot_year integer,
    submitted_date timestamp with time zone,
    year_started integer,
    problem_solved text,
    team_size_band public.team_size_band_enum,
    business_model text,
    family_involvement boolean,
    customer_region text,
    sales_channels jsonb,
    import_export_status public.import_export_status_enum,
    import_countries jsonb,
    export_countries jsonb,
    business_stage public.business_stage_enum,
    top_challenges jsonb,
    hiring_intentions boolean,
    community_impact_areas jsonb,
    collaboration_interest boolean,
    created_date timestamp with time zone,
    updated_date timestamp with time zone,
    created_by uuid,
    years_entrepreneurial text,
    entrepreneurial_background text,
    businesses_founded text,
    primary_industry text,
    family_entrepreneurial_background boolean,
    mentorship_access boolean,
    mentorship_offering boolean,
    user_id uuid,
    founder_role text,
    founder_story text,
    business_operating_status text,
    business_age text,
    business_registered boolean,
    employs_anyone boolean,
    employs_family_community boolean,
    revenue_band text,
    pacific_identity text[],
    based_in_country text,
    based_in_city text,
    serves_pacific_communities text,
    culture_influences_business boolean,
    culture_influence_details text,
    family_community_responsibilities_affect_business boolean,
    responsibilities_impact_details text,
    support_needed_next text[],
    current_support_sources text[],
    goals_details text,
    expansion_plans boolean,
    open_to_future_contact boolean,
    founder_motivation_array text[],
    goals_next_12_months_array text[],
    current_funding_source text,
    funding_amount_needed text,
    funding_purpose text,
    investment_stage text,
    angel_investor_interest text,
    investor_capacity text,
    revenue_streams text[],
    financial_challenges text,
    barriers_to_mentorship text,
    investment_exploration text,
    team_size text,
    is_autosave boolean,
    submission_type text,
    completion_status text
);


--
-- Name: business_invoice_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_invoice_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    account_name text,
    account_number text,
    payment_reference_label text,
    payment_terms text,
    footer_note text,
    default_tax_rate numeric DEFAULT 0,
    default_withholding_tax_rate numeric DEFAULT 0,
    invoice_primary_color text DEFAULT '#0a1628'::text,
    invoice_accent_color text DEFAULT '#c9a84c'::text,
    invoice_text_color text DEFAULT '#0f172a'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: business_signature_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_signature_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    default_full_name text,
    default_job_title text,
    default_department text,
    default_pronouns text,
    default_email text,
    default_phone text,
    default_website text,
    default_address text,
    linkedin_url text,
    facebook_url text,
    instagram_url text,
    tiktok_url text,
    template text DEFAULT 'modern'::text,
    brand_primary text DEFAULT '#0a1628'::text,
    brand_secondary text DEFAULT '#0d4f4f'::text,
    brand_accent text DEFAULT '#00c4cc'::text,
    text_color text DEFAULT '#0f172a'::text,
    include_logo boolean DEFAULT true,
    include_badge boolean DEFAULT true,
    include_socials boolean DEFAULT true,
    include_address boolean DEFAULT true,
    include_pronouns boolean DEFAULT false,
    disclaimer text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: claim_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.claim_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    contact_email character varying(255),
    contact_phone character varying(50),
    verification_documents text[],
    rejection_reason text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_email text,
    business_name text,
    created_date date DEFAULT CURRENT_DATE,
    notes text,
    message text,
    admin_notes text,
    role character varying(20) DEFAULT 'owner'::character varying,
    listing_contact_email text,
    listing_contact_phone text,
    proof_url text,
    CONSTRAINT claim_requests_role_check CHECK (((role)::text = ANY ((ARRAY['owner'::character varying, 'manager'::character varying, 'staff'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT claim_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: COLUMN claim_requests.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.claim_requests.role IS 'Claimant role: owner, manager, staff, or other';


--
-- Name: COLUMN claim_requests.listing_contact_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.claim_requests.listing_contact_email IS 'Email currently on business listing at time of claim (for notification)';


--
-- Name: COLUMN claim_requests.listing_contact_phone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.claim_requests.listing_contact_phone IS 'Phone currently on business listing at time of claim';


--
-- Name: COLUMN claim_requests.proof_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.claim_requests.proof_url IS 'Optional proof link (website, social media, Google Business) to help verify ownership';


--
-- Name: contact_access_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_access_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid,
    business_name character varying(255) NOT NULL,
    requester_email character varying(255) NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE contact_access_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.contact_access_logs IS 'Logs of who requests to view business contact details';


--
-- Name: COLUMN contact_access_logs.business_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contact_access_logs.business_id IS 'ID of the business whose contact details were requested';


--
-- Name: COLUMN contact_access_logs.business_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contact_access_logs.business_name IS 'Name of the business (denormalized for easy access)';


--
-- Name: COLUMN contact_access_logs.requester_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contact_access_logs.requester_email IS 'Email of the person requesting contact details';


--
-- Name: COLUMN contact_access_logs.ip_address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contact_access_logs.ip_address IS 'IP address of the requester (optional)';


--
-- Name: COLUMN contact_access_logs.user_agent; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contact_access_logs.user_agent IS 'Browser user agent (optional)';


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    region text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_campaign_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaign_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    status character varying(20) DEFAULT 'queued'::character varying,
    priority character varying(20) DEFAULT 'normal'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    scheduled_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    sent_count integer DEFAULT 0,
    failed_count integer DEFAULT 0,
    error_message text,
    retry_count integer DEFAULT 0,
    max_retries integer DEFAULT 3,
    CONSTRAINT chk_email_campaign_queue_status CHECK (((status)::text = ANY ((ARRAY['queued'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: TABLE email_campaign_queue; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_campaign_queue IS 'Queue for processing email campaigns in background jobs';


--
-- Name: COLUMN email_campaign_queue.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_campaign_queue.status IS 'Processing status: queued, processing, completed, failed';


--
-- Name: COLUMN email_campaign_queue.priority; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_campaign_queue.priority IS 'Processing priority: high, normal, low';


--
-- Name: COLUMN email_campaign_queue.retry_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_campaign_queue.retry_count IS 'Number of retry attempts made';


--
-- Name: COLUMN email_campaign_queue.max_retries; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_campaign_queue.max_retries IS 'Maximum number of retry attempts allowed';


--
-- Name: email_campaign_recipients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaign_recipients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    subscriber_id uuid NOT NULL,
    email character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    sent_at timestamp with time zone,
    opened_at timestamp with time zone,
    clicked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    provider_message_id text,
    error_message text
);


--
-- Name: TABLE email_campaign_recipients; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_campaign_recipients IS 'Contains unique constraint (campaign_id, email) to prevent duplicate recipient entries';


--
-- Name: COLUMN email_campaign_recipients.provider_message_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_campaign_recipients.provider_message_id IS 'Provider message ID (e.g., Resend) for webhook integration and event tracking';


--
-- Name: COLUMN email_campaign_recipients.error_message; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_campaign_recipients.error_message IS 'Detailed error message when email sending fails (for debugging and retry logic)';


--
-- Name: email_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    html_content text NOT NULL,
    audience character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying,
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


--
-- Name: TABLE email_campaigns; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_campaigns IS 'Email campaigns created by admin';


--
-- Name: email_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid,
    recipient_id uuid,
    event_type character varying(20) NOT NULL,
    event_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE email_events; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_events IS 'Track email engagement events';


--
-- Name: email_subscriber_entities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_subscriber_entities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subscriber_id uuid NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id uuid NOT NULL,
    entity_name character varying(255),
    relationship_type character varying(50) DEFAULT 'owner'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE email_subscriber_entities; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_subscriber_entities IS 'Links subscribers to multiple entities (businesses, creator listings, charities, etc.)';


--
-- Name: email_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255),
    source character varying(50) DEFAULT 'manual_import'::character varying,
    status character varying(20) DEFAULT 'subscribed'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE email_subscribers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_subscribers IS 'Master email list - email-centric design';


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    html_content text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    CONSTRAINT check_variables_is_array CHECK ((jsonb_typeof(variables) = 'array'::text))
);


--
-- Name: TABLE email_templates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_templates IS 'Pre-built email templates with variables (array format)';


--
-- Name: COLUMN email_templates.variables; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_templates.variables IS 'Array of variable names used in template (e.g., ["first_name", "email"])';


--
-- Name: email_unsubscribe_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_unsubscribe_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token character varying(64) NOT NULL,
    email character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    used_at timestamp with time zone
);


--
-- Name: TABLE email_unsubscribe_tokens; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_unsubscribe_tokens IS 'Secure tokens for email unsubscribe links';


--
-- Name: COLUMN email_unsubscribe_tokens.token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_unsubscribe_tokens.token IS 'Secure random token for unsubscribe verification';


--
-- Name: COLUMN email_unsubscribe_tokens.expires_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_unsubscribe_tokens.expires_at IS 'Token expiration time (30 days default)';


--
-- Name: COLUMN email_unsubscribe_tokens.used_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.email_unsubscribe_tokens.used_at IS 'Timestamp when token was used for unsubscribe (null if unused)';


--
-- Name: feature_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_templates (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    format text NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    layout_config jsonb DEFAULT '{}'::jsonb,
    style_config jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    is_default boolean DEFAULT false,
    usage_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT feature_templates_format_check CHECK ((format = ANY (ARRAY['square'::text, 'vertical'::text, 'story'::text])))
);


--
-- Name: TABLE feature_templates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.feature_templates IS 'Visual templates for generating feature cards';


--
-- Name: feature_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feature_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feature_templates_id_seq OWNED BY public.feature_templates.id;


--
-- Name: latest_business_insights; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.latest_business_insights AS
 SELECT DISTINCT ON (user_id, business_id) id,
    user_id,
    business_id,
    snapshot_year,
    submitted_date,
    year_started,
    years_entrepreneurial,
    businesses_founded,
    founder_role,
    founder_story,
    founder_motivation_array,
    problem_solved,
    team_size_band,
    business_model,
    family_involvement,
    customer_region,
    sales_channels,
    import_export_status,
    import_countries,
    export_countries,
    business_stage,
    top_challenges,
    support_needed_next,
    goals_next_12_months_array,
    hiring_intentions,
    community_impact_areas,
    collaboration_interest,
    created_date,
    updated_date,
    created_by,
    family_community_responsibilities_affect_business,
    expansion_plans,
    mentorship_offering,
    open_to_future_contact,
    gender,
    age_range
   FROM public.business_insights_snapshots
  ORDER BY user_id, business_id, submitted_date DESC;


--
-- Name: pacific_places; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pacific_places (
    id bigint NOT NULL,
    region text NOT NULL,
    country text NOT NULL,
    CONSTRAINT pacific_places_region_check CHECK ((region = ANY (ARRAY['Polynesia'::text, 'Micronesia'::text, 'Melanesia'::text, 'Rim'::text])))
);


--
-- Name: pacific_places_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.pacific_places ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pacific_places_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    description text,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid
);


--
-- Name: product_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    price_display text,
    image_url text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    display_name text,
    email text,
    country text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    primary_cultural text,
    education_level text,
    professional_background text[],
    business_networks text[],
    mentorship_availability boolean DEFAULT false,
    investment_interest text,
    community_involvement text[],
    skills_expertise text[],
    business_goals text,
    challenges_faced text[],
    success_factors text[],
    preferred_collaboration text[],
    role public.app_role DEFAULT 'owner'::public.app_role,
    years_operating integer,
    business_role text,
    city text,
    languages text[] DEFAULT '{}'::text[],
    market_region text,
    pending_business_id uuid,
    pending_business_name text,
    invited_by uuid,
    invited_date timestamp with time zone,
    status text DEFAULT 'active'::text,
    gdpr_consent boolean DEFAULT false,
    gdpr_consent_date timestamp with time zone,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['admin'::public.app_role, 'owner'::public.app_role])))
);


--
-- Name: TABLE profiles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.profiles IS 'User profiles - owner for business users, admin for administrators';


--
-- Name: COLUMN profiles.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp of last profile update, automatically managed by trigger';


--
-- Name: COLUMN profiles.primary_cultural; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.primary_cultural IS 'Primary cultural identity/heritage (country code, e.g., WS for Samoa, TO for Tonga)';


--
-- Name: COLUMN profiles.education_level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.education_level IS 'Highest education achieved (private data for analytics)';


--
-- Name: COLUMN profiles.professional_background; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.professional_background IS 'Previous industries/roles array (private data for analytics)';


--
-- Name: COLUMN profiles.business_networks; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.business_networks IS 'Professional networks array (private data for analytics)';


--
-- Name: COLUMN profiles.mentorship_availability; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.mentorship_availability IS 'Available to mentor others (private data for analytics)';


--
-- Name: COLUMN profiles.investment_interest; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.investment_interest IS 'Interest in investing (private data for analytics)';


--
-- Name: COLUMN profiles.community_involvement; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.community_involvement IS 'Community organizations array (private data for analytics)';


--
-- Name: COLUMN profiles.skills_expertise; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.skills_expertise IS 'Professional skills array (private data for analytics)';


--
-- Name: COLUMN profiles.business_goals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.business_goals IS '1-5 year business objectives (private data for analytics)';


--
-- Name: COLUMN profiles.challenges_faced; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.challenges_faced IS 'Business challenges array (private data for analytics)';


--
-- Name: COLUMN profiles.success_factors; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.success_factors IS 'Key success factors array (private data for analytics)';


--
-- Name: COLUMN profiles.preferred_collaboration; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.preferred_collaboration IS 'Collaboration preferences array (private data for analytics)';


--
-- Name: COLUMN profiles.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.role IS 'User role - owner for business users, admin for administrators';


--
-- Name: COLUMN profiles.pending_business_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.pending_business_id IS 'ID of business the user is invited to manage (null if no pending invitation)';


--
-- Name: COLUMN profiles.pending_business_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.pending_business_name IS 'Name of business the user is invited to manage (for display purposes)';


--
-- Name: COLUMN profiles.invited_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.invited_by IS 'ID of user who sent the business invitation';


--
-- Name: COLUMN profiles.invited_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.invited_date IS 'When the business invitation was sent';


--
-- Name: COLUMN profiles.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.status IS 'Profile status: active, pending_invitation, etc.';


--
-- Name: COLUMN profiles.gdpr_consent; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.gdpr_consent IS 'User consent for GDPR data processing (required for account creation)';


--
-- Name: COLUMN profiles.gdpr_consent_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.gdpr_consent_date IS 'Timestamp when GDPR consent was given';


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_business_id uuid NOT NULL,
    referred_business_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'pending'::text NOT NULL,
    CONSTRAINT referrals_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text])))
);


--
-- Name: shop_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shop_analytics (
    id bigint NOT NULL,
    seller_id bigint,
    date date DEFAULT CURRENT_DATE NOT NULL,
    page_views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    contact_clicks integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    event_type character varying(50),
    event_data jsonb DEFAULT '{}'::jsonb,
    visitor_id character varying(100),
    session_id character varying(100),
    admin_listing_id integer,
    user_agent text,
    device_type character varying(20),
    referrer text,
    ip_address text,
    CONSTRAINT shop_analytics_listing_check CHECK ((((seller_id IS NOT NULL) AND (admin_listing_id IS NULL)) OR ((seller_id IS NULL) AND (admin_listing_id IS NOT NULL))))
);


--
-- Name: TABLE shop_analytics; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.shop_analytics IS 'Tracks shop views, clicks, and engagement metrics';


--
-- Name: COLUMN shop_analytics.event_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shop_analytics.event_type IS 'Type of event: page_view, product_click, service_click, contact_submit, section_view';


--
-- Name: COLUMN shop_analytics.event_data; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shop_analytics.event_data IS 'Flexible JSONB for event-specific data';


--
-- Name: COLUMN shop_analytics.visitor_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shop_analytics.visitor_id IS 'Anonymous visitor identifier for tracking unique visitors';


--
-- Name: COLUMN shop_analytics.admin_listing_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shop_analytics.admin_listing_id IS 'Reference to admin-created directory listing (mutually exclusive with seller_id)';


--
-- Name: shop_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shop_analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shop_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shop_analytics_id_seq OWNED BY public.shop_analytics.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    business_id uuid,
    stripe_subscription_id text,
    stripe_customer_id text,
    plan_type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT subscriptions_plan_type_check CHECK (((plan_type)::text = ANY ((ARRAY['basic'::character varying, 'verified'::character varying, 'featured'::character varying, 'featured_plus'::character varying])::text[]))),
    CONSTRAINT subscriptions_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'canceled'::character varying, 'past_due'::character varying, 'unpaid'::character varying, 'trialing'::character varying])::text[])))
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: feature_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_templates ALTER COLUMN id SET DEFAULT nextval('public.feature_templates_id_seq'::regclass);


--
-- Name: shop_analytics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_analytics ALTER COLUMN id SET DEFAULT nextval('public.shop_analytics_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admin_notification_settings admin_notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notification_settings
    ADD CONSTRAINT admin_notification_settings_pkey PRIMARY KEY (id);


--
-- Name: admin_notification_settings admin_notification_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notification_settings
    ADD CONSTRAINT admin_notification_settings_user_id_key UNIQUE (user_id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: business_images business_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_images
    ADD CONSTRAINT business_images_pkey PRIMARY KEY (id);


--
-- Name: business_insights_snapshots business_insights_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_insights_snapshots
    ADD CONSTRAINT business_insights_snapshots_pkey PRIMARY KEY (id);


--
-- Name: business_invoice_settings business_invoice_settings_business_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_invoice_settings
    ADD CONSTRAINT business_invoice_settings_business_id_key UNIQUE (business_id);


--
-- Name: business_invoice_settings business_invoice_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_invoice_settings
    ADD CONSTRAINT business_invoice_settings_pkey PRIMARY KEY (id);


--
-- Name: business_signature_settings business_signature_settings_business_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_signature_settings
    ADD CONSTRAINT business_signature_settings_business_id_key UNIQUE (business_id);


--
-- Name: business_signature_settings business_signature_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_signature_settings
    ADD CONSTRAINT business_signature_settings_pkey PRIMARY KEY (id);


--
-- Name: businesses businesses_business_handle_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_business_handle_unique UNIQUE (business_handle);


--
-- Name: businesses businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);


--
-- Name: claim_requests claim_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_requests
    ADD CONSTRAINT claim_requests_pkey PRIMARY KEY (id);


--
-- Name: contact_access_logs contact_access_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_access_logs
    ADD CONSTRAINT contact_access_logs_pkey PRIMARY KEY (id);


--
-- Name: countries countries_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code_key UNIQUE (code);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: email_campaign_queue email_campaign_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_queue
    ADD CONSTRAINT email_campaign_queue_pkey PRIMARY KEY (id);


--
-- Name: email_campaign_recipients email_campaign_recipients_campaign_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_recipients
    ADD CONSTRAINT email_campaign_recipients_campaign_email_key UNIQUE (campaign_id, email);


--
-- Name: email_campaign_recipients email_campaign_recipients_campaign_id_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_recipients
    ADD CONSTRAINT email_campaign_recipients_campaign_id_email_key UNIQUE (campaign_id, email);


--
-- Name: CONSTRAINT email_campaign_recipients_campaign_id_email_key ON email_campaign_recipients; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT email_campaign_recipients_campaign_id_email_key ON public.email_campaign_recipients IS 'Prevents duplicate emails per campaign';


--
-- Name: email_campaign_recipients email_campaign_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_recipients
    ADD CONSTRAINT email_campaign_recipients_pkey PRIMARY KEY (id);


--
-- Name: email_campaign_recipients email_campaign_recipients_unique_campaign_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_recipients
    ADD CONSTRAINT email_campaign_recipients_unique_campaign_email UNIQUE (campaign_id, email);


--
-- Name: email_campaigns email_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_pkey PRIMARY KEY (id);


--
-- Name: email_events email_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_pkey PRIMARY KEY (id);


--
-- Name: email_subscriber_entities email_subscriber_entities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscriber_entities
    ADD CONSTRAINT email_subscriber_entities_pkey PRIMARY KEY (id);


--
-- Name: email_subscriber_entities email_subscriber_entities_subscriber_id_entity_type_entity__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscriber_entities
    ADD CONSTRAINT email_subscriber_entities_subscriber_id_entity_type_entity__key UNIQUE (subscriber_id, entity_type, entity_id);


--
-- Name: email_subscribers email_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscribers
    ADD CONSTRAINT email_subscribers_email_key UNIQUE (email);


--
-- Name: email_subscribers email_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscribers
    ADD CONSTRAINT email_subscribers_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_name_key UNIQUE (name);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: email_unsubscribe_tokens email_unsubscribe_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_unsubscribe_tokens
    ADD CONSTRAINT email_unsubscribe_tokens_pkey PRIMARY KEY (id);


--
-- Name: email_unsubscribe_tokens email_unsubscribe_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_unsubscribe_tokens
    ADD CONSTRAINT email_unsubscribe_tokens_token_key UNIQUE (token);


--
-- Name: feature_templates feature_templates_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_templates
    ADD CONSTRAINT feature_templates_name_key UNIQUE (name);


--
-- Name: feature_templates feature_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_templates
    ADD CONSTRAINT feature_templates_pkey PRIMARY KEY (id);


--
-- Name: business_insights_snapshots insights_unique_business_year; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_insights_snapshots
    ADD CONSTRAINT insights_unique_business_year UNIQUE (business_id, snapshot_year);


--
-- Name: pacific_places pacific_places_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pacific_places
    ADD CONSTRAINT pacific_places_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_key_key UNIQUE (key);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: product_services product_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_services
    ADD CONSTRAINT product_services_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_referrer_business_id_referred_business_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referrer_business_id_referred_business_id_key UNIQUE (referrer_business_id, referred_business_id);


--
-- Name: shop_analytics shop_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_analytics
    ADD CONSTRAINT shop_analytics_pkey PRIMARY KEY (id);


--
-- Name: shop_analytics shop_analytics_seller_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_analytics
    ADD CONSTRAINT shop_analytics_seller_id_date_key UNIQUE (seller_id, date);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_stripe_subscription_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_stripe_subscription_id_key UNIQUE (stripe_subscription_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: businesses_contact_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX businesses_contact_email_idx ON public.businesses USING btree (contact_email);


--
-- Name: businesses_shop_handle_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX businesses_shop_handle_unique ON public.businesses USING btree (lower(business_handle)) WHERE ((business_handle IS NOT NULL) AND (business_handle <> ''::text));


--
-- Name: businesses_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX businesses_user_id_idx ON public.businesses USING btree (user_id);


--
-- Name: claim_requests_one_pending_per_business; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX claim_requests_one_pending_per_business ON public.claim_requests USING btree (business_id) WHERE ((status)::text = 'pending'::text);


--
-- Name: claim_requests_one_pending_per_user_business; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX claim_requests_one_pending_per_user_business ON public.claim_requests USING btree (business_id, user_id) WHERE ((status)::text = 'pending'::text);


--
-- Name: idx_admin_notification_settings_settings; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notification_settings_settings ON public.admin_notification_settings USING gin (settings);


--
-- Name: idx_admin_notification_settings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notification_settings_user_id ON public.admin_notification_settings USING btree (user_id);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_record_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_record_id ON public.audit_logs USING btree (record_id);


--
-- Name: idx_audit_logs_table_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_table_name ON public.audit_logs USING btree (table_name);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_business_insights_snapshots_based_in_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_based_in_country ON public.business_insights_snapshots USING btree (based_in_country);


--
-- Name: idx_business_insights_snapshots_business_age; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_business_age ON public.business_insights_snapshots USING btree (business_age);


--
-- Name: idx_business_insights_snapshots_business_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_business_id ON public.business_insights_snapshots USING btree (business_id);


--
-- Name: idx_business_insights_snapshots_business_operating_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_business_operating_status ON public.business_insights_snapshots USING btree (business_operating_status);


--
-- Name: idx_business_insights_snapshots_business_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_business_stage ON public.business_insights_snapshots USING btree (business_stage);


--
-- Name: idx_business_insights_snapshots_business_submitted_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_business_submitted_date ON public.business_insights_snapshots USING btree (business_id, submitted_date DESC);


--
-- Name: idx_business_insights_snapshots_community_impact_areas; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_community_impact_areas ON public.business_insights_snapshots USING gin (community_impact_areas);


--
-- Name: idx_business_insights_snapshots_completion_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_completion_status ON public.business_insights_snapshots USING btree (completion_status);


--
-- Name: idx_business_insights_snapshots_import_export_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_import_export_status ON public.business_insights_snapshots USING btree (import_export_status);


--
-- Name: idx_business_insights_snapshots_pacific_identity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_pacific_identity ON public.business_insights_snapshots USING gin (pacific_identity);


--
-- Name: idx_business_insights_snapshots_sales_channels; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_sales_channels ON public.business_insights_snapshots USING gin (sales_channels);


--
-- Name: idx_business_insights_snapshots_serves_pacific_communities; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_serves_pacific_communities ON public.business_insights_snapshots USING btree (serves_pacific_communities);


--
-- Name: idx_business_insights_snapshots_snapshot_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_snapshot_year ON public.business_insights_snapshots USING btree (snapshot_year);


--
-- Name: idx_business_insights_snapshots_submission_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_submission_type ON public.business_insights_snapshots USING btree (submission_type);


--
-- Name: idx_business_insights_snapshots_support_needed_next; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_support_needed_next ON public.business_insights_snapshots USING gin (support_needed_next);


--
-- Name: idx_business_insights_snapshots_team_size_band; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_team_size_band ON public.business_insights_snapshots USING btree (team_size_band);


--
-- Name: idx_business_insights_snapshots_user_completion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_user_completion ON public.business_insights_snapshots USING btree (user_id, completion_status);


--
-- Name: idx_business_insights_snapshots_user_submitted_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_insights_snapshots_user_submitted_date ON public.business_insights_snapshots USING btree (user_id, submitted_date DESC);


--
-- Name: idx_business_signature_settings_business_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_business_signature_settings_business_id ON public.business_signature_settings USING btree (business_id);


--
-- Name: idx_businesses_annual_revenue_exact; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_annual_revenue_exact ON public.businesses USING btree (annual_revenue_exact);


--
-- Name: idx_businesses_business_handle; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_business_handle ON public.businesses USING btree (business_handle);


--
-- Name: idx_businesses_business_structure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_business_structure ON public.businesses USING btree (business_structure);


--
-- Name: idx_businesses_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_city ON public.businesses USING btree (city);


--
-- Name: idx_businesses_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_country ON public.businesses USING btree (country);


--
-- Name: idx_businesses_created_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_created_date ON public.businesses USING btree (created_date);


--
-- Name: idx_businesses_cultural_identity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_cultural_identity ON public.businesses USING btree (cultural_identity);


--
-- Name: idx_businesses_funding_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_funding_source ON public.businesses USING btree (funding_source);


--
-- Name: idx_businesses_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_industry ON public.businesses USING btree (industry);


--
-- Name: idx_businesses_languages_spoken; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_languages_spoken ON public.businesses USING gin (languages_spoken);


--
-- Name: idx_businesses_owner_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_owner_user_id ON public.businesses USING btree (owner_user_id);


--
-- Name: idx_businesses_postal_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_postal_code ON public.businesses USING btree (postal_code);


--
-- Name: idx_businesses_referral_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_referral_code ON public.businesses USING btree (referral_code);


--
-- Name: idx_businesses_social_links; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_social_links ON public.businesses USING gin (social_links);


--
-- Name: idx_businesses_state_region; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_state_region ON public.businesses USING btree (state_region);


--
-- Name: idx_businesses_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_status ON public.businesses USING btree (status);


--
-- Name: idx_businesses_subscription_tier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_subscription_tier ON public.businesses USING btree (subscription_tier);


--
-- Name: idx_businesses_suburb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_suburb ON public.businesses USING btree (suburb);


--
-- Name: idx_businesses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_businesses_user_id ON public.businesses USING btree (user_id);


--
-- Name: idx_claim_requests_business_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claim_requests_business_id ON public.claim_requests USING btree (business_id);


--
-- Name: idx_claim_requests_listing_contact_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claim_requests_listing_contact_email ON public.claim_requests USING btree (listing_contact_email);


--
-- Name: idx_claim_requests_proof_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claim_requests_proof_url ON public.claim_requests USING btree (proof_url);


--
-- Name: idx_claim_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claim_requests_status ON public.claim_requests USING btree (status);


--
-- Name: idx_claim_requests_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_claim_requests_user_id ON public.claim_requests USING btree (user_id);


--
-- Name: idx_contact_access_logs_business_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_access_logs_business_id ON public.contact_access_logs USING btree (business_id);


--
-- Name: idx_contact_access_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_access_logs_created_at ON public.contact_access_logs USING btree (created_at);


--
-- Name: idx_contact_access_logs_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_access_logs_email ON public.contact_access_logs USING btree (requester_email);


--
-- Name: idx_email_campaign_queue_active_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_email_campaign_queue_active_campaign ON public.email_campaign_queue USING btree (campaign_id) WHERE ((status)::text = ANY ((ARRAY['queued'::character varying, 'processing'::character varying])::text[]));


--
-- Name: INDEX idx_email_campaign_queue_active_campaign; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON INDEX public.idx_email_campaign_queue_active_campaign IS 'Prevents duplicate active queue entries per campaign (race condition protection)';


--
-- Name: idx_email_campaign_queue_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_queue_campaign_id ON public.email_campaign_queue USING btree (campaign_id);


--
-- Name: idx_email_campaign_queue_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_queue_created_at ON public.email_campaign_queue USING btree (created_at);


--
-- Name: idx_email_campaign_queue_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_queue_priority ON public.email_campaign_queue USING btree (priority);


--
-- Name: idx_email_campaign_queue_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_queue_status ON public.email_campaign_queue USING btree (status);


--
-- Name: idx_email_campaign_queue_status_priority_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_queue_status_priority_created ON public.email_campaign_queue USING btree (status, priority DESC, created_at);


--
-- Name: INDEX idx_email_campaign_queue_status_priority_created; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON INDEX public.idx_email_campaign_queue_status_priority_created IS 'Optimizes queue processing queries by status, priority, and creation time';


--
-- Name: idx_email_campaign_recipients_campaign_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_recipients_campaign_email ON public.email_campaign_recipients USING btree (campaign_id, email);


--
-- Name: INDEX idx_email_campaign_recipients_campaign_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON INDEX public.idx_email_campaign_recipients_campaign_email IS 'Prevents duplicate recipient entries for the same campaign (case-insensitive email matching)';


--
-- Name: idx_email_campaign_recipients_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_recipients_campaign_id ON public.email_campaign_recipients USING btree (campaign_id);


--
-- Name: idx_email_campaign_recipients_provider_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_recipients_provider_message_id ON public.email_campaign_recipients USING btree (provider_message_id) WHERE (provider_message_id IS NOT NULL);


--
-- Name: idx_email_campaign_recipients_status_error; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_recipients_status_error ON public.email_campaign_recipients USING btree (status) WHERE ((status)::text = 'failed'::text);


--
-- Name: idx_email_campaign_recipients_subscriber_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaign_recipients_subscriber_id ON public.email_campaign_recipients USING btree (subscriber_id);


--
-- Name: idx_email_campaigns_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_campaigns_status ON public.email_campaigns USING btree (status);


--
-- Name: idx_email_events_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_campaign_id ON public.email_events USING btree (campaign_id);


--
-- Name: idx_email_events_recipient_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_recipient_id ON public.email_events USING btree (recipient_id);


--
-- Name: idx_email_subscriber_entities_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscriber_entities_entity ON public.email_subscriber_entities USING btree (entity_type, entity_id);


--
-- Name: idx_email_subscriber_entities_subscriber_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscriber_entities_subscriber_id ON public.email_subscriber_entities USING btree (subscriber_id);


--
-- Name: idx_email_subscribers_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscribers_email ON public.email_subscribers USING btree (email);


--
-- Name: idx_email_subscribers_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_subscribers_status ON public.email_subscribers USING btree (status);


--
-- Name: idx_email_unsubscribe_tokens_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_unsubscribe_tokens_email ON public.email_unsubscribe_tokens USING btree (email);


--
-- Name: idx_email_unsubscribe_tokens_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_unsubscribe_tokens_expires_at ON public.email_unsubscribe_tokens USING btree (expires_at);


--
-- Name: idx_email_unsubscribe_tokens_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_unsubscribe_tokens_token ON public.email_unsubscribe_tokens USING btree (token);


--
-- Name: idx_email_unsubscribe_tokens_used_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_unsubscribe_tokens_used_at ON public.email_unsubscribe_tokens USING btree (used_at) WHERE (used_at IS NOT NULL);


--
-- Name: idx_insights_business_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_business_stage ON public.business_insights_snapshots USING btree (business_stage);


--
-- Name: idx_insights_collaboration; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_collaboration ON public.business_insights_snapshots USING btree (collaboration_interest);


--
-- Name: idx_insights_community_impact; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_community_impact ON public.business_insights_snapshots USING gin (community_impact_areas);


--
-- Name: idx_insights_completed_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_completed_year ON public.business_insights_snapshots USING btree (snapshot_year) WHERE (completion_status = 'completed'::text);


--
-- Name: idx_insights_funding_amount; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_funding_amount ON public.business_insights_snapshots USING btree (funding_amount_needed);


--
-- Name: idx_insights_funding_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_funding_source ON public.business_insights_snapshots USING btree (current_funding_source);


--
-- Name: idx_insights_hiring_intentions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_hiring_intentions ON public.business_insights_snapshots USING btree (hiring_intentions);


--
-- Name: idx_insights_investment_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_investment_stage ON public.business_insights_snapshots USING btree (investment_stage);


--
-- Name: idx_insights_snapshot_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_snapshot_year ON public.business_insights_snapshots USING btree (snapshot_year);


--
-- Name: idx_insights_top_challenges; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_insights_top_challenges ON public.business_insights_snapshots USING gin (top_challenges);


--
-- Name: idx_pacific_places_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pacific_places_country ON public.pacific_places USING btree (lower(country));


--
-- Name: idx_pacific_places_region; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pacific_places_region ON public.pacific_places USING btree (region);


--
-- Name: idx_platform_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_platform_settings_key ON public.platform_settings USING btree (key);


--
-- Name: idx_profiles_education_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_education_level ON public.profiles USING btree (education_level);


--
-- Name: idx_profiles_gdpr_consent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_gdpr_consent ON public.profiles USING btree (gdpr_consent);


--
-- Name: idx_profiles_investment_interest; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_investment_interest ON public.profiles USING btree (investment_interest);


--
-- Name: idx_profiles_mentorship_availability; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_mentorship_availability ON public.profiles USING btree (mentorship_availability);


--
-- Name: idx_profiles_pending_business_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_pending_business_id ON public.profiles USING btree (pending_business_id) WHERE (pending_business_id IS NOT NULL);


--
-- Name: idx_referrals_referred; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_referrals_referred ON public.referrals USING btree (referred_business_id);


--
-- Name: idx_referrals_referrer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_referrals_referrer ON public.referrals USING btree (referrer_business_id);


--
-- Name: idx_referrals_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_referrals_status ON public.referrals USING btree (status);


--
-- Name: idx_shop_analytics_admin_listing_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_admin_listing_date ON public.shop_analytics USING btree (admin_listing_id, created_at DESC) WHERE (admin_listing_id IS NOT NULL);


--
-- Name: idx_shop_analytics_admin_listing_event; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_admin_listing_event ON public.shop_analytics USING btree (admin_listing_id, event_type) WHERE (admin_listing_id IS NOT NULL);


--
-- Name: idx_shop_analytics_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_created_at ON public.shop_analytics USING btree (created_at);


--
-- Name: idx_shop_analytics_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_event_type ON public.shop_analytics USING btree (seller_id, event_type);


--
-- Name: idx_shop_analytics_seller_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_seller_date ON public.shop_analytics USING btree (seller_id, date DESC);


--
-- Name: idx_shop_analytics_seller_event; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_seller_event ON public.shop_analytics USING btree (seller_id, event_type);


--
-- Name: idx_shop_analytics_seller_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_seller_id ON public.shop_analytics USING btree (seller_id);


--
-- Name: idx_shop_analytics_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_session ON public.shop_analytics USING btree (session_id);


--
-- Name: idx_shop_analytics_visitor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shop_analytics_visitor ON public.shop_analytics USING btree (visitor_id, created_at DESC);


--
-- Name: idx_subscriptions_business_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_business_id ON public.subscriptions USING btree (business_id);


--
-- Name: idx_subscriptions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);


--
-- Name: idx_subscriptions_stripe_subscription_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions USING btree (stripe_subscription_id);


--
-- Name: idx_subscriptions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: admin_notification_settings update_admin_notification_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_admin_notification_settings_updated_at BEFORE UPDATE ON public.admin_notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: business_signature_settings update_business_signature_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_business_signature_settings_updated_at BEFORE UPDATE ON public.business_signature_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: business_insights_snapshots validate_financial_insights_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_financial_insights_trigger BEFORE INSERT OR UPDATE ON public.business_insights_snapshots FOR EACH ROW EXECUTE FUNCTION public.validate_financial_insights();


--
-- Name: business_insights_snapshots validate_founder_insights_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_founder_insights_trigger BEFORE INSERT OR UPDATE ON public.business_insights_snapshots FOR EACH ROW EXECUTE FUNCTION public.validate_founder_insights();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: admin_notification_settings admin_notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notification_settings
    ADD CONSTRAINT admin_notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: business_insights_snapshots business_insights_snapshots_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_insights_snapshots
    ADD CONSTRAINT business_insights_snapshots_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: business_insights_snapshots business_insights_snapshots_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_insights_snapshots
    ADD CONSTRAINT business_insights_snapshots_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: business_invoice_settings business_invoice_settings_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_invoice_settings
    ADD CONSTRAINT business_invoice_settings_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: business_signature_settings business_signature_settings_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_signature_settings
    ADD CONSTRAINT business_signature_settings_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: businesses businesses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: businesses businesses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: claim_requests claim_requests_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_requests
    ADD CONSTRAINT claim_requests_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: claim_requests claim_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_requests
    ADD CONSTRAINT claim_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: claim_requests claim_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_requests
    ADD CONSTRAINT claim_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: contact_access_logs contact_access_logs_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_access_logs
    ADD CONSTRAINT contact_access_logs_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: email_campaign_queue email_campaign_queue_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_queue
    ADD CONSTRAINT email_campaign_queue_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id) ON DELETE CASCADE;


--
-- Name: email_campaign_recipients email_campaign_recipients_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_recipients
    ADD CONSTRAINT email_campaign_recipients_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id) ON DELETE CASCADE;


--
-- Name: email_campaign_recipients email_campaign_recipients_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaign_recipients
    ADD CONSTRAINT email_campaign_recipients_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.email_subscribers(id) ON DELETE CASCADE;


--
-- Name: email_campaigns email_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: email_events email_events_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id) ON DELETE CASCADE;


--
-- Name: email_events email_events_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.email_campaign_recipients(id) ON DELETE CASCADE;


--
-- Name: email_subscriber_entities email_subscriber_entities_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscriber_entities
    ADD CONSTRAINT email_subscriber_entities_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.email_subscribers(id) ON DELETE CASCADE;


--
-- Name: email_templates email_templates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: platform_settings platform_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id);


--
-- Name: profiles profiles_pending_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pending_business_id_fkey FOREIGN KEY (pending_business_id) REFERENCES public.businesses(id);


--
-- Name: referrals referrals_referred_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referred_business_id_fkey FOREIGN KEY (referred_business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: referrals referrals_referrer_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referrer_business_id_fkey FOREIGN KEY (referrer_business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: email_subscribers Admins can insert email_subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert email_subscribers" ON public.email_subscribers FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_subscribers Admins can update email_subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update email_subscribers" ON public.email_subscribers FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_campaign_queue Admins full access to email_campaign_queue; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_campaign_queue" ON public.email_campaign_queue USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_campaign_recipients Admins full access to email_campaign_recipients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_campaign_recipients" ON public.email_campaign_recipients USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_campaigns Admins full access to email_campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_campaigns" ON public.email_campaigns USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_events Admins full access to email_events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_events" ON public.email_events USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_subscriber_entities Admins full access to email_subscriber_entities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_subscriber_entities" ON public.email_subscriber_entities USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_templates Admins full access to email_templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_templates" ON public.email_templates USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: email_unsubscribe_tokens Admins full access to email_unsubscribe_tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access to email_unsubscribe_tokens" ON public.email_unsubscribe_tokens USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.app_role)))));


--
-- Name: business_insights_snapshots Admins have full access to business insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins have full access to business insights" ON public.business_insights_snapshots USING (((auth.jwt() ->> 'role'::text) = 'admin'::text)) WITH CHECK (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: profiles Admins have full access to profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins have full access to profiles" ON public.profiles USING (((auth.jwt() ->> 'role'::text) = 'admin'::text)) WITH CHECK (((auth.jwt() ->> 'role'::text) = 'admin'::text));


--
-- Name: businesses Allow full access for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow full access for authenticated users" ON public.businesses USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: claim_requests Allow full access for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow full access for authenticated users" ON public.claim_requests USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: email_subscriber_entities Anyone can view email_subscriber_entities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view email_subscriber_entities" ON public.email_subscriber_entities FOR SELECT USING (true);


--
-- Name: email_subscribers Anyone can view email_subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view email_subscribers" ON public.email_subscribers FOR SELECT USING (true);


--
-- Name: businesses Authenticated can view approved businesses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can view approved businesses" ON public.businesses FOR SELECT TO authenticated USING (((status)::text = 'active'::text));


--
-- Name: business_insights_snapshots Insights are viewable by business owners and admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Insights are viewable by business owners and admins" ON public.business_insights_snapshots FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = business_insights_snapshots.business_id) AND ((auth.uid() = businesses.user_id) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text))))));


--
-- Name: businesses Public can read approved businesses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read approved businesses" ON public.businesses FOR SELECT TO anon USING (((status)::text = 'approved'::text));


--
-- Name: businesses Public can view approved businesses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view approved businesses" ON public.businesses FOR SELECT TO anon USING (((status)::text = 'active'::text));


--
-- Name: profiles Public can view basic profile info for business ownership; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view basic profile info for business ownership" ON public.profiles FOR SELECT USING (true);


--
-- Name: referrals System can insert referrals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);


--
-- Name: referrals System can update referrals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can update referrals" ON public.referrals FOR UPDATE USING (true);


--
-- Name: business_signature_settings Users can delete own business signature settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own business signature settings" ON public.business_signature_settings FOR DELETE USING ((business_id IN ( SELECT businesses.id
   FROM public.businesses
  WHERE (businesses.owner_user_id = auth.uid()))));


--
-- Name: business_insights_snapshots Users can delete own founder insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own founder insights" ON public.business_insights_snapshots FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: business_insights_snapshots Users can delete their own business insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own business insights" ON public.business_insights_snapshots FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = business_insights_snapshots.business_id) AND (auth.uid() = businesses.owner_user_id)))));


--
-- Name: profiles Users can delete their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING ((auth.uid() = id));


--
-- Name: business_insights_snapshots Users can insert insights for their businesses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert insights for their businesses" ON public.business_insights_snapshots FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = business_insights_snapshots.business_id) AND (auth.uid() = businesses.user_id)))));


--
-- Name: business_signature_settings Users can insert own business signature settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own business signature settings" ON public.business_signature_settings FOR INSERT WITH CHECK ((business_id IN ( SELECT businesses.id
   FROM public.businesses
  WHERE (businesses.owner_user_id = auth.uid()))));


--
-- Name: business_insights_snapshots Users can insert own founder insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own founder insights" ON public.business_insights_snapshots FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: admin_notification_settings Users can insert own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own notification settings" ON public.admin_notification_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: business_signature_settings Users can update own business signature settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own business signature settings" ON public.business_signature_settings FOR UPDATE USING ((business_id IN ( SELECT businesses.id
   FROM public.businesses
  WHERE (businesses.owner_user_id = auth.uid()))));


--
-- Name: business_insights_snapshots Users can update own founder insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own founder insights" ON public.business_insights_snapshots FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: admin_notification_settings Users can update own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own notification settings" ON public.admin_notification_settings FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: business_insights_snapshots Users can update their own business insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own business insights" ON public.business_insights_snapshots FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = business_insights_snapshots.business_id) AND (auth.uid() = businesses.owner_user_id)))));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: business_insights_snapshots Users can view business insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view business insights" ON public.business_insights_snapshots FOR SELECT USING (((auth.uid() = user_id) OR ((business_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.businesses
  WHERE ((businesses.id = business_insights_snapshots.business_id) AND ((businesses.owner_user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text))))))));


--
-- Name: business_signature_settings Users can view own business signature settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own business signature settings" ON public.business_signature_settings FOR SELECT USING ((business_id IN ( SELECT businesses.id
   FROM public.businesses
  WHERE (businesses.owner_user_id = auth.uid()))));


--
-- Name: business_insights_snapshots Users can view own founder insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own founder insights" ON public.business_insights_snapshots FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: admin_notification_settings Users can view own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own notification settings" ON public.admin_notification_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: referrals Users can view their own referrals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (((auth.uid() IS NOT NULL) AND ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = referrals.referrer_business_id) AND (b.owner_user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = referrals.referred_business_id) AND (b.owner_user_id = auth.uid())))))));


--
-- Name: admin_notification_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_notification_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: business_insights_snapshots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.business_insights_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: business_signature_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.business_signature_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: businesses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

--
-- Name: claim_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_access_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_access_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: countries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

--
-- Name: email_campaign_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_campaign_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: email_campaign_recipients; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;

--
-- Name: email_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: email_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

--
-- Name: email_subscriber_entities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_subscriber_entities ENABLE ROW LEVEL SECURITY;

--
-- Name: email_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: email_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: email_unsubscribe_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: feature_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feature_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: pacific_places; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pacific_places ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: referrals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

--
-- Name: shop_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shop_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: business_signature_settings signature_settings_delete_owner_only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY signature_settings_delete_owner_only ON public.business_signature_settings FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_signature_settings.business_id) AND (b.owner_user_id = auth.uid())))));


--
-- Name: business_signature_settings signature_settings_insert_owner_only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY signature_settings_insert_owner_only ON public.business_signature_settings FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_signature_settings.business_id) AND (b.owner_user_id = auth.uid())))));


--
-- Name: business_signature_settings signature_settings_select_owner_only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY signature_settings_select_owner_only ON public.business_signature_settings FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_signature_settings.business_id) AND (b.owner_user_id = auth.uid())))));


--
-- Name: business_signature_settings signature_settings_update_owner_only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY signature_settings_update_owner_only ON public.business_signature_settings FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_signature_settings.business_id) AND (b.owner_user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_signature_settings.business_id) AND (b.owner_user_id = auth.uid())))));


--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Admins can view admin-listings bucket; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admins can view admin-listings bucket" ON storage.objects FOR SELECT USING (((bucket_id = 'admin-listings'::text) AND ((auth.role() = 'authenticated'::text) OR (auth.role() = 'anon'::text))));


--
-- Name: objects Allow authenticated deletes from admin-listings; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Allow authenticated deletes from admin-listings" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'admin-listings'::text));


--
-- Name: objects Allow authenticated updates to admin-listings; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Allow authenticated updates to admin-listings" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'admin-listings'::text)) WITH CHECK ((bucket_id = 'admin-listings'::text));


--
-- Name: objects Allow authenticated uploads to admin-listings; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Allow authenticated uploads to admin-listings" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'admin-listings'::text));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

