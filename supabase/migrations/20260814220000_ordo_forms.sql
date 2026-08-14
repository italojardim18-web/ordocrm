-- Migration: Adicionar schema, theme, settings, folder e métricas em form_endpoints
ALTER TABLE public.form_endpoints
ADD COLUMN IF NOT EXISTS schema JSONB DEFAULT '{"welcome":{"title":"Bem-vindo","description":"Por favor, preencha as informações abaixo para iniciarmos seu atendimento.","buttonText":"Iniciar"},"questions":[{"id":"q_nome","type":"text","title":"Qual é o seu nome completo?","placeholder":"Seu nome","required":true,"mapsTo":"name"},{"id":"q_phone","type":"phone","title":"Qual é o seu WhatsApp com DDD?","placeholder":"(00) 00000-0000","required":true,"mapsTo":"phone"},{"id":"q_email","type":"email","title":"Qual o seu melhor e-mail?","placeholder":"seu@email.com","required":false,"mapsTo":"email"},{"id":"q_motivo","type":"textarea","title":"Conte brevemente o que você busca ou o motivo do contato:","placeholder":"Descreva aqui...","required":false,"mapsTo":"notes"}],"thankyou":{"title":"Obrigado!","description":"Recebemos suas informações com sucesso. Nossa equipe entrará em contato em breve."}}'::jsonb,
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"primaryColor":"#521D2A","backgroundColor":"#F2EEE7","cardBackground":"#FFFFFF","borderRadius":"1rem"}'::jsonb,
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"autoCreateLead":true,"notifyEmail":true,"redirectUrl":""}'::jsonb,
ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'Geral',
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS submissions_count INTEGER DEFAULT 0;

-- Criar tabela de pastas se não existir
CREATE TABLE IF NOT EXISTS public.form_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_folders_workspace_isolation"
  ON public.form_folders
  FOR ALL
  USING (workspace_id = (auth.jwt() -> 'app_metadata' ->> 'workspace_id')::uuid)
  WITH CHECK (workspace_id = (auth.jwt() -> 'app_metadata' ->> 'workspace_id')::uuid);
