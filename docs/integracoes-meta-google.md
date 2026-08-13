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
| WhatsApp Cloud API | Pronto (webhook, ingestão, envio) | Verificação do Meta Business + número | 3–15 dias |
| Instagram Direct | Pronto (mesmo webhook) | Conta profissional + App Review | 7–30 dias |
| Meta Lead Ads | Estrutura pronta | Depende dos itens acima | pós-MVP |

**Comece pela verificação do Meta Business hoje** — é o item de maior prazo e
tudo da Meta depende dele.

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
- [ ] Tela de consentimento OAuth: tipo **Externo**, nome "Praxis Mentis CRM",
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

## 3. Meta Business — verificação da empresa (comece por aqui)

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

## 4. WhatsApp Business Platform (Cloud API)

**Decisão pendente importante (nº 5 do plano):** qual número usar.

- Se o número atual já está no **app WhatsApp Business**, migrá-lo para a
  Cloud API **desativa o app** naquele número — a conversa passa a acontecer
  só pelo CRM/API. É reversível, mas com atrito.
- Alternativa mais segura: **número novo dedicado** ao CRM, mantendo o atual no
  celular durante a transição.

Passos:

- [ ] Em [developers.facebook.com](https://developers.facebook.com), criar um
      app do tipo **Empresa** e adicionar o produto **WhatsApp**.
- [ ] Vincular o app ao portfólio empresarial verificado (passo 3).
- [ ] Adicionar o número em **WhatsApp → Configuração da API** e concluir a
      verificação por SMS/ligação.
- [ ] Anotar: **WABA ID**, **Phone Number ID**, **token de acesso permanente**
      (token de usuário do sistema, não o temporário de 24h) e o **App Secret**.
- [ ] Cadastrar o webhook: URL `https://SEU-DOMINIO/api/webhooks/meta`,
      token de verificação (uma senha aleatória que você define) e assinar o
      campo **messages**.
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
