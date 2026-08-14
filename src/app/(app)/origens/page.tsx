import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatBRL, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Origens do Lead" };

interface LeadOriginItem {
  id: string;
  name: string;
  channel: string;
  source_detail: string | null;
  potential_value: number | null;
  created_at: string;
  pipeline_stages: { name: string } | null;
}

export default async function LeadOriginsPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, channel, source_detail, potential_value, created_at, pipeline_stages (name)")
    .eq("workspace_id", context.workspace.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<LeadOriginItem[]>();

  const list = leads ?? [];

  // Agrupamento por canal
  const channelStats: Record<string, { total: number; valorTotal: number; detalhes: string[] }> = {};
  for (const l of list) {
    const ch = l.channel || "whatsapp";
    if (!channelStats[ch]) {
      channelStats[ch] = { total: 0, valorTotal: 0, detalhes: [] };
    }
    channelStats[ch].total += 1;
    channelStats[ch].valorTotal += Number(l.potential_value) || 0;
    if (l.source_detail && !channelStats[ch].detalhes.includes(l.source_detail)) {
      channelStats[ch].detalhes.push(l.source_detail);
    }
  }

  const sortedChannels = Object.entries(channelStats).sort((a, b) => b[1].total - a[1].total);

  return (
    <section className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              Origens do Lead
            </h1>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
              {list.length} leads rastreados
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Mapeamento detalhado de canais de aquisição, campanhas e conversão de pacientes.
          </p>
        </div>
      </div>

      {/* Cards de Resumo por Canal */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sortedChannels.map(([canal, stat]) => {
          const pct = list.length > 0 ? Math.round((stat.total / list.length) * 100) : 0;
          return (
            <div key={canal} className="ordo-card p-5 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="rounded-full text-xs font-bold px-3 py-1">
                  📱 {channelLabel(canal)}
                </Badge>
                <span className="text-xs font-bold text-primary">{pct}%</span>
              </div>

              <div>
                <span className="font-heading text-3xl font-bold text-primary tabular-nums">
                  {stat.total}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Potencial: <strong className="text-foreground">{formatBRL(stat.valorTotal)}</strong>
                </p>
              </div>

              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Detalhada de Leads por Origem */}
      <div className="ordo-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-primary">
            Rastreamento de Leads e Campanhas
          </h2>
          <span className="text-xs text-muted-foreground">Últimos registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="pb-3 font-semibold">Lead / Paciente</th>
                <th className="pb-3 font-semibold">Canal</th>
                <th className="pb-3 font-semibold">Detalhe da Campanha / Origem</th>
                <th className="pb-3 font-semibold">Etapa Atual</th>
                <th className="pb-3 font-semibold">Data de Entrada</th>
                <th className="pb-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {list.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 font-semibold text-foreground">
                    <Link href={`/pipeline/lead/${lead.id}`} className="hover:text-primary hover:underline">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="py-3">
                    <Badge variant="secondary" className="rounded-full text-[10px] px-2">
                      {channelLabel(lead.channel)}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {lead.source_detail || "Primeiro contato WhatsApp"}
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {lead.pipeline_stages?.name ?? "Lead"}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatDateTime(lead.created_at)}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/pipeline/lead/${lead.id}`}
                      className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-primary hover:bg-secondary"
                    >
                      Ver lead ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
