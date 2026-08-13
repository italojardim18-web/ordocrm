# Praxis Mentis CRM — Decisões de produto e técnica

> Documento vivo. Atualizado ao final da Fase 1 (12/08/2026).
> O plano completo (arquitetura, modelo de dados, RLS, integrações, fases)
> foi aprovado em 12/08/2026 na sessão de planejamento e está resumido aqui.

## Escopo do produto

CRM SaaS multiempresa para operação comercial por conversa (WhatsApp/Instagram),
com pipeline configurável, cadastro progressivo de leads, agendamentos via
Google Calendar, oportunidades/vendas sobre produtos configuráveis e dashboard
com dados reais. Nome oficial do produto: **Praxis Mentis**. O workspace inicial
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

- **Docker não está instalado nesta máquina** → o stack local do Supabase
  (`supabase start`) e, portanto, a execução da suíte de RLS ainda não foram
  rodados. Instalar Docker Desktop (ou OrbStack) e o Supabase CLI.
- Supabase CLI não instalado (instalar via Homebrew ou binário oficial).
- Nenhuma credencial externa configurada (Supabase cloud, Meta, Google).
- Decisões pendentes do plano (produtos reais, número WhatsApp, conta Google,
  retenção de conversas, domínio público) seguem em aberto — ver plano.

## Backlog imediato (Fase 2)

Produtos e pipeline padrão (7 etapas com `stage_type`), leads com cadastro
progressivo e deduplicação, Lead 360°, Kanban/lista, histórico de etapas,
notas (`team`/`admin_only`), tarefas e follow-ups.
