# ORDO — Decisões de produto e técnica

> Documento vivo. Atualizado ao final da Fase 1 (12/08/2026).
> O plano completo (arquitetura, modelo de dados, RLS, integrações, fases)
> foi aprovado em 12/08/2026 na sessão de planejamento e está resumido aqui.

## Escopo do produto

CRM SaaS multiempresa para operação comercial por conversa (WhatsApp/Instagram),
com pipeline configurável, cadastro progressivo de leads, agendamentos via
Google Calendar, oportunidades/vendas sobre produtos configuráveis e dashboard
com dados reais. Nome oficial do produto: **ORDO**. O workspace inicial
usa a marca profissional **Ítalo Jardim** via `workspace_branding`.

## Decisões aprovadas

| Decisão | Valor |
| --- | --- |
| Localização do repositório | `/Users/italojardim/Desktop/crm` (aprovado pelo usuário em 12/08/2026) |
| Stack | Next.js 16 (App Router) · React 19 · TypeScript estrito · Tailwind v4 · shadcn/ui (radix) · Supabase (`@supabase/ssr`) · RHF+Zod · TanStack Query · Vitest · Playwright (fases futuras) |
| Multi-tenant | `workspace_id` em toda tabela + RLS com funções `private.is_member`/`private.is_admin` (security definer) |
| Papéis iniciais | `admin` e `assistant` (enum `member_role`) |
| Mudança de papel/ativação | Somente via RPCs auditadas (`change_member_role`, `set_member_active`); UPDATE direto bloqueado; auto-alteração proibida |
| Convites | Token bruto exibido uma única vez ao admin (link `/convite/[token]`); hash SHA-256 no banco; expiração em 7 dias; aceitação exige e-mail idêntico |
| Criação de workspaces | Fluxo controlado (service_role/seed); sem policy de INSERT para clientes no MVP |
| Fuso padrão | `America/Campo_Grande`, configurável por workspace |
| Idioma | Interface 100% pt-BR |
| Roteamento protegido | `src/proxy.ts` (convenção do Next 16 que substitui `middleware.ts`) |

## Suposições registradas (reversíveis)

1. **Helnore Thin não é usada**: o kit de identidade contém apenas imagens
   rasterizadas — nenhum arquivo de fonte nem licença web. Montserrat é a única
   fonte da interface. Se a licença/arquivo forem obtidos, adicionar como
   fonte de títulos de marca.
2. **Convite por link copiável** em vez de e-mail automático na Fase 1: o
   envio SMTP será configurado junto aos ambientes de homologação/produção.
   Local usa Inbucket apenas para recuperação de senha.
3. **Confirmação de e-mail desativada no ambiente local** (`enable_confirmations
   = false`) para permitir o fluxo de convite sem SMTP. Em produção, ativar
   confirmações e revisar o fluxo de signup do convite.
4. **`profiles.email`** duplica o e-mail do Auth (preenchido por trigger) para
   permitir a listagem de equipe sem expor `auth.users`.
5. Dark mode fora do MVP: o tema compromete-se com a paleta clara da marca.
6. Hospedagem prevista: Vercel + 2 projetos Supabase (homolog/prod) — a criar.

## Paleta e tokens

Tokens semânticos em `src/app/globals.css` (nunca hexadecimais em componentes):
fundo `#F0EFEC`, texto `#141414`, primário `#063427`, ativo/positivo `#3B765A`,
acento dourado `#AA874A` (uso contido; não usar para texto pequeno sobre fundo
claro — contraste AA insuficiente), superfícies `#EAE9E5/#E5E4DE`, navegação
em verde profundo. Vermelho reservado a erros/perdas (fora da paleta da marca).

## Estado ao final da Fase 1

- Fundação do banco: `workspaces`, `workspace_branding`, `profiles`,
  `workspace_members`, `workspace_invitations`, `audit_logs`, enums, triggers,
  helpers RLS e RPCs — `supabase/migrations/20260812000001_foundation.sql`.
- Auth completo: login, recuperação (`/auth/confirm` + `/redefinir-senha`),
  convite (`/convite/[token]` com signup ou aceite), logout, perfil.
- Shell da aplicação com navegação Pipeline/Dashboard e menus de configuração
  (Perfil; Usuários/Workspace/Integrações restritos ao admin).
- Placeholders honestos de Pipeline (Fase 2) e Dashboard (Fase 5).
- Testes: unitários (validação) e suíte de RLS multiempresa
  (`tests/rls/foundation.test.ts`) — requer stack local do Supabase.
- Seed de desenvolvimento com 2 workspaces e 3 usuários (`supabase/seed.sql`).

## Pendências conhecidas

- ~~Docker/Supabase CLI~~ → resolvido em 13/08/2026: Colima + docker CLI +
  Supabase CLI via Homebrew; stack local no ar e suíte de RLS passando (19/19).
  O runtime Docker local é o Colima (`colima start` após reiniciar a máquina).
- Studio/Realtime/Storage/Analytics estão desligados no config.toml local para
  acelerar o start; reativar conforme as fases exigirem.
- Nenhuma credencial externa configurada (Supabase cloud, Meta, Google).
- Decisões pendentes do plano (produtos reais, número WhatsApp, conta Google,
  retenção de conversas, domínio público) seguem em aberto — ver plano.

## Estado ao final da Fase 2 (13/08/2026)

- Migration `20260813000001_crm_core.sql`: pipelines, etapas com `stage_type`
  semântico, produtos, motivos de perda, leads (cadastro progressivo,
  normalização de telefone/e-mail por trigger), interesses, histórico de
  etapas, tags, notas (`team`/`admin_only`), tarefas, atividades; RLS por
  papel; RPCs transacionais (`move_lead_stage`, `mark_lead_lost`,
  `reactivate_lead`, `delete_stage_migrating_leads`, `merge_leads`).
- Mudança de etapa por UPDATE direto é bloqueada por trigger: só via RPC,
  garantindo histórico íntegro para o funil.
- `/pipeline`: Kanban (dnd-kit, otimista com rollback, movimentação por menu
  acessível) + lista (ordenação, paginação) com filtros compartilhados na URL;
  criação de lead com alerta de duplicidade; Realtime em `leads`.
- `/pipeline/lead/[id]`: Lead 360° (cadastro completo, interesses,
  responsável, engajamento único, notas com visibilidade, tarefas com
  vencimento, timeline, perda com motivo obrigatório, reativação).
- `/configuracoes/produtos` e `/configuracoes/pipeline` (admin): CRUD de
  produtos; renomear/reordenar/arquivar/excluir etapa com migração de leads.
- Testes: 34 (unitários + RLS Fase 1 e 2) passando contra o stack local.

### Decisões técnicas da Fase 2

- Lista usa paginação client-side sobre janela de 500 leads mais recentes;
  paginação server-side completa quando o volume justificar.
- Motivos de perda gerenciáveis por SQL/seed; UI de gestão fica no backlog.
- "Sem acesso" enganoso pós-`db reset` corrigido: falha de consulta de
  membership agora propaga erro recarregável em vez de negar acesso.
- Drag entre colunas exige eventos de ponteiro reais; testes automatizados
  cobrem a movimentação via RPC e menu (caminho acessível).

## Estado ao final da Fase 3 (13/08/2026)

- Migration `20260813120001_commercial.sql`: `appointments` (estados
  agendada/realizada/cancelada/não compareceu, campos de sync), `opportunities`
  (aberta/ganha/perdida, valor potencial × vendido, forma de pagamento),
  `calendar_connections` e `calendar_sync_events`; RPCs `register_sale` e
  `mark_opportunity_lost`; `mark_lead_lost` passou a fechar oportunidades
  abertas do lead.
- Google Calendar: adaptador REST próprio (`src/lib/calendar/google.ts`), OAuth
  em `/api/integrations/google/{start,callback}`, refresh automático de token,
  criação/atualização/cancelamento idempotentes por
  `extendedProperties.private.praxis_appointment_id`, Meet opcional e
  free/busy para conflito remoto. **Status honesto**: sem
  `GOOGLE_CLIENT_ID/SECRET` a tela mostra "aguardando configuração" e as
  sessões ficam apenas no CRM.
- Lead 360° ganhou painéis de Agendamentos (com aviso de conflito e opção de
  agendar mesmo assim) e de Oportunidades/Vendas.
- Testes: 56 passando (unitários de conflito, payload do Calendar e
  criptografia; RLS das três fases).

### Decisões e achados técnicos da Fase 3

- **Tokens de integração**: cifrados com AES-256-GCM (`INTEGRATION_TOKEN_KEY`,
  32 bytes base64) e protegidos por **privilégio de coluna** — `authenticated`
  não tem `SELECT` em `access_token_enc`/`refresh_token_enc`, então nem um
  admin comprometido lê tokens pela API. Só o servidor (service_role) acessa.
- **Armadilha do PL/pgSQL corrigida**: `record IS NOT NULL` só é verdadeiro
  quando *todas* as colunas são não-nulas — como `archived_at` é nulo nas
  etapas ativas, o teste falhava silenciosamente e a venda não movia o lead.
  Agora testamos `v_won_stage.id is not null`. Regra para as próximas fases:
  nunca usar `record IS NOT NULL` para "encontrou linha?".
- Movimentação de etapa após a venda continua passando por `move_lead_stage`,
  preservando o histórico do funil.
- Sincronização com o Calendar é best-effort: falha não impede o agendamento,
  fica registrada em `calendar_sync_events` e visível no card da sessão.

## Estado ao final da Fase 4 (13/08/2026)

- Migration `20260813180001_channels.sql`: `channel_connections` (segredos
  cifrados e protegidos por privilégio de coluna), `external_identities`,
  `conversations`, `conversation_participants`, `messages`,
  `message_attachments`, `webhook_events` (única por provedor + workspace +
  id externo), `outbox_messages`, `form_endpoints`, `form_submissions`.
- RPCs: `ingest_channel_message` (idempotente; associa ou cria lead, registra
  engajamento e atividade — **não exposta a `authenticated`**),
  `send_channel_message` (grava + enfileira no outbox) e
  `mark_conversation_read`.
- Formulário público `/f/[slug]` + `POST /api/forms/[slug]`: UTMs, honeypot,
  tempo mínimo de preenchimento, rate limit por IP (hash, nunca IP em claro),
  deduplicação por janela de 10 minutos. **Funciona sem credencial externa.**
- Webhook `/api/webhooks/meta`: handshake de verificação, validação de
  assinatura HMAC em tempo constante, normalização de WhatsApp e Instagram,
  idempotência por evento e atualização de status de entrega.
- Simulador de mensagem (dev-only) para exercitar o fluxo sem credenciais.
- Inbox `/conversas` com janela de 24h, aviso de template e status de envio.
- Testes: 91 passando.

### Achados e decisões da Fase 4

- **Falha de segurança encontrada por teste**: o Postgres concede `EXECUTE` a
  `PUBLIC` em toda função nova, então `ingest_channel_message` estava
  chamável por qualquer usuário autenticado (permitiria forjar mensagens em
  qualquer workspace). Corrigido com `revoke execute ... from public, anon` +
  `alter default privileges ... revoke execute on functions from public`.
  **Regra para as próximas migrations**: toda RPC nova nasce sem acesso e
  recebe grant explícito só se for para o cliente.
- `service_role` precisou de `usage`/`execute` no schema `private`: os
  triggers de normalização rodam também nas escritas do servidor.
- Nomes de colunas em `RETURNS TABLE` entram no escopo do PL/pgSQL e tornam
  ambíguas referências em `ON CONFLICT`; por isso o prefixo `out_`.
- Revalidação não pode ocorrer durante o render de um Server Component
  (Next 16): marcar conversa como lida virou efeito no cliente.
- Rate limit é **em memória do processo** — adequado a uma instância; com
  múltiplas instâncias, migrar para armazenamento compartilhado.
- Envio real de mensagens ainda não tem worker de outbox: as mensagens ficam
  `pending` na fila. O worker entra junto com as credenciais reais da Meta.

## Decisões de integração (13/08/2026)

- **Google Calendar**: conta `@dritalojardim.com`, calendário **PsicoManager**
  (`843e74f5…@group.calendar.google.com`, fuso America/Campo_Grande — o mesmo
  do workspace). Verificado na conta do usuário; falta apenas o OAuth.
- **WhatsApp**: manter o **mesmo número** no celular e no CRM via
  **Coexistência (CoEx)**, com onboarding por **BSP** (Embedded Signup).
  Descarta a migração destrutiva e o número novo. Preferir BSP que repasse a
  Cloud API, porque o adaptador atual já usa esse formato.
- **Contingência**: caminho não oficial (Evolution API/Baileys) fica como
  plano B documentado, não implementado. Se acionado, exige apenas um novo
  adaptador — núcleo, tabelas e inbox não mudam. Riscos registrados em
  `docs/integracoes-meta-google.md`.

## Estado ao final da Fase 5 (13/08/2026)

- Migration `20260813210001_dashboard.sql`: `dashboard_summary`,
  `dashboard_funnel`, `dashboard_timeseries` e `dashboard_breakdowns`, todas
  `security invoker` (rodam sob a RLS do usuário: passar o workspace de outro
  não produz dados) + índices por período.
- `/dashboard` com filtros globais na URL, 6 cards principais, 8 métricas
  secundárias, funil por `stage_type`, 4 gráficos e listas operacionais.
- Cada indicador traz a fórmula no tooltip — número sem definição engana.
- Divisão por zero devolve `null` e a UI mostra "—", nunca "0%".
- Separação `dashboard.ts` (puro, seguro no cliente) e `dashboard-queries.ts`
  (`server-only`): a versão anterior arrastava o cliente Supabase de servidor
  para o bundle do navegador pelos filtros.
- Testes: 105 passando, incluindo 14 de fórmula com dataset de resultado
  conhecido (coorte, reativação sem duplicar no funil, múltiplas
  oportunidades, período vazio).

### Achados da Fase 5

- `typecheck` não detecta violação de fronteira cliente/servidor do Next —
  só o bundler. Módulos de dados novos nascem com `import "server-only"`.
- Insert em lote pelo PostgREST preenche chave ausente com `NULL` explícito
  em vez do default da coluna: em lote, todas as linhas precisam das mesmas
  chaves (quebrou o seed de teste em `reactivated_count`).
- Seed de teste sem checagem de erro produz teste que passa por engano; o
  helper `insert()` agora falha alto.

## Estado ao final da Fase 6 — MVP completo (13/08/2026)

- **E2E (Playwright): 9 testes** cobrindo login, rota protegida, credencial
  errada, criação de lead, movimentação de etapa, paridade Kanban/lista,
  agendamento + venda, perda com motivo obrigatório, formulário público
  criando lead e bloqueio do assistente em áreas administrativas.
- **Acessibilidade**: sem imagem sem alt, sem controle sem nome acessível, sem
  campo sem rótulo, hierarquia de títulos correta e nenhum estouro horizontal.
  Corrigido: alvos de toque agora têm 44px em ponteiros grossos (utilitário
  `.tap-target`), sem alterar o tamanho visual. Adicionado respeito a
  `prefers-reduced-motion`.
- **Responsividade**: no celular o pipeline abre em **lista** (arrastar cartão
  com o dedo é ruim); a escolha explícita do usuário sempre vence e persiste
  na URL.
- **Auditoria de segurança final**: todas as tabelas públicas com RLS; nenhum
  segredo legível por usuários (só hashes e um timestamp); `anon` executa
  apenas a busca pública de convite.
- Total: **105 testes (Vitest) + 9 E2E (Playwright)**.

### Achados da Fase 6

- `setState` dentro de efeito e leitura de ref durante render são erros de
  lint legítimos: a visão do pipeline virou estado derivado
  (`chosenView ?? (isMobile ? "list" : "kanban")`) com `useSyncExternalStore`
  para a media query — sem cascata de renderização e sem divergência de
  hidratação.
- Dois "defeitos" de E2E eram o app funcionando certo: telefone repetido
  dispara o alerta de duplicidade, e o cartão do Kanban é exposto como
  `button` para o teclado (daí a ambiguidade do seletor).
- O container do Supabase local pode subir com outro sufixo de projeto se o
  `supabase start` rodar fora do diretório do projeto — sempre executar de
  dentro de `crm/`.

## Backlog pós-MVP

Por ordem de valor:

1. **Worker de outbox** — envio real das mensagens (entra com as credenciais).
2. **Importação/exportação CSV** — fora do MVP por decisão.
3. **Múltiplos pipelines na interface** — o modelo já suporta.
4. **MFA obrigatória** — estrutura pronta, ativação pendente.
5. **Rate limit compartilhado** — necessário ao escalar para várias instâncias.
6. **Antivírus em anexos** — antes de liberar upload amplo.
7. **Billing multiempresa** — quando o produto atender outras empresas.
