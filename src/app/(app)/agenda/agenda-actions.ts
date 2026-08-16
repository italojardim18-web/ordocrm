"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionContext } from "@/lib/auth";
import { findConflicts } from "@/lib/calendar/conflicts";
import { getRemoteBusy, syncAppointmentToCalendar } from "@/lib/calendar/service";
import { createClient } from "@/lib/supabase/server";

export interface AgendaActionResult {
  success?: boolean;
  error?: string;
  warning?: string;
  conflicts?: Array<{ start: string; end: string; label?: string }>;
  appointmentId?: string;
}

const agendaAppointmentSchema = z.object({
  leadId: z.string().uuid().optional().nullable().or(z.literal("")),
  title: z.string().trim().min(1, "Informe o título do agendamento.").max(200),
  startsAt: z.string().min(1, "Informe a data e horário de início."),
  durationMinutes: z.coerce.number().int().min(15).max(480).default(60),
  description: z.string().trim().max(1000).optional().nullable(),
  withMeet: z.boolean().optional(),
  inviteLead: z.boolean().optional(),
});

/**
 * Cria um agendamento diretamente pela Agenda ou pelo Lead 360.
 * Sincroniza automaticamente com o Google Calendar caso esteja conectado.
 */
export async function createAgendaAppointmentAction(
  input: {
    leadId?: string | null;
    title: string;
    startsAt: string;
    durationMinutes: number;
    description?: string | null;
    withMeet?: boolean;
    inviteLead?: boolean;
    force?: boolean;
  }
): Promise<AgendaActionResult> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada. Faça login novamente." };

  const parsed = agendaAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Data ou horário de início inválido." };
  }

  const endsAt = new Date(startsAt.getTime() + parsed.data.durationMinutes * 60_000);
  const supabase = await createClient();

  // Verificação de conflitos (caso não tenha sido forçado)
  if (!input.force) {
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
        warning: `Conflito de horário detectado (${conflicts.length} compromisso(s) no mesmo período). Deseja agendar mesmo assim?`,
        conflicts,
      };
    }
  }

  // Obter e-mail do lead se for convidar
  let leadEmail: string | null = null;
  const leadId = parsed.data.leadId || null;

  if (leadId) {
    const { data: lead } = await supabase
      .from("leads")
      .select("email, name")
      .eq("id", leadId)
      .eq("workspace_id", context.workspace.id)
      .maybeSingle();

    if (lead?.email) leadEmail = lead.email;
  }

  const { data: appt, error } = await supabase
    .from("appointments")
    .insert({
      workspace_id: context.workspace.id,
      lead_id: leadId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "scheduled",
      created_by: context.user.id,
      calendar_sync_status: "pending",
    })
    .select("id")
    .single();

  if (error || !appt) {
    return { error: error?.message || "Não foi possível criar o agendamento." };
  }

  // Registrar atividade no Lead se vinculado
  if (leadId) {
    await supabase.from("activities").insert({
      workspace_id: context.workspace.id,
      lead_id: leadId,
      actor_id: context.user.id,
      type: "task",
      title: `Consulta agendada: ${parsed.data.title}`,
      description: `Início: ${startsAt.toLocaleDateString("pt-BR")} às ${startsAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`,
    });
  }

  // Sincronizar com Google Calendar de forma assíncrona/segura
  await syncAppointmentToCalendar(appt.id, {
    attendeeEmail: parsed.data.inviteLead && leadEmail ? leadEmail : null,
    withMeet: parsed.data.withMeet,
  });

  revalidatePath("/agenda");
  revalidatePath("/pipeline");
  if (leadId) {
    revalidatePath(`/pipeline/lead/${leadId}`);
  }

  return { success: true, appointmentId: appt.id };
}

/**
 * Atualiza o status de um agendamento (Realizada, Cancelada, Não compareceu).
 */
export async function updateAppointmentStatusAction(
  appointmentId: string,
  newStatus: "scheduled" | "completed" | "cancelled" | "no_show"
): Promise<AgendaActionResult> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();

  const { data: appt, error } = await supabase
    .from("appointments")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", appointmentId)
    .eq("workspace_id", context.workspace.id)
    .select("id, lead_id, title")
    .single();

  if (error || !appt) {
    return { error: error?.message || "Erro ao atualizar status do agendamento." };
  }

  // Se cancelada, atualiza no Google Calendar
  await syncAppointmentToCalendar(appointmentId);

  // Registrar atividade se houver lead
  if (appt.lead_id) {
    const labels: Record<string, string> = {
      completed: "Consulta marcada como Realizada",
      cancelled: "Consulta Cancelada",
      no_show: "Paciente Não Compareceu",
      scheduled: "Consulta Reagendada/Ativa",
    };

    await supabase.from("activities").insert({
      workspace_id: context.workspace.id,
      lead_id: appt.lead_id,
      actor_id: context.user.id,
      type: "task",
      title: `${labels[newStatus] || "Status atualizado"}: ${appt.title}`,
    });
  }

  revalidatePath("/agenda");
  revalidatePath("/pipeline");
  if (appt.lead_id) revalidatePath(`/pipeline/lead/${appt.lead_id}`);

  return { success: true };
}

/**
 * Reagenda um compromisso para nova data e horário.
 */
export async function rescheduleAppointmentAction(
  appointmentId: string,
  startsAtIso: string,
  durationMinutes: number = 60
): Promise<AgendaActionResult> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const startsAt = new Date(startsAtIso);
  if (Number.isNaN(startsAt.getTime())) return { error: "Data inválida." };
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  const supabase = await createClient();

  const { data: appt, error } = await supabase
    .from("appointments")
    .update({
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "scheduled",
      calendar_sync_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId)
    .eq("workspace_id", context.workspace.id)
    .select("id, lead_id, title")
    .single();

  if (error || !appt) {
    return { error: error?.message || "Erro ao reagendar compromisso." };
  }

  await syncAppointmentToCalendar(appointmentId);

  revalidatePath("/agenda");
  revalidatePath("/pipeline");
  if (appt.lead_id) revalidatePath(`/pipeline/lead/${appt.lead_id}`);

  return { success: true };
}

/**
 * Exclui um agendamento (soft delete).
 */
export async function deleteAppointmentAction(appointmentId: string): Promise<AgendaActionResult> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const supabase = await createClient();

  // Cancelar primeiro no Google Calendar
  await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId)
    .eq("workspace_id", context.workspace.id);

  await syncAppointmentToCalendar(appointmentId);

  // Soft delete no ORDO
  const { data: appt, error } = await supabase
    .from("appointments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", appointmentId)
    .eq("workspace_id", context.workspace.id)
    .select("id, lead_id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/agenda");
  revalidatePath("/pipeline");
  if (appt?.lead_id) revalidatePath(`/pipeline/lead/${appt.lead_id}`);

  return { success: true };
}

/**
 * Busca leads/pacientes do workspace para autocompletar na agenda.
 */
export async function searchLeadsForAgenda(query: string) {
  const context = await getSessionContext();
  if (!context) return [];

  const supabase = await createClient();

  let q = supabase
    .from("leads")
    .select("id, name, phone, email")
    .eq("workspace_id", context.workspace.id)
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(20);

  if (query.trim()) {
    q = q.or(`name.ilike.%${query.trim()}%,phone.ilike.%${query.trim()}%,email.ilike.%${query.trim()}%`);
  }

  const { data } = await q;
  return data ?? [];
}

/**
 * Dispara sincronização bidirecional sob demanda com o Google Calendar.
 */
export async function syncGoogleCalendarAction(): Promise<{
  success: boolean;
  syncedCount: number;
  message: string;
}> {
  const context = await getSessionContext();
  if (!context) return { success: false, syncedCount: 0, message: "Sessão expirada." };

  const supabase = await createClient();

  // Buscar agendamentos pendentes ou não sincronizados
  const { data: pendingAppts } = await supabase
    .from("appointments")
    .select("id")
    .eq("workspace_id", context.workspace.id)
    .is("deleted_at", null)
    .or("calendar_sync_status.eq.pending,calendar_sync_status.eq.error")
    .limit(50);

  let synced = 0;
  if (pendingAppts && pendingAppts.length > 0) {
    for (const item of pendingAppts) {
      const res = await syncAppointmentToCalendar(item.id);
      if (!res.error && !res.skipped) synced++;
    }
  }

  revalidatePath("/agenda");

  return {
    success: true,
    syncedCount: synced,
    message: synced > 0
      ? `${synced} compromisso(s) sincronizados com o Google Agenda!`
      : "Agenda sincronizada com o Google Agenda com sucesso.",
  };
}
