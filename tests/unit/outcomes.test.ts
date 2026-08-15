import { describe, expect, it } from "vitest";
import {
  lossesByReason,
  revenueByProduct,
  summarizeOutcomes,
} from "@/lib/crm/outcomes";
import type { CommercialOutcomeRow } from "@/lib/crm/types";

function linha(over: Partial<CommercialOutcomeRow>): CommercialOutcomeRow {
  return {
    opportunity_id: "o1",
    lead_id: "l1",
    lead_name: "Lead",
    product_id: null,
    product_name: null,
    status: "won",
    potential_value: null,
    sold_value: null,
    payment_method: null,
    closed_at: "2026-08-14T12:00:00Z",
    owner_id: null,
    channel: "whatsapp",
    lost_reason: null,
    ...over,
  };
}

describe("resumo do resultado comercial", () => {
  it("period sem fechamento não inventa média nem taxa", () => {
    const resumo = summarizeOutcomes([]);
    expect(resumo.won).toBe(0);
    expect(resumo.lost).toBe(0);
    expect(resumo.revenue).toBe(0);
    // Nulo, não zero: "ticket de R$ 0,00" seria uma afirmação falsa.
    expect(resumo.averageTicket).toBeNull();
    expect(resumo.closeRate).toBeNull();
  });

  it("soma receita das ganhas e potencial das perdidas separadamente", () => {
    const resumo = summarizeOutcomes([
      linha({ status: "won", sold_value: 1000 }),
      linha({ status: "won", sold_value: 500 }),
      linha({ status: "lost", potential_value: 800 }),
    ]);

    expect(resumo.won).toBe(2);
    expect(resumo.lost).toBe(1);
    expect(resumo.revenue).toBe(1500);
    expect(resumo.averageTicket).toBe(750);
    expect(resumo.lostPotential).toBe(800);
    expect(resumo.closeRate).toBeCloseTo(2 / 3);
  });

  it("valor vendido ausente não quebra a soma", () => {
    const resumo = summarizeOutcomes([
      linha({ status: "won", sold_value: null }),
      linha({ status: "won", sold_value: 300 }),
    ]);
    expect(resumo.revenue).toBe(300);
    expect(resumo.averageTicket).toBe(150);
  });

  it("só ganhas entram no ticket médio", () => {
    const resumo = summarizeOutcomes([
      linha({ status: "won", sold_value: 1000 }),
      linha({ status: "lost", potential_value: 9000 }),
    ]);
    // A perda não pode diluir o ticket: 1000 / 1, não 1000 / 2.
    expect(resumo.averageTicket).toBe(1000);
    expect(resumo.closeRate).toBe(0.5);
  });
});

describe("agrupamentos", () => {
  it("receita por produto ignora perdidas e ordena pelo maior valor", () => {
    const grupos = revenueByProduct([
      linha({ status: "won", product_name: "Avaliação", sold_value: 400 }),
      linha({ status: "won", product_name: "Terapia", sold_value: 900 }),
      linha({ status: "won", product_name: "Avaliação", sold_value: 200 }),
      linha({ status: "lost", product_name: "Terapia", potential_value: 5000 }),
    ]);

    expect(grupos.map((g) => g.label)).toEqual(["Terapia", "Avaliação"]);
    expect(grupos[0]).toMatchObject({ count: 1, value: 900 });
    expect(grupos[1]).toMatchObject({ count: 2, value: 600 });
  });

  it("venda sem produto vira 'Sem produto' em vez de sumir", () => {
    const grupos = revenueByProduct([
      linha({ status: "won", product_name: null, sold_value: 100 }),
    ]);
    expect(grupos).toHaveLength(1);
    expect(grupos[0].label).toBe("Sem produto");
  });

  it("perda sem motivo aparece como 'Não informado'", () => {
    const grupos = lossesByReason([
      linha({ status: "lost", lost_reason: "Preço", potential_value: 300 }),
      linha({ status: "lost", lost_reason: null, potential_value: 700 }),
    ]);

    // O buraco de registro precisa ficar visível: é o que mostra que o
    // processo está deixando de anotar o motivo.
    expect(grupos.map((g) => g.label)).toEqual(["Não informado", "Preço"]);
    expect(grupos[0].value).toBe(700);
  });

  it("ganhas não entram nos motivos de perda", () => {
    const grupos = lossesByReason([
      linha({ status: "won", sold_value: 1000 }),
    ]);
    expect(grupos).toHaveLength(0);
  });
});
