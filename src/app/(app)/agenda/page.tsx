import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { listarEventosGoogle } from "@/lib/calendar/service";
import { isCalendarConnected } from "@/lib/crm/queries";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Agenda" };

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/** Segunda-feira da semana que contém a data. */
function inicioDaSemana(base: Date): Date {
  const d = new Date(base);
  const dia = d.getDay();
  d.setDate(d.getDate() - (dia === 0 ? 6 : dia - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function hora(iso: string | null, diaInteiro = false): string {
  if (!iso) return "";
  if (diaInteiro) return "dia todo";
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Sessao {
  id: string;
  title: string;
  starts_at: string;
  status: string;
  lead_id: string;
  leads: { name: string } | null;
}

const STATUS: Record<string, string> = {
  scheduled: "Agendada",
  completed: "Realizada",
  cancelled: "Cancelada",
  no_show: "Não compareceu",
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ semana?: string }>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const { semana } = await searchParams;
  const referencia = semana ? new Date(`${semana}T12:00:00`) : new Date();
  const inicio = inicioDaSemana(
    Number.isNaN(referencia.getTime()) ? new Date() : referencia,
  );
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 7);

  const supabase = await createClient();

  // As sessões do ORDO são a fonte primária; o Google entra por cima para dar
  // a visão completa do dia — inclusive compromissos que não são do CRM.
  const [{ data: sessoes }, eventos, conectado] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, title, starts_at, status, lead_id, leads (name)")
      .eq("workspace_id", context.workspace.id)
      .is("deleted_at", null)
      .gte("starts_at", inicio.toISOString())
      .lt("starts_at", fim.toISOString())
      .order("starts_at")
      .returns<Sessao[]>(),
    listarEventosGoogle(
      context.workspace.id,
      inicio.toISOString(),
      fim.toISOString(),
    ),
    isCalendarConnected(context.workspace.id),
  ]);

  // Eventos criados pelo próprio ORDO já aparecem como sessão: mostrar os dois
  // seria a mesma coisa duas vezes na mesma linha.
  const titulosDoOrdo = new Set((sessoes ?? []).map((s) => s.title));

  const dias = Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicio);
    dia.setDate(dia.getDate() + i);
    const fimDoDia = new Date(dia);
    fimDoDia.setDate(fimDoDia.getDate() + 1);

    return {
      data: dia,
      sessoes: (sessoes ?? []).filter((s) => {
        const t = new Date(s.starts_at);
        return t >= dia && t < fimDoDia;
      }),
      eventos: eventos.filter((e) => {
        if (!e.inicio) return false;
        const t = new Date(e.inicio);
        return t >= dia && t < fimDoDia && !titulosDoOrdo.has(e.titulo);
      }),
    };
  });

  const semanaAnterior = new Date(inicio);
  semanaAnterior.setDate(semanaAnterior.getDate() - 7);
  const semanaSeguinte = new Date(inicio);
  semanaSeguinte.setDate(semanaSeguinte.getDate() + 7);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const hoje = new Date();
  const ehHoje = (d: Date) => d.toDateString() === hoje.toDateString();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-primary">Agenda</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agenda?semana=${iso(semanaAnterior)}`}>← Anterior</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/agenda">Hoje</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agenda?semana=${iso(semanaSeguinte)}`}>Próxima →</Link>
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {inicio.toLocaleDateString("pt-BR")} a{" "}
        {new Date(fim.getTime() - 1).toLocaleDateString("pt-BR")}
        {conectado ? (
          <> · sessões do ORDO e eventos do Google</>
        ) : (
          <>
            {" "}
            · só sessões do ORDO —{" "}
            <Link
              href="/configuracoes/integracoes"
              className="underline underline-offset-2"
            >
              conectar Google Calendar
            </Link>
          </>
        )}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {dias.map((dia) => (
          <div
            key={dia.data.toISOString()}
            className={`flex min-h-40 flex-col rounded-lg border bg-card ${
              ehHoje(dia.data) ? "border-primary" : ""
            }`}
          >
            <div className="border-b px-3 py-2">
              <p className="text-xs text-muted-foreground">
                {DIAS[dia.data.getDay()]}
              </p>
              <p
                className={`text-sm font-medium ${
                  ehHoje(dia.data) ? "text-primary" : ""
                }`}
              >
                {dia.data.getDate()}/{dia.data.getMonth() + 1}
              </p>
            </div>

            <ul className="flex flex-1 flex-col gap-1.5 p-2">
              {dia.sessoes.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/pipeline/lead/${s.lead_id}`}
                    className="block rounded-md bg-primary/10 px-2 py-1.5 hover:bg-primary/15"
                  >
                    <p className="text-xs font-medium text-primary">
                      {hora(s.starts_at)} · {s.leads?.name ?? "Lead"}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {s.title}
                    </p>
                    {s.status !== "scheduled" ? (
                      <Badge variant="outline" className="mt-1 text-[9px]">
                        {STATUS[s.status] ?? s.status}
                      </Badge>
                    ) : null}
                  </Link>
                </li>
              ))}

              {dia.eventos.map((e) => (
                <li
                  key={e.id}
                  className="rounded-md border border-dashed px-2 py-1.5"
                  title="Evento do Google Calendar"
                >
                  <p className="text-xs">
                    {hora(e.inicio, e.diaInteiro)} · {e.titulo}
                  </p>
                </li>
              ))}

              {dia.sessoes.length === 0 && dia.eventos.length === 0 ? (
                <li className="m-auto text-[11px] text-muted-foreground">
                  livre
                </li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
