-- =============================================================================
-- Tolerância de atraso no despacho de mensagens agendadas
--
-- O ORDO roda no Mac do usuário. Se a máquina estiver desligada às 9h, a
-- mensagem agendada para 9h só seria despachada quando ela voltasse — podendo
-- sair às 21h. Um "bom dia, tudo bem?" chegando à noite é pior do que não
-- chegar: soa automático e desatento.
--
-- Regra: passado o limite de tolerância, a mensagem NÃO é enviada. Fica
-- marcada como falha, com o motivo explícito, e a pessoa decide o que fazer.
-- Silêncio é recuperável; mensagem fora de hora não.
-- =============================================================================

alter table public.scheduled_messages
  add column max_delay_minutes integer not null default 240
    check (max_delay_minutes between 5 and 10080);

comment on column public.scheduled_messages.max_delay_minutes is
  'Atraso máximo aceitável no despacho (padrão 4h). Passado disso, não envia.';

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

grant execute on function public.dispatch_due_messages(integer) to service_role;

-- Agenda do que ainda vai sair, para o painel de controle.
create or replace function public.upcoming_scheduled_messages(
  p_workspace_id uuid,
  p_limit integer default 10
)
returns table (
  id uuid,
  conversation_id uuid,
  lead_id uuid,
  lead_name text,
  body text,
  scheduled_for timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
  select s.id, s.conversation_id, s.lead_id,
         coalesce(l.name, 'Contato sem cadastro'), s.body, s.scheduled_for
  from public.scheduled_messages s
  left join public.leads l on l.id = s.lead_id
  where s.workspace_id = p_workspace_id
    and s.status = 'pending'
  order by s.scheduled_for
  limit p_limit;
$$;

grant execute on function public.upcoming_scheduled_messages(uuid, integer)
  to authenticated;
