import { describe, expect, it } from "vitest";
import {
  computeLeadTemperature,
  TEMPERATURE_CONFIG,
} from "@/lib/crm/temperature";

describe("computeLeadTemperature", () => {
  const BASE_TIME = new Date("2026-08-14T12:00:00Z");

  it("prioriza override manual quando presente", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-14T11:00:00Z",
        last_interaction_at: "2026-08-14T11:30:00Z",
        temperature_override: "cold",
        temperature_override_at: "2026-08-14T11:45:00Z",
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("cold");
    expect(res.isOverride).toBe(true);
    expect(res.reason).toContain("manualmente");
  });

  it("classifica como hot quando interagiu nas últimas 24h", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-10T10:00:00Z",
        last_interaction_at: "2026-08-14T10:00:00Z", // 2h atrás
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("hot");
    expect(res.isOverride).toBe(false);
    expect(res.reason).toContain("últimas 24h");
  });

  it("classifica como hot quando interagiu entre 24h e 48h", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-10T10:00:00Z",
        last_interaction_at: "2026-08-13T00:00:00Z", // 36h atrás
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("hot");
    expect(res.isOverride).toBe(false);
    expect(res.reason).toContain("últimas 48h");
  });

  it("classifica como warm quando interagiu entre 2 e 7 dias atrás", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-01T10:00:00Z",
        last_interaction_at: "2026-08-10T12:00:00Z", // 4 dias atrás
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("warm");
    expect(res.isOverride).toBe(false);
    expect(res.reason).toContain("4 dia(s)");
  });

  it("classifica como cold quando interagiu há mais de 7 dias", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-01T10:00:00Z",
        last_interaction_at: "2026-08-05T12:00:00Z", // 9 dias atrás
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("cold");
    expect(res.isOverride).toBe(false);
    expect(res.reason).toContain("Sem contato");
  });

  it("trata novo lead sem interação há menos de 24h como warm", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-14T06:00:00Z", // 6h atrás
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("warm");
    expect(res.isOverride).toBe(false);
    expect(res.reason).toContain("Novo lead");
  });

  it("trata lead sem interação há mais de 24h como cold", () => {
    const res = computeLeadTemperature(
      {
        created_at: "2026-08-12T06:00:00Z", // 2 dias atrás
      },
      BASE_TIME,
    );

    expect(res.temperature).toBe("cold");
    expect(res.isOverride).toBe(false);
  });

  it("possui configurações visuais para todas as temperaturas", () => {
    expect(TEMPERATURE_CONFIG.hot.emoji).toBeDefined();
    expect(TEMPERATURE_CONFIG.warm.emoji).toBeDefined();
    expect(TEMPERATURE_CONFIG.cold.emoji).toBeDefined();
  });
});
