-- =============================================================================
-- Migration: Revoga permissão pública de execução em ingest_channel_message
-- Restringe a execução exclusivamente aos papéis service_role e postgres.
-- =============================================================================

REVOKE EXECUTE ON FUNCTION public.ingest_channel_message(
  uuid,
  public.channel_provider,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  public.message_direction,
  text,
  uuid
) FROM anon, authenticated, public;

GRANT EXECUTE ON FUNCTION public.ingest_channel_message(
  uuid,
  public.channel_provider,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  public.message_direction,
  text,
  uuid
) TO service_role, postgres;
