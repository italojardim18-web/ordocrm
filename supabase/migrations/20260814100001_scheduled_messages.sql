-- =============================================================================
-- Agendamento de mensagens
--
-- Escrever agora e entregar depois: follow-up marcado para a manhã seguinte,
-- lembrete de sessão na véspera, retomada de contato daqui a uma semana.
--
-- Separado da fila de saída de propósito: `outbox_messages` é infraestrutura
-- de entrega (retentativa, backoff), enquanto isto é intenção do usuário —
-- precisa ser listável, editável e cancelável antes da hora.
-- =============================================================================

create type public.scheduled_message_status as enum (
  'pending',
  'sent',
  'cancelled',
  'failed'
);

create table public.scheduled_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  scheduled_for timestamptz not null,
  status public.scheduled_message_status not null default 'pending',
  sent_at timestamptz,
  message_id uuid references public.messages (id) on delete set null,
  error text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- O worker busca por "vencidas e pendentes": este índice serve exatamente isso.
create index scheduled_messages_due_idx
  on public.scheduled_messages (scheduled_for)
  where status = 'pending';

create index scheduled_messages_conversation_idx
  on public.scheduled_messages (conversation_id, scheduled_for);

create trigger set_updated_at before update on public.scheduled_messages
  for each row execute function private.set_updated_at();

alter table public.scheduled_messages enable row level security;

create policy "scheduled_select_member" on public.scheduled_messages
  for select to authenticated using (private.is_member(workspace_id));

-- Criação e cancelamento passam por RPC (validam conversa e horário).
revoke insert, update, delete on public.scheduled_messages from authenticated;

-- -----------------------------------------------------------------------------
-- Agendar
-- -----------------------------------------------------------------------------

create or replace function public.schedule_message(
  p_conversation_id uuid,
  p_body text,
  p_scheduled_for timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
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

-- -----------------------------------------------------------------------------
-- Cancelar
-- -----------------------------------------------------------------------------

create or replace function public.cancel_scheduled_message(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
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

-- -----------------------------------------------------------------------------
-- Despacho: chamado pelo worker
--
-- Reaproveita send_channel_message, então a mensagem agendada percorre
-- exatamente o mesmo caminho de uma escrita na hora: entra na conversa, vai
-- para a fila de saída e é entregue com retentativa.
-- -----------------------------------------------------------------------------

create or replace function public.dispatch_due_messages(p_limit integer default 20)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row record;
  v_message_id uuid;
  v_enviadas integer := 0;
begin
  for v_row in
    select * from public.scheduled_messages
    where status = 'pending' and scheduled_for <= now()
    order by scheduled_for
    limit p_limit
    for update skip locked
  loop
    begin
      -- send_channel_message exige sessão; aqui o ator é o worker, então
      -- gravamos direto com a mesma semântica.
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
      -- Uma falha não pode travar as demais do lote.
      update public.scheduled_messages
      set status = 'failed', error = left(sqlerrm, 300)
      where id = v_row.id;
    end;
  end loop;

  return v_enviadas;
end;
$$;

grant execute on function public.schedule_message(uuid, text, timestamptz) to authenticated;
grant execute on function public.cancel_scheduled_message(uuid) to authenticated;
grant execute on function public.dispatch_due_messages(integer) to service_role;
