import { describe, expect, it } from "vitest";
import { findConflicts, periodsOverlap } from "@/lib/calendar/conflicts";
import { buildEventPayload, emailFromIdToken } from "@/lib/calendar/google";

describe("detecção de conflito de horário", () => {
  it("períodos que se sobrepõem conflitam", () => {
    expect(
      periodsOverlap(
        "2026-08-20T10:00:00Z",
        "2026-08-20T11:00:00Z",
        "2026-08-20T10:30:00Z",
        "2026-08-20T11:30:00Z",
      ),
    ).toBe(true);
  });

  it("períodos encostados não conflitam", () => {
    expect(
      periodsOverlap(
        "2026-08-20T10:00:00Z",
        "2026-08-20T11:00:00Z",
        "2026-08-20T11:00:00Z",
        "2026-08-20T12:00:00Z",
      ),
    ).toBe(false);
  });

  it("período contido dentro de outro conflita", () => {
    expect(
      periodsOverlap(
        "2026-08-20T10:15:00Z",
        "2026-08-20T10:45:00Z",
        "2026-08-20T10:00:00Z",
        "2026-08-20T12:00:00Z",
      ),
    ).toBe(true);
  });

  it("findConflicts devolve apenas os períodos sobrepostos", () => {
    const conflicts = findConflicts(
      "2026-08-20T14:00:00Z",
      "2026-08-20T15:00:00Z",
      [
        { start: "2026-08-20T09:00:00Z", end: "2026-08-20T10:00:00Z", label: "manhã" },
        { start: "2026-08-20T14:30:00Z", end: "2026-08-20T16:00:00Z", label: "sessão" },
      ],
    );
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].label).toBe("sessão");
  });
});

describe("payload de evento do Google Calendar", () => {
  const base = {
    appointmentId: "abc-123",
    title: "Sessão de alinhamento",
    startsAt: "2026-08-20T14:00:00Z",
    endsAt: "2026-08-20T15:00:00Z",
    timezone: "America/Campo_Grande",
  };

  it("carrega a chave de idempotência nas propriedades privadas", () => {
    const payload = buildEventPayload(base);
    expect(payload.extendedProperties.private.praxis_appointment_id).toBe(
      "abc-123",
    );
  });

  it("não inclui participantes sem e-mail do lead", () => {
    expect(buildEventPayload(base).attendees).toBeUndefined();
    expect(
      buildEventPayload({ ...base, attendeeEmail: "lead@example.com" })
        .attendees,
    ).toEqual([{ email: "lead@example.com" }]);
  });

  it("só pede Meet quando solicitado, com requestId estável", () => {
    expect(buildEventPayload(base).conferenceData).toBeUndefined();
    const withMeet = buildEventPayload({ ...base, withMeet: true });
    expect(withMeet.conferenceData?.createRequest.requestId).toBe(
      "praxis-abc-123",
    );
  });

  it("envia o fuso do workspace junto com os horários", () => {
    const payload = buildEventPayload(base);
    expect(payload.start.timeZone).toBe("America/Campo_Grande");
    expect(payload.end.dateTime).toBe("2026-08-20T15:00:00Z");
  });
});

describe("emailFromIdToken", () => {
  it("extrai o e-mail do payload do JWT", () => {
    const payload = Buffer.from(
      JSON.stringify({ email: "pessoa@example.com" }),
    ).toString("base64url");
    expect(emailFromIdToken(`header.${payload}.sig`)).toBe(
      "pessoa@example.com",
    );
  });

  it("devolve null para token ausente ou malformado", () => {
    expect(emailFromIdToken(undefined)).toBeNull();
    expect(emailFromIdToken("não-é-jwt")).toBeNull();
  });
});
