import { describe, expect, it } from "vitest";
import { isStageLost } from "@/lib/crm/stages";

describe("isStageLost", () => {
  it("returns false for null or undefined", () => {
    expect(isStageLost(null)).toBe(false);
    expect(isStageLost(undefined)).toBe(false);
  });

  it("identifies stage by semantic stage_type 'lost'", () => {
    expect(isStageLost({ stage_type: "lost", name: "Qualquer Nome" })).toBe(true);
  });

  it("identifies stages with common Portuguese loss variations by name", () => {
    expect(isStageLost({ stage_type: "custom", name: "Perdido" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Perdidos" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Perda" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Perdas" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Desistência" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Desistencia" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Desistentes" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Desistiu" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Cancelado" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Cancelamento" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Sem Interesse" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Não compareceu" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "No-Show" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Lead Perdido" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Funil Perdidos" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Lost" })).toBe(true);
    expect(isStageLost({ stage_type: "custom", name: "Descartado" })).toBe(true);
  });

  it("returns false for non-lost stages", () => {
    expect(isStageLost({ stage_type: "new", name: "Novo lead" })).toBe(false);
    expect(isStageLost({ stage_type: "qualification", name: "Qualificação" })).toBe(false);
    expect(isStageLost({ stage_type: "follow_up_pre_session", name: "Follow-up pré-sessão" })).toBe(false);
    expect(isStageLost({ stage_type: "alignment_session", name: "Sessão de alinhamento" })).toBe(false);
    expect(isStageLost({ stage_type: "follow_up_post_session", name: "Follow-up pós-sessão" })).toBe(false);
    expect(isStageLost({ stage_type: "won", name: "Venda realizada" })).toBe(false);
    expect(isStageLost({ stage_type: "custom", name: "Agendado" })).toBe(false);
    expect(isStageLost({ stage_type: "custom", name: "Em atendimento" })).toBe(false);
  });
});
