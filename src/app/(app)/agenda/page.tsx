import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { isCalendarConnected } from "@/lib/crm/queries";
import { createClient } from "@/lib/supabase/server";
import { AgendaView, SessaoItem } from "./agenda-view";

export const metadata: Metadata = { title: "Agenda" };

interface SessaoRow {
  id: string;
  title: string;
  description?: string | null;
  starts_at: string;
  ends_at?: string | null;
  status: string;
  lead_id: string | null;
  meet_link?: string | null;
  leads: { name: string } | null;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; view?: string; semana?: string }>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const params = await searchParams;
  const dataParam = params.data || params.semana;
  const referencia = dataParam ? new Date(`${dataParam}T12:00:00`) : new Date();
  const baseDate = Number.isNaN(referencia.getTime()) ? new Date() : referencia;

  // Janela de busca otimizada: 14 dias antes até 28 dias depois
  const inicioBusca = new Date(baseDate);
  inicioBusca.setDate(inicioBusca.getDate() - 14);
  inicioBusca.setHours(0, 0, 0, 0);

  const fimBusca = new Date(baseDate);
  fimBusca.setDate(fimBusca.getDate() + 28);
  fimBusca.setHours(23, 59, 59, 999);

  const supabase = await createClient();

  // Carrega apenas dados locais do Supabase (Resposta ultra-rápida em ~30ms)
  const [{ data: sessoesRows }, conectado] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, title, description, starts_at, ends_at, status, lead_id, meet_link, leads (name)")
      .eq("workspace_id", context.workspace.id)
      .is("deleted_at", null)
      .gte("starts_at", inicioBusca.toISOString())
      .lte("starts_at", fimBusca.toISOString())
      .order("starts_at")
      .returns<SessaoRow[]>(),
    isCalendarConnected(context.workspace.id),
  ]);

  const sessoesFormatadas: SessaoItem[] = (sessoesRows ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description ?? null,
    starts_at: s.starts_at,
    ends_at: s.ends_at,
    status: s.status,
    lead_id: s.lead_id,
    lead_name: s.leads?.name ?? null,
    meet_link: s.meet_link ?? null,
    source: "ordo",
  }));

  return (
    <section className="flex flex-col gap-4">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Agenda
          </h1>
          <p className="text-xs text-stone-500">
            {conectado ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                ● Google Calendar sincronizado
              </span>
            ) : (
              <span>
                Apenas sessões do ORDO ·{" "}
                <Link
                  href="/configuracoes/integracoes"
                  className="font-medium text-[#521D2A] underline underline-offset-2 hover:text-[#722a3b] dark:text-amber-300"
                >
                  Conectar Google Calendar
                </Link>
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Componente Interativo de Agenda com carregamento instantâneo */}
      <AgendaView
        sessoes={sessoesFormatadas}
        workspaceTimezone={context.workspace.timezone || "America/Campo_Grande"}
        isGoogleConnected={conectado}
        initialTimeMin={inicioBusca.toISOString()}
        initialTimeMax={fimBusca.toISOString()}
      />
    </section>
  );
}
