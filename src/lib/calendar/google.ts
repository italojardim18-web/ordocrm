/**
 * Adaptador oficial do Google Calendar (REST v3) — sem SDKs, apenas fetch.
 * Idempotência: todo evento criado pelo CRM carrega
 * extendedProperties.private.praxis_appointment_id; antes de criar, buscamos
 * por essa propriedade para nunca duplicar.
 *
 * Este módulo não guarda estado: tokens chegam por parâmetro (decifrados no
 * servidor) e nunca tocam o navegador.
 */

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

export function getGoogleConfig(): GoogleConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
].join(" ");

export function buildAuthUrl(
  config: GoogleConfig,
  redirectUri: string,
  state: string,
): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
}

export async function exchangeCode(
  config: GoogleConfig,
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  if (!response.ok) {
    throw new Error(`google token exchange failed: ${response.status}`);
  }
  return response.json();
}

export async function refreshAccessToken(
  config: GoogleConfig,
  refreshToken: string,
): Promise<TokenResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) {
    throw new Error(`google token refresh failed: ${response.status}`);
  }
  return response.json();
}

export async function revokeToken(token: string): Promise<void> {
  await fetch("https://oauth2.googleapis.com/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }),
  });
}

/** E-mail da conta, extraído do id_token (JWT) sem validação extra:
 *  veio direto do endpoint de token do Google via TLS. */
export function emailFromIdToken(idToken: string | undefined): string | null {
  if (!idToken) return null;
  try {
    const payload = idToken.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    return typeof decoded.email === "string" ? decoded.email : null;
  } catch {
    return null;
  }
}

const CAL = "https://www.googleapis.com/calendar/v3";

async function googleFetch<T>(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${CAL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`google api ${response.status}: ${body.slice(0, 300)}`);
  }
  return response.json();
}

export interface GoogleCalendarInfo {
  id: string;
  summary: string;
  primary?: boolean;
}

export async function listCalendars(
  accessToken: string,
): Promise<GoogleCalendarInfo[]> {
  const data = await googleFetch<{ items?: GoogleCalendarInfo[] }>(
    accessToken,
    "/users/me/calendarList?minAccessRole=writer",
  );
  return data.items ?? [];
}

export interface AppointmentEventInput {
  appointmentId: string;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  attendeeEmail?: string | null;
  withMeet?: boolean;
}

/** Corpo do evento (exportado para testes de contrato). */
export function buildEventPayload(input: AppointmentEventInput) {
  return {
    summary: input.title,
    description: input.description ?? undefined,
    start: { dateTime: input.startsAt, timeZone: input.timezone },
    end: { dateTime: input.endsAt, timeZone: input.timezone },
    attendees: input.attendeeEmail
      ? [{ email: input.attendeeEmail }]
      : undefined,
    extendedProperties: {
      private: { praxis_appointment_id: input.appointmentId },
    },
    conferenceData: input.withMeet
      ? {
          createRequest: {
            requestId: `praxis-${input.appointmentId}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        }
      : undefined,
  };
}

interface GoogleEvent {
  id: string;
  status?: string;
  hangoutLink?: string;
  htmlLink?: string;
}

export async function findEventByAppointment(
  accessToken: string,
  calendarId: string,
  appointmentId: string,
): Promise<GoogleEvent | null> {
  const params = new URLSearchParams({
    privateExtendedProperty: `praxis_appointment_id=${appointmentId}`,
    showDeleted: "false",
    maxResults: "1",
  });
  const data = await googleFetch<{ items?: GoogleEvent[] }>(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
  );
  return data.items?.[0] ?? null;
}

/** Cria ou atualiza o evento do agendamento (idempotente). */
export async function upsertEvent(
  accessToken: string,
  calendarId: string,
  input: AppointmentEventInput,
): Promise<GoogleEvent> {
  const payload = buildEventPayload(input);
  const existing = await findEventByAppointment(
    accessToken,
    calendarId,
    input.appointmentId,
  );

  if (existing) {
    return googleFetch<GoogleEvent>(
      accessToken,
      `/calendars/${encodeURIComponent(calendarId)}/events/${existing.id}?conferenceDataVersion=1`,
      { method: "PATCH", body: JSON.stringify(payload) },
    );
  }

  return googleFetch<GoogleEvent>(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export async function cancelEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
): Promise<void> {
  const response = await fetch(
    `${CAL}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  // 404/410: evento já removido — idempotente.
  if (!response.ok && response.status !== 404 && response.status !== 410) {
    throw new Error(`google delete failed: ${response.status}`);
  }
}

/** Períodos ocupados no calendário (detecção de conflito remoto). */
export async function freeBusy(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<{ start: string; end: string }[]> {
  const data = await googleFetch<{
    calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
  }>(accessToken, "/freeBusy", {
    method: "POST",
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    }),
  });
  return data.calendars?.[calendarId]?.busy ?? [];
}

export interface GoogleEventResumo {
  id: string;
  titulo: string;
  inicio: string | null;
  fim: string | null;
  diaInteiro: boolean;
  link: string | null;
}

/**
 * Eventos do calendário num intervalo, já achatados (recorrências expandidas).
 * Usado para desenhar a agenda — por isso traz título, ao contrário do
 * free/busy, que só devolve blocos ocupados.
 */
export async function listEvents(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<GoogleEventResumo[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });

  const data = await googleFetch<{
    items?: {
      id: string;
      summary?: string;
      htmlLink?: string;
      status?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
    }[];
  }>(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events?${params}`);

  return (data.items ?? [])
    .filter((e) => e.status !== "cancelled")
    .map((e) => ({
      id: e.id,
      titulo: e.summary ?? "(sem título)",
      inicio: e.start?.dateTime ?? e.start?.date ?? null,
      fim: e.end?.dateTime ?? e.end?.date ?? null,
      diaInteiro: Boolean(e.start?.date && !e.start?.dateTime),
      link: e.htmlLink ?? null,
    }));
}
