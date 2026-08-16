import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import {
  getCommercialOutcomes,
  getMembers,
  getProducts,
} from "@/lib/crm/queries";
import {
  PERIOD_PRESETS,
  formatPercent,
  resolvePeriod,
  type PeriodKey,
} from "@/lib/crm/dashboard";
import {
  lossesByReason,
  revenueByProduct,
  summarizeOutcomes,
} from "@/lib/crm/outcomes";
import { channelLabel, formatBRL, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ResultFilters } from "./result-filters";

export const metadata: Metadata = { title: "Resultado comercial" };

/** Teto da RPC. Exibido quando bate, para o número não parecer o total real. */
const LIMITE_RPC = 500;

function periodoValido(value: string | undefined): PeriodKey {
  return value && value in PERIOD_PRESETS ? (value as PeriodKey) : "30d";
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    periodo?: string;
    desfecho?: string;
    produto?: string;
    responsavel?: string;
  }>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const params = await searchParams;
  const period = periodoValido(params.periodo);
  const { from, to } = resolvePeriod(period);
  const status =
    params.desfecho === "won" || params.desfecho === "lost"
      ? params.desfecho
      : null;

  const [rows, products, members] = await Promise.all([
    getCommercialOutcomes(context.workspace.id, {
      from,
      to,
      status,
      productId: params.produto || null,
      ownerId: params.responsavel || null,
    }),
    getProducts(context.workspace.id),
    getMembers(context.workspace.id),
  ]);

  const summary = summarizeOutcomes(rows);
  const porProduto = revenueByProduct(rows);
  const porMotivo = lossesByReason(rows);
  const nomePorId = new Map(members.map((m) => [m.userId, m.fullName]));

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">
          Resultado comercial
        </h1>
        <p className="text-xs text-muted-foreground">
          O que fechou em {PERIOD_PRESETS[period].toLowerCase()} — ganhas,
          perdidas e o motivo de cada perda. Conta pela data de fechamento, não
          pela data de entrada do lead.
        </p>
      </div>

      <ResultFilters products={products} members={members} />

      {/* Indicadores. Cada legenda diz a fórmula: número sem origem engana. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="ordo-card flex flex-col gap-1 p-5">
          <span className="text-xs font-semibold text-muted-foreground">
            GANHAS
          </span>
          <span className="font-heading text-3xl font-bold tabular-nums text-primary">
            {summary.won}
          </span>
        </div>

        <div className="ordo-card flex flex-col gap-1 p-5">
          <span className="text-xs font-semibold text-muted-foreground">
            PERDIDAS
          </span>
          <span className="font-heading text-3xl font-bold tabular-nums text-destructive">
            {summary.lost}
          </span>
        </div>

        <div className="ordo-card flex flex-col gap-1 p-5">
          <span className="text-xs font-semibold text-muted-foreground">
            RECEITA
          </span>
          <span className="font-heading text-3xl font-bold tabular-nums text-primary privacy-financial">
            {formatBRL(summary.revenue)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Soma do valor vendido
          </span>
        </div>

        <div className="ordo-card flex flex-col gap-1 p-5">
          <span className="text-xs font-semibold text-muted-foreground">
            TICKET MÉDIO
          </span>
          <span className="font-heading text-3xl font-bold tabular-nums text-primary privacy-financial">
            {formatBRL(summary.averageTicket)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Receita ÷ ganhas
          </span>
        </div>

        <div className="ordo-card flex flex-col gap-1 p-5">
          <span className="text-xs font-semibold text-muted-foreground">
            TAXA DE FECHAMENTO
          </span>
          <span className="font-heading text-3xl font-bold tabular-nums text-primary">
            {formatPercent(summary.closeRate)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Ganhas ÷ (ganhas + perdidas)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Receita por produto */}
        <div className="ordo-card flex flex-col gap-3 p-6 lg:col-span-6">
          <h2 className="font-heading text-base font-bold text-primary">
            Receita por produto
          </h2>
          <div className="flex flex-col gap-2.5">
            {porProduto.length > 0 ? (
              porProduto.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {item.label}
                    </span>
                    <span className="font-bold text-primary">
                      {formatBRL(item.value)}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {item.count} venda(s)
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground italic">
                Nenhuma venda fechada no período.
              </p>
            )}
          </div>
        </div>

        {/* Motivos de perda */}
        <div className="ordo-card flex flex-col gap-3 p-6 lg:col-span-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-heading text-base font-bold text-primary">
              Por que perdemos
            </h2>
            <span className="text-xs text-muted-foreground">
              {formatBRL(summary.lostPotential)} em potencial
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {porMotivo.length > 0 ? (
              porMotivo.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {item.label}
                    </span>
                    <span className="font-bold text-destructive">
                      {formatBRL(item.value)}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {item.count} perda(s)
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground italic">
                Nenhuma perda registrada no período.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* A lista por trás dos números — o que faltava no dashboard. */}
      <div className="ordo-card flex flex-col gap-3 p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-heading text-base font-bold text-primary">
            Fechamentos do período
          </h2>
          <span className="text-xs text-muted-foreground">
            {rows.length} registro(s)
            {rows.length === LIMITE_RPC ? " — teto da consulta atingido" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th scope="col" className="pb-2 font-medium">
                  Lead
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Desfecho
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Produto
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Origem
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Responsável
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Valor
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Fechado em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((row) => (
                <tr key={row.opportunity_id}>
                  <td className="py-2.5">
                    <Link
                      href={`/pipeline/lead/${row.lead_id}`}
                      className="font-semibold text-foreground hover:underline privacy-lead-name"
                    >
                      {row.lead_name}
                    </Link>
                    {row.status === "lost" && row.lost_reason ? (
                      <span className="block text-[11px] text-muted-foreground">
                        {row.lost_reason}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2.5">
                    {row.status === "won" ? (
                      <Badge className="bg-positive text-[10px] text-primary-foreground">
                        Ganha
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        Perdida
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {row.product_name ?? "—"}
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {channelLabel(row.channel)}
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {row.owner_id ? (nomePorId.get(row.owner_id) ?? "—") : "—"}
                  </td>
                  <td className="py-2.5 text-right font-bold tabular-nums privacy-financial">
                    {/* Ganha mostra o que entrou; perdida, o que deixou de entrar. */}
                    {row.status === "won"
                      ? formatBRL(row.sold_value)
                      : formatBRL(row.potential_value)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                    {formatDate(row.closed_at)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    Nada fechou neste recorte. Ajuste o período ou os filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
