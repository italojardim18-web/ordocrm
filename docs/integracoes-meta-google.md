# Verificações externas — Meta e Google

> Guia para o **Ítalo** executar. Estas etapas exigem acesso às suas contas,
> documentos da empresa e aprovações de terceiros — não podem ser feitas pelo
> agente de desenvolvimento nem automatizadas.
>
> Atualizado em 13/08/2026.

## Resumo do que trava o quê

| Integração | O código está | Bloqueado por | Prazo típico |
| --- | --- | --- | --- |
| Formulário público + UTMs | **Pronto e funcionando** | Só domínio público para produção | — |
| Google Calendar | Pronto | Projeto Google Cloud + OAuth | 1–2 dias |
| WhatsApp Cloud API (**coexistência**) | Pronto (webhook, ingestão, envio) | Onboarding por BSP com Embedded Signup | 2–7 dias |
| Instagram Direct | Pronto (mesmo webhook) | Conta profissional (App Review dispensável — ver abaixo) | 1–2 dias |
| Meta Lead Ads | Estrutura pronta | Depende dos itens acima | pós-MVP |

## Decisão de 13/08/2026: uso interno, sem verificações

O ORDO será usado **apenas internamente por enquanto**, sem preço definido e
sem atender outras empresas. Isso muda a estratégia: **as verificações da Meta
podem ser puladas.**

| Verificação | Precisa? | Consequência de pular |
| --- | --- | --- |
| Verificação do negócio | **Não** | Limite de 250 contatos únicos por 24h — muito acima do uso de um consultório |
| App Review (WhatsApp) | **Não** | Nenhuma, para números que você mesmo administra |
| App Review (Instagram) | **Não** | Standard Access cobre contas próprias; só é exigido para contas de terceiros |
| Criar app + portfólio Meta | **Sim** | Não é verificação: é cadastro gratuito e imediato |

**Caminho recomendado agora — número de teste da Meta.** Custo zero, sem
burocracia, disponível na hora, e valida a integração inteira de ponta a ponta.
Limite: 5 destinatários cadastrados, o que basta para homologar.

**Quando as conversas reais passarem a importar**, migre para coexistência via
BSP (seção 4) — que também dispensa as verificações.

O App Review só volta a ser obrigatório no dia em que o ORDO atender **outras
empresas**, porque aí serão contas de terceiros.

---

## 1. Domínio público com HTTPS (pré-requisito de tudo)

Meta e Google exigem URLs públicas em HTTPS para webhooks e OAuth. `localhost`
não serve para produção (mas serve para desenvolvimento).

- [ ] Definir o domínio do CRM (ex.: `crm.dritalojardim.com`).
- [ ] Apontar o DNS para a hospedagem (Vercel) e confirmar o certificado.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` com esse endereço.

Enquanto o domínio não existir, é possível testar webhooks localmente com um
túnel (ex.: `cloudflared tunnel`), sem comprometer nada.

---

## 2. Google Calendar (calendário **PsicoManager**)

Decidido: conta `@dritalojardim.com`, calendário **PsicoManager**
(`843e74f5e05e50004900fa77158974a2745155f138c87dc987f28dd268090cbf@group.calendar.google.com`,
fuso America/Campo_Grande — o mesmo do workspace).

- [ ] Criar projeto no [Google Cloud Console](https://console.cloud.google.com)
      logado como `@dritalojardim.com`.
- [ ] Ativar a **Google Calendar API**.
- [ ] Tela de consentimento OAuth: tipo **Externo**, nome "ORDO",
      e-mail de suporte, escopos `calendar.readonly` e `calendar.events`.
- [ ] Adicionar `neuropsicologo@dritalojardim.com` como **usuário de teste**
      (evita passar por verificação do Google enquanto o app for interno).
- [ ] Criar credencial **ID do cliente OAuth → Aplicativo da Web** com o
      redirect `https://SEU-DOMINIO/api/integrations/google/callback`.
- [ ] Enviar ao desenvolvedor (ou cadastrar no ambiente): `GOOGLE_CLIENT_ID` e
      `GOOGLE_CLIENT_SECRET`.
- [ ] No CRM: **Configurações → Integrações → Conectar Google Calendar** e
      escolher **PsicoManager**.

**Atenção:** enquanto o app estiver como "Em teste", o refresh token expira em
7 dias. Para uso contínuo, publicar o app (status "Em produção") — como usa
apenas escopos de calendário e é de uso próprio, normalmente não exige a
verificação completa do Google.

---

## 3. Meta Business — portfólio (verificação dispensada por ora)

> Enquanto o uso for interno, **pule a verificação do negócio**. Você só
> precisa do portfólio criado (gratuito, imediato). Faça a verificação apenas
> se um dia precisar passar de 250 contatos únicos por 24 horas.

### Se e quando for verificar

- [ ] Acessar [business.facebook.com](https://business.facebook.com) e
      confirmar/criar o portfólio empresarial de **ÍTALO PAIVA JARDIM LTDA**.
- [ ] Em **Configurações → Central de Segurança → Verificação da empresa**,
      enviar: CNPJ, comprovante de endereço da empresa e telefone/e-mail com o
      domínio próprio (`@dritalojardim.com` ajuda muito na aprovação).
- [ ] Verificar o **domínio** em Configurações → Domínios (via meta tag ou
      registro DNS).

Prazo comum: 2 a 15 dias úteis. Sem isto, o WhatsApp fica limitado e o
Instagram não passa no App Review.

---

## 4. WhatsApp Business Platform — via Coexistência (decidido)

**Decisão (13/08/2026): manter o mesmo número no celular e no CRM, usando
Coexistência (CoEx) através de um BSP.** Não haverá migração destrutiva nem
número novo.

### O que a coexistência entrega

- O número segue funcionando normalmente no **app WhatsApp Business** do
  celular **e** na Cloud API ao mesmo tempo.
- Mensagens respondidas no celular aparecem no CRM (webhooks
  `smb_message_echoes`); mensagens enviadas pelo CRM aparecem no celular.
- Sincroniza contatos e **até 6 meses** de histórico, uma única vez, mediante
  sua aprovação (janela de 24h para concluir a sincronização).

### Limitações que valem conhecer

| Limitação | Observação |
| --- | --- |
| **14 dias sem abrir** o app no celular derrubam a conexão da API | Uso diário resolve |
| Conversas em **grupo não sincronizam** | Atendimento comercial é 1:1 |
| Sem listas de transmissão, mensagens temporárias e "ver uma vez" | Verifique se usa listas hoje |
| Sem selo azul (OBA); alternativa é o Meta Verified | Estético/confiança |
| App precisa estar na versão **2.24.17+** | Só atualizar |
| Throughput fixo de 20 mensagens/segundo | Muito acima da necessidade |

### Por que via BSP

A coexistência exige onboarding por **Embedded Signup** de um Tech Provider ou
Solution Partner — não é possível ativar sozinho pelo painel da Meta. Duas
rotas:

- **Rota A (escolhida) — BSP** (360dialog, Zenvia, Wati, Twilio…): o BSP faz o
  Embedded Signup e absorve a burocracia; ativação em dias, sem App Review
  para você. Custo: mensalidade do BSP + custo de conversa da Meta.
  Preferir BSP que **repasse a própria Cloud API**, porque o adaptador do CRM
  já está escrito nesse formato e funciona quase sem mudança.
- **Rota B — CRM como Tech Provider**: sem intermediário, mas exige verificação
  do negócio, implementar o Embedded Signup e passar por App Review (semanas).
  Fica como evolução futura; a migração é natural porque o formato dos dados
  é o mesmo.

### Contingência documentada (não implementada)

Caso a coexistência oficial não se viabilize, existe o caminho **não oficial**
(bibliotecas que dirigem o WhatsApp Web, como Evolution API/Baileys). Decisão
do Ítalo em 13/08/2026: manter como **plano B**, não como caminho principal.
Riscos a considerar antes de acionar: viola os termos de uso do WhatsApp, com
risco de banimento do número, e faz o conteúdo das conversas transitar por
infraestrutura não oficial — relevante porque as conversas podem conter dados
de saúde sob sigilo profissional. Se for acionado, o CRM precisa apenas de um
novo adaptador: o núcleo, as tabelas e o inbox não mudam.

### Passos (Rota A)

- [ ] Atualizar o **app WhatsApp Business** do celular (versão 2.24.17+).
- [ ] Confirmar que o número tem histórico de uso recente (a Meta exige alguns
      dias de atividade para elegibilidade).
- [ ] Escolher o BSP e criar a conta. Ao comparar, perguntar explicitamente:
      *suporta coexistência?* e *repassa a Cloud API da Meta?*
- [ ] Fazer o **Embedded Signup** pelo painel do BSP, escolhendo a opção de
      coexistência e autorizando a sincronização do histórico.
- [ ] Concluir a sincronização dentro de **24 horas** do onboarding.
- [ ] Anotar as credenciais entregues pelo BSP: **WABA ID**, **Phone Number
      ID**, **token de acesso** e **App Secret**.
- [ ] Cadastrar o webhook: URL `https://SEU-DOMINIO/api/webhooks/meta`,
      token de verificação (uma senha aleatória que você define) e assinar os
      campos **messages** e **smb_message_echoes** (este último é o que traz
      para o CRM o que você responde pelo celular).
- [ ] Criar e submeter os **templates** de mensagem que serão usados fora da
      janela de 24 horas (ex.: retomada de contato, lembrete de sessão).

O CRM já responde ao handshake de verificação, confere a assinatura
`X-Hub-Signature-256` e ignora eventos repetidos.

---

## 5. Instagram Direct

- [ ] Confirmar que `@psi.italojardim` (ou a conta usada comercialmente) é
      **Conta Profissional** e está vinculada ao portfólio Meta.
- [ ] Em **Configurações do Instagram → Mensagens**, ativar o acesso de
      mensagens a ferramentas de terceiros.
- [ ] No app da Meta, adicionar o produto **Instagram** e solicitar a permissão
      `instagram_manage_messages` no **App Review**, com vídeo demonstrando o
      uso no CRM.
- [ ] Assinar o webhook de mensagens do Instagram na mesma URL
      (`/api/webhooks/meta`).

O App Review costuma ser o item mais demorado e pode exigir ajustes no vídeo ou
na descrição do caso de uso.

---

## 6. Quando as credenciais chegarem

Cadastrar no ambiente do servidor (nunca no navegador, nunca no git):

```
GOOGLE_CLIENT_ID=…
GOOGLE_CLIENT_SECRET=…
INTEGRATION_TOKEN_KEY=…        # openssl rand -base64 32
SUPABASE_SERVICE_ROLE_KEY=…
```

Os segredos da Meta (token de acesso, app secret, verify token) são gravados
**cifrados** na tabela `channel_connections` pela tela de integrações — não vão
para variáveis de ambiente e não são legíveis pela API, nem por administradores.

## 7. Como testar antes de ir para produção

| Teste | Como |
| --- | --- |
| Formulário | Enviar pelo `/f/contato` e conferir o lead no pipeline |
| Ingestão de mensagem | Configurações → Integrações → *Simular mensagem* (dev) |
| Idempotência | Reenviar o mesmo evento e confirmar que não duplica |
| Assinatura inválida | Chamar `/api/webhooks/meta` sem assinatura → 401 |
| WhatsApp real | Número de teste da Meta, enviar e responder pelo inbox |
| Calendar | Agendar no CRM e conferir o evento no PsicoManager |

## 8. Privacidade — decisões que acompanham as integrações

Ao ligar WhatsApp e Instagram, o CRM passa a armazenar **conversas reais**, que
podem conter conteúdo sensível de saúde. Antes de ativar em produção:

- [ ] Definir a política de retenção das conversas (default proposto:
      24 meses para mensagens, 90 dias para payloads brutos de webhook).
- [ ] Publicar o aviso de privacidade citado no formulário público.
- [ ] Validar com assessoria jurídica a base legal do tratamento.
- [ ] Decidir se o assistente pode ler todas as conversas ou apenas as dos
      leads sob sua responsabilidade (hoje: todas do workspace).
