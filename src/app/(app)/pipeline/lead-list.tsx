"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LeadCard, Member, Stage } from "@/lib/crm/types";
import { channelLabel, formatBRL, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 25;

type SortKey = "name" | "created_at" | "potential_value";

export function LeadList({
  stages,
  leads,
  members,
}: {
  stages: Stage[];
  leads: LeadCard[];
  members: Member[];
}) {
  const [stageFilter, setStageFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);

  const stageById = useMemo(
    () => new Map(stages.map((s) => [s.id, s])),
    [stages],
  );
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.userId, m])),
    [members],
  );

  const rows = useMemo(() => {
    let result = leads;
    if (stageFilter) result = result.filter((l) => l.stage_id === stageFilter);
    const sorted = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name, "pt-BR");
      else if (sortKey === "potential_value")
        cmp = (a.potential_value ?? 0) - (b.potential_value ?? 0);
      else
        cmp =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? cmp : -cmp;
    });
    return sorted;
  }, [leads, stageFilter, sortKey, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
  }

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ↑" : " ↓") : "";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <select
          aria-label="Filtrar por etapa"
          value={stageFilter}
          onChange={(event) => {
            setStageFilter(event.target.value);
            setPage(0);
          }}
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          <option value="">Todas as etapas</option>
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {rows.length} lead(s)
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-160 text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2">
                <button
                  onClick={() => toggleSort("name")}
                  className="font-medium hover:text-foreground"
                >
                  Nome{sortIndicator("name")}
                </button>
              </th>
              <th scope="col" className="px-3 py-2">Etapa</th>
              <th scope="col" className="px-3 py-2">Canal</th>
              <th scope="col" className="px-3 py-2">Contato</th>
              <th scope="col" className="px-3 py-2">Responsável</th>
              <th scope="col" className="px-3 py-2 text-right">
                <button
                  onClick={() => toggleSort("potential_value")}
                  className="font-medium hover:text-foreground"
                >
                  Valor{sortIndicator("potential_value")}
                </button>
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                <button
                  onClick={() => toggleSort("created_at")}
                  className="font-medium hover:text-foreground"
                >
                  Entrada{sortIndicator("created_at")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((lead) => {
              const stage = stageById.get(lead.stage_id);
              const owner = lead.owner_id
                ? memberById.get(lead.owner_id)
                : null;
              return (
                <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/60">
                  <td className="px-3 py-2">
                    <Link
                      href={`/pipeline/lead/${lead.id}`}
                      className="font-medium hover:underline"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">{stage?.name ?? "—"}</Badge>
                  </td>
                  <td className="px-3 py-2">{channelLabel(lead.channel)}</td>
                  <td className="max-w-48 truncate px-3 py-2 text-muted-foreground">
                    {lead.phone ?? lead.email ?? "—"}
                  </td>
                  <td className="px-3 py-2">{owner?.fullName ?? "—"}</td>
                  <td className="px-3 py-2 text-right">
                    {formatBRL(lead.potential_value)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhum lead encontrado com os filtros atuais.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      ) : null}
    </div>
  );
}
