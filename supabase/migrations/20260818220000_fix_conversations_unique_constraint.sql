-- Migration: Corrige a restrição única na tabela conversations
--
-- O Postgres trunca identificadores com mais de 63 caracteres. A restrição criada
-- originalmente em 20260813180001_channels.sql (unique (workspace_id, provider, external_conversation_id))
-- recebeu o nome truncado "conversations_workspace_id_provider_external_conversation_i_key".
-- A migration 20260817200000_multi_channel_strict_isolation.sql tentou dropar com nomes diferentes,
-- deixando a restrição antiga ativa e impedindo que o mesmo contato tivesse conversas
-- separadas em linhas de atendimento diferentes (ex: Secretária e Dr. Ítalo).

ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_workspace_id_provider_external_conversation_i_key;

ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_workspace_id_provider_external_conversation_id_key;

ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_workspace_id_provider_external_conversation_key;

-- Garante que a restrição única por linha existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.conversations'::regclass
      AND conname = 'conversations_workspace_provider_ext_channel_key'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT conversations_workspace_provider_ext_channel_key
      UNIQUE (workspace_id, provider, external_conversation_id, channel_connection_id);
  END IF;
END $$;
