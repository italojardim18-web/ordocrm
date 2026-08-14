-- =============================================================================
-- Mídia das conversas: imagens, áudios e documentos do WhatsApp.
--
-- Até aqui a mídia aparecia como "[imagem recebida]" — inútil numa operação
-- onde as pessoas mandam áudio o tempo todo. Os arquivos ficam no Storage,
-- em bucket privado, acessíveis só por quem pertence ao workspace.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'message-media',
  'message-media',
  false, -- privado: conversa de lead pode conter dado sensível
  26214400, -- 25 MB
  array[
    'image/jpeg','image/png','image/webp','image/gif',
    'audio/ogg','audio/mpeg','audio/mp4','audio/aac','audio/wav',
    'video/mp4','video/3gpp','video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Caminho dos arquivos: <workspace_id>/<conversation_id>/<arquivo>.
-- A primeira pasta é o workspace, então o isolamento sai da própria chave.
create policy "media_select_member"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'message-media'
    and private.is_member(((storage.foldername(name))[1])::uuid)
  );

create policy "media_insert_member"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'message-media'
    and private.is_member(((storage.foldername(name))[1])::uuid)
  );

-- Metadados do arquivo na própria mensagem: evita uma consulta extra só para
-- saber se é áudio ou imagem ao desenhar a conversa.
alter table public.messages
  add column media_path text,
  add column media_mime text,
  add column media_size integer,
  add column media_filename text,
  add column media_duration_seconds integer;

comment on column public.messages.media_path is
  'Caminho no bucket message-media: <workspace>/<conversa>/<arquivo>';

-- Mensagem só de mídia não tem corpo: a prévia da conversa precisa dizer algo.
create or replace function private.previa_da_mensagem(
  p_body text,
  p_media_mime text
)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p_body is not null and btrim(p_body) <> '' then left(p_body, 160)
    when p_media_mime like 'image/%' then '📷 Imagem'
    when p_media_mime like 'audio/%' then '🎤 Áudio'
    when p_media_mime like 'video/%' then '🎬 Vídeo'
    when p_media_mime is not null then '📎 Documento'
    else '[mídia]'
  end;
$$;

grant execute on function private.previa_da_mensagem(text, text) to service_role;
