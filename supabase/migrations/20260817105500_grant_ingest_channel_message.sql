-- =============================================================================
-- Migration: Concede permissão de execução em ingest_channel_message
-- =============================================================================

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
) TO service_role, postgres, anon, authenticated;
