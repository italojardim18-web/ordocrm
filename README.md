# Praxis Mentis CRM

CRM SaaS multiempresa para operações comerciais conduzidas por conversa
(WhatsApp/Instagram), com pipeline configurável, agendamentos e dashboard.
Interface em português do Brasil.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 ·
shadcn/ui · Supabase (Postgres + Auth + RLS) via `@supabase/ssr` · Vitest.

## Pré-requisitos

- Node.js 24+ (LTS)
- [Supabase CLI](https://supabase.com/docs/guides/local-development) e Docker
  (para o stack local)

## Desenvolvimento

```bash
npm install
supabase start          # sobe Postgres/Auth/Studio locais (requer Docker)
supabase db reset       # aplica migrations + seed
npm run dev             # http://localhost:3000
```

Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL`
e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores de `supabase status`.

### Usuários do seed (apenas desenvolvimento)

| E-mail | Senha | Papel / workspace |
| --- | --- | --- |
| `admin@praxis.dev` | `praxis123!` | Admin · Ítalo Jardim |
| `assistente@praxis.dev` | `praxis123!` | Assistente · Ítalo Jardim |
| `admin@outra.dev` | `praxis123!` | Admin · Outra Empresa (isolamento) |

## Qualidade

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest (a suíte de RLS exige o stack local ativo)
npm run build       # build de produção
```

Os testes de `tests/rls/` provam o isolamento entre dois workspaces e as
restrições do papel assistente; sem o stack local eles são ignorados com aviso.

## Estrutura

- `supabase/migrations/` — schema versionado (RLS, RPCs, triggers)
- `supabase/seed.sql` — seed sintético de desenvolvimento (nunca produção)
- `src/app/(auth)/` — login, recuperação, redefinição e convite
- `src/app/(app)/` — área autenticada (Pipeline, Dashboard, configurações)
- `src/proxy.ts` — renovação de sessão e proteção de rotas (Next 16)
- `docs/product-decisions.md` — decisões, suposições e pendências

## Conectar o Google Calendar

1. No [Google Cloud Console](https://console.cloud.google.com), crie um projeto
   e ative a **Google Calendar API**.
2. Configure a tela de consentimento OAuth (tipo Externo) e adicione os escopos
   `calendar.readonly` e `calendar.events`.
3. Crie credenciais **ID do cliente OAuth → Aplicativo da Web** com o redirect
   autorizado `<NEXT_PUBLIC_SITE_URL>/api/integrations/google/callback`.
4. Preencha no ambiente do servidor: `GOOGLE_CLIENT_ID`,
   `GOOGLE_CLIENT_SECRET`, `INTEGRATION_TOKEN_KEY` (gere com
   `openssl rand -base64 32`) e `SUPABASE_SERVICE_ROLE_KEY`.
5. Em **Configurações → Integrações**, clique em *Conectar Google Calendar* e
   escolha o calendário das sessões.

Sem essas credenciais a integração aparece como "aguardando configuração" e os
agendamentos ficam registrados apenas no CRM — nenhum dado é perdido.

## Primeiro administrador (produção)

A criação de workspaces é um fluxo controlado: crie o usuário no painel do
Supabase (Auth → Users) e insira o workspace + vínculo `admin` via SQL editor,
seguindo o modelo de `supabase/seed.sql` (sem os usuários de teste). Os
próximos usuários entram por convite dentro do produto.
