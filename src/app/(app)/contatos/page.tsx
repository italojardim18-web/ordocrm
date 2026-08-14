import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { channelLabel, formatBRL, formatDateTime } from "@/lib/format";
import { initials } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Lista de Contatos" };

interface ContactRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  channel: string;
  potential_value: number | null;
  created_at: string;
  last_interaction_at: string | null;
  pipeline_stages: { name: string } | null;
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const sp = await searchParams;
  const busca = typeof sp.q === "string" ? sp.q.toLowerCase() : "";

  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, email, channel, potential_value, created_at, last_interaction_at, pipeline_stages (name)")
    .eq("workspace_id", context.workspace.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<ContactRow[]>();

  const filtered = (leads ?? []).filter((l) => {
    if (!busca) return true;
    return (
      l.name.toLowerCase().includes(busca) ||
      (l.phone && l.phone.includes(busca)) ||
      (l.email && l.email.toLowerCase().includes(busca))
    );
  });

  return (
    <section className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              Lista de Contatos
            </h1>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
              {filtered.length} contatos
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Diretório completo de pacientes, prospects e contatos comerciais.
          </p>
        </div>

        <Link
          href="/pipeline"
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
        >
          + Novo Contato no Pipeline
        </Link>
      </div>

      {/* Tabela de Contatos em Card Arredondado */}
      <div className="ordo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/30 text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-semibold">Contato</th>
                <th className="py-3 px-4 font-semibold">Telefone / WhatsApp</th>
                <th className="py-3 px-4 font-semibold">Canal</th>
                <th className="py-3 px-4 font-semibold">Etapa no Funil</th>
                <th className="py-3 px-4 font-semibold">Valor</th>
                <th className="py-3 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((contact) => (
                <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <Link
                      href={`/pipeline/lead/${contact.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary font-bold text-xs">
                        {initials(contact.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary group-hover:underline">
                          {contact.name}
                        </span>
                        {contact.email ? (
                          <span className="text-[11px] text-muted-foreground">
                            {contact.email}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </td>

                  <td className="py-3 px-4 font-medium text-foreground">
                    {contact.phone ?? "—"}
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                      {channelLabel(contact.channel)}
                    </Badge>
                  </td>

                  <td className="py-3 px-4">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                      {contact.pipeline_stages?.name ?? "Lead"}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-heading font-semibold text-primary">
                    {formatBRL(contact.potential_value)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/pipeline/lead/${contact.id}`}
                      className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-primary hover:bg-secondary transition-colors"
                    >
                      Abrir ↗
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground italic">
                    Nenhum contato encontrado.
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
