"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { findConflicts } from "@/lib/calendar/conflicts";
import { getRemoteBusy, syncAppointmentToCalendar } from "@/lib/calendar/service";
import { createClient } from "@/lib/supabase/server";

export interface CommercialState {
  error?: string;
  warning?: string;
  done?: boolean;
}

// -----------------------------------------------------------------------------
// Agendamentos
// -----------------------------------------------------------------------------

const appointmentSchema = z.object({
  title: z.string().trim().min(1, "Informe o título.").max(200),
  startsAt: z.string().min(1, "Informe a data e a hora."),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(15, "Duração mínima de 15 minutos.")
    .max(480),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  withMeet: z.string().optional(),
  inviteLead: z.string().optional(),
});

export async function createAppointment(
  leadId: string,
  force: boolean,
  _prev: CommercialState,
  formData: FormData,
): Promise<CommercialState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const parsed = appointmentSchema.safeParse({
    title: formData.get("title"),
    startsAt: formData.get("startsAt"),
    durationMinutes: formData.get("durationMinutes"),
    description: formData.get("description") ?? "",
    withMeet: formData.get("withMeet") ?? undefined,
    inviteLead: formData.get("inviteLead") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Data inválida." };
  }
  const endsAt = new Date(
    startsAt.getTime() + parsed.data.durationMinutes * 60_000,
  );

  const supabase = await createClient();

  // Conflitos: agendamentos do próprio CRM + ocupações do calendário conectado.
  if (!force) {
    const dayStart = new Date(startsAt);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(startsAt);
    dayEnd.setHours(23, 59, 59, 999);

    const { data: sameDay } = await supabase
      .from("appointments")
      .select("id, title, starts_at, ends_at")
      .eq("workspace_id", context.workspace.id)
      .eq("status", "scheduled")
      .is("deleted_at", null)
      .gte("starts_at", dayStart.toISOString())
      .lte("starts_at", dayEnd.toISOString());

    const localBusy = (sameDay ?? []).map((a) => ({
      start: a.starts_at,
      end: a.ends_at,
      label: a.title,
    }));

    const remoteBusy = await getRemoteBusy(
      context.workspace.id,
      dayStart.toISOString(),
      dayEnd.toISOString(),
    );

    const conflicts = findConflicts(
      startsAt.toISOString(),
      endsAt.toISOString(),
      [...localBusy, ...remoteBusy.map((b) => ({ ...b, label: "Google Calendar" }))],
    );

    if (conflicts.length > 0) {
      return {
        warning: `Conflito de horário com: ${conflicts
          .map((c) => c.label ?? "compromisso existente")
          .join(", ")}.`,
      };
    }
  }

  const { data: created, error } = await supabase
    .from("appointments")
    .insert({
      workspace_id: context.workspace.id,
      lead_id: leadId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      created_by: context.user.id,
    })
    .select("id")
    .single();

  if (error || !created) {
    return { error: "Não foi possível criar o agendamento." };
  }

  await supabase.from("activities").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    type: "system",
    content: `Sessão agendada: ${parsed.data.title}`,
    actor_id: context.user.id,
  });

  // Sugere mover para a etapa de sessão de alinhamento (nunca automático).
  const { data: lead } = await supabase
    .from("leads")
    .select("pipeline_id, stage_id, email")
    .eq("id", leadId)
    .single();

  let suggestion: string | undefined;
  if (lead) {
    const { data: sessionStage } = await supabase
      .from("pipeline_stages")
      .select("id, name")
      .eq("pipeline_id", lead.pipeline_id)
      .eq("stage_type", "alignment_session")
      .is("archived_at", null)
      .limit(1)
      .maybeSingle();

    if (sessionStage && lead.stage_id !== sessionStage.id) {
      suggestion = `Agendamento criado. Considere mover o lead para "${sessionStage.name}".`;
    }
  }

  const sync = await syncAppointmentToCalendar(created.id, {
    attendeeEmail: parsed.data.inviteLead ? (lead?.email ?? null) : null,
    withMeet: Boolean(parsed.data.withMeet),
  });

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");

  if (sync.error) {
    return {
      done: true,
      warning:
        "Agendamento salvo, mas a sincronização com o Google Calendar falhou. Verifique a integração.",
    };
  }

  return { done: true, warning: suggestion };
}

export async function setAppointmentStatus(
  appointmentId: string,
  leadId: string,
  status: "scheduled" | "completed" | "cancelled" | "no_show",
): Promise<{ error?: string }> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível atualizar a sessão." };

  const labels: Record<string, string> = {
    scheduled: "reagendada",
    completed: "realizada",
    cancelled: "cancelada",
    no_show: "sem comparecimento",
  };

  await supabase.from("activities").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    type: "system",
    content: `Sessão marcada como ${labels[status]}`,
    actor_id: context.user.id,
  });

  // Cancelamento remove o evento externo; demais estados atualizam o evento.
  await syncAppointmentToCalendar(appointmentId);

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return {};
}

// -----------------------------------------------------------------------------
// Oportunidades e vendas
// -----------------------------------------------------------------------------

function parseMoney(raw: FormDataEntryValue | null): number | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const value = Number(text.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function createOpportunity(
  leadId: string,
  _prev: CommercialState,
  formData: FormData,
): Promise<CommercialState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const productId = String(formData.get("productId") ?? "");
  if (!productId) return { error: "Escolha o produto." };

  const potentialValue = parseMoney(formData.get("potentialValue"));

  const supabase = await createClient();
  const { error } = await supabase.from("opportunities").insert({
    workspace_id: context.workspace.id,
    lead_id: leadId,
    product_id: productId,
    status: "open",
    potential_value: potentialValue,
    notes: String(formData.get("notes") ?? "").trim() || null,
    owner_id: context.user.id,
    created_by: context.user.id,
  });

  if (error) return { error: "Não foi possível criar a oportunidade." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  return { done: true };
}

export async function registerSale(
  leadId: string,
  _prev: CommercialState,
  formData: FormData,
): Promise<CommercialState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const productId = String(formData.get("productId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const soldValue = parseMoney(formData.get("soldValue"));
  const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();

  if (!productId) return { error: "Escolha o produto vendido." };
  if (soldValue === null) return { error: "Informe o valor da venda." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("register_sale", {
    p_lead_id: leadId,
    p_product_id: productId,
    p_sold_value: soldValue,
    p_payment_method: paymentMethod || null,
    p_opportunity_id: opportunityId || null,
  });

  if (error) return { error: "Não foi possível registrar a venda." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  revalidatePath("/pipeline");
  return { done: true };
}

export async function markOpportunityLost(
  opportunityId: string,
  leadId: string,
  reasonId: string | null,
): Promise<{ error?: string }> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_opportunity_lost", {
    p_opportunity_id: opportunityId,
    p_lost_reason_id: reasonId,
  });

  if (error) return { error: "Não foi possível fechar a oportunidade." };

  revalidatePath(`/pipeline/lead/${leadId}`);
  return {};
}
