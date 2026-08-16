import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { decryptToken, encryptToken } from "@/lib/crypto";
import {
  cancelEvent,
  freeBusy,
  getGoogleConfig,
  refreshAccessToken,
  upsertEvent,
} from "./google";

interface ConnectionRow {
  id: string;
  workspace_id: string;
  account_email: string | null;
  calendar_id: string | null;
  calendar_name: string | null;
  status: string;
  access_token_enc: string | null;
  refresh_token_enc: string | null;
  token_expires_at: string | null;
}

/** Conexão ativa do workspace (inclui tokens — apenas servidor). */
export async function getWorkspaceConnection(
  workspaceId: string,
): Promise<ConnectionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("calendar_connections")
    .select(
      "id, workspace_id, account_email, calendar_id, calendar_name, status, access_token_enc, refresh_token_enc, token_expires_at",
    )
    .eq("workspace_id", workspaceId)
    .eq("provider", "google")
    .eq("status", "connected")
    .limit(1)
    .maybeSingle<ConnectionRow>();
  return data ?? null;
}

/** Access token válido, renovando via refresh token quando necessário. */
export async function getFreshAccessToken(
  connection: ConnectionRow,
): Promise<string> {
  const config = getGoogleConfig();
  if (!config) throw new Error("credenciais Google ausentes");
  if (!connection.access_token_enc || !connection.refresh_token_enc) {
    throw new Error("conexão sem tokens");
  }

  const expiresAt = connection.token_expires_at
    ? new Date(connection.token_expires_at).getTime()
    : 0;

  if (expiresAt > Date.now() + 60_000) {
    return decryptToken(connection.access_token_enc);
  }

  const refreshed = await refreshAccessToken(
    config,
    decryptToken(connection.refresh_token_enc),
  );

  const admin = createAdminClient();
  await admin
    .from("calendar_connections")
    .update({
      access_token_enc: encryptToken(refreshed.access_token),
      token_expires_at: new Date(
        Date.now() + refreshed.expires_in * 1000,
      ).toISOString(),
    })
    .eq("id", connection.id);

  return refreshed.access_token;
}

interface AppointmentRow {
  id: string;
  workspace_id: string;
  lead_id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  calendar_event_id: string | null;
}

/**
 * Sincroniza um agendamento com o Google Calendar (best-effort, idempotente).
 * Sem conexão ativa, retorna { skipped: true } sem erro.
 */
export async function syncAppointmentToCalendar(
  appointmentId: string,
  options: { attendeeEmail?: string | null; withMeet?: boolean } = {},
): Promise<{ skipped?: boolean; error?: string }> {
  const admin = createAdminClient();

  const { data: appointment } = await admin
    .from("appointments")
    .select(
      "id, workspace_id, lead_id, title, description, starts_at, ends_at, status, calendar_event_id",
    )
    .eq("id", appointmentId)
    .maybeSingle<AppointmentRow>();

  if (!appointment) return { error: "agendamento não encontrado" };

  const connection = await getWorkspaceConnection(appointment.workspace_id);
  if (!connection?.calendar_id) return { skipped: true };

  const { data: workspace } = await admin
    .from("workspaces")
    .select("timezone")
    .eq("id", appointment.workspace_id)
    .single();

  try {
    const accessToken = await getFreshAccessToken(connection);

    if (appointment.status === "cancelled") {
      if (appointment.calendar_event_id) {
        await cancelEvent(
          accessToken,
          connection.calendar_id,
          appointment.calendar_event_id,
        );
      }
      await admin
        .from("appointments")
        .update({ calendar_sync_status: "synced", calendar_sync_error: null })
        .eq("id", appointment.id);
    } else {
      const event = await upsertEvent(accessToken, connection.calendar_id, {
        appointmentId: appointment.id,
        title: appointment.title,
        description: appointment.description,
        startsAt: appointment.starts_at,
        endsAt: appointment.ends_at,
        timezone: workspace?.timezone ?? "America/Campo_Grande",
        attendeeEmail: options.attendeeEmail ?? null,
        withMeet: options.withMeet ?? false,
      });
      await admin
        .from("appointments")
        .update({
          calendar_event_id: event.id,
          meet_link: event.hangoutLink ?? null,
          calendar_sync_status: "synced",
          calendar_sync_error: null,
        })
        .eq("id", appointment.id);
    }

    await admin.from("calendar_sync_events").insert({
      workspace_id: appointment.workspace_id,
      appointment_id: appointment.id,
      direction: "outbound",
      external_event_id: appointment.calendar_event_id,
      status: "synced",
    });

    return {};
  } catch (error) {
    const message =
      error instanceof Error ? error.message.slice(0, 300) : "erro de sync";
    await admin
      .from("appointments")
      .update({ calendar_sync_status: "error", calendar_sync_error: message })
      .eq("id", appointment.id);
    await admin.from("calendar_sync_events").insert({
      workspace_id: appointment.workspace_id,
      appointment_id: appointment.id,
      direction: "outbound",
      status: "error",
      error: message,
    });
    return { error: message };
  }
}

/** Conflitos remotos no calendário conectado (vazio quando não conectado). */
export async function getRemoteBusy(
  workspaceId: string,
  timeMin: string,
  timeMax: string,
): Promise<{ start: string; end: string }[]> {
  const connection = await getWorkspaceConnection(workspaceId);
  if (!connection?.calendar_id) return [];
  try {
    const accessToken = await getFreshAccessToken(connection);
    const { listCalendars } = await import("./google");
    const calendars = await listCalendars(accessToken);
    const calIds = calendars.length > 0 ? calendars.map((c) => c.id) : [connection.calendar_id];
    return await freeBusy(accessToken, calIds, timeMin, timeMax);
  } catch {
    return [];
  }
}

const googleEventsCache = new Map<string, { data: import("./google").GoogleEventResumo[]; timestamp: number }>();

/** Limpa cache de eventos quando há novo agendamento ou sincronização forçada */
export function invalidateGoogleEventsCache(workspaceId?: string) {
  if (!workspaceId) {
    googleEventsCache.clear();
    return;
  }
  for (const key of googleEventsCache.keys()) {
    if (key.startsWith(workspaceId)) {
      googleEventsCache.delete(key);
    }
  }
}

/**
 * Eventos do Google no intervalo.
 * Busca os eventos de TODAS as agendas do usuário (Pessoal, PsicoManager, etc.)
 * e anexa o nome do calendário de origem a cada evento.
 * Possui cache em memória de 60s para renderização instantânea da agenda.
 */
export async function listarEventosGoogle(
  workspaceId: string,
  timeMin: string,
  timeMax: string,
  forceRefresh = false,
) {
  const cacheKey = `${workspaceId}:${timeMin}:${timeMax}`;
  const cached = googleEventsCache.get(cacheKey);

  if (!forceRefresh && cached && Date.now() - cached.timestamp < 60_000) {
    return cached.data;
  }

  const connection = await getWorkspaceConnection(workspaceId);
  if (!connection?.calendar_id) return [];

  try {
    // Timeout de 2000ms para nunca travar a página caso a API do Google esteja lenta
    const fetchPromise = (async () => {
      const accessToken = await getFreshAccessToken(connection);
      const { listCalendars, listEvents } = await import("./google");
      const calendars = await listCalendars(accessToken);

      const calsToFetch = calendars.length > 0
        ? calendars
        : [{ id: connection.calendar_id || "primary", summary: connection.calendar_name || "Principal", backgroundColor: undefined }];

      const results = await Promise.allSettled(
        calsToFetch.map(async (cal) => {
          if (!cal.id) return [];
          const events = await listEvents(accessToken, cal.id, timeMin, timeMax);
          return events.map((ev) => ({
            ...ev,
            calendarId: cal.id ?? undefined,
            calendarName: cal.summary || "Google Agenda",
            calendarColor: "backgroundColor" in cal ? (cal.backgroundColor as string | undefined) : undefined,
          }));
        }),
      );

      const todosEventos: import("./google").GoogleEventResumo[] = [];
      for (const res of results) {
        if (res.status === "fulfilled") {
          todosEventos.push(...res.value);
        }
      }

      // Salva no cache por 60 segundos
      googleEventsCache.set(cacheKey, { data: todosEventos, timestamp: Date.now() });

      return todosEventos;
    })();

    const timeoutPromise = new Promise<import("./google").GoogleEventResumo[]>((resolve) =>
      setTimeout(() => resolve(cached?.data ?? []), 2000),
    );

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return cached?.data ?? [];
  }
}
