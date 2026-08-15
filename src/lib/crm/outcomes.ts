import type { CommercialOutcomeRow } from "./types";

/**
 * Agregações do resultado comercial.
 *
 * Ficam aqui, puras, e não dentro da página: são fórmulas que precisam ser
 * testáveis e explicáveis. A convenção do projeto é a mesma do dashboard —
 * nenhum número aparece na tela sem que dê para dizer de onde saiu.
 *
 * Sobre as datas: a `commercial_outcomes` filtra por `closed_at`, então tudo
 * aqui é "o que fechou no período", não "o que entrou no período".
 */

export interface OutcomeSummary {
  /** Oportunidades ganhas no período. */
  won: number;
  /** Oportunidades perdidas no período. */
  lost: number;
  /** Soma de `sold_value` das ganhas. Perdida não tem valor vendido. */
  revenue: number;
  /**
   * Receita ÷ ganhas. Nulo quando não houve venda — média de nada é enganosa,
   * e zero pareceria "ticket de R$ 0,00".
   */
  averageTicket: number | null;
  /** Ganhas ÷ (ganhas + perdidas). Nulo quando nada fechou no período. */
  closeRate: number | null;
  /**
   * Potencial perdido: soma de `potential_value` das perdidas. É o número que
   * dá tamanho ao que escapou — sem ele, "12 perdas" não diz se doeu.
   */
  lostPotential: number;
}

export function summarizeOutcomes(
  rows: CommercialOutcomeRow[],
): OutcomeSummary {
  let won = 0;
  let lost = 0;
  let revenue = 0;
  let lostPotential = 0;

  for (const row of rows) {
    if (row.status === "won") {
      won += 1;
      revenue += row.sold_value ?? 0;
    } else {
      lost += 1;
      lostPotential += row.potential_value ?? 0;
    }
  }

  const closed = won + lost;

  return {
    won,
    lost,
    revenue,
    averageTicket: won > 0 ? revenue / won : null,
    closeRate: closed > 0 ? won / closed : null,
    lostPotential,
  };
}

export interface GroupedOutcome {
  key: string;
  label: string;
  count: number;
  value: number;
}

/** Agrupa por uma chave textual, ordenado do maior para o menor. */
function group(
  rows: CommercialOutcomeRow[],
  keyOf: (row: CommercialOutcomeRow) => string | null,
  valueOf: (row: CommercialOutcomeRow) => number,
  fallback: string,
): GroupedOutcome[] {
  const map = new Map<string, GroupedOutcome>();

  for (const row of rows) {
    const label = keyOf(row) ?? fallback;
    const current = map.get(label);
    if (current) {
      current.count += 1;
      current.value += valueOf(row);
    } else {
      map.set(label, { key: label, label, count: 1, value: valueOf(row) });
    }
  }

  return [...map.values()].sort(
    (a, b) => b.value - a.value || b.count - a.count,
  );
}

/** Receita por produto — só das ganhas. */
export function revenueByProduct(
  rows: CommercialOutcomeRow[],
): GroupedOutcome[] {
  return group(
    rows.filter((r) => r.status === "won"),
    (r) => r.product_name,
    (r) => r.sold_value ?? 0,
    "Sem produto",
  );
}

/**
 * Motivos de perda, com o potencial que foi junto.
 *
 * O motivo mora no lead, não na oportunidade: uma perda sem motivo registrado
 * aparece como "Não informado" em vez de sumir da conta — é justamente o que
 * mostra onde o processo está deixando de registrar.
 */
export function lossesByReason(rows: CommercialOutcomeRow[]): GroupedOutcome[] {
  return group(
    rows.filter((r) => r.status === "lost"),
    (r) => r.lost_reason,
    (r) => r.potential_value ?? 0,
    "Não informado",
  );
}
