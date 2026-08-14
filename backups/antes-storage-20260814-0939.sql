--
-- PostgreSQL database dump
--

\restrict acijia93LzhRmfffF4w35oNqK4P2jr3ZJFmqj06YqweLSXyTvj9nqtZqhwufC8E

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA _realtime;


ALTER SCHEMA _realtime OWNER TO postgres;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: private; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA private;


ALTER SCHEMA private OWNER TO postgres;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA supabase_functions;


ALTER SCHEMA supabase_functions OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: activity_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.activity_type AS ENUM (
    'call',
    'message',
    'note',
    'task',
    'stage_change',
    'system'
);


ALTER TYPE public.activity_type OWNER TO postgres;

--
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.appointment_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled',
    'no_show'
);


ALTER TYPE public.appointment_status OWNER TO postgres;

--
-- Name: audit_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_action AS ENUM (
    'workspace_updated',
    'branding_updated',
    'member_invited',
    'invitation_revoked',
    'invitation_accepted',
    'member_role_changed',
    'member_activated',
    'member_deactivated',
    'lead_merged',
    'lead_lost',
    'lead_reactivated',
    'stage_deleted',
    'product_changed',
    'pipeline_changed',
    'sale_registered',
    'opportunity_lost',
    'calendar_connected',
    'calendar_disconnected',
    'channel_connected',
    'channel_disconnected',
    'form_endpoint_changed'
);


ALTER TYPE public.audit_action OWNER TO postgres;

--
-- Name: channel_provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.channel_provider AS ENUM (
    'whatsapp',
    'instagram',
    'form',
    'meta_lead_ads'
);


ALTER TYPE public.channel_provider OWNER TO postgres;

--
-- Name: channel_transport; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.channel_transport AS ENUM (
    'cloud_api',
    'bridge'
);


ALTER TYPE public.channel_transport OWNER TO postgres;

--
-- Name: invitation_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invitation_status AS ENUM (
    'pending',
    'accepted',
    'revoked',
    'expired'
);


ALTER TYPE public.invitation_status OWNER TO postgres;

--
-- Name: lead_channel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lead_channel AS ENUM (
    'form',
    'whatsapp',
    'instagram',
    'paid_traffic',
    'manual'
);


ALTER TYPE public.lead_channel OWNER TO postgres;

--
-- Name: member_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.member_role AS ENUM (
    'admin',
    'assistant'
);


ALTER TYPE public.member_role OWNER TO postgres;

--
-- Name: message_direction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.message_direction AS ENUM (
    'inbound',
    'outbound'
);


ALTER TYPE public.message_direction OWNER TO postgres;

--
-- Name: message_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.message_status AS ENUM (
    'pending',
    'sent',
    'delivered',
    'read',
    'failed'
);


ALTER TYPE public.message_status OWNER TO postgres;

--
-- Name: note_visibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.note_visibility AS ENUM (
    'team',
    'admin_only'
);


ALTER TYPE public.note_visibility OWNER TO postgres;

--
-- Name: opportunity_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.opportunity_status AS ENUM (
    'open',
    'won',
    'lost'
);


ALTER TYPE public.opportunity_status OWNER TO postgres;

--
-- Name: outbox_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.outbox_status AS ENUM (
    'pending',
    'sent',
    'failed'
);


ALTER TYPE public.outbox_status OWNER TO postgres;

--
-- Name: scheduled_message_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.scheduled_message_status AS ENUM (
    'pending',
    'sent',
    'cancelled',
    'failed'
);


ALTER TYPE public.scheduled_message_status OWNER TO postgres;

--
-- Name: stage_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.stage_type AS ENUM (
    'new',
    'qualification',
    'follow_up_pre_session',
    'alignment_session',
    'follow_up_post_session',
    'won',
    'lost',
    'custom'
);


ALTER TYPE public.stage_type OWNER TO postgres;

--
-- Name: sync_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sync_status AS ENUM (
    'pending',
    'synced',
    'error'
);


ALTER TYPE public.sync_status OWNER TO postgres;

--
-- Name: webhook_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.webhook_status AS ENUM (
    'received',
    'processed',
    'failed'
);


ALTER TYPE public.webhook_status OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_realtime_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_realtime_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_realtime_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_realtime_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_realtime_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
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


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
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


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
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


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
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


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
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


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
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

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
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
    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
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


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
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


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
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


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: guard_stage_change(); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.guard_stage_change() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
begin
  if new.stage_id is distinct from old.stage_id
     and coalesce(current_setting('app.allow_stage_move', true), '') <> '1' then
    raise exception 'use move_lead_stage para mudar a etapa'
      using errcode = '42501';
  end if;
  return new;
end;
$$;


ALTER FUNCTION private.guard_stage_change() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;


ALTER FUNCTION private.handle_new_user() OWNER TO postgres;

--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.is_admin(ws_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = (select auth.uid())
      and role = 'admin'
      and is_active
  );
$$;


ALTER FUNCTION private.is_admin(ws_id uuid) OWNER TO postgres;

--
-- Name: is_member(uuid); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.is_member(ws_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = (select auth.uid())
      and is_active
  );
$$;


ALTER FUNCTION private.is_member(ws_id uuid) OWNER TO postgres;

--
-- Name: log_audit(uuid, public.audit_action, text, text, jsonb); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.log_audit(ws_id uuid, audit_action public.audit_action, entity_type text, entity_id text, details jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO ''
    AS $$
  insert into public.audit_logs (workspace_id, actor_id, action, entity_type, entity_id, details)
  values (ws_id, (select auth.uid()), audit_action, entity_type, entity_id, details);
$$;


ALTER FUNCTION private.log_audit(ws_id uuid, audit_action public.audit_action, entity_type text, entity_id text, details jsonb) OWNER TO postgres;

--
-- Name: normalize_lead_contacts(); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.normalize_lead_contacts() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
begin
  new.phone_normalized := private.normalize_phone(new.phone);
  new.email_normalized := nullif(lower(btrim(new.email)), '');
  return new;
end;
$$;


ALTER FUNCTION private.normalize_lead_contacts() OWNER TO postgres;

--
-- Name: normalize_phone(text); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.normalize_phone(raw text) RETURNS text
    LANGUAGE sql IMMUTABLE
    SET search_path TO ''
    AS $$
  select case
    when raw is null or btrim(raw) = '' then null
    else (
      with digits as (select regexp_replace(raw, '\D', '', 'g') as d)
      select case
        when d = '' then null
        when char_length(d) in (10, 11) then '55' || d
        else d
      end
      from digits
    )
  end;
$$;


ALTER FUNCTION private.normalize_phone(raw text) OWNER TO postgres;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION private.set_updated_at() OWNER TO postgres;

--
-- Name: user_workspaces(); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.user_workspaces() RETURNS SETOF uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select workspace_id
  from public.workspace_members
  where user_id = (select auth.uid())
    and is_active;
$$;


ALTER FUNCTION private.user_workspaces() OWNER TO postgres;

--
-- Name: accept_invitation(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.accept_invitation(raw_token text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  inv record;
  caller_email text;
begin
  if (select auth.uid()) is null then
    raise exception 'autenticação necessária' using errcode = '42501';
  end if;

  select email into caller_email from auth.users where id = (select auth.uid());

  select * into inv
  from public.workspace_invitations
  where token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex')
  for update;

  if inv is null then
    raise exception 'convite não encontrado' using errcode = 'P0002';
  end if;

  if inv.status <> 'pending' then
    raise exception 'convite não está mais válido' using errcode = 'P0002';
  end if;

  if inv.expires_at < now() then
    update public.workspace_invitations set status = 'expired' where id = inv.id;
    raise exception 'convite expirado' using errcode = 'P0002';
  end if;

  if lower(caller_email) <> lower(inv.email::text) then
    raise exception 'o convite pertence a outro e-mail' using errcode = '42501';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (inv.workspace_id, (select auth.uid()), inv.role)
  on conflict (workspace_id, user_id) do update
    set is_active = true;

  update public.workspace_invitations
  set status = 'accepted', accepted_at = now()
  where id = inv.id;

  perform private.log_audit(
    inv.workspace_id, 'invitation_accepted', 'workspace_invitation', inv.id::text,
    jsonb_build_object('role', inv.role)
  );

  return inv.workspace_id;
end;
$$;


ALTER FUNCTION public.accept_invitation(raw_token text) OWNER TO postgres;

--
-- Name: cancel_scheduled_message(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cancel_scheduled_message(p_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_row public.scheduled_messages;
begin
  select * into v_row from public.scheduled_messages where id = p_id;

  if v_row.id is null or not private.is_member(v_row.workspace_id) then
    raise exception 'agendamento não encontrado' using errcode = 'P0002';
  end if;

  if v_row.status <> 'pending' then
    raise exception 'este agendamento já foi processado' using errcode = '22023';
  end if;

  update public.scheduled_messages
  set status = 'cancelled'
  where id = p_id;
end;
$$;


ALTER FUNCTION public.cancel_scheduled_message(p_id uuid) OWNER TO postgres;

--
-- Name: change_member_role(uuid, public.member_role); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.change_member_role(member_id uuid, new_role public.member_role) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  m record;
begin
  select * into m from public.workspace_members where id = member_id;

  if m is null or not private.is_admin(m.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  if m.user_id = (select auth.uid()) then
    raise exception 'não é possível alterar o próprio papel' using errcode = '42501';
  end if;

  update public.workspace_members set role = new_role where id = member_id;

  perform private.log_audit(
    m.workspace_id, 'member_role_changed', 'workspace_member', member_id::text,
    jsonb_build_object('from', m.role, 'to', new_role)
  );
end;
$$;


ALTER FUNCTION public.change_member_role(member_id uuid, new_role public.member_role) OWNER TO postgres;

--
-- Name: create_default_pipeline(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_default_pipeline(ws_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  new_pipeline uuid;
begin
  if not private.is_admin(ws_id) and (select auth.uid()) is not null then
    raise exception 'apenas administradores' using errcode = '42501';
  end if;

  insert into public.pipelines (workspace_id, name, is_default)
  values (ws_id, 'Esteira comercial', true)
  returning id into new_pipeline;

  insert into public.pipeline_stages (workspace_id, pipeline_id, name, stage_type, position)
  values
    (ws_id, new_pipeline, 'Novo lead', 'new', 1000),
    (ws_id, new_pipeline, 'Qualificação', 'qualification', 2000),
    (ws_id, new_pipeline, 'Follow-up pré-sessão', 'follow_up_pre_session', 3000),
    (ws_id, new_pipeline, 'Sessão de alinhamento', 'alignment_session', 4000),
    (ws_id, new_pipeline, 'Follow-up pós-sessão', 'follow_up_post_session', 5000),
    (ws_id, new_pipeline, 'Venda realizada', 'won', 6000),
    (ws_id, new_pipeline, 'Perdido', 'lost', 7000);

  return new_pipeline;
end;
$$;


ALTER FUNCTION public.create_default_pipeline(ws_id uuid) OWNER TO postgres;

--
-- Name: create_invitation(uuid, text, public.member_role); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_invitation(ws_id uuid, invitee_email text, invitee_role public.member_role DEFAULT 'assistant'::public.member_role) RETURNS TABLE(invitation_id uuid, token text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  raw_token text;
  new_id uuid;
begin
  if not private.is_admin(ws_id) then
    raise exception 'apenas administradores podem convidar usuários'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.workspace_members m
    join auth.users u on u.id = m.user_id
    where m.workspace_id = ws_id
      and lower(u.email) = lower(invitee_email)
  ) then
    raise exception 'este e-mail já pertence a um membro do workspace'
      using errcode = '23505';
  end if;

  raw_token := encode(extensions.gen_random_bytes(24), 'hex');

  -- Invalida convites pendentes anteriores para o mesmo e-mail.
  update public.workspace_invitations
  set status = 'revoked'
  where workspace_id = ws_id
    and email = invitee_email::extensions.citext
    and status = 'pending';

  insert into public.workspace_invitations
    (workspace_id, email, role, token_hash, invited_by, expires_at)
  values (
    ws_id,
    invitee_email::extensions.citext,
    invitee_role,
    encode(extensions.digest(raw_token, 'sha256'), 'hex'),
    (select auth.uid()),
    now() + interval '7 days'
  )
  returning id into new_id;

  perform private.log_audit(
    ws_id, 'member_invited', 'workspace_invitation', new_id::text,
    jsonb_build_object('role', invitee_role)
  );

  return query select new_id, raw_token;
end;
$$;


ALTER FUNCTION public.create_invitation(ws_id uuid, invitee_email text, invitee_role public.member_role) OWNER TO postgres;

--
-- Name: dashboard_breakdowns(uuid, timestamp with time zone, timestamp with time zone, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dashboard_breakdowns(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO 'public'
    AS $$
with cohort as (
  select l.*
  from public.leads l
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.created_at >= p_from
    and l.created_at < p_to
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
),
by_channel as (
  select
    c.channel::text as key,
    count(*) as leads,
    count(*) filter (
      where exists (
        select 1 from public.opportunities o
        where o.lead_id = c.id and o.status = 'won' and o.deleted_at is null
      )
    ) as conversions
  from cohort c
  group by c.channel
),
-- Receita por produto usa as oportunidades ganhas do período (não a coorte),
-- porque a venda pode fechar depois da janela em que o lead entrou.
by_product as (
  select
    p.name as key,
    count(o.id) as sales,
    coalesce(sum(o.sold_value), 0) as revenue
  from public.opportunities o
  join public.products p on p.id = o.product_id
  where o.workspace_id = p_workspace_id
    and o.deleted_at is null
    and o.status = 'won'
    and o.closed_at >= p_from
    and o.closed_at < p_to
  group by p.name
),
by_owner as (
  select
    coalesce(pr.full_name, 'Sem responsável') as key,
    count(distinct c.id) as leads,
    count(distinct o.id) as sales
  from cohort c
  left join public.profiles pr on pr.id = c.owner_id
  left join public.opportunities o
    on o.lead_id = c.id and o.status = 'won' and o.deleted_at is null
  group by 1
),
by_lost_reason as (
  select coalesce(r.label, 'Sem motivo informado') as key, count(*) as total
  from public.leads l
  left join public.lost_reasons r on r.id = l.lost_reason_id
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.lost_at >= p_from
    and l.lost_at < p_to
  group by 1
)
select jsonb_build_object(
  'by_channel', coalesce((select jsonb_agg(to_jsonb(b) order by b.leads desc) from by_channel b), '[]'::jsonb),
  'by_product', coalesce((select jsonb_agg(to_jsonb(b) order by b.revenue desc) from by_product b), '[]'::jsonb),
  'by_owner', coalesce((select jsonb_agg(to_jsonb(b) order by b.leads desc) from by_owner b), '[]'::jsonb),
  'by_lost_reason', coalesce((select jsonb_agg(to_jsonb(b) order by b.total desc) from by_lost_reason b), '[]'::jsonb)
);
$$;


ALTER FUNCTION public.dashboard_breakdowns(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid) OWNER TO postgres;

--
-- Name: dashboard_funnel(uuid, timestamp with time zone, timestamp with time zone, uuid, uuid, public.lead_channel); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dashboard_funnel(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid DEFAULT NULL::uuid, p_owner_id uuid DEFAULT NULL::uuid, p_channel public.lead_channel DEFAULT NULL::public.lead_channel) RETURNS TABLE(stage_type public.stage_type, leads_reached bigint)
    LANGUAGE sql STABLE
    SET search_path TO 'public'
    AS $$
  -- Coorte: leads criados no período. Um lead conta uma única vez em cada
  -- estágio que ATINGIU, mesmo que tenha passado por ele várias vezes
  -- (reativação não duplica).
  with cohort as (
    select l.id
    from public.leads l
    where l.workspace_id = p_workspace_id
      and l.deleted_at is null
      and l.created_at >= p_from
      and l.created_at < p_to
      and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
      and (p_owner_id is null or l.owner_id = p_owner_id)
      and (p_channel is null or l.channel = p_channel)
  ),
  reached as (
    select distinct h.lead_id, h.to_stage_type as st
    from public.lead_stage_history h
    join cohort c on c.id = h.lead_id
    where h.workspace_id = p_workspace_id
  )
  select st as stage_type, count(distinct lead_id) as leads_reached
  from reached
  group by st;
$$;


ALTER FUNCTION public.dashboard_funnel(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid, p_owner_id uuid, p_channel public.lead_channel) OWNER TO postgres;

--
-- Name: dashboard_summary(uuid, timestamp with time zone, timestamp with time zone, uuid, uuid, uuid, public.lead_channel); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dashboard_summary(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid DEFAULT NULL::uuid, p_product_id uuid DEFAULT NULL::uuid, p_owner_id uuid DEFAULT NULL::uuid, p_channel public.lead_channel DEFAULT NULL::public.lead_channel) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO 'public'
    AS $$
with
-- Coorte de leads criados no período (base das taxas de conversão).
cohort as (
  select l.*
  from public.leads l
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.created_at >= p_from
    and l.created_at < p_to
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
    and (
      p_product_id is null
      or exists (
        select 1 from public.lead_product_interests i
        where i.lead_id = l.id and i.product_id = p_product_id
      )
    )
),
-- Leads que engajaram dentro do período (independe de quando entraram).
engaged as (
  select l.id
  from public.leads l
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and l.engaged_at >= p_from
    and l.engaged_at < p_to
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
scheduled as (
  select a.id, a.lead_id
  from public.appointments a
  join public.leads l on l.id = a.lead_id
  where a.workspace_id = p_workspace_id
    and a.deleted_at is null
    and a.created_at >= p_from
    and a.created_at < p_to
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
completed as (
  select a.id, a.lead_id
  from public.appointments a
  join public.leads l on l.id = a.lead_id
  where a.workspace_id = p_workspace_id
    and a.deleted_at is null
    and a.status = 'completed'
    and a.starts_at >= p_from
    and a.starts_at < p_to
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
won as (
  select o.id, o.lead_id, o.sold_value, o.closed_at
  from public.opportunities o
  join public.leads l on l.id = o.lead_id
  where o.workspace_id = p_workspace_id
    and o.deleted_at is null
    and o.status = 'won'
    and o.closed_at >= p_from
    and o.closed_at < p_to
    and (p_product_id is null or o.product_id = p_product_id)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_channel is null or l.channel = p_channel)
),
-- Denominador da taxa sessão → venda: leads com sessão realizada no período.
completed_leads as (select distinct lead_id from completed),
completed_then_won as (
  select count(distinct c.lead_id) as total
  from completed_leads c
  where exists (
    select 1 from public.opportunities o
    where o.lead_id = c.lead_id
      and o.status = 'won'
      and o.deleted_at is null
  )
),
-- Leads engajados no período que chegaram a ter sessão realizada (qualquer data).
engaged_then_session as (
  select count(distinct e.id) as total
  from engaged e
  where exists (
    select 1 from public.appointments a
    where a.lead_id = e.id
      and a.status = 'completed'
      and a.deleted_at is null
  )
),
-- Leads da coorte que converteram (conversão geral por coorte de entrada).
cohort_won as (
  select count(distinct c.id) as total
  from cohort c
  where exists (
    select 1 from public.opportunities o
    where o.lead_id = c.id
      and o.status = 'won'
      and o.deleted_at is null
  )
),
-- Tempos medianos, robustos a casos extremos.
timings as (
  select
    percentile_cont(0.5) within group (
      order by extract(epoch from (l.engaged_at - l.created_at)) / 3600
    ) filter (where l.engaged_at is not null) as median_hours_to_engage,
    percentile_cont(0.5) within group (
      order by extract(epoch from (first_appt.created_at - l.created_at)) / 86400
    ) filter (where first_appt.created_at is not null) as median_days_to_schedule
  from cohort l
  left join lateral (
    select min(a.created_at) as created_at
    from public.appointments a
    where a.lead_id = l.id and a.deleted_at is null
  ) first_appt on true
),
overdue as (
  select count(*) as total
  from public.tasks t
  where t.workspace_id = p_workspace_id
    and t.deleted_at is null
    and t.completed_at is null
    and t.due_at < now()
),
in_follow_up as (
  select count(*) as total
  from public.leads l
  join public.pipeline_stages s on s.id = l.stage_id
  where l.workspace_id = p_workspace_id
    and l.deleted_at is null
    and s.stage_type in ('follow_up_pre_session', 'follow_up_post_session')
    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)
)
select jsonb_build_object(
  'new_leads', (select count(*) from cohort),
  'engaged_leads', (select count(*) from engaged),
  'appointments_scheduled', (select count(*) from scheduled),
  'appointments_completed', (select count(*) from completed),
  'sales_count', (select count(*) from won),
  'revenue', coalesce((select sum(sold_value) from won), 0),
  'average_ticket', case
    when (select count(*) from won) > 0
      then coalesce((select sum(sold_value) from won), 0) / (select count(*) from won)
    else null
  end,
  'leads_in_follow_up', (select total from in_follow_up),
  'overdue_tasks', (select total from overdue),
  'no_shows', (
    select count(*) from public.appointments a
    where a.workspace_id = p_workspace_id and a.deleted_at is null
      and a.status = 'no_show' and a.starts_at >= p_from and a.starts_at < p_to
  ),
  'cancellations', (
    select count(*) from public.appointments a
    where a.workspace_id = p_workspace_id and a.deleted_at is null
      and a.status = 'cancelled' and a.starts_at >= p_from and a.starts_at < p_to
  ),
  -- Taxas: null quando o denominador é zero (a UI mostra "—", nunca 0%).
  'rate_lead_to_engaged', case
    when (select count(*) from cohort) > 0
      then round((select count(*) from engaged)::numeric
                 / (select count(*) from cohort), 4)
    else null
  end,
  'rate_engaged_to_session', case
    when (select count(*) from engaged) > 0
      then round((select total from engaged_then_session)::numeric
                 / (select count(*) from engaged), 4)
    else null
  end,
  'rate_session_to_sale', case
    when (select count(*) from completed_leads) > 0
      then round((select total from completed_then_won)::numeric
                 / (select count(*) from completed_leads), 4)
    else null
  end,
  'rate_overall', case
    when (select count(*) from cohort) > 0
      then round((select total from cohort_won)::numeric
                 / (select count(*) from cohort), 4)
    else null
  end,
  'median_hours_to_engage',
    (select round(median_hours_to_engage::numeric, 1) from timings),
  'median_days_to_schedule',
    (select round(median_days_to_schedule::numeric, 1) from timings)
);
$$;


ALTER FUNCTION public.dashboard_summary(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid, p_product_id uuid, p_owner_id uuid, p_channel public.lead_channel) OWNER TO postgres;

--
-- Name: dashboard_timeseries(uuid, timestamp with time zone, timestamp with time zone, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dashboard_timeseries(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid DEFAULT NULL::uuid) RETURNS TABLE(day date, new_leads bigint, sessions_completed bigint, sales bigint, revenue numeric)
    LANGUAGE sql STABLE
    SET search_path TO 'public'
    AS $$
  with days as (
    select generate_series(p_from::date, (p_to - interval '1 day')::date, '1 day')::date as day
  )
  select
    d.day,
    coalesce(l.total, 0) as new_leads,
    coalesce(a.total, 0) as sessions_completed,
    coalesce(o.total, 0) as sales,
    coalesce(o.revenue, 0) as revenue
  from days d
  left join (
    select created_at::date as day, count(*) as total
    from public.leads
    where workspace_id = p_workspace_id and deleted_at is null
      and created_at >= p_from and created_at < p_to
      and (p_pipeline_id is null or pipeline_id = p_pipeline_id)
    group by 1
  ) l on l.day = d.day
  left join (
    select starts_at::date as day, count(*) as total
    from public.appointments
    where workspace_id = p_workspace_id and deleted_at is null
      and status = 'completed'
      and starts_at >= p_from and starts_at < p_to
    group by 1
  ) a on a.day = d.day
  left join (
    select closed_at::date as day, count(*) as total, sum(sold_value) as revenue
    from public.opportunities
    where workspace_id = p_workspace_id and deleted_at is null
      and status = 'won'
      and closed_at >= p_from and closed_at < p_to
    group by 1
  ) o on o.day = d.day
  order by d.day;
$$;


ALTER FUNCTION public.dashboard_timeseries(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid) OWNER TO postgres;

--
-- Name: delete_stage_migrating_leads(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_stage_migrating_leads(p_stage_id uuid, p_target_stage_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_stage record;
  v_target record;
  v_lead record;
begin
  select * into v_stage from public.pipeline_stages where id = p_stage_id;

  if v_stage is null or not private.is_admin(v_stage.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.leads
    where stage_id = p_stage_id and deleted_at is null
  ) then
    select * into v_target
    from public.pipeline_stages
    where id = p_target_stage_id and archived_at is null;

    if v_target is null
       or v_target.pipeline_id <> v_stage.pipeline_id
       or v_target.id = v_stage.id then
      raise exception 'escolha uma etapa de destino válida para os leads'
        using errcode = '22023';
    end if;

    for v_lead in
      select id from public.leads
      where stage_id = p_stage_id and deleted_at is null
    loop
      perform public.move_lead_stage(v_lead.id, p_target_stage_id, 0);
    end loop;
  end if;

  delete from public.pipeline_stages where id = p_stage_id;

  perform private.log_audit(
    v_stage.workspace_id, 'stage_deleted', 'pipeline_stage', p_stage_id::text,
    jsonb_build_object('name', v_stage.name, 'stage_type', v_stage.stage_type,
                       'target_stage_id', p_target_stage_id)
  );
end;
$$;


ALTER FUNCTION public.delete_stage_migrating_leads(p_stage_id uuid, p_target_stage_id uuid) OWNER TO postgres;

--
-- Name: dispatch_due_messages(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dispatch_due_messages(p_limit integer DEFAULT 20) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_row record;
  v_message_id uuid;
  v_enviadas integer := 0;
  v_atraso interval;
begin
  for v_row in
    select * from public.scheduled_messages
    where status = 'pending' and scheduled_for <= now()
    order by scheduled_for
    limit p_limit
    for update skip locked
  loop
    v_atraso := now() - v_row.scheduled_for;

    -- Atrasou demais: não envia. Motivo visível para a pessoa reagendar.
    if v_atraso > make_interval(mins => v_row.max_delay_minutes) then
      update public.scheduled_messages
      set status = 'failed',
          error = 'não enviada: o horário passou há '
                  || round(extract(epoch from v_atraso) / 3600)::text
                  || 'h (o ORDO estava fora do ar). Reagende se ainda fizer sentido.'
      where id = v_row.id;
      continue;
    end if;

    begin
      insert into public.messages
        (workspace_id, conversation_id, provider, direction, status, body, sent_by)
      select v_row.workspace_id, v_row.conversation_id, c.provider,
             'outbound', 'pending', v_row.body, v_row.created_by
      from public.conversations c where c.id = v_row.conversation_id
      returning id into v_message_id;

      insert into public.outbox_messages
        (workspace_id, message_id, provider, payload)
      select v_row.workspace_id, v_message_id, c.provider,
             jsonb_build_object(
               'conversation_id', v_row.conversation_id,
               'external_conversation_id', c.external_conversation_id,
               'body', v_row.body,
               'scheduled', true
             )
      from public.conversations c where c.id = v_row.conversation_id;

      update public.conversations
      set last_message_at = now(),
          last_message_preview = left(v_row.body, 160)
      where id = v_row.conversation_id;

      if v_row.lead_id is not null then
        insert into public.activities
          (workspace_id, lead_id, type, content, meta, actor_id)
        values (v_row.workspace_id, v_row.lead_id, 'message',
                left(v_row.body, 300),
                jsonb_build_object('direction', 'outbound', 'scheduled', true),
                v_row.created_by);
      end if;

      update public.scheduled_messages
      set status = 'sent', sent_at = now(), message_id = v_message_id, error = null
      where id = v_row.id;

      v_enviadas := v_enviadas + 1;

    exception when others then
      update public.scheduled_messages
      set status = 'failed', error = left(sqlerrm, 300)
      where id = v_row.id;
    end;
  end loop;

  return v_enviadas;
end;
$$;


ALTER FUNCTION public.dispatch_due_messages(p_limit integer) OWNER TO postgres;

--
-- Name: get_invitation_public(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_invitation_public(raw_token text) RETURNS TABLE(workspace_name text, email text, role public.member_role, status public.invitation_status, expires_at timestamp with time zone)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select w.name, i.email::text, i.role, i.status, i.expires_at
  from public.workspace_invitations i
  join public.workspaces w on w.id = i.workspace_id
  where i.token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex');
$$;


ALTER FUNCTION public.get_invitation_public(raw_token text) OWNER TO postgres;

--
-- Name: ingest_channel_message(uuid, public.channel_provider, text, text, text, text, text, timestamp with time zone, text, text, public.message_direction, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ingest_channel_message(p_workspace_id uuid, p_provider public.channel_provider, p_external_conversation_id text, p_external_message_id text, p_sender_external_id text, p_sender_name text, p_body text, p_sent_at timestamp with time zone DEFAULT now(), p_media_type text DEFAULT NULL::text, p_media_url text DEFAULT NULL::text, p_direction public.message_direction DEFAULT 'inbound'::public.message_direction, p_phone text DEFAULT NULL::text) RETURNS TABLE(out_message_id uuid, out_conversation_id uuid, out_lead_id uuid, out_created_lead boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_conversation public.conversations;
  v_lead_id uuid;
  v_created_lead boolean := false;
  v_message_id uuid;
  v_pipeline record;
  v_stage record;
  v_channel public.lead_channel;
  v_inbound boolean := p_direction = 'inbound';
begin
  select m.id, m.conversation_id into v_message_id, v_conversation.id
  from public.messages m
  where m.workspace_id = p_workspace_id
    and m.provider = p_provider
    and m.external_message_id = p_external_message_id
    and p_external_message_id is not null;

  if v_message_id is not null then
    select c.lead_id into v_lead_id
    from public.conversations c where c.id = v_conversation.id;
    return query select v_message_id, v_conversation.id, v_lead_id, false;
    return;
  end if;

  select ei.lead_id into v_lead_id
  from public.external_identities ei
  where ei.workspace_id = p_workspace_id
    and ei.provider = p_provider
    and ei.external_id = p_sender_external_id;

  if v_lead_id is null then
    select p.id into v_pipeline
    from public.pipelines p
    where p.workspace_id = p_workspace_id and p.archived_at is null
    order by p.is_default desc, p.position
    limit 1;

    if v_pipeline.id is null then
      raise exception 'workspace sem pipeline configurado' using errcode = '22023';
    end if;

    select s.id into v_stage
    from public.pipeline_stages s
    where s.pipeline_id = v_pipeline.id and s.archived_at is null
    order by s.position
    limit 1;

    v_channel := case
      when p_provider = 'whatsapp' then 'whatsapp'::public.lead_channel
      when p_provider = 'instagram' then 'instagram'::public.lead_channel
      else 'manual'::public.lead_channel
    end;

    insert into public.leads
      (workspace_id, pipeline_id, stage_id, position, name, channel,
       phone, source_detail)
    values
      (p_workspace_id, v_pipeline.id, v_stage.id, 0,
       coalesce(nullif(btrim(p_sender_name), ''), 'Contato ' || p_provider::text),
       v_channel,
       -- Só telefone de verdade entra aqui.
       nullif(btrim(coalesce(p_phone, '')), ''),
       case when v_inbound
            then 'Primeira mensagem recebida por ' || p_provider::text
            else 'Primeiro contato feito por ' || p_provider::text end)
    returning id into v_lead_id;

    v_created_lead := true;

    insert into public.lead_stage_history
      (workspace_id, lead_id, to_stage_id, to_stage_type)
    select p_workspace_id, v_lead_id, s.id, s.stage_type
    from public.pipeline_stages s where s.id = v_stage.id;

    insert into public.external_identities
      (workspace_id, lead_id, provider, external_id, display_name)
    values (p_workspace_id, v_lead_id, p_provider, p_sender_external_id, p_sender_name)
    on conflict (workspace_id, provider, external_id) do nothing;
  end if;

  insert into public.conversations
    (workspace_id, lead_id, provider, external_conversation_id,
     last_inbound_at, last_message_at, last_message_preview, unread_count)
  values
    (p_workspace_id, v_lead_id, p_provider, p_external_conversation_id,
     case when v_inbound then p_sent_at else null end,
     p_sent_at, left(coalesce(p_body, '[mídia]'), 160),
     case when v_inbound then 1 else 0 end)
  on conflict (workspace_id, provider, external_conversation_id) do update
    set lead_id = coalesce(public.conversations.lead_id, excluded.lead_id),
        last_inbound_at = case
          when v_inbound then excluded.last_inbound_at
          else public.conversations.last_inbound_at
        end,
        last_message_at = excluded.last_message_at,
        last_message_preview = excluded.last_message_preview,
        unread_count = case
          when v_inbound then public.conversations.unread_count + 1
          else 0
        end
  returning * into v_conversation;

  insert into public.conversation_participants
    (workspace_id, conversation_id, external_id, display_name, is_self)
  values (p_workspace_id, v_conversation.id, p_sender_external_id,
          p_sender_name, not v_inbound)
  on conflict (conversation_id, external_id) do nothing;

  insert into public.messages
    (workspace_id, conversation_id, provider, external_message_id, direction,
     status, sender_external_id, body, media_type, media_url, sent_at)
  values
    (p_workspace_id, v_conversation.id, p_provider, p_external_message_id,
     p_direction,
     case when v_inbound then 'delivered'::public.message_status
          else 'sent'::public.message_status end,
     p_sender_external_id, p_body, p_media_type, p_media_url, p_sent_at)
  returning id into v_message_id;

  update public.leads
  set engaged_at = case
        when v_inbound then coalesce(engaged_at, p_sent_at) else engaged_at
      end,
      first_contact_at = coalesce(first_contact_at, p_sent_at),
      -- O telefone pode chegar depois, quando o contato for resolvido.
      phone = coalesce(phone, nullif(btrim(coalesce(p_phone, '')), ''))
  where id = v_lead_id;

  insert into public.activities
    (workspace_id, lead_id, type, content, meta)
  values
    (p_workspace_id, v_lead_id, 'message',
     left(coalesce(p_body, '[mídia]'), 300),
     jsonb_build_object('provider', p_provider, 'direction', p_direction));

  return query select v_message_id, v_conversation.id, v_lead_id, v_created_lead;
end;
$$;


ALTER FUNCTION public.ingest_channel_message(p_workspace_id uuid, p_provider public.channel_provider, p_external_conversation_id text, p_external_message_id text, p_sender_external_id text, p_sender_name text, p_body text, p_sent_at timestamp with time zone, p_media_type text, p_media_url text, p_direction public.message_direction, p_phone text) OWNER TO postgres;

--
-- Name: mark_conversation_read(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.mark_conversation_read(p_conversation_id uuid) RETURNS void
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO ''
    AS $$
  update public.conversations
  set unread_count = 0
  where id = p_conversation_id
    and private.is_member(workspace_id);
$$;


ALTER FUNCTION public.mark_conversation_read(p_conversation_id uuid) OWNER TO postgres;

--
-- Name: mark_lead_lost(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.mark_lead_lost(p_lead_id uuid, p_lost_reason_id uuid, p_note text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_lead record;
  v_lost_stage record;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  if p_lost_reason_id is null or not exists (
    select 1 from public.lost_reasons
    where id = p_lost_reason_id and workspace_id = v_lead.workspace_id
  ) then
    raise exception 'motivo de perda obrigatório' using errcode = '22023';
  end if;

  select * into v_lost_stage
  from public.pipeline_stages
  where pipeline_id = v_lead.pipeline_id
    and stage_type = 'lost'
    and archived_at is null
  order by position
  limit 1;

  if v_lost_stage is null then
    raise exception 'o pipeline não possui etapa de perda' using errcode = '22023';
  end if;

  update public.leads
  set lost_reason_id = p_lost_reason_id,
      lost_note = p_note,
      lost_at = now()
  where id = p_lead_id;

  update public.opportunities
  set status = 'lost',
      lost_reason_id = p_lost_reason_id,
      closed_at = now()
  where lead_id = p_lead_id
    and status = 'open'
    and deleted_at is null;

  perform public.move_lead_stage(p_lead_id, v_lost_stage.id, 0);

  perform private.log_audit(
    v_lead.workspace_id, 'lead_lost', 'lead', p_lead_id::text,
    jsonb_build_object('lost_reason_id', p_lost_reason_id)
  );
end;
$$;


ALTER FUNCTION public.mark_lead_lost(p_lead_id uuid, p_lost_reason_id uuid, p_note text) OWNER TO postgres;

--
-- Name: mark_opportunity_lost(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.mark_opportunity_lost(p_opportunity_id uuid, p_lost_reason_id uuid DEFAULT NULL::uuid, p_note text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_opp record;
begin
  select * into v_opp
  from public.opportunities
  where id = p_opportunity_id and deleted_at is null
  for update;

  if v_opp is null or not private.is_member(v_opp.workspace_id) then
    raise exception 'oportunidade não encontrada' using errcode = 'P0002';
  end if;

  if v_opp.status <> 'open' then
    raise exception 'a oportunidade já está fechada' using errcode = '22023';
  end if;

  update public.opportunities
  set status = 'lost',
      lost_reason_id = p_lost_reason_id,
      notes = coalesce(p_note, notes),
      closed_at = now()
  where id = p_opportunity_id;

  perform private.log_audit(
    v_opp.workspace_id, 'opportunity_lost', 'opportunity', p_opportunity_id::text,
    jsonb_build_object('lost_reason_id', p_lost_reason_id)
  );
end;
$$;


ALTER FUNCTION public.mark_opportunity_lost(p_opportunity_id uuid, p_lost_reason_id uuid, p_note text) OWNER TO postgres;

--
-- Name: merge_leads(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.merge_leads(p_primary_id uuid, p_duplicate_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_primary record;
  v_duplicate record;
begin
  if p_primary_id = p_duplicate_id then
    raise exception 'os leads precisam ser diferentes' using errcode = '22023';
  end if;

  select * into v_primary
  from public.leads where id = p_primary_id and deleted_at is null
  for update;
  select * into v_duplicate
  from public.leads where id = p_duplicate_id and deleted_at is null
  for update;

  if v_primary is null or v_duplicate is null
     or v_primary.workspace_id <> v_duplicate.workspace_id
     or not private.is_admin(v_primary.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  update public.notes set lead_id = p_primary_id where lead_id = p_duplicate_id;
  update public.tasks set lead_id = p_primary_id where lead_id = p_duplicate_id;
  update public.activities set lead_id = p_primary_id where lead_id = p_duplicate_id;
  update public.lead_stage_history set lead_id = p_primary_id where lead_id = p_duplicate_id;

  insert into public.lead_product_interests (workspace_id, lead_id, product_id)
  select workspace_id, p_primary_id, product_id
  from public.lead_product_interests
  where lead_id = p_duplicate_id
  on conflict (lead_id, product_id) do nothing;
  delete from public.lead_product_interests where lead_id = p_duplicate_id;

  insert into public.lead_tags (workspace_id, lead_id, tag_id)
  select workspace_id, p_primary_id, tag_id
  from public.lead_tags
  where lead_id = p_duplicate_id
  on conflict (lead_id, tag_id) do nothing;
  delete from public.lead_tags where lead_id = p_duplicate_id;

  update public.leads
  set phone = coalesce(v_primary.phone, v_duplicate.phone),
      email = coalesce(v_primary.email, v_duplicate.email),
      social_name = coalesce(v_primary.social_name, v_duplicate.social_name),
      city = coalesce(v_primary.city, v_duplicate.city),
      state = coalesce(v_primary.state, v_duplicate.state),
      contact_preference = coalesce(v_primary.contact_preference, v_duplicate.contact_preference),
      utm_source = coalesce(v_primary.utm_source, v_duplicate.utm_source),
      utm_medium = coalesce(v_primary.utm_medium, v_duplicate.utm_medium),
      utm_campaign = coalesce(v_primary.utm_campaign, v_duplicate.utm_campaign),
      utm_content = coalesce(v_primary.utm_content, v_duplicate.utm_content),
      utm_term = coalesce(v_primary.utm_term, v_duplicate.utm_term),
      potential_value = coalesce(v_primary.potential_value, v_duplicate.potential_value),
      owner_id = coalesce(v_primary.owner_id, v_duplicate.owner_id),
      first_contact_at = least(
        coalesce(v_primary.first_contact_at, v_duplicate.first_contact_at),
        coalesce(v_duplicate.first_contact_at, v_primary.first_contact_at)
      ),
      engaged_at = least(
        coalesce(v_primary.engaged_at, v_duplicate.engaged_at),
        coalesce(v_duplicate.engaged_at, v_primary.engaged_at)
      )
  where id = p_primary_id;

  update public.leads
  set deleted_at = now()
  where id = p_duplicate_id;

  insert into public.activities (workspace_id, lead_id, type, content, actor_id)
  values (v_primary.workspace_id, p_primary_id, 'system',
          'Lead mesclado com registro duplicado', (select auth.uid()));

  perform private.log_audit(
    v_primary.workspace_id, 'lead_merged', 'lead', p_primary_id::text,
    jsonb_build_object('duplicate_id', p_duplicate_id)
  );
end;
$$;


ALTER FUNCTION public.merge_leads(p_primary_id uuid, p_duplicate_id uuid) OWNER TO postgres;

--
-- Name: move_lead_stage(uuid, uuid, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.move_lead_stage(p_lead_id uuid, p_stage_id uuid, p_position numeric) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_lead record;
  v_from_stage record;
  v_to_stage record;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  select * into v_to_stage
  from public.pipeline_stages
  where id = p_stage_id and archived_at is null;

  if v_to_stage is null
     or v_to_stage.workspace_id <> v_lead.workspace_id
     or v_to_stage.pipeline_id <> v_lead.pipeline_id then
    raise exception 'etapa inválida para este lead' using errcode = '22023';
  end if;

  select * into v_from_stage
  from public.pipeline_stages
  where id = v_lead.stage_id;

  perform set_config('app.allow_stage_move', '1', true);

  update public.leads
  set stage_id = p_stage_id, position = p_position
  where id = p_lead_id;

  perform set_config('app.allow_stage_move', '', true);

  if v_lead.stage_id <> p_stage_id then
    insert into public.lead_stage_history
      (workspace_id, lead_id, from_stage_id, to_stage_id,
       from_stage_type, to_stage_type, actor_id)
    values
      (v_lead.workspace_id, p_lead_id, v_lead.stage_id, p_stage_id,
       v_from_stage.stage_type, v_to_stage.stage_type, (select auth.uid()));

    insert into public.activities (workspace_id, lead_id, type, content, meta, actor_id)
    values (
      v_lead.workspace_id, p_lead_id, 'stage_change',
      v_from_stage.name || ' → ' || v_to_stage.name,
      jsonb_build_object('from_stage_type', v_from_stage.stage_type,
                         'to_stage_type', v_to_stage.stage_type),
      (select auth.uid())
    );
  end if;
end;
$$;


ALTER FUNCTION public.move_lead_stage(p_lead_id uuid, p_stage_id uuid, p_position numeric) OWNER TO postgres;

--
-- Name: purge_test_outbox(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.purge_test_outbox(p_conversation_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare v_workspace uuid; v_removidas integer;
begin
  select workspace_id into v_workspace from public.conversations where id = p_conversation_id;
  if v_workspace is null or not private.is_admin(v_workspace) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;
  with alvo as (
    select o.id from public.outbox_messages o
    join public.messages m on m.id = o.message_id
    where o.workspace_id = v_workspace and o.status = 'pending'
      and m.conversation_id = p_conversation_id
  )
  delete from public.outbox_messages o using alvo where o.id = alvo.id;
  get diagnostics v_removidas = row_count;
  return v_removidas;
end; $$;


ALTER FUNCTION public.purge_test_outbox(p_conversation_id uuid) OWNER TO postgres;

--
-- Name: reactivate_lead(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reactivate_lead(p_lead_id uuid, p_stage_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_lead record;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  update public.leads
  set lost_reason_id = null,
      lost_note = null,
      lost_at = null,
      reactivated_count = reactivated_count + 1
  where id = p_lead_id;

  perform public.move_lead_stage(p_lead_id, p_stage_id, 0);

  perform private.log_audit(
    v_lead.workspace_id, 'lead_reactivated', 'lead', p_lead_id::text
  );
end;
$$;


ALTER FUNCTION public.reactivate_lead(p_lead_id uuid, p_stage_id uuid) OWNER TO postgres;

--
-- Name: register_sale(uuid, uuid, numeric, text, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.register_sale(p_lead_id uuid, p_product_id uuid, p_sold_value numeric, p_payment_method text DEFAULT NULL::text, p_opportunity_id uuid DEFAULT NULL::uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
declare
  v_lead record;
  v_won_stage record;
  v_opportunity_id uuid;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id and deleted_at is null
  for update;

  if v_lead is null or not private.is_member(v_lead.workspace_id) then
    raise exception 'lead não encontrado' using errcode = 'P0002';
  end if;

  if p_sold_value is null or p_sold_value < 0 then
    raise exception 'valor vendido inválido' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.products
    where id = p_product_id and workspace_id = v_lead.workspace_id
  ) then
    raise exception 'produto inválido' using errcode = '22023';
  end if;

  if p_opportunity_id is not null then
    update public.opportunities
    set status = 'won',
        sold_value = p_sold_value,
        payment_method = coalesce(p_payment_method, payment_method),
        product_id = p_product_id,
        closed_at = now()
    where id = p_opportunity_id
      and lead_id = p_lead_id
      and workspace_id = v_lead.workspace_id
      and status = 'open'
    returning id into v_opportunity_id;

    if v_opportunity_id is null then
      raise exception 'oportunidade inválida ou já fechada' using errcode = '22023';
    end if;
  else
    insert into public.opportunities
      (workspace_id, lead_id, product_id, status, sold_value, payment_method,
       closed_at, owner_id, created_by)
    values
      (v_lead.workspace_id, p_lead_id, p_product_id, 'won', p_sold_value,
       p_payment_method, now(), v_lead.owner_id, (select auth.uid()))
    returning id into v_opportunity_id;
  end if;

  -- Move para a etapa de venda, se existir e o lead ainda não estiver nela.
  -- Atenção: `record IS NOT NULL` em PL/pgSQL só é verdadeiro quando TODAS as
  -- colunas são não-nulas (archived_at é nulo nas etapas ativas), por isso o
  -- teste é feito sobre a coluna id.
  select * into v_won_stage
  from public.pipeline_stages
  where pipeline_id = v_lead.pipeline_id
    and stage_type = 'won'
    and archived_at is null
  order by position
  limit 1;

  if v_won_stage.id is not null and v_lead.stage_id <> v_won_stage.id then
    perform public.move_lead_stage(p_lead_id, v_won_stage.id, 0);
  end if;

  insert into public.activities (workspace_id, lead_id, type, content, actor_id)
  values (v_lead.workspace_id, p_lead_id, 'system',
          'Venda registrada — R$ ' || to_char(p_sold_value, 'FM999G999G990D00'),
          (select auth.uid()));

  perform private.log_audit(
    v_lead.workspace_id, 'sale_registered', 'opportunity', v_opportunity_id::text,
    jsonb_build_object('sold_value', p_sold_value, 'product_id', p_product_id)
  );

  return v_opportunity_id;
end;
$_$;


ALTER FUNCTION public.register_sale(p_lead_id uuid, p_product_id uuid, p_sold_value numeric, p_payment_method text, p_opportunity_id uuid) OWNER TO postgres;

--
-- Name: revoke_invitation(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.revoke_invitation(invitation_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  ws uuid;
begin
  select workspace_id into ws
  from public.workspace_invitations
  where id = invitation_id;

  if ws is null or not private.is_admin(ws) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  update public.workspace_invitations
  set status = 'revoked'
  where id = invitation_id and status = 'pending';

  perform private.log_audit(ws, 'invitation_revoked', 'workspace_invitation', invitation_id::text);
end;
$$;


ALTER FUNCTION public.revoke_invitation(invitation_id uuid) OWNER TO postgres;

--
-- Name: schedule_message(uuid, text, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.schedule_message(p_conversation_id uuid, p_body text, p_scheduled_for timestamp with time zone) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_conversation public.conversations;
  v_id uuid;
begin
  select * into v_conversation
  from public.conversations where id = p_conversation_id;

  if v_conversation.id is null
     or not private.is_member(v_conversation.workspace_id) then
    raise exception 'conversa não encontrada' using errcode = 'P0002';
  end if;

  if p_body is null or btrim(p_body) = '' then
    raise exception 'mensagem vazia' using errcode = '22023';
  end if;

  -- Um minuto de folga evita agendar no passado por diferença de relógio.
  if p_scheduled_for <= now() - interval '1 minute' then
    raise exception 'escolha um horário no futuro' using errcode = '22023';
  end if;

  insert into public.scheduled_messages
    (workspace_id, conversation_id, lead_id, body, scheduled_for, created_by)
  values
    (v_conversation.workspace_id, p_conversation_id, v_conversation.lead_id,
     btrim(p_body), p_scheduled_for, (select auth.uid()))
  returning id into v_id;

  return v_id;
end;
$$;


ALTER FUNCTION public.schedule_message(p_conversation_id uuid, p_body text, p_scheduled_for timestamp with time zone) OWNER TO postgres;

--
-- Name: send_channel_message(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_channel_message(p_conversation_id uuid, p_body text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_conversation public.conversations;
  v_message_id uuid;
begin
  select * into v_conversation
  from public.conversations
  where id = p_conversation_id;

  if v_conversation.id is null
     or not private.is_member(v_conversation.workspace_id) then
    raise exception 'conversa não encontrada' using errcode = 'P0002';
  end if;

  if p_body is null or btrim(p_body) = '' then
    raise exception 'mensagem vazia' using errcode = '22023';
  end if;

  insert into public.messages
    (workspace_id, conversation_id, provider, direction, status, body, sent_by)
  values
    (v_conversation.workspace_id, p_conversation_id, v_conversation.provider,
     'outbound', 'pending', p_body, (select auth.uid()))
  returning id into v_message_id;

  insert into public.outbox_messages
    (workspace_id, message_id, provider, payload)
  values
    (v_conversation.workspace_id, v_message_id, v_conversation.provider,
     jsonb_build_object(
       'conversation_id', p_conversation_id,
       'external_conversation_id', v_conversation.external_conversation_id,
       'body', p_body
     ));

  update public.conversations
  set last_message_at = now(),
      last_message_preview = left(p_body, 160),
      unread_count = 0
  where id = p_conversation_id;

  if v_conversation.lead_id is not null then
    insert into public.activities (workspace_id, lead_id, type, content, meta, actor_id)
    values (v_conversation.workspace_id, v_conversation.lead_id, 'message',
            left(p_body, 300),
            jsonb_build_object('provider', v_conversation.provider,
                               'direction', 'outbound'),
            (select auth.uid()));
  end if;

  return v_message_id;
end;
$$;


ALTER FUNCTION public.send_channel_message(p_conversation_id uuid, p_body text) OWNER TO postgres;

--
-- Name: set_member_active(uuid, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_member_active(member_id uuid, active boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  m record;
begin
  select * into m from public.workspace_members where id = member_id;

  if m is null or not private.is_admin(m.workspace_id) then
    raise exception 'operação não permitida' using errcode = '42501';
  end if;

  if m.user_id = (select auth.uid()) then
    raise exception 'não é possível desativar a si mesmo' using errcode = '42501';
  end if;

  update public.workspace_members set is_active = active where id = member_id;

  perform private.log_audit(
    m.workspace_id,
    case when active then 'member_activated' else 'member_deactivated' end,
    'workspace_member',
    member_id::text
  );
end;
$$;


ALTER FUNCTION public.set_member_active(member_id uuid, active boolean) OWNER TO postgres;

--
-- Name: upcoming_scheduled_messages(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.upcoming_scheduled_messages(p_workspace_id uuid, p_limit integer DEFAULT 10) RETURNS TABLE(id uuid, conversation_id uuid, lead_id uuid, lead_name text, body text, scheduled_for timestamp with time zone)
    LANGUAGE sql STABLE
    SET search_path TO 'public'
    AS $$
  select s.id, s.conversation_id, s.lead_id,
         coalesce(l.name, 'Contato sem cadastro'), s.body, s.scheduled_for
  from public.scheduled_messages s
  left join public.leads l on l.id = s.lead_id
  where s.workspace_id = p_workspace_id
    and s.status = 'pending'
  order by s.scheduled_for
  limit p_limit;
$$;


ALTER FUNCTION public.upcoming_scheduled_messages(p_workspace_id uuid, p_limit integer) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
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
    working_role regrole;
    working_selected_columns text[];
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

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

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

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
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
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

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
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    -- Reset the role on every FOR..LOOP batch execution.
                    -- The first batch of 10 rows is pre-fetched using the current connection role (PG internal behaviour)
                    -- then we have to reset it again otherwise it would use the role defined in the `set_config` above
                    -- to fetch the remaining rows when rows>10, which could be a user-defined role that lacks execution grants.
                    -- The flow is:
                    --   1. run batch with conn role
                    --   2. set_config working_role
                    --   3. execute walrus
                    --   4. reset role (revert)
                    --   5. repeat
                    perform set_config('role', null, true);

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

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
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
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
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
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
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
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
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_realtime_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
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


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_realtime_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
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


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_realtime_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
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


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_realtime_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
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


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_realtime_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) OWNER TO supabase_realtime_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_realtime_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
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
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_realtime_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_realtime_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_realtime_admin;

--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) OWNER TO supabase_realtime_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_realtime_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_realtime_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_realtime_admin;

--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
  DECLARE
    request_id bigint;
    payload jsonb;
    url text := TG_ARGV[0]::text;
    method text := TG_ARGV[1]::text;
    headers jsonb DEFAULT '{}'::jsonb;
    params jsonb DEFAULT '{}'::jsonb;
    timeout_ms integer DEFAULT 1000;
  BEGIN
    IF url IS NULL OR url = 'null' THEN
      RAISE EXCEPTION 'url argument is missing';
    END IF;

    IF method IS NULL OR method = 'null' THEN
      RAISE EXCEPTION 'method argument is missing';
    END IF;

    IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
      headers = '{"Content-Type": "application/json"}'::jsonb;
    ELSE
      headers = TG_ARGV[2]::jsonb;
    END IF;

    IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
      params = '{}'::jsonb;
    ELSE
      params = TG_ARGV[3]::jsonb;
    END IF;

    IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
      timeout_ms = 1000;
    ELSE
      timeout_ms = TG_ARGV[4]::integer;
    END IF;

    CASE
      WHEN method = 'GET' THEN
        SELECT http_get INTO request_id FROM net.http_get(
          url,
          params,
          headers,
          timeout_ms
        );
      WHEN method = 'POST' THEN
        payload = jsonb_build_object(
          'old_record', OLD,
          'record', NEW,
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA
        );

        SELECT http_post INTO request_id FROM net.http_post(
          url,
          payload,
          params,
          headers,
          timeout_ms
        );
      ELSE
        RAISE EXCEPTION 'method argument % is invalid', method;
    END CASE;

    INSERT INTO supabase_functions.hooks
      (hook_table_id, hook_name, request_id)
    VALUES
      (TG_RELID, TG_NAME, request_id);

    RETURN NEW;
  END
$$;


ALTER FUNCTION supabase_functions.http_request() OWNER TO supabase_functions_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE _realtime.extensions OWNER TO supabase_admin;

--
-- Name: feature_flags; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.feature_flags (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    rollout_percentage integer DEFAULT 100 NOT NULL,
    bucket_key character varying(255),
    CONSTRAINT rollout_percentage_must_be_between_0_and_100 CHECK (((rollout_percentage >= 0) AND (rollout_percentage <= 100)))
);


ALTER TABLE _realtime.feature_flags OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE _realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL,
    migrations_ran integer DEFAULT 0,
    broadcast_adapter character varying(255) DEFAULT 'gen_rpc'::character varying,
    max_presence_events_per_second integer DEFAULT 1000,
    max_payload_size_in_kb integer DEFAULT 3000,
    max_client_presence_events_per_window integer,
    client_presence_window_ms integer,
    presence_enabled boolean DEFAULT false NOT NULL,
    feature_flags jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT jwt_secret_or_jwt_jwks_required CHECK (((jwt_secret IS NOT NULL) OR (jwt_jwks IS NOT NULL)))
);


ALTER TABLE _realtime.tenants OWNER TO supabase_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
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


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
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


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id bigint NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    type public.activity_type NOT NULL,
    content text,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    actor_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.activities ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    title text DEFAULT 'Sessão de alinhamento'::text NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    status public.appointment_status DEFAULT 'scheduled'::public.appointment_status NOT NULL,
    location text,
    description text,
    meet_link text,
    calendar_event_id text,
    calendar_sync_status public.sync_status,
    calendar_sync_error text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT appointments_period CHECK ((ends_at > starts_at))
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    workspace_id uuid NOT NULL,
    actor_id uuid,
    action public.audit_action NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    details jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: calendar_connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    user_id uuid NOT NULL,
    provider text DEFAULT 'google'::text NOT NULL,
    account_email text,
    calendar_id text,
    calendar_name text,
    status text DEFAULT 'awaiting_config'::text NOT NULL,
    access_token_enc text,
    refresh_token_enc text,
    token_expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.calendar_connections OWNER TO postgres;

--
-- Name: calendar_sync_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_sync_events (
    id bigint NOT NULL,
    workspace_id uuid NOT NULL,
    appointment_id uuid,
    direction text DEFAULT 'outbound'::text NOT NULL,
    external_event_id text,
    status public.sync_status DEFAULT 'pending'::public.sync_status NOT NULL,
    error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.calendar_sync_events OWNER TO postgres;

--
-- Name: calendar_sync_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.calendar_sync_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.calendar_sync_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: channel_connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    provider public.channel_provider NOT NULL,
    status text DEFAULT 'awaiting_config'::text NOT NULL,
    display_name text,
    external_account_id text,
    phone_number_id text,
    waba_id text,
    instagram_id text,
    access_token_enc text,
    app_secret_enc text,
    verify_token_enc text,
    last_event_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    transport public.channel_transport DEFAULT 'cloud_api'::public.channel_transport NOT NULL,
    bridge_url text,
    bridge_secret_enc text,
    bridge_state text,
    bridge_state_at timestamp with time zone
);


ALTER TABLE public.channel_connections OWNER TO postgres;

--
-- Name: COLUMN channel_connections.transport; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.channel_connections.transport IS 'cloud_api = API oficial da Meta; bridge = dispositivo conectado (não oficial)';


--
-- Name: COLUMN channel_connections.bridge_secret_enc; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.channel_connections.bridge_secret_enc IS 'Segredo HMAC compartilhado com a ponte, cifrado com INTEGRATION_TOKEN_KEY';


--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversation_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    external_id text NOT NULL,
    display_name text,
    is_self boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.conversation_participants OWNER TO postgres;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid,
    provider public.channel_provider NOT NULL,
    external_conversation_id text NOT NULL,
    last_inbound_at timestamp with time zone,
    last_message_at timestamp with time zone,
    last_message_preview text,
    unread_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: external_identities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.external_identities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    provider public.channel_provider NOT NULL,
    external_id text NOT NULL,
    display_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.external_identities OWNER TO postgres;

--
-- Name: form_endpoints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_endpoints (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    slug text NOT NULL,
    name text DEFAULT 'Formulário de contato'::text NOT NULL,
    headline text,
    description text,
    pipeline_id uuid,
    product_id uuid,
    owner_id uuid,
    success_message text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.form_endpoints OWNER TO postgres;

--
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    form_endpoint_id uuid NOT NULL,
    lead_id uuid,
    payload jsonb NOT NULL,
    dedupe_hash text NOT NULL,
    ip_hash text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.form_submissions OWNER TO postgres;

--
-- Name: lead_product_interests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lead_product_interests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lead_product_interests OWNER TO postgres;

--
-- Name: lead_stage_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lead_stage_history (
    id bigint NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    from_stage_id uuid,
    to_stage_id uuid,
    from_stage_type public.stage_type,
    to_stage_type public.stage_type NOT NULL,
    actor_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lead_stage_history OWNER TO postgres;

--
-- Name: lead_stage_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lead_stage_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lead_stage_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lead_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lead_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lead_tags OWNER TO postgres;

--
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    pipeline_id uuid NOT NULL,
    stage_id uuid NOT NULL,
    "position" numeric DEFAULT 0 NOT NULL,
    name text NOT NULL,
    social_name text,
    phone text,
    phone_normalized text,
    email text,
    email_normalized text,
    city text,
    state text,
    contact_preference text,
    channel public.lead_channel DEFAULT 'manual'::public.lead_channel NOT NULL,
    source_detail text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    external_campaign text,
    external_ad text,
    external_form text,
    owner_id uuid,
    potential_value numeric(12,2),
    next_action text,
    first_contact_at timestamp with time zone,
    engaged_at timestamp with time zone,
    lost_reason_id uuid,
    lost_note text,
    lost_at timestamp with time zone,
    reactivated_count integer DEFAULT 0 NOT NULL,
    notes_summary text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT leads_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 160))),
    CONSTRAINT leads_potential_value_check CHECK (((potential_value IS NULL) OR (potential_value >= (0)::numeric))),
    CONSTRAINT leads_state_check CHECK (((state IS NULL) OR (char_length(state) <= 2)))
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- Name: lost_reasons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lost_reasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    label text NOT NULL,
    "position" numeric DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lost_reasons_label_check CHECK (((char_length(label) >= 1) AND (char_length(label) <= 120)))
);


ALTER TABLE public.lost_reasons OWNER TO postgres;

--
-- Name: message_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_attachments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    message_id uuid NOT NULL,
    media_type text NOT NULL,
    storage_path text,
    external_url text,
    byte_size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.message_attachments OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    provider public.channel_provider NOT NULL,
    external_message_id text,
    direction public.message_direction NOT NULL,
    status public.message_status DEFAULT 'sent'::public.message_status NOT NULL,
    sender_external_id text,
    body text,
    media_type text,
    media_url text,
    sent_by uuid,
    error text,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    author_id uuid NOT NULL,
    body text NOT NULL,
    visibility public.note_visibility DEFAULT 'team'::public.note_visibility NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT notes_body_check CHECK (((char_length(body) >= 1) AND (char_length(body) <= 8000)))
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    product_id uuid NOT NULL,
    status public.opportunity_status DEFAULT 'open'::public.opportunity_status NOT NULL,
    potential_value numeric(12,2),
    sold_value numeric(12,2),
    payment_method text,
    closed_at timestamp with time zone,
    lost_reason_id uuid,
    notes text,
    owner_id uuid,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT opportunities_potential_value_check CHECK (((potential_value IS NULL) OR (potential_value >= (0)::numeric))),
    CONSTRAINT opportunities_sold_value_check CHECK (((sold_value IS NULL) OR (sold_value >= (0)::numeric)))
);


ALTER TABLE public.opportunities OWNER TO postgres;

--
-- Name: outbox_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outbox_messages (
    id bigint NOT NULL,
    workspace_id uuid NOT NULL,
    message_id uuid,
    provider public.channel_provider NOT NULL,
    payload jsonb NOT NULL,
    status public.outbox_status DEFAULT 'pending'::public.outbox_status NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    next_retry_at timestamp with time zone DEFAULT now() NOT NULL,
    last_error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.outbox_messages OWNER TO postgres;

--
-- Name: outbox_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.outbox_messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.outbox_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pipeline_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pipeline_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    pipeline_id uuid NOT NULL,
    name text NOT NULL,
    stage_type public.stage_type DEFAULT 'custom'::public.stage_type NOT NULL,
    "position" numeric DEFAULT 0 NOT NULL,
    archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT pipeline_stages_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 80)))
);


ALTER TABLE public.pipeline_stages OWNER TO postgres;

--
-- Name: pipelines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pipelines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    "position" numeric DEFAULT 0 NOT NULL,
    archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT pipelines_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 120)))
);


ALTER TABLE public.pipelines OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    name text NOT NULL,
    category text DEFAULT 'outro'::text NOT NULL,
    description text,
    default_price numeric(12,2),
    is_active boolean DEFAULT true NOT NULL,
    default_pipeline_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT products_default_price_check CHECK (((default_price IS NULL) OR (default_price >= (0)::numeric))),
    CONSTRAINT products_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 120)))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: scheduled_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scheduled_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    lead_id uuid,
    body text NOT NULL,
    scheduled_for timestamp with time zone NOT NULL,
    status public.scheduled_message_status DEFAULT 'pending'::public.scheduled_message_status NOT NULL,
    sent_at timestamp with time zone,
    message_id uuid,
    error text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    max_delay_minutes integer DEFAULT 240 NOT NULL,
    CONSTRAINT scheduled_messages_body_check CHECK (((char_length(btrim(body)) >= 1) AND (char_length(btrim(body)) <= 4000))),
    CONSTRAINT scheduled_messages_max_delay_minutes_check CHECK (((max_delay_minutes >= 5) AND (max_delay_minutes <= 10080)))
);


ALTER TABLE public.scheduled_messages OWNER TO postgres;

--
-- Name: COLUMN scheduled_messages.max_delay_minutes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.scheduled_messages.max_delay_minutes IS 'Atraso máximo aceitável no despacho (padrão 4h). Passado disso, não envia.';


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT tags_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 60)))
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    title text NOT NULL,
    due_at timestamp with time zone,
    completed_at timestamp with time zone,
    assigned_to uuid,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT tasks_title_check CHECK (((char_length(title) >= 1) AND (char_length(title) <= 300)))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: webhook_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.webhook_events (
    id bigint NOT NULL,
    workspace_id uuid,
    provider public.channel_provider NOT NULL,
    external_event_id text NOT NULL,
    status public.webhook_status DEFAULT 'received'::public.webhook_status NOT NULL,
    payload jsonb NOT NULL,
    error text,
    received_at timestamp with time zone DEFAULT now() NOT NULL,
    processed_at timestamp with time zone
);


ALTER TABLE public.webhook_events OWNER TO postgres;

--
-- Name: webhook_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.webhook_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.webhook_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: workspace_branding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspace_branding (
    workspace_id uuid NOT NULL,
    display_name text,
    logo_url text,
    icon_url text,
    brand_tokens jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workspace_branding OWNER TO postgres;

--
-- Name: workspace_invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspace_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    email extensions.citext NOT NULL,
    role public.member_role DEFAULT 'assistant'::public.member_role NOT NULL,
    token_hash text NOT NULL,
    status public.invitation_status DEFAULT 'pending'::public.invitation_status NOT NULL,
    invited_by uuid NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    accepted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workspace_invitations OWNER TO postgres;

--
-- Name: workspace_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspace_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role public.member_role DEFAULT 'assistant'::public.member_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workspace_members OWNER TO postgres;

--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    timezone text DEFAULT 'America/Campo_Grande'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT workspaces_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 120)))
);


ALTER TABLE public.workspaces OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_12; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_08_12 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_12 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_13; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_08_13 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_13 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_14; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_08_14 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_14 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_15; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_08_15 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_15 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_16; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_08_16 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_16 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_17; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_08_17 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_17 OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
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
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_realtime_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_realtime_admin
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
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


ALTER TABLE supabase_functions.hooks OWNER TO supabase_functions_admin;

--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE supabase_functions.hooks_id_seq OWNER TO supabase_functions_admin;

--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supabase_functions.migrations OWNER TO supabase_functions_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: messages_2026_08_12; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_12 FOR VALUES FROM ('2026-08-12 00:00:00') TO ('2026-08-13 00:00:00');


--
-- Name: messages_2026_08_13; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_13 FOR VALUES FROM ('2026-08-13 00:00:00') TO ('2026-08-14 00:00:00');


--
-- Name: messages_2026_08_14; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_14 FOR VALUES FROM ('2026-08-14 00:00:00') TO ('2026-08-15 00:00:00');


--
-- Name: messages_2026_08_15; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_15 FOR VALUES FROM ('2026-08-15 00:00:00') TO ('2026-08-16 00:00:00');


--
-- Name: messages_2026_08_16; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_16 FOR VALUES FROM ('2026-08-16 00:00:00') TO ('2026-08-17 00:00:00');


--
-- Name: messages_2026_08_17; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_17 FOR VALUES FROM ('2026-08-17 00:00:00') TO ('2026-08-18 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
25ccc79e-da4f-4f91-9e58-8112a99584d5	postgres_cdc_rls	{"region": "us-east-1", "db_host": "5HUdnaUc1A2xEJvSiF4Xwwux60uALNd6M/qohfwdwHM=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2026-08-13 15:53:38	2026-08-13 15:53:38
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.feature_flags (id, name, enabled, inserted_at, updated_at, rollout_percentage, bucket_key) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2026-08-13 15:53:25
20220329161857	2026-08-13 15:53:25
20220410212326	2026-08-13 15:53:25
20220506102948	2026-08-13 15:53:25
20220527210857	2026-08-13 15:53:25
20220815211129	2026-08-13 15:53:25
20220815215024	2026-08-13 15:53:25
20220818141501	2026-08-13 15:53:25
20221018173709	2026-08-13 15:53:25
20221102172703	2026-08-13 15:53:25
20221223010058	2026-08-13 15:53:25
20230110180046	2026-08-13 15:53:25
20230810220907	2026-08-13 15:53:25
20230810220924	2026-08-13 15:53:25
20231024094642	2026-08-13 15:53:25
20240306114423	2026-08-13 15:53:25
20240418082835	2026-08-13 15:53:25
20240625211759	2026-08-13 15:53:25
20240704172020	2026-08-13 15:53:25
20240902173232	2026-08-13 15:53:25
20241106103258	2026-08-13 15:53:25
20250424203323	2026-08-13 15:53:25
20250613072131	2026-08-13 15:53:25
20250711044927	2026-08-13 15:53:25
20250811121559	2026-08-13 15:53:25
20250926223044	2026-08-13 15:53:25
20251204170944	2026-08-13 15:53:25
20251218000543	2026-08-13 15:53:25
20260209232800	2026-08-13 15:53:25
20260304000000	2026-08-13 15:53:25
20260422000000	2026-08-13 15:53:25
20260709151810	2026-08-13 15:53:25
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only, migrations_ran, broadcast_adapter, max_presence_events_per_second, max_payload_size_in_kb, max_client_presence_events_per_window, client_presence_window_ms, presence_enabled, feature_flags) FROM stdin;
8ab966d9-deae-4b57-ad5b-1a282510f6c5	realtime-dev	realtime-dev	iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==	200	2026-08-13 15:53:38	2026-08-13 15:53:38	100	postgres_cdc_rls	100000	100	100	f	{"keys": [{"x": "M5Sjqn5zwC9Kl1zVfUUGvv9boQjCGd45G8sdopBExB4", "y": "P6IXMvA2WYXSHSOMTBH2jsw_9rrzGy89FjPf6oOsIxQ", "alg": "ES256", "crv": "P-256", "ext": true, "kid": "b81269f1-21d8-4f2e-b719-c2240a840d90", "kty": "EC", "use": "sig", "key_ops": ["verify"]}, {"k": "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw", "kty": "oct"}]}	f	f	81	gen_rpc	1000	3000	\N	\N	f	{}
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	55fb0ebb-b502-469a-97c7-6ed65815fe7e	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:03:21.651755+00	
00000000-0000-0000-0000-000000000000	797b4915-a093-4c7f-8d59-b1c43fa4c7b1	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.340238+00	
00000000-0000-0000-0000-000000000000	6c24c0d3-67d4-4b5b-9f40-b19c8a92a455	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.342908+00	
00000000-0000-0000-0000-000000000000	9fccb8f8-22da-425e-b3ad-fac234698658	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.343796+00	
00000000-0000-0000-0000-000000000000	ce8d50b8-95c1-4b45-8141-735a1742bb6a	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.345413+00	
00000000-0000-0000-0000-000000000000	e30c7e09-4325-401d-9d52-1d60b0f73956	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.34694+00	
00000000-0000-0000-0000-000000000000	0dbe59ec-d024-45c8-ae67-897e53d7314c	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.347618+00	
00000000-0000-0000-0000-000000000000	bd678fdc-adee-4329-953c-be103ce02262	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.350571+00	
00000000-0000-0000-0000-000000000000	70e2be1b-4ca7-4c50-8a88-9e7f15537fb7	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.352353+00	
00000000-0000-0000-0000-000000000000	84d6fb17-310f-448c-a58a-130a9493dfc4	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.351794+00	
00000000-0000-0000-0000-000000000000	8f82dbce-5503-4e04-8e43-c83faf77f142	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.352046+00	
00000000-0000-0000-0000-000000000000	45d63092-20e9-4fa6-afdc-b489b0b5a75d	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.360336+00	
00000000-0000-0000-0000-000000000000	96cf7f5c-eac5-473e-b213-9bea5711c387	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:10:22.359781+00	
00000000-0000-0000-0000-000000000000	d2eaf55c-6388-46ca-9a77-c78f72e5e1da	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.660427+00	
00000000-0000-0000-0000-000000000000	7c738b59-f28a-4ff8-ad2b-c4be9aa237bb	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.660176+00	
00000000-0000-0000-0000-000000000000	6e2a95bd-06bb-4c17-aff4-c3aa5ffc28a3	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.668872+00	
00000000-0000-0000-0000-000000000000	22b8d2f3-73d7-4f3a-92cd-c249a44e4c92	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.668935+00	
00000000-0000-0000-0000-000000000000	a1a39694-8471-4def-9d0f-28746c73b6b7	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.672724+00	
00000000-0000-0000-0000-000000000000	ba020cf3-5afd-4c30-8b69-ab1df1aae0e1	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.673122+00	
00000000-0000-0000-0000-000000000000	1130f466-e0ed-4ae0-a0cf-ac004fec315b	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.671092+00	
00000000-0000-0000-0000-000000000000	dec9215d-0d44-47c7-a0d9-2ae75c939b56	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.67368+00	
00000000-0000-0000-0000-000000000000	c5fbfafe-a6ed-4d31-ab16-7628417f9f7b	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.676115+00	
00000000-0000-0000-0000-000000000000	fecef635-2754-467b-b370-e5db1380c4f5	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.67995+00	
00000000-0000-0000-0000-000000000000	61b1fd53-7f9f-4cb5-b7e8-63ed1c88b970	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.680379+00	
00000000-0000-0000-0000-000000000000	862dd713-ec29-4d0c-a840-715873eafc68	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:09.682515+00	
00000000-0000-0000-0000-000000000000	7ba3b39a-6948-4fb7-98ff-4c49e1250132	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:23.104115+00	
00000000-0000-0000-0000-000000000000	1e083717-d973-4b35-940c-7a6c0a20e316	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:24.94682+00	
00000000-0000-0000-0000-000000000000	3bdbda53-4755-4c11-a1dc-e27593d1863d	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:26.505811+00	
00000000-0000-0000-0000-000000000000	baccce13-9cf9-4958-afe1-749319105d02	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:28.386081+00	
00000000-0000-0000-0000-000000000000	d77a2a85-b2ee-4b5c-a8f3-b996313cfdc5	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:44.093069+00	
00000000-0000-0000-0000-000000000000	0a195a8d-1423-4b58-b091-c98f9ad0901c	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:49:44.938585+00	
00000000-0000-0000-0000-000000000000	fb38fa53-d6c2-4dfd-bbee-244cccec7d3b	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:50:01.456514+00	
00000000-0000-0000-0000-000000000000	5249ab3d-ce10-48c1-9df8-a2be7cf839c7	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:50:28.198218+00	
00000000-0000-0000-0000-000000000000	aca3038d-08d0-45f0-bf81-30707e3e9975	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:12.757187+00	
00000000-0000-0000-0000-000000000000	5ba75e07-d39c-4006-b5a9-51ff06be0b26	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:14.13594+00	
00000000-0000-0000-0000-000000000000	10b72e02-c0e3-4a4d-85dd-9dfcfa9ef185	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:30.796669+00	
00000000-0000-0000-0000-000000000000	f632245f-4ac0-48dd-813e-208e600ef6ca	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:33.100108+00	
00000000-0000-0000-0000-000000000000	12985634-2466-4e0e-9a96-3f11ad77e839	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:38.070621+00	
00000000-0000-0000-0000-000000000000	e79083d8-c1e9-4303-8d22-7fa7f9ab0853	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:38.943358+00	
00000000-0000-0000-0000-000000000000	fd9cb010-e23d-4eb7-a1bb-3b431354e20a	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:41.00247+00	
00000000-0000-0000-0000-000000000000	bf9ed3c1-c2c9-436c-b5fe-13fc22049f71	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:52:52.808836+00	
00000000-0000-0000-0000-000000000000	c7083657-e0ef-4f25-9452-e1ff1aaabd47	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:26.679161+00	
00000000-0000-0000-0000-000000000000	f0653df0-0991-474b-bcbd-a7a53a9d6778	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:28.145424+00	
00000000-0000-0000-0000-000000000000	7ed889e1-d558-4fb9-9c65-7b580449056c	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:29.791155+00	
00000000-0000-0000-0000-000000000000	15257297-26a1-4637-95c1-600c16745855	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:31.885263+00	
00000000-0000-0000-0000-000000000000	42cc0f5f-84e3-4b1a-ba17-a057cd2c6740	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:36.855773+00	
00000000-0000-0000-0000-000000000000	d78371be-58e2-4885-96bf-e11f9029905e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:37.714302+00	
00000000-0000-0000-0000-000000000000	3470262e-96e6-4d83-a6df-a38d948d14f9	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:39.599312+00	
00000000-0000-0000-0000-000000000000	c57c7f80-c602-4916-b076-68d920b65179	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:53:53.150892+00	
00000000-0000-0000-0000-000000000000	461400df-49cc-4116-94b5-07e3cc4dc123	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:12.468265+00	
00000000-0000-0000-0000-000000000000	7348468f-458c-4fc0-be31-bb359b5d5b87	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:13.67096+00	
00000000-0000-0000-0000-000000000000	c30c7818-fd35-41cf-9737-b95eab971633	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:15.409623+00	
00000000-0000-0000-0000-000000000000	23a3249b-4204-446e-8d48-4bdc3f9e6a66	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:17.471556+00	
00000000-0000-0000-0000-000000000000	1ededf51-86ff-452a-8838-fd7a7fa25a17	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:22.204402+00	
00000000-0000-0000-0000-000000000000	14a45fe0-c7e6-43f8-b6fa-4307c28e376e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:23.01842+00	
00000000-0000-0000-0000-000000000000	b26a3807-bcb4-44be-92b6-8bf37ac0bd96	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:54:24.989409+00	
00000000-0000-0000-0000-000000000000	5a40357e-6374-42c0-9ef6-42f74979327d	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.915393+00	
00000000-0000-0000-0000-000000000000	ad0673aa-83ef-458f-aec1-4096a0d5cbea	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.915506+00	
00000000-0000-0000-0000-000000000000	ea9a8ef1-2ca8-44a3-8f68-b10952459844	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.915447+00	
00000000-0000-0000-0000-000000000000	38548086-b528-4ac3-ad34-10a736674c12	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.911607+00	
00000000-0000-0000-0000-000000000000	a29387b0-77cd-4373-81e2-eef9c5586683	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.912884+00	
00000000-0000-0000-0000-000000000000	8d62536d-536e-4cc4-b8ac-17e8afa90d0a	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.919882+00	
00000000-0000-0000-0000-000000000000	936cf0fd-76e1-40e0-aaf8-fa532124b682	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.919867+00	
00000000-0000-0000-0000-000000000000	ddf53600-e922-44c2-a005-74e4671d0031	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.925598+00	
00000000-0000-0000-0000-000000000000	b2a956f1-1836-4959-b916-c8e29d63d9f3	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.926672+00	
00000000-0000-0000-0000-000000000000	eddf839f-0b80-46d8-9293-6d4c0356af9f	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.926502+00	
00000000-0000-0000-0000-000000000000	ee91721f-ed80-465d-b7ae-1853ac61c633	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.927611+00	
00000000-0000-0000-0000-000000000000	77382037-4eba-4fe2-ada0-2b88bf1aa874	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 16:56:48.92933+00	
00000000-0000-0000-0000-000000000000	46750728-d2b4-4f20-b3d8-a2d76d17e5c9	{"action":"token_refreshed","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"token"}	2026-08-13 17:01:59.028883+00	
00000000-0000-0000-0000-000000000000	f1634544-18d3-43ed-ba3d-e33f69429015	{"action":"token_revoked","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"token"}	2026-08-13 17:01:59.029494+00	
00000000-0000-0000-0000-000000000000	624228ce-9ae8-46da-b677-6cc7c3610cab	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.554618+00	
00000000-0000-0000-0000-000000000000	6a0f3cf2-8151-4162-91d1-15db2f97c3b1	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.580132+00	
00000000-0000-0000-0000-000000000000	b86b0b79-e7f3-48b5-908b-79996aa15d2e	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.581186+00	
00000000-0000-0000-0000-000000000000	e01cf686-1b4f-48d9-8b40-cd98b3103a76	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.610377+00	
00000000-0000-0000-0000-000000000000	6bdb0e5e-0256-48f2-b37b-2b148639595e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.628879+00	
00000000-0000-0000-0000-000000000000	44d2e2ba-7cd1-450d-8999-7408f6f292cb	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.645347+00	
00000000-0000-0000-0000-000000000000	f477d30c-6143-4c25-b495-83e6db81784e	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.653545+00	
00000000-0000-0000-0000-000000000000	cd92f06f-92a1-4e60-bae8-047d792c5986	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.665429+00	
00000000-0000-0000-0000-000000000000	c585a268-948f-4912-aa88-1b199f8f127d	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.673347+00	
00000000-0000-0000-0000-000000000000	6907092a-f1c3-4425-986c-abc8bc8b24e6	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.685723+00	
00000000-0000-0000-0000-000000000000	7c45eb3a-772a-40f6-8c5f-077553f2a7b7	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.682219+00	
00000000-0000-0000-0000-000000000000	20471236-47e0-4526-826d-4644881e9bab	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:23:13.693625+00	
00000000-0000-0000-0000-000000000000	538eac9f-8959-41bd-b90e-a1bbf3e26c57	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 17:26:05.573144+00	
00000000-0000-0000-0000-000000000000	0cd2d149-e57e-4cd5-90b4-0ab38e0d94c5	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.009494+00	
00000000-0000-0000-0000-000000000000	fc6b77e8-cfe1-44e4-8f72-76f361e72d9e	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.010965+00	
00000000-0000-0000-0000-000000000000	302595db-1d22-49a6-9e65-ffb78fcd47a2	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.011077+00	
00000000-0000-0000-0000-000000000000	98f7400a-f0de-4ea9-8927-9e955f64ede3	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.010888+00	
00000000-0000-0000-0000-000000000000	42785e06-9615-4637-83e5-bd6db8f6ef02	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.03024+00	
00000000-0000-0000-0000-000000000000	bb2ac514-a631-4982-b84d-0fb552df769f	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.03234+00	
00000000-0000-0000-0000-000000000000	732be233-ad88-4d89-ab62-15f33bb52b8e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.032554+00	
00000000-0000-0000-0000-000000000000	8e7da449-b8e6-41ee-9347-07413005a743	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.037584+00	
00000000-0000-0000-0000-000000000000	58108faf-146f-4c23-88f2-0c7db386de71	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.036229+00	
00000000-0000-0000-0000-000000000000	74eeb7ae-b932-414d-8941-c9402feb6b26	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.038226+00	
00000000-0000-0000-0000-000000000000	dfe09a42-4fe0-49d7-af4e-6e905aeb70f7	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.041142+00	
00000000-0000-0000-0000-000000000000	7759351b-d046-4a1a-8e3a-d5bd19ad39bc	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:17:44.063666+00	
00000000-0000-0000-0000-000000000000	f74fd7ba-a59a-46df-8995-b2c742813bf8	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:14.991725+00	
00000000-0000-0000-0000-000000000000	fa4bded3-6b46-44cb-9a53-7c3acc9690e8	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:14.994471+00	
00000000-0000-0000-0000-000000000000	09883192-0c40-45ac-a21e-a90c947b1281	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:14.997327+00	
00000000-0000-0000-0000-000000000000	80b37a68-6c57-4aa4-b8bf-668e14bd649d	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:14.998399+00	
00000000-0000-0000-0000-000000000000	1690e41f-71e5-478b-8e94-8c28a82f4ec0	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.00126+00	
00000000-0000-0000-0000-000000000000	9864087c-a707-41e3-91b6-2dbeee34f78b	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.001507+00	
00000000-0000-0000-0000-000000000000	8ddb6de5-8fe5-4091-8eaa-99e1db33936a	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.005564+00	
00000000-0000-0000-0000-000000000000	ea254e4d-1c4a-4521-a4ab-95278d714b10	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.006942+00	
00000000-0000-0000-0000-000000000000	2367779a-a614-4227-b083-0b8e898ecd62	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.007134+00	
00000000-0000-0000-0000-000000000000	8611c207-fbdf-46c7-9cd0-f8f44081c361	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.008284+00	
00000000-0000-0000-0000-000000000000	474cfd69-3837-4cb5-90ec-d04367bd155f	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.01496+00	
00000000-0000-0000-0000-000000000000	3311fdea-f9cd-47ec-80d1-4249d199af2a	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:19:15.020432+00	
00000000-0000-0000-0000-000000000000	c1ecf9fa-4c82-4771-af9b-a42e0183d997	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.298132+00	
00000000-0000-0000-0000-000000000000	ff5bae2f-f669-4c9d-9ae9-0e55f2dd6e26	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.300641+00	
00000000-0000-0000-0000-000000000000	72d15e54-0e79-4678-aa19-8fb01c72c4fc	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.31012+00	
00000000-0000-0000-0000-000000000000	7d192938-b310-4b38-8a08-c384508bfb66	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.310214+00	
00000000-0000-0000-0000-000000000000	a0f32643-0e99-4b91-addf-8d85596fe487	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.309951+00	
00000000-0000-0000-0000-000000000000	cfab0441-660a-4b87-9409-1f82e9483c46	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.306898+00	
00000000-0000-0000-0000-000000000000	6feecae2-242d-4f54-a490-580b99ef72d6	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.30974+00	
00000000-0000-0000-0000-000000000000	c9e68800-0c1e-4756-82ab-3e1e93ca2248	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.314434+00	
00000000-0000-0000-0000-000000000000	c79eb250-ce68-4113-a77d-2d1dab03a190	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.314241+00	
00000000-0000-0000-0000-000000000000	f877266c-dbdd-4ab2-a502-95f8403592f9	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.315538+00	
00000000-0000-0000-0000-000000000000	ed81c036-896b-4126-9fcb-5a46995069b7	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.315745+00	
00000000-0000-0000-0000-000000000000	b7026ad3-4446-4c5a-9583-768811ecd56a	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 18:20:04.324344+00	
00000000-0000-0000-0000-000000000000	df6acf28-9cd8-40c0-a659-ae1af23e0a92	{"action":"token_refreshed","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"token"}	2026-08-13 19:06:09.390798+00	
00000000-0000-0000-0000-000000000000	e6301e67-ac5d-405a-80bb-0da60ffcce31	{"action":"token_revoked","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"token"}	2026-08-13 19:06:09.392352+00	
00000000-0000-0000-0000-000000000000	32473717-6c77-428c-a795-90ed7f35ff69	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.653413+00	
00000000-0000-0000-0000-000000000000	eb1dfdd0-bf8b-4169-998e-6be02c7a11d8	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.669144+00	
00000000-0000-0000-0000-000000000000	43f2a859-18d8-4e5e-814b-3b83f2229923	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.670893+00	
00000000-0000-0000-0000-000000000000	5ac6f689-0947-4c51-96ea-f39b9e613d54	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.67085+00	
00000000-0000-0000-0000-000000000000	a6e593aa-10c0-49c5-8d8f-04de78bba6d3	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.672439+00	
00000000-0000-0000-0000-000000000000	fa1ca9c2-99e7-4376-a8c1-864b84347a09	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.673721+00	
00000000-0000-0000-0000-000000000000	a249de5c-a4f5-42cd-8614-27adf5a64c5f	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.678528+00	
00000000-0000-0000-0000-000000000000	bf4b2482-82ef-4750-a17d-969aaaf478c6	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.684902+00	
00000000-0000-0000-0000-000000000000	281d154d-6652-472d-8d7a-283f793aec39	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.684873+00	
00000000-0000-0000-0000-000000000000	6f6469bb-b3e1-45cc-8e58-5a9a5aa1091f	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.681848+00	
00000000-0000-0000-0000-000000000000	7162d1a6-c8bf-4439-829e-86117f94705a	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.686018+00	
00000000-0000-0000-0000-000000000000	32c079fe-3eda-4615-84c3-fbdd32b47adb	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:06:53.69013+00	
00000000-0000-0000-0000-000000000000	4a7b000e-70a6-4136-a7ed-d44a81dd7afd	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.688434+00	
00000000-0000-0000-0000-000000000000	e00186db-51c7-409d-a2fa-7f88b944c36f	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.689828+00	
00000000-0000-0000-0000-000000000000	9172d5a8-6cb3-4a9d-97fa-3d434bbcaeeb	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.69336+00	
00000000-0000-0000-0000-000000000000	ce3030cd-50e8-40d6-ab6b-bd160aa28d1b	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.693291+00	
00000000-0000-0000-0000-000000000000	120db9bc-e34e-43f4-8aef-c0a9a3b5521c	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.699583+00	
00000000-0000-0000-0000-000000000000	50731650-6d15-42a1-8457-61bda54d471b	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.69928+00	
00000000-0000-0000-0000-000000000000	49db3889-29a6-4655-8d09-ea0b97ea243a	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.703011+00	
00000000-0000-0000-0000-000000000000	5e2487f2-355d-4dbf-81c4-21d120bf5baf	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.704044+00	
00000000-0000-0000-0000-000000000000	8685a4bd-3bf0-481a-822f-87aa0fc22437	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.703874+00	
00000000-0000-0000-0000-000000000000	47a68125-a2dd-4a6a-b885-80117db553ec	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.706261+00	
00000000-0000-0000-0000-000000000000	87e854ca-233b-4ed0-acf4-60c790c94ca1	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.706972+00	
00000000-0000-0000-0000-000000000000	d3a5059f-6503-4423-82d2-2490ef92340a	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:09:34.707867+00	
00000000-0000-0000-0000-000000000000	e953fca2-007c-4de0-8593-e9e36595e974	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:41:13.130019+00	
00000000-0000-0000-0000-000000000000	59f955a4-c7fc-48eb-bd3c-f326b292f316	{"action":"logout","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account"}	2026-08-13 19:42:36.206195+00	
00000000-0000-0000-0000-000000000000	b3aedc48-0845-4e5e-a0af-b6cd49d02937	{"action":"user_signedup","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-13 19:42:51.959446+00	
00000000-0000-0000-0000-000000000000	36f1d0d8-f259-4eab-a342-cae63b53c272	{"action":"login","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 19:42:51.964339+00	
00000000-0000-0000-0000-000000000000	e11927ba-435e-4d96-b9ac-a2ad45b9177b	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 20:41:25.100878+00	
00000000-0000-0000-0000-000000000000	691f5cd6-1775-4f19-8804-3b2dbe36ad7e	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 20:41:25.10152+00	
00000000-0000-0000-0000-000000000000	ac0f8244-6a29-40cc-a4a9-f20457b4e2bf	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 21:40:21.11461+00	
00000000-0000-0000-0000-000000000000	6cd11827-8ea2-43ed-9daa-567ff96aa54d	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 21:40:21.115191+00	
00000000-0000-0000-0000-000000000000	3d9c02ee-7836-4298-a366-22b1d335de3d	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 22:36:10.431958+00	
00000000-0000-0000-0000-000000000000	f347340b-59ea-460a-8968-eabf7313f694	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 22:41:46.606817+00	
00000000-0000-0000-0000-000000000000	0dc0a070-ad92-442c-bc32-3505c6d98a31	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 22:41:46.607952+00	
00000000-0000-0000-0000-000000000000	0063aaf0-e23b-4cfb-9684-54b602ab0503	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 22:47:57.282391+00	
00000000-0000-0000-0000-000000000000	3abc3450-2cc8-495f-938b-6b5ce595af64	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 22:57:13.616347+00	
00000000-0000-0000-0000-000000000000	5a978c1e-5756-4607-a97b-f91ac069e027	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:29:09.601768+00	
00000000-0000-0000-0000-000000000000	8b77ff0e-d2ca-4b41-a0b4-eb36bbe217fe	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.779822+00	
00000000-0000-0000-0000-000000000000	ed9e80a3-a1ff-4bb6-a28e-f2fba5ec0890	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.780584+00	
00000000-0000-0000-0000-000000000000	667308f7-5170-40d6-a852-10125b7c6ef7	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.782375+00	
00000000-0000-0000-0000-000000000000	96c71d99-d9fc-4c7f-973e-cdf0a122fb4d	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.780438+00	
00000000-0000-0000-0000-000000000000	933f9515-d152-4da9-8eee-8c76ca84a19c	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.786661+00	
00000000-0000-0000-0000-000000000000	d3931a1e-025b-4991-b1b6-a93ab5b1bbbf	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.788033+00	
00000000-0000-0000-0000-000000000000	b156c42f-ce1f-49e9-aa00-2d1f3dc266e8	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.791538+00	
00000000-0000-0000-0000-000000000000	25e01a33-03a6-40be-ad66-32f41737b0ac	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.792783+00	
00000000-0000-0000-0000-000000000000	1779d1b4-d727-4905-94b5-8ea768064a3e	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.794482+00	
00000000-0000-0000-0000-000000000000	5aaeeced-ac32-4f7e-bb36-88e26b5d11fa	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.804022+00	
00000000-0000-0000-0000-000000000000	d71c195d-213a-4e2e-be81-0631882096e8	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.80701+00	
00000000-0000-0000-0000-000000000000	f5edc585-e756-4d28-a686-01abf8135887	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:35:53.820618+00	
00000000-0000-0000-0000-000000000000	71a6f645-5a75-49c2-9ff2-29e538b98d19	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.513406+00	
00000000-0000-0000-0000-000000000000	c44bff97-ce11-44c3-8d2b-43ac1248091f	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.519592+00	
00000000-0000-0000-0000-000000000000	46ed0fae-b9b7-4156-a88f-62cbc00882ee	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.518749+00	
00000000-0000-0000-0000-000000000000	4f913452-e153-4deb-8969-0d05abcc99e9	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.527324+00	
00000000-0000-0000-0000-000000000000	3ab946ea-14ce-400f-a6e9-e6047efe652c	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.527311+00	
00000000-0000-0000-0000-000000000000	d1f75ae5-181f-456a-b0bc-18ffef3b0042	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.528862+00	
00000000-0000-0000-0000-000000000000	548c34f4-012a-4cff-ab84-748957f1c36f	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.529773+00	
00000000-0000-0000-0000-000000000000	8cbb6807-46cc-4119-994c-2f1aacbf7574	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.529655+00	
00000000-0000-0000-0000-000000000000	314bdfdf-1ad8-46ff-b8fb-71851ccb8b00	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.531175+00	
00000000-0000-0000-0000-000000000000	ef7ddd2f-aa07-4147-ad43-af8c160554e9	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.534354+00	
00000000-0000-0000-0000-000000000000	defa5129-ef28-4254-9aa3-b43686d7b529	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.536996+00	
00000000-0000-0000-0000-000000000000	d0b6f037-e435-4eca-af34-6fcd0964293f	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:36:18.547041+00	
00000000-0000-0000-0000-000000000000	22ccba6b-7eee-4b2c-b1e8-fa1fd382aa42	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.563513+00	
00000000-0000-0000-0000-000000000000	269f09ab-d765-460a-9c09-19192fde086b	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.570084+00	
00000000-0000-0000-0000-000000000000	84867adc-c369-4220-8e6d-055a8094ef7e	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.572523+00	
00000000-0000-0000-0000-000000000000	d03f44c1-17e7-4f8b-85cb-d5928f76b4aa	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.574451+00	
00000000-0000-0000-0000-000000000000	6bc044bf-1578-4dab-ad49-cae67ad2d8fb	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.577622+00	
00000000-0000-0000-0000-000000000000	d074c204-47cc-4fe6-b37e-bb450d39c946	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.581327+00	
00000000-0000-0000-0000-000000000000	81e48316-33d8-4c76-a77d-cf7337666af3	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.659933+00	
00000000-0000-0000-0000-000000000000	1163394f-57ee-488c-adcf-c19eeb19b2e7	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.665274+00	
00000000-0000-0000-0000-000000000000	7823a8a2-f794-4cda-b23b-e0ee9d75b339	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.666761+00	
00000000-0000-0000-0000-000000000000	cafe5ab3-07e1-4e10-a24a-f055e615bc87	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.67015+00	
00000000-0000-0000-0000-000000000000	07d660a9-aa85-460e-8c21-feb0aa9f92e8	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.671046+00	
00000000-0000-0000-0000-000000000000	a1d83b9c-9d30-432d-8cc4-8453711fed42	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:38:46.674313+00	
00000000-0000-0000-0000-000000000000	d87e9671-4478-495c-8942-e1e5a0977ee4	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:13.967098+00	
00000000-0000-0000-0000-000000000000	b6bef6e0-59a2-4971-b342-d208e761746b	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:13.976396+00	
00000000-0000-0000-0000-000000000000	bb07179f-b3a5-4c35-9e85-e8c5d420b3dd	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:13.976443+00	
00000000-0000-0000-0000-000000000000	fd5fff72-d5b1-44b1-bf94-e4f84ffb43ee	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:13.979057+00	
00000000-0000-0000-0000-000000000000	fba771b9-ba3a-44a7-8d3c-32c798570c4e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:13.985364+00	
00000000-0000-0000-0000-000000000000	6931e6ac-495c-41b2-bbe0-ef23445a8ebb	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:13.987411+00	
00000000-0000-0000-0000-000000000000	f04910d5-cd46-4b3c-8cbb-cb7be0a4ac9e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:14.078069+00	
00000000-0000-0000-0000-000000000000	cbaea693-2a1e-4b70-932c-9039f20cb2a7	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:14.075366+00	
00000000-0000-0000-0000-000000000000	1dd396f5-df74-4006-a57a-a974c1283fba	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:14.083013+00	
00000000-0000-0000-0000-000000000000	528ee1f5-ec30-4ef8-a4a1-bc186254c3cf	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:14.094094+00	
00000000-0000-0000-0000-000000000000	c4654a75-a679-4b45-96e7-636f42a1ce6f	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:14.096126+00	
00000000-0000-0000-0000-000000000000	dce37e10-6f6e-415c-b6e0-adbfaf717a62	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:14.095951+00	
00000000-0000-0000-0000-000000000000	68e19073-5e13-4554-be81-81d0ae1394f3	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:39.955868+00	
00000000-0000-0000-0000-000000000000	582ab2f7-1968-47dc-87c8-3e7ed598b1aa	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:39.959851+00	
00000000-0000-0000-0000-000000000000	dd252f14-4e51-4cd9-8854-7d93d0aa4f62	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:39.95991+00	
00000000-0000-0000-0000-000000000000	07f1f277-55a8-483b-aef8-96f5704f87e3	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:39.960549+00	
00000000-0000-0000-0000-000000000000	f4560b13-3317-48b2-81b4-f95b8ff284fc	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:39.961383+00	
00000000-0000-0000-0000-000000000000	727dda44-8fdf-470b-b9d8-78ad88fadf97	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:39.962277+00	
00000000-0000-0000-0000-000000000000	4ac18147-4b5a-4c10-afb5-7e29e2b3c9a0	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:40.064615+00	
00000000-0000-0000-0000-000000000000	603f8a2d-0d3b-4649-b109-707f9868c497	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:40.06994+00	
00000000-0000-0000-0000-000000000000	91878165-de2c-40c0-8bac-baa6c00c7464	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:40.073619+00	
00000000-0000-0000-0000-000000000000	207f224b-897b-4d89-bc96-de8055a25277	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:40.07769+00	
00000000-0000-0000-0000-000000000000	8b8c2382-a466-4d00-85a6-35b197db3139	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:40.080628+00	
00000000-0000-0000-0000-000000000000	aa345a53-0f28-4fcd-bddc-a824ad650640	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:39:40.087898+00	
00000000-0000-0000-0000-000000000000	caf3a73f-b55c-48f9-93e8-d4f8461074ff	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 23:39:57.977727+00	
00000000-0000-0000-0000-000000000000	47f096b7-27bf-4a14-899a-deb18333ff39	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-13 23:39:57.978112+00	
00000000-0000-0000-0000-000000000000	f143df18-f61d-49ce-8565-45cdd36f7fe9	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.1823+00	
00000000-0000-0000-0000-000000000000	3b01e88b-764d-4784-a3de-cc0b09f3b276	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.187475+00	
00000000-0000-0000-0000-000000000000	4f9decb0-4bf7-44e8-93c8-7e37b5ea5bc2	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.188371+00	
00000000-0000-0000-0000-000000000000	efad9d7a-6585-4799-8e09-52f23c984692	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.257544+00	
00000000-0000-0000-0000-000000000000	f16f73a5-9f82-4391-ba22-7ceeaa898d01	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.269262+00	
00000000-0000-0000-0000-000000000000	1f1520ff-a02d-4e9f-9b09-0c39f22f9608	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.29519+00	
00000000-0000-0000-0000-000000000000	6f2cd9b1-87db-4dbe-aea8-23c28591a65f	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.362561+00	
00000000-0000-0000-0000-000000000000	a4a2a3d9-58f0-404a-959f-84904102f883	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.373244+00	
00000000-0000-0000-0000-000000000000	f44465cb-b0de-4c58-8f04-d263b0fe5fc6	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.377342+00	
00000000-0000-0000-0000-000000000000	6c913edd-599f-4d10-964e-eeb0375924ea	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.386569+00	
00000000-0000-0000-0000-000000000000	479982b3-83b2-4211-baea-36239512634f	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.389049+00	
00000000-0000-0000-0000-000000000000	5ecd21eb-b288-443d-aca7-b5f39d70c9e0	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:40:05.3898+00	
00000000-0000-0000-0000-000000000000	cc1c2dec-03ea-4a59-a19f-653514e89f8d	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.474822+00	
00000000-0000-0000-0000-000000000000	55e67dbf-1142-4ec3-be78-ed85da236128	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.481546+00	
00000000-0000-0000-0000-000000000000	1d2d5086-23f0-4281-8329-0dddb9176976	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.485124+00	
00000000-0000-0000-0000-000000000000	789c2e56-21b1-4722-8c09-a3dbcc16a6c9	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.485415+00	
00000000-0000-0000-0000-000000000000	017497ad-d43f-4041-a764-ddce49936fd9	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.487321+00	
00000000-0000-0000-0000-000000000000	e856cc75-a3da-46f4-bd9f-81f57743820c	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.48699+00	
00000000-0000-0000-0000-000000000000	df208b39-1654-47f8-961f-e0612bc07237	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.560763+00	
00000000-0000-0000-0000-000000000000	7403e78c-f4c6-430b-b766-f32b7d36f029	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.565558+00	
00000000-0000-0000-0000-000000000000	0085446a-5247-4b4d-8a39-156fceb3c787	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.566233+00	
00000000-0000-0000-0000-000000000000	1fb4849f-529e-4099-84dd-b9e2da0cd0a8	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.567364+00	
00000000-0000-0000-0000-000000000000	e10ff2a2-ab0a-4033-9f28-3e92befd9b53	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.568372+00	
00000000-0000-0000-0000-000000000000	2aa3ece1-1c83-4ad9-a838-2ceda272ba1a	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:42:41.576844+00	
00000000-0000-0000-0000-000000000000	3a03e5e9-d8f9-44ae-a09e-79f17e9ecd08	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.294112+00	
00000000-0000-0000-0000-000000000000	7d7091e3-7fa8-428b-806f-18def9a30771	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.294257+00	
00000000-0000-0000-0000-000000000000	ad47eaa8-9b42-4809-9c61-1f4a02c326f7	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.294823+00	
00000000-0000-0000-0000-000000000000	48d2c52a-a7cd-4df3-92b6-7f909960728e	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.298424+00	
00000000-0000-0000-0000-000000000000	731228f2-d02e-4c65-8bee-73e66a1f84cd	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.300367+00	
00000000-0000-0000-0000-000000000000	3ca8bb62-1c6e-45fc-95d0-20d78a060568	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.301063+00	
00000000-0000-0000-0000-000000000000	49466389-9e92-447f-9d45-56d3f9fa6bb1	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.370437+00	
00000000-0000-0000-0000-000000000000	f5a92d5d-3283-4def-8682-c8941afde5ba	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.375314+00	
00000000-0000-0000-0000-000000000000	9ca26418-b250-4089-ac5c-ca2f0d3a3c68	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.389392+00	
00000000-0000-0000-0000-000000000000	6404f983-24c1-4b6d-9066-3cfd87aa6ef6	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.390997+00	
00000000-0000-0000-0000-000000000000	fe62e4dd-d03a-463b-92a7-07dcb63bacdb	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.393629+00	
00000000-0000-0000-0000-000000000000	2383d279-569c-45c9-b35d-45315c3e68be	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:43:18.400401+00	
00000000-0000-0000-0000-000000000000	946c89bd-05b8-4418-8228-c53543d8f9da	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.42134+00	
00000000-0000-0000-0000-000000000000	cab33c5c-c7ee-4f5c-b896-d59110d6c1b4	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.425204+00	
00000000-0000-0000-0000-000000000000	72af8db1-fcf9-428c-920a-0f16014d5972	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.429417+00	
00000000-0000-0000-0000-000000000000	e83c52fd-15e3-460a-bdba-1764db428017	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.514299+00	
00000000-0000-0000-0000-000000000000	9f104c97-e4cb-4473-9998-d3d5662ceca8	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.516811+00	
00000000-0000-0000-0000-000000000000	e3a041c6-4dae-4900-bf2a-650ec01faa51	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.524941+00	
00000000-0000-0000-0000-000000000000	f20c51dc-851d-434a-9cb4-ee3ff7c4b385	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.530192+00	
00000000-0000-0000-0000-000000000000	f15d9432-9820-4475-8966-13f24b27e1e8	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.529935+00	
00000000-0000-0000-0000-000000000000	1d124b69-8d69-4dcc-a9e1-1ca74412c08f	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.533794+00	
00000000-0000-0000-0000-000000000000	fcc21c11-ef06-48c4-9b5a-5474cdc394af	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.538206+00	
00000000-0000-0000-0000-000000000000	f5c79fb6-17bd-43e0-b5e7-620ef572f785	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.538509+00	
00000000-0000-0000-0000-000000000000	0d9b6f80-d23a-47fd-9964-f204e65ad6bb	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:44:26.539625+00	
00000000-0000-0000-0000-000000000000	3d56b5f5-f4b5-49d5-9ee2-a72aedf443ec	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.206161+00	
00000000-0000-0000-0000-000000000000	6b171182-da37-4418-aa48-901515aa1b2c	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.205532+00	
00000000-0000-0000-0000-000000000000	6f557310-ad32-4d08-b607-ef5bded17fbf	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.205264+00	
00000000-0000-0000-0000-000000000000	421fcdd5-39bd-4bff-83f6-c0defc3ce309	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.343665+00	
00000000-0000-0000-0000-000000000000	ec746b3f-7c07-457e-bef2-6c57e9afedc2	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.343587+00	
00000000-0000-0000-0000-000000000000	7d1a499f-1bb3-48d4-8071-b60a9b21e8b3	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.344903+00	
00000000-0000-0000-0000-000000000000	d77c08a0-94cd-40e3-9135-be44c946d938	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.344852+00	
00000000-0000-0000-0000-000000000000	75354928-e91c-4739-8f32-1124f6b34d17	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.344681+00	
00000000-0000-0000-0000-000000000000	c02fdff9-3a7b-4d9b-9617-354ec8676be5	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.345984+00	
00000000-0000-0000-0000-000000000000	4850a3a5-6c3e-48e1-b01b-39e27e08b3cd	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.349142+00	
00000000-0000-0000-0000-000000000000	10eadbb4-636a-489f-bc76-da5493cec270	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.352099+00	
00000000-0000-0000-0000-000000000000	497d8d24-9695-4b48-bf9b-22001ed6cd07	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:18.356102+00	
00000000-0000-0000-0000-000000000000	d3e31219-3594-4eec-b12f-2852069aa0d4	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.668216+00	
00000000-0000-0000-0000-000000000000	26f7c0c8-1342-4da4-a34a-11ab966d25b9	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.669454+00	
00000000-0000-0000-0000-000000000000	6c835af8-fca3-431a-ac2f-e946a6781e1e	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.670115+00	
00000000-0000-0000-0000-000000000000	f7125b50-39eb-43b0-8c68-f66940882d5d	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.764053+00	
00000000-0000-0000-0000-000000000000	d8973254-5a7f-4d3f-bbfb-942e90fd6ac0	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.769488+00	
00000000-0000-0000-0000-000000000000	c0747e03-2566-4dc4-b0c6-aeedabad8af6	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.769832+00	
00000000-0000-0000-0000-000000000000	4f6ec0de-c67b-41c5-8fb0-6e111357ae10	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.769094+00	
00000000-0000-0000-0000-000000000000	655df554-7fb1-4c2b-a7ec-ee81c94200f3	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.770066+00	
00000000-0000-0000-0000-000000000000	45ea95b9-d156-48d2-90c6-2ed4c27d4752	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.770767+00	
00000000-0000-0000-0000-000000000000	187ab635-5071-4abf-9dc9-9a8324878527	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.771082+00	
00000000-0000-0000-0000-000000000000	9362a94b-234e-4f86-8c1e-e1ceee49cdde	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.77776+00	
00000000-0000-0000-0000-000000000000	266faa14-3354-45f8-8d6a-7868850b85d0	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:45:44.793169+00	
00000000-0000-0000-0000-000000000000	6116da2d-80c2-4c01-94c2-09c79fd39396	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:00.17272+00	
00000000-0000-0000-0000-000000000000	4d9c2db9-8304-4648-bbf3-a929ddaf2f44	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:00.173162+00	
00000000-0000-0000-0000-000000000000	b1355c96-7755-49e9-833e-f96e075d9e83	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:00.173635+00	
00000000-0000-0000-0000-000000000000	81bb61a7-80d4-4422-8de9-abcf460cacf5	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:08.925478+00	
00000000-0000-0000-0000-000000000000	9a3d5672-895a-47b9-a4ac-551e2d70d507	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:08.925988+00	
00000000-0000-0000-0000-000000000000	a250f576-a071-4661-8381-18246fa5c585	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:08.926819+00	
00000000-0000-0000-0000-000000000000	cbdc9f75-81cd-466e-b572-896d2d5c0716	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.156823+00	
00000000-0000-0000-0000-000000000000	654a60e6-f59f-443f-b3b8-2666944f2a13	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.157706+00	
00000000-0000-0000-0000-000000000000	f97c4602-0eb5-4bb1-bdf9-4b60d2c9314c	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.159011+00	
00000000-0000-0000-0000-000000000000	5cbba16b-ccf9-473d-b400-18793c0dd22a	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.518088+00	
00000000-0000-0000-0000-000000000000	531cb614-fe14-4706-9561-9c7554f00e49	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.518156+00	
00000000-0000-0000-0000-000000000000	b82b7be1-7efc-4b2c-ac56-98880056585b	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.51964+00	
00000000-0000-0000-0000-000000000000	06a6b184-a619-4b62-b30f-f3a1bc873c57	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.888932+00	
00000000-0000-0000-0000-000000000000	22075c36-4206-4c51-920d-bde6bc8c391f	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.889165+00	
00000000-0000-0000-0000-000000000000	a3416cc5-0811-4620-aa30-52397affe843	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:48.890097+00	
00000000-0000-0000-0000-000000000000	fd860fb4-7ff9-4ca7-99cb-34e73b146cd5	{"action":"login","actor_id":"11111111-1111-4111-8111-111111111111","actor_name":"Ítalo Jardim","actor_username":"admin@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:49.388618+00	
00000000-0000-0000-0000-000000000000	fa04b244-86d5-47e9-b07e-52f71b0a2552	{"action":"login","actor_id":"33333333-3333-4333-8333-333333333333","actor_name":"Admin Outra Empresa","actor_username":"admin@outra.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:49.392159+00	
00000000-0000-0000-0000-000000000000	b4c6c5a5-57ce-42e9-8f91-4f66a696f726	{"action":"login","actor_id":"22222222-2222-4222-8222-222222222222","actor_name":"Assistente Praxis","actor_username":"assistente@praxis.dev","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-13 23:46:49.394984+00	
00000000-0000-0000-0000-000000000000	920f2ba1-6d32-430a-9469-c91895208825	{"action":"logout","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"account"}	2026-08-14 00:28:27.342313+00	
00000000-0000-0000-0000-000000000000	3f158acf-4670-4420-bd95-8c6afd200914	{"action":"login","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-14 00:28:44.414821+00	
00000000-0000-0000-0000-000000000000	72dc3954-0965-4760-8e88-476924a6d792	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 01:27:09.099883+00	
00000000-0000-0000-0000-000000000000	910f312b-7b31-4917-8a58-f5e0f2cb23f9	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 01:27:09.100532+00	
00000000-0000-0000-0000-000000000000	dc38bf69-2d9a-4a99-96fe-bc8f62597d89	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 02:25:46.13222+00	
00000000-0000-0000-0000-000000000000	2144910a-dcd9-4622-bd97-5969cfac5d60	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 02:25:46.132803+00	
00000000-0000-0000-0000-000000000000	e1c7e575-42e1-40d9-a6cf-1eebc92f8237	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 03:24:16.198164+00	
00000000-0000-0000-0000-000000000000	08b314d5-ee27-4a98-bfa7-2405b24c5e77	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 03:24:16.19915+00	
00000000-0000-0000-0000-000000000000	9faf2993-2f70-41d8-99f2-43c683b3deaf	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 04:22:47.222434+00	
00000000-0000-0000-0000-000000000000	0226e927-da62-4116-b579-2c7305e4b5e9	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 04:22:47.222978+00	
00000000-0000-0000-0000-000000000000	49d34b23-ed80-44a9-a126-f5656cb0f63e	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 05:21:42.963244+00	
00000000-0000-0000-0000-000000000000	8c42e5b9-6daa-4450-a4e2-1c6e827d38dd	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 05:21:42.96385+00	
00000000-0000-0000-0000-000000000000	8b407fff-e6e0-4d0c-9cfa-c5f2ce50c88f	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 06:20:13.012993+00	
00000000-0000-0000-0000-000000000000	08da45fe-bfad-4724-87a4-21446569014a	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 06:20:13.013564+00	
00000000-0000-0000-0000-000000000000	ff8b8e4e-e1e6-400c-aa9a-74453ad5970c	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 07:19:09.16645+00	
00000000-0000-0000-0000-000000000000	545894fd-9594-4c42-bcf3-607468231cd8	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 07:19:09.167014+00	
00000000-0000-0000-0000-000000000000	85a0b96f-7575-4b73-b93d-41320ca10096	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 08:18:04.95264+00	
00000000-0000-0000-0000-000000000000	a6981f87-685e-4bb2-bcae-0ab460f7617b	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 08:18:04.953305+00	
00000000-0000-0000-0000-000000000000	66d5a8c8-89aa-4363-852b-0bf02b19cf01	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 09:16:35.069688+00	
00000000-0000-0000-0000-000000000000	7dfdffeb-a669-489b-961b-539ead598caf	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 09:16:35.070511+00	
00000000-0000-0000-0000-000000000000	a60bef64-29aa-4e44-aae5-2f2cbc8e566f	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 10:15:31.135615+00	
00000000-0000-0000-0000-000000000000	684cdfad-45a5-4bc9-bedd-ae3ce180455d	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 10:15:31.136121+00	
00000000-0000-0000-0000-000000000000	3f3aea80-8f4a-42f9-844f-77c4ccc3c029	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 11:14:27.139443+00	
00000000-0000-0000-0000-000000000000	14b97f7c-63b5-4993-812a-0d8120523dde	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 11:14:27.139978+00	
00000000-0000-0000-0000-000000000000	10c529e5-ce76-4d6e-b608-3714cfe7e5c6	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 12:12:57.175239+00	
00000000-0000-0000-0000-000000000000	dbd81248-b710-4a86-825c-90328d3e88dc	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 12:12:57.175798+00	
00000000-0000-0000-0000-000000000000	0bf012fd-d611-45c6-ae23-0f935afb609c	{"action":"token_refreshed","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 13:11:27.187567+00	
00000000-0000-0000-0000-000000000000	c022e9da-43c7-421d-b8e2-22d35d91fab0	{"action":"token_revoked","actor_id":"01995e19-0de1-4ddb-b53e-0dff2cb718aa","actor_name":"Ítalo Paiva Jardim","actor_username":"neuropsicologo@dritalojardim.com","actor_via_sso":false,"log_type":"token"}	2026-08-14 13:11:27.188161+00	
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
11111111-1111-4111-8111-111111111111	11111111-1111-4111-8111-111111111111	{"sub": "11111111-1111-4111-8111-111111111111", "email": "admin@praxis.dev", "email_verified": true}	email	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	7da5f40d-23dc-4cd2-ab9d-ec693349a7a0
22222222-2222-4222-8222-222222222222	22222222-2222-4222-8222-222222222222	{"sub": "22222222-2222-4222-8222-222222222222", "email": "assistente@praxis.dev", "email_verified": true}	email	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	f4d40369-59ad-4c5e-b582-4a9561861653
33333333-3333-4333-8333-333333333333	33333333-3333-4333-8333-333333333333	{"sub": "33333333-3333-4333-8333-333333333333", "email": "admin@outra.dev", "email_verified": true}	email	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	3114076c-540e-4cf6-ae3f-3d4dc5861343
01995e19-0de1-4ddb-b53e-0dff2cb718aa	01995e19-0de1-4ddb-b53e-0dff2cb718aa	{"sub": "01995e19-0de1-4ddb-b53e-0dff2cb718aa", "email": "neuropsicologo@dritalojardim.com", "full_name": "Ítalo Paiva Jardim", "email_verified": false, "phone_verified": false}	email	2026-08-13 19:42:51.957995+00	2026-08-13 19:42:51.958017+00	2026-08-13 19:42:51.958017+00	64de383f-e618-49ea-bc1c-15e3a2bfecee
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
35551139-51e2-4c4a-976c-91ea77265410	2026-08-13 16:10:22.353116+00	2026-08-13 16:10:22.353116+00	password	4e2dff1e-21ec-49b4-8db4-623ce7a53ea1
15c4a5cf-fe16-487d-aa61-b6f5656677eb	2026-08-13 16:10:22.355713+00	2026-08-13 16:10:22.355713+00	password	ba111d03-0990-46b6-8678-2d5252809bf0
6b8da558-b4ea-4ae8-986a-647c871a184f	2026-08-13 16:10:22.359716+00	2026-08-13 16:10:22.359716+00	password	c427c6aa-d8c8-4c27-915d-799c3e86bb12
2095b103-0acb-4414-aa6b-b2da7f61d494	2026-08-13 16:10:22.364677+00	2026-08-13 16:10:22.364677+00	password	8821348b-881f-496c-a6bb-abe972270ba2
028b9a58-11ad-4e6d-bb59-41501088302e	2026-08-13 16:10:22.365144+00	2026-08-13 16:10:22.365144+00	password	2a36952f-ab96-44fd-8f86-d25179d781a8
86731a27-af39-4fa7-ad0b-63e5a06c95fc	2026-08-13 16:10:22.369589+00	2026-08-13 16:10:22.369589+00	password	98ba41ad-a9a0-41a9-a1ce-a966038f3510
fc03b936-9146-447b-9fd1-2673cab0115e	2026-08-13 16:10:22.373469+00	2026-08-13 16:10:22.373469+00	password	9d77cccd-d6df-4802-be3c-4abe51648d9b
a2313c54-dcb6-45d7-bc2b-110c6e7811bd	2026-08-13 16:10:22.378761+00	2026-08-13 16:10:22.378761+00	password	570fba7c-714c-4ad1-be82-7c135852e757
f7e43e6b-890d-4ece-8bff-17e9d2931049	2026-08-13 16:49:09.68238+00	2026-08-13 16:49:09.68238+00	password	e315047d-7925-4b77-b78c-823cbacbd4b7
a590805c-7635-46ae-a6b3-ac5867c145f9	2026-08-13 16:49:09.682036+00	2026-08-13 16:49:09.682036+00	password	45411469-ba1c-4647-bc98-6d1ea1b6af25
77924229-abe7-4cbd-956f-077efe76f139	2026-08-13 16:49:09.687872+00	2026-08-13 16:49:09.687872+00	password	a8fd59c7-8380-4643-b128-3a19ecb35af2
6f4bcd83-e1cf-4d72-b7ec-fab6a279f611	2026-08-13 16:49:09.687853+00	2026-08-13 16:49:09.687853+00	password	d0734037-5096-4fa8-9379-1d2e17b896a5
b3386d44-e1e0-4d7c-b9eb-2dd05c335793	2026-08-13 16:49:09.690771+00	2026-08-13 16:49:09.690771+00	password	efe4c096-a770-4692-bac3-b00170236f17
b4d8daad-11fd-4f72-8a55-029f22f0008e	2026-08-13 16:49:09.695277+00	2026-08-13 16:49:09.695277+00	password	cf9ffa74-ea44-4743-8913-d2c8f9853f99
48ff2afd-8469-46fa-9f9f-43ec83a1d455	2026-08-13 16:49:09.69547+00	2026-08-13 16:49:09.69547+00	password	a2b21638-6e5e-4ea6-80ba-dbabe673ec26
b51f9a64-8384-4edc-bff7-50cd39e6d8e5	2026-08-13 16:49:09.701298+00	2026-08-13 16:49:09.701298+00	password	152860a8-e3b2-4fac-92a4-cf838b4ee4ca
98b842be-abd3-408e-9386-0168995cf889	2026-08-13 16:49:44.940928+00	2026-08-13 16:49:44.940928+00	password	45da78d0-007a-4454-8225-2cc66d67b002
77373c38-2444-4561-8f2a-370bdef5d875	2026-08-13 16:50:01.46013+00	2026-08-13 16:50:01.46013+00	password	ae4640d7-2793-44cc-bf6c-aa456ce729b4
2605e123-6ec9-48c9-9929-4e93f0f67f24	2026-08-13 16:52:38.951037+00	2026-08-13 16:52:38.951037+00	password	5ba13628-e91d-47f1-9009-7f3981926c43
eb12d04d-462e-4dea-9ff6-5b6ca57bf81a	2026-08-13 16:52:41.005138+00	2026-08-13 16:52:41.005138+00	password	b5b70377-5dca-4016-a763-e6ab0106b489
de72c5f0-d340-45da-ae13-38c3587d08ea	2026-08-13 16:53:37.716677+00	2026-08-13 16:53:37.716677+00	password	c0589406-e4a0-4268-bf0a-ce03a2f0ef0e
13676f0e-63ff-4012-b880-249b7f295231	2026-08-13 16:53:39.602465+00	2026-08-13 16:53:39.602465+00	password	3439be30-5381-48f0-8380-bcf175cff7b3
1370e6ca-6b6d-4599-9c84-c33f9ce77743	2026-08-13 16:54:23.021823+00	2026-08-13 16:54:23.021823+00	password	19f9d8e7-26f1-47e1-82ce-fb9b58836d9d
184506a4-3d13-4551-8def-cdee5feb4559	2026-08-13 16:54:24.991881+00	2026-08-13 16:54:24.991881+00	password	fb5361a6-6a7c-4fd3-8c3d-274e56441b19
4eaafeae-0a0b-458e-8254-551c0a33bfae	2026-08-13 16:56:48.923006+00	2026-08-13 16:56:48.923006+00	password	278de60f-d1cb-4396-adb3-7ef9a45832c4
b22c0053-4658-4765-b901-1451066ec9a7	2026-08-13 16:56:48.923743+00	2026-08-13 16:56:48.923743+00	password	2d1dc33b-0c33-4e9e-a6d1-36f342e5ea80
78c71a83-0437-4ae7-a592-181e71334690	2026-08-13 16:56:48.930172+00	2026-08-13 16:56:48.930172+00	password	c1b77a2b-0ee5-4c67-b6e7-7b61e991cce0
f8834fb6-d591-4cbf-97e8-e0ffae962418	2026-08-13 16:56:48.931064+00	2026-08-13 16:56:48.931064+00	password	094d0a27-17fa-45d2-9f9a-cb1190f85b77
9ffdd3e7-15a7-42a8-9a73-cbe3260bdf77	2026-08-13 16:56:48.934935+00	2026-08-13 16:56:48.934935+00	password	df536578-9bd4-4f02-8df3-9ee467283499
819b6657-640e-4127-83ba-31e2e3196895	2026-08-13 16:56:48.936536+00	2026-08-13 16:56:48.936536+00	password	dc69e914-c908-49c1-820f-9c8c5fac5abf
27efef7f-e952-4824-920d-1f44512e94c3	2026-08-13 16:56:48.942474+00	2026-08-13 16:56:48.942474+00	password	2e5fd29c-b532-4d74-9702-945b9270f82e
94d54950-eb8a-402b-bec1-15c2956f6228	2026-08-13 16:56:48.947537+00	2026-08-13 16:56:48.947537+00	password	f25747eb-d9d1-4497-b3bb-6bc1975d4269
cdc72b80-505e-451b-a26e-38fa9ebead2c	2026-08-13 17:23:13.624871+00	2026-08-13 17:23:13.624871+00	password	4dee6b48-66cd-4e05-bcb1-71222a606882
845c6efa-adf6-4e12-83f6-23c01d395299	2026-08-13 17:23:13.636936+00	2026-08-13 17:23:13.636936+00	password	0ee5c023-aff9-4ed1-bf84-1a79cc478319
1570802b-b29c-402a-973d-cbd69983e08c	2026-08-13 17:23:13.681795+00	2026-08-13 17:23:13.681795+00	password	afabff12-e261-4481-be4a-dd7d80af631d
1e9e1312-b7a8-4d48-a906-b78857a45190	2026-08-13 17:23:13.697839+00	2026-08-13 17:23:13.697839+00	password	b97dfd9e-03b0-44c8-988f-0fa132cab144
1efdbba5-e258-4899-b731-88a10edca4a0	2026-08-13 17:23:13.702989+00	2026-08-13 17:23:13.702989+00	password	5da878db-ed43-4fa9-b803-3eccd114a360
557dfa6e-2168-41ac-b8a1-66d312c035a8	2026-08-13 17:23:13.719844+00	2026-08-13 17:23:13.719844+00	password	de14a91f-1be8-4f36-b0d9-ba3f73ee12f8
fa71c2ed-cf60-4405-b7de-dc24cce9471b	2026-08-13 17:23:13.740143+00	2026-08-13 17:23:13.740143+00	password	ceec5030-9e7e-414c-bdae-6bec16a5301a
f72c393d-8a28-4940-8cd9-e6ee4977c0c6	2026-08-13 17:23:13.745193+00	2026-08-13 17:23:13.745193+00	password	8a9efaf5-b41c-45e1-9cfa-e4c326ef641b
c7fc538c-f3a4-4a26-ac16-627afe1699fb	2026-08-13 18:17:44.026377+00	2026-08-13 18:17:44.026377+00	password	1fac85be-89c3-41c1-80f0-228604bf79a1
46f9368a-961a-47b4-b5a4-8cd957ed376e	2026-08-13 18:17:44.036543+00	2026-08-13 18:17:44.036543+00	password	99c3c41b-714f-4413-8ea8-ef8c62c4274b
b81345b1-c9b3-4f61-92b8-5e3d78dc8c0a	2026-08-13 18:17:44.043038+00	2026-08-13 18:17:44.043038+00	password	f7baa289-2e22-4288-a034-8afcdb5710e4
9bf1b4f0-3a20-4d4f-826f-c37b5c13e253	2026-08-13 18:17:44.052711+00	2026-08-13 18:17:44.052711+00	password	2e576753-2092-4876-8b9a-138315b3758e
04c74354-7531-4796-b002-5eb48be94552	2026-08-13 18:17:44.059543+00	2026-08-13 18:17:44.059543+00	password	a24d739d-13f4-4350-88e1-b99b092296c9
f9c90df0-42f6-45e6-9cd2-583871a3111d	2026-08-13 18:17:44.061821+00	2026-08-13 18:17:44.061821+00	password	902bde6a-d5f1-4e12-9149-37c8b6138cc3
2f1e5c0e-a7b2-4eb5-bfd8-6899b7779300	2026-08-13 18:17:44.073753+00	2026-08-13 18:17:44.073753+00	password	9505fb38-eed3-46af-ad60-6aca050a692e
5b938a0a-3088-490a-a215-010e59f6edfd	2026-08-13 18:17:44.078061+00	2026-08-13 18:17:44.078061+00	password	b51c8802-45a6-4b5d-a0c9-4147518ca8a4
aa829281-31c5-480b-bfd6-1fb2aea67bc0	2026-08-13 18:19:15.012896+00	2026-08-13 18:19:15.012896+00	password	3efed1ec-6e8d-4807-ae30-5e0aedb9a571
9c47638d-cbe3-471d-8c41-dca3f34122ac	2026-08-13 18:19:15.014986+00	2026-08-13 18:19:15.014986+00	password	cef7fc4a-41a3-4208-a4b2-52ebef372dbf
af2d3644-c6ae-46d6-9ab8-b6b41d99a119	2026-08-13 18:19:15.022126+00	2026-08-13 18:19:15.022126+00	password	9a3fdfc4-4c2c-431a-9393-e4e30a311a46
8b087e1f-b264-4aca-8228-c9176cfb09bf	2026-08-13 18:19:15.022997+00	2026-08-13 18:19:15.022997+00	password	079ce54c-1d55-4354-a24b-482792fac983
c2e218fb-ff19-4cae-8f58-1ca0bbf82578	2026-08-13 18:19:15.029369+00	2026-08-13 18:19:15.029369+00	password	0b206bd0-d06d-4bb1-8388-a0d3d072584a
a99ac20f-49f8-4f0f-bc51-ca1425f6cea0	2026-08-13 18:19:15.033721+00	2026-08-13 18:19:15.033721+00	password	ff86609f-3a6f-46e7-8a8d-7e23b682b65a
7fcf0f13-78fc-418c-8412-863721c697d3	2026-08-13 18:19:15.037348+00	2026-08-13 18:19:15.037348+00	password	46df500b-3a2d-48a9-9ec6-5e3ce1054c1f
9ead7b32-d30f-4e6c-98fd-20c7f1e27972	2026-08-13 18:19:15.041711+00	2026-08-13 18:19:15.041711+00	password	03c2479b-3bc7-4860-87cc-bd7a5919d573
4dc88b30-429c-40d9-b43c-0f987928eda2	2026-08-13 18:20:04.316611+00	2026-08-13 18:20:04.316611+00	password	4aeab491-238e-4e28-804f-d9c0b936190b
1a0ae2f3-f0ae-453a-a4a4-0f0c62ff397a	2026-08-13 18:20:04.318397+00	2026-08-13 18:20:04.318397+00	password	e36c1b00-b6d4-470d-8fb2-6647a74f1540
1a847ded-8863-4db6-bb1c-62233578dbc9	2026-08-13 18:20:04.32307+00	2026-08-13 18:20:04.32307+00	password	80fb6b33-24e4-4934-abac-81d59f993e85
929f75cd-9751-4e81-bc5f-e3376a3060d3	2026-08-13 18:20:04.323734+00	2026-08-13 18:20:04.323734+00	password	39b1827e-0fb4-4cab-acee-9cfdcec5e295
11812edb-ddd1-4c95-95bd-8a14cefc67ba	2026-08-13 18:20:04.328351+00	2026-08-13 18:20:04.328351+00	password	b59274a5-c3bc-4b08-af24-a6627921e46c
4b7fe127-f8d6-4992-aa35-59e4556cf463	2026-08-13 18:20:04.328632+00	2026-08-13 18:20:04.328632+00	password	f0e2aec4-12a5-4197-867b-d2f7a224a0d7
f4cdaf2a-6ac8-4844-b585-2e95e111dbe0	2026-08-13 18:20:04.33978+00	2026-08-13 18:20:04.33978+00	password	3db0472c-5d13-4d94-8baa-19b3e61fe01c
566b49c0-00f3-48c9-95c9-00dd888408b3	2026-08-13 18:20:04.338876+00	2026-08-13 18:20:04.338876+00	password	f3b3c158-455c-4e0a-91b1-eca469c266cb
5e740572-cb19-4896-b0b5-49471c0d9bfe	2026-08-13 19:06:53.673099+00	2026-08-13 19:06:53.673099+00	password	92876ef6-b7f7-4950-a5f0-17cda6d8b34c
315c4f26-3628-40ae-b0b8-2fdb396b4f21	2026-08-13 19:06:53.679604+00	2026-08-13 19:06:53.679604+00	password	2aa85555-056c-4a91-9992-52f0e51a636e
35be98f6-bd3d-4d53-a627-9372926e65df	2026-08-13 19:06:53.688646+00	2026-08-13 19:06:53.688646+00	password	0d63ca51-9fd6-458a-9b3c-8ab44b8178d3
32042a20-eced-469e-a386-5f9f91260549	2026-08-13 19:06:53.6881+00	2026-08-13 19:06:53.6881+00	password	d8229726-2eee-4095-bf66-59cd9bcee023
7f9aabd2-916b-4040-8a1f-4c230589c5d8	2026-08-13 19:06:53.696815+00	2026-08-13 19:06:53.696815+00	password	7ae922b0-a341-45df-a900-e6e9b7e30cd6
cc25a169-d60c-440c-ab77-c11f7b3bc598	2026-08-13 19:06:53.69709+00	2026-08-13 19:06:53.69709+00	password	118dad75-66d5-426e-b268-c88f0c58b8da
e93d8c85-8c0f-4bdb-8746-0dff950b04ed	2026-08-13 19:06:53.702692+00	2026-08-13 19:06:53.702692+00	password	1fa41f93-69e9-4152-9e38-d498191b1416
f0022577-f0f2-4eab-bd67-ce58ffab6d32	2026-08-13 19:06:53.704009+00	2026-08-13 19:06:53.704009+00	password	f9730cc4-1acb-4668-aa19-e7e78bf052b7
d20f33d6-2c27-46bf-a09f-69b435d02fdd	2026-08-13 19:09:34.702435+00	2026-08-13 19:09:34.702435+00	password	85f09cad-4dc8-4ad7-b85b-58df5087c56b
fbcb895f-7c58-498b-a2a5-15dc5541ee2c	2026-08-13 19:09:34.709939+00	2026-08-13 19:09:34.709939+00	password	e1ebe26c-aea8-4f3b-9f2c-fd1336c3e9b2
d126d77a-84f0-4aea-9c72-4678938aeda8	2026-08-13 19:09:34.709962+00	2026-08-13 19:09:34.709962+00	password	da001114-c56a-4602-b6b6-fa8017686d88
443d15ac-7130-4da3-9375-6ff5a3868ee8	2026-08-13 19:09:34.717269+00	2026-08-13 19:09:34.717269+00	password	7aded340-f356-4672-b920-3c2cb9261d6a
b8a74f85-ca02-4a51-8022-866cc6be0d03	2026-08-13 19:09:34.719815+00	2026-08-13 19:09:34.719815+00	password	e73904db-44c9-4edf-8b75-02b110f69915
9c0a66f0-b47d-43ed-960d-65e3726bfa21	2026-08-13 19:09:34.720929+00	2026-08-13 19:09:34.720929+00	password	f1055740-7a25-4022-ac76-a7dbc0e03e7c
30080152-0a2c-4f81-a526-cb9f2f4dc525	2026-08-13 19:09:34.726487+00	2026-08-13 19:09:34.726487+00	password	40d64e55-f59f-4b21-85c5-1c5e9d607b2d
d1529269-8e0d-4164-b735-8cdb0e91f61c	2026-08-13 19:09:34.730597+00	2026-08-13 19:09:34.730597+00	password	c961bd51-c331-4652-a958-880ffee72753
97a1d818-66d9-4cc4-b195-8d9cab4ef020	2026-08-13 22:36:10.437678+00	2026-08-13 22:36:10.437678+00	password	5a58c529-31c0-4840-bf69-449c399eece8
ca8941bb-6b1d-4672-b674-4d9889fc26c1	2026-08-13 22:47:57.289713+00	2026-08-13 22:47:57.289713+00	password	deb8fa3a-db01-4a09-94ed-8dd692899fd0
18276dfa-26cc-4f85-8394-27b950c5c238	2026-08-13 22:57:13.621036+00	2026-08-13 22:57:13.621036+00	password	ece544a1-f404-4068-8af3-8658efcda940
8c4c28f5-9b06-4eb2-ac04-794bfba66362	2026-08-13 23:29:09.606387+00	2026-08-13 23:29:09.606387+00	password	767f0821-6170-48d4-a44d-dd999b5d18d4
40366835-5e47-4d1d-9ce1-c6d7fc74cada	2026-08-13 23:35:53.799098+00	2026-08-13 23:35:53.799098+00	password	e3ad13b3-d94b-4d85-9fb0-6fb97b0f9a7b
79755d3e-66e7-47cb-90e2-21bb6725b3c9	2026-08-13 23:35:53.799722+00	2026-08-13 23:35:53.799722+00	password	72914ac5-5319-418f-b17d-78be091a649a
f16655a2-4830-486e-b10f-c2bf34accf02	2026-08-13 23:35:53.808063+00	2026-08-13 23:35:53.808063+00	password	933c0667-3e90-420c-b892-e2f23bf10bef
213f3bb0-cdd9-43ac-ab38-f20a59be6c5a	2026-08-13 23:35:53.812603+00	2026-08-13 23:35:53.812603+00	password	b0d22486-4cc1-49df-90cb-6e739049a9de
5bf812cb-4a8c-4ee6-9338-c89e13ac7ca9	2026-08-13 23:35:53.814658+00	2026-08-13 23:35:53.814658+00	password	75ab7883-bc6c-4ce5-bc09-82f3806bb81f
d273a4a1-2c0f-4ad9-97f9-c5eb2629c00a	2026-08-13 23:35:53.812455+00	2026-08-13 23:35:53.812455+00	password	e4c8d397-c8f6-4d3f-957a-93f7c243ce6c
1d3d1178-6a1f-4974-a8d1-b8050c6f996d	2026-08-13 23:35:53.818801+00	2026-08-13 23:35:53.818801+00	password	d879b581-716f-4f80-b78b-0107b6e15c58
96199346-6adf-4be4-9fb9-2b7a0706d7c9	2026-08-13 23:35:53.822489+00	2026-08-13 23:35:53.822489+00	password	99bfc3a2-6a7a-4d69-87e1-14bde575ffb2
44579d6a-1450-4095-a376-95a15fd01c90	2026-08-13 23:35:53.824616+00	2026-08-13 23:35:53.824616+00	password	a9f00045-bee0-408e-8c86-fe7d72db6ec5
9df5762b-7e66-4603-b065-66d2436ba920	2026-08-13 23:35:53.829053+00	2026-08-13 23:35:53.829053+00	password	7a2b3ffb-68af-4fa7-af49-eed100ab34e6
6bd783f2-b407-4394-9ab0-60584a5d0aaf	2026-08-13 23:35:53.82912+00	2026-08-13 23:35:53.82912+00	password	0c1299dc-609b-4c0e-a4cb-ca87e3633161
7b9db1b7-616d-4452-90e4-5fa059628433	2026-08-13 23:35:53.833461+00	2026-08-13 23:35:53.833461+00	password	efece742-1585-4e2a-ae01-d126adea0e19
365bf5ac-ffac-42bc-83e8-07b1c6049447	2026-08-13 23:36:18.530099+00	2026-08-13 23:36:18.530099+00	password	1fcf4925-bbfa-4019-a381-2a50eec77b5e
0f8aabb0-35f4-4f3f-b3c9-a667a9416928	2026-08-13 23:36:18.530462+00	2026-08-13 23:36:18.530462+00	password	c8335bcd-72be-4565-ab35-b790f9e1f341
f0de650e-c81a-4307-a36f-dc7edd3191f6	2026-08-13 23:36:18.535576+00	2026-08-13 23:36:18.535576+00	password	de49e22d-4906-459e-8946-60816a4716fe
64b91055-dcbf-42ca-9f16-ee7d618f742c	2026-08-13 23:36:18.537485+00	2026-08-13 23:36:18.537485+00	password	79a5a9f8-051d-4609-a4b1-46620a3c07ec
4230d49d-65d7-49fa-a0e6-3bffdb6f6a72	2026-08-13 23:36:18.537319+00	2026-08-13 23:36:18.537319+00	password	5f7f25dd-3fdd-490e-964f-db6809945ef1
db33cd17-755c-458a-9ad0-413ac8818146	2026-08-13 23:36:18.541893+00	2026-08-13 23:36:18.541893+00	password	b05cfd0a-7c45-4756-a994-76f99e1c5141
25aafe6f-ce7e-440f-a00f-95eaf6621e1b	2026-08-13 23:36:18.542007+00	2026-08-13 23:36:18.542007+00	password	e643f9c3-4fbe-4455-96ec-f00b44592067
576abb2f-acfd-4b2b-8a21-781f5c5cf9db	2026-08-13 23:36:18.541635+00	2026-08-13 23:36:18.541635+00	password	cc1e7bb8-7a51-4e80-902d-abfa42581383
96db6eda-2bb0-47a5-8bda-0ed2544ac3bb	2026-08-13 23:36:18.546787+00	2026-08-13 23:36:18.546787+00	password	f98e3d43-8de4-4768-8ed5-7549bfb8de14
df058c1e-58cd-45bc-8404-eab75bdfd7aa	2026-08-13 23:36:18.547618+00	2026-08-13 23:36:18.547618+00	password	0be41a4d-cd17-4810-bfc4-93f73ae2f6b9
9b44cdef-db66-4ffc-a459-34dfa2cc424d	2026-08-13 23:36:18.552447+00	2026-08-13 23:36:18.552447+00	password	131992e6-17c0-46e1-bd5e-9e471789c351
71973fe7-52bb-4105-8262-2262c610a772	2026-08-13 23:36:18.559579+00	2026-08-13 23:36:18.559579+00	password	8c04d918-afb8-4dc1-a9b8-2ce8e2c4a0ed
9d3fedb4-c26e-4cee-a7e9-46b7e3bba5c2	2026-08-13 23:38:46.577578+00	2026-08-13 23:38:46.577578+00	password	9e04f7e8-d193-492d-b8fb-192f65270f0a
6da85615-776f-42dd-a2d2-86f43518acd1	2026-08-13 23:38:46.577947+00	2026-08-13 23:38:46.577947+00	password	ea9e87db-e414-4ffc-9882-afc3801644dc
a276db6d-5ed6-439d-906a-f4b158a836c7	2026-08-13 23:38:46.580622+00	2026-08-13 23:38:46.580622+00	password	46b8bc05-2d02-42b4-97f3-2d47c291d99d
51a7a206-b149-4852-8f17-41105f73dc2a	2026-08-13 23:38:46.589944+00	2026-08-13 23:38:46.589944+00	password	98f5d6ea-b7ef-4083-89f2-7106465375b1
14400a53-7104-4380-bc0b-9a7ab3d1206a	2026-08-13 23:38:46.592008+00	2026-08-13 23:38:46.592008+00	password	2b9c77f2-b776-4b73-a055-ee0c1476e413
0b026ac2-2157-4154-a6b3-9bc5bfc42a5a	2026-08-13 23:38:46.594277+00	2026-08-13 23:38:46.594277+00	password	23d27c78-ecc7-4e3c-ae7f-7427faaeb911
6f521325-642c-4661-8c03-ab03a81afced	2026-08-13 23:38:46.667942+00	2026-08-13 23:38:46.667942+00	password	97b9d883-ec49-4b51-a643-91b00c368cb0
df659605-86ba-4efc-b29b-7192637d9574	2026-08-13 23:38:46.670755+00	2026-08-13 23:38:46.670755+00	password	fa0e9811-411a-4ebc-a738-736c95df5aca
9354654f-1f6a-49f8-b19b-d384e78cc51a	2026-08-13 23:38:46.671838+00	2026-08-13 23:38:46.671838+00	password	9016d258-62fb-4a6b-974f-d60bed4a1868
52a57bf1-0382-4df4-82c1-06d9c4d83a77	2026-08-13 23:38:46.678318+00	2026-08-13 23:38:46.678318+00	password	fe4fbc03-7628-4a16-b007-7bd2a077d71b
4a78a40e-395e-4fd5-96bc-82bf5d90db8e	2026-08-13 23:38:46.678445+00	2026-08-13 23:38:46.678445+00	password	f387e6f3-ce4f-4aec-b341-57c2e020fa29
5636fd3c-d9ec-4478-8d05-e33e028e2264	2026-08-13 23:38:46.680598+00	2026-08-13 23:38:46.680598+00	password	4635e185-8e3a-4018-a3cd-1765b9295b53
c3f9b27e-3f1e-436b-834b-2a8820d4f483	2026-08-13 23:39:13.97607+00	2026-08-13 23:39:13.97607+00	password	74445e62-66f3-4cfc-8012-85eeb0cd2355
bdd1d6c3-387d-408e-be73-15fab06abc0f	2026-08-13 23:39:13.98306+00	2026-08-13 23:39:13.98306+00	password	5f7b30b2-24a0-4237-81f2-7eefc8d13ecf
1dc3cb84-3c1d-4eb0-9168-e5bc19729c3b	2026-08-13 23:39:13.987473+00	2026-08-13 23:39:13.987473+00	password	464d7117-cf1d-47e4-9c38-a279b8dc2ed4
8a519762-b87a-4f02-89e2-da24afce9ee6	2026-08-13 23:39:13.988282+00	2026-08-13 23:39:13.988282+00	password	6396797d-a042-408c-be2b-fed1547f07ff
a8a2c7f8-2b78-40e8-901d-6cc4f062a9a2	2026-08-13 23:39:13.992874+00	2026-08-13 23:39:13.992874+00	password	b2d881c8-cdae-4c10-9fef-9de750408c87
35df321b-0d3d-4223-ad4e-4c5825d4adc3	2026-08-13 23:39:13.998359+00	2026-08-13 23:39:13.998359+00	password	0cdd5094-a9fc-49d4-bf6f-a6db1633ade7
d8b48198-2ba0-40d1-a0bf-ea8f5372e5b3	2026-08-13 23:39:14.088095+00	2026-08-13 23:39:14.088095+00	password	45e413ce-3dfc-428a-8dce-21f9cb65ba2c
a7984518-76d8-46fb-bf5f-e62b976d9472	2026-08-13 23:39:14.087834+00	2026-08-13 23:39:14.087834+00	password	53b4fb97-a611-4e67-83f8-0057fb314eaa
18672e63-9fe3-4c6a-afa4-09b1d005f9b3	2026-08-13 23:39:14.090042+00	2026-08-13 23:39:14.090042+00	password	72852ed6-5074-4e04-9068-1afc8c40323e
50164be0-dc4c-4fde-beab-48fed3281a0a	2026-08-13 23:39:14.100888+00	2026-08-13 23:39:14.100888+00	password	c724d659-b380-4775-ad10-c1f2d8e04e88
2a2bbc41-0249-4f2d-9744-51f655a89250	2026-08-13 23:39:14.100892+00	2026-08-13 23:39:14.100892+00	password	b66fc74e-d0f0-472a-9aa2-cc1522789604
cba6296c-f821-4b7a-94d9-bc7bd1c597fc	2026-08-13 23:39:14.105676+00	2026-08-13 23:39:14.105676+00	password	25f70d29-4a80-4e9b-9f0d-7aaae8f0f0ba
4d23128c-9d23-4437-a108-6566acc9a998	2026-08-13 23:39:39.966659+00	2026-08-13 23:39:39.966659+00	password	ffa3e830-4004-439c-9aee-cb84eee8a5e7
330fe554-9404-4694-b1b3-00fdebffa0d8	2026-08-13 23:39:39.969572+00	2026-08-13 23:39:39.969572+00	password	441df87e-24d4-4ad3-a702-bb1676142445
b826d386-5eb6-4c8d-a8e9-9fbd7b22496b	2026-08-13 23:39:39.968854+00	2026-08-13 23:39:39.968854+00	password	5bb584f0-6cd3-4273-b3ff-8652cf5d96b9
32535756-7508-401d-9501-652c7047371a	2026-08-13 23:39:39.977393+00	2026-08-13 23:39:39.977393+00	password	2d28336b-6efa-446a-8fef-e81c13af5a49
a197e690-138e-41c3-a1cc-5b7eea36e5bb	2026-08-13 23:39:39.977455+00	2026-08-13 23:39:39.977455+00	password	01dde7b3-d4ee-4da1-8316-78243f2f5063
eba000e6-4642-45a4-8531-97108da38fd2	2026-08-13 23:39:39.977575+00	2026-08-13 23:39:39.977575+00	password	e29602d9-53c9-4710-8e10-875a0f62c09a
035dbb20-8fc8-4025-a0af-1751a58ca959	2026-08-13 23:39:40.076069+00	2026-08-13 23:39:40.076069+00	password	8d93a327-d1dd-4e1c-b48d-5ea9577f64de
758aac43-b2ab-471d-abbd-7f6a94bfe8b2	2026-08-13 23:39:40.077605+00	2026-08-13 23:39:40.077605+00	password	78f17901-7dbd-4ddb-9841-4cdec208c834
d8ff4723-9df6-4338-9476-deaf7246ead0	2026-08-13 23:39:40.081941+00	2026-08-13 23:39:40.081941+00	password	ac6135df-5fb0-4b6f-8be0-d18422bba5ea
e9dc2f75-e58d-4af2-addb-6773d43480bd	2026-08-13 23:39:40.086144+00	2026-08-13 23:39:40.086144+00	password	d8b51694-bc06-4964-bf9f-8d0410b49167
273a50f6-4b8b-4535-9ba2-54b7d83f9828	2026-08-13 23:39:40.089418+00	2026-08-13 23:39:40.089418+00	password	2969334a-33ec-4f48-b60c-6602a3e4a6e3
24bd3b48-1874-4ddd-899a-d5e0862f60b4	2026-08-13 23:39:40.094493+00	2026-08-13 23:39:40.094493+00	password	9435fbfa-c6b5-4046-96d4-4d405f5957d8
aa38e1c2-5c53-4733-85bc-25ff0eb46813	2026-08-13 23:40:05.190538+00	2026-08-13 23:40:05.190538+00	password	7ca112c2-db9e-44ab-8115-df3774a23a05
254d4eb9-424d-4922-b7ad-9e5ee94dd9a4	2026-08-13 23:40:05.193023+00	2026-08-13 23:40:05.193023+00	password	6a524826-46f6-4419-80fe-9f70f37970f6
519e8042-5a7d-41e2-bb92-a8654fed37b9	2026-08-13 23:40:05.194633+00	2026-08-13 23:40:05.194633+00	password	611906fb-bdac-46d6-896a-b5649f70c6fd
010dedbc-ad85-4569-97d3-7db883821b7b	2026-08-13 23:40:05.263851+00	2026-08-13 23:40:05.263851+00	password	05d4bc33-b821-4192-9c5e-6eaec98c1cea
664ad403-2d76-42d1-855d-be6d7e6e61e4	2026-08-13 23:40:05.276372+00	2026-08-13 23:40:05.276372+00	password	f316c442-6479-4740-a07f-97fc1eb5901c
fc8a520e-99cf-42a0-8bcd-9a179a144230	2026-08-13 23:40:05.301653+00	2026-08-13 23:40:05.301653+00	password	b103455b-c7bf-4098-9c4b-982a3cfb6f09
5c72cddc-ddea-4bd3-9f51-21d6bf6a6df8	2026-08-13 23:40:05.369781+00	2026-08-13 23:40:05.369781+00	password	f6f114b9-3919-4d4b-8e3f-cc2f5406ce06
ba422ee1-b4d8-40dc-9c6a-2d4b436853a2	2026-08-13 23:40:05.381166+00	2026-08-13 23:40:05.381166+00	password	95cc99fc-95a8-4e85-a56b-75c988d9b2ec
be5e7161-30cf-4df1-92c0-dae43aada6cb	2026-08-13 23:40:05.383241+00	2026-08-13 23:40:05.383241+00	password	f50240c5-c8a5-4016-85db-8f636cf6b855
eceab32b-9fa7-4226-a6a3-ba7975a2f06b	2026-08-13 23:40:05.390528+00	2026-08-13 23:40:05.390528+00	password	4afce152-56a7-4165-9a09-f98dc58c84cc
877445df-7132-4bcd-8c52-3d103785c719	2026-08-13 23:40:05.393818+00	2026-08-13 23:40:05.393818+00	password	b0221d5c-b4ba-4ee8-ab33-d34f57411942
bcc12774-8652-49c3-b2dc-f78775f89846	2026-08-13 23:40:05.394812+00	2026-08-13 23:40:05.394812+00	password	85196b46-74a5-4797-9532-5cd1193b2848
31598b2f-6c75-4ac9-a0ab-b6fd7f404844	2026-08-13 23:42:41.48701+00	2026-08-13 23:42:41.48701+00	password	4f67e620-f52e-4e06-bfba-a84e44407544
4b0bee1b-f88a-487e-bbe0-995c23a53fff	2026-08-13 23:42:41.486823+00	2026-08-13 23:42:41.486823+00	password	883832ee-9f39-439d-9610-072e656c4125
e856833c-9908-4b6c-883a-7e4f56cd1ec2	2026-08-13 23:42:41.490547+00	2026-08-13 23:42:41.490547+00	password	1b312425-1ab6-400e-8228-27e0cd1dd84e
62390249-7050-420d-acc3-cc6e7353841a	2026-08-13 23:42:41.490622+00	2026-08-13 23:42:41.490622+00	password	d44ed634-012e-41b6-89f9-f318dda53a4c
0a62648b-ef3c-4822-a860-d7400492c1ce	2026-08-13 23:42:41.496904+00	2026-08-13 23:42:41.496904+00	password	6aedb8a1-40a2-41b5-ac1d-f4bf6e43eb00
7f3651e1-25f3-408b-aa73-2f4c87e1c185	2026-08-13 23:42:41.503028+00	2026-08-13 23:42:41.503028+00	password	f1b51e88-ca6a-4989-8d9a-3e95f99a7b23
a007e4b9-aea0-41f1-aa1c-56a19f10f708	2026-08-13 23:42:41.567218+00	2026-08-13 23:42:41.567218+00	password	8723e814-2f98-421b-8636-07cde6febfa5
c66537f7-3cc7-402f-a82d-bab8548223bb	2026-08-13 23:42:41.568309+00	2026-08-13 23:42:41.568309+00	password	1aad3760-27e3-4313-a387-53881792d92e
2bd0b96a-ba17-46d5-b189-ef4fdee34204	2026-08-13 23:42:41.570331+00	2026-08-13 23:42:41.570331+00	password	5edaae72-564c-4f4e-bfb8-c6cb778ca818
906e43df-74c0-423a-84c4-d7e5c9c81f5d	2026-08-13 23:42:41.572904+00	2026-08-13 23:42:41.572904+00	password	c8afb69e-411d-4df8-a870-90e3d6e875be
f8f5db6f-6026-4bfb-9d44-2818e72b4939	2026-08-13 23:42:41.575663+00	2026-08-13 23:42:41.575663+00	password	176d3ca3-498e-4d49-b58d-b64fb01a7cce
fbfc8a01-168a-459f-b58e-a8e651f15fcd	2026-08-13 23:42:41.582276+00	2026-08-13 23:42:41.582276+00	password	bc2bcb41-6c3f-44cf-810d-27f2f517c581
5bc2db4a-225c-4250-8d0c-59a2cad98f18	2026-08-13 23:43:18.302762+00	2026-08-13 23:43:18.302762+00	password	af5d5a6f-8f8e-478c-a956-3b775ea47c2d
33f34d14-b536-46e2-a1d2-765eb3e718d9	2026-08-13 23:43:18.302435+00	2026-08-13 23:43:18.302435+00	password	1d8e9b57-7425-4138-af89-52fc3ef1ecda
6becca5a-c23e-4e5f-8acd-3290444fe560	2026-08-13 23:43:18.302417+00	2026-08-13 23:43:18.302417+00	password	86340c04-7e24-4b9d-baf0-f40dde405822
82076bfc-7595-4b24-bc8a-bbd5dd1ea511	2026-08-13 23:43:18.312399+00	2026-08-13 23:43:18.312399+00	password	d7e1f7e6-7b74-4cd7-bd9f-558fbe154d7f
9939e4e0-fbdb-40b5-9f3f-e314fefce4d6	2026-08-13 23:43:18.311647+00	2026-08-13 23:43:18.311647+00	password	2eb10ee7-263b-49da-8496-09103e67a900
cf30703e-224e-4a92-8cb1-58eaae2ba983	2026-08-13 23:43:18.312422+00	2026-08-13 23:43:18.312422+00	password	b8ba10d1-bae0-44bc-9476-9ae764faba06
969f8ce1-2887-4825-b50f-2fd44bb0588f	2026-08-13 23:43:18.377837+00	2026-08-13 23:43:18.377837+00	password	26ee8ff7-6452-468c-ba50-9b41d036fd13
fcb6899e-a035-49df-9f14-384b52ba164c	2026-08-13 23:43:18.384602+00	2026-08-13 23:43:18.384602+00	password	1859b340-82dc-4abb-af06-fcabb8098247
99207d61-b41f-4cf6-b59d-4d39a83ef4ea	2026-08-13 23:43:18.393671+00	2026-08-13 23:43:18.393671+00	password	5a9c08d2-cdd8-4e28-be44-92ee8dca8a3e
b4339069-2d9d-495b-b557-18ce6acddb64	2026-08-13 23:43:18.399407+00	2026-08-13 23:43:18.399407+00	password	9e3a72d4-1c77-457d-b271-43459f57cc0b
80e1cfd6-cc5b-49e5-b3dc-d2bae56fe110	2026-08-13 23:43:18.401573+00	2026-08-13 23:43:18.401573+00	password	d8987b27-2a53-4558-8d92-3bb346f94f84
e6a97038-3735-4b83-afef-ca47ed8ef2e1	2026-08-13 23:43:18.404102+00	2026-08-13 23:43:18.404102+00	password	054c9c8f-6a30-4bd3-8c03-ff48bdf2adfe
d9470680-18a7-4229-bb6a-54c19e02b66a	2026-08-13 23:44:26.430001+00	2026-08-13 23:44:26.430001+00	password	2692a71b-018e-4e20-bf7a-006171ee4325
105bef7b-969b-412a-814d-041aabb84b85	2026-08-13 23:44:26.430635+00	2026-08-13 23:44:26.430635+00	password	18504d1e-3872-4ed4-b16d-374060018712
f13d3131-5969-4ebd-9393-fa41fb259bd6	2026-08-13 23:44:26.436901+00	2026-08-13 23:44:26.436901+00	password	56543e32-909b-436f-9530-e5d4dac68dc5
3a468fbd-6184-4217-a81c-bf5424f7c35b	2026-08-13 23:44:26.530975+00	2026-08-13 23:44:26.530975+00	password	cdcc402d-9409-4454-9396-b90daa243041
14aa89b6-ef01-460c-a2c4-5d88f29aa347	2026-08-13 23:44:26.530975+00	2026-08-13 23:44:26.530975+00	password	a555ae6d-dc62-4a16-b33d-0d40d1a6cc5b
05a643fc-04f8-4ce9-b92f-5490d0e0f557	2026-08-13 23:44:26.534971+00	2026-08-13 23:44:26.534971+00	password	8a205191-edc9-4210-8685-13676d0215a6
c16d3b40-01a3-491b-af5b-9aaaec5350d8	2026-08-13 23:44:26.540703+00	2026-08-13 23:44:26.540703+00	password	99491e85-4cb3-4a32-b66e-6f2c3e1fe14f
bc3b0d8f-fd59-4382-884d-3408c909ee31	2026-08-13 23:44:26.541615+00	2026-08-13 23:44:26.541615+00	password	51015c8d-09fd-4870-8f10-4d0b40d3ce29
9c255ddf-d96e-4d07-9db6-fe977bd593a5	2026-08-13 23:44:26.543458+00	2026-08-13 23:44:26.543458+00	password	4d49a88c-827f-4d6e-9317-a73fadc84d23
df417782-dfd7-4788-ba67-a84e8072e170	2026-08-13 23:44:26.5451+00	2026-08-13 23:44:26.5451+00	password	8b3b6091-d228-432c-a963-5667a9687c9f
f6739dae-b50a-4de1-b651-42917db6f2a2	2026-08-13 23:44:26.545498+00	2026-08-13 23:44:26.545498+00	password	e98732ad-e50f-403b-a58a-414c0bfc69c6
69090e49-8213-422e-bbd3-862648689f3b	2026-08-13 23:44:26.547966+00	2026-08-13 23:44:26.547966+00	password	1eb00d68-9129-4f3b-9354-3391464a5719
4a8deb10-e216-4586-8d1a-bad860f1e2c9	2026-08-13 23:45:18.214936+00	2026-08-13 23:45:18.214936+00	password	1990a804-d16b-4279-a96e-131cd0785023
46f95cd2-2d0b-41a5-9dcb-be48b1241617	2026-08-13 23:45:18.216882+00	2026-08-13 23:45:18.216882+00	password	ef7a0d32-95d2-4826-859b-2296743b475e
d32d76c3-b7fd-468a-bef8-76bac202b992	2026-08-13 23:45:18.217806+00	2026-08-13 23:45:18.217806+00	password	57fea1f2-1c65-4a92-aa34-702b93715eb2
c4355c1a-109e-4ba2-a1c6-da700a839f1d	2026-08-13 23:45:18.350964+00	2026-08-13 23:45:18.350964+00	password	16813e69-27c0-4650-9d27-5164e9fb8fcb
c56713a0-bdb7-4122-b5b1-e4b89370767e	2026-08-13 23:45:18.352434+00	2026-08-13 23:45:18.352434+00	password	52ed794d-18f7-4650-a47b-1566a4d0e558
cd42f384-68c7-4a06-9d11-e676ce90be4f	2026-08-13 23:45:18.352252+00	2026-08-13 23:45:18.352252+00	password	f680c4bc-f291-4534-8fed-441a918bbbf0
9bb6b32c-5804-4bd4-bd63-cc48fc8197ee	2026-08-13 23:45:18.358223+00	2026-08-13 23:45:18.358223+00	password	d07c7dd9-b9b8-4b61-b9a3-a677068ec7c1
9c45c65c-a631-4a6c-980b-4f21f09bcc54	2026-08-13 23:45:18.359053+00	2026-08-13 23:45:18.359053+00	password	2322da7c-5ca3-4b18-97a5-92266475ca7d
4399a5b2-f0a6-4a8d-a355-d756d5432a8a	2026-08-13 23:45:18.359429+00	2026-08-13 23:45:18.359429+00	password	7ef9d987-9764-4443-8457-0664e4027bd8
248c1c7b-0f95-4e9e-b6ff-242661c537d4	2026-08-13 23:45:18.359929+00	2026-08-13 23:45:18.359929+00	password	72efbc36-9e01-4308-90c5-6276d8665357
f9695ad0-34e1-4dcd-8e88-fc6d1fa9fa68	2026-08-13 23:45:18.361728+00	2026-08-13 23:45:18.361728+00	password	53be8014-fcf8-4982-8190-b622d2ecf80b
6b7389f9-9259-4857-bdfe-f1a009a7a39f	2026-08-13 23:45:18.362935+00	2026-08-13 23:45:18.362935+00	password	602f3ee4-26a5-4958-a567-f5bd6e48a8f8
81e83d13-faef-4bc5-be0e-67b3361bd87b	2026-08-13 23:45:44.675065+00	2026-08-13 23:45:44.675065+00	password	59e36187-1bd0-4980-9aef-d600631f990c
a6a1c8f0-58f2-47dc-b82d-127bf4e28791	2026-08-13 23:45:44.675925+00	2026-08-13 23:45:44.675925+00	password	c7ea4355-639d-4b85-b843-76ae0a62fb77
45a5d384-bba6-42bb-b7c0-2c9d403d455c	2026-08-13 23:45:44.678168+00	2026-08-13 23:45:44.678168+00	password	db16d625-0b59-4e38-812d-d0bf4c1cc4d7
0190e3e8-ff41-4745-abe7-9a8136faa9b7	2026-08-13 23:45:44.771326+00	2026-08-13 23:45:44.771326+00	password	4d135f59-3257-4c2d-a574-a0230a06cce2
c8acc2e9-12d7-4653-b526-04d2236e1682	2026-08-13 23:45:44.774738+00	2026-08-13 23:45:44.774738+00	password	0c3791c4-0c2e-461d-bd37-cc013a721514
4f53ec0d-e22f-445c-9a71-85a1d8aa8d30	2026-08-13 23:45:44.775147+00	2026-08-13 23:45:44.775147+00	password	4f96fe62-039f-4890-80ae-c18e14166763
4398d8dc-22c8-4daa-a3b0-92a8a1e55ec3	2026-08-13 23:45:44.779086+00	2026-08-13 23:45:44.779086+00	password	52205b21-e7b4-43e9-84de-bc8390382ebc
843c1548-41ab-496a-8294-c8bbf286e3fe	2026-08-13 23:45:44.778925+00	2026-08-13 23:45:44.778925+00	password	c785a3a4-4bfa-447f-bfb9-394bf0da945f
997e984c-5297-4da2-be24-b3ff52a08980	2026-08-13 23:45:44.778928+00	2026-08-13 23:45:44.778928+00	password	034296be-5cef-4647-b0af-1a6cf79bb4c6
0d7590e2-5381-4f8f-95d4-0230a9fc50b5	2026-08-13 23:45:44.781442+00	2026-08-13 23:45:44.781442+00	password	dbdc9a8c-93a7-4dd5-800d-8e97c2ea1e7c
03dbb9b3-f806-40f6-a49b-9488f5a3c70c	2026-08-13 23:45:44.785058+00	2026-08-13 23:45:44.785058+00	password	f447480b-ca4a-4155-99ab-5e8efb5fcceb
570b6030-9197-4a5a-aba3-ecb21b4fcf67	2026-08-13 23:45:44.796631+00	2026-08-13 23:45:44.796631+00	password	b7300630-fc7f-4f4c-92ec-04f65821b53a
0f5b37e3-1226-4136-a705-e4cb0ec04d92	2026-08-13 23:46:00.176453+00	2026-08-13 23:46:00.176453+00	password	ee5951bb-ea50-4ae0-b89b-91834f76c66c
15598ad6-3d24-4771-a19e-5e094c859653	2026-08-13 23:46:00.176459+00	2026-08-13 23:46:00.176459+00	password	61496d7f-5d91-4fa8-a527-c68b299086b4
c15126c4-5430-4cbf-babe-e9a0e8ba1dfa	2026-08-13 23:46:00.177507+00	2026-08-13 23:46:00.177507+00	password	666fef61-c4c3-4b45-8441-8780f3aa79d0
f66a9367-911a-4663-851b-cd01480f6329	2026-08-13 23:46:08.92796+00	2026-08-13 23:46:08.92796+00	password	4becdc21-f9b3-4e5b-823e-b384d8fa758e
fc7e4d28-d2c2-4acc-a574-8364c42c8aed	2026-08-13 23:46:08.928047+00	2026-08-13 23:46:08.928047+00	password	76791797-cb6c-43f4-ba0c-2298f616404b
7bf1f0d7-3a21-4fe6-8b68-42345aefb470	2026-08-13 23:46:08.928744+00	2026-08-13 23:46:08.928744+00	password	0dee6f96-5515-41f5-9be3-2e966439fbd1
c19c026b-b89e-4f13-9471-3190ac93bf7b	2026-08-13 23:46:48.161016+00	2026-08-13 23:46:48.161016+00	password	a1b19b91-99e1-42da-bcce-7513fe3e5b03
a3d67c86-accd-43e4-944c-516c530c5120	2026-08-13 23:46:48.161022+00	2026-08-13 23:46:48.161022+00	password	e1eec29e-b4cf-44ce-aa53-4ee31705ee46
363e11b4-191d-45d6-8b85-63e5e53d1867	2026-08-13 23:46:48.161679+00	2026-08-13 23:46:48.161679+00	password	bcdbe62f-e59e-4fcb-ad26-64de89747e6d
b182aef0-64ef-44b8-9536-8587392400b4	2026-08-13 23:46:48.521742+00	2026-08-13 23:46:48.521742+00	password	a16fdb7c-d70c-430f-8705-4d6fae2e9dd1
27c2e1a1-9cf0-4ce4-849f-875b43802d9f	2026-08-13 23:46:48.521741+00	2026-08-13 23:46:48.521741+00	password	c2db159a-19d1-4119-aa2a-0511ad0ed53f
cc4b213e-a314-4ff4-ae9d-95f401d5be1c	2026-08-13 23:46:48.522589+00	2026-08-13 23:46:48.522589+00	password	8c83063d-5cd7-4eea-8b90-15c93132802c
fca5b198-0879-424d-b74b-71c4e259fbc7	2026-08-13 23:46:48.891128+00	2026-08-13 23:46:48.891128+00	password	d8cc8ab2-52c3-4b9e-ae22-b0858d9aa29c
2284a547-ede4-462e-9746-4f02055a8c2f	2026-08-13 23:46:48.89134+00	2026-08-13 23:46:48.89134+00	password	04f939ff-b7fa-49bc-aaad-5f2def83a63e
091ee76a-2387-49ec-96ed-9edade77e7af	2026-08-13 23:46:48.892199+00	2026-08-13 23:46:48.892199+00	password	f4704a66-288e-48a6-857b-fdf70aec2f06
9e6f0c29-6a57-489f-bb77-8ac42d307e61	2026-08-13 23:46:49.392751+00	2026-08-13 23:46:49.392751+00	password	526fba9b-a8ae-40d0-a9a7-557e9382fffc
339c2340-c61a-44fc-a6ec-e381bfdc2462	2026-08-13 23:46:49.397831+00	2026-08-13 23:46:49.397831+00	password	f1485db5-0c11-4b21-8225-376714b0cad2
943827e7-2364-4c66-98d5-813f955edc2f	2026-08-13 23:46:49.400162+00	2026-08-13 23:46:49.400162+00	password	40827f1d-03cb-47cc-9cd5-7f38a0564a9d
b368d347-b60d-4b46-84fa-5212dbc62abc	2026-08-14 00:28:44.419086+00	2026-08-14 00:28:44.419086+00	password	0378882b-033b-42d7-ad4a-0d0acceb39f2
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	2	5oacin3xv4yr	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:10:22.350837+00	2026-08-13 16:10:22.350837+00	\N	35551139-51e2-4c4a-976c-91ea77265410
00000000-0000-0000-0000-000000000000	3	gsw6ixw5bjom	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:10:22.351326+00	2026-08-13 16:10:22.351326+00	\N	6b8da558-b4ea-4ae8-986a-647c871a184f
00000000-0000-0000-0000-000000000000	150	m7e2sogfxy6z	11111111-1111-4111-8111-111111111111	f	2026-08-13 22:47:57.285179+00	2026-08-13 22:47:57.285179+00	\N	ca8941bb-6b1d-4672-b674-4d9889fc26c1
00000000-0000-0000-0000-000000000000	6	j4k5jxgya7da	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:10:22.350208+00	2026-08-13 16:10:22.350208+00	\N	fc03b936-9146-447b-9fd1-2673cab0115e
00000000-0000-0000-0000-000000000000	153	4nzl72mu5xnw	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:35:53.792312+00	2026-08-13 23:35:53.792312+00	\N	40366835-5e47-4d1d-9ce1-c6d7fc74cada
00000000-0000-0000-0000-000000000000	156	e5m4qokepiym	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:35:53.796453+00	2026-08-13 23:35:53.796453+00	\N	6bd783f2-b407-4394-9ab0-60584a5d0aaf
00000000-0000-0000-0000-000000000000	9	a46qyrcmk6jl	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:10:22.354607+00	2026-08-13 16:10:22.354607+00	\N	15c4a5cf-fe16-487d-aa61-b6f5656677eb
00000000-0000-0000-0000-000000000000	10	tkmzwtglol5g	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:10:22.359176+00	2026-08-13 16:10:22.359176+00	\N	028b9a58-11ad-4e6d-bb59-41501088302e
00000000-0000-0000-0000-000000000000	11	5gvsy5xdw3f5	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:10:22.359501+00	2026-08-13 16:10:22.359501+00	\N	86731a27-af39-4fa7-ad0b-63e5a06c95fc
00000000-0000-0000-0000-000000000000	12	o2v6pog3xzer	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:10:22.362956+00	2026-08-13 16:10:22.362956+00	\N	2095b103-0acb-4414-aa6b-b2da7f61d494
00000000-0000-0000-0000-000000000000	13	iinidaccltn7	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:10:22.362911+00	2026-08-13 16:10:22.362911+00	\N	a2313c54-dcb6-45d7-bc2b-110c6e7811bd
00000000-0000-0000-0000-000000000000	16	s2d6l62ibuze	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:49:09.676624+00	2026-08-13 16:49:09.676624+00	\N	a590805c-7635-46ae-a6b3-ac5867c145f9
00000000-0000-0000-0000-000000000000	14	4dssipdp53mu	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:49:09.678017+00	2026-08-13 16:49:09.678017+00	\N	77924229-abe7-4cbd-956f-077efe76f139
00000000-0000-0000-0000-000000000000	17	3f4whscg75iu	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:49:09.678644+00	2026-08-13 16:49:09.678644+00	\N	b51f9a64-8384-4edc-bff7-50cd39e6d8e5
00000000-0000-0000-0000-000000000000	159	k2vs4y5mwrop	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:35:53.801579+00	2026-08-13 23:35:53.801579+00	\N	44579d6a-1450-4095-a376-95a15fd01c90
00000000-0000-0000-0000-000000000000	18	moffuxx7l5pu	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:49:09.679699+00	2026-08-13 16:49:09.679699+00	\N	b3386d44-e1e0-4d7c-b9eb-2dd05c335793
00000000-0000-0000-0000-000000000000	19	lvo3d6vix62r	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:49:09.679921+00	2026-08-13 16:49:09.679921+00	\N	f7e43e6b-890d-4ece-8bff-17e9d2931049
00000000-0000-0000-0000-000000000000	162	aexhd7xxllh4	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:35:53.813425+00	2026-08-13 23:35:53.813425+00	\N	96199346-6adf-4be4-9fb9-2b7a0706d7c9
00000000-0000-0000-0000-000000000000	21	pgpbjz4dtamk	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:49:09.680706+00	2026-08-13 16:49:09.680706+00	\N	b4d8daad-11fd-4f72-8a55-029f22f0008e
00000000-0000-0000-0000-000000000000	22	okgwc6jijs45	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:49:09.683106+00	2026-08-13 16:49:09.683106+00	\N	48ff2afd-8469-46fa-9f9f-43ec83a1d455
00000000-0000-0000-0000-000000000000	23	it5lhk4mfa7t	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:49:09.683244+00	2026-08-13 16:49:09.683244+00	\N	6f4bcd83-e1cf-4d72-b7ec-fab6a279f611
00000000-0000-0000-0000-000000000000	166	fhmrlqvy3bzc	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:36:18.526153+00	2026-08-13 23:36:18.526153+00	\N	0f8aabb0-35f4-4f3f-b3c9-a667a9416928
00000000-0000-0000-0000-000000000000	168	ueqixeyxqqoo	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:36:18.531945+00	2026-08-13 23:36:18.531945+00	\N	f0de650e-c81a-4307-a36f-dc7edd3191f6
00000000-0000-0000-0000-000000000000	172	6hucdwleuexh	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:36:18.534249+00	2026-08-13 23:36:18.534249+00	\N	9b44cdef-db66-4ffc-a459-34dfa2cc424d
00000000-0000-0000-0000-000000000000	174	yszcnb4qsudj	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:36:18.541089+00	2026-08-13 23:36:18.541089+00	\N	df058c1e-58cd-45bc-8404-eab75bdfd7aa
00000000-0000-0000-0000-000000000000	178	kt4oxgiex7xy	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:38:46.574154+00	2026-08-13 23:38:46.574154+00	\N	a276db6d-5ed6-439d-906a-f4b158a836c7
00000000-0000-0000-0000-000000000000	182	iva5ox3exj2h	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:38:46.588705+00	2026-08-13 23:38:46.588705+00	\N	51a7a206-b149-4852-8f17-41105f73dc2a
00000000-0000-0000-0000-000000000000	183	dsnipqrqj364	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:38:46.666717+00	2026-08-13 23:38:46.666717+00	\N	6f521325-642c-4661-8c03-ab03a81afced
00000000-0000-0000-0000-000000000000	31	hghxucczbzhc	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:49:44.940185+00	2026-08-13 16:49:44.940185+00	\N	98b842be-abd3-408e-9386-0168995cf889
00000000-0000-0000-0000-000000000000	32	s4kaihr5ivos	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:50:01.459068+00	2026-08-13 16:50:01.459068+00	\N	77373c38-2444-4561-8f2a-370bdef5d875
00000000-0000-0000-0000-000000000000	187	2dfwmcgpyeua	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:38:46.676982+00	2026-08-13 23:38:46.676982+00	\N	4a78a40e-395e-4fd5-96bc-82bf5d90db8e
00000000-0000-0000-0000-000000000000	189	pocvckmbn6go	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:13.971875+00	2026-08-13 23:39:13.971875+00	\N	c3f9b27e-3f1e-436b-834b-2a8820d4f483
00000000-0000-0000-0000-000000000000	192	s2kmn4gyeqji	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:13.984709+00	2026-08-13 23:39:13.984709+00	\N	8a519762-b87a-4f02-89e2-da24afce9ee6
00000000-0000-0000-0000-000000000000	195	4png53m7r7wk	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:14.085766+00	2026-08-13 23:39:14.085766+00	\N	d8b48198-2ba0-40d1-a0bf-ea8f5372e5b3
00000000-0000-0000-0000-000000000000	198	3dpul7d7mxnr	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:14.09842+00	2026-08-13 23:39:14.09842+00	\N	50164be0-dc4c-4fde-beab-48fed3281a0a
00000000-0000-0000-0000-000000000000	201	qx2svvt67aqb	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:39.962095+00	2026-08-13 23:39:39.962095+00	\N	4d23128c-9d23-4437-a108-6566acc9a998
00000000-0000-0000-0000-000000000000	39	6mmzry57ufhz	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:52:38.948287+00	2026-08-13 16:52:38.948287+00	\N	2605e123-6ec9-48c9-9929-4e93f0f67f24
00000000-0000-0000-0000-000000000000	40	7ovjgu2hbupf	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:52:41.004261+00	2026-08-13 16:52:41.004261+00	\N	eb12d04d-462e-4dea-9ff6-5b6ca57bf81a
00000000-0000-0000-0000-000000000000	205	npocixn2bzbb	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:39.967011+00	2026-08-13 23:39:39.967011+00	\N	330fe554-9404-4694-b1b3-00fdebffa0d8
00000000-0000-0000-0000-000000000000	207	qtnkzbhhmmi4	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:40.073665+00	2026-08-13 23:39:40.073665+00	\N	035dbb20-8fc8-4025-a0af-1751a58ca959
00000000-0000-0000-0000-000000000000	210	6rbqcpwlk3gc	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:40.080583+00	2026-08-13 23:39:40.080583+00	\N	e9dc2f75-e58d-4af2-addb-6773d43480bd
00000000-0000-0000-0000-000000000000	212	g2czwl2im2wv	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:40.091558+00	2026-08-13 23:39:40.091558+00	\N	24bd3b48-1874-4ddd-899a-d5e0862f60b4
00000000-0000-0000-0000-000000000000	214	4cwj4lvgntdd	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:40:05.188021+00	2026-08-13 23:40:05.188021+00	\N	aa38e1c2-5c53-4733-85bc-25ff0eb46813
00000000-0000-0000-0000-000000000000	216	viciyarev3kz	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:40:05.192132+00	2026-08-13 23:40:05.192132+00	\N	519e8042-5a7d-41e2-bb92-a8654fed37b9
00000000-0000-0000-0000-000000000000	47	b235jr5wyv53	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:53:37.715843+00	2026-08-13 16:53:37.715843+00	\N	de72c5f0-d340-45da-ae13-38c3587d08ea
00000000-0000-0000-0000-000000000000	48	x7er45f6c7y5	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:53:39.601178+00	2026-08-13 16:53:39.601178+00	\N	13676f0e-63ff-4012-b880-249b7f295231
00000000-0000-0000-0000-000000000000	218	itrkfgzpjdup	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:40:05.273329+00	2026-08-13 23:40:05.273329+00	\N	664ad403-2d76-42d1-855d-be6d7e6e61e4
00000000-0000-0000-0000-000000000000	220	pgnp23d7otji	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:40:05.367263+00	2026-08-13 23:40:05.367263+00	\N	5c72cddc-ddea-4bd3-9f51-21d6bf6a6df8
00000000-0000-0000-0000-000000000000	222	5po5agvwn4ax	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:40:05.381259+00	2026-08-13 23:40:05.381259+00	\N	be5e7161-30cf-4df1-92c0-dae43aada6cb
00000000-0000-0000-0000-000000000000	223	wrmbhqkot6bx	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:40:05.388729+00	2026-08-13 23:40:05.388729+00	\N	eceab32b-9fa7-4226-a6a3-ba7975a2f06b
00000000-0000-0000-0000-000000000000	224	tp5o65zo6eco	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:40:05.392304+00	2026-08-13 23:40:05.392304+00	\N	877445df-7132-4bcd-8c52-3d103785c719
00000000-0000-0000-0000-000000000000	225	fnkod6s7bpvn	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:40:05.393562+00	2026-08-13 23:40:05.393562+00	\N	bcc12774-8652-49c3-b2dc-f78775f89846
00000000-0000-0000-0000-000000000000	55	ytwlvio5hsqo	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:54:23.020276+00	2026-08-13 16:54:23.020276+00	\N	1370e6ca-6b6d-4599-9c84-c33f9ce77743
00000000-0000-0000-0000-000000000000	56	ogxtzutvey3k	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:54:24.990822+00	2026-08-13 16:54:24.990822+00	\N	184506a4-3d13-4551-8def-cdee5feb4559
00000000-0000-0000-0000-000000000000	148	tzhgajywxrkb	11111111-1111-4111-8111-111111111111	f	2026-08-13 22:36:10.43583+00	2026-08-13 22:36:10.43583+00	\N	97a1d818-66d9-4cc4-b195-8d9cab4ef020
00000000-0000-0000-0000-000000000000	151	hmettlzzh7rb	11111111-1111-4111-8111-111111111111	f	2026-08-13 22:57:13.619631+00	2026-08-13 22:57:13.619631+00	\N	18276dfa-26cc-4f85-8394-27b950c5c238
00000000-0000-0000-0000-000000000000	58	lx5adg3tvky2	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:56:48.918481+00	2026-08-13 16:56:48.918481+00	\N	4eaafeae-0a0b-458e-8254-551c0a33bfae
00000000-0000-0000-0000-000000000000	60	pvtj36dqd3tz	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:56:48.919795+00	2026-08-13 16:56:48.919795+00	\N	b22c0053-4658-4765-b901-1451066ec9a7
00000000-0000-0000-0000-000000000000	61	nbwsqy5sdcdk	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:56:48.9207+00	2026-08-13 16:56:48.9207+00	\N	f8834fb6-d591-4cbf-97e8-e0ffae962418
00000000-0000-0000-0000-000000000000	62	7wkg3qbltbxi	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:56:48.924212+00	2026-08-13 16:56:48.924212+00	\N	27efef7f-e952-4824-920d-1f44512e94c3
00000000-0000-0000-0000-000000000000	63	bxg75nieuljt	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:56:48.926545+00	2026-08-13 16:56:48.926545+00	\N	78c71a83-0437-4ae7-a592-181e71334690
00000000-0000-0000-0000-000000000000	65	phj43gmbszrf	33333333-3333-4333-8333-333333333333	f	2026-08-13 16:56:48.930204+00	2026-08-13 16:56:48.930204+00	\N	9ffdd3e7-15a7-42a8-9a73-cbe3260bdf77
00000000-0000-0000-0000-000000000000	64	4z5obwmhzv2g	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:56:48.929172+00	2026-08-13 16:56:48.929172+00	\N	819b6657-640e-4127-83ba-31e2e3196895
00000000-0000-0000-0000-000000000000	154	eyjiglvr5euz	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:35:53.792561+00	2026-08-13 23:35:53.792561+00	\N	79755d3e-66e7-47cb-90e2-21bb6725b3c9
00000000-0000-0000-0000-000000000000	158	uvcpnlobjg3d	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:35:53.799055+00	2026-08-13 23:35:53.799055+00	\N	5bf812cb-4a8c-4ee6-9338-c89e13ac7ca9
00000000-0000-0000-0000-000000000000	68	ked6u35hlqwa	22222222-2222-4222-8222-222222222222	f	2026-08-13 16:56:48.934729+00	2026-08-13 16:56:48.934729+00	\N	94d54950-eb8a-402b-bec1-15c2956f6228
00000000-0000-0000-0000-000000000000	160	c6s6hczbzjji	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:35:53.807041+00	2026-08-13 23:35:53.807041+00	\N	1d3d1178-6a1f-4974-a8d1-b8050c6f996d
00000000-0000-0000-0000-000000000000	163	wbbsszyrffgv	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:35:53.814633+00	2026-08-13 23:35:53.814633+00	\N	7b9db1b7-616d-4452-90e4-5fa059628433
00000000-0000-0000-0000-000000000000	70	z67d33ert32p	22222222-2222-4222-8222-222222222222	f	2026-08-13 17:23:13.58733+00	2026-08-13 17:23:13.58733+00	\N	cdc72b80-505e-451b-a26e-38fa9ebead2c
00000000-0000-0000-0000-000000000000	71	fwrwlesv3uwe	33333333-3333-4333-8333-333333333333	f	2026-08-13 17:23:13.620885+00	2026-08-13 17:23:13.620885+00	\N	845c6efa-adf6-4e12-83f6-23c01d395299
00000000-0000-0000-0000-000000000000	165	fkshptwvalpf	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:36:18.523421+00	2026-08-13 23:36:18.523421+00	\N	365bf5ac-ffac-42bc-83e8-07b1c6049447
00000000-0000-0000-0000-000000000000	73	gofavgo4psjj	22222222-2222-4222-8222-222222222222	f	2026-08-13 17:23:13.649378+00	2026-08-13 17:23:13.649378+00	\N	1570802b-b29c-402a-973d-cbd69983e08c
00000000-0000-0000-0000-000000000000	74	crad7kxhwwei	22222222-2222-4222-8222-222222222222	f	2026-08-13 17:23:13.668318+00	2026-08-13 17:23:13.668318+00	\N	1e9e1312-b7a8-4d48-a906-b78857a45190
00000000-0000-0000-0000-000000000000	169	madivytlio46	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:36:18.532562+00	2026-08-13 23:36:18.532562+00	\N	db33cd17-755c-458a-9ad0-413ac8818146
00000000-0000-0000-0000-000000000000	170	gcgxa6oc5uia	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:36:18.532577+00	2026-08-13 23:36:18.532577+00	\N	25aafe6f-ce7e-440f-a00f-95eaf6621e1b
00000000-0000-0000-0000-000000000000	175	3akr62crkx4e	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:36:18.542835+00	2026-08-13 23:36:18.542835+00	\N	96db6eda-2bb0-47a5-8bda-0ed2544ac3bb
00000000-0000-0000-0000-000000000000	78	qrtxr5mmgwkt	33333333-3333-4333-8333-333333333333	f	2026-08-13 17:23:13.69002+00	2026-08-13 17:23:13.69002+00	\N	1efdbba5-e258-4899-b731-88a10edca4a0
00000000-0000-0000-0000-000000000000	79	47qm3mesv76l	33333333-3333-4333-8333-333333333333	f	2026-08-13 17:23:13.70494+00	2026-08-13 17:23:13.70494+00	\N	557dfa6e-2168-41ac-b8a1-66d312c035a8
00000000-0000-0000-0000-000000000000	80	gihx3kouznbe	33333333-3333-4333-8333-333333333333	f	2026-08-13 17:23:13.709733+00	2026-08-13 17:23:13.709733+00	\N	f72c393d-8a28-4940-8cd9-e6ee4977c0c6
00000000-0000-0000-0000-000000000000	81	qfufy5jyc76v	22222222-2222-4222-8222-222222222222	f	2026-08-13 17:23:13.723724+00	2026-08-13 17:23:13.723724+00	\N	fa71c2ed-cf60-4405-b7de-dc24cce9471b
00000000-0000-0000-0000-000000000000	177	pgkwglblbi3s	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:38:46.573701+00	2026-08-13 23:38:46.573701+00	\N	6da85615-776f-42dd-a2d2-86f43518acd1
00000000-0000-0000-0000-000000000000	180	d3mcfxow6ijv	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:38:46.587901+00	2026-08-13 23:38:46.587901+00	\N	14400a53-7104-4380-bc0b-9a7ab3d1206a
00000000-0000-0000-0000-000000000000	84	zvl7mvt2euez	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:17:44.020174+00	2026-08-13 18:17:44.020174+00	\N	c7fc538c-f3a4-4a26-ac16-627afe1699fb
00000000-0000-0000-0000-000000000000	184	hd64uyi5w5og	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:38:46.669168+00	2026-08-13 23:38:46.669168+00	\N	df659605-86ba-4efc-b29b-7192637d9574
00000000-0000-0000-0000-000000000000	86	ym7pgfhlkb2u	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:17:44.021474+00	2026-08-13 18:17:44.021474+00	\N	46f9368a-961a-47b4-b5a4-8cd957ed376e
00000000-0000-0000-0000-000000000000	186	zwkb4e7otmgz	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:38:46.676938+00	2026-08-13 23:38:46.676938+00	\N	52a57bf1-0382-4df4-82c1-06d9c4d83a77
00000000-0000-0000-0000-000000000000	88	a5kuwibarmt3	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:17:44.039698+00	2026-08-13 18:17:44.039698+00	\N	b81345b1-c9b3-4f61-92b8-5e3d78dc8c0a
00000000-0000-0000-0000-000000000000	190	45tdzqwc377b	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:13.979743+00	2026-08-13 23:39:13.979743+00	\N	bdd1d6c3-387d-408e-be73-15fab06abc0f
00000000-0000-0000-0000-000000000000	90	hphavvt7o2k3	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:17:44.038215+00	2026-08-13 18:17:44.038215+00	\N	5b938a0a-3088-490a-a215-010e59f6edfd
00000000-0000-0000-0000-000000000000	91	ai3rqfeukz5y	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:17:44.047405+00	2026-08-13 18:17:44.047405+00	\N	9bf1b4f0-3a20-4d4f-826f-c37b5c13e253
00000000-0000-0000-0000-000000000000	92	jywge7iod5gu	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:17:44.047554+00	2026-08-13 18:17:44.047554+00	\N	f9c90df0-42f6-45e6-9cd2-583871a3111d
00000000-0000-0000-0000-000000000000	93	rd6cdp4aeubo	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:17:44.05678+00	2026-08-13 18:17:44.05678+00	\N	04c74354-7531-4796-b002-5eb48be94552
00000000-0000-0000-0000-000000000000	94	pkcqlnc4vg2x	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:17:44.069244+00	2026-08-13 18:17:44.069244+00	\N	2f1e5c0e-a7b2-4eb5-bfd8-6899b7779300
00000000-0000-0000-0000-000000000000	193	3455ime6532l	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:13.99013+00	2026-08-13 23:39:13.99013+00	\N	a8a2c7f8-2b78-40e8-901d-6cc4f062a9a2
00000000-0000-0000-0000-000000000000	196	o7ufv67dnfyx	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:14.086076+00	2026-08-13 23:39:14.086076+00	\N	a7984518-76d8-46fb-bf5f-e62b976d9472
00000000-0000-0000-0000-000000000000	96	mkcw6hg5pcp2	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:19:15.005301+00	2026-08-13 18:19:15.005301+00	\N	aa829281-31c5-480b-bfd6-1fb2aea67bc0
00000000-0000-0000-0000-000000000000	97	zlfi4h5mlz3y	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:19:15.007011+00	2026-08-13 18:19:15.007011+00	\N	9c47638d-cbe3-471d-8c41-dca3f34122ac
00000000-0000-0000-0000-000000000000	99	3puwrj22zggc	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:19:15.008683+00	2026-08-13 18:19:15.008683+00	\N	8b087e1f-b264-4aca-8228-c9176cfb09bf
00000000-0000-0000-0000-000000000000	199	3e2drwxke2ez	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:14.099129+00	2026-08-13 23:39:14.099129+00	\N	2a2bbc41-0249-4f2d-9744-51f655a89250
00000000-0000-0000-0000-000000000000	202	6vhj665euvp3	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:39.963527+00	2026-08-13 23:39:39.963527+00	\N	b826d386-5eb6-4c8d-a8e9-9fbd7b22496b
00000000-0000-0000-0000-000000000000	102	xdzvycy3ixjm	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:19:15.012944+00	2026-08-13 18:19:15.012944+00	\N	af2d3644-c6ae-46d6-9ab8-b6b41d99a119
00000000-0000-0000-0000-000000000000	103	wv6r4jlt6cj4	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:19:15.012831+00	2026-08-13 18:19:15.012831+00	\N	a99ac20f-49f8-4f0f-bc51-ca1425f6cea0
00000000-0000-0000-0000-000000000000	104	y4sgeikdd3qe	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:19:15.015337+00	2026-08-13 18:19:15.015337+00	\N	c2e218fb-ff19-4cae-8f58-1ca0bbf82578
00000000-0000-0000-0000-000000000000	105	jvxjmyctvml3	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:19:15.018858+00	2026-08-13 18:19:15.018858+00	\N	9ead7b32-d30f-4e6c-98fd-20c7f1e27972
00000000-0000-0000-0000-000000000000	106	xgde34d7hjku	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:19:15.028207+00	2026-08-13 18:19:15.028207+00	\N	7fcf0f13-78fc-418c-8412-863721c697d3
00000000-0000-0000-0000-000000000000	107	w7sfaamb74b6	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:20:04.310361+00	2026-08-13 18:20:04.310361+00	\N	4dc88b30-429c-40d9-b43c-0f987928eda2
00000000-0000-0000-0000-000000000000	204	eabjdakh6qmc	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:39.965389+00	2026-08-13 23:39:39.965389+00	\N	eba000e6-4642-45a4-8531-97108da38fd2
00000000-0000-0000-0000-000000000000	208	wd4bzddzad4h	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:40.07355+00	2026-08-13 23:39:40.07355+00	\N	758aac43-b2ab-471d-abbd-7f6a94bfe8b2
00000000-0000-0000-0000-000000000000	110	xtnloned6frd	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:20:04.31561+00	2026-08-13 18:20:04.31561+00	\N	1a0ae2f3-f0ae-453a-a4a4-0f0c62ff397a
00000000-0000-0000-0000-000000000000	111	4qbomdkdsvru	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:20:04.317761+00	2026-08-13 18:20:04.317761+00	\N	929f75cd-9751-4e81-bc5f-e3376a3060d3
00000000-0000-0000-0000-000000000000	114	5n2xcdc7lct3	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:20:04.319382+00	2026-08-13 18:20:04.319382+00	\N	1a847ded-8863-4db6-bb1c-62233578dbc9
00000000-0000-0000-0000-000000000000	115	szqewc3qxwox	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:20:04.318311+00	2026-08-13 18:20:04.318311+00	\N	4b7fe127-f8d6-4992-aa35-59e4556cf463
00000000-0000-0000-0000-000000000000	116	4pfclx7iawet	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:20:04.321226+00	2026-08-13 18:20:04.321226+00	\N	f4cdaf2a-6ac8-4844-b585-2e95e111dbe0
00000000-0000-0000-0000-000000000000	117	vc2fl42lvcft	33333333-3333-4333-8333-333333333333	f	2026-08-13 18:20:04.323049+00	2026-08-13 18:20:04.323049+00	\N	11812edb-ddd1-4c95-95bd-8a14cefc67ba
00000000-0000-0000-0000-000000000000	118	25cooi7wgajm	22222222-2222-4222-8222-222222222222	f	2026-08-13 18:20:04.332696+00	2026-08-13 18:20:04.332696+00	\N	566b49c0-00f3-48c9-95c9-00dd888408b3
00000000-0000-0000-0000-000000000000	152	t6a6dtvqdms2	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:29:09.604896+00	2026-08-13 23:29:09.604896+00	\N	8c4c28f5-9b06-4eb2-ac04-794bfba66362
00000000-0000-0000-0000-000000000000	155	xviafdjwmwom	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:35:53.797392+00	2026-08-13 23:35:53.797392+00	\N	f16655a2-4830-486e-b10f-c2bf34accf02
00000000-0000-0000-0000-000000000000	120	vek36sljepyx	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:06:53.668597+00	2026-08-13 19:06:53.668597+00	\N	5e740572-cb19-4896-b0b5-49471c0d9bfe
00000000-0000-0000-0000-000000000000	157	rw3y7kqj7cso	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:35:53.796305+00	2026-08-13 23:35:53.796305+00	\N	213f3bb0-cdd9-43ac-ab38-f20a59be6c5a
00000000-0000-0000-0000-000000000000	122	hzvvnfq4vs4t	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:06:53.675733+00	2026-08-13 19:06:53.675733+00	\N	315c4f26-3628-40ae-b0b8-2fdb396b4f21
00000000-0000-0000-0000-000000000000	123	pfsgdoaglhk7	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:06:53.677387+00	2026-08-13 19:06:53.677387+00	\N	35be98f6-bd3d-4d53-a627-9372926e65df
00000000-0000-0000-0000-000000000000	161	2o2ce2xpglh5	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:35:53.808553+00	2026-08-13 23:35:53.808553+00	\N	d273a4a1-2c0f-4ad9-97f9-c5eb2629c00a
00000000-0000-0000-0000-000000000000	125	xqnz2d763vli	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:06:53.677502+00	2026-08-13 19:06:53.677502+00	\N	cc25a169-d60c-440c-ab77-c11f7b3bc598
00000000-0000-0000-0000-000000000000	126	lffojbjibjpx	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:06:53.684803+00	2026-08-13 19:06:53.684803+00	\N	32042a20-eced-469e-a386-5f9f91260549
00000000-0000-0000-0000-000000000000	164	774z6blczklp	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:35:53.826291+00	2026-08-13 23:35:53.826291+00	\N	9df5762b-7e66-4603-b065-66d2436ba920
00000000-0000-0000-0000-000000000000	127	f4bosd7sm6cj	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:06:53.689981+00	2026-08-13 19:06:53.689981+00	\N	7f9aabd2-916b-4040-8a1f-4c230589c5d8
00000000-0000-0000-0000-000000000000	129	nyvejx2jpo72	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:06:53.691633+00	2026-08-13 19:06:53.691633+00	\N	f0022577-f0f2-4eab-bd67-ce58ffab6d32
00000000-0000-0000-0000-000000000000	167	z42abmlq2agc	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:36:18.528918+00	2026-08-13 23:36:18.528918+00	\N	4230d49d-65d7-49fa-a0e6-3bffdb6f6a72
00000000-0000-0000-0000-000000000000	131	gafzvxabit3b	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:06:53.699318+00	2026-08-13 19:06:53.699318+00	\N	e93d8c85-8c0f-4bdb-8746-0dff950b04ed
00000000-0000-0000-0000-000000000000	171	ajurm6tlelhm	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:36:18.532602+00	2026-08-13 23:36:18.532602+00	\N	64b91055-dcbf-42ca-9f16-ee7d618f742c
00000000-0000-0000-0000-000000000000	133	zsiwxeinxeku	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:09:34.697041+00	2026-08-13 19:09:34.697041+00	\N	d20f33d6-2c27-46bf-a09f-69b435d02fdd
00000000-0000-0000-0000-000000000000	134	g2oh22r2uyv7	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:09:34.697109+00	2026-08-13 19:09:34.697109+00	\N	fbcb895f-7c58-498b-a2a5-15dc5541ee2c
00000000-0000-0000-0000-000000000000	135	kqtfphuqyfag	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:09:34.703982+00	2026-08-13 19:09:34.703982+00	\N	d126d77a-84f0-4aea-9c72-4678938aeda8
00000000-0000-0000-0000-000000000000	173	dgmsl4k7p4rn	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:36:18.538389+00	2026-08-13 23:36:18.538389+00	\N	576abb2f-acfd-4b2b-8a21-781f5c5cf9db
00000000-0000-0000-0000-000000000000	137	al7u5msyyae4	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:09:34.7063+00	2026-08-13 19:09:34.7063+00	\N	9c0a66f0-b47d-43ed-960d-65e3726bfa21
00000000-0000-0000-0000-000000000000	138	jzpdvttstand	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:09:34.709991+00	2026-08-13 19:09:34.709991+00	\N	d1529269-8e0d-4164-b735-8cdb0e91f61c
00000000-0000-0000-0000-000000000000	176	7mpkrylmvryb	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:36:18.548744+00	2026-08-13 23:36:18.548744+00	\N	71973fe7-52bb-4105-8262-2262c610a772
00000000-0000-0000-0000-000000000000	140	2mi5mqwavyy2	22222222-2222-4222-8222-222222222222	f	2026-08-13 19:09:34.709026+00	2026-08-13 19:09:34.709026+00	\N	443d15ac-7130-4da3-9375-6ff5a3868ee8
00000000-0000-0000-0000-000000000000	179	kzfusmn6xkew	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:38:46.574357+00	2026-08-13 23:38:46.574357+00	\N	9d3fedb4-c26e-4cee-a7e9-46b7e3bba5c2
00000000-0000-0000-0000-000000000000	142	jjtgck2sacbj	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:09:34.714999+00	2026-08-13 19:09:34.714999+00	\N	b8a74f85-ca02-4a51-8022-866cc6be0d03
00000000-0000-0000-0000-000000000000	143	gf4b4p5hpzme	33333333-3333-4333-8333-333333333333	f	2026-08-13 19:09:34.716062+00	2026-08-13 19:09:34.716062+00	\N	30080152-0a2c-4f81-a526-cb9f2f4dc525
00000000-0000-0000-0000-000000000000	181	m6vgruqtrom3	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:38:46.586042+00	2026-08-13 23:38:46.586042+00	\N	0b026ac2-2157-4154-a6b3-9bc5bfc42a5a
00000000-0000-0000-0000-000000000000	185	4wu4x73xztsg	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:38:46.669959+00	2026-08-13 23:38:46.669959+00	\N	9354654f-1f6a-49f8-b19b-d384e78cc51a
00000000-0000-0000-0000-000000000000	188	cgh74aw55qqc	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:38:46.67812+00	2026-08-13 23:38:46.67812+00	\N	5636fd3c-d9ec-4478-8d05-e33e028e2264
00000000-0000-0000-0000-000000000000	191	rdk6kzv5wz3j	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:13.984539+00	2026-08-13 23:39:13.984539+00	\N	1dc3cb84-3c1d-4eb0-9168-e5bc19729c3b
00000000-0000-0000-0000-000000000000	194	fq4y2paogmyc	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:13.991578+00	2026-08-13 23:39:13.991578+00	\N	35df321b-0d3d-4223-ad4e-4c5825d4adc3
00000000-0000-0000-0000-000000000000	197	fio4tidf4ljp	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:39:14.087955+00	2026-08-13 23:39:14.087955+00	\N	18672e63-9fe3-4c6a-afa4-09b1d005f9b3
00000000-0000-0000-0000-000000000000	200	x3kjngekzqvs	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:14.101889+00	2026-08-13 23:39:14.101889+00	\N	cba6296c-f821-4b7a-94d9-bc7bd1c597fc
00000000-0000-0000-0000-000000000000	203	ymov32kaqden	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:39.966752+00	2026-08-13 23:39:39.966752+00	\N	32535756-7508-401d-9501-652c7047371a
00000000-0000-0000-0000-000000000000	206	qlbr55wmsfjt	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:39.970778+00	2026-08-13 23:39:39.970778+00	\N	a197e690-138e-41c3-a1cc-5b7eea36e5bb
00000000-0000-0000-0000-000000000000	209	zlcinq5rzbhq	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:39:40.080188+00	2026-08-13 23:39:40.080188+00	\N	d8ff4723-9df6-4338-9476-deaf7246ead0
00000000-0000-0000-0000-000000000000	211	nxvspnm7pqwd	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:39:40.087361+00	2026-08-13 23:39:40.087361+00	\N	273a50f6-4b8b-4535-9ba2-54b7d83f9828
00000000-0000-0000-0000-000000000000	215	tjnyxlftsdha	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:40:05.191175+00	2026-08-13 23:40:05.191175+00	\N	254d4eb9-424d-4922-b7ad-9e5ee94dd9a4
00000000-0000-0000-0000-000000000000	217	v544yhhksdfe	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:40:05.260805+00	2026-08-13 23:40:05.260805+00	\N	010dedbc-ad85-4569-97d3-7db883821b7b
00000000-0000-0000-0000-000000000000	219	rgvnislhue56	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:40:05.298753+00	2026-08-13 23:40:05.298753+00	\N	fc8a520e-99cf-42a0-8bcd-9a179a144230
00000000-0000-0000-0000-000000000000	221	77apuflxneoj	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:40:05.377253+00	2026-08-13 23:40:05.377253+00	\N	ba422ee1-b4d8-40dc-9c6a-2d4b436853a2
00000000-0000-0000-0000-000000000000	226	6rc23ziwtozp	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:42:41.483628+00	2026-08-13 23:42:41.483628+00	\N	4b0bee1b-f88a-487e-bbe0-995c23a53fff
00000000-0000-0000-0000-000000000000	227	r2udpcj75zgb	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:42:41.484432+00	2026-08-13 23:42:41.484432+00	\N	31598b2f-6c75-4ac9-a0ab-b6fd7f404844
00000000-0000-0000-0000-000000000000	228	ivn4c5k2uqjn	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:42:41.487057+00	2026-08-13 23:42:41.487057+00	\N	62390249-7050-420d-acc3-cc6e7353841a
00000000-0000-0000-0000-000000000000	229	7ixr2u5jh37v	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:42:41.487384+00	2026-08-13 23:42:41.487384+00	\N	e856833c-9908-4b6c-883a-7e4f56cd1ec2
00000000-0000-0000-0000-000000000000	230	cum72vpxmkxm	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:42:41.494827+00	2026-08-13 23:42:41.494827+00	\N	0a62648b-ef3c-4822-a860-d7400492c1ce
00000000-0000-0000-0000-000000000000	231	uupehrjzropp	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:42:41.495711+00	2026-08-13 23:42:41.495711+00	\N	7f3651e1-25f3-408b-aa73-2f4c87e1c185
00000000-0000-0000-0000-000000000000	232	lasnrhpbsugk	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:42:41.564836+00	2026-08-13 23:42:41.564836+00	\N	a007e4b9-aea0-41f1-aa1c-56a19f10f708
00000000-0000-0000-0000-000000000000	233	vg4jmraxvnqw	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:42:41.567608+00	2026-08-13 23:42:41.567608+00	\N	c66537f7-3cc7-402f-a82d-bab8548223bb
00000000-0000-0000-0000-000000000000	234	phjgseo6v5qy	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:42:41.569418+00	2026-08-13 23:42:41.569418+00	\N	2bd0b96a-ba17-46d5-b189-ef4fdee34204
00000000-0000-0000-0000-000000000000	235	ognpx5dib7d7	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:42:41.569781+00	2026-08-13 23:42:41.569781+00	\N	906e43df-74c0-423a-84c4-d7e5c9c81f5d
00000000-0000-0000-0000-000000000000	236	vbno747t53uq	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:42:41.573635+00	2026-08-13 23:42:41.573635+00	\N	f8f5db6f-6026-4bfb-9d44-2818e72b4939
00000000-0000-0000-0000-000000000000	237	sw573hbntbsg	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:42:41.58082+00	2026-08-13 23:42:41.58082+00	\N	fbfc8a01-168a-459f-b58e-a8e651f15fcd
00000000-0000-0000-0000-000000000000	238	rvobp54gv6u6	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:43:18.300417+00	2026-08-13 23:43:18.300417+00	\N	6becca5a-c23e-4e5f-8acd-3290444fe560
00000000-0000-0000-0000-000000000000	239	xiii6yrjecle	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:43:18.299098+00	2026-08-13 23:43:18.299098+00	\N	5bc2db4a-225c-4250-8d0c-59a2cad98f18
00000000-0000-0000-0000-000000000000	240	aedmg6vglfp4	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:43:18.300025+00	2026-08-13 23:43:18.300025+00	\N	33f34d14-b536-46e2-a1d2-765eb3e718d9
00000000-0000-0000-0000-000000000000	241	3lpz3urzjdjt	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:43:18.301822+00	2026-08-13 23:43:18.301822+00	\N	82076bfc-7595-4b24-bc8a-bbd5dd1ea511
00000000-0000-0000-0000-000000000000	243	bi4x3iqxw7kt	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:43:18.306223+00	2026-08-13 23:43:18.306223+00	\N	9939e4e0-fbdb-40b5-9f3f-e314fefce4d6
00000000-0000-0000-0000-000000000000	242	3e2iyu26xa7w	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:43:18.306004+00	2026-08-13 23:43:18.306004+00	\N	cf30703e-224e-4a92-8cb1-58eaae2ba983
00000000-0000-0000-0000-000000000000	244	u7yfcv7gn363	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:43:18.377262+00	2026-08-13 23:43:18.377262+00	\N	969f8ce1-2887-4825-b50f-2fd44bb0588f
00000000-0000-0000-0000-000000000000	245	rzhgwajgqr2f	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:43:18.380848+00	2026-08-13 23:43:18.380848+00	\N	fcb6899e-a035-49df-9f14-384b52ba164c
00000000-0000-0000-0000-000000000000	246	ur4237ypc26v	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:43:18.391894+00	2026-08-13 23:43:18.391894+00	\N	99207d61-b41f-4cf6-b59d-4d39a83ef4ea
00000000-0000-0000-0000-000000000000	247	tohulqasjrqn	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:43:18.3959+00	2026-08-13 23:43:18.3959+00	\N	b4339069-2d9d-495b-b557-18ce6acddb64
00000000-0000-0000-0000-000000000000	248	53dyxovuv4pi	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:43:18.399247+00	2026-08-13 23:43:18.399247+00	\N	80e1cfd6-cc5b-49e5-b3dc-d2bae56fe110
00000000-0000-0000-0000-000000000000	249	srwortfzjobn	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:43:18.40288+00	2026-08-13 23:43:18.40288+00	\N	e6a97038-3735-4b83-afef-ca47ed8ef2e1
00000000-0000-0000-0000-000000000000	251	d2qww3otdf7e	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:44:26.42797+00	2026-08-13 23:44:26.42797+00	\N	105bef7b-969b-412a-814d-041aabb84b85
00000000-0000-0000-0000-000000000000	250	gt6tcolvzlmp	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:44:26.428014+00	2026-08-13 23:44:26.428014+00	\N	d9470680-18a7-4229-bb6a-54c19e02b66a
00000000-0000-0000-0000-000000000000	252	jafnbzp77hqt	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:44:26.432662+00	2026-08-13 23:44:26.432662+00	\N	f13d3131-5969-4ebd-9393-fa41fb259bd6
00000000-0000-0000-0000-000000000000	253	vhvydoymrhtm	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:44:26.526945+00	2026-08-13 23:44:26.526945+00	\N	3a468fbd-6184-4217-a81c-bf5424f7c35b
00000000-0000-0000-0000-000000000000	254	zlk45aot23x5	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:44:26.528223+00	2026-08-13 23:44:26.528223+00	\N	14aa89b6-ef01-460c-a2c4-5d88f29aa347
00000000-0000-0000-0000-000000000000	255	4zsvkq27hzcv	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:44:26.530991+00	2026-08-13 23:44:26.530991+00	\N	bc3b0d8f-fd59-4382-884d-3408c909ee31
00000000-0000-0000-0000-000000000000	256	5omvqpzxbdc5	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:44:26.533665+00	2026-08-13 23:44:26.533665+00	\N	05a643fc-04f8-4ce9-b92f-5490d0e0f557
00000000-0000-0000-0000-000000000000	257	42br5b4rmguh	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:44:26.535284+00	2026-08-13 23:44:26.535284+00	\N	c16d3b40-01a3-491b-af5b-9aaaec5350d8
00000000-0000-0000-0000-000000000000	258	slr5btvtddl5	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:44:26.539768+00	2026-08-13 23:44:26.539768+00	\N	69090e49-8213-422e-bbd3-862648689f3b
00000000-0000-0000-0000-000000000000	259	awpnfa6ztcz5	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:44:26.540303+00	2026-08-13 23:44:26.540303+00	\N	9c255ddf-d96e-4d07-9db6-fe977bd593a5
00000000-0000-0000-0000-000000000000	260	xqci6tm2arle	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:44:26.543574+00	2026-08-13 23:44:26.543574+00	\N	df417782-dfd7-4788-ba67-a84e8072e170
00000000-0000-0000-0000-000000000000	261	nfnuzzs6dfaz	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:44:26.544768+00	2026-08-13 23:44:26.544768+00	\N	f6739dae-b50a-4de1-b651-42917db6f2a2
00000000-0000-0000-0000-000000000000	262	pzccueyrhv7x	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:18.210925+00	2026-08-13 23:45:18.210925+00	\N	4a8deb10-e216-4586-8d1a-bad860f1e2c9
00000000-0000-0000-0000-000000000000	263	so3mbx4f2i7i	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:18.214267+00	2026-08-13 23:45:18.214267+00	\N	46f95cd2-2d0b-41a5-9dcb-be48b1241617
00000000-0000-0000-0000-000000000000	264	kfydlcipkt3s	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:18.213184+00	2026-08-13 23:45:18.213184+00	\N	d32d76c3-b7fd-468a-bef8-76bac202b992
00000000-0000-0000-0000-000000000000	265	x5jpryfvak3e	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:18.350028+00	2026-08-13 23:45:18.350028+00	\N	c56713a0-bdb7-4122-b5b1-e4b89370767e
00000000-0000-0000-0000-000000000000	266	kln5zeem2l5n	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:18.350178+00	2026-08-13 23:45:18.350178+00	\N	c4355c1a-109e-4ba2-a1c6-da700a839f1d
00000000-0000-0000-0000-000000000000	267	rqmn6vgpffw5	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:18.351191+00	2026-08-13 23:45:18.351191+00	\N	f9695ad0-34e1-4dcd-8e88-fc6d1fa9fa68
00000000-0000-0000-0000-000000000000	268	2qcf2sg4skq5	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:18.350886+00	2026-08-13 23:45:18.350886+00	\N	cd42f384-68c7-4a06-9d11-e676ce90be4f
00000000-0000-0000-0000-000000000000	269	si5cmk7o47qn	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:18.354827+00	2026-08-13 23:45:18.354827+00	\N	6b7389f9-9259-4857-bdfe-f1a009a7a39f
00000000-0000-0000-0000-000000000000	270	uoiqyeu7k53x	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:18.356229+00	2026-08-13 23:45:18.356229+00	\N	9bb6b32c-5804-4bd4-bd63-cc48fc8197ee
00000000-0000-0000-0000-000000000000	271	5srnkjhhqgue	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:18.355734+00	2026-08-13 23:45:18.355734+00	\N	248c1c7b-0f95-4e9e-b6ff-242661c537d4
00000000-0000-0000-0000-000000000000	272	2gw3fg6a62gc	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:18.356159+00	2026-08-13 23:45:18.356159+00	\N	4399a5b2-f0a6-4a8d-a355-d756d5432a8a
00000000-0000-0000-0000-000000000000	273	ppspaue2rvq2	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:18.35798+00	2026-08-13 23:45:18.35798+00	\N	9c45c65c-a631-4a6c-980b-4f21f09bcc54
00000000-0000-0000-0000-000000000000	274	wf5kl4hluuzp	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:44.673091+00	2026-08-13 23:45:44.673091+00	\N	a6a1c8f0-58f2-47dc-b82d-127bf4e28791
00000000-0000-0000-0000-000000000000	275	iq75ozateeby	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:44.673535+00	2026-08-13 23:45:44.673535+00	\N	81e83d13-faef-4bc5-be0e-67b3361bd87b
00000000-0000-0000-0000-000000000000	276	d4n4neeyxb6v	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:44.67556+00	2026-08-13 23:45:44.67556+00	\N	45a5d384-bba6-42bb-b7c0-2c9d403d455c
00000000-0000-0000-0000-000000000000	277	i3h3is3d5sni	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:44.7682+00	2026-08-13 23:45:44.7682+00	\N	0190e3e8-ff41-4745-abe7-9a8136faa9b7
00000000-0000-0000-0000-000000000000	278	n4yajx42rjpk	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:44.772255+00	2026-08-13 23:45:44.772255+00	\N	c8acc2e9-12d7-4653-b526-04d2236e1682
00000000-0000-0000-0000-000000000000	279	knbnt57c5dzp	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:44.773695+00	2026-08-13 23:45:44.773695+00	\N	4f53ec0d-e22f-445c-9a71-85a1d8aa8d30
00000000-0000-0000-0000-000000000000	280	dgrlvjko4aei	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:44.774296+00	2026-08-13 23:45:44.774296+00	\N	997e984c-5297-4da2-be24-b3ff52a08980
00000000-0000-0000-0000-000000000000	281	ml573ayfv32e	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:45:44.775389+00	2026-08-13 23:45:44.775389+00	\N	0d7590e2-5381-4f8f-95d4-0230a9fc50b5
00000000-0000-0000-0000-000000000000	282	f7pse33bjpju	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:44.776621+00	2026-08-13 23:45:44.776621+00	\N	843c1548-41ab-496a-8294-c8bbf286e3fe
00000000-0000-0000-0000-000000000000	283	dpd2ykqp5hke	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:44.776602+00	2026-08-13 23:45:44.776602+00	\N	4398d8dc-22c8-4daa-a3b0-92a8a1e55ec3
00000000-0000-0000-0000-000000000000	284	zrga27jxsp3m	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:45:44.783234+00	2026-08-13 23:45:44.783234+00	\N	03dbb9b3-f806-40f6-a49b-9488f5a3c70c
00000000-0000-0000-0000-000000000000	285	3cnhjqvuk5hu	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:45:44.794885+00	2026-08-13 23:45:44.794885+00	\N	570b6030-9197-4a5a-aba3-ecb21b4fcf67
00000000-0000-0000-0000-000000000000	286	slim3vtm5nbr	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:46:00.175233+00	2026-08-13 23:46:00.175233+00	\N	0f5b37e3-1226-4136-a705-e4cb0ec04d92
00000000-0000-0000-0000-000000000000	287	y7pxjx3daxqt	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:46:00.17523+00	2026-08-13 23:46:00.17523+00	\N	15598ad6-3d24-4771-a19e-5e094c859653
00000000-0000-0000-0000-000000000000	288	xh7r2rx2tt3t	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:46:00.176479+00	2026-08-13 23:46:00.176479+00	\N	c15126c4-5430-4cbf-babe-e9a0e8ba1dfa
00000000-0000-0000-0000-000000000000	289	mmpb7hglqpnd	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:46:08.926888+00	2026-08-13 23:46:08.926888+00	\N	f66a9367-911a-4663-851b-cd01480f6329
00000000-0000-0000-0000-000000000000	290	af426c5agpen	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:46:08.927204+00	2026-08-13 23:46:08.927204+00	\N	fc7e4d28-d2c2-4acc-a574-8364c42c8aed
00000000-0000-0000-0000-000000000000	291	ttwfm772pir6	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:46:08.928068+00	2026-08-13 23:46:08.928068+00	\N	7bf1f0d7-3a21-4fe6-8b68-42345aefb470
00000000-0000-0000-0000-000000000000	292	v2oqdai7mbjq	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:46:48.159739+00	2026-08-13 23:46:48.159739+00	\N	a3d67c86-accd-43e4-944c-516c530c5120
00000000-0000-0000-0000-000000000000	293	jlqfgoq6be4e	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:46:48.159659+00	2026-08-13 23:46:48.159659+00	\N	c19c026b-b89e-4f13-9471-3190ac93bf7b
00000000-0000-0000-0000-000000000000	294	j7uypbxkftxa	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:46:48.160689+00	2026-08-13 23:46:48.160689+00	\N	363e11b4-191d-45d6-8b85-63e5e53d1867
00000000-0000-0000-0000-000000000000	295	mwcyjw7fps7l	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:46:48.520491+00	2026-08-13 23:46:48.520491+00	\N	b182aef0-64ef-44b8-9536-8587392400b4
00000000-0000-0000-0000-000000000000	296	uwx7zsmcuurz	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:46:48.520561+00	2026-08-13 23:46:48.520561+00	\N	27c2e1a1-9cf0-4ce4-849f-875b43802d9f
00000000-0000-0000-0000-000000000000	297	ltxwvsovyz4h	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:46:48.521595+00	2026-08-13 23:46:48.521595+00	\N	cc4b213e-a314-4ff4-ae9d-95f401d5be1c
00000000-0000-0000-0000-000000000000	298	cvhehmdzukti	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:46:48.89029+00	2026-08-13 23:46:48.89029+00	\N	fca5b198-0879-424d-b74b-71c4e259fbc7
00000000-0000-0000-0000-000000000000	299	oz3wtyjkgtxj	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:46:48.890309+00	2026-08-13 23:46:48.890309+00	\N	2284a547-ede4-462e-9746-4f02055a8c2f
00000000-0000-0000-0000-000000000000	300	m5poujzamehp	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:46:48.891313+00	2026-08-13 23:46:48.891313+00	\N	091ee76a-2387-49ec-96ed-9edade77e7af
00000000-0000-0000-0000-000000000000	301	ojskgc66iovq	11111111-1111-4111-8111-111111111111	f	2026-08-13 23:46:49.390993+00	2026-08-13 23:46:49.390993+00	\N	9e6f0c29-6a57-489f-bb77-8ac42d307e61
00000000-0000-0000-0000-000000000000	302	ejt5qt6km3nu	33333333-3333-4333-8333-333333333333	f	2026-08-13 23:46:49.396174+00	2026-08-13 23:46:49.396174+00	\N	339c2340-c61a-44fc-a6ec-e381bfdc2462
00000000-0000-0000-0000-000000000000	303	uyhrxjilu3ki	22222222-2222-4222-8222-222222222222	f	2026-08-13 23:46:49.3992+00	2026-08-13 23:46:49.3992+00	\N	943827e7-2364-4c66-98d5-813f955edc2f
00000000-0000-0000-0000-000000000000	304	tn4gezoyhy42	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 00:28:44.41774+00	2026-08-14 01:27:09.100822+00	\N	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	305	deatindx3l5p	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 01:27:09.101296+00	2026-08-14 02:25:46.133112+00	tn4gezoyhy42	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	306	he766d6nw2mx	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 02:25:46.133595+00	2026-08-14 03:24:16.199728+00	deatindx3l5p	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	307	eluoaqjgibrb	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 03:24:16.200447+00	2026-08-14 04:22:47.223244+00	he766d6nw2mx	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	308	nr22gj3x6s6u	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 04:22:47.223753+00	2026-08-14 05:21:42.96416+00	eluoaqjgibrb	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	309	r6ysjcajn36o	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 05:21:42.964641+00	2026-08-14 06:20:13.013976+00	nr22gj3x6s6u	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	310	7uh5oodssdos	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 06:20:13.014465+00	2026-08-14 07:19:09.167495+00	r6ysjcajn36o	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	311	q275gile7gh2	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 07:19:09.168014+00	2026-08-14 08:18:04.953598+00	7uh5oodssdos	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	312	vbe4g3hbp6xj	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 08:18:04.954059+00	2026-08-14 09:16:35.070858+00	q275gile7gh2	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	313	7a3gfrwjuzvr	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 09:16:35.071787+00	2026-08-14 10:15:31.136389+00	vbe4g3hbp6xj	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	314	g6adgabwjxzu	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 10:15:31.136862+00	2026-08-14 11:14:27.14027+00	7a3gfrwjuzvr	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	315	cf4utn5edyb2	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 11:14:27.140777+00	2026-08-14 12:12:57.17609+00	g6adgabwjxzu	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	316	zut4s3cjne7r	01995e19-0de1-4ddb-b53e-0dff2cb718aa	t	2026-08-14 12:12:57.176605+00	2026-08-14 13:11:27.188456+00	cf4utn5edyb2	b368d347-b60d-4b46-84fa-5212dbc62abc
00000000-0000-0000-0000-000000000000	317	kknhvcjgslih	01995e19-0de1-4ddb-b53e-0dff2cb718aa	f	2026-08-14 13:11:27.188959+00	2026-08-14 13:11:27.188959+00	zut4s3cjne7r	b368d347-b60d-4b46-84fa-5212dbc62abc
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
fc03b936-9146-447b-9fd1-2673cab0115e	22222222-2222-4222-8222-222222222222	2026-08-13 16:10:22.344584+00	2026-08-13 16:10:22.344584+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6b8da558-b4ea-4ae8-986a-647c871a184f	22222222-2222-4222-8222-222222222222	2026-08-13 16:10:22.345076+00	2026-08-13 16:10:22.345076+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
35551139-51e2-4c4a-976c-91ea77265410	22222222-2222-4222-8222-222222222222	2026-08-13 16:10:22.348078+00	2026-08-13 16:10:22.348078+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
15c4a5cf-fe16-487d-aa61-b6f5656677eb	33333333-3333-4333-8333-333333333333	2026-08-13 16:10:22.353644+00	2026-08-13 16:10:22.353644+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
86731a27-af39-4fa7-ad0b-63e5a06c95fc	33333333-3333-4333-8333-333333333333	2026-08-13 16:10:22.353549+00	2026-08-13 16:10:22.353549+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
028b9a58-11ad-4e6d-bb59-41501088302e	22222222-2222-4222-8222-222222222222	2026-08-13 16:10:22.356056+00	2026-08-13 16:10:22.356056+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
2095b103-0acb-4414-aa6b-b2da7f61d494	33333333-3333-4333-8333-333333333333	2026-08-13 16:10:22.361279+00	2026-08-13 16:10:22.361279+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a2313c54-dcb6-45d7-bc2b-110c6e7811bd	33333333-3333-4333-8333-333333333333	2026-08-13 16:10:22.361131+00	2026-08-13 16:10:22.361131+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b51f9a64-8384-4edc-bff7-50cd39e6d8e5	33333333-3333-4333-8333-333333333333	2026-08-13 16:49:09.669631+00	2026-08-13 16:49:09.669631+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
77924229-abe7-4cbd-956f-077efe76f139	22222222-2222-4222-8222-222222222222	2026-08-13 16:49:09.669082+00	2026-08-13 16:49:09.669082+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a590805c-7635-46ae-a6b3-ac5867c145f9	33333333-3333-4333-8333-333333333333	2026-08-13 16:49:09.674039+00	2026-08-13 16:49:09.674039+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f7e43e6b-890d-4ece-8bff-17e9d2931049	22222222-2222-4222-8222-222222222222	2026-08-13 16:49:09.673611+00	2026-08-13 16:49:09.673611+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b3386d44-e1e0-4d7c-b9eb-2dd05c335793	22222222-2222-4222-8222-222222222222	2026-08-13 16:49:09.672583+00	2026-08-13 16:49:09.672583+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b4d8daad-11fd-4f72-8a55-029f22f0008e	22222222-2222-4222-8222-222222222222	2026-08-13 16:49:09.677286+00	2026-08-13 16:49:09.677286+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
48ff2afd-8469-46fa-9f9f-43ec83a1d455	33333333-3333-4333-8333-333333333333	2026-08-13 16:49:09.680255+00	2026-08-13 16:49:09.680255+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6f4bcd83-e1cf-4d72-b7ec-fab6a279f611	33333333-3333-4333-8333-333333333333	2026-08-13 16:49:09.680945+00	2026-08-13 16:49:09.680945+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
98b842be-abd3-408e-9386-0168995cf889	22222222-2222-4222-8222-222222222222	2026-08-13 16:49:44.939199+00	2026-08-13 16:49:44.939199+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
77373c38-2444-4561-8f2a-370bdef5d875	22222222-2222-4222-8222-222222222222	2026-08-13 16:50:01.457573+00	2026-08-13 16:50:01.457573+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
2605e123-6ec9-48c9-9929-4e93f0f67f24	22222222-2222-4222-8222-222222222222	2026-08-13 16:52:38.946202+00	2026-08-13 16:52:38.946202+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
eb12d04d-462e-4dea-9ff6-5b6ca57bf81a	22222222-2222-4222-8222-222222222222	2026-08-13 16:52:41.003199+00	2026-08-13 16:52:41.003199+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
de72c5f0-d340-45da-ae13-38c3587d08ea	22222222-2222-4222-8222-222222222222	2026-08-13 16:53:37.714934+00	2026-08-13 16:53:37.714934+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
13676f0e-63ff-4012-b880-249b7f295231	22222222-2222-4222-8222-222222222222	2026-08-13 16:53:39.600006+00	2026-08-13 16:53:39.600006+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1370e6ca-6b6d-4599-9c84-c33f9ce77743	22222222-2222-4222-8222-222222222222	2026-08-13 16:54:23.019231+00	2026-08-13 16:54:23.019231+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
184506a4-3d13-4551-8def-cdee5feb4559	22222222-2222-4222-8222-222222222222	2026-08-13 16:54:24.989918+00	2026-08-13 16:54:24.989918+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4eaafeae-0a0b-458e-8254-551c0a33bfae	22222222-2222-4222-8222-222222222222	2026-08-13 16:56:48.916381+00	2026-08-13 16:56:48.916381+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b22c0053-4658-4765-b901-1451066ec9a7	33333333-3333-4333-8333-333333333333	2026-08-13 16:56:48.916831+00	2026-08-13 16:56:48.916831+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f8834fb6-d591-4cbf-97e8-e0ffae962418	33333333-3333-4333-8333-333333333333	2026-08-13 16:56:48.917393+00	2026-08-13 16:56:48.917393+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
27efef7f-e952-4824-920d-1f44512e94c3	33333333-3333-4333-8333-333333333333	2026-08-13 16:56:48.921501+00	2026-08-13 16:56:48.921501+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
78c71a83-0437-4ae7-a592-181e71334690	22222222-2222-4222-8222-222222222222	2026-08-13 16:56:48.923126+00	2026-08-13 16:56:48.923126+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
819b6657-640e-4127-83ba-31e2e3196895	22222222-2222-4222-8222-222222222222	2026-08-13 16:56:48.927442+00	2026-08-13 16:56:48.927442+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9ffdd3e7-15a7-42a8-9a73-cbe3260bdf77	33333333-3333-4333-8333-333333333333	2026-08-13 16:56:48.928745+00	2026-08-13 16:56:48.928745+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
94d54950-eb8a-402b-bec1-15c2956f6228	22222222-2222-4222-8222-222222222222	2026-08-13 16:56:48.930933+00	2026-08-13 16:56:48.930933+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
cdc72b80-505e-451b-a26e-38fa9ebead2c	22222222-2222-4222-8222-222222222222	2026-08-13 17:23:13.558572+00	2026-08-13 17:23:13.558572+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
845c6efa-adf6-4e12-83f6-23c01d395299	33333333-3333-4333-8333-333333333333	2026-08-13 17:23:13.586736+00	2026-08-13 17:23:13.586736+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1570802b-b29c-402a-973d-cbd69983e08c	22222222-2222-4222-8222-222222222222	2026-08-13 17:23:13.622008+00	2026-08-13 17:23:13.622008+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1e9e1312-b7a8-4d48-a906-b78857a45190	22222222-2222-4222-8222-222222222222	2026-08-13 17:23:13.649209+00	2026-08-13 17:23:13.649209+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1efdbba5-e258-4899-b731-88a10edca4a0	33333333-3333-4333-8333-333333333333	2026-08-13 17:23:13.670488+00	2026-08-13 17:23:13.670488+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
557dfa6e-2168-41ac-b8a1-66d312c035a8	33333333-3333-4333-8333-333333333333	2026-08-13 17:23:13.68839+00	2026-08-13 17:23:13.68839+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f72c393d-8a28-4940-8cd9-e6ee4977c0c6	33333333-3333-4333-8333-333333333333	2026-08-13 17:23:13.690116+00	2026-08-13 17:23:13.690116+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fa71c2ed-cf60-4405-b7de-dc24cce9471b	22222222-2222-4222-8222-222222222222	2026-08-13 17:23:13.701596+00	2026-08-13 17:23:13.701596+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c7fc538c-f3a4-4a26-ac16-627afe1699fb	33333333-3333-4333-8333-333333333333	2026-08-13 18:17:44.010464+00	2026-08-13 18:17:44.010464+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
46f9368a-961a-47b4-b5a4-8cd957ed376e	33333333-3333-4333-8333-333333333333	2026-08-13 18:17:44.012912+00	2026-08-13 18:17:44.012912+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
5b938a0a-3088-490a-a215-010e59f6edfd	22222222-2222-4222-8222-222222222222	2026-08-13 18:17:44.034172+00	2026-08-13 18:17:44.034172+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b81345b1-c9b3-4f61-92b8-5e3d78dc8c0a	22222222-2222-4222-8222-222222222222	2026-08-13 18:17:44.036508+00	2026-08-13 18:17:44.036508+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9bf1b4f0-3a20-4d4f-826f-c37b5c13e253	33333333-3333-4333-8333-333333333333	2026-08-13 18:17:44.039511+00	2026-08-13 18:17:44.039511+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f9c90df0-42f6-45e6-9cd2-583871a3111d	22222222-2222-4222-8222-222222222222	2026-08-13 18:17:44.043668+00	2026-08-13 18:17:44.043668+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
04c74354-7531-4796-b002-5eb48be94552	33333333-3333-4333-8333-333333333333	2026-08-13 18:17:44.043542+00	2026-08-13 18:17:44.043542+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
2f1e5c0e-a7b2-4eb5-bfd8-6899b7779300	22222222-2222-4222-8222-222222222222	2026-08-13 18:17:44.065938+00	2026-08-13 18:17:44.065938+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
aa829281-31c5-480b-bfd6-1fb2aea67bc0	33333333-3333-4333-8333-333333333333	2026-08-13 18:19:14.998537+00	2026-08-13 18:19:14.998537+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9c47638d-cbe3-471d-8c41-dca3f34122ac	22222222-2222-4222-8222-222222222222	2026-08-13 18:19:15.001838+00	2026-08-13 18:19:15.001838+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
8b087e1f-b264-4aca-8228-c9176cfb09bf	33333333-3333-4333-8333-333333333333	2026-08-13 18:19:15.006316+00	2026-08-13 18:19:15.006316+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a99ac20f-49f8-4f0f-bc51-ca1425f6cea0	33333333-3333-4333-8333-333333333333	2026-08-13 18:19:15.008606+00	2026-08-13 18:19:15.008606+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
af2d3644-c6ae-46d6-9ab8-b6b41d99a119	22222222-2222-4222-8222-222222222222	2026-08-13 18:19:15.008652+00	2026-08-13 18:19:15.008652+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c2e218fb-ff19-4cae-8f58-1ca0bbf82578	22222222-2222-4222-8222-222222222222	2026-08-13 18:19:15.011263+00	2026-08-13 18:19:15.011263+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9ead7b32-d30f-4e6c-98fd-20c7f1e27972	33333333-3333-4333-8333-333333333333	2026-08-13 18:19:15.016101+00	2026-08-13 18:19:15.016101+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
7fcf0f13-78fc-418c-8412-863721c697d3	22222222-2222-4222-8222-222222222222	2026-08-13 18:19:15.024616+00	2026-08-13 18:19:15.024616+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4dc88b30-429c-40d9-b43c-0f987928eda2	33333333-3333-4333-8333-333333333333	2026-08-13 18:20:04.301768+00	2026-08-13 18:20:04.301768+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1a0ae2f3-f0ae-453a-a4a4-0f0c62ff397a	22222222-2222-4222-8222-222222222222	2026-08-13 18:20:04.308108+00	2026-08-13 18:20:04.308108+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
929f75cd-9751-4e81-bc5f-e3376a3060d3	33333333-3333-4333-8333-333333333333	2026-08-13 18:20:04.315068+00	2026-08-13 18:20:04.315068+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4b7fe127-f8d6-4992-aa35-59e4556cf463	22222222-2222-4222-8222-222222222222	2026-08-13 18:20:04.316649+00	2026-08-13 18:20:04.316649+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1a847ded-8863-4db6-bb1c-62233578dbc9	22222222-2222-4222-8222-222222222222	2026-08-13 18:20:04.317208+00	2026-08-13 18:20:04.317208+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f4cdaf2a-6ac8-4844-b585-2e95e111dbe0	33333333-3333-4333-8333-333333333333	2026-08-13 18:20:04.317766+00	2026-08-13 18:20:04.317766+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
11812edb-ddd1-4c95-95bd-8a14cefc67ba	33333333-3333-4333-8333-333333333333	2026-08-13 18:20:04.318376+00	2026-08-13 18:20:04.318376+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
566b49c0-00f3-48c9-95c9-00dd888408b3	22222222-2222-4222-8222-222222222222	2026-08-13 18:20:04.327406+00	2026-08-13 18:20:04.327406+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
18276dfa-26cc-4f85-8394-27b950c5c238	11111111-1111-4111-8111-111111111111	2026-08-13 22:57:13.617378+00	2026-08-13 22:57:13.617378+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
5e740572-cb19-4896-b0b5-49471c0d9bfe	22222222-2222-4222-8222-222222222222	2026-08-13 19:06:53.665716+00	2026-08-13 19:06:53.665716+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
315c4f26-3628-40ae-b0b8-2fdb396b4f21	33333333-3333-4333-8333-333333333333	2026-08-13 19:06:53.672394+00	2026-08-13 19:06:53.672394+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
35be98f6-bd3d-4d53-a627-9372926e65df	33333333-3333-4333-8333-333333333333	2026-08-13 19:06:53.675174+00	2026-08-13 19:06:53.675174+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
cc25a169-d60c-440c-ab77-c11f7b3bc598	33333333-3333-4333-8333-333333333333	2026-08-13 19:06:53.675673+00	2026-08-13 19:06:53.675673+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
32042a20-eced-469e-a386-5f9f91260549	22222222-2222-4222-8222-222222222222	2026-08-13 19:06:53.68234+00	2026-08-13 19:06:53.68234+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
7f9aabd2-916b-4040-8a1f-4c230589c5d8	22222222-2222-4222-8222-222222222222	2026-08-13 19:06:53.685586+00	2026-08-13 19:06:53.685586+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f0022577-f0f2-4eab-bd67-ce58ffab6d32	22222222-2222-4222-8222-222222222222	2026-08-13 19:06:53.686256+00	2026-08-13 19:06:53.686256+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
e93d8c85-8c0f-4bdb-8746-0dff950b04ed	33333333-3333-4333-8333-333333333333	2026-08-13 19:06:53.69448+00	2026-08-13 19:06:53.69448+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fbcb895f-7c58-498b-a2a5-15dc5541ee2c	33333333-3333-4333-8333-333333333333	2026-08-13 19:09:34.693894+00	2026-08-13 19:09:34.693894+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d20f33d6-2c27-46bf-a09f-69b435d02fdd	33333333-3333-4333-8333-333333333333	2026-08-13 19:09:34.693441+00	2026-08-13 19:09:34.693441+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d126d77a-84f0-4aea-9c72-4678938aeda8	22222222-2222-4222-8222-222222222222	2026-08-13 19:09:34.696958+00	2026-08-13 19:09:34.696958+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9c0a66f0-b47d-43ed-960d-65e3726bfa21	22222222-2222-4222-8222-222222222222	2026-08-13 19:09:34.702393+00	2026-08-13 19:09:34.702393+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d1529269-8e0d-4164-b735-8cdb0e91f61c	22222222-2222-4222-8222-222222222222	2026-08-13 19:09:34.704885+00	2026-08-13 19:09:34.704885+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
443d15ac-7130-4da3-9375-6ff5a3868ee8	22222222-2222-4222-8222-222222222222	2026-08-13 19:09:34.706785+00	2026-08-13 19:09:34.706785+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
30080152-0a2c-4f81-a526-cb9f2f4dc525	33333333-3333-4333-8333-333333333333	2026-08-13 19:09:34.70921+00	2026-08-13 19:09:34.70921+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b8a74f85-ca02-4a51-8022-866cc6be0d03	33333333-3333-4333-8333-333333333333	2026-08-13 19:09:34.709219+00	2026-08-13 19:09:34.709219+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
8c4c28f5-9b06-4eb2-ac04-794bfba66362	11111111-1111-4111-8111-111111111111	2026-08-13 23:29:09.602901+00	2026-08-13 23:29:09.602901+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6bd783f2-b407-4394-9ab0-60584a5d0aaf	11111111-1111-4111-8111-111111111111	2026-08-13 23:35:53.783463+00	2026-08-13 23:35:53.783463+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
97a1d818-66d9-4cc4-b195-8d9cab4ef020	11111111-1111-4111-8111-111111111111	2026-08-13 22:36:10.433557+00	2026-08-13 22:36:10.433557+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
ca8941bb-6b1d-4672-b674-4d9889fc26c1	11111111-1111-4111-8111-111111111111	2026-08-13 22:47:57.283462+00	2026-08-13 22:47:57.283462+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
40366835-5e47-4d1d-9ce1-c6d7fc74cada	22222222-2222-4222-8222-222222222222	2026-08-13 23:35:53.784649+00	2026-08-13 23:35:53.784649+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
213f3bb0-cdd9-43ac-ab38-f20a59be6c5a	11111111-1111-4111-8111-111111111111	2026-08-13 23:35:53.783856+00	2026-08-13 23:35:53.783856+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
79755d3e-66e7-47cb-90e2-21bb6725b3c9	33333333-3333-4333-8333-333333333333	2026-08-13 23:35:53.785324+00	2026-08-13 23:35:53.785324+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
5bf812cb-4a8c-4ee6-9338-c89e13ac7ca9	22222222-2222-4222-8222-222222222222	2026-08-13 23:35:53.792177+00	2026-08-13 23:35:53.792177+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f16655a2-4830-486e-b10f-c2bf34accf02	11111111-1111-4111-8111-111111111111	2026-08-13 23:35:53.792822+00	2026-08-13 23:35:53.792822+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
44579d6a-1450-4095-a376-95a15fd01c90	33333333-3333-4333-8333-333333333333	2026-08-13 23:35:53.794406+00	2026-08-13 23:35:53.794406+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1d3d1178-6a1f-4974-a8d1-b8050c6f996d	11111111-1111-4111-8111-111111111111	2026-08-13 23:35:53.798992+00	2026-08-13 23:35:53.798992+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d273a4a1-2c0f-4ad9-97f9-c5eb2629c00a	33333333-3333-4333-8333-333333333333	2026-08-13 23:35:53.8017+00	2026-08-13 23:35:53.8017+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
96199346-6adf-4be4-9fb9-2b7a0706d7c9	22222222-2222-4222-8222-222222222222	2026-08-13 23:35:53.807725+00	2026-08-13 23:35:53.807725+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
7b9db1b7-616d-4452-90e4-5fa059628433	33333333-3333-4333-8333-333333333333	2026-08-13 23:35:53.811235+00	2026-08-13 23:35:53.811235+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9df5762b-7e66-4603-b065-66d2436ba920	22222222-2222-4222-8222-222222222222	2026-08-13 23:35:53.823602+00	2026-08-13 23:35:53.823602+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
365bf5ac-ffac-42bc-83e8-07b1c6049447	11111111-1111-4111-8111-111111111111	2026-08-13 23:36:18.515758+00	2026-08-13 23:36:18.515758+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
0f8aabb0-35f4-4f3f-b3c9-a667a9416928	22222222-2222-4222-8222-222222222222	2026-08-13 23:36:18.522255+00	2026-08-13 23:36:18.522255+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4230d49d-65d7-49fa-a0e6-3bffdb6f6a72	22222222-2222-4222-8222-222222222222	2026-08-13 23:36:18.525305+00	2026-08-13 23:36:18.525305+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
db33cd17-755c-458a-9ad0-413ac8818146	11111111-1111-4111-8111-111111111111	2026-08-13 23:36:18.529589+00	2026-08-13 23:36:18.529589+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f0de650e-c81a-4307-a36f-dc7edd3191f6	33333333-3333-4333-8333-333333333333	2026-08-13 23:36:18.530095+00	2026-08-13 23:36:18.530095+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
25aafe6f-ce7e-440f-a00f-95eaf6621e1b	22222222-2222-4222-8222-222222222222	2026-08-13 23:36:18.52961+00	2026-08-13 23:36:18.52961+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
64b91055-dcbf-42ca-9f16-ee7d618f742c	11111111-1111-4111-8111-111111111111	2026-08-13 23:36:18.530415+00	2026-08-13 23:36:18.530415+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9b44cdef-db66-4ffc-a459-34dfa2cc424d	33333333-3333-4333-8333-333333333333	2026-08-13 23:36:18.531293+00	2026-08-13 23:36:18.531293+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
576abb2f-acfd-4b2b-8a21-781f5c5cf9db	33333333-3333-4333-8333-333333333333	2026-08-13 23:36:18.534448+00	2026-08-13 23:36:18.534448+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
df058c1e-58cd-45bc-8404-eab75bdfd7aa	11111111-1111-4111-8111-111111111111	2026-08-13 23:36:18.538201+00	2026-08-13 23:36:18.538201+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
96db6eda-2bb0-47a5-8bda-0ed2544ac3bb	22222222-2222-4222-8222-222222222222	2026-08-13 23:36:18.540161+00	2026-08-13 23:36:18.540161+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
71973fe7-52bb-4105-8262-2262c610a772	33333333-3333-4333-8333-333333333333	2026-08-13 23:36:18.547672+00	2026-08-13 23:36:18.547672+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6da85615-776f-42dd-a2d2-86f43518acd1	22222222-2222-4222-8222-222222222222	2026-08-13 23:38:46.567358+00	2026-08-13 23:38:46.567358+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9d3fedb4-c26e-4cee-a7e9-46b7e3bba5c2	33333333-3333-4333-8333-333333333333	2026-08-13 23:38:46.57235+00	2026-08-13 23:38:46.57235+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a276db6d-5ed6-439d-906a-f4b158a836c7	33333333-3333-4333-8333-333333333333	2026-08-13 23:38:46.573278+00	2026-08-13 23:38:46.573278+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
0b026ac2-2157-4154-a6b3-9bc5bfc42a5a	11111111-1111-4111-8111-111111111111	2026-08-13 23:38:46.578252+00	2026-08-13 23:38:46.578252+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
51a7a206-b149-4852-8f17-41105f73dc2a	22222222-2222-4222-8222-222222222222	2026-08-13 23:38:46.580758+00	2026-08-13 23:38:46.580758+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
14400a53-7104-4380-bc0b-9a7ab3d1206a	11111111-1111-4111-8111-111111111111	2026-08-13 23:38:46.583761+00	2026-08-13 23:38:46.583761+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6f521325-642c-4661-8c03-ab03a81afced	33333333-3333-4333-8333-333333333333	2026-08-13 23:38:46.662274+00	2026-08-13 23:38:46.662274+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9354654f-1f6a-49f8-b19b-d384e78cc51a	11111111-1111-4111-8111-111111111111	2026-08-13 23:38:46.667233+00	2026-08-13 23:38:46.667233+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
df659605-86ba-4efc-b29b-7192637d9574	22222222-2222-4222-8222-222222222222	2026-08-13 23:38:46.668151+00	2026-08-13 23:38:46.668151+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
52a57bf1-0382-4df4-82c1-06d9c4d83a77	33333333-3333-4333-8333-333333333333	2026-08-13 23:38:46.67073+00	2026-08-13 23:38:46.67073+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4a78a40e-395e-4fd5-96bc-82bf5d90db8e	11111111-1111-4111-8111-111111111111	2026-08-13 23:38:46.671962+00	2026-08-13 23:38:46.671962+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
5636fd3c-d9ec-4478-8d05-e33e028e2264	22222222-2222-4222-8222-222222222222	2026-08-13 23:38:46.675392+00	2026-08-13 23:38:46.675392+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c3f9b27e-3f1e-436b-834b-2a8820d4f483	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:13.969492+00	2026-08-13 23:39:13.969492+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
bdd1d6c3-387d-408e-be73-15fab06abc0f	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:13.977256+00	2026-08-13 23:39:13.977256+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
1dc3cb84-3c1d-4eb0-9168-e5bc19729c3b	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:13.980267+00	2026-08-13 23:39:13.980267+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
8a519762-b87a-4f02-89e2-da24afce9ee6	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:13.983114+00	2026-08-13 23:39:13.983114+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
35df321b-0d3d-4223-ad4e-4c5825d4adc3	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:13.987342+00	2026-08-13 23:39:13.987342+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a8a2c7f8-2b78-40e8-901d-6cc4f062a9a2	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:13.989032+00	2026-08-13 23:39:13.989032+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d8b48198-2ba0-40d1-a0bf-ea8f5372e5b3	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:14.083422+00	2026-08-13 23:39:14.083422+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a7984518-76d8-46fb-bf5f-e62b976d9472	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:14.079156+00	2026-08-13 23:39:14.079156+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
18672e63-9fe3-4c6a-afa4-09b1d005f9b3	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:14.084902+00	2026-08-13 23:39:14.084902+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
50164be0-dc4c-4fde-beab-48fed3281a0a	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:14.095837+00	2026-08-13 23:39:14.095837+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
2a2bbc41-0249-4f2d-9744-51f655a89250	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:14.097774+00	2026-08-13 23:39:14.097774+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
cba6296c-f821-4b7a-94d9-bc7bd1c597fc	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:14.098181+00	2026-08-13 23:39:14.098181+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4d23128c-9d23-4437-a108-6566acc9a998	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:39.95694+00	2026-08-13 23:39:39.95694+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
330fe554-9404-4694-b1b3-00fdebffa0d8	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:39.961166+00	2026-08-13 23:39:39.961166+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
32535756-7508-401d-9501-652c7047371a	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:39.961244+00	2026-08-13 23:39:39.961244+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
eba000e6-4642-45a4-8531-97108da38fd2	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:39.961949+00	2026-08-13 23:39:39.961949+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b826d386-5eb6-4c8d-a8e9-9fbd7b22496b	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:39.962186+00	2026-08-13 23:39:39.962186+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a197e690-138e-41c3-a1cc-5b7eea36e5bb	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:39.964525+00	2026-08-13 23:39:39.964525+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
035dbb20-8fc8-4025-a0af-1751a58ca959	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:40.069376+00	2026-08-13 23:39:40.069376+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
758aac43-b2ab-471d-abbd-7f6a94bfe8b2	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:40.07039+00	2026-08-13 23:39:40.07039+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
e9dc2f75-e58d-4af2-addb-6773d43480bd	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:40.077839+00	2026-08-13 23:39:40.077839+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d8ff4723-9df6-4338-9476-deaf7246ead0	22222222-2222-4222-8222-222222222222	2026-08-13 23:39:40.078536+00	2026-08-13 23:39:40.078536+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
273a50f6-4b8b-4535-9ba2-54b7d83f9828	11111111-1111-4111-8111-111111111111	2026-08-13 23:39:40.084277+00	2026-08-13 23:39:40.084277+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
24bd3b48-1874-4ddd-899a-d5e0862f60b4	33333333-3333-4333-8333-333333333333	2026-08-13 23:39:40.089994+00	2026-08-13 23:39:40.089994+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
aa38e1c2-5c53-4733-85bc-25ff0eb46813	22222222-2222-4222-8222-222222222222	2026-08-13 23:40:05.185066+00	2026-08-13 23:40:05.185066+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
254d4eb9-424d-4922-b7ad-9e5ee94dd9a4	11111111-1111-4111-8111-111111111111	2026-08-13 23:40:05.18892+00	2026-08-13 23:40:05.18892+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
519e8042-5a7d-41e2-bb92-a8654fed37b9	33333333-3333-4333-8333-333333333333	2026-08-13 23:40:05.189844+00	2026-08-13 23:40:05.189844+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
010dedbc-ad85-4569-97d3-7db883821b7b	11111111-1111-4111-8111-111111111111	2026-08-13 23:40:05.258235+00	2026-08-13 23:40:05.258235+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
664ad403-2d76-42d1-855d-be6d7e6e61e4	22222222-2222-4222-8222-222222222222	2026-08-13 23:40:05.270425+00	2026-08-13 23:40:05.270425+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fc8a520e-99cf-42a0-8bcd-9a179a144230	33333333-3333-4333-8333-333333333333	2026-08-13 23:40:05.296401+00	2026-08-13 23:40:05.296401+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
5c72cddc-ddea-4bd3-9f51-21d6bf6a6df8	33333333-3333-4333-8333-333333333333	2026-08-13 23:40:05.364206+00	2026-08-13 23:40:05.364206+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
ba422ee1-b4d8-40dc-9c6a-2d4b436853a2	11111111-1111-4111-8111-111111111111	2026-08-13 23:40:05.375826+00	2026-08-13 23:40:05.375826+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
be5e7161-30cf-4df1-92c0-dae43aada6cb	22222222-2222-4222-8222-222222222222	2026-08-13 23:40:05.378167+00	2026-08-13 23:40:05.378167+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
eceab32b-9fa7-4226-a6a3-ba7975a2f06b	11111111-1111-4111-8111-111111111111	2026-08-13 23:40:05.386956+00	2026-08-13 23:40:05.386956+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
877445df-7132-4bcd-8c52-3d103785c719	22222222-2222-4222-8222-222222222222	2026-08-13 23:40:05.390483+00	2026-08-13 23:40:05.390483+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
bcc12774-8652-49c3-b2dc-f78775f89846	33333333-3333-4333-8333-333333333333	2026-08-13 23:40:05.391413+00	2026-08-13 23:40:05.391413+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
31598b2f-6c75-4ac9-a0ab-b6fd7f404844	33333333-3333-4333-8333-333333333333	2026-08-13 23:42:41.476245+00	2026-08-13 23:42:41.476245+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4b0bee1b-f88a-487e-bbe0-995c23a53fff	22222222-2222-4222-8222-222222222222	2026-08-13 23:42:41.482092+00	2026-08-13 23:42:41.482092+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
62390249-7050-420d-acc3-cc6e7353841a	22222222-2222-4222-8222-222222222222	2026-08-13 23:42:41.48579+00	2026-08-13 23:42:41.48579+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
e856833c-9908-4b6c-883a-7e4f56cd1ec2	33333333-3333-4333-8333-333333333333	2026-08-13 23:42:41.486043+00	2026-08-13 23:42:41.486043+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
0a62648b-ef3c-4822-a860-d7400492c1ce	11111111-1111-4111-8111-111111111111	2026-08-13 23:42:41.489367+00	2026-08-13 23:42:41.489367+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
7f3651e1-25f3-408b-aa73-2f4c87e1c185	11111111-1111-4111-8111-111111111111	2026-08-13 23:42:41.490056+00	2026-08-13 23:42:41.490056+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a007e4b9-aea0-41f1-aa1c-56a19f10f708	22222222-2222-4222-8222-222222222222	2026-08-13 23:42:41.562397+00	2026-08-13 23:42:41.562397+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c66537f7-3cc7-402f-a82d-bab8548223bb	11111111-1111-4111-8111-111111111111	2026-08-13 23:42:41.566797+00	2026-08-13 23:42:41.566797+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
906e43df-74c0-423a-84c4-d7e5c9c81f5d	22222222-2222-4222-8222-222222222222	2026-08-13 23:42:41.566621+00	2026-08-13 23:42:41.566621+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
2bd0b96a-ba17-46d5-b189-ef4fdee34204	33333333-3333-4333-8333-333333333333	2026-08-13 23:42:41.568128+00	2026-08-13 23:42:41.568128+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f8f5db6f-6026-4bfb-9d44-2818e72b4939	11111111-1111-4111-8111-111111111111	2026-08-13 23:42:41.569946+00	2026-08-13 23:42:41.569946+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fbfc8a01-168a-459f-b58e-a8e651f15fcd	33333333-3333-4333-8333-333333333333	2026-08-13 23:42:41.578541+00	2026-08-13 23:42:41.578541+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
5bc2db4a-225c-4250-8d0c-59a2cad98f18	11111111-1111-4111-8111-111111111111	2026-08-13 23:43:18.295438+00	2026-08-13 23:43:18.295438+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6becca5a-c23e-4e5f-8acd-3290444fe560	22222222-2222-4222-8222-222222222222	2026-08-13 23:43:18.297688+00	2026-08-13 23:43:18.297688+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
33f34d14-b536-46e2-a1d2-765eb3e718d9	33333333-3333-4333-8333-333333333333	2026-08-13 23:43:18.297232+00	2026-08-13 23:43:18.297232+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
82076bfc-7595-4b24-bc8a-bbd5dd1ea511	22222222-2222-4222-8222-222222222222	2026-08-13 23:43:18.298975+00	2026-08-13 23:43:18.298975+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9939e4e0-fbdb-40b5-9f3f-e314fefce4d6	11111111-1111-4111-8111-111111111111	2026-08-13 23:43:18.301527+00	2026-08-13 23:43:18.301527+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
cf30703e-224e-4a92-8cb1-58eaae2ba983	33333333-3333-4333-8333-333333333333	2026-08-13 23:43:18.301766+00	2026-08-13 23:43:18.301766+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fcb6899e-a035-49df-9f14-384b52ba164c	33333333-3333-4333-8333-333333333333	2026-08-13 23:43:18.372127+00	2026-08-13 23:43:18.372127+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
969f8ce1-2887-4825-b50f-2fd44bb0588f	11111111-1111-4111-8111-111111111111	2026-08-13 23:43:18.376493+00	2026-08-13 23:43:18.376493+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
99207d61-b41f-4cf6-b59d-4d39a83ef4ea	22222222-2222-4222-8222-222222222222	2026-08-13 23:43:18.391016+00	2026-08-13 23:43:18.391016+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b4339069-2d9d-495b-b557-18ce6acddb64	11111111-1111-4111-8111-111111111111	2026-08-13 23:43:18.392964+00	2026-08-13 23:43:18.392964+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
80e1cfd6-cc5b-49e5-b3dc-d2bae56fe110	33333333-3333-4333-8333-333333333333	2026-08-13 23:43:18.397086+00	2026-08-13 23:43:18.397086+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
e6a97038-3735-4b83-afef-ca47ed8ef2e1	22222222-2222-4222-8222-222222222222	2026-08-13 23:43:18.401903+00	2026-08-13 23:43:18.401903+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d9470680-18a7-4229-bb6a-54c19e02b66a	11111111-1111-4111-8111-111111111111	2026-08-13 23:44:26.423843+00	2026-08-13 23:44:26.423843+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
105bef7b-969b-412a-814d-041aabb84b85	33333333-3333-4333-8333-333333333333	2026-08-13 23:44:26.425959+00	2026-08-13 23:44:26.425959+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f13d3131-5969-4ebd-9393-fa41fb259bd6	22222222-2222-4222-8222-222222222222	2026-08-13 23:44:26.430517+00	2026-08-13 23:44:26.430517+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
14aa89b6-ef01-460c-a2c4-5d88f29aa347	11111111-1111-4111-8111-111111111111	2026-08-13 23:44:26.521266+00	2026-08-13 23:44:26.521266+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
3a468fbd-6184-4217-a81c-bf5424f7c35b	22222222-2222-4222-8222-222222222222	2026-08-13 23:44:26.523794+00	2026-08-13 23:44:26.523794+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
bc3b0d8f-fd59-4382-884d-3408c909ee31	11111111-1111-4111-8111-111111111111	2026-08-13 23:44:26.526899+00	2026-08-13 23:44:26.526899+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c16d3b40-01a3-491b-af5b-9aaaec5350d8	22222222-2222-4222-8222-222222222222	2026-08-13 23:44:26.531085+00	2026-08-13 23:44:26.531085+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
05a643fc-04f8-4ce9-b92f-5490d0e0f557	33333333-3333-4333-8333-333333333333	2026-08-13 23:44:26.532047+00	2026-08-13 23:44:26.532047+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
69090e49-8213-422e-bbd3-862648689f3b	33333333-3333-4333-8333-333333333333	2026-08-13 23:44:26.537945+00	2026-08-13 23:44:26.537945+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9c255ddf-d96e-4d07-9db6-fe977bd593a5	33333333-3333-4333-8333-333333333333	2026-08-13 23:44:26.539575+00	2026-08-13 23:44:26.539575+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
df417782-dfd7-4788-ba67-a84e8072e170	11111111-1111-4111-8111-111111111111	2026-08-13 23:44:26.539708+00	2026-08-13 23:44:26.539708+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f6739dae-b50a-4de1-b651-42917db6f2a2	22222222-2222-4222-8222-222222222222	2026-08-13 23:44:26.540412+00	2026-08-13 23:44:26.540412+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4a8deb10-e216-4586-8d1a-bad860f1e2c9	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:18.207531+00	2026-08-13 23:45:18.207531+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
46f95cd2-2d0b-41a5-9dcb-be48b1241617	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:18.208077+00	2026-08-13 23:45:18.208077+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
d32d76c3-b7fd-468a-bef8-76bac202b992	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:18.208584+00	2026-08-13 23:45:18.208584+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c56713a0-bdb7-4122-b5b1-e4b89370767e	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:18.34585+00	2026-08-13 23:45:18.34585+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
cd42f384-68c7-4a06-9d11-e676ce90be4f	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:18.348505+00	2026-08-13 23:45:18.348505+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
248c1c7b-0f95-4e9e-b6ff-242661c537d4	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:18.347242+00	2026-08-13 23:45:18.347242+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c4355c1a-109e-4ba2-a1c6-da700a839f1d	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:18.34591+00	2026-08-13 23:45:18.34591+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f9695ad0-34e1-4dcd-8e88-fc6d1fa9fa68	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:18.349555+00	2026-08-13 23:45:18.349555+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
6b7389f9-9259-4857-bdfe-f1a009a7a39f	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:18.348456+00	2026-08-13 23:45:18.348456+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4399a5b2-f0a6-4a8d-a355-d756d5432a8a	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:18.348407+00	2026-08-13 23:45:18.348407+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9bb6b32c-5804-4bd4-bd63-cc48fc8197ee	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:18.353713+00	2026-08-13 23:45:18.353713+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9c45c65c-a631-4a6c-980b-4f21f09bcc54	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:18.356909+00	2026-08-13 23:45:18.356909+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
81e83d13-faef-4bc5-be0e-67b3361bd87b	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:44.6702+00	2026-08-13 23:45:44.6702+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a6a1c8f0-58f2-47dc-b82d-127bf4e28791	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:44.67052+00	2026-08-13 23:45:44.67052+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
45a5d384-bba6-42bb-b7c0-2c9d403d455c	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:44.672092+00	2026-08-13 23:45:44.672092+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
0190e3e8-ff41-4745-abe7-9a8136faa9b7	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:44.766213+00	2026-08-13 23:45:44.766213+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c8acc2e9-12d7-4653-b526-04d2236e1682	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:44.769915+00	2026-08-13 23:45:44.769915+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4f53ec0d-e22f-445c-9a71-85a1d8aa8d30	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:44.771221+00	2026-08-13 23:45:44.771221+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
0d7590e2-5381-4f8f-95d4-0230a9fc50b5	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:44.771177+00	2026-08-13 23:45:44.771177+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
997e984c-5297-4da2-be24-b3ff52a08980	11111111-1111-4111-8111-111111111111	2026-08-13 23:45:44.772301+00	2026-08-13 23:45:44.772301+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
843c1548-41ab-496a-8294-c8bbf286e3fe	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:44.773284+00	2026-08-13 23:45:44.773284+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
4398d8dc-22c8-4daa-a3b0-92a8a1e55ec3	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:44.773609+00	2026-08-13 23:45:44.773609+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
03dbb9b3-f806-40f6-a49b-9488f5a3c70c	33333333-3333-4333-8333-333333333333	2026-08-13 23:45:44.780537+00	2026-08-13 23:45:44.780537+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
570b6030-9197-4a5a-aba3-ecb21b4fcf67	22222222-2222-4222-8222-222222222222	2026-08-13 23:45:44.794186+00	2026-08-13 23:45:44.794186+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
15598ad6-3d24-4771-a19e-5e094c859653	11111111-1111-4111-8111-111111111111	2026-08-13 23:46:00.173885+00	2026-08-13 23:46:00.173885+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
0f5b37e3-1226-4136-a705-e4cb0ec04d92	22222222-2222-4222-8222-222222222222	2026-08-13 23:46:00.173806+00	2026-08-13 23:46:00.173806+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c15126c4-5430-4cbf-babe-e9a0e8ba1dfa	33333333-3333-4333-8333-333333333333	2026-08-13 23:46:00.175215+00	2026-08-13 23:46:00.175215+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
f66a9367-911a-4663-851b-cd01480f6329	22222222-2222-4222-8222-222222222222	2026-08-13 23:46:08.926001+00	2026-08-13 23:46:08.926001+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fc7e4d28-d2c2-4acc-a574-8364c42c8aed	11111111-1111-4111-8111-111111111111	2026-08-13 23:46:08.926397+00	2026-08-13 23:46:08.926397+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
7bf1f0d7-3a21-4fe6-8b68-42345aefb470	33333333-3333-4333-8333-333333333333	2026-08-13 23:46:08.927332+00	2026-08-13 23:46:08.927332+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
a3d67c86-accd-43e4-944c-516c530c5120	22222222-2222-4222-8222-222222222222	2026-08-13 23:46:48.158253+00	2026-08-13 23:46:48.158253+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
c19c026b-b89e-4f13-9471-3190ac93bf7b	33333333-3333-4333-8333-333333333333	2026-08-13 23:46:48.158172+00	2026-08-13 23:46:48.158172+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
363e11b4-191d-45d6-8b85-63e5e53d1867	11111111-1111-4111-8111-111111111111	2026-08-13 23:46:48.159508+00	2026-08-13 23:46:48.159508+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b182aef0-64ef-44b8-9536-8587392400b4	11111111-1111-4111-8111-111111111111	2026-08-13 23:46:48.518955+00	2026-08-13 23:46:48.518955+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
27c2e1a1-9cf0-4ce4-849f-875b43802d9f	33333333-3333-4333-8333-333333333333	2026-08-13 23:46:48.51893+00	2026-08-13 23:46:48.51893+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
cc4b213e-a314-4ff4-ae9d-95f401d5be1c	22222222-2222-4222-8222-222222222222	2026-08-13 23:46:48.520274+00	2026-08-13 23:46:48.520274+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
fca5b198-0879-424d-b74b-71c4e259fbc7	22222222-2222-4222-8222-222222222222	2026-08-13 23:46:48.889446+00	2026-08-13 23:46:48.889446+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
2284a547-ede4-462e-9746-4f02055a8c2f	11111111-1111-4111-8111-111111111111	2026-08-13 23:46:48.889562+00	2026-08-13 23:46:48.889562+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
091ee76a-2387-49ec-96ed-9edade77e7af	33333333-3333-4333-8333-333333333333	2026-08-13 23:46:48.890568+00	2026-08-13 23:46:48.890568+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
9e6f0c29-6a57-489f-bb77-8ac42d307e61	11111111-1111-4111-8111-111111111111	2026-08-13 23:46:49.389115+00	2026-08-13 23:46:49.389115+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
339c2340-c61a-44fc-a6ec-e381bfdc2462	33333333-3333-4333-8333-333333333333	2026-08-13 23:46:49.393093+00	2026-08-13 23:46:49.393093+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
943827e7-2364-4c66-98d5-813f955edc2f	22222222-2222-4222-8222-222222222222	2026-08-13 23:46:49.397204+00	2026-08-13 23:46:49.397204+00	\N	aal1	\N	\N	node	172.18.0.1	\N	\N	\N	\N	\N
b368d347-b60d-4b46-84fa-5212dbc62abc	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:28:44.416037+00	2026-08-14 13:11:27.190399+00	\N	aal1	\N	2026-08-14 13:11:27.190356	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	172.18.0.1	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	01995e19-0de1-4ddb-b53e-0dff2cb718aa	authenticated	authenticated	neuropsicologo@dritalojardim.com	$2a$10$7Ew0exY0eEvcC4H3cJCgIOQsz08l.e5biHkHdlSVdbX5d9hu6KOoi	2026-08-13 19:42:51.959677+00	\N		\N		\N			\N	2026-08-14 00:28:44.41594+00	{"provider": "email", "providers": ["email"]}	{"sub": "01995e19-0de1-4ddb-b53e-0dff2cb718aa", "email": "neuropsicologo@dritalojardim.com", "full_name": "Ítalo Paiva Jardim", "email_verified": true, "phone_verified": false}	\N	2026-08-13 19:42:51.949057+00	2026-08-14 13:11:27.189504+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	11111111-1111-4111-8111-111111111111	authenticated	authenticated	admin@praxis.dev	$2a$06$QUPjDui6LGkheGrT4bCcY.gzzfAcQEl90Ll0hBoLBaYlWT3I9JoQu	2026-08-13 15:53:36.177243+00	\N		\N		\N			\N	2026-08-13 23:46:49.38907+00	{"provider": "email", "providers": ["email"]}	{"full_name": "Ítalo Jardim"}	\N	2026-08-13 15:53:36.177243+00	2026-08-13 23:46:49.392219+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	33333333-3333-4333-8333-333333333333	authenticated	authenticated	admin@outra.dev	$2a$06$IK3zwHHlQyIVPPYTVfoipuORHh.KX0CYfiy0re2Uh413LSO.cUm9G	2026-08-13 15:53:36.177243+00	\N		\N		\N			\N	2026-08-13 23:46:49.393058+00	{"provider": "email", "providers": ["email"]}	{"full_name": "Admin Outra Empresa"}	\N	2026-08-13 15:53:36.177243+00	2026-08-13 23:46:49.397043+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	22222222-2222-4222-8222-222222222222	authenticated	authenticated	assistente@praxis.dev	$2a$06$u5qR/8lr3NeMLaYOUVGcO.0xd6ZkEUnZroXY4GeN8hajyTBGLhIP.	2026-08-13 15:53:36.177243+00	\N		\N		\N			\N	2026-08-13 23:46:49.397176+00	{"provider": "email", "providers": ["email"]}	{"full_name": "Assistente Praxis"}	\N	2026-08-13 15:53:36.177243+00	2026-08-13 23:46:49.399634+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, workspace_id, lead_id, type, content, meta, actor_id, created_at) FROM stdin;
270	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Oiee boa noite Italo	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 00:03:10.958532+00
272	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Beleza	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:09:43.587162+00
274	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Qual você acha que eu gravo ?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:09:53.905446+00
277	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	stage_change	Qualificação → Novo lead	{"to_stage_type": "new", "from_stage_type": "qualification"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:52.706649+00
221	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	Vai me avisando	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:44:02.242023+00
279	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	stage_change	Qualificação → Novo lead	{"to_stage_type": "new", "from_stage_type": "qualification"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:54.366894+00
281	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	opa	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 00:17:35.361917+00
231	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:45:10.165637+00
282	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	agora to pronto	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 00:17:40.787441+00
283	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	opa	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:17:43.830259+00
284	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	vou te mandar o link	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:18:03.533132+00
285	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	okk	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 00:18:26.658039+00
286	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	https://meet.google.com/rrn-vvgw-byy	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:18:28.961216+00
288	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	stage_change	Novo lead → Follow-up pré-sessão	{"to_stage_type": "follow_up_pre_session", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:35.707511+00
240	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	Fica em paz mestre	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:45:28.324993+00
241	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	Vai lá	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:45:31.249511+00
290	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	stage_change	Novo lead → Sessão de alinhamento	{"to_stage_type": "alignment_session", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:41.109711+00
292	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	stage_change	Follow-up pós-sessão → Venda realizada	{"to_stage_type": "won", "from_stage_type": "follow_up_post_session"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:49.347026+00
294	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	stage_change	Follow-up pós-sessão → Perdido	{"to_stage_type": "lost", "from_stage_type": "follow_up_post_session"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:55.083816+00
296	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	https://www.youtube.com/watch?v=BUGZZaChiYw&pp=ygUSY29tbyB1c2FyIG8gZ2l0aHVi	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:03:23.109806+00
298	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	https://saaspsicologos.vercel.app/	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:27:02.542202+00
300	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Eu tô brincando de programador aqui	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:32:31.20378+00
302	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	E um sistema de gestão de clínica	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:32:48.051195+00
304	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Claude?	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:33:52.792726+00
306	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	E usando o antigravity	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:36:41.846386+00
308	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	[mídia]	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:37:12.985014+00
127	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	fala meu amigo to em casa ja	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 22:39:57.524431+00
128	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	quando der é so me chamar	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 22:40:08.631132+00
129	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	message	Ola	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 22:42:11.626081+00
130	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	call	eai como estão as coisas?	{}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-13 22:43:11.802399+00
131	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	TESTE-DIAGNOSTICO-NAO-ENVIAR	{"provider": "whatsapp", "direction": "outbound"}	11111111-1111-4111-8111-111111111111	2026-08-13 22:47:57.323958+00
132	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	ORDO: teste do caminho completo pela fila	{"provider": "whatsapp", "direction": "outbound"}	11111111-1111-4111-8111-111111111111	2026-08-13 22:57:13.64425+00
133	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	call	testando crm	{}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-13 22:57:50.466712+00
134	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	ORDO: teste pela interface	{"provider": "whatsapp", "direction": "outbound"}	11111111-1111-4111-8111-111111111111	2026-08-13 22:59:27.378716+00
135	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	message	mas a supervisão faz isso tambem	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:02:53.703622+00
136	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	message	vou te ajudar com isso na pratica	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:03:02.579191+00
137	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	message	ola como posso te ajudar?	{"provider": "whatsapp", "direction": "outbound"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-13 23:07:16.769185+00
138	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Boa noite Sara tudo bem?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:14:24.249075+00
139	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Como está o cronograma de postagens?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:14:32.379752+00
140	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Queria ver contigo com relação aos 4 vídeos que eu vou gravar por aqui também	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:14:58.769568+00
141	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Queria  gravar nesse sábado e na segunda pra já te enviar	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:15:04.893112+00
142	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	ORDO: mensagem agendada (teste automatico)	{"direction": "outbound", "scheduled": true}	11111111-1111-4111-8111-111111111111	2026-08-13 23:30:26.352578+00
143	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	teste	{"provider": "whatsapp", "direction": "outbound"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-13 23:30:55.050008+00
144	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	Isso mesmo	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:35:33.758223+00
145	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	Eu nem sabia que existia isso cara	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:35:38.615238+00
311	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Sensacional	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:37:59.991359+00
160	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:38:33.278993+00
171	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:39:11.440332+00
271	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Isso, eu ia te perguntar também! Você falou q tá bem corrido essa semana… eu vou ficar off final de semana e já tenho 3 vídeos quase finalizados no gatilhos, vou terminar entre hoje e amanhã, daí ficamos tranquilos ate semana que vem, se você conseguir gravar final de semana fica ótimo para entrar n	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 00:04:47.164868+00
273	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	message	Ai você me manda os roteiros ?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:09:49.294749+00
202	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	[mídia]	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-13 23:40:08.57603+00
275	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	Combinado	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 00:10:03.399911+00
276	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	stage_change	Novo lead → Qualificação	{"to_stage_type": "qualification", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:52.109094+00
220	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	Entendi	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:43:53.865156+00
222	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	message	Me avisa de segunda tbm p eu me organizar	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-13 23:44:08.914334+00
278	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	stage_change	Novo lead → Qualificação	{"to_stage_type": "qualification", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:53.570623+00
280	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	stage_change	Novo lead → Follow-up pós-sessão	{"to_stage_type": "follow_up_post_session", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:13:50.954879+00
287	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	ola	{"provider": "whatsapp", "direction": "outbound"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:29:31.099839+00
289	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	stage_change	Novo lead → Qualificação	{"to_stage_type": "qualification", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:37.486314+00
291	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	stage_change	Sessão de alinhamento → Follow-up pós-sessão	{"to_stage_type": "follow_up_post_session", "from_stage_type": "alignment_session"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:46.356052+00
293	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	stage_change	Venda realizada → Sessão de alinhamento	{"to_stage_type": "alignment_session", "from_stage_type": "won"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:50.45712+00
295	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	https://trello.com/invite/b/687f9c9428c425dd422971b5/ATTI9b069b5c4c9d08db89ee119589be83a3F184731C/saas-para-psicologos	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 00:54:39.50738+00
297	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Tô parando agora kk	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:14:33.075495+00
299	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	num cartão: 0000 0000 0000 0004\nvencimento: 12/30\ncvc: 123	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:27:24.33205+00
301	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Montei hoje um CRM fudido	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:32:39.859397+00
303	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Caramba	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:33:51.014687+00
305	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Sim	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:36:33.071927+00
307	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	ola	{"provider": "whatsapp", "direction": "outbound"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 01:37:06.859576+00
309	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Top demais mano	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:37:35.022241+00
310	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Caraca	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 01:37:56.468727+00
312	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Não vou mais ficar pagando 150 conto em um CRM	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:39:16.6564+00
313	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Ta doido	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:39:21.469103+00
314	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Chega de sistema	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:39:25.539532+00
315	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	50 assinaturas	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:39:33.073479+00
316	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	E assinatura de gestão da Clincia, CRM, ia	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:39:44.970227+00
317	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	message	Agora to fazendo todos os meus sistemas	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 01:39:55.636333+00
318	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	aqui um p´review kkkkk	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:30:27.260468+00
319	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:30:27.317363+00
320	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:30:27.325839+00
321	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	to trabalhando n odesign ainda	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:30:31.019462+00
322	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	esse é a parte do prontuario que to fazendo	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:30:39.667391+00
323	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	Top	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 02:36:43.817344+00
324	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	Gostei da sessão de objetivos ali	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 02:36:51.897018+00
325	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	O pessoal do CRM lá	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 02:36:57.484865+00
326	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	Pediu seu e-mail para te dar acesso ao GitHub com o código do CRM deles	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 02:37:10.218064+00
327	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	ahh beleza	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:37:19.93839+00
328	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	vou pegar o de dev aqui	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:37:23.561861+00
329	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	to tentando focar as coisas mais nesse email aqui que é novo kkkk \n\ndesenvolvedormaicon@gmail.com	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 02:39:02.421443+00
330	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 09:32:42.857942+00
331	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	Diaaa	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:07:31.147115+00
332	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	dei uma modificada	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:07:34.400607+00
333	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	[mídia]	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:07:36.182524+00
334	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	tava muito poluido kkk	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:07:39.529782+00
335	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Bom dia Bianca tudo bem?😊	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:46:19.212437+00
336	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Bianca deu um imprevisto aqui aqui, estou sem internet	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:46:38.970605+00
337	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Falta apenas um teste para realizarmos vou te enviar o link da mesma forma que fizemos segunda tudo bem?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:47:12.406467+00
338	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Bom dia doutor tudo bem?	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:49:45.581793+00
339	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Beleza :)	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:49:48.444792+00
340	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	message	Bom dia Alexandre tudo bom?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:52:33.507893+00
341	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	message	Como você está?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:52:37.014153+00
342	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	message	Como foi seu dia pós sessão?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:52:53.484476+00
343	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	message	E como estão as coisas com a Gabi?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:53:07.053292+00
344	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Peço desculpas 😞	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:53:18.309866+00
345	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	A internet simplesmente não quer funcionar aqui	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:53:29.854421+00
346	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Liguei na operadora parece que é instabilidade na minha região	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 11:53:42.030651+00
347	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Acontece	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:53:53.880935+00
348	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Tudo bem	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:53:56.281505+00
349	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Qualquer coisa a gente remarca	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 11:54:02.59882+00
350	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Bom dia papito	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:23:33.996462+00
351	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Fala comigo	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:23:48.576365+00
352	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Hope	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:25:54.895603+00
353	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Bom dia meu amigo	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:25:58.180836+00
354	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Tudo bom?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:26:00.635523+00
355	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Combinado Bianca 🙏🏻	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:26:13.04134+00
356	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	message	Mais uma vez peço desculpas por esse imprevisto	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:26:20.503461+00
357	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Tudo na paz	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:26:27.062606+00
358	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Como que faz pra marcarmos uma consulta e os valores?	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:26:43.404616+00
359	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Deixa eu só entender uma coisa	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:27:08.285703+00
360	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	A empresa que vai pagar a terapia ?	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:27:22.931311+00
361	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Só para eu saber se vou emitir nota pra cnpj kkk	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:27:39.487262+00
362	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Precisa emitir nota não	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:27:50.946056+00
363	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Kkkkkk	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:28:01.159901+00
364	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Ctz?  Eu ja emito normalmente por conta da contabilidade kkkkkkk	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:28:26.406751+00
365	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Ai qualquer coisa eu emito no nome dele então	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:28:37.49761+00
366	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Sim	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:29:17.048748+00
367	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Então mestre, primeiro a gente precisa fazer uma primeira sessão que é a sessão de alinhamento, nela vou entender um pouco do que tem acontecido, qual a demanda dele, fazer o acolhimento início e dar início a um planejamento terapêutico	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:29:33.691854+00
368	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Essa sessão é lá custa R$250,00	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:29:48.39914+00
369	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Ai nela a gente define os pacotes de terapia, de acordo com a necessidade dele	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:30:11.698875+00
370	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Vou te mandar um PDF que explica tudo o que e feito nessa sessão	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:30:27.135225+00
371	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Show	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:30:36.910119+00
372	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Ai manda pra ele rmabem	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:30:37.15744+00
373	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Tá	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:30:43.132204+00
374	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	[mídia]	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:31:05.06288+00
375	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Da uma olhada e me diz o que achou	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:31:21.218222+00
376	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	E aí a gente ia agenda essa primeira sessão	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:31:29.519779+00
377	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	message	Show	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:31:32.867363+00
378	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	[mídia]	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:32:53.802584+00
379	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	message	Boom dia 😄	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:33:08.403162+00
380	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	message	Recebido, até mais tarde 😁	{"provider": "whatsapp", "direction": "outbound"}	\N	2026-08-14 12:33:19.642146+00
381	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	message	é legal da pra fazer	{"provider": "whatsapp", "direction": "inbound"}	\N	2026-08-14 12:35:10.30698+00
382	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	stage_change	Novo lead → Sessão de alinhamento	{"to_stage_type": "alignment_session", "from_stage_type": "new"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:33:59.80034+00
383	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	stage_change	Sessão de alinhamento → Venda realizada	{"to_stage_type": "won", "from_stage_type": "alignment_session"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:36:15.174314+00
384	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	system	Venda registrada — R$ 350.00	{}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:36:15.174314+00
385	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	stage_change	Venda realizada → Sessão de alinhamento	{"to_stage_type": "alignment_session", "from_stage_type": "won"}	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:36:23.671203+00
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, workspace_id, lead_id, title, starts_at, ends_at, status, location, description, meet_link, calendar_event_id, calendar_sync_status, calendar_sync_error, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, workspace_id, actor_id, action, entity_type, entity_id, details, created_at) FROM stdin;
1	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	9210f1be-aa1d-4453-9dac-c218ea809578	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 16:10:22.486514+00
2	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	3cedd5a1-6e54-40de-8a6a-06298b330f2e	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 16:10:22.51463+00
3	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	9e504d8e-1b2b-4cfd-bd0d-526e2e96c874	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 16:10:22.541139+00
4	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	ca96a2e1-c56d-4e7d-8f32-fe26f0a12836	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 16:10:22.549778+00
5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	d2729fc4-63b8-4ed9-8247-96a4ed3c16c5	{"role": "assistant"}	2026-08-13 16:10:22.552371+00
6	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	ca96a2e1-c56d-4e7d-8f32-fe26f0a12836	{}	2026-08-13 16:10:22.553421+00
7	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	d261142f-1fa9-4d8e-a51e-4159092fa9c0	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 16:49:09.828144+00
8	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	d214b59e-b8f4-46d4-9663-8d7930c0e85b	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 16:49:09.869215+00
9	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	789e2502-b62d-43d7-99ba-735bb8f81bfa	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 16:49:09.912192+00
10	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	7dff0b01-46ac-439a-858c-2bdadc223bbe	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 16:49:09.919965+00
11	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	7dff0b01-46ac-439a-858c-2bdadc223bbe	{}	2026-08-13 16:49:09.925733+00
12	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	37977145-8077-4138-9c12-9c51a48b19b2	{"role": "assistant"}	2026-08-13 16:49:09.934774+00
13	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	85fb4cdf-0395-4af5-81c5-bc8116a01509	{"product_id": "11110000-0000-4000-8000-000000000004", "sold_value": 1500}	2026-08-13 16:49:27.902708+00
14	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	d144ab32-1c3b-4bf0-bef9-db06c5d1def6	{"product_id": "11110000-0000-4000-8000-000000000004", "sold_value": 1500}	2026-08-13 16:52:32.243208+00
15	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	fa5a3c57-16a6-48ec-a56c-6cfb4d42232c	{"product_id": "11110000-0000-4000-8000-000000000004", "sold_value": 1500}	2026-08-13 16:53:31.296799+00
16	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	9f3d903c-16ff-4625-8079-a893b69ae608	{"product_id": "11110000-0000-4000-8000-000000000004", "sold_value": 1500}	2026-08-13 16:54:16.923179+00
17	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	dcc188d5-8caa-4e0e-8d44-bdb5421afb86	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 16:56:49.071322+00
18	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	ca93cc0a-e9a8-4771-9a81-4571f8cbc4d6	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 16:56:49.11448+00
19	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	69879ab8-17e1-47e3-bad5-9be466310299	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 16:56:49.145581+00
20	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	c515e7b7-ddc8-4bce-82de-9b64ce66bf1f	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 16:56:49.15564+00
21	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	c515e7b7-ddc8-4bce-82de-9b64ce66bf1f	{}	2026-08-13 16:56:49.160762+00
22	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	e45660f3-2794-4752-b371-dde1ec53c00b	{"role": "assistant"}	2026-08-13 16:56:49.161856+00
23	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	dcab6664-bf2d-4080-998b-0a969b25be22	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 17:23:14.258362+00
24	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	024f12fc-3fb8-463d-a737-32187b30b7ca	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 17:23:14.396082+00
25	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	76defe44-fb81-4b6f-8052-a44b2d467b03	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 17:23:14.477947+00
26	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	e66a899f-e548-4ddb-909c-4a80c7553669	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 17:23:14.552125+00
27	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	e66a899f-e548-4ddb-909c-4a80c7553669	{}	2026-08-13 17:23:14.569755+00
28	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	8e634291-91a1-4d8a-a357-7683eb06ffa5	{"role": "assistant"}	2026-08-13 17:23:14.586591+00
29	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	3c0ffd5d-1c3a-42d6-90e9-010fe8c21fdc	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 18:17:44.269391+00
30	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	097880b5-e6b5-4d54-9c5c-bb94809ae907	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 18:17:44.306132+00
31	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	d5fa0bb3-3f76-42e9-81c6-1c9e2f4d86ff	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 18:17:44.344132+00
32	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	86a01af1-6246-4a38-8fda-56c8ca7f15cd	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 18:17:44.348554+00
33	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	86a01af1-6246-4a38-8fda-56c8ca7f15cd	{}	2026-08-13 18:17:44.355228+00
34	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	f0f07447-2551-4a71-9bef-27dad8a2e5e7	{"role": "assistant"}	2026-08-13 18:17:44.363379+00
35	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	4df3102d-0fa3-448d-a749-d602c6fe1512	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 18:19:15.202444+00
36	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	5147fd6b-b03e-4f75-8eb0-829013125c77	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 18:19:15.260298+00
37	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	b6dcdff8-acf2-4117-a3a4-b263349d7be7	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 18:19:15.295862+00
38	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	f2a572bd-675b-48e3-8004-8063326438e8	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 18:19:15.302001+00
39	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	f2a572bd-675b-48e3-8004-8063326438e8	{}	2026-08-13 18:19:15.30752+00
40	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	bb65a365-29ac-4243-bc79-73b41c30419d	{"role": "assistant"}	2026-08-13 18:19:15.317747+00
41	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	f3e9febc-a17e-4a04-b43f-93bdebd7f5f5	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 18:20:04.484832+00
42	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	798d57b5-6741-4b0f-8f9f-6b61d7d33ad9	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 18:20:04.521238+00
89	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	f0231683-420c-4bd9-86ca-6790177f2ac1	{"role": "assistant"}	2026-08-13 23:39:40.19285+00
43	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	73b493d8-d6e6-4e97-a50e-c3cade787aa8	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 18:20:04.548622+00
44	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	fb5ca050-2abe-4099-a709-a0b5545b4caf	{"role": "assistant"}	2026-08-13 18:20:04.565944+00
45	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	09f519d9-f3b1-4120-bd5f-b61d5c3b75eb	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 18:20:04.56911+00
46	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	09f519d9-f3b1-4120-bd5f-b61d5c3b75eb	{}	2026-08-13 18:20:04.57587+00
47	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	252ee2b6-226b-432a-895a-5c00408c2c33	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 19:06:53.827383+00
48	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	84ef8168-6e75-4302-932f-bf324e18b813	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 19:06:53.855121+00
49	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	287360a9-9734-4972-8348-42a7dc2c7be6	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 19:06:53.881353+00
50	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	977b2b59-d5d3-46a2-8fbc-2e6efc4cc4fd	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 19:06:53.897235+00
51	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	e0437571-e9c5-4663-a80e-d8a3afe9459d	{"role": "assistant"}	2026-08-13 19:06:53.900206+00
52	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	977b2b59-d5d3-46a2-8fbc-2e6efc4cc4fd	{}	2026-08-13 19:06:53.901932+00
53	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	e80ec821-d6ac-4557-b8f5-905f304d3ef1	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 19:09:34.832612+00
54	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	e7e2f004-5056-474a-929f-a146d5585803	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 19:09:34.85866+00
55	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	908bae23-500e-43d8-a01a-ef34e3a16534	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 19:09:34.894458+00
56	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	137e8c87-f817-410b-9b7d-0763a1e3a5da	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 19:09:34.908678+00
57	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	00bf2e27-e425-4795-bfd6-2b1ef2bd3bae	{"role": "assistant"}	2026-08-13 19:09:34.913799+00
58	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	137e8c87-f817-410b-9b7d-0763a1e3a5da	{}	2026-08-13 19:09:34.914287+00
59	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	48e4c5b4-c742-4fc9-a8f3-542b146f7a72	{"role": "assistant"}	2026-08-13 19:42:14.878605+00
60	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	57ee471c-8eca-4ec7-88c0-8a4ac9545c17	{"role": "admin"}	2026-08-13 19:42:21.16624+00
61	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	01995e19-0de1-4ddb-b53e-0dff2cb718aa	invitation_accepted	workspace_invitation	57ee471c-8eca-4ec7-88c0-8a4ac9545c17	{"role": "admin"}	2026-08-13 19:42:51.991739+00
62	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	5a828ac2-e016-4a29-8ab9-cc4cefdd6895	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:35:53.945463+00
63	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	e841df75-1e8d-48c7-afa5-5a48c39631f8	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:35:53.976314+00
64	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	0c3f2d6e-4118-435b-86cb-10a67f70810f	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:35:53.985249+00
65	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	0c3f2d6e-4118-435b-86cb-10a67f70810f	{}	2026-08-13 23:35:53.992015+00
66	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	d72873ac-d6e0-4f9f-992d-0e5309fb4fc5	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:35:54.008868+00
67	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	80485f52-a645-4b0b-95c9-52aebc010250	{"role": "assistant"}	2026-08-13 23:35:54.027971+00
68	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	75dcbed7-56ca-4b7a-ad1b-c4a93424cbee	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:36:18.644354+00
69	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	16d074a3-1a6c-4b71-9b14-3d5e14122db4	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:36:18.667482+00
70	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	340c644d-4c64-487b-999b-420ae023d24c	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:36:18.68967+00
71	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	680a7a9c-6c88-4f17-88b5-e36a9365c7a0	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:36:18.694395+00
72	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	340c644d-4c64-487b-999b-420ae023d24c	{}	2026-08-13 23:36:18.69657+00
73	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	b319b2e6-4c28-4102-99e1-b83c16a48466	{"role": "assistant"}	2026-08-13 23:36:18.718098+00
74	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	6e733040-6fc8-40e7-a9ff-a5a6e9fca896	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:38:46.704988+00
75	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	e1b9623d-ad84-487e-b5fc-6009c8cc6ccd	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:38:46.738315+00
76	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	bc07add7-9ebf-4982-a907-1d857f904ba6	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:38:46.765504+00
77	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	d187cb27-aec9-4092-bb77-2e38cc2891ad	{"role": "assistant"}	2026-08-13 23:38:46.788682+00
78	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	c819f854-cda4-40f5-99c0-8902f63a662c	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:38:46.817997+00
79	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	c819f854-cda4-40f5-99c0-8902f63a662c	{}	2026-08-13 23:38:46.821993+00
80	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	52e10a31-e24b-4b2c-bc2e-b77192a9a466	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:39:14.138535+00
81	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	b5dee3be-9726-4912-9f4a-506b3c750532	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:39:14.160472+00
82	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	10e96bd7-1ece-4687-8e77-e6df5d6c97bb	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:39:14.187168+00
83	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	2e5b9fc0-f695-4d9b-b50f-53f6c086312c	{"role": "assistant"}	2026-08-13 23:39:14.202782+00
84	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	2ce60a8d-eebe-4543-90c6-9aebb8a2d685	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:39:14.226807+00
85	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	2ce60a8d-eebe-4543-90c6-9aebb8a2d685	{}	2026-08-13 23:39:14.230205+00
86	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	0593863d-59c6-49e7-8d1f-d73cbf524880	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:39:40.103258+00
87	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	b768479b-f1cb-4a1c-bac2-deeb4a9edd54	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:39:40.130072+00
90	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	cf74604f-9356-40bb-93a2-c21c3485a7d5	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:39:40.226336+00
92	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	ee221eb4-32cd-4ffc-b751-b5b9cf8bddec	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:40:05.415656+00
96	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	95a23e9c-c6b7-46fb-b0e8-b5777497144a	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:40:05.507804+00
88	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	9f27bfd3-afa5-48f1-8522-76c190f892f5	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:39:40.159351+00
91	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	cf74604f-9356-40bb-93a2-c21c3485a7d5	{}	2026-08-13 23:39:40.231624+00
95	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	df7958a4-0467-4645-9776-2005a2e2f51f	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:40:05.462283+00
93	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	192ebbc0-4c3c-4972-b205-906f3db6acea	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:40:05.436652+00
94	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	b68cecf8-37c7-41c1-92cf-c14c19e32290	{"role": "assistant"}	2026-08-13 23:40:05.445299+00
97	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	95a23e9c-c6b7-46fb-b0e8-b5777497144a	{}	2026-08-13 23:40:05.511613+00
98	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	0c93866c-e2a2-49d7-b8de-f825f8adfd1c	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:42:41.617349+00
99	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	4f448778-0cab-45b1-af4c-abe558f03d09	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:42:41.648186+00
100	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	c2b76eb4-2c19-4ad1-abaa-c073ef6b5191	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:42:41.676452+00
101	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	28920ba7-e5e3-41b8-bf99-fae7942c2d19	{"role": "assistant"}	2026-08-13 23:42:41.681099+00
102	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	42cb6649-6fba-4d0c-b16a-362a10f95795	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:42:41.707205+00
103	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	8f9c25d7-d260-4346-bf2a-02bb14435455	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:43:18.438271+00
104	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	da710b12-beb2-48ed-be2e-dce61d5e2a7a	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:43:18.467488+00
105	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	3734ddf6-ba71-4568-bfa2-43a818406516	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:43:18.497244+00
106	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	2c56c6f2-d0c0-41d6-983c-3d5f18030c87	{"role": "assistant"}	2026-08-13 23:43:18.515342+00
107	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	cf4be40c-4441-4196-9c73-495acc3bb977	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:44:26.628177+00
108	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	133558d8-5583-46f0-bf99-3f4c35e235a9	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:44:26.65054+00
109	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	a982811c-6248-431b-9ffb-4cd89441cb57	{"role": "assistant"}	2026-08-13 23:44:26.653921+00
110	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	a2e1bdb1-cf2c-4989-b2ec-8fd32509278c	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:44:26.673993+00
111	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	19f79173-dabe-4b7f-ab1c-bfacfe9b7aaa	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:45:18.501987+00
112	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	5d1a5144-f533-4061-aeea-034a1e1aa3a3	{"role": "assistant"}	2026-08-13 23:45:18.510754+00
113	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	e5c39567-7c7b-4a23-990b-34368dce667f	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:45:18.527394+00
114	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	141e4841-9e50-48be-8a47-431c2cecc7b2	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:45:18.546429+00
115	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	64119923-fdc3-49af-a4bc-9a8780e46fd9	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:45:44.850795+00
116	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	7fcde993-8c05-4ac2-bf45-866b89535e6a	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:45:44.87663+00
117	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	be7c1619-be75-45c0-85bb-4923355b1a03	{"role": "assistant"}	2026-08-13 23:45:44.883657+00
118	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	c9eeca12-ebe3-425b-ac27-43534f8803a4	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:45:44.902005+00
119	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	adff408e-c894-45e7-8a57-c1ad3729975b	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:45:44.921081+00
120	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	adff408e-c894-45e7-8a57-c1ad3729975b	{}	2026-08-13 23:45:44.925511+00
121	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	40edb0a0-4a0b-49a8-a414-4a2d7e0c9562	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:46:00.295205+00
122	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	40edb0a0-4a0b-49a8-a414-4a2d7e0c9562	{}	2026-08-13 23:46:00.297853+00
123	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	991c96ef-9ed2-4cd5-9338-8e76e4f7e638	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:46:09.030387+00
124	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	991c96ef-9ed2-4cd5-9338-8e76e4f7e638	{}	2026-08-13 23:46:09.0339+00
125	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	4f7709e6-5c31-4a89-b458-d340db8cc0d5	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 2200}	2026-08-13 23:46:48.242605+00
126	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	sale_registered	opportunity	158046b0-d81e-4634-ae32-ecdd2b4aeb69	{"product_id": "11110000-0000-4000-8000-000000000001", "sold_value": 1000}	2026-08-13 23:46:48.268039+00
127	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	cf815e6a-a9fa-40ae-923c-12ec35bd6bb6	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:46:48.289457+00
128	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	member_invited	workspace_invitation	24580744-8cf8-4c8e-be3f-784573f49c88	{"role": "assistant"}	2026-08-13 23:46:48.658515+00
129	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_lost	lead	57dbbbf4-df69-46d0-b2d1-3a1675800b46	{"lost_reason_id": "22220000-0000-4000-8000-000000000001"}	2026-08-13 23:46:49.523338+00
130	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	lead_reactivated	lead	57dbbbf4-df69-46d0-b2d1-3a1675800b46	{}	2026-08-13 23:46:49.526863+00
131	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	01995e19-0de1-4ddb-b53e-0dff2cb718aa	sale_registered	opportunity	452ca507-b5a1-4c2f-ba31-4305dd1b1986	{"product_id": "c9fb77c6-8b5f-4f65-b2cd-0ac2b2a8a8ab", "sold_value": 350}	2026-08-14 13:36:15.174314+00
\.


--
-- Data for Name: calendar_connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_connections (id, workspace_id, user_id, provider, account_email, calendar_id, calendar_name, status, access_token_enc, refresh_token_enc, token_expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: calendar_sync_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_sync_events (id, workspace_id, appointment_id, direction, external_event_id, status, error, created_at) FROM stdin;
\.


--
-- Data for Name: channel_connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_connections (id, workspace_id, provider, status, display_name, external_account_id, phone_number_id, waba_id, instagram_id, access_token_enc, app_secret_enc, verify_token_enc, last_event_at, created_at, updated_at, transport, bridge_url, bridge_secret_enc, bridge_state, bridge_state_at) FROM stdin;
a2083d65-2f36-461f-968e-69b335214e17	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	connected	WhatsApp (ponte)	\N	\N	\N	\N	\N	\N	\N	2026-08-14 12:35:10.115+00	2026-08-13 18:59:22.485715+00	2026-08-14 12:36:43.808975+00	bridge	http://localhost:8787	a37hFq+nLQnaVzdBzt9ht+gwRv5yf+2vuCML9ZMiV0k2LWoeI2RYIYfHjunty2cbssz7qEqHva+H6+RGzZj5Dx7IEV02lNS/yQQDExGgMhQLSiAqqJoegnKooOM=	conectado	2026-08-14 12:36:43.737+00
\.


--
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversation_participants (id, workspace_id, conversation_id, external_id, display_name, is_self, created_at) FROM stdin;
50ada49c-22f6-41fe-8373-a38367a7cf56	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	108310502072324	Neuropsicologo Ítalo P Jardim	t	2026-08-13 22:39:57.524431+00
423478f7-480f-42a5-a996-cf9ea5310b5b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	dcd98f2c-ca4b-4d74-975d-9dc1a6dfdcbf	65404365975787	Italo Jardim	f	2026-08-13 22:42:11.626081+00
add2a319-5d80-4b68-9496-fa883bea4cb1	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	d597d5b4-47bf-45b0-8027-54a9297c1259	126813305094321	Neuropsicologo Ítalo P Jardim	t	2026-08-13 23:02:53.703622+00
207162fe-f891-4bb4-bf33-8b317ad190fb	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	50904489296108	Neuropsicologo Ítalo P Jardim	t	2026-08-13 23:14:24.249075+00
958ef67d-9170-4407-84b5-faed9eaf4e9d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	3917161185369	Assistente Virtual - Neuropsicologo Ítalo P. Jardim	f	2026-08-13 23:35:33.758223+00
6732eef5-c15d-41b2-a3e2-ab682aded2e0	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	143842934317102	Junior Costa 🚀	f	2026-08-14 01:14:33.075495+00
4ad229d1-1f3c-4d9e-9c45-3e31afe75eb9	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	eb80b529-3e6b-4176-b70e-53ac2161d80d	216836037697757	Yas	f	2026-08-14 09:32:42.857942+00
35701395-394b-4612-b9d2-e2c242b87a97	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	238267706425361	Neuropsicologo Ítalo P Jardim	t	2026-08-14 11:46:19.212437+00
fe6ff2ce-fca0-4a3e-bbb4-b41bd9bd0a2f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	0fc0514c-6402-41ad-843c-f97af8d2bacb	107309825032373	Neuropsicologo Ítalo P Jardim	t	2026-08-14 11:52:33.507893+00
29e73be1-6827-41bf-9bcd-5e60480b5a74	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	89752485273665	Fagundes - Gerente Favorita Multimarcas	f	2026-08-14 12:23:33.996462+00
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, workspace_id, lead_id, provider, external_conversation_id, last_inbound_at, last_message_at, last_message_preview, unread_count, created_at, updated_at) FROM stdin;
ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	whatsapp	143842934317102	2026-08-14 01:37:59+00	2026-08-14 01:39:55+00	Agora to fazendo todos os meus sistemas	0	2026-08-14 01:14:33.075495+00	2026-08-14 01:39:55.636333+00
7692c991-eaa4-4a47-99ab-aad6806faff3	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	whatsapp	89752485273665	2026-08-14 12:31:32+00	2026-08-14 12:31:32+00	Show	1	2026-08-14 12:23:33.996462+00	2026-08-14 12:31:32.867363+00
eb80b529-3e6b-4176-b70e-53ac2161d80d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	whatsapp	216836037697757	2026-08-14 09:32:42+00	2026-08-14 12:33:19+00	Recebido, até mais tarde 😁	0	2026-08-14 09:32:42.857942+00	2026-08-14 12:33:19.642146+00
9552efaa-ed8c-4c66-91a7-0d164c31deeb	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	whatsapp	108310502072324	2026-08-14 12:35:10+00	2026-08-14 12:35:10+00	é legal da pra fazer	1	2026-08-13 22:39:57.524431+00	2026-08-14 12:35:10.30698+00
9f94bb55-1dc9-47ba-857c-c8af362dd7d4	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	whatsapp	50904489296108	2026-08-14 00:04:46+00	2026-08-14 00:09:53+00	Qual você acha que eu gravo ?	0	2026-08-13 23:14:24.249075+00	2026-08-14 00:09:53.905446+00
352eed38-90f4-4cfb-b1f6-b9a82b09e531	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	whatsapp	3917161185369	2026-08-13 23:44:08+00	2026-08-14 00:10:03+00	Combinado	0	2026-08-13 23:35:33.758223+00	2026-08-14 00:10:03.399911+00
0fc0514c-6402-41ad-843c-f97af8d2bacb	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	whatsapp	107309825032373	\N	2026-08-14 11:53:06+00	E como estão as coisas com a Gabi?	0	2026-08-14 11:52:33.507893+00	2026-08-14 11:53:07.053292+00
d597d5b4-47bf-45b0-8027-54a9297c1259	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	whatsapp	126813305094321	\N	2026-08-13 23:03:02+00	vou te ajudar com isso na pratica	0	2026-08-13 23:02:53.703622+00	2026-08-13 23:03:02.579191+00
dcd98f2c-ca4b-4d74-975d-9dc1a6dfdcbf	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	whatsapp	65404365975787	2026-08-13 22:42:11+00	2026-08-13 23:07:16.769185+00	ola como posso te ajudar?	0	2026-08-13 22:42:11.626081+00	2026-08-13 23:07:16.769185+00
603f6069-e844-4279-bc9c-62573549613a	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	whatsapp	238267706425361	2026-08-14 11:54:02+00	2026-08-14 12:26:20+00	Mais uma vez peço desculpas por esse imprevisto	0	2026-08-14 11:46:19.212437+00	2026-08-14 12:26:20.503461+00
\.


--
-- Data for Name: external_identities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.external_identities (id, workspace_id, lead_id, provider, external_id, display_name, created_at) FROM stdin;
c23ae02b-1870-4c51-8bbf-98c8bcb5e60f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	whatsapp	108310502072324	Neuropsicologo Ítalo P Jardim	2026-08-13 22:39:57.524431+00
6a7fbdbb-7635-4122-98a1-94e5614288f3	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	whatsapp	65404365975787	Italo Jardim	2026-08-13 22:42:11.626081+00
9bf46c37-5392-45f9-85b9-33aa9d8c1407	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	whatsapp	126813305094321	Neuropsicologo Ítalo P Jardim	2026-08-13 23:02:53.703622+00
b5f441de-24a1-4292-a129-753e049b7fa1	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	whatsapp	50904489296108	Neuropsicologo Ítalo P Jardim	2026-08-13 23:14:24.249075+00
3c8e3ae2-89e2-4501-8bb8-d1f2adc0d039	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	whatsapp	3917161185369	Assistente Virtual - Neuropsicologo Ítalo P. Jardim	2026-08-13 23:35:33.758223+00
34e29b08-22be-4ca2-be8f-193369dddcd7	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	whatsapp	143842934317102	Junior Costa 🚀	2026-08-14 01:14:33.075495+00
c22b2dc3-0a63-4ea6-8fb2-6e38c71ea49b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	whatsapp	216836037697757	Yas	2026-08-14 09:32:42.857942+00
76161517-869c-41c9-8c1e-9c4733de163a	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	whatsapp	238267706425361	Neuropsicologo Ítalo P Jardim	2026-08-14 11:46:19.212437+00
ce4e189f-b6bb-4531-b0c4-2574d44bc761	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	whatsapp	107309825032373	Neuropsicologo Ítalo P Jardim	2026-08-14 11:52:33.507893+00
96814f66-5170-41b1-b85f-aea2ef168251	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	whatsapp	89752485273665	Fagundes - Gerente Favorita Multimarcas	2026-08-14 12:23:33.996462+00
\.


--
-- Data for Name: form_endpoints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_endpoints (id, workspace_id, slug, name, headline, description, pipeline_id, product_id, owner_id, success_message, is_active, created_at, updated_at) FROM stdin;
55550000-0000-4000-8000-000000000001	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	contato	Formulário de contato	Vamos conversar?	Preencha seus dados e retornamos pelo canal que você preferir.	cccccccc-cccc-4ccc-8ccc-cccccccccccc	11110000-0000-4000-8000-000000000001	11111111-1111-4111-8111-111111111111	Recebemos seu contato!	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
\.


--
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_submissions (id, workspace_id, form_endpoint_id, lead_id, payload, dedupe_hash, ip_hash, created_at) FROM stdin;
\.


--
-- Data for Name: lead_product_interests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lead_product_interests (id, workspace_id, lead_id, product_id, created_at) FROM stdin;
\.


--
-- Data for Name: lead_stage_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lead_stage_history (id, workspace_id, lead_id, from_stage_id, to_stage_id, from_stage_type, to_stage_type, actor_id, created_at) FROM stdin;
355	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-13 22:39:57.524431+00
356	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-13 22:42:11.626081+00
357	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-13 23:02:53.703622+00
358	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2176550a-a26f-4121-b019-840944a98005	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-13 23:14:24.249075+00
359	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-13 23:35:33.758223+00
681	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000002	new	qualification	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:52.109094+00
682	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	c0000000-0000-4000-8000-000000000002	c0000000-0000-4000-8000-000000000001	qualification	new	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:52.706649+00
683	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000002	new	qualification	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:53.570623+00
684	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	c0000000-0000-4000-8000-000000000002	c0000000-0000-4000-8000-000000000001	qualification	new	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:10:54.366894+00
685	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000005	new	follow_up_post_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:13:50.954879+00
686	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	efd8ab2f-e083-4c4d-92da-14d951a07aad	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000003	new	follow_up_pre_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:35.707511+00
687	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000002	new	qualification	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:37.486314+00
688	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000004	new	alignment_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:41.109711+00
689	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	c0000000-0000-4000-8000-000000000004	c0000000-0000-4000-8000-000000000005	alignment_session	follow_up_post_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:46.356052+00
690	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	c0000000-0000-4000-8000-000000000005	c0000000-0000-4000-8000-000000000006	follow_up_post_session	won	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:49.347026+00
691	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	c0000000-0000-4000-8000-000000000006	c0000000-0000-4000-8000-000000000004	won	alignment_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:50.45712+00
692	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6d5b960b-078f-434f-b3da-51aa58bba1d9	c0000000-0000-4000-8000-000000000005	c0000000-0000-4000-8000-000000000007	follow_up_post_session	lost	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 00:43:55.083816+00
693	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7159afac-eabe-4301-b883-9c394ca86886	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-14 01:14:33.075495+00
694	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-14 09:32:42.857942+00
695	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ddbddaf6-b0c6-41f7-83cf-24fe50343e96	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-14 11:46:19.212437+00
696	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	93d886a6-bec0-40b4-88ef-c4277693786c	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-14 11:52:33.507893+00
697	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	6794839e-ddd7-4689-a895-2be3ae678b6f	\N	c0000000-0000-4000-8000-000000000001	\N	new	\N	2026-08-14 12:23:33.996462+00
698	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	c0000000-0000-4000-8000-000000000001	c0000000-0000-4000-8000-000000000004	new	alignment_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:33:59.80034+00
699	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	c0000000-0000-4000-8000-000000000004	c0000000-0000-4000-8000-000000000006	alignment_session	won	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:36:15.174314+00
700	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	c0000000-0000-4000-8000-000000000006	c0000000-0000-4000-8000-000000000004	won	alignment_session	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:36:23.671203+00
\.


--
-- Data for Name: lead_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lead_tags (id, workspace_id, lead_id, tag_id, created_at) FROM stdin;
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leads (id, workspace_id, pipeline_id, stage_id, "position", name, social_name, phone, phone_normalized, email, email_normalized, city, state, contact_preference, channel, source_detail, utm_source, utm_medium, utm_campaign, utm_content, utm_term, external_campaign, external_ad, external_form, owner_id, potential_value, next_action, first_contact_at, engaged_at, lost_reason_id, lost_note, lost_at, reactivated_count, notes_summary, created_by, created_at, updated_at, deleted_at) FROM stdin;
ddbddaf6-b0c6-41f7-83cf-24fe50343e96	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000001	0	Neuropsicologo Ítalo P Jardim	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeiro contato feito por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-14 11:46:18+00	2026-08-14 11:49:45+00	\N	\N	\N	0	\N	\N	2026-08-14 11:46:19.212437+00	2026-08-14 12:26:20.503461+00	\N
6794839e-ddd7-4689-a895-2be3ae678b6f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000001	0	Fagundes - Gerente Favorita Multimarcas	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeira mensagem recebida por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-14 12:23:33+00	2026-08-14 12:23:33+00	\N	\N	\N	0	\N	\N	2026-08-14 12:23:33.996462+00	2026-08-14 12:31:32.867363+00	\N
7159afac-eabe-4301-b883-9c394ca86886	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000001	0	Junior Costa 🚀	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeira mensagem recebida por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-14 01:14:32+00	2026-08-14 01:14:32+00	\N	\N	\N	0	\N	\N	2026-08-14 01:14:33.075495+00	2026-08-14 01:39:55.636333+00	\N
9ee019a4-66eb-4899-8aca-6d372dd22316	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000004	1000	Neuropsicologo Ítalo P Jardim	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeiro contato feito por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-13 22:39:57+00	2026-08-13 23:45:09+00	\N	\N	\N	0	\N	\N	2026-08-13 22:39:57.524431+00	2026-08-14 12:35:10.30698+00	\N
93d886a6-bec0-40b4-88ef-c4277693786c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000001	0	Neuropsicologo Ítalo P Jardim	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeiro contato feito por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-14 11:52:33+00	\N	\N	\N	\N	0	\N	\N	2026-08-14 11:52:33.507893+00	2026-08-14 11:53:07.053292+00	\N
65b4f900-ac2d-4d7b-a885-d64faaaf57f5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000004	0	Yas	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeira mensagem recebida por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-14 09:32:42+00	2026-08-14 09:32:42+00	\N	\N	\N	0	\N	\N	2026-08-14 09:32:42.857942+00	2026-08-14 13:36:23.671203+00	\N
2176550a-a26f-4121-b019-840944a98005	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000001	0	Sara Social Midia	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeiro contato feito por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-13 23:14:24+00	2026-08-14 00:03:10+00	\N	\N	\N	0	\N	\N	2026-08-13 23:14:24.249075+00	2026-08-14 00:13:32.664438+00	\N
efd8ab2f-e083-4c4d-92da-14d951a07aad	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000003	1000	Italo Jardim	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeira mensagem recebida por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-13 22:42:11+00	2026-08-13 22:42:11+00	\N	\N	\N	0	\N	\N	2026-08-13 22:42:11.626081+00	2026-08-14 00:43:35.707511+00	\N
2dc029f8-94d9-430f-9ac9-f72c64ebcdf5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000002	1000	Assistente Virtual - Neuropsicologo Ítalo P. Jardim	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeira mensagem recebida por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-13 23:35:33+00	2026-08-13 23:35:33+00	\N	\N	\N	0	\N	\N	2026-08-13 23:35:33.758223+00	2026-08-14 00:43:37.486314+00	\N
6d5b960b-078f-434f-b3da-51aa58bba1d9	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	c0000000-0000-4000-8000-000000000007	1000	Bruno	\N	\N	\N	\N	\N	\N	\N	\N	whatsapp	Primeiro contato feito por whatsapp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-13 23:02:53+00	\N	\N	\N	\N	0	\N	\N	2026-08-13 23:02:53.703622+00	2026-08-14 00:43:55.083816+00	\N
\.


--
-- Data for Name: lost_reasons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lost_reasons (id, workspace_id, label, "position", is_active, created_at, updated_at) FROM stdin;
22220000-0000-4000-8000-000000000001	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Parou de responder	1	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
22220000-0000-4000-8000-000000000002	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Sem condições financeiras no momento	2	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
22220000-0000-4000-8000-000000000003	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Escolheu outro profissional	3	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
22220000-0000-4000-8000-000000000004	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Não era o serviço procurado	4	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
22220000-0000-4000-8000-000000000011	bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	Parou de responder	1	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
\.


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_attachments (id, workspace_id, message_id, media_type, storage_path, external_url, byte_size, created_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, workspace_id, conversation_id, provider, external_message_id, direction, status, sender_external_id, body, media_type, media_url, sent_by, error, sent_at, created_at) FROM stdin;
f86dce14-cb24-4737-9173-16b94d01fa6e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2A6FD13A2108F12D969B	inbound	delivered	3917161185369	Entendi	\N	\N	\N	\N	2026-08-13 23:43:53+00	2026-08-13 23:43:53.865156+00
3d822397-2152-4afb-b7f2-5892db809fbc	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2A2AAC383CAD743F3C9A	inbound	delivered	3917161185369	Vai me avisando	\N	\N	\N	\N	2026-08-13 23:44:02+00	2026-08-13 23:44:02.242023+00
53abc75a-3eea-4073-94c2-669ab203758d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2A0F52F2637A4C7D0073	inbound	delivered	3917161185369	Me avisa de segunda tbm p eu me organizar	\N	\N	\N	\N	2026-08-13 23:44:08+00	2026-08-13 23:44:08.914334+00
bd0205d9-2b83-440f-ada8-a92e0ed0e37d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	AC3B0422A6F085A728DD0142F18CE58C	inbound	delivered	108310502072324	\N	audio	\N	\N	\N	2026-08-13 23:45:09+00	2026-08-13 23:45:10.165637+00
e5e8474d-0fd8-4c1c-aa9e-9b5938790718	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2A5ABC8B3B6B155F3FE5	outbound	sent	108310502072324	Fica em paz mestre	\N	\N	\N	\N	2026-08-13 23:45:28+00	2026-08-13 23:45:28.324993+00
c025af19-a423-4eed-8838-846541bb3c0d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2AF7D075811E67AD812C	outbound	sent	108310502072324	Vai lá	\N	\N	\N	\N	2026-08-13 23:45:31+00	2026-08-13 23:45:31.249511+00
06b27e63-49d2-4659-90fe-abdfb307858a	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2ADA6F91B9E12EA16E9D	inbound	delivered	50904489296108	Oiee boa noite Italo	\N	\N	\N	\N	2026-08-14 00:03:10+00	2026-08-14 00:03:10.958532+00
53223771-7911-4743-9406-bb4916b8e7b6	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A9CC61EA6C82CBA29A8	inbound	delivered	50904489296108	Isso, eu ia te perguntar também! Você falou q tá bem corrido essa semana… eu vou ficar off final de semana e já tenho 3 vídeos quase finalizados no gatilhos, vou terminar entre hoje e amanhã, daí ficamos tranquilos ate semana que vem, se você conseguir gravar final de semana fica ótimo para entrar no cronograma da semana que vem	\N	\N	\N	\N	2026-08-14 00:04:46+00	2026-08-14 00:04:47.164868+00
1d6d0f97-8dc7-4bb6-a927-3e67f3ba3025	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A37C7CA1F6C865D4BF5	outbound	sent	50904489296108	Beleza	\N	\N	\N	\N	2026-08-14 00:09:43+00	2026-08-14 00:09:43.587162+00
214c5c39-daab-4930-b572-98f8e9e92222	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A20DD729DB45999B61E	outbound	sent	50904489296108	Ai você me manda os roteiros ?	\N	\N	\N	\N	2026-08-14 00:09:49+00	2026-08-14 00:09:49.294749+00
6f0ed952-e4be-40cc-a086-fa630aff7610	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A7BCC7C1B03C75C2748	outbound	sent	50904489296108	Qual você acha que eu gravo ?	\N	\N	\N	\N	2026-08-14 00:09:53+00	2026-08-14 00:09:53.905446+00
f3b5b0c4-d65e-4454-b214-eb96e4d15001	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB09407BE6B4407EEC3A3	outbound	sent	108310502072324	fala meu amigo to em casa ja	\N	\N	\N	\N	2026-08-13 22:39:57+00	2026-08-13 22:39:57.524431+00
383ed9e2-8d84-4a5b-91d6-538b5402548f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0C950A7ACF966DE177F	outbound	sent	108310502072324	quando der é so me chamar	\N	\N	\N	\N	2026-08-13 22:40:08+00	2026-08-13 22:40:08.631132+00
4636dfe6-08dd-4cb3-a493-56d06742d9b5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	dcd98f2c-ca4b-4d74-975d-9dc1a6dfdcbf	whatsapp	3A8E2CC6FF01265D8931	inbound	delivered	65404365975787	Ola	\N	\N	\N	\N	2026-08-13 22:42:11+00	2026-08-13 22:42:11.626081+00
e1143210-3553-4f6b-a0ea-d5b0a4fbf592	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2ADC3FDA69A1E5094A00	outbound	sent	3917161185369	Combinado	\N	\N	\N	\N	2026-08-14 00:10:03+00	2026-08-14 00:10:03.399911+00
4223c69f-0aef-4a7d-ae19-7bfab1751706	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB06FB137BE44D066A3DF	inbound	delivered	108310502072324	opa	\N	\N	\N	\N	2026-08-14 00:17:35+00	2026-08-14 00:17:35.361917+00
be6520d8-b0a9-42a6-8421-66015285a195	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB04B19580BB4B7C08544	outbound	sent	\N	ORDO: teste do caminho completo pela fila	\N	\N	11111111-1111-4111-8111-111111111111	\N	2026-08-13 22:57:13.64425+00	2026-08-13 22:57:13.64425+00
0def1125-1764-4402-aeea-6cc9fd132e4c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0069EBCF84AF8FC3D3F	inbound	delivered	108310502072324	agora to pronto	\N	\N	\N	\N	2026-08-14 00:17:40+00	2026-08-14 00:17:40.787441+00
d683f3b4-ccab-4e43-badf-2a533d1f9a48	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0038065DE8DE08647E7	outbound	sent	\N	ORDO: teste pela interface	\N	\N	11111111-1111-4111-8111-111111111111	\N	2026-08-13 22:59:27.378716+00	2026-08-13 22:59:27.378716+00
64b921f8-bd7b-473c-9ac8-8f419b4fe4cd	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	d597d5b4-47bf-45b0-8027-54a9297c1259	whatsapp	3EB0098FE6568171E3BB67	outbound	sent	126813305094321	mas a supervisão faz isso tambem	\N	\N	\N	\N	2026-08-13 23:02:53+00	2026-08-13 23:02:53.703622+00
7728076c-c798-42d3-bf6f-a6d958ae2649	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	d597d5b4-47bf-45b0-8027-54a9297c1259	whatsapp	3EB0B6E9DAB7B63D9D485E	outbound	sent	126813305094321	vou te ajudar com isso na pratica	\N	\N	\N	\N	2026-08-13 23:03:02+00	2026-08-13 23:03:02.579191+00
f25d890c-e51e-4ac7-8bbf-ffba9e2d842b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB02EE8E6251DDA5CB283	outbound	sent	108310502072324	opa	\N	\N	\N	\N	2026-08-14 00:17:43+00	2026-08-14 00:17:43.830259+00
dc3d975e-b895-413f-97f5-c4a92bb13d57	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	dcd98f2c-ca4b-4d74-975d-9dc1a6dfdcbf	whatsapp	3EB0643190A0830C370C6A	outbound	sent	\N	ola como posso te ajudar?	\N	\N	01995e19-0de1-4ddb-b53e-0dff2cb718aa	\N	2026-08-13 23:07:16.769185+00	2026-08-13 23:07:16.769185+00
2b1b5a59-6860-46b9-85d1-740273f873c5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A638AEE823B556C3F83	outbound	sent	50904489296108	Boa noite Sara tudo bem?	\N	\N	\N	\N	2026-08-13 23:14:24+00	2026-08-13 23:14:24.249075+00
82e6f645-d382-4057-ad65-ad24aeaacb2d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A18AE36C9063C85362D	outbound	sent	50904489296108	Como está o cronograma de postagens?	\N	\N	\N	\N	2026-08-13 23:14:32+00	2026-08-13 23:14:32.379752+00
e6a4a1c1-1884-4731-bc5a-3f51f541340d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2A211BC4C8963D7F0E86	outbound	sent	50904489296108	Queria ver contigo com relação aos 4 vídeos que eu vou gravar por aqui também	\N	\N	\N	\N	2026-08-13 23:14:49+00	2026-08-13 23:14:58.769568+00
5341d8b1-e3d1-4bfc-8a1b-f1bacb35f8b8	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9f94bb55-1dc9-47ba-857c-c8af362dd7d4	whatsapp	2AF19747569F5449FE7C	outbound	sent	50904489296108	Queria  gravar nesse sábado e na segunda pra já te enviar	\N	\N	\N	\N	2026-08-13 23:15:04+00	2026-08-13 23:15:04.893112+00
d3201154-f3fe-46d9-9588-841182b7d896	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0B8C695F87AAD236C86	outbound	sent	108310502072324	vou te mandar o link	\N	\N	\N	\N	2026-08-14 00:18:03+00	2026-08-14 00:18:03.533132+00
e6269c18-c34e-4519-9d31-945321f3f8ab	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB09727E97C456CCAEAD4	outbound	sent	\N	ORDO: mensagem agendada (teste automatico)	\N	\N	11111111-1111-4111-8111-111111111111	\N	2026-08-13 23:30:26.352578+00	2026-08-13 23:30:26.352578+00
cfb75db8-beb9-4120-8769-63b0847bcc53	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB05B414528755168C38F	inbound	delivered	108310502072324	okk	\N	\N	\N	\N	2026-08-14 00:18:26+00	2026-08-14 00:18:26.658039+00
f30e0abc-2a4f-45e9-93d5-b7ae425b388d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0776CECA8A9DE3DF89B	outbound	sent	\N	teste	\N	\N	01995e19-0de1-4ddb-b53e-0dff2cb718aa	\N	2026-08-13 23:30:55.050008+00	2026-08-13 23:30:55.050008+00
f8ec9584-4f36-4392-9924-435ec4e075e0	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2A0C78666B2A7B096309	inbound	delivered	3917161185369	Isso mesmo	\N	\N	\N	\N	2026-08-13 23:35:33+00	2026-08-13 23:35:33.758223+00
e83ea32e-2642-41df-a5d6-89a342871a30	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2AE801CAB07CF535D543	inbound	delivered	3917161185369	Eu nem sabia que existia isso cara	\N	\N	\N	\N	2026-08-13 23:35:38+00	2026-08-13 23:35:38.615238+00
586c5765-ad98-48ac-81ba-67afd9a69d0b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2A8AB2E15F39CCD9F5CB	inbound	delivered	3917161185369	\N	audio	\N	\N	\N	2026-08-13 23:38:33+00	2026-08-13 23:38:33.278993+00
9cabc63e-25f7-4021-a57c-a7ee74d05b62	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB02CB1471D030FAEB09D	outbound	sent	108310502072324	https://meet.google.com/rrn-vvgw-byy	\N	\N	\N	\N	2026-08-14 00:18:28+00	2026-08-14 00:18:28.961216+00
c2951938-917c-490e-a80a-53e929f1b95e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB053147FB6B225174EF4	outbound	sent	\N	ola	\N	\N	01995e19-0de1-4ddb-b53e-0dff2cb718aa	\N	2026-08-14 00:29:31.099839+00	2026-08-14 00:29:31.099839+00
71458913-2590-4b13-a670-db2fd7fe6943	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2A1F49C6DB5602D6A34D	inbound	delivered	3917161185369	\N	audio	\N	\N	\N	2026-08-13 23:39:11+00	2026-08-13 23:39:11.440332+00
b9628487-0096-49d6-86b8-37d61fe05f24	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0E1895DAADE77E9358D	inbound	delivered	108310502072324	https://trello.com/invite/b/687f9c9428c425dd422971b5/ATTI9b069b5c4c9d08db89ee119589be83a3F184731C/saas-para-psicologos	\N	\N	\N	\N	2026-08-14 00:54:39+00	2026-08-14 00:54:39.50738+00
a87f6d82-03a3-4fce-8163-e314a7e67b0a	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0A5842E384B1FC29BDB	inbound	delivered	108310502072324	https://www.youtube.com/watch?v=BUGZZaChiYw&pp=ygUSY29tbyB1c2FyIG8gZ2l0aHVi	\N	\N	\N	\N	2026-08-14 01:03:21+00	2026-08-14 01:03:23.109806+00
4d48e2d6-b5ec-4f6c-ba91-e6701088d704	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3AFD02D8BFC5A59CB351	inbound	delivered	143842934317102	Tô parando agora kk	\N	\N	\N	\N	2026-08-14 01:14:32+00	2026-08-14 01:14:33.075495+00
833c0f0b-c9b5-4cc7-b4e7-cc88e0ce9b79	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0B97B76C66D22751B77	inbound	delivered	108310502072324	https://saaspsicologos.vercel.app/	\N	\N	\N	\N	2026-08-14 01:27:02+00	2026-08-14 01:27:02.542202+00
1736c30a-50de-4a7b-b3c9-f2493d68056f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	352eed38-90f4-4cfb-b1f6-b9a82b09e531	whatsapp	2AE90273384A7706EACD	outbound	sent	3917161185369	\N	audio	\N	\N	\N	2026-08-13 23:40:08+00	2026-08-13 23:40:08.57603+00
992dcf1f-5eac-46bc-935b-647eb6ebf8d9	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB02870C95604DF254A69	inbound	delivered	108310502072324	num cartão: 0000 0000 0000 0004\nvencimento: 12/30\ncvc: 123	\N	\N	\N	\N	2026-08-14 01:27:24+00	2026-08-14 01:27:24.33205+00
0858ccb7-6ee0-44d9-91ed-ad762e748c4b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2ADBA05FCD56357B694C	outbound	sent	143842934317102	Eu tô brincando de programador aqui	image	\N	\N	\N	2026-08-14 01:32:31+00	2026-08-14 01:32:31.20378+00
18d0abc6-940b-46b4-8041-84c9294c65e3	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A0E6C1C3F44E338361F	outbound	sent	143842934317102	Montei hoje um CRM fudido	\N	\N	\N	\N	2026-08-14 01:32:40+00	2026-08-14 01:32:39.859397+00
369a82f2-54fd-4902-a821-21519e86f4e3	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2AB542BEF22BBF2278DC	outbound	sent	143842934317102	E um sistema de gestão de clínica	\N	\N	\N	\N	2026-08-14 01:32:47+00	2026-08-14 01:32:48.051195+00
f36bfbf4-5c35-41dc-ae83-f4ff93afabc8	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3A8160EE5D50C3E795D3	inbound	delivered	143842934317102	Caramba	\N	\N	\N	\N	2026-08-14 01:33:50+00	2026-08-14 01:33:51.014687+00
737e8a5b-87af-4ad4-b3c0-fe49d8c4851f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3A8EFB7309748DD4A996	inbound	delivered	143842934317102	Claude?	\N	\N	\N	\N	2026-08-14 01:33:52+00	2026-08-14 01:33:52.792726+00
b0ccef59-383c-40bd-af74-6f055c9e7163	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A5E046617ACC02A74EE	outbound	sent	143842934317102	Sim	\N	\N	\N	\N	2026-08-14 01:36:33+00	2026-08-14 01:36:33.071927+00
6d860551-0dbc-4415-97dd-0e207ccaabbf	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A3187718922231B016B	outbound	sent	143842934317102	E usando o antigravity	\N	\N	\N	\N	2026-08-14 01:36:41+00	2026-08-14 01:36:41.846386+00
3f0722f8-7945-4b3e-928a-1309887bdb27	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2AB049903ACDF524DEE9	outbound	sent	143842934317102	\N	video	\N	\N	\N	2026-08-14 01:37:12+00	2026-08-14 01:37:12.985014+00
e19b6d2a-1ae7-4133-8c5b-497f8d2791f6	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3AD5736B54F428140537	inbound	delivered	143842934317102	Top demais mano	\N	\N	\N	\N	2026-08-14 01:37:34+00	2026-08-14 01:37:35.022241+00
80818e46-a471-4846-ae51-0ac244d2f988	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3EB04CB793958A5696C27F	outbound	sent	\N	ola	\N	\N	01995e19-0de1-4ddb-b53e-0dff2cb718aa	\N	2026-08-14 01:37:06.859576+00	2026-08-14 01:37:06.859576+00
2515084d-31b2-4348-bda4-4a7a2e2122f7	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3A3871AD32E79D0D84A1	inbound	delivered	143842934317102	Caraca	\N	\N	\N	\N	2026-08-14 01:37:56+00	2026-08-14 01:37:56.468727+00
fe181fa2-9229-4d77-893c-6a700eb703a7	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	3A51C342D3079F20BB2D	inbound	delivered	143842934317102	Sensacional	\N	\N	\N	\N	2026-08-14 01:37:59+00	2026-08-14 01:37:59.991359+00
229f6b4c-516c-4254-95a1-64500197f2bf	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A3A8F045662188098B9	outbound	sent	143842934317102	Não vou mais ficar pagando 150 conto em um CRM	\N	\N	\N	\N	2026-08-14 01:39:16+00	2026-08-14 01:39:16.6564+00
148aa8b6-5f39-4f12-a509-ad437c7981b5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A8EE7D2C0ADEDF378F1	outbound	sent	143842934317102	Ta doido	\N	\N	\N	\N	2026-08-14 01:39:21+00	2026-08-14 01:39:21.469103+00
a22e6438-0bcf-4db9-8d5b-1b9a4c750e5e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A074E19F61D6AB0809F	outbound	sent	143842934317102	Chega de sistema	\N	\N	\N	\N	2026-08-14 01:39:25+00	2026-08-14 01:39:25.539532+00
fa8c1015-752e-4b06-be14-f21a1c84861f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A4A1A73165A66A03D02	outbound	sent	143842934317102	50 assinaturas	\N	\N	\N	\N	2026-08-14 01:39:33+00	2026-08-14 01:39:33.073479+00
494081b1-b2b3-46ec-8a86-85262ffb8252	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2AEE578D9D1AA59B4B8A	outbound	sent	143842934317102	E assinatura de gestão da Clincia, CRM, ia	\N	\N	\N	\N	2026-08-14 01:39:44+00	2026-08-14 01:39:44.970227+00
bef17b07-ca3e-4b7b-9d89-f7ee78b4217e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	ea206e4b-ad9b-43bd-b0a2-cfd81d10a201	whatsapp	2A028BF15237B5AB8602	outbound	sent	143842934317102	Agora to fazendo todos os meus sistemas	\N	\N	\N	\N	2026-08-14 01:39:55+00	2026-08-14 01:39:55.636333+00
7dbd1e78-4f4a-4c8f-a1da-e5ec299d3364	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0989AE44A781CE9490E	inbound	delivered	108310502072324	aqui um p´review kkkkk	image	\N	\N	\N	2026-08-14 02:30:27+00	2026-08-14 02:30:27.260468+00
b7f7620a-88bf-4f8a-9c93-7efb3c2213cc	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB01B15A45F8ABF15B562	inbound	delivered	108310502072324	\N	image	\N	\N	\N	2026-08-14 02:30:27+00	2026-08-14 02:30:27.317363+00
aa12d8a1-77bc-48ef-82dc-d39064b219de	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB04D13D2F94DBEBF121F	inbound	delivered	108310502072324	\N	image	\N	\N	\N	2026-08-14 02:30:27+00	2026-08-14 02:30:27.325839+00
7daa1c3b-0b3c-4c7a-aa80-cf06f7b0c26b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0DBB788B3A0B99CAD5A	inbound	delivered	108310502072324	to trabalhando n odesign ainda	\N	\N	\N	\N	2026-08-14 02:30:30+00	2026-08-14 02:30:31.019462+00
21ce3a8e-3fd0-4c69-aa25-0e1c8f7ccb4e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0E3A99D71A7C739C131	inbound	delivered	108310502072324	esse é a parte do prontuario que to fazendo	\N	\N	\N	\N	2026-08-14 02:30:39+00	2026-08-14 02:30:39.667391+00
58eb8117-2e61-4ad8-8050-5c9b13e7bab9	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2A3D7D350E2519E0D7D4	outbound	sent	108310502072324	Top	\N	\N	\N	\N	2026-08-14 02:36:43+00	2026-08-14 02:36:43.817344+00
b5980f80-642f-4d18-9fba-4f1fddb61606	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2A7080E4EAAB9098BD9E	outbound	sent	108310502072324	Gostei da sessão de objetivos ali	\N	\N	\N	\N	2026-08-14 02:36:51+00	2026-08-14 02:36:51.897018+00
360b6d1a-f06d-42a2-a776-8c1ff884b88c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2AE681AFD474FC972F8F	outbound	sent	108310502072324	O pessoal do CRM lá	\N	\N	\N	\N	2026-08-14 02:36:57+00	2026-08-14 02:36:57.484865+00
3f2831b8-85ca-4e81-8fe4-fc94707dd66f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2AC939521BB9C520F332	outbound	sent	108310502072324	Pediu seu e-mail para te dar acesso ao GitHub com o código do CRM deles	\N	\N	\N	\N	2026-08-14 02:37:10+00	2026-08-14 02:37:10.218064+00
e9678d15-85ff-444c-8617-9e1826a70a7f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0B4966B5CC104B026EC	inbound	delivered	108310502072324	ahh beleza	\N	\N	\N	\N	2026-08-14 02:37:19+00	2026-08-14 02:37:19.93839+00
88c54050-1259-407a-a371-0574ff338c1c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB04A9378AC62DB23F473	inbound	delivered	108310502072324	vou pegar o de dev aqui	\N	\N	\N	\N	2026-08-14 02:37:23+00	2026-08-14 02:37:23.561861+00
3d0f678e-7099-4b96-929e-72c375cd2808	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB07DEB4417ACCD761CC4	inbound	delivered	108310502072324	to tentando focar as coisas mais nesse email aqui que é novo kkkk \n\ndesenvolvedormaicon@gmail.com	\N	\N	\N	\N	2026-08-14 02:39:02+00	2026-08-14 02:39:02.421443+00
1e78e158-5eb8-4a45-b62f-8ddd85f87b6e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	eb80b529-3e6b-4176-b70e-53ac2161d80d	whatsapp	3A66B45DF4F8B5CB758F	inbound	delivered	216836037697757	\N	image	\N	\N	\N	2026-08-14 09:32:42+00	2026-08-14 09:32:42.857942+00
201df1ee-84e1-44b3-a864-d70259c7396e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0136452458DC5719256	inbound	delivered	108310502072324	Diaaa	\N	\N	\N	\N	2026-08-14 11:07:31+00	2026-08-14 11:07:31.147115+00
7c45c789-6aba-448e-9214-d2ebac5e64bf	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB087C11C08F1B6F6B929	inbound	delivered	108310502072324	dei uma modificada	\N	\N	\N	\N	2026-08-14 11:07:34+00	2026-08-14 11:07:34.400607+00
ccf6d4b9-77e9-49cd-ae1f-ef2b8733651b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0EFF7BE4D20B976597C	inbound	delivered	108310502072324	\N	image	\N	\N	\N	2026-08-14 11:07:36+00	2026-08-14 11:07:36.182524+00
4384d668-0634-4a49-92a4-aaaaf9c60967	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB02180021027744FFBA7	inbound	delivered	108310502072324	tava muito poluido kkk	\N	\N	\N	\N	2026-08-14 11:07:39+00	2026-08-14 11:07:39.529782+00
c34f522a-20a2-4fe4-99be-c02ea70815bc	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2AD098DC8F9D924F144D	outbound	sent	238267706425361	Bom dia Bianca tudo bem?😊	\N	\N	\N	\N	2026-08-14 11:46:18+00	2026-08-14 11:46:19.212437+00
8619b25b-c474-43f5-b651-34e83ea9b4bc	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2A23308B04991DD953B0	outbound	sent	238267706425361	Bianca deu um imprevisto aqui aqui, estou sem internet	\N	\N	\N	\N	2026-08-14 11:46:38+00	2026-08-14 11:46:38.970605+00
c7c09bcb-416d-4ec7-b379-270b74efcd3c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2A98C486FD1E4F11901D	outbound	sent	238267706425361	Falta apenas um teste para realizarmos vou te enviar o link da mesma forma que fizemos segunda tudo bem?	\N	\N	\N	\N	2026-08-14 11:47:12+00	2026-08-14 11:47:12.406467+00
66b7a355-624e-4d1d-be24-cd64c7acaa6d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	3ACDAA9554517AAC8E48	inbound	delivered	238267706425361	Bom dia doutor tudo bem?	\N	\N	\N	\N	2026-08-14 11:49:45+00	2026-08-14 11:49:45.581793+00
b6c3efdc-0dbf-46bc-8701-2a82a8b13ea9	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	3A04D210C17596EA0F3F	inbound	delivered	238267706425361	Beleza :)	\N	\N	\N	\N	2026-08-14 11:49:48+00	2026-08-14 11:49:48.444792+00
57733668-19ae-405e-a438-8e30142069dd	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	0fc0514c-6402-41ad-843c-f97af8d2bacb	whatsapp	2A2F83B8A68CE5D41461	outbound	sent	107309825032373	Bom dia Alexandre tudo bom?	\N	\N	\N	\N	2026-08-14 11:52:33+00	2026-08-14 11:52:33.507893+00
008aca39-3898-4356-8d61-610ab8cfa228	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	0fc0514c-6402-41ad-843c-f97af8d2bacb	whatsapp	2A9B032C8076F4E6707B	outbound	sent	107309825032373	Como você está?	\N	\N	\N	\N	2026-08-14 11:52:36+00	2026-08-14 11:52:37.014153+00
ba9dcf1a-58e0-4fe9-bd1c-48a1833473be	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	0fc0514c-6402-41ad-843c-f97af8d2bacb	whatsapp	2A5A3B6F0FC89CA021C2	outbound	sent	107309825032373	Como foi seu dia pós sessão?	\N	\N	\N	\N	2026-08-14 11:52:53+00	2026-08-14 11:52:53.484476+00
96184c3f-b6c4-428e-b7db-f9b1c7a37c65	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	0fc0514c-6402-41ad-843c-f97af8d2bacb	whatsapp	2A432A5AABC56C07AFA4	outbound	sent	107309825032373	E como estão as coisas com a Gabi?	\N	\N	\N	\N	2026-08-14 11:53:06+00	2026-08-14 11:53:07.053292+00
72811c36-9ea1-484f-8295-f7ce089f01f5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2A5687B4F4BFE4878E83	outbound	sent	238267706425361	A internet simplesmente não quer funcionar aqui	\N	\N	\N	\N	2026-08-14 11:53:29+00	2026-08-14 11:53:29.854421+00
ffc69d2f-f6c4-4cfc-aa18-888bf249f1c8	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2A38A411B2D38D0683EF	outbound	sent	238267706425361	Peço desculpas 😞	\N	\N	\N	\N	2026-08-14 11:53:18+00	2026-08-14 11:53:18.309866+00
e02a8308-6540-4546-9bc0-f39a385053ae	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2A3AD5139EEA0B271D2C	outbound	sent	238267706425361	Liguei na operadora parece que é instabilidade na minha região	\N	\N	\N	\N	2026-08-14 11:53:41+00	2026-08-14 11:53:42.030651+00
cf339a1c-1484-4dda-8175-dedfd1b29991	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	3A814D8B8C56FCD9498E	inbound	delivered	238267706425361	Acontece	\N	\N	\N	\N	2026-08-14 11:53:53+00	2026-08-14 11:53:53.880935+00
fd861056-9e59-45c1-b029-f3e042c5180c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	3A33814BF00E15891B16	inbound	delivered	238267706425361	Tudo bem	\N	\N	\N	\N	2026-08-14 11:53:56+00	2026-08-14 11:53:56.281505+00
48955393-a095-4a86-8c4a-3eaa6b38146e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	3ADE9576516E62A4EB04	inbound	delivered	238267706425361	Qualquer coisa a gente remarca	\N	\N	\N	\N	2026-08-14 11:54:02+00	2026-08-14 11:54:02.59882+00
cbbb8a6a-afb2-49d4-bddc-4addf7033465	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AB222C36CCBC27559E0	inbound	delivered	89752485273665	Bom dia papito	\N	\N	\N	\N	2026-08-14 12:23:33+00	2026-08-14 12:23:33.996462+00
5022d6ea-dada-4e1b-9147-ada61b46b35b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A2CB29228CE4C89572F	inbound	delivered	89752485273665	Fala comigo	\N	\N	\N	\N	2026-08-14 12:23:47+00	2026-08-14 12:23:48.576365+00
ff0981ba-fa62-4b55-9b11-9eb2d0b3117c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A911AE14F8F09430A4C	outbound	sent	89752485273665	Hope	\N	\N	\N	\N	2026-08-14 12:25:54+00	2026-08-14 12:25:54.895603+00
cc8bd2eb-fe53-4dde-8687-7a868a0f31b4	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A4BC60C2CC4FA503F32	outbound	sent	89752485273665	Bom dia meu amigo	\N	\N	\N	\N	2026-08-14 12:25:58+00	2026-08-14 12:25:58.180836+00
a1f14d84-3720-4e28-ae0f-b26c74d30789	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A8BACAC8820CE18EC53	outbound	sent	89752485273665	Tudo bom?	\N	\N	\N	\N	2026-08-14 12:26:00+00	2026-08-14 12:26:00.635523+00
bbbb28ae-d2d8-48c0-9f2f-1ac772487859	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2AFDF3EBE6B124F5128F	outbound	sent	238267706425361	Combinado Bianca 🙏🏻	\N	\N	\N	\N	2026-08-14 12:26:12+00	2026-08-14 12:26:13.04134+00
91e16116-3bc5-44c0-962b-431f3d93eae2	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	603f6069-e844-4279-bc9c-62573549613a	whatsapp	2AE5E26C97B941D6733A	outbound	sent	238267706425361	Mais uma vez peço desculpas por esse imprevisto	\N	\N	\N	\N	2026-08-14 12:26:20+00	2026-08-14 12:26:20.503461+00
28b0f36c-0077-46d5-8e36-a95b74ddf275	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AE903BDDE12088DF7F5	inbound	delivered	89752485273665	Tudo na paz	\N	\N	\N	\N	2026-08-14 12:26:27+00	2026-08-14 12:26:27.062606+00
669d19ae-757d-49fe-86bc-6460eaa57429	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A5C7AC7ADB2ED8CCDBA	inbound	delivered	89752485273665	Como que faz pra marcarmos uma consulta e os valores?	\N	\N	\N	\N	2026-08-14 12:26:43+00	2026-08-14 12:26:43.404616+00
0bc6ff38-60cc-4b5b-9ed0-5970a0db106c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A5ABF87B245D43C7B57	outbound	sent	89752485273665	Deixa eu só entender uma coisa	\N	\N	\N	\N	2026-08-14 12:27:08+00	2026-08-14 12:27:08.285703+00
53e9e88d-c587-4751-a568-81a8cd9cc535	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AFE0E2E9E16B7486BCD	outbound	sent	89752485273665	A empresa que vai pagar a terapia ?	\N	\N	\N	\N	2026-08-14 12:27:22+00	2026-08-14 12:27:22.931311+00
ee669279-65d4-42cb-95ad-9590e3a9868c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AC0BAF7CF6E3400688C	outbound	sent	89752485273665	Só para eu saber se vou emitir nota pra cnpj kkk	\N	\N	\N	\N	2026-08-14 12:27:39+00	2026-08-14 12:27:39.487262+00
73635963-adfd-454c-980f-3720d551690f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AAF2F72A1F8BC54AB72	inbound	delivered	89752485273665	Precisa emitir nota não	\N	\N	\N	\N	2026-08-14 12:27:50+00	2026-08-14 12:27:50.946056+00
bbc380c9-0f0d-4920-81a7-b7677b0e96ab	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A4D6F31828F177C8CC0	inbound	delivered	89752485273665	Kkkkkk	\N	\N	\N	\N	2026-08-14 12:28:01+00	2026-08-14 12:28:01.159901+00
28f56ba9-10c4-4954-aa48-870aec714678	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AD334DD48549433C00E	outbound	sent	89752485273665	Ctz?  Eu ja emito normalmente por conta da contabilidade kkkkkkk	\N	\N	\N	\N	2026-08-14 12:28:26+00	2026-08-14 12:28:26.406751+00
eef3f81f-adcb-4793-99bf-46872db46ffe	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A9A54ACF0B13CC0652E	outbound	sent	89752485273665	Ai qualquer coisa eu emito no nome dele então	\N	\N	\N	\N	2026-08-14 12:28:37+00	2026-08-14 12:28:37.49761+00
405eb2ee-f442-4feb-bc8e-4d5b51462802	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A650AFC1B1439B37CB8	inbound	delivered	89752485273665	Sim	\N	\N	\N	\N	2026-08-14 12:29:16+00	2026-08-14 12:29:17.048748+00
3243ada9-6888-4563-b610-ab247d0e176d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A10EF6E89FF21145DCE	outbound	sent	89752485273665	Então mestre, primeiro a gente precisa fazer uma primeira sessão que é a sessão de alinhamento, nela vou entender um pouco do que tem acontecido, qual a demanda dele, fazer o acolhimento início e dar início a um planejamento terapêutico	\N	\N	\N	\N	2026-08-14 12:29:33+00	2026-08-14 12:29:33.691854+00
fbcbc1c5-98f0-4046-8d96-ddabc4fac229	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AD3BF6E5728BFAB5BAF	outbound	sent	89752485273665	Essa sessão é lá custa R$250,00	\N	\N	\N	\N	2026-08-14 12:29:48+00	2026-08-14 12:29:48.39914+00
60f97fcd-538a-47ec-aff3-e97d55e8e265	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A754EAAFCDB7E4224B1	outbound	sent	89752485273665	Ai nela a gente define os pacotes de terapia, de acordo com a necessidade dele	\N	\N	\N	\N	2026-08-14 12:30:11+00	2026-08-14 12:30:11.698875+00
a9d4f367-ff94-450b-b8ad-47ded6cf17c7	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A3B176771362AD615BC	outbound	sent	89752485273665	Vou te mandar um PDF que explica tudo o que e feito nessa sessão	\N	\N	\N	\N	2026-08-14 12:30:27+00	2026-08-14 12:30:27.135225+00
115164b3-fc8c-446d-b92d-8b4561ae5a7e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2AD797FD12D5D0C4B1B0	inbound	delivered	89752485273665	Show	\N	\N	\N	\N	2026-08-14 12:30:36+00	2026-08-14 12:30:36.910119+00
14aaf52a-9844-4894-9d74-14dc50746b57	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A18D1DE5EDFE774977C	outbound	sent	89752485273665	Ai manda pra ele rmabem	\N	\N	\N	\N	2026-08-14 12:30:37+00	2026-08-14 12:30:37.15744+00
adc28d8e-d6c9-4e3f-9cfb-547ff2b5f347	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A454B21779A2B0D698E	inbound	delivered	89752485273665	Tá	\N	\N	\N	\N	2026-08-14 12:30:43+00	2026-08-14 12:30:43.132204+00
055b40a6-454e-40ec-877f-bf905e315410	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A57B042A07984CD70C8	outbound	sent	89752485273665	\N	document	\N	\N	\N	2026-08-14 12:31:05+00	2026-08-14 12:31:05.06288+00
eb3f16c8-c9d2-493b-bb93-c09cb68f08c0	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2ACF3B747EB5BF0AE726	outbound	sent	89752485273665	Da uma olhada e me diz o que achou	\N	\N	\N	\N	2026-08-14 12:31:21+00	2026-08-14 12:31:21.218222+00
56c7a25b-ccc9-4e21-9d68-d3da17597e86	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2A6D245DF3B5866E11E8	outbound	sent	89752485273665	E aí a gente ia agenda essa primeira sessão	\N	\N	\N	\N	2026-08-14 12:31:29+00	2026-08-14 12:31:29.519779+00
4b96ecf9-8825-4837-bf51-fda71e0ffc3d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	7692c991-eaa4-4a47-99ab-aad6806faff3	whatsapp	2ADB836C003016415B7C	inbound	delivered	89752485273665	Show	\N	\N	\N	\N	2026-08-14 12:31:32+00	2026-08-14 12:31:32.867363+00
973a5712-c9eb-4b5f-9c5f-5f58ef3f4375	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	2AEB7450647DEA611F34	outbound	sent	108310502072324	\N	audio	\N	\N	\N	2026-08-14 12:32:53+00	2026-08-14 12:32:53.802584+00
fa55ab99-0188-45c7-b897-11c3021f2492	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	eb80b529-3e6b-4176-b70e-53ac2161d80d	whatsapp	2A10FB6E46AD69BD8746	outbound	sent	216836037697757	Boom dia 😄	\N	\N	\N	\N	2026-08-14 12:33:08+00	2026-08-14 12:33:08.403162+00
1ba05fad-c115-4180-afab-dbf9984b80f8	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	eb80b529-3e6b-4176-b70e-53ac2161d80d	whatsapp	2AA0297C447B1C59399C	outbound	sent	216836037697757	Recebido, até mais tarde 😁	\N	\N	\N	\N	2026-08-14 12:33:19+00	2026-08-14 12:33:19.642146+00
60178e0c-eb41-4e55-8e89-970938dc831c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	whatsapp	3EB0D266D3D75C70EB538C	inbound	delivered	108310502072324	é legal da pra fazer	\N	\N	\N	\N	2026-08-14 12:35:10+00	2026-08-14 12:35:10.30698+00
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, workspace_id, lead_id, author_id, body, visibility, created_at, updated_at, deleted_at) FROM stdin;
38385557-f93e-4f65-8540-5ad73677f810	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9ee019a4-66eb-4899-8aca-6d372dd22316	01995e19-0de1-4ddb-b53e-0dff2cb718aa	retomar mais tarde	team	2026-08-14 00:30:16.555621+00	2026-08-14 00:30:16.555621+00	\N
\.


--
-- Data for Name: opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.opportunities (id, workspace_id, lead_id, product_id, status, potential_value, sold_value, payment_method, closed_at, lost_reason_id, notes, owner_id, created_by, created_at, updated_at, deleted_at) FROM stdin;
452ca507-b5a1-4c2f-ba31-4305dd1b1986	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	65b4f900-ac2d-4d7b-a885-d64faaaf57f5	c9fb77c6-8b5f-4f65-b2cd-0ac2b2a8a8ab	won	350.00	350.00	pix	2026-08-14 13:36:15.174314+00	\N	\N	01995e19-0de1-4ddb-b53e-0dff2cb718aa	01995e19-0de1-4ddb-b53e-0dff2cb718aa	2026-08-14 13:35:32.575402+00	2026-08-14 13:36:15.174314+00	\N
\.


--
-- Data for Name: outbox_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outbox_messages (id, workspace_id, message_id, provider, payload, status, attempts, next_retry_at, last_error, created_at, updated_at) FROM stdin;
26	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	c2951938-917c-490e-a80a-53e929f1b95e	whatsapp	{"body": "ola", "conversation_id": "9552efaa-ed8c-4c66-91a7-0d164c31deeb", "external_conversation_id": "108310502072324"}	sent	1	2026-08-14 00:29:31.099839+00	\N	2026-08-14 00:29:31.099839+00	2026-08-14 00:29:36.186858+00
27	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	80818e46-a471-4846-ae51-0ac244d2f988	whatsapp	{"body": "ola", "conversation_id": "ea206e4b-ad9b-43bd-b0a2-cfd81d10a201", "external_conversation_id": "143842934317102"}	sent	1	2026-08-14 01:37:06.859576+00	\N	2026-08-14 01:37:06.859576+00	2026-08-14 01:37:36.274355+00
\.


--
-- Data for Name: pipeline_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pipeline_stages (id, workspace_id, pipeline_id, name, stage_type, "position", archived_at, created_at, updated_at) FROM stdin;
c0000000-0000-4000-8000-000000000001	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Novo lead	new	1000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
c0000000-0000-4000-8000-000000000002	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Qualificação	qualification	2000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
c0000000-0000-4000-8000-000000000003	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Follow-up pré-sessão	follow_up_pre_session	3000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
c0000000-0000-4000-8000-000000000004	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Sessão de alinhamento	alignment_session	4000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
c0000000-0000-4000-8000-000000000005	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Follow-up pós-sessão	follow_up_post_session	5000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
c0000000-0000-4000-8000-000000000006	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Venda realizada	won	6000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
c0000000-0000-4000-8000-000000000007	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	cccccccc-cccc-4ccc-8ccc-cccccccccccc	Perdido	lost	7000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
d0000000-0000-4000-8000-000000000001	bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	dddddddd-dddd-4ddd-8ddd-dddddddddddd	Novo lead	new	1000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
d0000000-0000-4000-8000-000000000007	bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	dddddddd-dddd-4ddd-8ddd-dddddddddddd	Perdido	lost	7000	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
\.


--
-- Data for Name: pipelines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pipelines (id, workspace_id, name, is_default, "position", archived_at, created_at, updated_at) FROM stdin;
cccccccc-cccc-4ccc-8ccc-cccccccccccc	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Esteira comercial	t	0	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
dddddddd-dddd-4ddd-8ddd-dddddddddddd	bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	Esteira comercial	t	0	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, workspace_id, name, category, description, default_price, is_active, default_pipeline_id, created_at, updated_at) FROM stdin;
11110000-0000-4000-8000-000000000002	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	[Placeholder] Supervisão individual	supervisao	Produto de demonstração — substituir pelo real.	1800.00	t	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
11110000-0000-4000-8000-000000000003	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	[Placeholder] Supervisão em grupo	supervisao	Produto de demonstração — substituir pelo real.	900.00	t	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
11110000-0000-4000-8000-000000000004	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	[Placeholder] Avaliação neuropsicológica	terapia	Produto de demonstração — substituir pelo real.	1500.00	t	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
11110000-0000-4000-8000-000000000005	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	[Placeholder] Mentoria/outros	outro	Produto de demonstração — substituir pelo real.	\N	t	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
11110000-0000-4000-8000-000000000001	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Pacote Terapeutico 12 sessões	terapia	Pacote Praxis mentis 12 sessões	7000.00	t	\N	2026-08-13 15:53:36.177243+00	2026-08-14 13:34:53.378978+00
c9fb77c6-8b5f-4f65-b2cd-0ac2b2a8a8ab	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Sessão de Alinhamento Diagnóstico	terapia	primeira sessão	350.00	t	\N	2026-08-14 13:35:21.849097+00	2026-08-14 13:35:21.849097+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, email, full_name, avatar_url, created_at, updated_at) FROM stdin;
11111111-1111-4111-8111-111111111111	admin@praxis.dev	Ítalo Jardim	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
22222222-2222-4222-8222-222222222222	assistente@praxis.dev	Assistente Praxis	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
33333333-3333-4333-8333-333333333333	admin@outra.dev	Admin Outra Empresa	\N	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
01995e19-0de1-4ddb-b53e-0dff2cb718aa	neuropsicologo@dritalojardim.com	Ítalo Paiva Jardim	\N	2026-08-13 19:42:51.948896+00	2026-08-13 19:42:51.948896+00
\.


--
-- Data for Name: scheduled_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scheduled_messages (id, workspace_id, conversation_id, lead_id, body, scheduled_for, status, sent_at, message_id, error, created_by, created_at, updated_at, max_delay_minutes) FROM stdin;
29178c48-8dfc-4126-b05b-c72ad406f1ba	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	9552efaa-ed8c-4c66-91a7-0d164c31deeb	9ee019a4-66eb-4899-8aca-6d372dd22316	ORDO: mensagem agendada (teste automatico)	2026-08-13 23:30:09.617+00	sent	2026-08-13 23:30:26.352578+00	e6269c18-c34e-4519-9d31-945321f3f8ab	\N	11111111-1111-4111-8111-111111111111	2026-08-13 23:29:09.631004+00	2026-08-13 23:30:26.352578+00	240
acfa5d4a-d3e9-4fd5-970b-3b693a0af595	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	d597d5b4-47bf-45b0-8027-54a9297c1259	\N	ORDO: teste de atraso (NAO deve sair)	2026-08-13 14:34:29.375266+00	failed	\N	\N	não enviada: o horário passou há 9h (o ORDO estava fora do ar). Reagende se ainda fizer sentido.	\N	2026-08-13 23:34:29.375266+00	2026-08-13 23:34:29.37673+00	240
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, workspace_id, name, created_at) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, workspace_id, lead_id, title, due_at, completed_at, assigned_to, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: webhook_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.webhook_events (id, workspace_id, provider, external_event_id, status, payload, error, received_at, processed_at) FROM stdin;
148	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A3D7D350E2519E0D7D4	processed	{"body": "Top", "phone": null, "sentAt": "2026-08-14T02:36:43.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A3D7D350E2519E0D7D4", "senderExternalId": "108310502072324", "externalMessageId": "2A3D7D350E2519E0D7D4", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:36:43.798059+00	2026-08-14 02:36:43.725+00
45	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A18AE36C9063C85362D	processed	{"body": "Como está o cronograma de postagens?", "phone": null, "sentAt": "2026-08-13T23:14:32.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A18AE36C9063C85362D", "senderExternalId": "50904489296108", "externalMessageId": "2A18AE36C9063C85362D", "externalConversationId": "50904489296108"}	\N	2026-08-13 23:14:32.371477+00	2026-08-13 23:14:32.375+00
152	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0B4966B5CC104B026EC	processed	{"body": "ahh beleza", "phone": null, "sentAt": "2026-08-14T02:37:19.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0B4966B5CC104B026EC", "senderExternalId": "108310502072324", "externalMessageId": "3EB0B4966B5CC104B026EC", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:37:19.928976+00	2026-08-14 02:37:19.837+00
153	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB04A9378AC62DB23F473	processed	{"body": "vou pegar o de dev aqui", "phone": null, "sentAt": "2026-08-14T02:37:23.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB04A9378AC62DB23F473", "senderExternalId": "108310502072324", "externalMessageId": "3EB04A9378AC62DB23F473", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:37:23.550706+00	2026-08-14 02:37:23.557+00
57	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A8AB2E15F39CCD9F5CB	processed	{"body": null, "phone": null, "sentAt": "2026-08-13T23:38:33.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "audio", "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2A8AB2E15F39CCD9F5CB", "senderExternalId": "3917161185369", "externalMessageId": "2A8AB2E15F39CCD9F5CB", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:38:33.270226+00	2026-08-13 23:38:33.27+00
58	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A1F49C6DB5602D6A34D	processed	{"body": null, "phone": null, "sentAt": "2026-08-13T23:39:11.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "audio", "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2A1F49C6DB5602D6A34D", "senderExternalId": "3917161185369", "externalMessageId": "2A1F49C6DB5602D6A34D", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:39:11.428622+00	2026-08-13 23:39:11.438+00
61	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A2AAC383CAD743F3C9A	processed	{"body": "Vai me avisando", "phone": null, "sentAt": "2026-08-13T23:44:02.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2A2AAC383CAD743F3C9A", "senderExternalId": "3917161185369", "externalMessageId": "2A2AAC383CAD743F3C9A", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:44:02.23413+00	2026-08-13 23:44:02.233+00
62	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A0F52F2637A4C7D0073	processed	{"body": "Me avisa de segunda tbm p eu me organizar", "phone": null, "sentAt": "2026-08-13T23:44:08.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2A0F52F2637A4C7D0073", "senderExternalId": "3917161185369", "externalMessageId": "2A0F52F2637A4C7D0073", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:44:08.90567+00	2026-08-13 23:44:08.908+00
66	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2ADA6F91B9E12EA16E9D	processed	{"body": "Oiee boa noite Italo", "phone": null, "sentAt": "2026-08-14T00:03:10.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Sara Rezende", "externalEventId": "br:2ADA6F91B9E12EA16E9D", "senderExternalId": "50904489296108", "externalMessageId": "2ADA6F91B9E12EA16E9D", "externalConversationId": "50904489296108"}	\N	2026-08-14 00:03:10.945548+00	2026-08-14 00:03:10.918+00
71	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2ADC3FDA69A1E5094A00	processed	{"body": "Combinado", "phone": null, "sentAt": "2026-08-14T00:10:03.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2ADC3FDA69A1E5094A00", "senderExternalId": "3917161185369", "externalMessageId": "2ADC3FDA69A1E5094A00", "externalConversationId": "3917161185369"}	\N	2026-08-14 00:10:03.391047+00	2026-08-14 00:10:03.338+00
160	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0136452458DC5719256	processed	{"body": "Diaaa", "phone": null, "sentAt": "2026-08-14T11:07:31.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0136452458DC5719256", "senderExternalId": "108310502072324", "externalMessageId": "3EB0136452458DC5719256", "externalConversationId": "108310502072324"}	\N	2026-08-14 11:07:31.136835+00	2026-08-14 11:07:31.057+00
162	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0EFF7BE4D20B976597C	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T11:07:36.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "image", "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0EFF7BE4D20B976597C", "senderExternalId": "108310502072324", "externalMessageId": "3EB0EFF7BE4D20B976597C", "externalConversationId": "108310502072324"}	\N	2026-08-14 11:07:36.177717+00	2026-08-14 11:07:36.127+00
93	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0A5842E384B1FC29BDB	processed	{"body": "https://www.youtube.com/watch?v=BUGZZaChiYw&pp=ygUSY29tbyB1c2FyIG8gZ2l0aHVi", "phone": null, "sentAt": "2026-08-14T01:03:21.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0A5842E384B1FC29BDB", "senderExternalId": "108310502072324", "externalMessageId": "3EB0A5842E384B1FC29BDB", "externalConversationId": "108310502072324"}	\N	2026-08-14 01:03:23.090669+00	2026-08-14 01:03:23.12+00
102	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0B97B76C66D22751B77	processed	{"body": "https://saaspsicologos.vercel.app/", "phone": null, "sentAt": "2026-08-14T01:27:02.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0B97B76C66D22751B77", "senderExternalId": "108310502072324", "externalMessageId": "3EB0B97B76C66D22751B77", "externalConversationId": "108310502072324"}	\N	2026-08-14 01:27:02.52608+00	2026-08-14 01:27:02.54+00
103	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB02870C95604DF254A69	processed	{"body": "num cartão: 0000 0000 0000 0004\\nvencimento: 12/30\\ncvc: 123", "phone": null, "sentAt": "2026-08-14T01:27:24.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB02870C95604DF254A69", "senderExternalId": "108310502072324", "externalMessageId": "3EB02870C95604DF254A69", "externalConversationId": "108310502072324"}	\N	2026-08-14 01:27:24.31831+00	2026-08-14 01:27:24.294+00
149	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A7080E4EAAB9098BD9E	processed	{"body": "Gostei da sessão de objetivos ali", "phone": null, "sentAt": "2026-08-14T02:36:51.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A7080E4EAAB9098BD9E", "senderExternalId": "108310502072324", "externalMessageId": "2A7080E4EAAB9098BD9E", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:36:51.88565+00	2026-08-14 02:36:51.908+00
46	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A211BC4C8963D7F0E86	processed	{"body": "Queria ver contigo com relação aos 4 vídeos que eu vou gravar por aqui também", "phone": null, "sentAt": "2026-08-13T23:14:49.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A211BC4C8963D7F0E86", "senderExternalId": "50904489296108", "externalMessageId": "2A211BC4C8963D7F0E86", "externalConversationId": "50904489296108"}	\N	2026-08-13 23:14:58.756516+00	2026-08-13 23:14:58.769+00
59	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AE90273384A7706EACD	processed	{"body": null, "phone": null, "sentAt": "2026-08-13T23:40:08.000Z", "outbound": true, "provider": "whatsapp", "mediaType": "audio", "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AE90273384A7706EACD", "senderExternalId": "3917161185369", "externalMessageId": "2AE90273384A7706EACD", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:40:08.563599+00	2026-08-13 23:40:08.568+00
63	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:AC3B0422A6F085A728DD0142F18CE58C	processed	{"body": null, "phone": null, "sentAt": "2026-08-13T23:45:09.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "audio", "senderName": "Maicon Tomasi", "externalEventId": "br:AC3B0422A6F085A728DD0142F18CE58C", "senderExternalId": "108310502072324", "externalMessageId": "AC3B0422A6F085A728DD0142F18CE58C", "externalConversationId": "108310502072324"}	\N	2026-08-13 23:45:10.154054+00	2026-08-13 23:45:10.155+00
64	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A5ABC8B3B6B155F3FE5	processed	{"body": "Fica em paz mestre", "phone": null, "sentAt": "2026-08-13T23:45:28.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A5ABC8B3B6B155F3FE5", "senderExternalId": "108310502072324", "externalMessageId": "2A5ABC8B3B6B155F3FE5", "externalConversationId": "108310502072324"}	\N	2026-08-13 23:45:28.312632+00	2026-08-13 23:45:28.315+00
67	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A9CC61EA6C82CBA29A8	processed	{"body": "Isso, eu ia te perguntar também! Você falou q tá bem corrido essa semana… eu vou ficar off final de semana e já tenho 3 vídeos quase finalizados no gatilhos, vou terminar entre hoje e amanhã, daí ficamos tranquilos ate semana que vem, se você conseguir gravar final de semana fica ótimo para entrar no cronograma da semana que vem", "phone": null, "sentAt": "2026-08-14T00:04:46.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Sara Rezende", "externalEventId": "br:2A9CC61EA6C82CBA29A8", "senderExternalId": "50904489296108", "externalMessageId": "2A9CC61EA6C82CBA29A8", "externalConversationId": "50904489296108"}	\N	2026-08-14 00:04:47.153721+00	2026-08-14 00:04:47.12+00
72	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB06FB137BE44D066A3DF	processed	{"body": "opa", "phone": null, "sentAt": "2026-08-14T00:17:35.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB06FB137BE44D066A3DF", "senderExternalId": "108310502072324", "externalMessageId": "3EB06FB137BE44D066A3DF", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:17:35.330727+00	2026-08-14 00:17:35.304+00
73	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0069EBCF84AF8FC3D3F	processed	{"body": "agora to pronto", "phone": null, "sentAt": "2026-08-14T00:17:40.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0069EBCF84AF8FC3D3F", "senderExternalId": "108310502072324", "externalMessageId": "3EB0069EBCF84AF8FC3D3F", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:17:40.781115+00	2026-08-14 00:17:40.723+00
74	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB02EE8E6251DDA5CB283	processed	{"body": "opa", "phone": null, "sentAt": "2026-08-14T00:17:43.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB02EE8E6251DDA5CB283", "senderExternalId": "108310502072324", "externalMessageId": "3EB02EE8E6251DDA5CB283", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:17:43.822264+00	2026-08-14 00:17:43.767+00
75	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0B8C695F87AAD236C86	processed	{"body": "vou te mandar o link", "phone": null, "sentAt": "2026-08-14T00:18:03.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB0B8C695F87AAD236C86", "senderExternalId": "108310502072324", "externalMessageId": "3EB0B8C695F87AAD236C86", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:18:03.524246+00	2026-08-14 00:18:03.47+00
76	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB05B414528755168C38F	processed	{"body": "okk", "phone": null, "sentAt": "2026-08-14T00:18:26.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB05B414528755168C38F", "senderExternalId": "108310502072324", "externalMessageId": "3EB05B414528755168C38F", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:18:26.624803+00	2026-08-14 00:18:26.611+00
77	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB02CB1471D030FAEB09D	processed	{"body": "https://meet.google.com/rrn-vvgw-byy", "phone": null, "sentAt": "2026-08-14T00:18:28.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB02CB1471D030FAEB09D", "senderExternalId": "108310502072324", "externalMessageId": "3EB02CB1471D030FAEB09D", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:18:28.952512+00	2026-08-14 00:18:28.898+00
92	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0E1895DAADE77E9358D	processed	{"body": "https://trello.com/invite/b/687f9c9428c425dd422971b5/ATTI9b069b5c4c9d08db89ee119589be83a3F184731C/saas-para-psicologos", "phone": null, "sentAt": "2026-08-14T00:54:39.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0E1895DAADE77E9358D", "senderExternalId": "108310502072324", "externalMessageId": "3EB0E1895DAADE77E9358D", "externalConversationId": "108310502072324"}	\N	2026-08-14 00:54:39.482963+00	2026-08-14 00:54:39.407+00
94	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3AFD02D8BFC5A59CB351	processed	{"body": "Tô parando agora kk", "phone": null, "sentAt": "2026-08-14T01:14:32.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Junior Costa 🚀", "externalEventId": "br:3AFD02D8BFC5A59CB351", "senderExternalId": "143842934317102", "externalMessageId": "3AFD02D8BFC5A59CB351", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:14:33.053915+00	2026-08-14 01:14:33.066+00
31	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB09407BE6B4407EEC3A3	processed	{"body": "fala meu amigo to em casa ja", "phone": null, "sentAt": "2026-08-13T22:39:57.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB09407BE6B4407EEC3A3", "senderExternalId": "108310502072324", "externalMessageId": "3EB09407BE6B4407EEC3A3", "externalConversationId": "108310502072324"}	\N	2026-08-13 22:39:57.50333+00	2026-08-13 22:39:57.453+00
44	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A638AEE823B556C3F83	processed	{"body": "Boa noite Sara tudo bem?", "phone": null, "sentAt": "2026-08-13T23:14:24.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A638AEE823B556C3F83", "senderExternalId": "50904489296108", "externalMessageId": "2A638AEE823B556C3F83", "externalConversationId": "50904489296108"}	\N	2026-08-13 23:14:24.227192+00	2026-08-13 23:14:24.259+00
47	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AF19747569F5449FE7C	processed	{"body": "Queria  gravar nesse sábado e na segunda pra já te enviar", "phone": null, "sentAt": "2026-08-13T23:15:04.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AF19747569F5449FE7C", "senderExternalId": "50904489296108", "externalMessageId": "2AF19747569F5449FE7C", "externalConversationId": "50904489296108"}	\N	2026-08-13 23:15:04.883595+00	2026-08-13 23:15:04.89+00
150	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AE681AFD474FC972F8F	processed	{"body": "O pessoal do CRM lá", "phone": null, "sentAt": "2026-08-14T02:36:57.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AE681AFD474FC972F8F", "senderExternalId": "108310502072324", "externalMessageId": "2AE681AFD474FC972F8F", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:36:57.473878+00	2026-08-14 02:36:57.439+00
55	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A0C78666B2A7B096309	processed	{"body": "Isso mesmo", "phone": null, "sentAt": "2026-08-13T23:35:33.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2A0C78666B2A7B096309", "senderExternalId": "3917161185369", "externalMessageId": "2A0C78666B2A7B096309", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:35:33.744368+00	2026-08-13 23:35:33.757+00
56	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AE801CAB07CF535D543	processed	{"body": "Eu nem sabia que existia isso cara", "phone": null, "sentAt": "2026-08-13T23:35:38.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2AE801CAB07CF535D543", "senderExternalId": "3917161185369", "externalMessageId": "2AE801CAB07CF535D543", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:35:38.604897+00	2026-08-13 23:35:38.602+00
60	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A6FD13A2108F12D969B	processed	{"body": "Entendi", "phone": null, "sentAt": "2026-08-13T23:43:53.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Assistente Virtual - Neuropsicologo Ítalo P. Jardim", "externalEventId": "br:2A6FD13A2108F12D969B", "senderExternalId": "3917161185369", "externalMessageId": "2A6FD13A2108F12D969B", "externalConversationId": "3917161185369"}	\N	2026-08-13 23:43:53.85861+00	2026-08-13 23:43:53.852+00
65	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AF7D075811E67AD812C	processed	{"body": "Vai lá", "phone": null, "sentAt": "2026-08-13T23:45:31.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AF7D075811E67AD812C", "senderExternalId": "108310502072324", "externalMessageId": "2AF7D075811E67AD812C", "externalConversationId": "108310502072324"}	\N	2026-08-13 23:45:31.236895+00	2026-08-13 23:45:31.24+00
32	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0C950A7ACF966DE177F	processed	{"body": "quando der é so me chamar", "phone": null, "sentAt": "2026-08-13T22:40:08.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB0C950A7ACF966DE177F", "senderExternalId": "108310502072324", "externalMessageId": "3EB0C950A7ACF966DE177F", "externalConversationId": "108310502072324"}	\N	2026-08-13 22:40:08.619175+00	2026-08-13 22:40:08.558+00
33	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A8E2CC6FF01265D8931	processed	{"body": "Ola", "phone": null, "sentAt": "2026-08-13T22:42:11.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Italo Jardim", "externalEventId": "br:3A8E2CC6FF01265D8931", "senderExternalId": "65404365975787", "externalMessageId": "3A8E2CC6FF01265D8931", "externalConversationId": "65404365975787"}	\N	2026-08-13 22:42:11.613433+00	2026-08-13 22:42:11.558+00
34	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0098FE6568171E3BB67	processed	{"body": "mas a supervisão faz isso tambem", "phone": null, "sentAt": "2026-08-13T23:02:53.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB0098FE6568171E3BB67", "senderExternalId": "126813305094321", "externalMessageId": "3EB0098FE6568171E3BB67", "externalConversationId": "126813305094321"}	\N	2026-08-13 23:02:53.682949+00	2026-08-13 23:02:53.689+00
35	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0B6E9DAB7B63D9D485E	processed	{"body": "vou te ajudar com isso na pratica", "phone": null, "sentAt": "2026-08-13T23:03:02.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:3EB0B6E9DAB7B63D9D485E", "senderExternalId": "126813305094321", "externalMessageId": "3EB0B6E9DAB7B63D9D485E", "externalConversationId": "126813305094321"}	\N	2026-08-13 23:03:02.570103+00	2026-08-13 23:03:02.563+00
68	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A37C7CA1F6C865D4BF5	processed	{"body": "Beleza", "phone": null, "sentAt": "2026-08-14T00:09:43.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A37C7CA1F6C865D4BF5", "senderExternalId": "50904489296108", "externalMessageId": "2A37C7CA1F6C865D4BF5", "externalConversationId": "50904489296108"}	\N	2026-08-14 00:09:43.575241+00	2026-08-14 00:09:43.53+00
69	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A20DD729DB45999B61E	processed	{"body": "Ai você me manda os roteiros ?", "phone": null, "sentAt": "2026-08-14T00:09:49.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A20DD729DB45999B61E", "senderExternalId": "50904489296108", "externalMessageId": "2A20DD729DB45999B61E", "externalConversationId": "50904489296108"}	\N	2026-08-14 00:09:49.281836+00	2026-08-14 00:09:49.238+00
70	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A7BCC7C1B03C75C2748	processed	{"body": "Qual você acha que eu gravo ?", "phone": null, "sentAt": "2026-08-14T00:09:53.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A7BCC7C1B03C75C2748", "senderExternalId": "50904489296108", "externalMessageId": "2A7BCC7C1B03C75C2748", "externalConversationId": "50904489296108"}	\N	2026-08-14 00:09:53.895277+00	2026-08-14 00:09:53.85+00
154	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB07DEB4417ACCD761CC4	processed	{"body": "to tentando focar as coisas mais nesse email aqui que é novo kkkk \\n\\ndesenvolvedormaicon@gmail.com", "phone": null, "sentAt": "2026-08-14T02:39:02.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB07DEB4417ACCD761CC4", "senderExternalId": "108310502072324", "externalMessageId": "3EB07DEB4417ACCD761CC4", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:39:02.40289+00	2026-08-14 02:39:02.338+00
115	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2ADBA05FCD56357B694C	processed	{"body": "Eu tô brincando de programador aqui", "phone": null, "sentAt": "2026-08-14T01:32:31.000Z", "outbound": true, "provider": "whatsapp", "mediaType": "image", "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2ADBA05FCD56357B694C", "senderExternalId": "143842934317102", "externalMessageId": "2ADBA05FCD56357B694C", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:32:31.186701+00	2026-08-14 01:32:31.065+00
116	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A0E6C1C3F44E338361F	processed	{"body": "Montei hoje um CRM fudido", "phone": null, "sentAt": "2026-08-14T01:32:40.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A0E6C1C3F44E338361F", "senderExternalId": "143842934317102", "externalMessageId": "2A0E6C1C3F44E338361F", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:32:39.852544+00	2026-08-14 01:32:40.31+00
117	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AB542BEF22BBF2278DC	processed	{"body": "E um sistema de gestão de clínica", "phone": null, "sentAt": "2026-08-14T01:32:47.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AB542BEF22BBF2278DC", "senderExternalId": "143842934317102", "externalMessageId": "2AB542BEF22BBF2278DC", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:32:48.040736+00	2026-08-14 01:32:47.947+00
118	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A8160EE5D50C3E795D3	processed	{"body": "Caramba", "phone": null, "sentAt": "2026-08-14T01:33:50.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Junior Costa 🚀", "externalEventId": "br:3A8160EE5D50C3E795D3", "senderExternalId": "143842934317102", "externalMessageId": "3A8160EE5D50C3E795D3", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:33:50.995575+00	2026-08-14 01:33:50.879+00
119	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A8EFB7309748DD4A996	processed	{"body": "Claude?", "phone": null, "sentAt": "2026-08-14T01:33:52.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Junior Costa 🚀", "externalEventId": "br:3A8EFB7309748DD4A996", "senderExternalId": "143842934317102", "externalMessageId": "3A8EFB7309748DD4A996", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:33:52.781833+00	2026-08-14 01:33:52.785+00
120	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A5E046617ACC02A74EE	processed	{"body": "Sim", "phone": null, "sentAt": "2026-08-14T01:36:33.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A5E046617ACC02A74EE", "senderExternalId": "143842934317102", "externalMessageId": "2A5E046617ACC02A74EE", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:36:33.053337+00	2026-08-14 01:36:33.051+00
121	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A3187718922231B016B	processed	{"body": "E usando o antigravity", "phone": null, "sentAt": "2026-08-14T01:36:41.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A3187718922231B016B", "senderExternalId": "143842934317102", "externalMessageId": "2A3187718922231B016B", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:36:41.83487+00	2026-08-14 01:36:41.857+00
122	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AB049903ACDF524DEE9	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T01:37:12.000Z", "outbound": true, "provider": "whatsapp", "mediaType": "video", "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AB049903ACDF524DEE9", "senderExternalId": "143842934317102", "externalMessageId": "2AB049903ACDF524DEE9", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:37:12.974277+00	2026-08-14 01:37:12.968+00
123	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3AD5736B54F428140537	processed	{"body": "Top demais mano", "phone": null, "sentAt": "2026-08-14T01:37:34.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Junior Costa 🚀", "externalEventId": "br:3AD5736B54F428140537", "senderExternalId": "143842934317102", "externalMessageId": "3AD5736B54F428140537", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:37:35.012428+00	2026-08-14 01:37:34.965+00
124	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A3871AD32E79D0D84A1	processed	{"body": "Caraca", "phone": null, "sentAt": "2026-08-14T01:37:56.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Junior Costa 🚀", "externalEventId": "br:3A3871AD32E79D0D84A1", "senderExternalId": "143842934317102", "externalMessageId": "3A3871AD32E79D0D84A1", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:37:56.459464+00	2026-08-14 01:37:56.379+00
125	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A51C342D3079F20BB2D	processed	{"body": "Sensacional", "phone": null, "sentAt": "2026-08-14T01:37:59.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Junior Costa 🚀", "externalEventId": "br:3A51C342D3079F20BB2D", "senderExternalId": "143842934317102", "externalMessageId": "3A51C342D3079F20BB2D", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:37:59.980839+00	2026-08-14 01:37:59.861+00
126	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A3A8F045662188098B9	processed	{"body": "Não vou mais ficar pagando 150 conto em um CRM", "phone": null, "sentAt": "2026-08-14T01:39:16.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A3A8F045662188098B9", "senderExternalId": "143842934317102", "externalMessageId": "2A3A8F045662188098B9", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:39:16.645644+00	2026-08-14 01:39:16.573+00
127	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A8EE7D2C0ADEDF378F1	processed	{"body": "Ta doido", "phone": null, "sentAt": "2026-08-14T01:39:21.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A8EE7D2C0ADEDF378F1", "senderExternalId": "143842934317102", "externalMessageId": "2A8EE7D2C0ADEDF378F1", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:39:21.459284+00	2026-08-14 01:39:21.48+00
128	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A074E19F61D6AB0809F	processed	{"body": "Chega de sistema", "phone": null, "sentAt": "2026-08-14T01:39:25.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A074E19F61D6AB0809F", "senderExternalId": "143842934317102", "externalMessageId": "2A074E19F61D6AB0809F", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:39:25.528041+00	2026-08-14 01:39:25.467+00
129	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A4A1A73165A66A03D02	processed	{"body": "50 assinaturas", "phone": null, "sentAt": "2026-08-14T01:39:33.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A4A1A73165A66A03D02", "senderExternalId": "143842934317102", "externalMessageId": "2A4A1A73165A66A03D02", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:39:33.066402+00	2026-08-14 01:39:33.055+00
145	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB04D13D2F94DBEBF121F	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T02:30:27.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "image", "senderName": "Maicon Tomasi", "externalEventId": "br:3EB04D13D2F94DBEBF121F", "senderExternalId": "108310502072324", "externalMessageId": "3EB04D13D2F94DBEBF121F", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:30:27.32223+00	2026-08-14 02:30:27.298+00
130	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AEE578D9D1AA59B4B8A	processed	{"body": "E assinatura de gestão da Clincia, CRM, ia", "phone": null, "sentAt": "2026-08-14T01:39:44.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AEE578D9D1AA59B4B8A", "senderExternalId": "143842934317102", "externalMessageId": "2AEE578D9D1AA59B4B8A", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:39:44.966208+00	2026-08-14 01:39:44.904+00
131	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A028BF15237B5AB8602	processed	{"body": "Agora to fazendo todos os meus sistemas", "phone": null, "sentAt": "2026-08-14T01:39:55.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A028BF15237B5AB8602", "senderExternalId": "143842934317102", "externalMessageId": "2A028BF15237B5AB8602", "externalConversationId": "143842934317102"}	\N	2026-08-14 01:39:55.626178+00	2026-08-14 01:39:55.556+00
151	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AC939521BB9C520F332	processed	{"body": "Pediu seu e-mail para te dar acesso ao GitHub com o código do CRM deles", "phone": null, "sentAt": "2026-08-14T02:37:10.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AC939521BB9C520F332", "senderExternalId": "108310502072324", "externalMessageId": "2AC939521BB9C520F332", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:37:10.207656+00	2026-08-14 02:37:10.134+00
159	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A66B45DF4F8B5CB758F	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T09:32:42.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "image", "senderName": "Yas", "externalEventId": "br:3A66B45DF4F8B5CB758F", "senderExternalId": "216836037697757", "externalMessageId": "3A66B45DF4F8B5CB758F", "externalConversationId": "216836037697757"}	\N	2026-08-14 09:32:42.845679+00	2026-08-14 09:32:42.779+00
161	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB087C11C08F1B6F6B929	processed	{"body": "dei uma modificada", "phone": null, "sentAt": "2026-08-14T11:07:34.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB087C11C08F1B6F6B929", "senderExternalId": "108310502072324", "externalMessageId": "3EB087C11C08F1B6F6B929", "externalConversationId": "108310502072324"}	\N	2026-08-14 11:07:34.389384+00	2026-08-14 11:07:34.374+00
163	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB02180021027744FFBA7	processed	{"body": "tava muito poluido kkk", "phone": null, "sentAt": "2026-08-14T11:07:39.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB02180021027744FFBA7", "senderExternalId": "108310502072324", "externalMessageId": "3EB02180021027744FFBA7", "externalConversationId": "108310502072324"}	\N	2026-08-14 11:07:39.519706+00	2026-08-14 11:07:39.453+00
164	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AD098DC8F9D924F144D	processed	{"body": "Bom dia Bianca tudo bem?😊", "phone": null, "sentAt": "2026-08-14T11:46:18.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AD098DC8F9D924F144D", "senderExternalId": "238267706425361", "externalMessageId": "2AD098DC8F9D924F144D", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:46:19.203659+00	2026-08-14 11:46:19.156+00
143	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0989AE44A781CE9490E	processed	{"body": "aqui um p´review kkkkk", "phone": null, "sentAt": "2026-08-14T02:30:27.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "image", "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0989AE44A781CE9490E", "senderExternalId": "108310502072324", "externalMessageId": "3EB0989AE44A781CE9490E", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:30:27.241026+00	2026-08-14 02:30:27.238+00
144	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB01B15A45F8ABF15B562	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T02:30:27.000Z", "outbound": false, "provider": "whatsapp", "mediaType": "image", "senderName": "Maicon Tomasi", "externalEventId": "br:3EB01B15A45F8ABF15B562", "senderExternalId": "108310502072324", "externalMessageId": "3EB01B15A45F8ABF15B562", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:30:27.300668+00	2026-08-14 02:30:27.291+00
146	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0DBB788B3A0B99CAD5A	processed	{"body": "to trabalhando n odesign ainda", "phone": null, "sentAt": "2026-08-14T02:30:30.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0DBB788B3A0B99CAD5A", "senderExternalId": "108310502072324", "externalMessageId": "3EB0DBB788B3A0B99CAD5A", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:30:31.010615+00	2026-08-14 02:30:30.989+00
147	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0E3A99D71A7C739C131	processed	{"body": "esse é a parte do prontuario que to fazendo", "phone": null, "sentAt": "2026-08-14T02:30:39.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0E3A99D71A7C739C131", "senderExternalId": "108310502072324", "externalMessageId": "3EB0E3A99D71A7C739C131", "externalConversationId": "108310502072324"}	\N	2026-08-14 02:30:39.658402+00	2026-08-14 02:30:39.622+00
165	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A23308B04991DD953B0	processed	{"body": "Bianca deu um imprevisto aqui aqui, estou sem internet", "phone": null, "sentAt": "2026-08-14T11:46:38.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A23308B04991DD953B0", "senderExternalId": "238267706425361", "externalMessageId": "2A23308B04991DD953B0", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:46:38.960941+00	2026-08-14 11:46:38.913+00
166	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A98C486FD1E4F11901D	processed	{"body": "Falta apenas um teste para realizarmos vou te enviar o link da mesma forma que fizemos segunda tudo bem?", "phone": null, "sentAt": "2026-08-14T11:47:12.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A98C486FD1E4F11901D", "senderExternalId": "238267706425361", "externalMessageId": "2A98C486FD1E4F11901D", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:47:12.399137+00	2026-08-14 11:47:12.337+00
167	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3ACDAA9554517AAC8E48	processed	{"body": "Bom dia doutor tudo bem?", "phone": null, "sentAt": "2026-08-14T11:49:45.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Bianca Souza", "externalEventId": "br:3ACDAA9554517AAC8E48", "senderExternalId": "238267706425361", "externalMessageId": "3ACDAA9554517AAC8E48", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:49:45.572445+00	2026-08-14 11:49:45.495+00
168	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A04D210C17596EA0F3F	processed	{"body": "Beleza :)", "phone": null, "sentAt": "2026-08-14T11:49:48.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Bianca Souza", "externalEventId": "br:3A04D210C17596EA0F3F", "senderExternalId": "238267706425361", "externalMessageId": "3A04D210C17596EA0F3F", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:49:48.432742+00	2026-08-14 11:49:48.364+00
169	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A2F83B8A68CE5D41461	processed	{"body": "Bom dia Alexandre tudo bom?", "phone": null, "sentAt": "2026-08-14T11:52:33.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A2F83B8A68CE5D41461", "senderExternalId": "107309825032373", "externalMessageId": "2A2F83B8A68CE5D41461", "externalConversationId": "107309825032373"}	\N	2026-08-14 11:52:33.500438+00	2026-08-14 11:52:33.438+00
170	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A9B032C8076F4E6707B	processed	{"body": "Como você está?", "phone": null, "sentAt": "2026-08-14T11:52:36.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A9B032C8076F4E6707B", "senderExternalId": "107309825032373", "externalMessageId": "2A9B032C8076F4E6707B", "externalConversationId": "107309825032373"}	\N	2026-08-14 11:52:37.005534+00	2026-08-14 11:52:36.96+00
171	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A5A3B6F0FC89CA021C2	processed	{"body": "Como foi seu dia pós sessão?", "phone": null, "sentAt": "2026-08-14T11:52:53.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A5A3B6F0FC89CA021C2", "senderExternalId": "107309825032373", "externalMessageId": "2A5A3B6F0FC89CA021C2", "externalConversationId": "107309825032373"}	\N	2026-08-14 11:52:53.473783+00	2026-08-14 11:52:53.454+00
172	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A432A5AABC56C07AFA4	processed	{"body": "E como estão as coisas com a Gabi?", "phone": null, "sentAt": "2026-08-14T11:53:06.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A432A5AABC56C07AFA4", "senderExternalId": "107309825032373", "externalMessageId": "2A432A5AABC56C07AFA4", "externalConversationId": "107309825032373"}	\N	2026-08-14 11:53:07.043009+00	2026-08-14 11:53:07.031+00
173	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A38A411B2D38D0683EF	processed	{"body": "Peço desculpas 😞", "phone": null, "sentAt": "2026-08-14T11:53:18.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A38A411B2D38D0683EF", "senderExternalId": "238267706425361", "externalMessageId": "2A38A411B2D38D0683EF", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:53:18.301373+00	2026-08-14 11:53:18.288+00
174	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A5687B4F4BFE4878E83	processed	{"body": "A internet simplesmente não quer funcionar aqui", "phone": null, "sentAt": "2026-08-14T11:53:29.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A5687B4F4BFE4878E83", "senderExternalId": "238267706425361", "externalMessageId": "2A5687B4F4BFE4878E83", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:53:29.844596+00	2026-08-14 11:53:29.835+00
175	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A3AD5139EEA0B271D2C	processed	{"body": "Liguei na operadora parece que é instabilidade na minha região", "phone": null, "sentAt": "2026-08-14T11:53:41.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A3AD5139EEA0B271D2C", "senderExternalId": "238267706425361", "externalMessageId": "2A3AD5139EEA0B271D2C", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:53:42.022393+00	2026-08-14 11:53:42.003+00
176	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A814D8B8C56FCD9498E	processed	{"body": "Acontece", "phone": null, "sentAt": "2026-08-14T11:53:53.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Bianca Souza", "externalEventId": "br:3A814D8B8C56FCD9498E", "senderExternalId": "238267706425361", "externalMessageId": "3A814D8B8C56FCD9498E", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:53:53.870674+00	2026-08-14 11:53:53.847+00
177	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3A33814BF00E15891B16	processed	{"body": "Tudo bem", "phone": null, "sentAt": "2026-08-14T11:53:56.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Bianca Souza", "externalEventId": "br:3A33814BF00E15891B16", "senderExternalId": "238267706425361", "externalMessageId": "3A33814BF00E15891B16", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:53:56.270838+00	2026-08-14 11:53:56.242+00
178	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3ADE9576516E62A4EB04	processed	{"body": "Qualquer coisa a gente remarca", "phone": null, "sentAt": "2026-08-14T11:54:02.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Bianca Souza", "externalEventId": "br:3ADE9576516E62A4EB04", "senderExternalId": "238267706425361", "externalMessageId": "3ADE9576516E62A4EB04", "externalConversationId": "238267706425361"}	\N	2026-08-14 11:54:02.589311+00	2026-08-14 11:54:02.554+00
179	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AB222C36CCBC27559E0	processed	{"body": "Bom dia papito", "phone": null, "sentAt": "2026-08-14T12:23:33.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2AB222C36CCBC27559E0", "senderExternalId": "89752485273665", "externalMessageId": "2AB222C36CCBC27559E0", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:23:33.986031+00	2026-08-14 12:23:33.964+00
180	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A2CB29228CE4C89572F	processed	{"body": "Fala comigo", "phone": null, "sentAt": "2026-08-14T12:23:47.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2A2CB29228CE4C89572F", "senderExternalId": "89752485273665", "externalMessageId": "2A2CB29228CE4C89572F", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:23:48.566735+00	2026-08-14 12:23:48.482+00
181	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A911AE14F8F09430A4C	processed	{"body": "Hope", "phone": null, "sentAt": "2026-08-14T12:25:54.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A911AE14F8F09430A4C", "senderExternalId": "89752485273665", "externalMessageId": "2A911AE14F8F09430A4C", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:25:54.88789+00	2026-08-14 12:25:54.854+00
182	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A4BC60C2CC4FA503F32	processed	{"body": "Bom dia meu amigo", "phone": null, "sentAt": "2026-08-14T12:25:58.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A4BC60C2CC4FA503F32", "senderExternalId": "89752485273665", "externalMessageId": "2A4BC60C2CC4FA503F32", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:25:58.16372+00	2026-08-14 12:25:58.108+00
183	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A8BACAC8820CE18EC53	processed	{"body": "Tudo bom?", "phone": null, "sentAt": "2026-08-14T12:26:00.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A8BACAC8820CE18EC53", "senderExternalId": "89752485273665", "externalMessageId": "2A8BACAC8820CE18EC53", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:26:00.625745+00	2026-08-14 12:26:00.544+00
184	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AFDF3EBE6B124F5128F	processed	{"body": "Combinado Bianca 🙏🏻", "phone": null, "sentAt": "2026-08-14T12:26:12.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AFDF3EBE6B124F5128F", "senderExternalId": "238267706425361", "externalMessageId": "2AFDF3EBE6B124F5128F", "externalConversationId": "238267706425361"}	\N	2026-08-14 12:26:13.031158+00	2026-08-14 12:26:13.027+00
185	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AE5E26C97B941D6733A	processed	{"body": "Mais uma vez peço desculpas por esse imprevisto", "phone": null, "sentAt": "2026-08-14T12:26:20.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AE5E26C97B941D6733A", "senderExternalId": "238267706425361", "externalMessageId": "2AE5E26C97B941D6733A", "externalConversationId": "238267706425361"}	\N	2026-08-14 12:26:20.494567+00	2026-08-14 12:26:20.403+00
186	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AE903BDDE12088DF7F5	processed	{"body": "Tudo na paz", "phone": null, "sentAt": "2026-08-14T12:26:27.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2AE903BDDE12088DF7F5", "senderExternalId": "89752485273665", "externalMessageId": "2AE903BDDE12088DF7F5", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:26:27.053414+00	2026-08-14 12:26:26.98+00
187	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A5C7AC7ADB2ED8CCDBA	processed	{"body": "Como que faz pra marcarmos uma consulta e os valores?", "phone": null, "sentAt": "2026-08-14T12:26:43.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2A5C7AC7ADB2ED8CCDBA", "senderExternalId": "89752485273665", "externalMessageId": "2A5C7AC7ADB2ED8CCDBA", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:26:43.392284+00	2026-08-14 12:26:43.379+00
188	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A5ABF87B245D43C7B57	processed	{"body": "Deixa eu só entender uma coisa", "phone": null, "sentAt": "2026-08-14T12:27:08.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A5ABF87B245D43C7B57", "senderExternalId": "89752485273665", "externalMessageId": "2A5ABF87B245D43C7B57", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:27:08.276019+00	2026-08-14 12:27:08.168+00
189	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AFE0E2E9E16B7486BCD	processed	{"body": "A empresa que vai pagar a terapia ?", "phone": null, "sentAt": "2026-08-14T12:27:22.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AFE0E2E9E16B7486BCD", "senderExternalId": "89752485273665", "externalMessageId": "2AFE0E2E9E16B7486BCD", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:27:22.921646+00	2026-08-14 12:27:22.915+00
190	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AC0BAF7CF6E3400688C	processed	{"body": "Só para eu saber se vou emitir nota pra cnpj kkk", "phone": null, "sentAt": "2026-08-14T12:27:39.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AC0BAF7CF6E3400688C", "senderExternalId": "89752485273665", "externalMessageId": "2AC0BAF7CF6E3400688C", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:27:39.477038+00	2026-08-14 12:27:39.377+00
192	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A4D6F31828F177C8CC0	processed	{"body": "Kkkkkk", "phone": null, "sentAt": "2026-08-14T12:28:01.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2A4D6F31828F177C8CC0", "senderExternalId": "89752485273665", "externalMessageId": "2A4D6F31828F177C8CC0", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:28:01.151092+00	2026-08-14 12:28:01.026+00
193	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AD334DD48549433C00E	processed	{"body": "Ctz?  Eu ja emito normalmente por conta da contabilidade kkkkkkk", "phone": null, "sentAt": "2026-08-14T12:28:26.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AD334DD48549433C00E", "senderExternalId": "89752485273665", "externalMessageId": "2AD334DD48549433C00E", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:28:26.397772+00	2026-08-14 12:28:26.349+00
191	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AAF2F72A1F8BC54AB72	processed	{"body": "Precisa emitir nota não", "phone": null, "sentAt": "2026-08-14T12:27:50.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2AAF2F72A1F8BC54AB72", "senderExternalId": "89752485273665", "externalMessageId": "2AAF2F72A1F8BC54AB72", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:27:50.937515+00	2026-08-14 12:27:50.815+00
206	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2ADB836C003016415B7C	processed	{"body": "Show", "phone": null, "sentAt": "2026-08-14T12:31:32.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2ADB836C003016415B7C", "senderExternalId": "89752485273665", "externalMessageId": "2ADB836C003016415B7C", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:31:32.858404+00	2026-08-14 12:31:32.846+00
194	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A9A54ACF0B13CC0652E	processed	{"body": "Ai qualquer coisa eu emito no nome dele então", "phone": null, "sentAt": "2026-08-14T12:28:37.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A9A54ACF0B13CC0652E", "senderExternalId": "89752485273665", "externalMessageId": "2A9A54ACF0B13CC0652E", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:28:37.488654+00	2026-08-14 12:28:37.403+00
195	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A650AFC1B1439B37CB8	processed	{"body": "Sim", "phone": null, "sentAt": "2026-08-14T12:29:16.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2A650AFC1B1439B37CB8", "senderExternalId": "89752485273665", "externalMessageId": "2A650AFC1B1439B37CB8", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:29:17.039812+00	2026-08-14 12:29:16.959+00
196	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A10EF6E89FF21145DCE	processed	{"body": "Então mestre, primeiro a gente precisa fazer uma primeira sessão que é a sessão de alinhamento, nela vou entender um pouco do que tem acontecido, qual a demanda dele, fazer o acolhimento início e dar início a um planejamento terapêutico", "phone": null, "sentAt": "2026-08-14T12:29:33.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A10EF6E89FF21145DCE", "senderExternalId": "89752485273665", "externalMessageId": "2A10EF6E89FF21145DCE", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:29:33.683029+00	2026-08-14 12:29:33.647+00
197	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AD3BF6E5728BFAB5BAF	processed	{"body": "Essa sessão é lá custa R$250,00", "phone": null, "sentAt": "2026-08-14T12:29:48.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AD3BF6E5728BFAB5BAF", "senderExternalId": "89752485273665", "externalMessageId": "2AD3BF6E5728BFAB5BAF", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:29:48.388662+00	2026-08-14 12:29:48.281+00
200	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AD797FD12D5D0C4B1B0	processed	{"body": "Show", "phone": null, "sentAt": "2026-08-14T12:30:36.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2AD797FD12D5D0C4B1B0", "senderExternalId": "89752485273665", "externalMessageId": "2AD797FD12D5D0C4B1B0", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:30:36.903528+00	2026-08-14 12:30:36.78+00
204	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2ACF3B747EB5BF0AE726	processed	{"body": "Da uma olhada e me diz o que achou", "phone": null, "sentAt": "2026-08-14T12:31:21.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2ACF3B747EB5BF0AE726", "senderExternalId": "89752485273665", "externalMessageId": "2ACF3B747EB5BF0AE726", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:31:21.21038+00	2026-08-14 12:31:21.055+00
198	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A754EAAFCDB7E4224B1	processed	{"body": "Ai nela a gente define os pacotes de terapia, de acordo com a necessidade dele", "phone": null, "sentAt": "2026-08-14T12:30:11.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A754EAAFCDB7E4224B1", "senderExternalId": "89752485273665", "externalMessageId": "2A754EAAFCDB7E4224B1", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:30:11.688829+00	2026-08-14 12:30:11.71+00
199	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A3B176771362AD615BC	processed	{"body": "Vou te mandar um PDF que explica tudo o que e feito nessa sessão", "phone": null, "sentAt": "2026-08-14T12:30:27.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A3B176771362AD615BC", "senderExternalId": "89752485273665", "externalMessageId": "2A3B176771362AD615BC", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:30:27.124998+00	2026-08-14 12:30:27.007+00
201	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A18D1DE5EDFE774977C	processed	{"body": "Ai manda pra ele rmabem", "phone": null, "sentAt": "2026-08-14T12:30:37.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A18D1DE5EDFE774977C", "senderExternalId": "89752485273665", "externalMessageId": "2A18D1DE5EDFE774977C", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:30:37.146323+00	2026-08-14 12:30:37.024+00
202	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A454B21779A2B0D698E	processed	{"body": "Tá", "phone": null, "sentAt": "2026-08-14T12:30:43.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Fagundes - Gerente Favorita Multimarcas", "externalEventId": "br:2A454B21779A2B0D698E", "senderExternalId": "89752485273665", "externalMessageId": "2A454B21779A2B0D698E", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:30:43.123047+00	2026-08-14 12:30:43.099+00
203	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A57B042A07984CD70C8	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T12:31:05.000Z", "outbound": true, "provider": "whatsapp", "mediaType": "document", "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A57B042A07984CD70C8", "senderExternalId": "89752485273665", "externalMessageId": "2A57B042A07984CD70C8", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:31:05.050511+00	2026-08-14 12:31:04.99+00
205	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A6D245DF3B5866E11E8	processed	{"body": "E aí a gente ia agenda essa primeira sessão", "phone": null, "sentAt": "2026-08-14T12:31:29.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A6D245DF3B5866E11E8", "senderExternalId": "89752485273665", "externalMessageId": "2A6D245DF3B5866E11E8", "externalConversationId": "89752485273665"}	\N	2026-08-14 12:31:29.510645+00	2026-08-14 12:31:29.347+00
207	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AEB7450647DEA611F34	processed	{"body": null, "phone": null, "sentAt": "2026-08-14T12:32:53.000Z", "outbound": true, "provider": "whatsapp", "mediaType": "audio", "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AEB7450647DEA611F34", "senderExternalId": "108310502072324", "externalMessageId": "2AEB7450647DEA611F34", "externalConversationId": "108310502072324"}	\N	2026-08-14 12:32:53.794199+00	2026-08-14 12:32:53.755+00
208	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2A10FB6E46AD69BD8746	processed	{"body": "Boom dia 😄", "phone": null, "sentAt": "2026-08-14T12:33:08.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2A10FB6E46AD69BD8746", "senderExternalId": "216836037697757", "externalMessageId": "2A10FB6E46AD69BD8746", "externalConversationId": "216836037697757"}	\N	2026-08-14 12:33:08.392851+00	2026-08-14 12:33:08.265+00
209	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:2AA0297C447B1C59399C	processed	{"body": "Recebido, até mais tarde 😁", "phone": null, "sentAt": "2026-08-14T12:33:19.000Z", "outbound": true, "provider": "whatsapp", "mediaType": null, "senderName": "Neuropsicologo Ítalo P Jardim", "externalEventId": "br:2AA0297C447B1C59399C", "senderExternalId": "216836037697757", "externalMessageId": "2AA0297C447B1C59399C", "externalConversationId": "216836037697757"}	\N	2026-08-14 12:33:19.633434+00	2026-08-14 12:33:19.466+00
210	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	whatsapp	br:3EB0D266D3D75C70EB538C	processed	{"body": "é legal da pra fazer", "phone": null, "sentAt": "2026-08-14T12:35:10.000Z", "outbound": false, "provider": "whatsapp", "mediaType": null, "senderName": "Maicon Tomasi", "externalEventId": "br:3EB0D266D3D75C70EB538C", "senderExternalId": "108310502072324", "externalMessageId": "3EB0D266D3D75C70EB538C", "externalConversationId": "108310502072324"}	\N	2026-08-14 12:35:10.298681+00	2026-08-14 12:35:10.111+00
\.


--
-- Data for Name: workspace_branding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspace_branding (workspace_id, display_name, logo_url, icon_url, brand_tokens, created_at, updated_at) FROM stdin;
aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Ítalo Jardim · Psicólogo	\N	\N	{}	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	Outra Empresa	\N	\N	{}	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
\.


--
-- Data for Name: workspace_invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspace_invitations (id, workspace_id, email, role, token_hash, status, invited_by, expires_at, accepted_at, created_at, updated_at) FROM stdin;
d2729fc4-63b8-4ed9-8247-96a4ed3c16c5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786637422471@praxis.dev	assistant	878c003cfd397b1ba6f9b7fc0cd4ba8b8bdbb41f21500c8b6e72fdf339e824bb	pending	11111111-1111-4111-8111-111111111111	2026-08-20 16:10:22.552371+00	\N	2026-08-13 16:10:22.552371+00	2026-08-13 16:10:22.552371+00
37977145-8077-4138-9c12-9c51a48b19b2	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786639749866@praxis.dev	assistant	bca94e59752c2a772e76edc9c2554a595d6e807265d45a693d44bc4b0fdb83e8	pending	11111111-1111-4111-8111-111111111111	2026-08-20 16:49:09.934774+00	\N	2026-08-13 16:49:09.934774+00	2026-08-13 16:49:09.934774+00
e45660f3-2794-4752-b371-dde1ec53c00b	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786640209121@praxis.dev	assistant	56e98d44d418a5f840351ad7f67d43d18b69ad5fcd3c10c99a3f72debb61e424	pending	11111111-1111-4111-8111-111111111111	2026-08-20 16:56:49.161856+00	\N	2026-08-13 16:56:49.161856+00	2026-08-13 16:56:49.161856+00
8e634291-91a1-4d8a-a357-7683eb06ffa5	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786641794534@praxis.dev	assistant	239937c24a69e0c7f41578245b18af4148633fb3f122d66804cdabcbf11553ee	pending	11111111-1111-4111-8111-111111111111	2026-08-20 17:23:14.586591+00	\N	2026-08-13 17:23:14.586591+00	2026-08-13 17:23:14.586591+00
f0f07447-2551-4a71-9bef-27dad8a2e5e7	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786645064296@praxis.dev	assistant	22c1d24482d88d0c6d56fe967371773eda70de4199766d77549c3497f9f36c5a	pending	11111111-1111-4111-8111-111111111111	2026-08-20 18:17:44.363379+00	\N	2026-08-13 18:17:44.363379+00	2026-08-13 18:17:44.363379+00
bb65a365-29ac-4243-bc79-73b41c30419d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786645155270@praxis.dev	assistant	a4ad9c7c9196f172978a6099429daf32ffadf3ab863c696ec8ceeb87e5f1cfd5	pending	11111111-1111-4111-8111-111111111111	2026-08-20 18:19:15.317747+00	\N	2026-08-13 18:19:15.317747+00	2026-08-13 18:19:15.317747+00
fb5ca050-2abe-4099-a709-a0b5545b4caf	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786645204528@praxis.dev	assistant	946c2aea5e875a8a039e08b061dc8fc2b4864757fd94d094773fea8b423b2365	pending	11111111-1111-4111-8111-111111111111	2026-08-20 18:20:04.565944+00	\N	2026-08-13 18:20:04.565944+00	2026-08-13 18:20:04.565944+00
e0437571-e9c5-4663-a80e-d8a3afe9459d	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786648013814@praxis.dev	assistant	9314d3b81991b6d89b88ef789dce891888abb47ca26bf448df3dcdb2d2c6aa82	pending	11111111-1111-4111-8111-111111111111	2026-08-20 19:06:53.900206+00	\N	2026-08-13 19:06:53.900206+00	2026-08-13 19:06:53.900206+00
00bf2e27-e425-4795-bfd6-2b1ef2bd3bae	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786648174821@praxis.dev	assistant	51b488f96517d8e1e3cd0ae693898ef0e557c9dc15ed5bf9dbe71126767697ae	pending	11111111-1111-4111-8111-111111111111	2026-08-20 19:09:34.913799+00	\N	2026-08-13 19:09:34.913799+00	2026-08-13 19:09:34.913799+00
48e4c5b4-c742-4fc9-a8f3-542b146f7a72	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	neuropsicologo@dritalojardim.com	assistant	9b5b49608fa441d56209ea143de31adaf0c2bfff50f77b41389f89b47d87ad5e	revoked	11111111-1111-4111-8111-111111111111	2026-08-20 19:42:14.878605+00	\N	2026-08-13 19:42:14.878605+00	2026-08-13 19:42:21.16624+00
57ee471c-8eca-4ec7-88c0-8a4ac9545c17	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	neuropsicologo@dritalojardim.com	admin	43e50d6bae43b8e3fbb331f06101126d1a9fb86247bfc2c1e18b936beafa4cef	accepted	11111111-1111-4111-8111-111111111111	2026-08-20 19:42:21.16624+00	2026-08-13 19:42:51.991739+00	2026-08-13 19:42:21.16624+00	2026-08-13 19:42:51.991739+00
80485f52-a645-4b0b-95c9-52aebc010250	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664154008@praxis.dev	assistant	cde167bbb78218c6e4dfd74101438839190e091e0c96edc8d4c05da04890d367	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:35:54.027971+00	\N	2026-08-13 23:35:54.027971+00	2026-08-13 23:35:54.027971+00
b319b2e6-4c28-4102-99e1-b83c16a48466	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664178698@praxis.dev	assistant	1ba209d12615a9016025eec8cbe5eda3395da8475493174e4aeea9a5fe25d8c6	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:36:18.718098+00	\N	2026-08-13 23:36:18.718098+00	2026-08-13 23:36:18.718098+00
d187cb27-aec9-4092-bb77-2e38cc2891ad	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664326770@praxis.dev	assistant	9682c1b342cdd5908b1c1ee2a5694ce0c0bb61f95e4e4c36ed3ef00920d19d90	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:38:46.788682+00	\N	2026-08-13 23:38:46.788682+00	2026-08-13 23:38:46.788682+00
2e5b9fc0-f695-4d9b-b50f-53f6c086312c	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664354184@praxis.dev	assistant	112b8ca3dff8bc5f826532f5ec5e955124d07b660f051fae787f359c4b617ec3	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:39:14.202782+00	\N	2026-08-13 23:39:14.202782+00	2026-08-13 23:39:14.202782+00
f0231683-420c-4bd9-86ca-6790177f2ac1	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664380174@praxis.dev	assistant	0f15a1b243fc44cb57cc55c3c6939f6d10be9e06d8c0f6032f07769cb83d911d	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:39:40.19285+00	\N	2026-08-13 23:39:40.19285+00	2026-08-13 23:39:40.19285+00
b68cecf8-37c7-41c1-92cf-c14c19e32290	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664405427@praxis.dev	assistant	1ee500611cf6c94827b93d625dff3230827b61c8743b0b256425631b02eac27c	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:40:05.445299+00	\N	2026-08-13 23:40:05.445299+00	2026-08-13 23:40:05.445299+00
28920ba7-e5e3-41b8-bf99-fae7942c2d19	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664561663@praxis.dev	assistant	052ae6725cb693dd749a3d651a694a272865f11825adbd8ce542ac7e6521227b	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:42:41.681099+00	\N	2026-08-13 23:42:41.681099+00	2026-08-13 23:42:41.681099+00
2c56c6f2-d0c0-41d6-983c-3d5f18030c87	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664598493@praxis.dev	assistant	0651d0c21cd85e904a132c349dc995b304b9245e6c8733c417bc037a14cdd925	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:43:18.515342+00	\N	2026-08-13 23:43:18.515342+00	2026-08-13 23:43:18.515342+00
a982811c-6248-431b-9ffb-4cd89441cb57	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664666633@praxis.dev	assistant	55bab85fffff113635f920d5534feb217baec8479dc74958f25f8ed15ca8b6c7	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:44:26.653921+00	\N	2026-08-13 23:44:26.653921+00	2026-08-13 23:44:26.653921+00
5d1a5144-f533-4061-aeea-034a1e1aa3a3	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664718488@praxis.dev	assistant	a7cdbe1372c993532604b2eb04aef253f1017664a167eed96feffe4d3c7118a6	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:45:18.510754+00	\N	2026-08-13 23:45:18.510754+00	2026-08-13 23:45:18.510754+00
be7c1619-be75-45c0-85bb-4923355b1a03	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664744860@praxis.dev	assistant	500e59d0e3b8e2fa722dd4fe5adcd585e6e57a9b852a28840cd3663e6cac859c	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:45:44.883657+00	\N	2026-08-13 23:45:44.883657+00	2026-08-13 23:45:44.883657+00
24580744-8cf8-4c8e-be3f-784573f49c88	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	convite-1786664808633@praxis.dev	assistant	eefe4d0b5142262fb661af4e1d3477193be46e948e1b2663899610b5b696aa89	pending	11111111-1111-4111-8111-111111111111	2026-08-20 23:46:48.658515+00	\N	2026-08-13 23:46:48.658515+00	2026-08-13 23:46:48.658515+00
\.


--
-- Data for Name: workspace_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspace_members (id, workspace_id, user_id, role, is_active, created_at, updated_at) FROM stdin;
1a4a2722-e3c8-4478-8edb-c7a9554bd16e	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	11111111-1111-4111-8111-111111111111	admin	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
2e7d4a5b-e5d7-431c-8df5-92518fc301d0	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	22222222-2222-4222-8222-222222222222	assistant	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
2ce56021-68eb-424e-896c-3ab6c22c3289	bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	33333333-3333-4333-8333-333333333333	admin	t	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00
17963ed2-9ce9-4ca2-91ed-fdbf757b696f	aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	01995e19-0de1-4ddb-b53e-0dff2cb718aa	admin	t	2026-08-13 19:42:51.991739+00	2026-08-13 19:42:51.991739+00
\.


--
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspaces (id, name, timezone, created_at, updated_at, deleted_at) FROM stdin;
aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa	Ítalo Jardim	America/Campo_Grande	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	\N
bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb	Outra Empresa (teste de isolamento)	America/Sao_Paulo	2026-08-13 15:53:36.177243+00	2026-08-13 15:53:36.177243+00	\N
\.


--
-- Data for Name: messages_2026_08_12; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.messages_2026_08_12 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_13; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.messages_2026_08_13 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_14; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.messages_2026_08_14 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_15; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.messages_2026_08_15 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_16; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.messages_2026_08_16 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_17; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.messages_2026_08_17 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-08-13 15:53:26
20211116045059	2026-08-13 15:53:26
20211116050929	2026-08-13 15:53:26
20211116051442	2026-08-13 15:53:26
20211116212300	2026-08-13 15:53:26
20211116213355	2026-08-13 15:53:26
20211116213934	2026-08-13 15:53:26
20211116214523	2026-08-13 15:53:26
20211122062447	2026-08-13 15:53:26
20211124070109	2026-08-13 15:53:26
20211202204204	2026-08-13 15:53:26
20211202204605	2026-08-13 15:53:26
20211210212804	2026-08-13 15:53:26
20211228014915	2026-08-13 15:53:26
20220107221237	2026-08-13 15:53:26
20220228202821	2026-08-13 15:53:26
20220312004840	2026-08-13 15:53:26
20220603231003	2026-08-13 15:53:26
20220603232444	2026-08-13 15:53:26
20220615214548	2026-08-13 15:53:26
20220712093339	2026-08-13 15:53:26
20220908172859	2026-08-13 15:53:26
20220916233421	2026-08-13 15:53:26
20230119133233	2026-08-13 15:53:26
20230128025114	2026-08-13 15:53:26
20230128025212	2026-08-13 15:53:26
20230227211149	2026-08-13 15:53:26
20230228184745	2026-08-13 15:53:26
20230308225145	2026-08-13 15:53:26
20230328144023	2026-08-13 15:53:26
20231018144023	2026-08-13 15:53:26
20231204144023	2026-08-13 15:53:26
20231204144024	2026-08-13 15:53:26
20231204144025	2026-08-13 15:53:26
20240108234812	2026-08-13 15:53:26
20240109165339	2026-08-13 15:53:26
20240227174441	2026-08-13 15:53:26
20240311171622	2026-08-13 15:53:26
20240321100241	2026-08-13 15:53:26
20240401105812	2026-08-13 15:53:26
20240418121054	2026-08-13 15:53:26
20240523004032	2026-08-13 15:53:26
20240618124746	2026-08-13 15:53:26
20240801235015	2026-08-13 15:53:26
20240805133720	2026-08-13 15:53:26
20240827160934	2026-08-13 15:53:26
20240919163303	2026-08-13 15:53:26
20240919163305	2026-08-13 15:53:26
20241019105805	2026-08-13 15:53:26
20241030150047	2026-08-13 15:53:26
20241108114728	2026-08-13 15:53:26
20241121104152	2026-08-13 15:53:26
20241130184212	2026-08-13 15:53:26
20241220035512	2026-08-13 15:53:26
20241220123912	2026-08-13 15:53:26
20241224161212	2026-08-13 15:53:26
20250107150512	2026-08-13 15:53:26
20250110162412	2026-08-13 15:53:26
20250123174212	2026-08-13 15:53:26
20250128220012	2026-08-13 15:53:26
20250506224012	2026-08-13 15:53:26
20250523164012	2026-08-13 15:53:26
20250714121412	2026-08-13 15:53:26
20250905041441	2026-08-13 15:53:26
20251103001201	2026-08-13 15:53:26
20251120212548	2026-08-13 15:53:26
20251120215549	2026-08-13 15:53:26
20260218120000	2026-08-13 15:53:26
20260326120000	2026-08-13 15:53:26
20260514120000	2026-08-13 15:53:26
20260527120000	2026-08-13 15:53:26
20260528120000	2026-08-13 15:53:26
20260603120000	2026-08-13 15:53:26
20260605120000	2026-08-13 15:53:26
20260606110000	2026-08-13 15:53:26
20260616120000	2026-08-13 15:53:26
20260624120000	2026-08-13 15:53:26
20260626120000	2026-08-13 15:53:26
20260706120000	2026-08-13 15:53:26
20260707120000	2026-08-13 15:53:26
20260709120000	2026-08-13 15:53:26
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
121	2f622eac-97e5-11f1-9cf4-3619775bd737	public.leads	{"(workspace_id,eq,aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa,f)"}	{"aal": "aal1", "amr": [{"method": "password", "timestamp": 1786667324}], "aud": "authenticated", "exp": 1786716687, "iat": 1786713087, "iss": "http://127.0.0.1:54321/auth/v1", "sub": "01995e19-0de1-4ddb-b53e-0dff2cb718aa", "role": "authenticated", "email": "neuropsicologo@dritalojardim.com", "phone": "", "session_id": "b368d347-b60d-4b46-84fa-5212dbc62abc", "app_metadata": {"provider": "email", "providers": ["email"]}, "is_anonymous": false, "user_metadata": {"sub": "01995e19-0de1-4ddb-b53e-0dff2cb718aa", "email": "neuropsicologo@dritalojardim.com", "full_name": "Ítalo Paiva Jardim", "email_verified": true, "phone_verified": false}}	2026-08-14 13:36:42.346928	*	\N
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2026-08-13 15:53:24.309021+00
20210809183423_update_grants	2026-08-13 15:53:24.309021+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
20260812000001	{"-- =============================================================================\n-- Fase 1 — Fundação: workspaces, perfis, membros, convites, auditoria.\n-- Multi-tenant por workspace_id com RLS em todas as tabelas expostas.\n-- =============================================================================\n\ncreate extension if not exists pgcrypto with schema extensions","create extension if not exists citext with schema extensions","-- -----------------------------------------------------------------------------\n-- Tipos de domínio\n-- -----------------------------------------------------------------------------\n\ncreate type public.member_role as enum ('admin', 'assistant')","create type public.invitation_status as enum ('pending', 'accepted', 'revoked', 'expired')","create type public.audit_action as enum (\n  'workspace_updated',\n  'branding_updated',\n  'member_invited',\n  'invitation_revoked',\n  'invitation_accepted',\n  'member_role_changed',\n  'member_activated',\n  'member_deactivated'\n)","-- -----------------------------------------------------------------------------\n-- Schema privado para funções auxiliares (nunca exposto pela API)\n-- -----------------------------------------------------------------------------\n\ncreate schema if not exists private","-- -----------------------------------------------------------------------------\n-- Tabelas\n-- -----------------------------------------------------------------------------\n\ncreate table public.workspaces (\n  id uuid primary key default gen_random_uuid(),\n  name text not null check (char_length(name) between 1 and 120),\n  timezone text not null default 'America/Campo_Grande',\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  deleted_at timestamptz\n)","create table public.workspace_branding (\n  workspace_id uuid primary key references public.workspaces (id) on delete cascade,\n  display_name text,\n  logo_url text,\n  icon_url text,\n  -- Tokens de marca configuráveis por workspace (cores, etc.). Nunca segredos.\n  brand_tokens jsonb not null default '{}'::jsonb,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create table public.profiles (\n  id uuid primary key references auth.users (id) on delete cascade,\n  email text,\n  full_name text,\n  avatar_url text,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create table public.workspace_members (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  user_id uuid not null references auth.users (id) on delete cascade,\n  role public.member_role not null default 'assistant',\n  is_active boolean not null default true,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  unique (workspace_id, user_id)\n)","create index workspace_members_user_idx on public.workspace_members (user_id)","create index workspace_members_workspace_idx on public.workspace_members (workspace_id)","create table public.workspace_invitations (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  email extensions.citext not null,\n  role public.member_role not null default 'assistant',\n  token_hash text not null unique,\n  status public.invitation_status not null default 'pending',\n  invited_by uuid not null references auth.users (id),\n  expires_at timestamptz not null,\n  accepted_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create index workspace_invitations_workspace_idx on public.workspace_invitations (workspace_id)","create index workspace_invitations_email_idx on public.workspace_invitations (workspace_id, email)","create table public.audit_logs (\n  id bigint generated always as identity primary key,\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  actor_id uuid references auth.users (id),\n  action public.audit_action not null,\n  entity_type text not null,\n  entity_id text,\n  -- Apenas metadados; nunca conteúdo sensível, tokens ou dados pessoais além do necessário.\n  details jsonb not null default '{}'::jsonb,\n  created_at timestamptz not null default now()\n)","create index audit_logs_workspace_idx on public.audit_logs (workspace_id, created_at desc)","-- -----------------------------------------------------------------------------\n-- Funções auxiliares (security definer para evitar recursão de policy)\n-- -----------------------------------------------------------------------------\n\ncreate or replace function private.user_workspaces()\nreturns setof uuid\nlanguage sql\nsecurity definer\nset search_path = ''\nstable\nas $$\n  select workspace_id\n  from public.workspace_members\n  where user_id = (select auth.uid())\n    and is_active;\n$$","create or replace function private.is_member(ws_id uuid)\nreturns boolean\nlanguage sql\nsecurity definer\nset search_path = ''\nstable\nas $$\n  select exists (\n    select 1\n    from public.workspace_members\n    where workspace_id = ws_id\n      and user_id = (select auth.uid())\n      and is_active\n  );\n$$","create or replace function private.is_admin(ws_id uuid)\nreturns boolean\nlanguage sql\nsecurity definer\nset search_path = ''\nstable\nas $$\n  select exists (\n    select 1\n    from public.workspace_members\n    where workspace_id = ws_id\n      and user_id = (select auth.uid())\n      and role = 'admin'\n      and is_active\n  );\n$$","create or replace function private.log_audit(\n  ws_id uuid,\n  audit_action public.audit_action,\n  entity_type text,\n  entity_id text,\n  details jsonb default '{}'::jsonb\n)\nreturns void\nlanguage sql\nsecurity definer\nset search_path = ''\nas $$\n  insert into public.audit_logs (workspace_id, actor_id, action, entity_type, entity_id, details)\n  values (ws_id, (select auth.uid()), audit_action, entity_type, entity_id, details);\n$$","-- updated_at automático\ncreate or replace function private.set_updated_at()\nreturns trigger\nlanguage plpgsql\nset search_path = ''\nas $$\nbegin\n  new.updated_at = now();\n  return new;\nend;\n$$","create trigger set_updated_at before update on public.workspaces\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.workspace_branding\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.profiles\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.workspace_members\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.workspace_invitations\n  for each row execute function private.set_updated_at()","-- Perfil criado automaticamente para cada novo usuário do Auth\ncreate or replace function private.handle_new_user()\nreturns trigger\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\nbegin\n  insert into public.profiles (id, email, full_name)\n  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))\n  on conflict (id) do nothing;\n  return new;\nend;\n$$","create trigger on_auth_user_created\n  after insert on auth.users\n  for each row execute function private.handle_new_user()","-- -----------------------------------------------------------------------------\n-- RLS\n-- -----------------------------------------------------------------------------\n\nalter table public.workspaces enable row level security","alter table public.workspace_branding enable row level security","alter table public.profiles enable row level security","alter table public.workspace_members enable row level security","alter table public.workspace_invitations enable row level security","alter table public.audit_logs enable row level security","-- workspaces: membros leem; admins atualizam nome/fuso; criação apenas via\n-- service_role (onboarding de novos tenants é fluxo controlado).\ncreate policy \\"workspaces_select_member\\" on public.workspaces\n  for select to authenticated\n  using (private.is_member(id) and deleted_at is null)","create policy \\"workspaces_update_admin\\" on public.workspaces\n  for update to authenticated\n  using (private.is_admin(id))\n  with check (private.is_admin(id))","-- workspace_branding\ncreate policy \\"branding_select_member\\" on public.workspace_branding\n  for select to authenticated\n  using (private.is_member(workspace_id))","create policy \\"branding_insert_admin\\" on public.workspace_branding\n  for insert to authenticated\n  with check (private.is_admin(workspace_id))","create policy \\"branding_update_admin\\" on public.workspace_branding\n  for update to authenticated\n  using (private.is_admin(workspace_id))\n  with check (private.is_admin(workspace_id))","-- profiles: o próprio usuário e colegas de workspace podem ler; só o próprio edita.\ncreate policy \\"profiles_select_self_or_colleague\\" on public.profiles\n  for select to authenticated\n  using (\n    id = (select auth.uid())\n    or id in (\n      select m.user_id\n      from public.workspace_members m\n      where m.workspace_id in (select private.user_workspaces())\n    )\n  )","create policy \\"profiles_update_self\\" on public.profiles\n  for update to authenticated\n  using (id = (select auth.uid()))\n  with check (id = (select auth.uid()))","-- workspace_members: membros veem a equipe do próprio workspace.\n-- Nenhuma escrita direta: mudanças de papel/ativação apenas via RPCs auditadas.\ncreate policy \\"members_select_member\\" on public.workspace_members\n  for select to authenticated\n  using (private.is_member(workspace_id))","-- workspace_invitations: apenas admins do workspace.\ncreate policy \\"invitations_select_admin\\" on public.workspace_invitations\n  for select to authenticated\n  using (private.is_admin(workspace_id))","-- audit_logs: apenas admins leem; escrita apenas via private.log_audit.\ncreate policy \\"audit_select_admin\\" on public.audit_logs\n  for select to authenticated\n  using (private.is_admin(workspace_id))","-- -----------------------------------------------------------------------------\n-- RPCs\n-- -----------------------------------------------------------------------------\n\n-- Cria convite e devolve o token bruto (exibido uma única vez ao admin).\ncreate or replace function public.create_invitation(\n  ws_id uuid,\n  invitee_email text,\n  invitee_role public.member_role default 'assistant'\n)\nreturns table (invitation_id uuid, token text)\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  raw_token text;\n  new_id uuid;\nbegin\n  if not private.is_admin(ws_id) then\n    raise exception 'apenas administradores podem convidar usuários'\n      using errcode = '42501';\n  end if;\n\n  if exists (\n    select 1\n    from public.workspace_members m\n    join auth.users u on u.id = m.user_id\n    where m.workspace_id = ws_id\n      and lower(u.email) = lower(invitee_email)\n  ) then\n    raise exception 'este e-mail já pertence a um membro do workspace'\n      using errcode = '23505';\n  end if;\n\n  raw_token := encode(extensions.gen_random_bytes(24), 'hex');\n\n  -- Invalida convites pendentes anteriores para o mesmo e-mail.\n  update public.workspace_invitations\n  set status = 'revoked'\n  where workspace_id = ws_id\n    and email = invitee_email::extensions.citext\n    and status = 'pending';\n\n  insert into public.workspace_invitations\n    (workspace_id, email, role, token_hash, invited_by, expires_at)\n  values (\n    ws_id,\n    invitee_email::extensions.citext,\n    invitee_role,\n    encode(extensions.digest(raw_token, 'sha256'), 'hex'),\n    (select auth.uid()),\n    now() + interval '7 days'\n  )\n  returning id into new_id;\n\n  perform private.log_audit(\n    ws_id, 'member_invited', 'workspace_invitation', new_id::text,\n    jsonb_build_object('role', invitee_role)\n  );\n\n  return query select new_id, raw_token;\nend;\n$$","-- Dados mínimos do convite para a página pública /convite/[token].\ncreate or replace function public.get_invitation_public(raw_token text)\nreturns table (\n  workspace_name text,\n  email text,\n  role public.member_role,\n  status public.invitation_status,\n  expires_at timestamptz\n)\nlanguage sql\nsecurity definer\nset search_path = ''\nstable\nas $$\n  select w.name, i.email::text, i.role, i.status, i.expires_at\n  from public.workspace_invitations i\n  join public.workspaces w on w.id = i.workspace_id\n  where i.token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex');\n$$","-- Aceita convite: exige usuário autenticado com o mesmo e-mail do convite.\ncreate or replace function public.accept_invitation(raw_token text)\nreturns uuid\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  inv record;\n  caller_email text;\nbegin\n  if (select auth.uid()) is null then\n    raise exception 'autenticação necessária' using errcode = '42501';\n  end if;\n\n  select email into caller_email from auth.users where id = (select auth.uid());\n\n  select * into inv\n  from public.workspace_invitations\n  where token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex')\n  for update;\n\n  if inv is null then\n    raise exception 'convite não encontrado' using errcode = 'P0002';\n  end if;\n\n  if inv.status <> 'pending' then\n    raise exception 'convite não está mais válido' using errcode = 'P0002';\n  end if;\n\n  if inv.expires_at < now() then\n    update public.workspace_invitations set status = 'expired' where id = inv.id;\n    raise exception 'convite expirado' using errcode = 'P0002';\n  end if;\n\n  if lower(caller_email) <> lower(inv.email::text) then\n    raise exception 'o convite pertence a outro e-mail' using errcode = '42501';\n  end if;\n\n  insert into public.workspace_members (workspace_id, user_id, role)\n  values (inv.workspace_id, (select auth.uid()), inv.role)\n  on conflict (workspace_id, user_id) do update\n    set is_active = true;\n\n  update public.workspace_invitations\n  set status = 'accepted', accepted_at = now()\n  where id = inv.id;\n\n  perform private.log_audit(\n    inv.workspace_id, 'invitation_accepted', 'workspace_invitation', inv.id::text,\n    jsonb_build_object('role', inv.role)\n  );\n\n  return inv.workspace_id;\nend;\n$$","create or replace function public.revoke_invitation(invitation_id uuid)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  ws uuid;\nbegin\n  select workspace_id into ws\n  from public.workspace_invitations\n  where id = invitation_id;\n\n  if ws is null or not private.is_admin(ws) then\n    raise exception 'operação não permitida' using errcode = '42501';\n  end if;\n\n  update public.workspace_invitations\n  set status = 'revoked'\n  where id = invitation_id and status = 'pending';\n\n  perform private.log_audit(ws, 'invitation_revoked', 'workspace_invitation', invitation_id::text);\nend;\n$$","-- Troca de papel: admin do workspace, nunca sobre si mesmo (antiescalação).\ncreate or replace function public.change_member_role(\n  member_id uuid,\n  new_role public.member_role\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  m record;\nbegin\n  select * into m from public.workspace_members where id = member_id;\n\n  if m is null or not private.is_admin(m.workspace_id) then\n    raise exception 'operação não permitida' using errcode = '42501';\n  end if;\n\n  if m.user_id = (select auth.uid()) then\n    raise exception 'não é possível alterar o próprio papel' using errcode = '42501';\n  end if;\n\n  update public.workspace_members set role = new_role where id = member_id;\n\n  perform private.log_audit(\n    m.workspace_id, 'member_role_changed', 'workspace_member', member_id::text,\n    jsonb_build_object('from', m.role, 'to', new_role)\n  );\nend;\n$$","-- Ativa/desativa membro: admin, nunca sobre si mesmo.\ncreate or replace function public.set_member_active(member_id uuid, active boolean)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  m record;\nbegin\n  select * into m from public.workspace_members where id = member_id;\n\n  if m is null or not private.is_admin(m.workspace_id) then\n    raise exception 'operação não permitida' using errcode = '42501';\n  end if;\n\n  if m.user_id = (select auth.uid()) then\n    raise exception 'não é possível desativar a si mesmo' using errcode = '42501';\n  end if;\n\n  update public.workspace_members set is_active = active where id = member_id;\n\n  perform private.log_audit(\n    m.workspace_id,\n    case when active then 'member_activated' else 'member_deactivated' end,\n    'workspace_member',\n    member_id::text\n  );\nend;\n$$","-- -----------------------------------------------------------------------------\n-- Grants: RPCs executáveis por usuários autenticados; página de convite é pública.\n-- -----------------------------------------------------------------------------\n\nrevoke execute on all functions in schema public from public, anon","-- Grants de tabela: a RLS é quem restringe as linhas; sem o grant o Postgres\n-- nega tudo. anon não recebe acesso a tabelas (só à RPC pública do convite).\ngrant usage on schema public to authenticated, service_role","grant select, insert, update, delete on all tables in schema public to authenticated","grant all on all tables in schema public to service_role","grant usage on all sequences in schema public to authenticated, service_role","alter default privileges in schema public\n  grant select, insert, update, delete on tables to authenticated","alter default privileges in schema public\n  grant all on tables to service_role","-- As policies avaliam private.is_member/is_admin com o papel do usuário da\n-- requisição: ele precisa de USAGE no schema e EXECUTE nas funções.\n-- O schema private não é exposto pela API (PostgREST serve apenas \\"public\\").\ngrant usage on schema private to authenticated","grant execute on all functions in schema private to authenticated","alter default privileges in schema private\n  grant execute on functions to authenticated","grant execute on function public.create_invitation(uuid, text, public.member_role) to authenticated","grant execute on function public.accept_invitation(text) to authenticated","grant execute on function public.revoke_invitation(uuid) to authenticated","grant execute on function public.change_member_role(uuid, public.member_role) to authenticated","grant execute on function public.set_member_active(uuid, boolean) to authenticated","grant execute on function public.get_invitation_public(text) to anon, authenticated"}	foundation
20260813000001	{"-- =============================================================================\n-- Fase 2 — CRM principal: pipelines, etapas semânticas, produtos, leads com\n-- cadastro progressivo, notas (team/admin_only), tarefas, atividades,\n-- histórico de etapas e RPCs transacionais.\n-- =============================================================================\n\n-- -----------------------------------------------------------------------------\n-- Tipos de domínio\n-- -----------------------------------------------------------------------------\n\n-- Tipo semântico interno da etapa: relatórios usam este valor, nunca o nome\n-- visível — renomear/reordenar colunas não quebra métricas.\ncreate type public.stage_type as enum (\n  'new',\n  'qualification',\n  'follow_up_pre_session',\n  'alignment_session',\n  'follow_up_post_session',\n  'won',\n  'lost',\n  'custom'\n)","create type public.lead_channel as enum (\n  'form',\n  'whatsapp',\n  'instagram',\n  'paid_traffic',\n  'manual'\n)","create type public.note_visibility as enum ('team', 'admin_only')","create type public.activity_type as enum (\n  'call',\n  'message',\n  'note',\n  'task',\n  'stage_change',\n  'system'\n)","alter type public.audit_action add value if not exists 'lead_merged'","alter type public.audit_action add value if not exists 'lead_lost'","alter type public.audit_action add value if not exists 'lead_reactivated'","alter type public.audit_action add value if not exists 'stage_deleted'","alter type public.audit_action add value if not exists 'product_changed'","alter type public.audit_action add value if not exists 'pipeline_changed'","-- -----------------------------------------------------------------------------\n-- Tabelas\n-- -----------------------------------------------------------------------------\n\ncreate table public.pipelines (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  name text not null check (char_length(name) between 1 and 120),\n  is_default boolean not null default false,\n  position numeric not null default 0,\n  archived_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create index pipelines_workspace_idx on public.pipelines (workspace_id)","create table public.pipeline_stages (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  pipeline_id uuid not null references public.pipelines (id) on delete cascade,\n  name text not null check (char_length(name) between 1 and 80),\n  stage_type public.stage_type not null default 'custom',\n  position numeric not null default 0,\n  archived_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create index pipeline_stages_pipeline_idx on public.pipeline_stages (pipeline_id, position)","create index pipeline_stages_workspace_idx on public.pipeline_stages (workspace_id)","create table public.products (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  name text not null check (char_length(name) between 1 and 120),\n  category text not null default 'outro',\n  description text,\n  default_price numeric(12, 2) check (default_price is null or default_price >= 0),\n  is_active boolean not null default true,\n  default_pipeline_id uuid references public.pipelines (id) on delete set null,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create index products_workspace_idx on public.products (workspace_id, is_active)","create table public.lost_reasons (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  label text not null check (char_length(label) between 1 and 120),\n  position numeric not null default 0,\n  is_active boolean not null default true,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create index lost_reasons_workspace_idx on public.lost_reasons (workspace_id, is_active)","create table public.leads (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  pipeline_id uuid not null references public.pipelines (id),\n  stage_id uuid not null references public.pipeline_stages (id),\n  position numeric not null default 0,\n  -- Cadastro progressivo: apenas o nome é obrigatório na captura.\n  name text not null check (char_length(name) between 1 and 160),\n  social_name text,\n  phone text,\n  phone_normalized text,\n  email text,\n  email_normalized text,\n  city text,\n  state text check (state is null or char_length(state) <= 2),\n  contact_preference text,\n  channel public.lead_channel not null default 'manual',\n  source_detail text,\n  utm_source text,\n  utm_medium text,\n  utm_campaign text,\n  utm_content text,\n  utm_term text,\n  external_campaign text,\n  external_ad text,\n  external_form text,\n  owner_id uuid references auth.users (id) on delete set null,\n  potential_value numeric(12, 2) check (potential_value is null or potential_value >= 0),\n  next_action text,\n  first_contact_at timestamptz,\n  engaged_at timestamptz,\n  lost_reason_id uuid references public.lost_reasons (id) on delete set null,\n  lost_note text,\n  lost_at timestamptz,\n  reactivated_count integer not null default 0,\n  notes_summary text,\n  created_by uuid references auth.users (id),\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  deleted_at timestamptz\n)","create index leads_board_idx on public.leads (workspace_id, stage_id, position)\n  where deleted_at is null","create index leads_pipeline_idx on public.leads (workspace_id, pipeline_id)","create index leads_phone_idx on public.leads (workspace_id, phone_normalized)\n  where phone_normalized is not null","create index leads_email_idx on public.leads (workspace_id, email_normalized)\n  where email_normalized is not null","create index leads_owner_idx on public.leads (workspace_id, owner_id)","create index leads_created_idx on public.leads (workspace_id, created_at desc)","create table public.lead_product_interests (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  product_id uuid not null references public.products (id) on delete cascade,\n  created_at timestamptz not null default now(),\n  unique (lead_id, product_id)\n)","create index lead_product_interests_product_idx\n  on public.lead_product_interests (workspace_id, product_id)","create table public.lead_stage_history (\n  id bigint generated always as identity primary key,\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  from_stage_id uuid references public.pipeline_stages (id) on delete set null,\n  to_stage_id uuid references public.pipeline_stages (id) on delete set null,\n  -- stage_type congelado no evento: relatórios não dependem da etapa existir.\n  from_stage_type public.stage_type,\n  to_stage_type public.stage_type not null,\n  actor_id uuid references auth.users (id),\n  created_at timestamptz not null default now()\n)","create index lead_stage_history_lead_idx on public.lead_stage_history (lead_id, created_at)","create index lead_stage_history_workspace_idx\n  on public.lead_stage_history (workspace_id, created_at)","create table public.tags (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  name text not null check (char_length(name) between 1 and 60),\n  created_at timestamptz not null default now(),\n  unique (workspace_id, name)\n)","create table public.lead_tags (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  tag_id uuid not null references public.tags (id) on delete cascade,\n  created_at timestamptz not null default now(),\n  unique (lead_id, tag_id)\n)","create table public.notes (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  author_id uuid not null references auth.users (id),\n  body text not null check (char_length(body) between 1 and 8000),\n  visibility public.note_visibility not null default 'team',\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  deleted_at timestamptz\n)","create index notes_lead_idx on public.notes (lead_id, created_at desc)","create table public.tasks (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  title text not null check (char_length(title) between 1 and 300),\n  due_at timestamptz,\n  completed_at timestamptz,\n  assigned_to uuid references auth.users (id) on delete set null,\n  created_by uuid references auth.users (id),\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  deleted_at timestamptz\n)","create index tasks_lead_idx on public.tasks (lead_id)","create index tasks_due_idx on public.tasks (workspace_id, due_at)\n  where completed_at is null and deleted_at is null","create table public.activities (\n  id bigint generated always as identity primary key,\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  type public.activity_type not null,\n  content text,\n  meta jsonb not null default '{}'::jsonb,\n  actor_id uuid references auth.users (id),\n  created_at timestamptz not null default now()\n)","create index activities_lead_idx on public.activities (lead_id, created_at desc)","-- -----------------------------------------------------------------------------\n-- Normalização e triggers\n-- -----------------------------------------------------------------------------\n\n-- Telefone normalizado: apenas dígitos; números BR de 10/11 dígitos ganham 55.\ncreate or replace function private.normalize_phone(raw text)\nreturns text\nlanguage sql\nimmutable\nset search_path = ''\nas $$\n  select case\n    when raw is null or btrim(raw) = '' then null\n    else (\n      with digits as (select regexp_replace(raw, '\\\\D', '', 'g') as d)\n      select case\n        when d = '' then null\n        when char_length(d) in (10, 11) then '55' || d\n        else d\n      end\n      from digits\n    )\n  end;\n$$","create or replace function private.normalize_lead_contacts()\nreturns trigger\nlanguage plpgsql\nset search_path = ''\nas $$\nbegin\n  new.phone_normalized := private.normalize_phone(new.phone);\n  new.email_normalized := nullif(lower(btrim(new.email)), '');\n  return new;\nend;\n$$","create trigger normalize_lead_contacts\n  before insert or update of phone, email on public.leads\n  for each row execute function private.normalize_lead_contacts()","-- Mudança de etapa só pela RPC move_lead_stage (que grava o histórico).\n-- A RPC sinaliza via configuração local de transação.\ncreate or replace function private.guard_stage_change()\nreturns trigger\nlanguage plpgsql\nset search_path = ''\nas $$\nbegin\n  if new.stage_id is distinct from old.stage_id\n     and coalesce(current_setting('app.allow_stage_move', true), '') <> '1' then\n    raise exception 'use move_lead_stage para mudar a etapa'\n      using errcode = '42501';\n  end if;\n  return new;\nend;\n$$","create trigger guard_stage_change\n  before update of stage_id on public.leads\n  for each row execute function private.guard_stage_change()","create trigger set_updated_at before update on public.pipelines\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.pipeline_stages\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.products\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.lost_reasons\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.leads\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.notes\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.tasks\n  for each row execute function private.set_updated_at()","-- -----------------------------------------------------------------------------\n-- RLS\n-- -----------------------------------------------------------------------------\n\nalter table public.pipelines enable row level security","alter table public.pipeline_stages enable row level security","alter table public.products enable row level security","alter table public.lost_reasons enable row level security","alter table public.leads enable row level security","alter table public.lead_product_interests enable row level security","alter table public.lead_stage_history enable row level security","alter table public.tags enable row level security","alter table public.lead_tags enable row level security","alter table public.notes enable row level security","alter table public.tasks enable row level security","alter table public.activities enable row level security","-- Estrutura (pipelines, etapas, produtos, motivos): membros leem, admin escreve.\ncreate policy \\"pipelines_select_member\\" on public.pipelines\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"pipelines_write_admin\\" on public.pipelines\n  for all to authenticated\n  using (private.is_admin(workspace_id))\n  with check (private.is_admin(workspace_id))","create policy \\"stages_select_member\\" on public.pipeline_stages\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"stages_write_admin\\" on public.pipeline_stages\n  for all to authenticated\n  using (private.is_admin(workspace_id))\n  with check (private.is_admin(workspace_id))","create policy \\"products_select_member\\" on public.products\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"products_write_admin\\" on public.products\n  for all to authenticated\n  using (private.is_admin(workspace_id))\n  with check (private.is_admin(workspace_id))","create policy \\"lost_reasons_select_member\\" on public.lost_reasons\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"lost_reasons_write_admin\\" on public.lost_reasons\n  for all to authenticated\n  using (private.is_admin(workspace_id))\n  with check (private.is_admin(workspace_id))","-- Operação (leads e satélites): membros leem e escrevem no próprio workspace.\n-- DELETE físico não existe para ninguém: arquivar = deleted_at, remoção real\n-- apenas por RPC administrativa auditada (fases futuras).\ncreate policy \\"leads_select_member\\" on public.leads\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"leads_insert_member\\" on public.leads\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"leads_update_member\\" on public.leads\n  for update to authenticated\n  using (private.is_member(workspace_id))\n  with check (private.is_member(workspace_id))","create policy \\"interests_select_member\\" on public.lead_product_interests\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"interests_insert_member\\" on public.lead_product_interests\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"interests_delete_member\\" on public.lead_product_interests\n  for delete to authenticated using (private.is_member(workspace_id))","-- Histórico de etapas: leitura para membros; escrita apenas via RPC (definer).\ncreate policy \\"history_select_member\\" on public.lead_stage_history\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"tags_select_member\\" on public.tags\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"tags_insert_member\\" on public.tags\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"lead_tags_select_member\\" on public.lead_tags\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"lead_tags_insert_member\\" on public.lead_tags\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"lead_tags_delete_member\\" on public.lead_tags\n  for delete to authenticated using (private.is_member(workspace_id))","-- Notas: admin_only é invisível a quem não é admin, já na policy de SELECT.\ncreate policy \\"notes_select_visibility\\" on public.notes\n  for select to authenticated\n  using (\n    private.is_member(workspace_id)\n    and (visibility = 'team' or private.is_admin(workspace_id))\n  )","create policy \\"notes_insert_visibility\\" on public.notes\n  for insert to authenticated\n  with check (\n    private.is_member(workspace_id)\n    and author_id = (select auth.uid())\n    and (visibility = 'team' or private.is_admin(workspace_id))\n  )","create policy \\"notes_update_author_or_admin\\" on public.notes\n  for update to authenticated\n  using (\n    private.is_member(workspace_id)\n    and (author_id = (select auth.uid()) or private.is_admin(workspace_id))\n  )\n  with check (\n    private.is_member(workspace_id)\n    and (visibility = 'team' or private.is_admin(workspace_id))\n  )","create policy \\"tasks_select_member\\" on public.tasks\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"tasks_insert_member\\" on public.tasks\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"tasks_update_member\\" on public.tasks\n  for update to authenticated\n  using (private.is_member(workspace_id))\n  with check (private.is_member(workspace_id))","create policy \\"activities_select_member\\" on public.activities\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"activities_insert_member\\" on public.activities\n  for insert to authenticated\n  with check (\n    private.is_member(workspace_id)\n    and actor_id = (select auth.uid())\n  )","-- -----------------------------------------------------------------------------\n-- RPCs transacionais\n-- -----------------------------------------------------------------------------\n\n-- Cria o pipeline padrão com as 7 etapas iniciais (onboarding/seed).\ncreate or replace function public.create_default_pipeline(ws_id uuid)\nreturns uuid\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  new_pipeline uuid;\nbegin\n  if not private.is_admin(ws_id) and (select auth.uid()) is not null then\n    raise exception 'apenas administradores' using errcode = '42501';\n  end if;\n\n  insert into public.pipelines (workspace_id, name, is_default)\n  values (ws_id, 'Esteira comercial', true)\n  returning id into new_pipeline;\n\n  insert into public.pipeline_stages (workspace_id, pipeline_id, name, stage_type, position)\n  values\n    (ws_id, new_pipeline, 'Novo lead', 'new', 1000),\n    (ws_id, new_pipeline, 'Qualificação', 'qualification', 2000),\n    (ws_id, new_pipeline, 'Follow-up pré-sessão', 'follow_up_pre_session', 3000),\n    (ws_id, new_pipeline, 'Sessão de alinhamento', 'alignment_session', 4000),\n    (ws_id, new_pipeline, 'Follow-up pós-sessão', 'follow_up_post_session', 5000),\n    (ws_id, new_pipeline, 'Venda realizada', 'won', 6000),\n    (ws_id, new_pipeline, 'Perdido', 'lost', 7000);\n\n  return new_pipeline;\nend;\n$$","-- Move lead de etapa e/ou posição, gravando histórico atomicamente.\ncreate or replace function public.move_lead_stage(\n  p_lead_id uuid,\n  p_stage_id uuid,\n  p_position numeric\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_lead record;\n  v_from_stage record;\n  v_to_stage record;\nbegin\n  select * into v_lead\n  from public.leads\n  where id = p_lead_id and deleted_at is null\n  for update;\n\n  if v_lead is null or not private.is_member(v_lead.workspace_id) then\n    raise exception 'lead não encontrado' using errcode = 'P0002';\n  end if;\n\n  select * into v_to_stage\n  from public.pipeline_stages\n  where id = p_stage_id and archived_at is null;\n\n  if v_to_stage is null\n     or v_to_stage.workspace_id <> v_lead.workspace_id\n     or v_to_stage.pipeline_id <> v_lead.pipeline_id then\n    raise exception 'etapa inválida para este lead' using errcode = '22023';\n  end if;\n\n  select * into v_from_stage\n  from public.pipeline_stages\n  where id = v_lead.stage_id;\n\n  perform set_config('app.allow_stage_move', '1', true);\n\n  update public.leads\n  set stage_id = p_stage_id, position = p_position\n  where id = p_lead_id;\n\n  perform set_config('app.allow_stage_move', '', true);\n\n  if v_lead.stage_id <> p_stage_id then\n    insert into public.lead_stage_history\n      (workspace_id, lead_id, from_stage_id, to_stage_id,\n       from_stage_type, to_stage_type, actor_id)\n    values\n      (v_lead.workspace_id, p_lead_id, v_lead.stage_id, p_stage_id,\n       v_from_stage.stage_type, v_to_stage.stage_type, (select auth.uid()));\n\n    insert into public.activities (workspace_id, lead_id, type, content, meta, actor_id)\n    values (\n      v_lead.workspace_id, p_lead_id, 'stage_change',\n      v_from_stage.name || ' → ' || v_to_stage.name,\n      jsonb_build_object('from_stage_type', v_from_stage.stage_type,\n                         'to_stage_type', v_to_stage.stage_type),\n      (select auth.uid())\n    );\n  end if;\nend;\n$$","-- Marca lead como perdido: exige motivo, move para a etapa \\"lost\\" do pipeline.\ncreate or replace function public.mark_lead_lost(\n  p_lead_id uuid,\n  p_lost_reason_id uuid,\n  p_note text default null\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_lead record;\n  v_lost_stage record;\nbegin\n  select * into v_lead\n  from public.leads\n  where id = p_lead_id and deleted_at is null\n  for update;\n\n  if v_lead is null or not private.is_member(v_lead.workspace_id) then\n    raise exception 'lead não encontrado' using errcode = 'P0002';\n  end if;\n\n  if p_lost_reason_id is null or not exists (\n    select 1 from public.lost_reasons\n    where id = p_lost_reason_id and workspace_id = v_lead.workspace_id\n  ) then\n    raise exception 'motivo de perda obrigatório' using errcode = '22023';\n  end if;\n\n  select * into v_lost_stage\n  from public.pipeline_stages\n  where pipeline_id = v_lead.pipeline_id\n    and stage_type = 'lost'\n    and archived_at is null\n  order by position\n  limit 1;\n\n  if v_lost_stage is null then\n    raise exception 'o pipeline não possui etapa de perda' using errcode = '22023';\n  end if;\n\n  update public.leads\n  set lost_reason_id = p_lost_reason_id,\n      lost_note = p_note,\n      lost_at = now()\n  where id = p_lead_id;\n\n  perform public.move_lead_stage(p_lead_id, v_lost_stage.id, 0);\n\n  perform private.log_audit(\n    v_lead.workspace_id, 'lead_lost', 'lead', p_lead_id::text,\n    jsonb_build_object('lost_reason_id', p_lost_reason_id)\n  );\nend;\n$$","-- Reativa lead perdido preservando histórico.\ncreate or replace function public.reactivate_lead(\n  p_lead_id uuid,\n  p_stage_id uuid\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_lead record;\nbegin\n  select * into v_lead\n  from public.leads\n  where id = p_lead_id and deleted_at is null\n  for update;\n\n  if v_lead is null or not private.is_member(v_lead.workspace_id) then\n    raise exception 'lead não encontrado' using errcode = 'P0002';\n  end if;\n\n  update public.leads\n  set lost_reason_id = null,\n      lost_note = null,\n      lost_at = null,\n      reactivated_count = reactivated_count + 1\n  where id = p_lead_id;\n\n  perform public.move_lead_stage(p_lead_id, p_stage_id, 0);\n\n  perform private.log_audit(\n    v_lead.workspace_id, 'lead_reactivated', 'lead', p_lead_id::text\n  );\nend;\n$$","-- Exclui etapa migrando os leads para a etapa de destino (admin).\ncreate or replace function public.delete_stage_migrating_leads(\n  p_stage_id uuid,\n  p_target_stage_id uuid\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_stage record;\n  v_target record;\n  v_lead record;\nbegin\n  select * into v_stage from public.pipeline_stages where id = p_stage_id;\n\n  if v_stage is null or not private.is_admin(v_stage.workspace_id) then\n    raise exception 'operação não permitida' using errcode = '42501';\n  end if;\n\n  if exists (\n    select 1 from public.leads\n    where stage_id = p_stage_id and deleted_at is null\n  ) then\n    select * into v_target\n    from public.pipeline_stages\n    where id = p_target_stage_id and archived_at is null;\n\n    if v_target is null\n       or v_target.pipeline_id <> v_stage.pipeline_id\n       or v_target.id = v_stage.id then\n      raise exception 'escolha uma etapa de destino válida para os leads'\n        using errcode = '22023';\n    end if;\n\n    for v_lead in\n      select id from public.leads\n      where stage_id = p_stage_id and deleted_at is null\n    loop\n      perform public.move_lead_stage(v_lead.id, p_target_stage_id, 0);\n    end loop;\n  end if;\n\n  delete from public.pipeline_stages where id = p_stage_id;\n\n  perform private.log_audit(\n    v_stage.workspace_id, 'stage_deleted', 'pipeline_stage', p_stage_id::text,\n    jsonb_build_object('name', v_stage.name, 'stage_type', v_stage.stage_type,\n                       'target_stage_id', p_target_stage_id)\n  );\nend;\n$$","-- Mescla duplicados (admin): move satélites para o principal, completa campos\n-- vazios e arquiva o duplicado. Transacional e auditada.\ncreate or replace function public.merge_leads(\n  p_primary_id uuid,\n  p_duplicate_id uuid\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_primary record;\n  v_duplicate record;\nbegin\n  if p_primary_id = p_duplicate_id then\n    raise exception 'os leads precisam ser diferentes' using errcode = '22023';\n  end if;\n\n  select * into v_primary\n  from public.leads where id = p_primary_id and deleted_at is null\n  for update;\n  select * into v_duplicate\n  from public.leads where id = p_duplicate_id and deleted_at is null\n  for update;\n\n  if v_primary is null or v_duplicate is null\n     or v_primary.workspace_id <> v_duplicate.workspace_id\n     or not private.is_admin(v_primary.workspace_id) then\n    raise exception 'operação não permitida' using errcode = '42501';\n  end if;\n\n  update public.notes set lead_id = p_primary_id where lead_id = p_duplicate_id;\n  update public.tasks set lead_id = p_primary_id where lead_id = p_duplicate_id;\n  update public.activities set lead_id = p_primary_id where lead_id = p_duplicate_id;\n  update public.lead_stage_history set lead_id = p_primary_id where lead_id = p_duplicate_id;\n\n  insert into public.lead_product_interests (workspace_id, lead_id, product_id)\n  select workspace_id, p_primary_id, product_id\n  from public.lead_product_interests\n  where lead_id = p_duplicate_id\n  on conflict (lead_id, product_id) do nothing;\n  delete from public.lead_product_interests where lead_id = p_duplicate_id;\n\n  insert into public.lead_tags (workspace_id, lead_id, tag_id)\n  select workspace_id, p_primary_id, tag_id\n  from public.lead_tags\n  where lead_id = p_duplicate_id\n  on conflict (lead_id, tag_id) do nothing;\n  delete from public.lead_tags where lead_id = p_duplicate_id;\n\n  update public.leads\n  set phone = coalesce(v_primary.phone, v_duplicate.phone),\n      email = coalesce(v_primary.email, v_duplicate.email),\n      social_name = coalesce(v_primary.social_name, v_duplicate.social_name),\n      city = coalesce(v_primary.city, v_duplicate.city),\n      state = coalesce(v_primary.state, v_duplicate.state),\n      contact_preference = coalesce(v_primary.contact_preference, v_duplicate.contact_preference),\n      utm_source = coalesce(v_primary.utm_source, v_duplicate.utm_source),\n      utm_medium = coalesce(v_primary.utm_medium, v_duplicate.utm_medium),\n      utm_campaign = coalesce(v_primary.utm_campaign, v_duplicate.utm_campaign),\n      utm_content = coalesce(v_primary.utm_content, v_duplicate.utm_content),\n      utm_term = coalesce(v_primary.utm_term, v_duplicate.utm_term),\n      potential_value = coalesce(v_primary.potential_value, v_duplicate.potential_value),\n      owner_id = coalesce(v_primary.owner_id, v_duplicate.owner_id),\n      first_contact_at = least(\n        coalesce(v_primary.first_contact_at, v_duplicate.first_contact_at),\n        coalesce(v_duplicate.first_contact_at, v_primary.first_contact_at)\n      ),\n      engaged_at = least(\n        coalesce(v_primary.engaged_at, v_duplicate.engaged_at),\n        coalesce(v_duplicate.engaged_at, v_primary.engaged_at)\n      )\n  where id = p_primary_id;\n\n  update public.leads\n  set deleted_at = now()\n  where id = p_duplicate_id;\n\n  insert into public.activities (workspace_id, lead_id, type, content, actor_id)\n  values (v_primary.workspace_id, p_primary_id, 'system',\n          'Lead mesclado com registro duplicado', (select auth.uid()));\n\n  perform private.log_audit(\n    v_primary.workspace_id, 'lead_merged', 'lead', p_primary_id::text,\n    jsonb_build_object('duplicate_id', p_duplicate_id)\n  );\nend;\n$$","-- -----------------------------------------------------------------------------\n-- Grants\n-- -----------------------------------------------------------------------------\n\n-- Tempo real do Kanban/lista: mudanças em leads são transmitidas via Realtime\n-- (respeitando RLS).\nalter publication supabase_realtime add table public.leads","grant execute on function public.create_default_pipeline(uuid) to authenticated","grant execute on function public.move_lead_stage(uuid, uuid, numeric) to authenticated","grant execute on function public.mark_lead_lost(uuid, uuid, text) to authenticated","grant execute on function public.reactivate_lead(uuid, uuid) to authenticated","grant execute on function public.delete_stage_migrating_leads(uuid, uuid) to authenticated","grant execute on function public.merge_leads(uuid, uuid) to authenticated"}	crm_core
20260813120001	{"-- =============================================================================\n-- Fase 3 — Processo comercial: agendamentos com estados, oportunidades/vendas\n-- e conexões de calendário (Google) com tokens protegidos.\n-- =============================================================================\n\n-- -----------------------------------------------------------------------------\n-- Tipos\n-- -----------------------------------------------------------------------------\n\ncreate type public.appointment_status as enum (\n  'scheduled',\n  'completed',\n  'cancelled',\n  'no_show'\n)","create type public.opportunity_status as enum ('open', 'won', 'lost')","create type public.sync_status as enum ('pending', 'synced', 'error')","alter type public.audit_action add value if not exists 'sale_registered'","alter type public.audit_action add value if not exists 'opportunity_lost'","alter type public.audit_action add value if not exists 'calendar_connected'","alter type public.audit_action add value if not exists 'calendar_disconnected'","-- -----------------------------------------------------------------------------\n-- Tabelas\n-- -----------------------------------------------------------------------------\n\ncreate table public.appointments (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  title text not null default 'Sessão de alinhamento',\n  starts_at timestamptz not null,\n  ends_at timestamptz not null,\n  status public.appointment_status not null default 'scheduled',\n  location text,\n  description text,\n  meet_link text,\n  -- Sincronização com calendário externo (nulos quando não conectado)\n  calendar_event_id text,\n  calendar_sync_status public.sync_status,\n  calendar_sync_error text,\n  created_by uuid references auth.users (id),\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  deleted_at timestamptz,\n  constraint appointments_period check (ends_at > starts_at)\n)","create index appointments_workspace_time_idx\n  on public.appointments (workspace_id, starts_at)\n  where deleted_at is null","create index appointments_lead_idx on public.appointments (lead_id)","create table public.opportunities (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  product_id uuid not null references public.products (id),\n  status public.opportunity_status not null default 'open',\n  potential_value numeric(12, 2) check (potential_value is null or potential_value >= 0),\n  sold_value numeric(12, 2) check (sold_value is null or sold_value >= 0),\n  payment_method text,\n  closed_at timestamptz,\n  lost_reason_id uuid references public.lost_reasons (id) on delete set null,\n  notes text,\n  owner_id uuid references auth.users (id) on delete set null,\n  created_by uuid references auth.users (id),\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  deleted_at timestamptz\n)","create index opportunities_workspace_status_idx\n  on public.opportunities (workspace_id, status)\n  where deleted_at is null","create index opportunities_lead_idx on public.opportunities (lead_id)","create index opportunities_closed_idx\n  on public.opportunities (workspace_id, closed_at)","create table public.calendar_connections (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  user_id uuid not null references auth.users (id) on delete cascade,\n  provider text not null default 'google',\n  account_email text,\n  calendar_id text,\n  calendar_name text,\n  status text not null default 'awaiting_config',\n  -- Tokens cifrados (AES-GCM na aplicação). Colunas SEM privilégio de SELECT\n  -- para \\"authenticated\\": apenas o servidor (service_role) lê.\n  access_token_enc text,\n  refresh_token_enc text,\n  token_expires_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  unique (workspace_id, provider, user_id)\n)","create table public.calendar_sync_events (\n  id bigint generated always as identity primary key,\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  appointment_id uuid references public.appointments (id) on delete cascade,\n  direction text not null default 'outbound',\n  external_event_id text,\n  status public.sync_status not null default 'pending',\n  error text,\n  created_at timestamptz not null default now()\n)","create index calendar_sync_events_workspace_idx\n  on public.calendar_sync_events (workspace_id, created_at desc)","-- updated_at\ncreate trigger set_updated_at before update on public.appointments\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.opportunities\n  for each row execute function private.set_updated_at()","create trigger set_updated_at before update on public.calendar_connections\n  for each row execute function private.set_updated_at()","-- -----------------------------------------------------------------------------\n-- RLS\n-- -----------------------------------------------------------------------------\n\nalter table public.appointments enable row level security","alter table public.opportunities enable row level security","alter table public.calendar_connections enable row level security","alter table public.calendar_sync_events enable row level security","create policy \\"appointments_select_member\\" on public.appointments\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"appointments_insert_member\\" on public.appointments\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"appointments_update_member\\" on public.appointments\n  for update to authenticated\n  using (private.is_member(workspace_id))\n  with check (private.is_member(workspace_id))","create policy \\"opportunities_select_member\\" on public.opportunities\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"opportunities_insert_member\\" on public.opportunities\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"opportunities_update_member\\" on public.opportunities\n  for update to authenticated\n  using (private.is_member(workspace_id))\n  with check (private.is_member(workspace_id))","-- Conexões de calendário: apenas admins veem (e nunca as colunas de token).\ncreate policy \\"calendar_connections_select_admin\\" on public.calendar_connections\n  for select to authenticated using (private.is_admin(workspace_id))","create policy \\"calendar_sync_events_select_admin\\" on public.calendar_sync_events\n  for select to authenticated using (private.is_admin(workspace_id))","-- Privilégio de coluna: authenticated não consegue ler tokens mesmo com RLS ok.\nrevoke all on public.calendar_connections from authenticated","grant select (\n  id, workspace_id, user_id, provider, account_email,\n  calendar_id, calendar_name, status, token_expires_at, created_at, updated_at\n) on public.calendar_connections to authenticated","revoke insert, update, delete on public.calendar_sync_events from authenticated","-- -----------------------------------------------------------------------------\n-- RPCs\n-- -----------------------------------------------------------------------------\n\n-- Registra venda: fecha (ou cria) a oportunidade como ganha e move o lead\n-- para a etapa \\"won\\" na mesma transação.\ncreate or replace function public.register_sale(\n  p_lead_id uuid,\n  p_product_id uuid,\n  p_sold_value numeric,\n  p_payment_method text default null,\n  p_opportunity_id uuid default null\n)\nreturns uuid\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_lead record;\n  v_won_stage record;\n  v_opportunity_id uuid;\nbegin\n  select * into v_lead\n  from public.leads\n  where id = p_lead_id and deleted_at is null\n  for update;\n\n  if v_lead is null or not private.is_member(v_lead.workspace_id) then\n    raise exception 'lead não encontrado' using errcode = 'P0002';\n  end if;\n\n  if p_sold_value is null or p_sold_value < 0 then\n    raise exception 'valor vendido inválido' using errcode = '22023';\n  end if;\n\n  if not exists (\n    select 1 from public.products\n    where id = p_product_id and workspace_id = v_lead.workspace_id\n  ) then\n    raise exception 'produto inválido' using errcode = '22023';\n  end if;\n\n  if p_opportunity_id is not null then\n    update public.opportunities\n    set status = 'won',\n        sold_value = p_sold_value,\n        payment_method = coalesce(p_payment_method, payment_method),\n        product_id = p_product_id,\n        closed_at = now()\n    where id = p_opportunity_id\n      and lead_id = p_lead_id\n      and workspace_id = v_lead.workspace_id\n      and status = 'open'\n    returning id into v_opportunity_id;\n\n    if v_opportunity_id is null then\n      raise exception 'oportunidade inválida ou já fechada' using errcode = '22023';\n    end if;\n  else\n    insert into public.opportunities\n      (workspace_id, lead_id, product_id, status, sold_value, payment_method,\n       closed_at, owner_id, created_by)\n    values\n      (v_lead.workspace_id, p_lead_id, p_product_id, 'won', p_sold_value,\n       p_payment_method, now(), v_lead.owner_id, (select auth.uid()))\n    returning id into v_opportunity_id;\n  end if;\n\n  -- Move para a etapa de venda, se existir e o lead ainda não estiver nela.\n  -- Atenção: `record IS NOT NULL` em PL/pgSQL só é verdadeiro quando TODAS as\n  -- colunas são não-nulas (archived_at é nulo nas etapas ativas), por isso o\n  -- teste é feito sobre a coluna id.\n  select * into v_won_stage\n  from public.pipeline_stages\n  where pipeline_id = v_lead.pipeline_id\n    and stage_type = 'won'\n    and archived_at is null\n  order by position\n  limit 1;\n\n  if v_won_stage.id is not null and v_lead.stage_id <> v_won_stage.id then\n    perform public.move_lead_stage(p_lead_id, v_won_stage.id, 0);\n  end if;\n\n  insert into public.activities (workspace_id, lead_id, type, content, actor_id)\n  values (v_lead.workspace_id, p_lead_id, 'system',\n          'Venda registrada — R$ ' || to_char(p_sold_value, 'FM999G999G990D00'),\n          (select auth.uid()));\n\n  perform private.log_audit(\n    v_lead.workspace_id, 'sale_registered', 'opportunity', v_opportunity_id::text,\n    jsonb_build_object('sold_value', p_sold_value, 'product_id', p_product_id)\n  );\n\n  return v_opportunity_id;\nend;\n$$","-- Marca oportunidade como perdida (o lead pode continuar ativo na esteira).\ncreate or replace function public.mark_opportunity_lost(\n  p_opportunity_id uuid,\n  p_lost_reason_id uuid default null,\n  p_note text default null\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_opp record;\nbegin\n  select * into v_opp\n  from public.opportunities\n  where id = p_opportunity_id and deleted_at is null\n  for update;\n\n  if v_opp is null or not private.is_member(v_opp.workspace_id) then\n    raise exception 'oportunidade não encontrada' using errcode = 'P0002';\n  end if;\n\n  if v_opp.status <> 'open' then\n    raise exception 'a oportunidade já está fechada' using errcode = '22023';\n  end if;\n\n  update public.opportunities\n  set status = 'lost',\n      lost_reason_id = p_lost_reason_id,\n      notes = coalesce(p_note, notes),\n      closed_at = now()\n  where id = p_opportunity_id;\n\n  perform private.log_audit(\n    v_opp.workspace_id, 'opportunity_lost', 'opportunity', p_opportunity_id::text,\n    jsonb_build_object('lost_reason_id', p_lost_reason_id)\n  );\nend;\n$$","-- mark_lead_lost agora também fecha oportunidades abertas do lead.\ncreate or replace function public.mark_lead_lost(\n  p_lead_id uuid,\n  p_lost_reason_id uuid,\n  p_note text default null\n)\nreturns void\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_lead record;\n  v_lost_stage record;\nbegin\n  select * into v_lead\n  from public.leads\n  where id = p_lead_id and deleted_at is null\n  for update;\n\n  if v_lead is null or not private.is_member(v_lead.workspace_id) then\n    raise exception 'lead não encontrado' using errcode = 'P0002';\n  end if;\n\n  if p_lost_reason_id is null or not exists (\n    select 1 from public.lost_reasons\n    where id = p_lost_reason_id and workspace_id = v_lead.workspace_id\n  ) then\n    raise exception 'motivo de perda obrigatório' using errcode = '22023';\n  end if;\n\n  select * into v_lost_stage\n  from public.pipeline_stages\n  where pipeline_id = v_lead.pipeline_id\n    and stage_type = 'lost'\n    and archived_at is null\n  order by position\n  limit 1;\n\n  if v_lost_stage is null then\n    raise exception 'o pipeline não possui etapa de perda' using errcode = '22023';\n  end if;\n\n  update public.leads\n  set lost_reason_id = p_lost_reason_id,\n      lost_note = p_note,\n      lost_at = now()\n  where id = p_lead_id;\n\n  update public.opportunities\n  set status = 'lost',\n      lost_reason_id = p_lost_reason_id,\n      closed_at = now()\n  where lead_id = p_lead_id\n    and status = 'open'\n    and deleted_at is null;\n\n  perform public.move_lead_stage(p_lead_id, v_lost_stage.id, 0);\n\n  perform private.log_audit(\n    v_lead.workspace_id, 'lead_lost', 'lead', p_lead_id::text,\n    jsonb_build_object('lost_reason_id', p_lost_reason_id)\n  );\nend;\n$$","grant execute on function public.register_sale(uuid, uuid, numeric, text, uuid) to authenticated","grant execute on function public.mark_opportunity_lost(uuid, uuid, text) to authenticated"}	commercial
20260813180001	{"-- =============================================================================\n-- Fase 4 — Captação e conversas: formulário público, webhooks idempotentes,\n-- conversas/mensagens de WhatsApp e Instagram, fila de saída (outbox).\n-- =============================================================================\n\ncreate type public.channel_provider as enum (\n  'whatsapp',\n  'instagram',\n  'form',\n  'meta_lead_ads'\n)","create type public.message_direction as enum ('inbound', 'outbound')","create type public.message_status as enum (\n  'pending',\n  'sent',\n  'delivered',\n  'read',\n  'failed'\n)","create type public.webhook_status as enum ('received', 'processed', 'failed')","create type public.outbox_status as enum ('pending', 'sent', 'failed')","alter type public.audit_action add value if not exists 'channel_connected'","alter type public.audit_action add value if not exists 'channel_disconnected'","alter type public.audit_action add value if not exists 'form_endpoint_changed'","-- -----------------------------------------------------------------------------\n-- Conexões de canal (tokens protegidos como em calendar_connections)\n-- -----------------------------------------------------------------------------\n\ncreate table public.channel_connections (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  provider public.channel_provider not null,\n  status text not null default 'awaiting_config',\n  display_name text,\n  -- Identificadores públicos da conta (não são segredos)\n  external_account_id text,\n  phone_number_id text,\n  waba_id text,\n  instagram_id text,\n  -- Segredos cifrados na aplicação (AES-256-GCM)\n  access_token_enc text,\n  app_secret_enc text,\n  verify_token_enc text,\n  last_event_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  unique (workspace_id, provider)\n)","create trigger set_updated_at before update on public.channel_connections\n  for each row execute function private.set_updated_at()","-- -----------------------------------------------------------------------------\n-- Identidades externas: chave da associação automática lead ↔ conversa\n-- -----------------------------------------------------------------------------\n\ncreate table public.external_identities (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid not null references public.leads (id) on delete cascade,\n  provider public.channel_provider not null,\n  external_id text not null,\n  display_name text,\n  created_at timestamptz not null default now(),\n  unique (workspace_id, provider, external_id)\n)","create index external_identities_lead_idx on public.external_identities (lead_id)","-- -----------------------------------------------------------------------------\n-- Conversas e mensagens\n-- -----------------------------------------------------------------------------\n\ncreate table public.conversations (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  lead_id uuid references public.leads (id) on delete set null,\n  provider public.channel_provider not null,\n  external_conversation_id text not null,\n  -- Janela de atendimento (WhatsApp: 24h após a última mensagem do contato)\n  last_inbound_at timestamptz,\n  last_message_at timestamptz,\n  last_message_preview text,\n  unread_count integer not null default 0,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now(),\n  unique (workspace_id, provider, external_conversation_id)\n)","create index conversations_workspace_recent_idx\n  on public.conversations (workspace_id, last_message_at desc)","create index conversations_lead_idx on public.conversations (lead_id)","create trigger set_updated_at before update on public.conversations\n  for each row execute function private.set_updated_at()","create table public.conversation_participants (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  conversation_id uuid not null references public.conversations (id) on delete cascade,\n  external_id text not null,\n  display_name text,\n  is_self boolean not null default false,\n  created_at timestamptz not null default now(),\n  unique (conversation_id, external_id)\n)","create table public.messages (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  conversation_id uuid not null references public.conversations (id) on delete cascade,\n  provider public.channel_provider not null,\n  -- Idempotência: o mesmo id externo nunca gera duas mensagens no workspace\n  external_message_id text,\n  direction public.message_direction not null,\n  status public.message_status not null default 'sent',\n  sender_external_id text,\n  body text,\n  media_type text,\n  media_url text,\n  sent_by uuid references auth.users (id),\n  error text,\n  sent_at timestamptz not null default now(),\n  created_at timestamptz not null default now(),\n  unique (workspace_id, provider, external_message_id)\n)","create index messages_conversation_idx\n  on public.messages (conversation_id, sent_at desc)","create table public.message_attachments (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  message_id uuid not null references public.messages (id) on delete cascade,\n  media_type text not null,\n  storage_path text,\n  external_url text,\n  byte_size integer,\n  created_at timestamptz not null default now()\n)","-- -----------------------------------------------------------------------------\n-- Webhooks (entrada) e outbox (saída)\n-- -----------------------------------------------------------------------------\n\ncreate table public.webhook_events (\n  id bigint generated always as identity primary key,\n  workspace_id uuid references public.workspaces (id) on delete cascade,\n  provider public.channel_provider not null,\n  external_event_id text not null,\n  status public.webhook_status not null default 'received',\n  payload jsonb not null,\n  error text,\n  received_at timestamptz not null default now(),\n  processed_at timestamptz,\n  -- Idempotência forte: provedor + workspace + id do evento externo\n  unique (provider, workspace_id, external_event_id)\n)","create index webhook_events_recent_idx\n  on public.webhook_events (workspace_id, received_at desc)","create table public.outbox_messages (\n  id bigint generated always as identity primary key,\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  message_id uuid references public.messages (id) on delete cascade,\n  provider public.channel_provider not null,\n  payload jsonb not null,\n  status public.outbox_status not null default 'pending',\n  attempts integer not null default 0,\n  next_retry_at timestamptz not null default now(),\n  last_error text,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create index outbox_pending_idx on public.outbox_messages (status, next_retry_at)\n  where status = 'pending'","create trigger set_updated_at before update on public.outbox_messages\n  for each row execute function private.set_updated_at()","-- -----------------------------------------------------------------------------\n-- Formulários públicos\n-- -----------------------------------------------------------------------------\n\ncreate table public.form_endpoints (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  slug text not null unique,\n  name text not null default 'Formulário de contato',\n  headline text,\n  description text,\n  pipeline_id uuid references public.pipelines (id) on delete set null,\n  product_id uuid references public.products (id) on delete set null,\n  owner_id uuid references auth.users (id) on delete set null,\n  success_message text,\n  is_active boolean not null default true,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)","create trigger set_updated_at before update on public.form_endpoints\n  for each row execute function private.set_updated_at()","create table public.form_submissions (\n  id uuid primary key default gen_random_uuid(),\n  workspace_id uuid not null references public.workspaces (id) on delete cascade,\n  form_endpoint_id uuid not null references public.form_endpoints (id) on delete cascade,\n  lead_id uuid references public.leads (id) on delete set null,\n  payload jsonb not null,\n  -- Idempotência do formulário: mesmo conteúdo na mesma janela = 1 lead\n  dedupe_hash text not null,\n  ip_hash text,\n  created_at timestamptz not null default now(),\n  unique (form_endpoint_id, dedupe_hash)\n)","create index form_submissions_workspace_idx\n  on public.form_submissions (workspace_id, created_at desc)","-- -----------------------------------------------------------------------------\n-- RLS\n-- -----------------------------------------------------------------------------\n\nalter table public.channel_connections enable row level security","alter table public.external_identities enable row level security","alter table public.conversations enable row level security","alter table public.conversation_participants enable row level security","alter table public.messages enable row level security","alter table public.message_attachments enable row level security","alter table public.webhook_events enable row level security","alter table public.outbox_messages enable row level security","alter table public.form_endpoints enable row level security","alter table public.form_submissions enable row level security","-- Conexões: só admin lê (e nunca as colunas de segredo — ver grants abaixo).\ncreate policy \\"channel_connections_select_admin\\" on public.channel_connections\n  for select to authenticated using (private.is_admin(workspace_id))","-- Conversas e mensagens: qualquer membro (assistente responde pelo CRM).\ncreate policy \\"external_identities_select_member\\" on public.external_identities\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"external_identities_insert_member\\" on public.external_identities\n  for insert to authenticated with check (private.is_member(workspace_id))","create policy \\"conversations_select_member\\" on public.conversations\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"conversations_update_member\\" on public.conversations\n  for update to authenticated\n  using (private.is_member(workspace_id))\n  with check (private.is_member(workspace_id))","create policy \\"participants_select_member\\" on public.conversation_participants\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"messages_select_member\\" on public.messages\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"attachments_select_member\\" on public.message_attachments\n  for select to authenticated using (private.is_member(workspace_id))","-- Saúde das integrações: apenas admin.\ncreate policy \\"webhook_events_select_admin\\" on public.webhook_events\n  for select to authenticated using (private.is_admin(workspace_id))","create policy \\"outbox_select_admin\\" on public.outbox_messages\n  for select to authenticated using (private.is_admin(workspace_id))","-- Formulários: membros leem; admin configura.\ncreate policy \\"form_endpoints_select_member\\" on public.form_endpoints\n  for select to authenticated using (private.is_member(workspace_id))","create policy \\"form_endpoints_write_admin\\" on public.form_endpoints\n  for all to authenticated\n  using (private.is_admin(workspace_id))\n  with check (private.is_admin(workspace_id))","create policy \\"form_submissions_select_admin\\" on public.form_submissions\n  for select to authenticated using (private.is_admin(workspace_id))","-- Escrita de mensagens/conversas/eventos acontece pelo servidor (service_role)\n-- ou pela RPC send_channel_message: nada de INSERT direto do cliente.\nrevoke insert, update, delete on public.messages from authenticated","revoke insert, delete on public.conversations from authenticated","revoke insert, update, delete on public.webhook_events from authenticated","revoke insert, update, delete on public.outbox_messages from authenticated","revoke insert, update, delete on public.form_submissions from authenticated","revoke insert, update, delete on public.message_attachments from authenticated","revoke insert, update, delete on public.conversation_participants from authenticated","-- Segredos das conexões inacessíveis ao cliente (privilégio de coluna).\nrevoke all on public.channel_connections from authenticated","grant select (\n  id, workspace_id, provider, status, display_name, external_account_id,\n  phone_number_id, waba_id, instagram_id, last_event_at, created_at, updated_at\n) on public.channel_connections to authenticated","-- -----------------------------------------------------------------------------\n-- RPC: ingestão idempotente de mensagem recebida (chamada pelo servidor)\n-- -----------------------------------------------------------------------------\n\ncreate or replace function public.ingest_channel_message(\n  p_workspace_id uuid,\n  p_provider public.channel_provider,\n  p_external_conversation_id text,\n  p_external_message_id text,\n  p_sender_external_id text,\n  p_sender_name text,\n  p_body text,\n  p_sent_at timestamptz default now(),\n  p_media_type text default null,\n  p_media_url text default null\n)\n-- Os nomes de saída levam prefixo `out_` porque colunas de RETURNS TABLE\n-- entram no escopo do PL/pgSQL e tornariam ambíguas as referências a\n-- conversation_id/lead_id dentro de ON CONFLICT e INSERT.\nreturns table (\n  out_message_id uuid,\n  out_conversation_id uuid,\n  out_lead_id uuid,\n  out_created_lead boolean\n)\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_conversation public.conversations;\n  v_lead_id uuid;\n  v_created_lead boolean := false;\n  v_message_id uuid;\n  v_pipeline record;\n  v_stage record;\n  v_channel public.lead_channel;\nbegin\n  -- Mensagem já ingerida? Devolve o registro existente (idempotência).\n  select m.id, m.conversation_id into v_message_id, v_conversation.id\n  from public.messages m\n  where m.workspace_id = p_workspace_id\n    and m.provider = p_provider\n    and m.external_message_id = p_external_message_id\n    and p_external_message_id is not null;\n\n  if v_message_id is not null then\n    select c.lead_id into v_lead_id\n    from public.conversations c where c.id = v_conversation.id;\n    return query select v_message_id, v_conversation.id, v_lead_id, false;\n    return;\n  end if;\n\n  -- Lead associado por identidade externa\n  select ei.lead_id into v_lead_id\n  from public.external_identities ei\n  where ei.workspace_id = p_workspace_id\n    and ei.provider = p_provider\n    and ei.external_id = p_sender_external_id;\n\n  -- Sem correspondência: cria lead mínimo na primeira etapa do pipeline padrão\n  if v_lead_id is null then\n    select p.id into v_pipeline\n    from public.pipelines p\n    where p.workspace_id = p_workspace_id and p.archived_at is null\n    order by p.is_default desc, p.position\n    limit 1;\n\n    if v_pipeline.id is null then\n      raise exception 'workspace sem pipeline configurado' using errcode = '22023';\n    end if;\n\n    select s.id into v_stage\n    from public.pipeline_stages s\n    where s.pipeline_id = v_pipeline.id and s.archived_at is null\n    order by s.position\n    limit 1;\n\n    v_channel := case\n      when p_provider = 'whatsapp' then 'whatsapp'::public.lead_channel\n      when p_provider = 'instagram' then 'instagram'::public.lead_channel\n      else 'manual'::public.lead_channel\n    end;\n\n    insert into public.leads\n      (workspace_id, pipeline_id, stage_id, position, name, channel,\n       phone, source_detail)\n    values\n      (p_workspace_id, v_pipeline.id, v_stage.id, 0,\n       coalesce(nullif(btrim(p_sender_name), ''), 'Contato ' || p_provider::text),\n       v_channel,\n       case when p_provider = 'whatsapp' then p_sender_external_id else null end,\n       'Primeira mensagem recebida por ' || p_provider::text)\n    returning id into v_lead_id;\n\n    v_created_lead := true;\n\n    insert into public.lead_stage_history\n      (workspace_id, lead_id, to_stage_id, to_stage_type)\n    select p_workspace_id, v_lead_id, s.id, s.stage_type\n    from public.pipeline_stages s where s.id = v_stage.id;\n\n    insert into public.external_identities\n      (workspace_id, lead_id, provider, external_id, display_name)\n    values (p_workspace_id, v_lead_id, p_provider, p_sender_external_id, p_sender_name)\n    on conflict (workspace_id, provider, external_id) do nothing;\n  end if;\n\n  -- Conversa (idempotente por id externo)\n  insert into public.conversations\n    (workspace_id, lead_id, provider, external_conversation_id,\n     last_inbound_at, last_message_at, last_message_preview, unread_count)\n  values\n    (p_workspace_id, v_lead_id, p_provider, p_external_conversation_id,\n     p_sent_at, p_sent_at, left(coalesce(p_body, '[mídia]'), 160), 1)\n  on conflict (workspace_id, provider, external_conversation_id) do update\n    set lead_id = coalesce(public.conversations.lead_id, excluded.lead_id),\n        last_inbound_at = excluded.last_inbound_at,\n        last_message_at = excluded.last_message_at,\n        last_message_preview = excluded.last_message_preview,\n        unread_count = public.conversations.unread_count + 1\n  returning * into v_conversation;\n\n  insert into public.conversation_participants\n    (workspace_id, conversation_id, external_id, display_name)\n  values (p_workspace_id, v_conversation.id, p_sender_external_id, p_sender_name)\n  on conflict (conversation_id, external_id) do nothing;\n\n  insert into public.messages\n    (workspace_id, conversation_id, provider, external_message_id, direction,\n     status, sender_external_id, body, media_type, media_url, sent_at)\n  values\n    (p_workspace_id, v_conversation.id, p_provider, p_external_message_id,\n     'inbound', 'delivered', p_sender_external_id, p_body, p_media_type,\n     p_media_url, p_sent_at)\n  returning id into v_message_id;\n\n  -- Primeira resposta do lead marca engajamento (uma única vez, sem pontuação)\n  update public.leads\n  set engaged_at = coalesce(engaged_at, p_sent_at),\n      first_contact_at = coalesce(first_contact_at, p_sent_at)\n  where id = v_lead_id;\n\n  insert into public.activities\n    (workspace_id, lead_id, type, content, meta)\n  values\n    (p_workspace_id, v_lead_id, 'message',\n     left(coalesce(p_body, '[mídia recebida]'), 300),\n     jsonb_build_object('provider', p_provider, 'direction', 'inbound'));\n\n  return query select v_message_id, v_conversation.id, v_lead_id, v_created_lead;\nend;\n$$","-- Envio pelo CRM: grava a mensagem e enfileira no outbox (transacional).\ncreate or replace function public.send_channel_message(\n  p_conversation_id uuid,\n  p_body text\n)\nreturns uuid\nlanguage plpgsql\nsecurity definer\nset search_path = ''\nas $$\ndeclare\n  v_conversation public.conversations;\n  v_message_id uuid;\nbegin\n  select * into v_conversation\n  from public.conversations\n  where id = p_conversation_id;\n\n  if v_conversation.id is null\n     or not private.is_member(v_conversation.workspace_id) then\n    raise exception 'conversa não encontrada' using errcode = 'P0002';\n  end if;\n\n  if p_body is null or btrim(p_body) = '' then\n    raise exception 'mensagem vazia' using errcode = '22023';\n  end if;\n\n  insert into public.messages\n    (workspace_id, conversation_id, provider, direction, status, body, sent_by)\n  values\n    (v_conversation.workspace_id, p_conversation_id, v_conversation.provider,\n     'outbound', 'pending', p_body, (select auth.uid()))\n  returning id into v_message_id;\n\n  insert into public.outbox_messages\n    (workspace_id, message_id, provider, payload)\n  values\n    (v_conversation.workspace_id, v_message_id, v_conversation.provider,\n     jsonb_build_object(\n       'conversation_id', p_conversation_id,\n       'external_conversation_id', v_conversation.external_conversation_id,\n       'body', p_body\n     ));\n\n  update public.conversations\n  set last_message_at = now(),\n      last_message_preview = left(p_body, 160),\n      unread_count = 0\n  where id = p_conversation_id;\n\n  if v_conversation.lead_id is not null then\n    insert into public.activities (workspace_id, lead_id, type, content, meta, actor_id)\n    values (v_conversation.workspace_id, v_conversation.lead_id, 'message',\n            left(p_body, 300),\n            jsonb_build_object('provider', v_conversation.provider,\n                               'direction', 'outbound'),\n            (select auth.uid()));\n  end if;\n\n  return v_message_id;\nend;\n$$","-- Marcar conversa como lida\ncreate or replace function public.mark_conversation_read(p_conversation_id uuid)\nreturns void\nlanguage sql\nsecurity definer\nset search_path = ''\nas $$\n  update public.conversations\n  set unread_count = 0\n  where id = p_conversation_id\n    and private.is_member(workspace_id);\n$$","-- O Postgres concede EXECUTE a PUBLIC por padrão em toda função nova, o que\n-- exporia RPCs internas (ingest_channel_message forjaria mensagens em\n-- qualquer workspace). Revogamos de PUBLIC/anon e mantemos apenas os grants\n-- explícitos a `authenticated`; o default privileges fecha o buraco para as\n-- próximas migrations.\nrevoke execute on all functions in schema public from public, anon","alter default privileges in schema public revoke execute on functions from public","grant execute on function public.send_channel_message(uuid, text) to authenticated","grant execute on function public.mark_conversation_read(uuid) to authenticated","-- get_invitation_public é intencionalmente pública (página de convite).\ngrant execute on function public.get_invitation_public(text) to anon, authenticated","-- ingest_channel_message NÃO é exposta a authenticated: só o servidor a chama.\n\n-- O servidor (webhooks e formulário público) escreve com service_role e\n-- dispara triggers que chamam funções do schema private (normalização de\n-- contato, updated_at). Sem estes grants a escrita falha com 42501.\ngrant usage on schema private to service_role","grant execute on all functions in schema private to service_role","alter default privileges in schema private\n  grant execute on functions to service_role","-- Tempo real do inbox\nalter publication supabase_realtime add table public.messages","alter publication supabase_realtime add table public.conversations"}	channels
20260813210001	{"-- =============================================================================\n-- Fase 5 — Dashboard: funções agregadas executadas no banco.\n--\n-- Todas são `security invoker`: rodam sob a RLS do usuário, então um workspace\n-- nunca soma dados de outro, mesmo que o parâmetro seja adulterado. Nenhuma\n-- agregação acontece no navegador.\n--\n-- Convenções de data de referência (documentadas na UI em cada indicador):\n--   novos leads .......... leads.created_at\n--   engajados ............ leads.engaged_at\n--   sessões agendadas .... appointments.created_at\n--   sessões realizadas ... appointments.starts_at (sessão que ocorreu)\n--   vendas e receita ..... opportunities.closed_at (status = 'won')\n-- =============================================================================\n\n-- Índices de apoio às agregações por período.\ncreate index if not exists leads_engaged_idx\n  on public.leads (workspace_id, engaged_at)\n  where engaged_at is not null and deleted_at is null","create index if not exists appointments_status_time_idx\n  on public.appointments (workspace_id, status, starts_at)\n  where deleted_at is null","create index if not exists opportunities_won_idx\n  on public.opportunities (workspace_id, closed_at)\n  where status = 'won' and deleted_at is null","-- -----------------------------------------------------------------------------\n-- Resumo: cards principais e métricas derivadas\n-- -----------------------------------------------------------------------------\n\ncreate or replace function public.dashboard_summary(\n  p_workspace_id uuid,\n  p_from timestamptz,\n  p_to timestamptz,\n  p_pipeline_id uuid default null,\n  p_product_id uuid default null,\n  p_owner_id uuid default null,\n  p_channel public.lead_channel default null\n)\nreturns jsonb\nlanguage sql\nstable\nsecurity invoker\nset search_path = public\nas $$\nwith\n-- Coorte de leads criados no período (base das taxas de conversão).\ncohort as (\n  select l.*\n  from public.leads l\n  where l.workspace_id = p_workspace_id\n    and l.deleted_at is null\n    and l.created_at >= p_from\n    and l.created_at < p_to\n    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)\n    and (p_owner_id is null or l.owner_id = p_owner_id)\n    and (p_channel is null or l.channel = p_channel)\n    and (\n      p_product_id is null\n      or exists (\n        select 1 from public.lead_product_interests i\n        where i.lead_id = l.id and i.product_id = p_product_id\n      )\n    )\n),\n-- Leads que engajaram dentro do período (independe de quando entraram).\nengaged as (\n  select l.id\n  from public.leads l\n  where l.workspace_id = p_workspace_id\n    and l.deleted_at is null\n    and l.engaged_at >= p_from\n    and l.engaged_at < p_to\n    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)\n    and (p_owner_id is null or l.owner_id = p_owner_id)\n    and (p_channel is null or l.channel = p_channel)\n),\nscheduled as (\n  select a.id, a.lead_id\n  from public.appointments a\n  join public.leads l on l.id = a.lead_id\n  where a.workspace_id = p_workspace_id\n    and a.deleted_at is null\n    and a.created_at >= p_from\n    and a.created_at < p_to\n    and (p_owner_id is null or l.owner_id = p_owner_id)\n    and (p_channel is null or l.channel = p_channel)\n),\ncompleted as (\n  select a.id, a.lead_id\n  from public.appointments a\n  join public.leads l on l.id = a.lead_id\n  where a.workspace_id = p_workspace_id\n    and a.deleted_at is null\n    and a.status = 'completed'\n    and a.starts_at >= p_from\n    and a.starts_at < p_to\n    and (p_owner_id is null or l.owner_id = p_owner_id)\n    and (p_channel is null or l.channel = p_channel)\n),\nwon as (\n  select o.id, o.lead_id, o.sold_value, o.closed_at\n  from public.opportunities o\n  join public.leads l on l.id = o.lead_id\n  where o.workspace_id = p_workspace_id\n    and o.deleted_at is null\n    and o.status = 'won'\n    and o.closed_at >= p_from\n    and o.closed_at < p_to\n    and (p_product_id is null or o.product_id = p_product_id)\n    and (p_owner_id is null or l.owner_id = p_owner_id)\n    and (p_channel is null or l.channel = p_channel)\n),\n-- Denominador da taxa sessão → venda: leads com sessão realizada no período.\ncompleted_leads as (select distinct lead_id from completed),\ncompleted_then_won as (\n  select count(distinct c.lead_id) as total\n  from completed_leads c\n  where exists (\n    select 1 from public.opportunities o\n    where o.lead_id = c.lead_id\n      and o.status = 'won'\n      and o.deleted_at is null\n  )\n),\n-- Leads engajados no período que chegaram a ter sessão realizada (qualquer data).\nengaged_then_session as (\n  select count(distinct e.id) as total\n  from engaged e\n  where exists (\n    select 1 from public.appointments a\n    where a.lead_id = e.id\n      and a.status = 'completed'\n      and a.deleted_at is null\n  )\n),\n-- Leads da coorte que converteram (conversão geral por coorte de entrada).\ncohort_won as (\n  select count(distinct c.id) as total\n  from cohort c\n  where exists (\n    select 1 from public.opportunities o\n    where o.lead_id = c.id\n      and o.status = 'won'\n      and o.deleted_at is null\n  )\n),\n-- Tempos medianos, robustos a casos extremos.\ntimings as (\n  select\n    percentile_cont(0.5) within group (\n      order by extract(epoch from (l.engaged_at - l.created_at)) / 3600\n    ) filter (where l.engaged_at is not null) as median_hours_to_engage,\n    percentile_cont(0.5) within group (\n      order by extract(epoch from (first_appt.created_at - l.created_at)) / 86400\n    ) filter (where first_appt.created_at is not null) as median_days_to_schedule\n  from cohort l\n  left join lateral (\n    select min(a.created_at) as created_at\n    from public.appointments a\n    where a.lead_id = l.id and a.deleted_at is null\n  ) first_appt on true\n),\noverdue as (\n  select count(*) as total\n  from public.tasks t\n  where t.workspace_id = p_workspace_id\n    and t.deleted_at is null\n    and t.completed_at is null\n    and t.due_at < now()\n),\nin_follow_up as (\n  select count(*) as total\n  from public.leads l\n  join public.pipeline_stages s on s.id = l.stage_id\n  where l.workspace_id = p_workspace_id\n    and l.deleted_at is null\n    and s.stage_type in ('follow_up_pre_session', 'follow_up_post_session')\n    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)\n)\nselect jsonb_build_object(\n  'new_leads', (select count(*) from cohort),\n  'engaged_leads', (select count(*) from engaged),\n  'appointments_scheduled', (select count(*) from scheduled),\n  'appointments_completed', (select count(*) from completed),\n  'sales_count', (select count(*) from won),\n  'revenue', coalesce((select sum(sold_value) from won), 0),\n  'average_ticket', case\n    when (select count(*) from won) > 0\n      then coalesce((select sum(sold_value) from won), 0) / (select count(*) from won)\n    else null\n  end,\n  'leads_in_follow_up', (select total from in_follow_up),\n  'overdue_tasks', (select total from overdue),\n  'no_shows', (\n    select count(*) from public.appointments a\n    where a.workspace_id = p_workspace_id and a.deleted_at is null\n      and a.status = 'no_show' and a.starts_at >= p_from and a.starts_at < p_to\n  ),\n  'cancellations', (\n    select count(*) from public.appointments a\n    where a.workspace_id = p_workspace_id and a.deleted_at is null\n      and a.status = 'cancelled' and a.starts_at >= p_from and a.starts_at < p_to\n  ),\n  -- Taxas: null quando o denominador é zero (a UI mostra \\"—\\", nunca 0%).\n  'rate_lead_to_engaged', case\n    when (select count(*) from cohort) > 0\n      then round((select count(*) from engaged)::numeric\n                 / (select count(*) from cohort), 4)\n    else null\n  end,\n  'rate_engaged_to_session', case\n    when (select count(*) from engaged) > 0\n      then round((select total from engaged_then_session)::numeric\n                 / (select count(*) from engaged), 4)\n    else null\n  end,\n  'rate_session_to_sale', case\n    when (select count(*) from completed_leads) > 0\n      then round((select total from completed_then_won)::numeric\n                 / (select count(*) from completed_leads), 4)\n    else null\n  end,\n  'rate_overall', case\n    when (select count(*) from cohort) > 0\n      then round((select total from cohort_won)::numeric\n                 / (select count(*) from cohort), 4)\n    else null\n  end,\n  'median_hours_to_engage',\n    (select round(median_hours_to_engage::numeric, 1) from timings),\n  'median_days_to_schedule',\n    (select round(median_days_to_schedule::numeric, 1) from timings)\n);\n$$","-- -----------------------------------------------------------------------------\n-- Funil: por stage_type, a partir do histórico (não da etapa atual)\n-- -----------------------------------------------------------------------------\n\ncreate or replace function public.dashboard_funnel(\n  p_workspace_id uuid,\n  p_from timestamptz,\n  p_to timestamptz,\n  p_pipeline_id uuid default null,\n  p_owner_id uuid default null,\n  p_channel public.lead_channel default null\n)\nreturns table (stage_type public.stage_type, leads_reached bigint)\nlanguage sql\nstable\nsecurity invoker\nset search_path = public\nas $$\n  -- Coorte: leads criados no período. Um lead conta uma única vez em cada\n  -- estágio que ATINGIU, mesmo que tenha passado por ele várias vezes\n  -- (reativação não duplica).\n  with cohort as (\n    select l.id\n    from public.leads l\n    where l.workspace_id = p_workspace_id\n      and l.deleted_at is null\n      and l.created_at >= p_from\n      and l.created_at < p_to\n      and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)\n      and (p_owner_id is null or l.owner_id = p_owner_id)\n      and (p_channel is null or l.channel = p_channel)\n  ),\n  reached as (\n    select distinct h.lead_id, h.to_stage_type as st\n    from public.lead_stage_history h\n    join cohort c on c.id = h.lead_id\n    where h.workspace_id = p_workspace_id\n  )\n  select st as stage_type, count(distinct lead_id) as leads_reached\n  from reached\n  group by st;\n$$","-- -----------------------------------------------------------------------------\n-- Série temporal: leads, sessões, vendas e receita por dia\n-- -----------------------------------------------------------------------------\n\ncreate or replace function public.dashboard_timeseries(\n  p_workspace_id uuid,\n  p_from timestamptz,\n  p_to timestamptz,\n  p_pipeline_id uuid default null\n)\nreturns table (\n  day date,\n  new_leads bigint,\n  sessions_completed bigint,\n  sales bigint,\n  revenue numeric\n)\nlanguage sql\nstable\nsecurity invoker\nset search_path = public\nas $$\n  with days as (\n    select generate_series(p_from::date, (p_to - interval '1 day')::date, '1 day')::date as day\n  )\n  select\n    d.day,\n    coalesce(l.total, 0) as new_leads,\n    coalesce(a.total, 0) as sessions_completed,\n    coalesce(o.total, 0) as sales,\n    coalesce(o.revenue, 0) as revenue\n  from days d\n  left join (\n    select created_at::date as day, count(*) as total\n    from public.leads\n    where workspace_id = p_workspace_id and deleted_at is null\n      and created_at >= p_from and created_at < p_to\n      and (p_pipeline_id is null or pipeline_id = p_pipeline_id)\n    group by 1\n  ) l on l.day = d.day\n  left join (\n    select starts_at::date as day, count(*) as total\n    from public.appointments\n    where workspace_id = p_workspace_id and deleted_at is null\n      and status = 'completed'\n      and starts_at >= p_from and starts_at < p_to\n    group by 1\n  ) a on a.day = d.day\n  left join (\n    select closed_at::date as day, count(*) as total, sum(sold_value) as revenue\n    from public.opportunities\n    where workspace_id = p_workspace_id and deleted_at is null\n      and status = 'won'\n      and closed_at >= p_from and closed_at < p_to\n    group by 1\n  ) o on o.day = d.day\n  order by d.day;\n$$","-- -----------------------------------------------------------------------------\n-- Recortes: origem, produto, responsável e motivo de perda\n-- -----------------------------------------------------------------------------\n\ncreate or replace function public.dashboard_breakdowns(\n  p_workspace_id uuid,\n  p_from timestamptz,\n  p_to timestamptz,\n  p_pipeline_id uuid default null\n)\nreturns jsonb\nlanguage sql\nstable\nsecurity invoker\nset search_path = public\nas $$\nwith cohort as (\n  select l.*\n  from public.leads l\n  where l.workspace_id = p_workspace_id\n    and l.deleted_at is null\n    and l.created_at >= p_from\n    and l.created_at < p_to\n    and (p_pipeline_id is null or l.pipeline_id = p_pipeline_id)\n),\nby_channel as (\n  select\n    c.channel::text as key,\n    count(*) as leads,\n    count(*) filter (\n      where exists (\n        select 1 from public.opportunities o\n        where o.lead_id = c.id and o.status = 'won' and o.deleted_at is null\n      )\n    ) as conversions\n  from cohort c\n  group by c.channel\n),\n-- Receita por produto usa as oportunidades ganhas do período (não a coorte),\n-- porque a venda pode fechar depois da janela em que o lead entrou.\nby_product as (\n  select\n    p.name as key,\n    count(o.id) as sales,\n    coalesce(sum(o.sold_value), 0) as revenue\n  from public.opportunities o\n  join public.products p on p.id = o.product_id\n  where o.workspace_id = p_workspace_id\n    and o.deleted_at is null\n    and o.status = 'won'\n    and o.closed_at >= p_from\n    and o.closed_at < p_to\n  group by p.name\n),\nby_owner as (\n  select\n    coalesce(pr.full_name, 'Sem responsável') as key,\n    count(distinct c.id) as leads,\n    count(distinct o.id) as sales\n  from cohort c\n  left join public.profiles pr on pr.id = c.owner_id\n  left join public.opportunities o\n    on o.lead_id = c.id and o.status = 'won' and o.deleted_at is null\n  group by 1\n),\nby_lost_reason as (\n  select coalesce(r.label, 'Sem motivo informado') as key, count(*) as total\n  from public.leads l\n  left join public.lost_reasons r on r.id = l.lost_reason_id\n  where l.workspace_id = p_workspace_id\n    and l.deleted_at is null\n    and l.lost_at >= p_from\n    and l.lost_at < p_to\n  group by 1\n)\nselect jsonb_build_object(\n  'by_channel', coalesce((select jsonb_agg(to_jsonb(b) order by b.leads desc) from by_channel b), '[]'::jsonb),\n  'by_product', coalesce((select jsonb_agg(to_jsonb(b) order by b.revenue desc) from by_product b), '[]'::jsonb),\n  'by_owner', coalesce((select jsonb_agg(to_jsonb(b) order by b.leads desc) from by_owner b), '[]'::jsonb),\n  'by_lost_reason', coalesce((select jsonb_agg(to_jsonb(b) order by b.total desc) from by_lost_reason b), '[]'::jsonb)\n);\n$$","grant execute on function public.dashboard_summary(\n  uuid, timestamptz, timestamptz, uuid, uuid, uuid, public.lead_channel\n) to authenticated","grant execute on function public.dashboard_funnel(\n  uuid, timestamptz, timestamptz, uuid, uuid, public.lead_channel\n) to authenticated","grant execute on function public.dashboard_timeseries(\n  uuid, timestamptz, timestamptz, uuid\n) to authenticated","grant execute on function public.dashboard_breakdowns(\n  uuid, timestamptz, timestamptz, uuid\n) to authenticated"}	dashboard
20260813230001	\N	\N
20260814000001	\N	\N
20260814100001	\N	\N
20260814110001	\N	\N
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
supabase/seed.sql	aecdff260329c2235a39ca87d4997a9903842e99d241e11bbe8a4160da10e2e5
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 317, true);


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 385, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 131, true);


--
-- Name: calendar_sync_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_sync_events_id_seq', 1, false);


--
-- Name: lead_stage_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lead_stage_history_id_seq', 700, true);


--
-- Name: outbox_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.outbox_messages_id_seq', 27, true);


--
-- Name: webhook_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.webhook_events_id_seq', 210, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_realtime_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 121, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: calendar_connections calendar_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_connections
    ADD CONSTRAINT calendar_connections_pkey PRIMARY KEY (id);


--
-- Name: calendar_connections calendar_connections_workspace_id_provider_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_connections
    ADD CONSTRAINT calendar_connections_workspace_id_provider_user_id_key UNIQUE (workspace_id, provider, user_id);


--
-- Name: calendar_sync_events calendar_sync_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_sync_events
    ADD CONSTRAINT calendar_sync_events_pkey PRIMARY KEY (id);


--
-- Name: channel_connections channel_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_connections
    ADD CONSTRAINT channel_connections_pkey PRIMARY KEY (id);


--
-- Name: channel_connections channel_connections_workspace_id_provider_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_connections
    ADD CONSTRAINT channel_connections_workspace_id_provider_key UNIQUE (workspace_id, provider);


--
-- Name: conversation_participants conversation_participants_conversation_id_external_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_external_id_key UNIQUE (conversation_id, external_id);


--
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_workspace_id_provider_external_conversation_i_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_workspace_id_provider_external_conversation_i_key UNIQUE (workspace_id, provider, external_conversation_id);


--
-- Name: external_identities external_identities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_identities
    ADD CONSTRAINT external_identities_pkey PRIMARY KEY (id);


--
-- Name: external_identities external_identities_workspace_id_provider_external_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_identities
    ADD CONSTRAINT external_identities_workspace_id_provider_external_id_key UNIQUE (workspace_id, provider, external_id);


--
-- Name: form_endpoints form_endpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_endpoints
    ADD CONSTRAINT form_endpoints_pkey PRIMARY KEY (id);


--
-- Name: form_endpoints form_endpoints_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_endpoints
    ADD CONSTRAINT form_endpoints_slug_key UNIQUE (slug);


--
-- Name: form_submissions form_submissions_form_endpoint_id_dedupe_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_form_endpoint_id_dedupe_hash_key UNIQUE (form_endpoint_id, dedupe_hash);


--
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- Name: lead_product_interests lead_product_interests_lead_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_product_interests
    ADD CONSTRAINT lead_product_interests_lead_id_product_id_key UNIQUE (lead_id, product_id);


--
-- Name: lead_product_interests lead_product_interests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_product_interests
    ADD CONSTRAINT lead_product_interests_pkey PRIMARY KEY (id);


--
-- Name: lead_stage_history lead_stage_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_stage_history
    ADD CONSTRAINT lead_stage_history_pkey PRIMARY KEY (id);


--
-- Name: lead_tags lead_tags_lead_id_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_tags
    ADD CONSTRAINT lead_tags_lead_id_tag_id_key UNIQUE (lead_id, tag_id);


--
-- Name: lead_tags lead_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_tags
    ADD CONSTRAINT lead_tags_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: lost_reasons lost_reasons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lost_reasons
    ADD CONSTRAINT lost_reasons_pkey PRIMARY KEY (id);


--
-- Name: message_attachments message_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: messages messages_workspace_id_provider_external_message_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_workspace_id_provider_external_message_id_key UNIQUE (workspace_id, provider, external_message_id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: opportunities opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_pkey PRIMARY KEY (id);


--
-- Name: outbox_messages outbox_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outbox_messages
    ADD CONSTRAINT outbox_messages_pkey PRIMARY KEY (id);


--
-- Name: pipeline_stages pipeline_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pipeline_stages
    ADD CONSTRAINT pipeline_stages_pkey PRIMARY KEY (id);


--
-- Name: pipelines pipelines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pipelines
    ADD CONSTRAINT pipelines_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: scheduled_messages scheduled_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_messages
    ADD CONSTRAINT scheduled_messages_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_workspace_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_workspace_id_name_key UNIQUE (workspace_id, name);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: webhook_events webhook_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_pkey PRIMARY KEY (id);


--
-- Name: webhook_events webhook_events_provider_workspace_id_external_event_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_provider_workspace_id_external_event_id_key UNIQUE (provider, workspace_id, external_event_id);


--
-- Name: workspace_branding workspace_branding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_branding
    ADD CONSTRAINT workspace_branding_pkey PRIMARY KEY (workspace_id);


--
-- Name: workspace_invitations workspace_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_invitations
    ADD CONSTRAINT workspace_invitations_pkey PRIMARY KEY (id);


--
-- Name: workspace_invitations workspace_invitations_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_invitations
    ADD CONSTRAINT workspace_invitations_token_hash_key UNIQUE (token_hash);


--
-- Name: workspace_members workspace_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);


--
-- Name: workspace_members workspace_members_workspace_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_workspace_id_user_id_key UNIQUE (workspace_id, user_id);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_12 messages_2026_08_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_12
    ADD CONSTRAINT messages_2026_08_12_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_13 messages_2026_08_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_13
    ADD CONSTRAINT messages_2026_08_13_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_14 messages_2026_08_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_14
    ADD CONSTRAINT messages_2026_08_14_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_15 messages_2026_08_15_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_15
    ADD CONSTRAINT messages_2026_08_15_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_16 messages_2026_08_16_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_16
    ADD CONSTRAINT messages_2026_08_16_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_17 messages_2026_08_17_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_17
    ADD CONSTRAINT messages_2026_08_17_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: feature_flags_name_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX feature_flags_name_index ON _realtime.feature_flags USING btree (name);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: activities_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activities_lead_idx ON public.activities USING btree (lead_id, created_at DESC);


--
-- Name: appointments_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_lead_idx ON public.appointments USING btree (lead_id);


--
-- Name: appointments_status_time_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_status_time_idx ON public.appointments USING btree (workspace_id, status, starts_at) WHERE (deleted_at IS NULL);


--
-- Name: appointments_workspace_time_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX appointments_workspace_time_idx ON public.appointments USING btree (workspace_id, starts_at) WHERE (deleted_at IS NULL);


--
-- Name: audit_logs_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_workspace_idx ON public.audit_logs USING btree (workspace_id, created_at DESC);


--
-- Name: calendar_sync_events_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX calendar_sync_events_workspace_idx ON public.calendar_sync_events USING btree (workspace_id, created_at DESC);


--
-- Name: conversations_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_lead_idx ON public.conversations USING btree (lead_id);


--
-- Name: conversations_workspace_recent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_workspace_recent_idx ON public.conversations USING btree (workspace_id, last_message_at DESC);


--
-- Name: external_identities_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX external_identities_lead_idx ON public.external_identities USING btree (lead_id);


--
-- Name: form_submissions_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX form_submissions_workspace_idx ON public.form_submissions USING btree (workspace_id, created_at DESC);


--
-- Name: lead_product_interests_product_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lead_product_interests_product_idx ON public.lead_product_interests USING btree (workspace_id, product_id);


--
-- Name: lead_stage_history_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lead_stage_history_lead_idx ON public.lead_stage_history USING btree (lead_id, created_at);


--
-- Name: lead_stage_history_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lead_stage_history_workspace_idx ON public.lead_stage_history USING btree (workspace_id, created_at);


--
-- Name: leads_board_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_board_idx ON public.leads USING btree (workspace_id, stage_id, "position") WHERE (deleted_at IS NULL);


--
-- Name: leads_created_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_created_idx ON public.leads USING btree (workspace_id, created_at DESC);


--
-- Name: leads_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_email_idx ON public.leads USING btree (workspace_id, email_normalized) WHERE (email_normalized IS NOT NULL);


--
-- Name: leads_engaged_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_engaged_idx ON public.leads USING btree (workspace_id, engaged_at) WHERE ((engaged_at IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: leads_owner_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_owner_idx ON public.leads USING btree (workspace_id, owner_id);


--
-- Name: leads_phone_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_phone_idx ON public.leads USING btree (workspace_id, phone_normalized) WHERE (phone_normalized IS NOT NULL);


--
-- Name: leads_pipeline_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_pipeline_idx ON public.leads USING btree (workspace_id, pipeline_id);


--
-- Name: lost_reasons_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lost_reasons_workspace_idx ON public.lost_reasons USING btree (workspace_id, is_active);


--
-- Name: messages_conversation_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_conversation_idx ON public.messages USING btree (conversation_id, sent_at DESC);


--
-- Name: notes_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notes_lead_idx ON public.notes USING btree (lead_id, created_at DESC);


--
-- Name: opportunities_closed_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX opportunities_closed_idx ON public.opportunities USING btree (workspace_id, closed_at);


--
-- Name: opportunities_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX opportunities_lead_idx ON public.opportunities USING btree (lead_id);


--
-- Name: opportunities_won_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX opportunities_won_idx ON public.opportunities USING btree (workspace_id, closed_at) WHERE ((status = 'won'::public.opportunity_status) AND (deleted_at IS NULL));


--
-- Name: opportunities_workspace_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX opportunities_workspace_status_idx ON public.opportunities USING btree (workspace_id, status) WHERE (deleted_at IS NULL);


--
-- Name: outbox_pending_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX outbox_pending_idx ON public.outbox_messages USING btree (status, next_retry_at) WHERE (status = 'pending'::public.outbox_status);


--
-- Name: pipeline_stages_pipeline_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pipeline_stages_pipeline_idx ON public.pipeline_stages USING btree (pipeline_id, "position");


--
-- Name: pipeline_stages_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pipeline_stages_workspace_idx ON public.pipeline_stages USING btree (workspace_id);


--
-- Name: pipelines_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pipelines_workspace_idx ON public.pipelines USING btree (workspace_id);


--
-- Name: products_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_workspace_idx ON public.products USING btree (workspace_id, is_active);


--
-- Name: scheduled_messages_conversation_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scheduled_messages_conversation_idx ON public.scheduled_messages USING btree (conversation_id, scheduled_for);


--
-- Name: scheduled_messages_due_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scheduled_messages_due_idx ON public.scheduled_messages USING btree (scheduled_for) WHERE (status = 'pending'::public.scheduled_message_status);


--
-- Name: tasks_due_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tasks_due_idx ON public.tasks USING btree (workspace_id, due_at) WHERE ((completed_at IS NULL) AND (deleted_at IS NULL));


--
-- Name: tasks_lead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tasks_lead_idx ON public.tasks USING btree (lead_id);


--
-- Name: webhook_events_recent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX webhook_events_recent_idx ON public.webhook_events USING btree (workspace_id, received_at DESC);


--
-- Name: workspace_invitations_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX workspace_invitations_email_idx ON public.workspace_invitations USING btree (workspace_id, email);


--
-- Name: workspace_invitations_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX workspace_invitations_workspace_idx ON public.workspace_invitations USING btree (workspace_id);


--
-- Name: workspace_members_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX workspace_members_user_idx ON public.workspace_members USING btree (user_id);


--
-- Name: workspace_members_workspace_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX workspace_members_workspace_idx ON public.workspace_members USING btree (workspace_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_12_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_08_12_inserted_at_topic_idx ON realtime.messages_2026_08_12 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_13_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_08_13_inserted_at_topic_idx ON realtime.messages_2026_08_13 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_14_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_08_14_inserted_at_topic_idx ON realtime.messages_2026_08_14 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_15_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_08_15_inserted_at_topic_idx ON realtime.messages_2026_08_15 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_16_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_08_16_inserted_at_topic_idx ON realtime.messages_2026_08_16 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_17_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_08_17_inserted_at_topic_idx ON realtime.messages_2026_08_17 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2026_08_12_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_12_inserted_at_topic_idx;


--
-- Name: messages_2026_08_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_12_pkey;


--
-- Name: messages_2026_08_13_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_13_inserted_at_topic_idx;


--
-- Name: messages_2026_08_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_13_pkey;


--
-- Name: messages_2026_08_14_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_14_inserted_at_topic_idx;


--
-- Name: messages_2026_08_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_14_pkey;


--
-- Name: messages_2026_08_15_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_15_inserted_at_topic_idx;


--
-- Name: messages_2026_08_15_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_15_pkey;


--
-- Name: messages_2026_08_16_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_16_inserted_at_topic_idx;


--
-- Name: messages_2026_08_16_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_16_pkey;


--
-- Name: messages_2026_08_17_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_17_inserted_at_topic_idx;


--
-- Name: messages_2026_08_17_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_17_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();


--
-- Name: leads guard_stage_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER guard_stage_change BEFORE UPDATE OF stage_id ON public.leads FOR EACH ROW EXECUTE FUNCTION private.guard_stage_change();


--
-- Name: leads normalize_lead_contacts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER normalize_lead_contacts BEFORE INSERT OR UPDATE OF phone, email ON public.leads FOR EACH ROW EXECUTE FUNCTION private.normalize_lead_contacts();


--
-- Name: appointments set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: calendar_connections set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.calendar_connections FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: channel_connections set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.channel_connections FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: conversations set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: form_endpoints set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.form_endpoints FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: leads set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: lost_reasons set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lost_reasons FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: notes set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: opportunities set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: outbox_messages set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.outbox_messages FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: pipeline_stages set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pipeline_stages FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: pipelines set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pipelines FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: products set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: profiles set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: scheduled_messages set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.scheduled_messages FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: tasks set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: workspace_branding set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workspace_branding FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: workspace_invitations set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workspace_invitations FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: workspace_members set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workspace_members FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: workspaces set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: activities activities_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id);


--
-- Name: activities activities_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: activities activities_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: appointments appointments_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id);


--
-- Name: audit_logs audit_logs_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: calendar_connections calendar_connections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_connections
    ADD CONSTRAINT calendar_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: calendar_connections calendar_connections_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_connections
    ADD CONSTRAINT calendar_connections_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: calendar_sync_events calendar_sync_events_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_sync_events
    ADD CONSTRAINT calendar_sync_events_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;


--
-- Name: calendar_sync_events calendar_sync_events_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_sync_events
    ADD CONSTRAINT calendar_sync_events_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: channel_connections channel_connections_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_connections
    ADD CONSTRAINT channel_connections_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_participants_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: conversations conversations_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: external_identities external_identities_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_identities
    ADD CONSTRAINT external_identities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: external_identities external_identities_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_identities
    ADD CONSTRAINT external_identities_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: form_endpoints form_endpoints_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_endpoints
    ADD CONSTRAINT form_endpoints_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: form_endpoints form_endpoints_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_endpoints
    ADD CONSTRAINT form_endpoints_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES public.pipelines(id) ON DELETE SET NULL;


--
-- Name: form_endpoints form_endpoints_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_endpoints
    ADD CONSTRAINT form_endpoints_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: form_endpoints form_endpoints_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_endpoints
    ADD CONSTRAINT form_endpoints_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: form_submissions form_submissions_form_endpoint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_form_endpoint_id_fkey FOREIGN KEY (form_endpoint_id) REFERENCES public.form_endpoints(id) ON DELETE CASCADE;


--
-- Name: form_submissions form_submissions_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: form_submissions form_submissions_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: lead_product_interests lead_product_interests_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_product_interests
    ADD CONSTRAINT lead_product_interests_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_product_interests lead_product_interests_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_product_interests
    ADD CONSTRAINT lead_product_interests_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: lead_product_interests lead_product_interests_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_product_interests
    ADD CONSTRAINT lead_product_interests_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: lead_stage_history lead_stage_history_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_stage_history
    ADD CONSTRAINT lead_stage_history_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id);


--
-- Name: lead_stage_history lead_stage_history_from_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_stage_history
    ADD CONSTRAINT lead_stage_history_from_stage_id_fkey FOREIGN KEY (from_stage_id) REFERENCES public.pipeline_stages(id) ON DELETE SET NULL;


--
-- Name: lead_stage_history lead_stage_history_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_stage_history
    ADD CONSTRAINT lead_stage_history_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_stage_history lead_stage_history_to_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_stage_history
    ADD CONSTRAINT lead_stage_history_to_stage_id_fkey FOREIGN KEY (to_stage_id) REFERENCES public.pipeline_stages(id) ON DELETE SET NULL;


--
-- Name: lead_stage_history lead_stage_history_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_stage_history
    ADD CONSTRAINT lead_stage_history_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: lead_tags lead_tags_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_tags
    ADD CONSTRAINT lead_tags_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_tags lead_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_tags
    ADD CONSTRAINT lead_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: lead_tags lead_tags_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_tags
    ADD CONSTRAINT lead_tags_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: leads leads_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: leads leads_lost_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_lost_reason_id_fkey FOREIGN KEY (lost_reason_id) REFERENCES public.lost_reasons(id) ON DELETE SET NULL;


--
-- Name: leads leads_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: leads leads_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES public.pipelines(id);


--
-- Name: leads leads_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.pipeline_stages(id);


--
-- Name: leads leads_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: lost_reasons lost_reasons_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lost_reasons
    ADD CONSTRAINT lost_reasons_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: message_attachments message_attachments_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- Name: message_attachments message_attachments_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: messages messages_sent_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sent_by_fkey FOREIGN KEY (sent_by) REFERENCES auth.users(id);


--
-- Name: messages messages_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: notes notes_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id);


--
-- Name: notes notes_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: notes notes_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: opportunities opportunities_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: opportunities opportunities_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: opportunities opportunities_lost_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_lost_reason_id_fkey FOREIGN KEY (lost_reason_id) REFERENCES public.lost_reasons(id) ON DELETE SET NULL;


--
-- Name: opportunities opportunities_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: opportunities opportunities_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: opportunities opportunities_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: outbox_messages outbox_messages_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outbox_messages
    ADD CONSTRAINT outbox_messages_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- Name: outbox_messages outbox_messages_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outbox_messages
    ADD CONSTRAINT outbox_messages_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: pipeline_stages pipeline_stages_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pipeline_stages
    ADD CONSTRAINT pipeline_stages_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES public.pipelines(id) ON DELETE CASCADE;


--
-- Name: pipeline_stages pipeline_stages_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pipeline_stages
    ADD CONSTRAINT pipeline_stages_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: pipelines pipelines_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pipelines
    ADD CONSTRAINT pipelines_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: products products_default_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_default_pipeline_id_fkey FOREIGN KEY (default_pipeline_id) REFERENCES public.pipelines(id) ON DELETE SET NULL;


--
-- Name: products products_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: scheduled_messages scheduled_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_messages
    ADD CONSTRAINT scheduled_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: scheduled_messages scheduled_messages_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_messages
    ADD CONSTRAINT scheduled_messages_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: scheduled_messages scheduled_messages_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_messages
    ADD CONSTRAINT scheduled_messages_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: scheduled_messages scheduled_messages_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_messages
    ADD CONSTRAINT scheduled_messages_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE SET NULL;


--
-- Name: scheduled_messages scheduled_messages_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_messages
    ADD CONSTRAINT scheduled_messages_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: tags tags_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: tasks tasks_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: webhook_events webhook_events_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: workspace_branding workspace_branding_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_branding
    ADD CONSTRAINT workspace_branding_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: workspace_invitations workspace_invitations_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_invitations
    ADD CONSTRAINT workspace_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES auth.users(id);


--
-- Name: workspace_invitations workspace_invitations_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_invitations
    ADD CONSTRAINT workspace_invitations_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: workspace_members workspace_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: workspace_members workspace_members_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: activities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

--
-- Name: activities activities_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY activities_insert_member ON public.activities FOR INSERT TO authenticated WITH CHECK ((private.is_member(workspace_id) AND (actor_id = ( SELECT auth.uid() AS uid))));


--
-- Name: activities activities_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY activities_select_member ON public.activities FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: appointments appointments_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY appointments_insert_member ON public.appointments FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: appointments appointments_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY appointments_select_member ON public.appointments FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: appointments appointments_update_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY appointments_update_member ON public.appointments FOR UPDATE TO authenticated USING (private.is_member(workspace_id)) WITH CHECK (private.is_member(workspace_id));


--
-- Name: message_attachments attachments_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY attachments_select_member ON public.message_attachments FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs audit_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY audit_select_admin ON public.audit_logs FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: workspace_branding branding_insert_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY branding_insert_admin ON public.workspace_branding FOR INSERT TO authenticated WITH CHECK (private.is_admin(workspace_id));


--
-- Name: workspace_branding branding_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY branding_select_member ON public.workspace_branding FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: workspace_branding branding_update_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY branding_update_admin ON public.workspace_branding FOR UPDATE TO authenticated USING (private.is_admin(workspace_id)) WITH CHECK (private.is_admin(workspace_id));


--
-- Name: calendar_connections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: calendar_connections calendar_connections_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY calendar_connections_select_admin ON public.calendar_connections FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: calendar_sync_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.calendar_sync_events ENABLE ROW LEVEL SECURITY;

--
-- Name: calendar_sync_events calendar_sync_events_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY calendar_sync_events_select_admin ON public.calendar_sync_events FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: channel_connections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.channel_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: channel_connections channel_connections_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY channel_connections_select_admin ON public.channel_connections FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: conversation_participants; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations conversations_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY conversations_select_member ON public.conversations FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: conversations conversations_update_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY conversations_update_member ON public.conversations FOR UPDATE TO authenticated USING (private.is_member(workspace_id)) WITH CHECK (private.is_member(workspace_id));


--
-- Name: external_identities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.external_identities ENABLE ROW LEVEL SECURITY;

--
-- Name: external_identities external_identities_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY external_identities_insert_member ON public.external_identities FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: external_identities external_identities_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY external_identities_select_member ON public.external_identities FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: form_endpoints; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.form_endpoints ENABLE ROW LEVEL SECURITY;

--
-- Name: form_endpoints form_endpoints_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY form_endpoints_select_member ON public.form_endpoints FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: form_endpoints form_endpoints_write_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY form_endpoints_write_admin ON public.form_endpoints TO authenticated USING (private.is_admin(workspace_id)) WITH CHECK (private.is_admin(workspace_id));


--
-- Name: form_submissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: form_submissions form_submissions_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY form_submissions_select_admin ON public.form_submissions FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: lead_stage_history history_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY history_select_member ON public.lead_stage_history FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: lead_product_interests interests_delete_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY interests_delete_member ON public.lead_product_interests FOR DELETE TO authenticated USING (private.is_member(workspace_id));


--
-- Name: lead_product_interests interests_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY interests_insert_member ON public.lead_product_interests FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: lead_product_interests interests_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY interests_select_member ON public.lead_product_interests FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: workspace_invitations invitations_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY invitations_select_admin ON public.workspace_invitations FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: lead_product_interests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lead_product_interests ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_stage_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lead_stage_history ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_tags; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_tags lead_tags_delete_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lead_tags_delete_member ON public.lead_tags FOR DELETE TO authenticated USING (private.is_member(workspace_id));


--
-- Name: lead_tags lead_tags_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lead_tags_insert_member ON public.lead_tags FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: lead_tags lead_tags_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lead_tags_select_member ON public.lead_tags FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: leads; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

--
-- Name: leads leads_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY leads_insert_member ON public.leads FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: leads leads_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY leads_select_member ON public.leads FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: leads leads_update_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY leads_update_member ON public.leads FOR UPDATE TO authenticated USING (private.is_member(workspace_id)) WITH CHECK (private.is_member(workspace_id));


--
-- Name: lost_reasons; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lost_reasons ENABLE ROW LEVEL SECURITY;

--
-- Name: lost_reasons lost_reasons_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lost_reasons_select_member ON public.lost_reasons FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: lost_reasons lost_reasons_write_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lost_reasons_write_admin ON public.lost_reasons TO authenticated USING (private.is_admin(workspace_id)) WITH CHECK (private.is_admin(workspace_id));


--
-- Name: workspace_members members_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY members_select_member ON public.workspace_members FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: message_attachments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: messages messages_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY messages_select_member ON public.messages FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: notes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

--
-- Name: notes notes_insert_visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY notes_insert_visibility ON public.notes FOR INSERT TO authenticated WITH CHECK ((private.is_member(workspace_id) AND (author_id = ( SELECT auth.uid() AS uid)) AND ((visibility = 'team'::public.note_visibility) OR private.is_admin(workspace_id))));


--
-- Name: notes notes_select_visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY notes_select_visibility ON public.notes FOR SELECT TO authenticated USING ((private.is_member(workspace_id) AND ((visibility = 'team'::public.note_visibility) OR private.is_admin(workspace_id))));


--
-- Name: notes notes_update_author_or_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY notes_update_author_or_admin ON public.notes FOR UPDATE TO authenticated USING ((private.is_member(workspace_id) AND ((author_id = ( SELECT auth.uid() AS uid)) OR private.is_admin(workspace_id)))) WITH CHECK ((private.is_member(workspace_id) AND ((visibility = 'team'::public.note_visibility) OR private.is_admin(workspace_id))));


--
-- Name: opportunities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: opportunities opportunities_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY opportunities_insert_member ON public.opportunities FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: opportunities opportunities_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY opportunities_select_member ON public.opportunities FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: opportunities opportunities_update_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY opportunities_update_member ON public.opportunities FOR UPDATE TO authenticated USING (private.is_member(workspace_id)) WITH CHECK (private.is_member(workspace_id));


--
-- Name: outbox_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.outbox_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: outbox_messages outbox_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY outbox_select_admin ON public.outbox_messages FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: conversation_participants participants_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY participants_select_member ON public.conversation_participants FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: pipeline_stages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

--
-- Name: pipelines; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;

--
-- Name: pipelines pipelines_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY pipelines_select_member ON public.pipelines FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: pipelines pipelines_write_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY pipelines_write_admin ON public.pipelines TO authenticated USING (private.is_admin(workspace_id)) WITH CHECK (private.is_admin(workspace_id));


--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: products products_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY products_select_member ON public.products FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: products products_write_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY products_write_admin ON public.products TO authenticated USING (private.is_admin(workspace_id)) WITH CHECK (private.is_admin(workspace_id));


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_select_self_or_colleague; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_select_self_or_colleague ON public.profiles FOR SELECT TO authenticated USING (((id = ( SELECT auth.uid() AS uid)) OR (id IN ( SELECT m.user_id
   FROM public.workspace_members m
  WHERE (m.workspace_id IN ( SELECT private.user_workspaces() AS user_workspaces))))));


--
-- Name: profiles profiles_update_self; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: scheduled_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: scheduled_messages scheduled_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY scheduled_select_member ON public.scheduled_messages FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: pipeline_stages stages_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY stages_select_member ON public.pipeline_stages FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: pipeline_stages stages_write_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY stages_write_admin ON public.pipeline_stages TO authenticated USING (private.is_admin(workspace_id)) WITH CHECK (private.is_admin(workspace_id));


--
-- Name: tags; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

--
-- Name: tags tags_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tags_insert_member ON public.tags FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: tags tags_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tags_select_member ON public.tags FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: tasks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

--
-- Name: tasks tasks_insert_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tasks_insert_member ON public.tasks FOR INSERT TO authenticated WITH CHECK (private.is_member(workspace_id));


--
-- Name: tasks tasks_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tasks_select_member ON public.tasks FOR SELECT TO authenticated USING (private.is_member(workspace_id));


--
-- Name: tasks tasks_update_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tasks_update_member ON public.tasks FOR UPDATE TO authenticated USING (private.is_member(workspace_id)) WITH CHECK (private.is_member(workspace_id));


--
-- Name: webhook_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

--
-- Name: webhook_events webhook_events_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY webhook_events_select_admin ON public.webhook_events FOR SELECT TO authenticated USING (private.is_admin(workspace_id));


--
-- Name: workspace_branding; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.workspace_branding ENABLE ROW LEVEL SECURITY;

--
-- Name: workspace_invitations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: workspace_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

--
-- Name: workspaces; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

--
-- Name: workspaces workspaces_select_member; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY workspaces_select_member ON public.workspaces FOR SELECT TO authenticated USING ((private.is_member(id) AND (deleted_at IS NULL)));


--
-- Name: workspaces workspaces_update_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY workspaces_update_admin ON public.workspaces FOR UPDATE TO authenticated USING (private.is_admin(id)) WITH CHECK (private.is_admin(id));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime conversations; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.conversations;


--
-- Name: supabase_realtime leads; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.leads;


--
-- Name: supabase_realtime messages; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.messages;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA private; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin WITH GRANT OPTION;
GRANT USAGE ON SCHEMA realtime TO authenticated;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA supabase_functions TO postgres;
GRANT USAGE ON SCHEMA supabase_functions TO anon;
GRANT USAGE ON SCHEMA supabase_functions TO authenticated;
GRANT USAGE ON SCHEMA supabase_functions TO service_role;
GRANT ALL ON SCHEMA supabase_functions TO supabase_functions_admin;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION citextin(cstring); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citextin(cstring) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citextout(extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citextout(extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citextrecv(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citextrecv(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citextsend(extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citextsend(extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext(boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext(boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext(character); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext(character) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext(inet); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext(inet) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_cmp(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_cmp(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_eq(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_eq(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_ge(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_ge(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_gt(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_gt(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_hash(extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_hash(extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_hash_extended(extensions.citext, bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_hash_extended(extensions.citext, bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_larger(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_larger(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_le(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_le(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_lt(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_lt(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_ne(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_ne(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_pattern_cmp(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_pattern_cmp(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_pattern_ge(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_pattern_ge(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_pattern_gt(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_pattern_gt(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_pattern_le(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_pattern_le(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_pattern_lt(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_pattern_lt(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION citext_smaller(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.citext_smaller(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_match(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_match(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_match(extensions.citext, extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_match(extensions.citext, extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_matches(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_matches(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_matches(extensions.citext, extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_matches(extensions.citext, extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_replace(extensions.citext, extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_replace(extensions.citext, extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_replace(extensions.citext, extensions.citext, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_replace(extensions.citext, extensions.citext, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_split_to_array(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_split_to_array(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_split_to_array(extensions.citext, extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_split_to_array(extensions.citext, extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_split_to_table(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_split_to_table(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION regexp_split_to_table(extensions.citext, extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.regexp_split_to_table(extensions.citext, extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION replace(extensions.citext, extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.replace(extensions.citext, extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION split_part(extensions.citext, extensions.citext, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.split_part(extensions.citext, extensions.citext, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION strpos(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.strpos(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticlike(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticlike(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticlike(extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticlike(extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticnlike(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticnlike(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticnlike(extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticnlike(extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticregexeq(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticregexeq(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticregexeq(extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticregexeq(extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticregexne(extensions.citext, extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticregexne(extensions.citext, extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION texticregexne(extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.texticregexne(extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION translate(extensions.citext, extensions.citext, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.translate(extensions.citext, extensions.citext, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO postgres;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO anon;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO authenticated;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO postgres;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO anon;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO authenticated;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION guard_stage_change(); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.guard_stage_change() TO authenticated;
GRANT ALL ON FUNCTION private.guard_stage_change() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION private.handle_new_user() TO service_role;


--
-- Name: FUNCTION is_admin(ws_id uuid); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.is_admin(ws_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_admin(ws_id uuid) TO service_role;


--
-- Name: FUNCTION is_member(ws_id uuid); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.is_member(ws_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_member(ws_id uuid) TO service_role;


--
-- Name: FUNCTION log_audit(ws_id uuid, audit_action public.audit_action, entity_type text, entity_id text, details jsonb); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.log_audit(ws_id uuid, audit_action public.audit_action, entity_type text, entity_id text, details jsonb) TO authenticated;
GRANT ALL ON FUNCTION private.log_audit(ws_id uuid, audit_action public.audit_action, entity_type text, entity_id text, details jsonb) TO service_role;


--
-- Name: FUNCTION normalize_lead_contacts(); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.normalize_lead_contacts() TO authenticated;
GRANT ALL ON FUNCTION private.normalize_lead_contacts() TO service_role;


--
-- Name: FUNCTION normalize_phone(raw text); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.normalize_phone(raw text) TO authenticated;
GRANT ALL ON FUNCTION private.normalize_phone(raw text) TO service_role;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION private.set_updated_at() TO service_role;


--
-- Name: FUNCTION user_workspaces(); Type: ACL; Schema: private; Owner: postgres
--

GRANT ALL ON FUNCTION private.user_workspaces() TO authenticated;
GRANT ALL ON FUNCTION private.user_workspaces() TO service_role;


--
-- Name: FUNCTION accept_invitation(raw_token text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.accept_invitation(raw_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.accept_invitation(raw_token text) TO authenticated;


--
-- Name: FUNCTION cancel_scheduled_message(p_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cancel_scheduled_message(p_id uuid) TO authenticated;


--
-- Name: FUNCTION change_member_role(member_id uuid, new_role public.member_role); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.change_member_role(member_id uuid, new_role public.member_role) FROM PUBLIC;
GRANT ALL ON FUNCTION public.change_member_role(member_id uuid, new_role public.member_role) TO authenticated;


--
-- Name: FUNCTION create_default_pipeline(ws_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.create_default_pipeline(ws_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.create_default_pipeline(ws_id uuid) TO authenticated;


--
-- Name: FUNCTION create_invitation(ws_id uuid, invitee_email text, invitee_role public.member_role); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.create_invitation(ws_id uuid, invitee_email text, invitee_role public.member_role) FROM PUBLIC;
GRANT ALL ON FUNCTION public.create_invitation(ws_id uuid, invitee_email text, invitee_role public.member_role) TO authenticated;


--
-- Name: FUNCTION dashboard_breakdowns(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dashboard_breakdowns(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid) TO authenticated;


--
-- Name: FUNCTION dashboard_funnel(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid, p_owner_id uuid, p_channel public.lead_channel); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dashboard_funnel(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid, p_owner_id uuid, p_channel public.lead_channel) TO authenticated;


--
-- Name: FUNCTION dashboard_summary(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid, p_product_id uuid, p_owner_id uuid, p_channel public.lead_channel); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dashboard_summary(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid, p_product_id uuid, p_owner_id uuid, p_channel public.lead_channel) TO authenticated;


--
-- Name: FUNCTION dashboard_timeseries(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dashboard_timeseries(p_workspace_id uuid, p_from timestamp with time zone, p_to timestamp with time zone, p_pipeline_id uuid) TO authenticated;


--
-- Name: FUNCTION delete_stage_migrating_leads(p_stage_id uuid, p_target_stage_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.delete_stage_migrating_leads(p_stage_id uuid, p_target_stage_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.delete_stage_migrating_leads(p_stage_id uuid, p_target_stage_id uuid) TO authenticated;


--
-- Name: FUNCTION dispatch_due_messages(p_limit integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dispatch_due_messages(p_limit integer) TO service_role;


--
-- Name: FUNCTION get_invitation_public(raw_token text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.get_invitation_public(raw_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_invitation_public(raw_token text) TO authenticated;
GRANT ALL ON FUNCTION public.get_invitation_public(raw_token text) TO anon;


--
-- Name: FUNCTION ingest_channel_message(p_workspace_id uuid, p_provider public.channel_provider, p_external_conversation_id text, p_external_message_id text, p_sender_external_id text, p_sender_name text, p_body text, p_sent_at timestamp with time zone, p_media_type text, p_media_url text, p_direction public.message_direction, p_phone text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.ingest_channel_message(p_workspace_id uuid, p_provider public.channel_provider, p_external_conversation_id text, p_external_message_id text, p_sender_external_id text, p_sender_name text, p_body text, p_sent_at timestamp with time zone, p_media_type text, p_media_url text, p_direction public.message_direction, p_phone text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.ingest_channel_message(p_workspace_id uuid, p_provider public.channel_provider, p_external_conversation_id text, p_external_message_id text, p_sender_external_id text, p_sender_name text, p_body text, p_sent_at timestamp with time zone, p_media_type text, p_media_url text, p_direction public.message_direction, p_phone text) TO service_role;


--
-- Name: FUNCTION mark_conversation_read(p_conversation_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.mark_conversation_read(p_conversation_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.mark_conversation_read(p_conversation_id uuid) TO authenticated;


--
-- Name: FUNCTION mark_lead_lost(p_lead_id uuid, p_lost_reason_id uuid, p_note text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.mark_lead_lost(p_lead_id uuid, p_lost_reason_id uuid, p_note text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.mark_lead_lost(p_lead_id uuid, p_lost_reason_id uuid, p_note text) TO authenticated;


--
-- Name: FUNCTION mark_opportunity_lost(p_opportunity_id uuid, p_lost_reason_id uuid, p_note text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.mark_opportunity_lost(p_opportunity_id uuid, p_lost_reason_id uuid, p_note text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.mark_opportunity_lost(p_opportunity_id uuid, p_lost_reason_id uuid, p_note text) TO authenticated;


--
-- Name: FUNCTION merge_leads(p_primary_id uuid, p_duplicate_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.merge_leads(p_primary_id uuid, p_duplicate_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.merge_leads(p_primary_id uuid, p_duplicate_id uuid) TO authenticated;


--
-- Name: FUNCTION move_lead_stage(p_lead_id uuid, p_stage_id uuid, p_position numeric); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.move_lead_stage(p_lead_id uuid, p_stage_id uuid, p_position numeric) FROM PUBLIC;
GRANT ALL ON FUNCTION public.move_lead_stage(p_lead_id uuid, p_stage_id uuid, p_position numeric) TO authenticated;


--
-- Name: FUNCTION purge_test_outbox(p_conversation_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.purge_test_outbox(p_conversation_id uuid) TO authenticated;


--
-- Name: FUNCTION reactivate_lead(p_lead_id uuid, p_stage_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.reactivate_lead(p_lead_id uuid, p_stage_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.reactivate_lead(p_lead_id uuid, p_stage_id uuid) TO authenticated;


--
-- Name: FUNCTION register_sale(p_lead_id uuid, p_product_id uuid, p_sold_value numeric, p_payment_method text, p_opportunity_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.register_sale(p_lead_id uuid, p_product_id uuid, p_sold_value numeric, p_payment_method text, p_opportunity_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.register_sale(p_lead_id uuid, p_product_id uuid, p_sold_value numeric, p_payment_method text, p_opportunity_id uuid) TO authenticated;


--
-- Name: FUNCTION revoke_invitation(invitation_id uuid); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.revoke_invitation(invitation_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.revoke_invitation(invitation_id uuid) TO authenticated;


--
-- Name: FUNCTION schedule_message(p_conversation_id uuid, p_body text, p_scheduled_for timestamp with time zone); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.schedule_message(p_conversation_id uuid, p_body text, p_scheduled_for timestamp with time zone) TO authenticated;


--
-- Name: FUNCTION send_channel_message(p_conversation_id uuid, p_body text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.send_channel_message(p_conversation_id uuid, p_body text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.send_channel_message(p_conversation_id uuid, p_body text) TO authenticated;


--
-- Name: FUNCTION set_member_active(member_id uuid, active boolean); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.set_member_active(member_id uuid, active boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION public.set_member_active(member_id uuid, active boolean) TO authenticated;


--
-- Name: FUNCTION upcoming_scheduled_messages(p_workspace_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.upcoming_scheduled_messages(p_workspace_id uuid, p_limit integer) TO authenticated;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO service_role;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION send_binary(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO postgres;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO anon;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO authenticated;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO service_role;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION max(extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.max(extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION min(extensions.citext); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.min(extensions.citext) TO postgres WITH GRANT OPTION;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;


--
-- Name: TABLE activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.activities TO anon;
GRANT ALL ON TABLE public.activities TO authenticated;
GRANT ALL ON TABLE public.activities TO service_role;


--
-- Name: SEQUENCE activities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE ON SEQUENCE public.activities_id_seq TO anon;
GRANT UPDATE ON SEQUENCE public.activities_id_seq TO authenticated;
GRANT UPDATE ON SEQUENCE public.activities_id_seq TO service_role;


--
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.appointments TO anon;
GRANT ALL ON TABLE public.appointments TO authenticated;
GRANT ALL ON TABLE public.appointments TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: SEQUENCE audit_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE ON SEQUENCE public.audit_logs_id_seq TO anon;
GRANT USAGE,UPDATE ON SEQUENCE public.audit_logs_id_seq TO authenticated;
GRANT USAGE,UPDATE ON SEQUENCE public.audit_logs_id_seq TO service_role;


--
-- Name: TABLE calendar_connections; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.calendar_connections TO anon;
GRANT ALL ON TABLE public.calendar_connections TO service_role;


--
-- Name: COLUMN calendar_connections.id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(id) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.workspace_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(workspace_id) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.user_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(user_id) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.provider; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(provider) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.account_email; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(account_email) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.calendar_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(calendar_id) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.calendar_name; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(calendar_name) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.status; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(status) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.token_expires_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(token_expires_at) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.created_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(created_at) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: COLUMN calendar_connections.updated_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(updated_at) ON TABLE public.calendar_connections TO authenticated;


--
-- Name: TABLE calendar_sync_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.calendar_sync_events TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.calendar_sync_events TO authenticated;
GRANT ALL ON TABLE public.calendar_sync_events TO service_role;


--
-- Name: SEQUENCE calendar_sync_events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE ON SEQUENCE public.calendar_sync_events_id_seq TO anon;
GRANT UPDATE ON SEQUENCE public.calendar_sync_events_id_seq TO authenticated;
GRANT UPDATE ON SEQUENCE public.calendar_sync_events_id_seq TO service_role;


--
-- Name: TABLE channel_connections; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.channel_connections TO anon;
GRANT ALL ON TABLE public.channel_connections TO service_role;


--
-- Name: COLUMN channel_connections.id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(id) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.workspace_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(workspace_id) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.provider; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(provider) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.status; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(status) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.display_name; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(display_name) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.external_account_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(external_account_id) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.phone_number_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(phone_number_id) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.waba_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(waba_id) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.instagram_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(instagram_id) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.last_event_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(last_event_at) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.created_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(created_at) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.updated_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(updated_at) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.transport; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(transport) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.bridge_url; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(bridge_url) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.bridge_state; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(bridge_state) ON TABLE public.channel_connections TO authenticated;


--
-- Name: COLUMN channel_connections.bridge_state_at; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(bridge_state_at) ON TABLE public.channel_connections TO authenticated;


--
-- Name: TABLE conversation_participants; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.conversation_participants TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.conversation_participants TO authenticated;
GRANT ALL ON TABLE public.conversation_participants TO service_role;


--
-- Name: TABLE conversations; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.conversations TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE public.conversations TO authenticated;
GRANT ALL ON TABLE public.conversations TO service_role;


--
-- Name: TABLE external_identities; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.external_identities TO anon;
GRANT ALL ON TABLE public.external_identities TO authenticated;
GRANT ALL ON TABLE public.external_identities TO service_role;


--
-- Name: TABLE form_endpoints; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.form_endpoints TO anon;
GRANT ALL ON TABLE public.form_endpoints TO authenticated;
GRANT ALL ON TABLE public.form_endpoints TO service_role;


--
-- Name: TABLE form_submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.form_submissions TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.form_submissions TO authenticated;
GRANT ALL ON TABLE public.form_submissions TO service_role;


--
-- Name: TABLE lead_product_interests; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.lead_product_interests TO anon;
GRANT ALL ON TABLE public.lead_product_interests TO authenticated;
GRANT ALL ON TABLE public.lead_product_interests TO service_role;


--
-- Name: TABLE lead_stage_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.lead_stage_history TO anon;
GRANT ALL ON TABLE public.lead_stage_history TO authenticated;
GRANT ALL ON TABLE public.lead_stage_history TO service_role;


--
-- Name: SEQUENCE lead_stage_history_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE ON SEQUENCE public.lead_stage_history_id_seq TO anon;
GRANT UPDATE ON SEQUENCE public.lead_stage_history_id_seq TO authenticated;
GRANT UPDATE ON SEQUENCE public.lead_stage_history_id_seq TO service_role;


--
-- Name: TABLE lead_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.lead_tags TO anon;
GRANT ALL ON TABLE public.lead_tags TO authenticated;
GRANT ALL ON TABLE public.lead_tags TO service_role;


--
-- Name: TABLE leads; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.leads TO anon;
GRANT ALL ON TABLE public.leads TO authenticated;
GRANT ALL ON TABLE public.leads TO service_role;


--
-- Name: TABLE lost_reasons; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.lost_reasons TO anon;
GRANT ALL ON TABLE public.lost_reasons TO authenticated;
GRANT ALL ON TABLE public.lost_reasons TO service_role;


--
-- Name: TABLE message_attachments; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.message_attachments TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.message_attachments TO authenticated;
GRANT ALL ON TABLE public.message_attachments TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.messages TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.messages TO authenticated;
GRANT ALL ON TABLE public.messages TO service_role;


--
-- Name: TABLE notes; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.notes TO anon;
GRANT ALL ON TABLE public.notes TO authenticated;
GRANT ALL ON TABLE public.notes TO service_role;


--
-- Name: TABLE opportunities; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.opportunities TO anon;
GRANT ALL ON TABLE public.opportunities TO authenticated;
GRANT ALL ON TABLE public.opportunities TO service_role;


--
-- Name: TABLE outbox_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.outbox_messages TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.outbox_messages TO authenticated;
GRANT ALL ON TABLE public.outbox_messages TO service_role;


--
-- Name: SEQUENCE outbox_messages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE ON SEQUENCE public.outbox_messages_id_seq TO anon;
GRANT UPDATE ON SEQUENCE public.outbox_messages_id_seq TO authenticated;
GRANT UPDATE ON SEQUENCE public.outbox_messages_id_seq TO service_role;


--
-- Name: TABLE pipeline_stages; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.pipeline_stages TO anon;
GRANT ALL ON TABLE public.pipeline_stages TO authenticated;
GRANT ALL ON TABLE public.pipeline_stages TO service_role;


--
-- Name: TABLE pipelines; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.pipelines TO anon;
GRANT ALL ON TABLE public.pipelines TO authenticated;
GRANT ALL ON TABLE public.pipelines TO service_role;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE scheduled_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.scheduled_messages TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.scheduled_messages TO authenticated;
GRANT ALL ON TABLE public.scheduled_messages TO service_role;


--
-- Name: TABLE tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.tags TO anon;
GRANT ALL ON TABLE public.tags TO authenticated;
GRANT ALL ON TABLE public.tags TO service_role;


--
-- Name: TABLE tasks; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;


--
-- Name: TABLE webhook_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.webhook_events TO anon;
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.webhook_events TO authenticated;
GRANT ALL ON TABLE public.webhook_events TO service_role;


--
-- Name: SEQUENCE webhook_events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE ON SEQUENCE public.webhook_events_id_seq TO anon;
GRANT UPDATE ON SEQUENCE public.webhook_events_id_seq TO authenticated;
GRANT UPDATE ON SEQUENCE public.webhook_events_id_seq TO service_role;


--
-- Name: TABLE workspace_branding; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.workspace_branding TO anon;
GRANT ALL ON TABLE public.workspace_branding TO authenticated;
GRANT ALL ON TABLE public.workspace_branding TO service_role;


--
-- Name: TABLE workspace_invitations; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.workspace_invitations TO anon;
GRANT ALL ON TABLE public.workspace_invitations TO authenticated;
GRANT ALL ON TABLE public.workspace_invitations TO service_role;


--
-- Name: TABLE workspace_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.workspace_members TO anon;
GRANT ALL ON TABLE public.workspace_members TO authenticated;
GRANT ALL ON TABLE public.workspace_members TO service_role;


--
-- Name: TABLE workspaces; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.workspaces TO anon;
GRANT ALL ON TABLE public.workspaces TO authenticated;
GRANT ALL ON TABLE public.workspaces TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_08_12; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_12 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_12 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_13; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_13 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_13 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_14; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_14 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_14 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_15; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_15 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_15 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_16; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_16 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_16 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_17; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_17 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_17 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;


--
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.hooks TO postgres;
GRANT ALL ON TABLE supabase_functions.hooks TO anon;
GRANT ALL ON TABLE supabase_functions.hooks TO authenticated;
GRANT ALL ON TABLE supabase_functions.hooks TO service_role;


--
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO postgres;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO anon;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.migrations TO postgres;
GRANT ALL ON TABLE supabase_functions.migrations TO anon;
GRANT ALL ON TABLE supabase_functions.migrations TO authenticated;
GRANT ALL ON TABLE supabase_functions.migrations TO service_role;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: private; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA private GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA private GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT UPDATE ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT UPDATE ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT UPDATE ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict acijia93LzhRmfffF4w35oNqK4P2jr3ZJFmqj06YqweLSXyTvj9nqtZqhwufC8E

