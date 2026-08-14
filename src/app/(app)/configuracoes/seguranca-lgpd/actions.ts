"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const uuid = z.uuid();

/**
 * 1. Exportação / Portabilidade de Dados do Paciente (Art. 18, V da LGPD).
 * Gera o dossiê completo de dados cadastrais, histórico clínico e mensagens.
 */
export async function exportLeadDataLGPD(leadId: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "ID de lead inválido." };

  const supabase = await createClient();

  const [
    { data: lead },
    { data: appointments },
    { data: notes },
    { data: activities },
    { data: conversations },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id, name, phone, email, channel, created_at, first_contact_at, engaged_at, consent_status, consent_purpose, consent_at, is_anonymized")
      .eq("id", leadId)
      .eq("workspace_id", context.workspace.id)
      .single(),
    supabase
      .from("appointments")
      .select("id, title, starts_at, ends_at, location, meet_url")
      .eq("lead_id", leadId)
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("notes")
      .select("id, content, created_at")
      .eq("lead_id", leadId)
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("activities")
      .select("id, type, content, created_at")
      .eq("lead_id", leadId)
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("conversations")
      .select("id, provider, external_conversation_id, messages (id, direction, body, sent_at, media_type, transcript_text)")
      .eq("lead_id", leadId)
      .eq("workspace_id", context.workspace.id),
  ]);

  if (!lead) return { error: "Lead não encontrado." };

  const dossie = {
    titular: {
      id: lead.id,
      nome: lead.name,
      telefone: lead.phone,
      email: lead.email,
      origem: lead.channel,
      cadastrado_em: lead.created_at,
      primeiro_contato: lead.first_contact_at,
      engajado_em: lead.engaged_at,
    },
    consentimento_lgpd: {
      status: lead.consent_status,
      finalidade: lead.consent_purpose,
      data_consentimento: lead.consent_at,
      anonimizado: lead.is_anonymized,
    },
    agendamentos_e_consultas: appointments ?? [],
    anotacoes_clinicas: notes ?? [],
    historico_atividades: activities ?? [],
    conversas_whatsapp: conversations ?? [],
    gerado_em: new Date().toISOString(),
    gerado_por: {
      usuario_id: context.user.id,
      email: context.user.email,
      workspace: context.workspace.name,
    },
    conformidade: "Lei Geral de Proteção de Dados (Lei nº 13.709/2018) - Art. 18",
  };

  // Registra no Log de Auditoria Imutável
  const admin = createAdminClient();
  await admin.from("audit_logs").insert({
    workspace_id: context.workspace.id,
    actor_id: context.user.id,
    action: "lgpd_data_exported",
    entity_type: "lead",
    entity_id: leadId,
    details: {
      titular_nome: lead.name,
      exportado_por: context.user.email,
      timestamp: new Date().toISOString(),
    },
  });

  return { success: true, data: dossie };
}

/**
 * 2. Anonimização / Direito ao Esquecimento (Art. 18, VI da LGPD).
 * Ofusca dados pessoais identificáveis mantendo integridade analítica contábil.
 */
export async function anonymizeLeadLGPD(leadId: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  if (context.membership.role !== "admin") {
    return { error: "Apenas o administrador / DPO pode realizar a anonimização de dados." };
  }

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "ID de lead inválido." };

  const admin = createAdminClient();
  const shortId = leadId.slice(-4).toUpperCase();
  const nomeAnonimizado = `Paciente Anonimizado #${shortId}`;

  // 1. Atualiza o lead
  const { error: leadErr } = await admin
    .from("leads")
    .update({
      name: nomeAnonimizado,
      phone: null,
      email: null,
      source_detail: "Anonimizado sob solicitação do titular (LGPD Art. 18)",
      is_anonymized: true,
      anonymized_at: new Date().toISOString(),
      consent_status: "revoked",
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (leadErr) {
    return { error: "Erro ao anonimizar lead: " + leadErr.message };
  }

  // 2. Ofusca identificadores externos
  await admin
    .from("external_identities")
    .update({ display_name: nomeAnonimizado })
    .eq("lead_id", leadId)
    .eq("workspace_id", context.workspace.id);

  // 3. Registra na Auditoria
  await admin.from("audit_logs").insert({
    workspace_id: context.workspace.id,
    actor_id: context.user.id,
    action: "lgpd_lead_anonymized",
    entity_type: "lead",
    entity_id: leadId,
    details: {
      novo_identificador: nomeAnonimizado,
      executado_por: context.user.email,
      data: new Date().toISOString(),
    },
  });

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  revalidatePath("/contatos");
  revalidatePath("/configuracoes/seguranca-lgpd");

  return { success: true, newName: nomeAnonimizado };
}

/**
 * 3. Atualização de Consentimento do Paciente
 */
export async function updateConsentStatus(
  leadId: string,
  status: "granted" | "revoked" | "pending",
  purpose: string,
) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  const parsed = uuid.safeParse(leadId);
  if (!parsed.success) return { error: "ID inválido." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("leads")
    .update({
      consent_status: status,
      consent_purpose: purpose.trim(),
      consent_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: error.message };

  await admin.from("audit_logs").insert({
    workspace_id: context.workspace.id,
    actor_id: context.user.id,
    action: "lgpd_consent_updated",
    entity_type: "lead",
    entity_id: leadId,
    details: { status, purpose, timestamp: new Date().toISOString() },
  });

  revalidatePath(`/pipeline/lead/${leadId}`);
  return { success: true };
}

/**
 * 4. Configurações de DPO / Governança do Workspace
 */
export async function updateDpoSettings(params: {
  dpoName: string;
  dpoEmail: string;
  dpoPhone?: string;
  retentionDays: number;
  privacyPolicy?: string;
}) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  if (context.membership.role !== "admin") {
    return { error: "Apenas administradores podem alterar as políticas de segurança." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("workspaces")
    .update({
      dpo_name: params.dpoName.trim(),
      dpo_email: params.dpoEmail.trim(),
      dpo_phone: params.dpoPhone?.trim() || null,
      data_retention_days: params.retentionDays,
      privacy_policy_text: params.privacyPolicy?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", context.workspace.id);

  if (error) return { error: error.message };

  await admin.from("audit_logs").insert({
    workspace_id: context.workspace.id,
    actor_id: context.user.id,
    action: "lgpd_privacy_terms_updated",
    entity_type: "workspace",
    entity_id: context.workspace.id,
    details: {
      dpo_name: params.dpoName,
      dpo_email: params.dpoEmail,
      retention_days: params.retentionDays,
    },
  });

  revalidatePath("/configuracoes/seguranca-lgpd");
  return { success: true };
}
