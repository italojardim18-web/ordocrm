"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LeadCard, Member, Product, Stage } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KanbanBoard } from "./kanban-board";
import { LeadList } from "./lead-list";
import { NewLeadDialog } from "./new-lead-dialog";

export interface BoardFilters {
  search: string;
  channel: string;
  productId: string;
  ownerId: string;
}

export function PipelineView({
  workspaceId,
  stages,
  leads,
  products,
  members,
}: {
  workspaceId: string;
  stages: Stage[];
  leads: LeadCard[];
  products: Product[];
  members: Member[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<"kanban" | "list">(
    searchParams.get("visao") === "lista" ? "list" : "kanban",
  );
  const [filters, setFilters] = useState<BoardFilters>({
    search: searchParams.get("busca") ?? "",
    channel: searchParams.get("canal") ?? "",
    productId: searchParams.get("produto") ?? "",
    ownerId: searchParams.get("responsavel") ?? "",
  });

  // Filtros e visão compartilhados via URL (Kanban e lista usam o mesmo estado).
  useEffect(() => {
    const params = new URLSearchParams();
    if (view === "list") params.set("visao", "lista");
    if (filters.search) params.set("busca", filters.search);
    if (filters.channel) params.set("canal", filters.channel);
    if (filters.productId) params.set("produto", filters.productId);
    if (filters.ownerId) params.set("responsavel", filters.ownerId);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : "/pipeline");
  }, [view, filters]);

  // Tempo real: mudanças nos leads do workspace recarregam os dados do servidor.
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("board-leads")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          if (refreshTimer.current) clearTimeout(refreshTimer.current);
          refreshTimer.current = setTimeout(() => router.refresh(), 400);
        },
      )
      .subscribe();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      supabase.removeChannel(channel);
    };
  }, [workspaceId, router]);

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filters.channel && lead.channel !== filters.channel) return false;
      if (filters.ownerId && lead.owner_id !== filters.ownerId) return false;
      if (
        filters.productId &&
        !lead.lead_product_interests.some(
          (i) => i.product_id === filters.productId,
        )
      ) {
        return false;
      }
      if (query) {
        const haystack =
          `${lead.name} ${lead.phone ?? ""} ${lead.email ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [leads, filters]);

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-primary">Pipeline</h1>
        <div
          role="group"
          aria-label="Alternar visualização"
          className="ml-auto flex rounded-md border"
        >
          <Button
            variant={view === "kanban" ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={view === "kanban"}
            onClick={() => setView("kanban")}
          >
            Kanban
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            Lista
          </Button>
        </div>
        <NewLeadDialog
          stages={stages}
          products={products}
          members={members}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label="Buscar por nome, telefone ou e-mail"
          placeholder="Buscar…"
          value={filters.search}
          onChange={(event) =>
            setFilters((f) => ({ ...f, search: event.target.value }))
          }
          className="w-56"
        />
        <select
          aria-label="Filtrar por canal"
          value={filters.channel}
          onChange={(event) =>
            setFilters((f) => ({ ...f, channel: event.target.value }))
          }
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          <option value="">Todos os canais</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="form">Formulário</option>
          <option value="paid_traffic">Tráfego pago</option>
          <option value="manual">Manual</option>
        </select>
        <select
          aria-label="Filtrar por produto"
          value={filters.productId}
          onChange={(event) =>
            setFilters((f) => ({ ...f, productId: event.target.value }))
          }
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          <option value="">Todos os produtos</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por responsável"
          value={filters.ownerId}
          onChange={(event) =>
            setFilters((f) => ({ ...f, ownerId: event.target.value }))
          }
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          <option value="">Todos os responsáveis</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.fullName}
            </option>
          ))}
        </select>
        {filters.search || filters.channel || filters.productId || filters.ownerId ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({ search: "", channel: "", productId: "", ownerId: "" })
            }
          >
            Limpar filtros
          </Button>
        ) : null}
      </div>

      {view === "kanban" ? (
        <KanbanBoard stages={stages} leads={filtered} members={members} />
      ) : (
        <LeadList stages={stages} leads={filtered} members={members} />
      )}
    </section>
  );
}
