# Ponte ORDO ↔ WhatsApp

Mantém o WhatsApp conectado ao ORDO como **dispositivo conectado** — o mesmo
mecanismo do WhatsApp Web. Seu celular continua funcionando normalmente; a
ponte é apenas mais um aparelho na conta.

## Leia antes de usar

Este é o **transporte não oficial**, escolhido em 13/08/2026 para evitar
mensalidade de BSP. Implicações reais:

- **Viola os termos de uso do WhatsApp.** O número pode ser banido, sem aviso
  e sem recurso prático.
- Sem SLA. Se o WhatsApp mudar o protocolo, a ponte para até a biblioteca ser
  atualizada.
- As conversas podem conter dados de saúde sob sigilo profissional; avalie
  isso na sua análise de risco (ver `docs/operacao.md`, seção 8).

O caminho oficial (coexistência via BSP) continua documentado em
`docs/integracoes-meta-google.md` e o ORDO suporta os dois: é só trocar o
`transport` da conexão, sem mexer em leads, conversas ou relatórios.

## Onde hospedar

Precisa de um processo **sempre ligado** — não funciona em serverless.

| Opção | Custo | Observação |
| --- | --- | --- |
| Computador/mini-PC seu | Grátis | Precisa ficar ligado e com internet |
| VPS pequeno (1 vCPU / 1 GB) | ~R$ 25/mês | Mais estável |
| Raspberry Pi | Custo único | Boa relação custo/estabilidade |

Se a máquina desligar, mensagens recebidas nesse intervalo **não** chegam ao
ORDO — o WhatsApp não reenvia histórico para dispositivo conectado.

## Instalação

```bash
cd bridge
npm install
```

Gere um segredo e use **o mesmo valor** aqui e no ORDO:

```bash
openssl rand -hex 32
```

Configure o ambiente:

```bash
export ORDO_URL="https://seu-ordo.exemplo.com"
export ORDO_BRIDGE_SECRET="<o segredo gerado>"
export BRIDGE_PORT=8787
```

Inicie:

```bash
npm start
```

Um QR aparece no terminal. No celular: **Configurações → Aparelhos conectados
→ Conectar aparelho**. Depois do pareamento, a sessão fica gravada em
`bridge/sessao/` e não é preciso repetir.

> A pasta `sessao/` dá acesso à sua conta do WhatsApp. Nunca versione nem
> compartilhe (já está no `.gitignore`).

## Configurar o lado do ORDO

Na tabela `channel_connections`, o workspace precisa de uma linha com:

| Campo | Valor |
| --- | --- |
| `provider` | `whatsapp` |
| `transport` | `bridge` |
| `status` | `connected` |
| `bridge_url` | `http://IP-DA-PONTE:8787` |
| `bridge_secret_enc` | o mesmo segredo, cifrado com `INTEGRATION_TOKEN_KEY` |

E no ORDO, defina `JOBS_SECRET` e agende o processamento da fila:

```bash
curl -X POST https://seu-ordo.exemplo.com/api/jobs/outbox \
  -H "Authorization: Bearer $JOBS_SECRET"
```

A cada minuto é suficiente (Vercel Cron, cron do servidor ou a própria ponte).

## Como funciona

```
WhatsApp → ponte → POST /api/webhooks/bridge (assinado HMAC) → ORDO
ORDO (fila) → POST /send da ponte (assinado HMAC) → WhatsApp
```

Os dois sentidos são assinados com HMAC-SHA256 do corpo bruto: a ponte só
aceita comandos do ORDO e o ORDO só aceita eventos da ponte.

Mensagens que **você responde pelo celular** também chegam ao ORDO (eco) e
entram na conversa como saída — sem marcar engajamento do lead, porque
engajamento é ele responder, não você escrever.

## Verificar se está no ar

```bash
curl http://localhost:8787/health
```

Retorna o estado da sessão: `aguardando_qr`, `conectado`, `reconectando` ou
`desconectado`. O mesmo estado aparece em **Configurações → Integrações** do
ORDO.

## Regra importante: teste e ponte no mesmo banco

Com a ponte **conectada**, tudo que entra na fila de saída é enviado de
verdade. A suíte de testes exercita o envio, então:

- **Nunca rode `npm run test` ou `npm run test:e2e` com a ponte ligada
  apontando para o mesmo banco.** Pare a ponte antes.
- A suíte de RLS limpa a própria fila ao terminar (`purge_test_outbox`), mas
  não confie só nisso: um teste interrompido no meio deixa sobra.
- Antes de conectar a ponte pela primeira vez, confira a fila:

```bash
curl -s "$SUPABASE_URL/rest/v1/outbox_messages?select=id,status,payload&status=eq.pending" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY"
```

Duas proteções já existem no worker: mensagem parada há mais de **12 horas**
não é enviada (chega fora de contexto), e a ponte responder 503 (sessão ainda
não conectada) **não** gasta tentativa.

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| `assinatura recusada` | Segredo diferente entre ponte e ORDO |
| Volta ao QR sozinho | Sessão removida no celular (Aparelhos conectados) |
| Mensagens não chegam | Ponte desligada, ou `bridge_url` inacessível pelo ORDO |
| Fila cresce sem enviar | `JOBS_SECRET` errado ou agendador parado |
