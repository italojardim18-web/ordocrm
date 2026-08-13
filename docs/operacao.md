# Operação: deploy, manutenção e lançamento

Guia de quem coloca e mantém o ORDO no ar. Atualizado em 13/08/2026.

## 1. Ambientes

| Ambiente | Aplicação | Banco | Para quê |
| --- | --- | --- | --- |
| Local | `npm run dev` | `supabase start` | Desenvolvimento |
| Homologação | Preview na Vercel | Projeto Supabase próprio | Testar migrations e integrações com credenciais de teste |
| Produção | Vercel (domínio definitivo) | Projeto Supabase próprio | Operação real |

**Homologação e produção são projetos Supabase separados.** Nunca aponte a
homologação para o banco de produção: os testes de RLS e o seed apagam dados.

## 2. Deploy

1. Conectar o repositório à Vercel (framework detectado automaticamente).
2. Cadastrar as variáveis de ambiente do README — as marcadas "só servidor"
   **não** podem ter o prefixo `NEXT_PUBLIC_`.
3. Definir o domínio e confirmar o HTTPS (pré-requisito de OAuth e webhooks).
4. Aplicar as migrations no banco do ambiente (seção 3).
5. Rodar o checklist de lançamento (seção 7).

## 3. Migrations

```bash
supabase link --project-ref <ref-do-projeto>
supabase db push
```

Regras que evitam dor de cabeça:

- **Migrations são versionadas no git.** Nunca altere o esquema pelo painel do
  Supabase: a próxima migration vai divergir e quebrar.
- **Prefira mudanças aditivas** (expand/contract): adicione a coluna nova,
  migre os dados, só então remova a antiga — assim um rollback da aplicação
  não exige rollback do banco.
- **Antes de qualquer migration destrutiva, faça backup manual** (seção 5).
- Depois de aplicar em homologação, rode `npm run test` apontando para lá: a
  suíte de RLS é a rede de proteção do isolamento entre empresas.

### Rollback

Não existe "desfazer" automático. O caminho seguro:

1. Reverta o deploy da aplicação na Vercel (instantâneo).
2. Se o banco precisar voltar, escreva uma migration de correção — não edite a
   migration já aplicada.
3. Em caso grave, restaure o backup (seção 5) e comunique conforme a seção 6.

## 4. Monitoramento

- **Erros da aplicação**: configurar Sentry (ou equivalente) com *scrubbing*
  ativo. Nunca registrar conteúdo de mensagem, telefone, e-mail ou token.
- **Saúde das integrações**: Configurações → Integrações mostra eventos
  recebidos, eventos com falha e fila de envio pendente.
- **Sinal de alerta**: fila pendente crescendo sem parar, ou eventos com falha
  acumulando — normalmente token expirado ou webhook desassinado.
- **Coexistência do WhatsApp**: se ficar **14 dias sem abrir o app** no
  celular, a Meta derruba a conexão da API. Reconectar exige refazer o
  onboarding pelo BSP.

## 5. Backups e restauração

- O Supabase faz backups automáticos; o *point-in-time recovery* depende do
  plano contratado — **confirme qual plano cobre o PITR** antes do go-live.
- Backup manual antes de operações de risco:
  ```bash
  supabase db dump -f backup-$(date +%F).sql
  ```
- **Ensaie a restauração em homologação pelo menos uma vez.** Backup nunca
  testado não é backup.

## 6. Resposta a incidente

O sistema oferece a trilha de auditoria (`audit_logs`) e o registro de acessos;
ele **não substitui** o plano de resposta, que é decisão humana:

1. Conter: revogar tokens comprometidos (Configurações → Integrações →
   Desconectar) e, se necessário, desativar usuários.
2. Apurar: consultar `audit_logs` (quem acessou, exportou, excluiu o quê).
3. Avaliar risco aos titulares — com apoio jurídico.
4. Comunicar ANPD e titulares nos prazos legais, se aplicável.
5. Registrar o incidente e a correção.

## 7. Checklist de lançamento

### Técnico

- [ ] `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` verdes
- [ ] `npm run test:e2e` verde contra a homologação
- [ ] Migrations aplicadas e suíte de RLS verde no banco de destino
- [ ] Variáveis de ambiente cadastradas; nenhum segredo com `NEXT_PUBLIC_`
- [ ] `INTEGRATION_TOKEN_KEY` gerada exclusivamente para produção
- [ ] Domínio com HTTPS válido
- [ ] Webhooks cadastrados e respondendo ao handshake
- [ ] Backup verificado e restauração ensaiada
- [ ] Monitoramento com scrubbing ativo
- [ ] Seed de demonstração **não** aplicado em produção
- [ ] Admin real criado; contas `@praxis.dev` do seed inexistentes em produção

### Conteúdo e configuração

- [ ] Cinco produtos reais cadastrados (substituindo os `[Placeholder]`)
- [ ] Motivos de perda revisados
- [ ] Etapas do pipeline com os nomes que a operação usa
- [ ] Marca do workspace (nome e logo) configurada
- [ ] Formulário público com texto e slug definitivos

### Privacidade (decisões humanas — ver seção 8)

- [ ] Política de retenção definida e configurada
- [ ] Aviso de privacidade publicado e vinculado ao formulário
- [ ] Base legal de cada tratamento definida com apoio jurídico

## 8. LGPD — o que o sistema faz e o que depende de você

**Importante:** cumprir os controles técnicos abaixo **não** torna a operação
juridicamente conforme. O sistema pode conter dados relacionados à saúde e
protegidos por sigilo profissional; a conformidade exige as decisões humanas
listadas e validação jurídica própria.

### Já implementado

- Isolamento entre empresas por RLS, com testes automatizados
- Notas `admin_only` invisíveis ao assistente na interface, no servidor e no banco
- Tokens de integração cifrados e ilegíveis pela API
- Auditoria imutável de ações sensíveis
- Minimização: o cadastro não pede CPF, diagnóstico ou informação clínica
- Aviso no formulário público pedindo para não incluir dados de saúde
- IP do formulário guardado apenas como hash
- Rate limiting no login, no formulário e nos webhooks

### Depende de decisão humana

- [ ] Base legal de cada tratamento (contrato, consentimento, legítimo interesse)
- [ ] Aviso de privacidade e política do produto publicados
- [ ] Política de retenção — proposta: 24 meses para mensagens, 90 dias para
      payloads brutos de webhook
- [ ] Responsável pelo tratamento (encarregado/DPO) nomeado
- [ ] Contratos com operadores (Supabase, Vercel, Meta, Google) e transferência
      internacional de dados
- [ ] Definição, com o CFP e o código de ética, do que pode transitar em
      ferramenta comercial versus o que pertence ao prontuário
- [ ] Plano de resposta a incidente escrito (seção 6)

## 9. Limitações conhecidas

| Limitação | Impacto | Quando resolver |
| --- | --- | --- |
| Rate limit em memória do processo | Com várias instâncias, o limite é por instância | Ao escalar horizontalmente |
| ~~Sem worker de outbox~~ | Resolvido em 13/08/2026: `/api/jobs/outbox` com recuo exponencial | — |
| Ponte precisa de máquina sempre ligada | Mensagens recebidas com a ponte fora do ar não chegam (o WhatsApp não reenvia a dispositivo conectado) | Inerente ao transporte escolhido |
| Transporte não oficial viola os termos do WhatsApp | Risco de banimento do número | Migrar para coexistência via BSP se/quando compensar |
| Sem antivírus em anexos | Anexos não são verificados | Antes de liberar upload amplo |
| CSV fora do MVP | Importação/exportação em massa não existe | Pós-MVP |
| MFA não obrigatória | Estrutura pronta, não ativada | Quando houver mais usuários |
| Um pipeline por vez na interface | O modelo suporta vários | Quando surgir a segunda esteira |

## 10. Inicialização automática no Mac (uso interno)

O ORDO sobe sozinho no login através de um LaunchAgent do usuário.

| Peça | Onde |
| --- | --- |
| Serviço | `~/Library/LaunchAgents/com.ordo.stack.plist` |
| Script | `~/ordo/scripts/iniciar-ordo.sh` |
| Segredos | `~/.ordo/env` (chmod 600, fora do repositório) |
| Registros | `~/Library/Logs/ordo/` |

O script sobe na ordem: **Colima → Supabase → aplicação → ponte**. A ponte fica
em primeiro plano para o `launchd` supervisioná-la e reiniciar se cair.

### Por que o projeto não fica no Desktop

O macOS (TCC) impede serviços iniciados pelo `launchd` de lerem `~/Desktop`,
`~/Documents` e `~/Downloads` — o serviço falha com *Operation not permitted*.
Por isso o projeto vive em **`~/ordo`**, com um atalho em `~/Desktop/crm` para
o uso do dia a dia. A alternativa seria dar Acesso Total ao Disco ao `bash`,
permissão ampla demais para o que se precisa.

Bônus: o Desktop é sincronizado com o iCloud, o que criava arquivos
duplicados (` 2.ts`) dentro de `.next` e tornava qualquer operação lenta.

### Comandos

```bash
launchctl load   ~/Library/LaunchAgents/com.ordo.stack.plist   # ligar
launchctl unload ~/Library/LaunchAgents/com.ordo.stack.plist   # desligar
tail -f ~/Library/Logs/ordo/stack.log                          # acompanhar
curl -s http://localhost:8787/health                           # estado da ponte
```

**Antes de rodar os testes, desligue o serviço** — a suíte enfileira envios que
seriam entregues de verdade (ver `bridge/README.md`).

### Se a mensagem chegar com o ORDO fora do ar

A ponte grava o evento em `bridge/spool/` e reenvia assim que o ORDO responder.
Nada se perde enquanto a aplicação reinicia ou compila — o que importa, já que
o WhatsApp não reenvia histórico para dispositivo conectado.
