# ORDO

CRM SaaS multiempresa para operações comerciais conduzidas por conversa
(WhatsApp/Instagram), com pipeline configurável, agendamentos, vendas e
dashboard sobre dados reais. Interface em português do Brasil.

Multi-tenant desde o primeiro migration: o workspace inicial é a operação do
**Ítalo Jardim**; **ORDO** é o nome do produto, e a identidade visual
(nome, logo, cores) é configuração por workspace.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estrito · Tailwind CSS v4 ·
shadcn/ui · Supabase (Postgres + Auth + RLS + Realtime) via `@supabase/ssr` ·
dnd-kit · Recharts · Zod · Vitest · Playwright.

## Pré-requisitos

- Node.js 24+
- [Supabase CLI](https://supabase.com/docs/guides/local-development)
- Um runtime de contêiner (Docker Desktop, OrbStack ou Colima)

## Desenvolvimento

```bash
npm install
supabase start
npm run dev
```

O `supabase start` imprime as chaves locais; copie-as para `.env.local`
(veja `.env.example`). Depois, `supabase db reset` aplica migrations + seed.

Contas do seed (apenas desenvolvimento):

| Papel | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@praxis.dev` | `praxis123!` |
| Assistente | `assistente@praxis.dev` | `praxis123!` |
| Admin de outro workspace | `admin@outra.dev` | `praxis123!` |

A terceira conta existe para provar isolamento entre empresas — use-a para
confirmar que um workspace nunca enxerga dados do outro.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run test` | Unitários, integração e RLS (Vitest) |
| `npm run test:e2e` | Fluxos críticos ponta a ponta (Playwright) |

Os testes de RLS e de fórmulas do dashboard precisam do stack local no ar; se
não estiver, eles se marcam como ignorados em vez de falhar.

## Estrutura

```
src/
  app/
    (app)/            # área autenticada: pipeline, dashboard, conversas, configurações
    f/[slug]/         # formulário público de captação
    api/
      forms/[slug]/   # ingestão do formulário público
      webhooks/meta/  # webhook oficial WhatsApp + Instagram
      integrations/   # OAuth do Google Calendar
  lib/
    crm/              # consultas, tipos e fórmulas do dashboard
    channels/         # normalização Meta, formulário, rate limit
    calendar/         # adaptador Google Calendar
    supabase/         # clientes (browser, server, admin)
supabase/migrations/  # esquema versionado
tests/                # unit, integration, rls, e2e
docs/                 # decisões de produto e guias de integração
```

## Segurança — princípios que o código segue

- **RLS em toda tabela exposta.** O isolamento entre empresas é do banco, não
  da aplicação; testes automatizados provam isso a cada migration.
- **Toda RPC nova nasce sem acesso.** O Postgres concede execução a `PUBLIC`
  por padrão; o esquema revoga isso e concede explicitamente só o necessário.
- **Segredos nunca chegam ao navegador.** Tokens de integração são cifrados
  (AES-256-GCM) e as colunas não têm privilégio de leitura para usuários.
- **O servidor revalida tudo.** Nenhuma permissão depende da interface.
- **Logs sem dado pessoal.** Nem conteúdo de mensagem, nem telefone, nem token.

## Variáveis de ambiente

| Variável | Onde | Para quê |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ambos | URL base (OAuth, links) |
| `NEXT_PUBLIC_SUPABASE_URL` | ambos | Projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ambos | Chave pública (protegida por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **só servidor** | Webhooks e formulário público |
| `INTEGRATION_TOKEN_KEY` | **só servidor** | Cifra tokens (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | **só servidor** | Google Calendar |

Sem as credenciais do Google, a integração aparece honestamente como
"aguardando configuração" — nada finge estar conectado.

## Integrações

Estado atual e o passo a passo das verificações externas estão em
[`docs/integracoes-meta-google.md`](docs/integracoes-meta-google.md):

- **Formulário público + UTMs** — funcionando, sem dependência externa.
- **Google Calendar** — código pronto; falta o OAuth (calendário PsicoManager).
- **WhatsApp** — código pronto; via **coexistência** por BSP, mantendo o mesmo
  número no celular e no CRM.
- **Instagram** — código pronto; mesma infraestrutura de webhook.

Em desenvolvimento, **Configurações → Integrações** traz um simulador de
mensagem recebida que exercita o caminho completo sem credenciais.

## Documentação

- [`docs/product-decisions.md`](docs/product-decisions.md) — decisões, achados
  e suposições de cada fase.
- [`docs/integracoes-meta-google.md`](docs/integracoes-meta-google.md) — o que
  o Ítalo precisa fazer nas contas Meta e Google.
- [`docs/operacao.md`](docs/operacao.md) — deploy, migrations, backups,
  checklist de lançamento e LGPD.
