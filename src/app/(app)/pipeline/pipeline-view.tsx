"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LeadCard, LostReason, Member, Product, Stage } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KanbanBoard } from "./kanban-board";
import { LeadList } from "./lead-list";
import { NewLeadDialog } from "./new-lead-dialog";
import { cn } from "@/lib/utils";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToMobile(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

import { ChannelSelector, type ChannelOption } from "@/components/channel-selector";

export interface BoardFilters {
  search: string;
  channel: string;
  productId: string;
  ownerId: string;
}

export function PipelineView({
  workspaceId,
  pipelineId,
  isAdmin,
  stages,
  leads,
  products,
  members,
  lostReasons = [],
  channelOptions,
  activeChannelId,
}: {
  workspaceId: string;
  pipelineId: string;
  isAdmin: boolean;
  stages: Stage[];
  leads: LeadCard[];
  products: Product[];
  members: Member[];
  lostReasons?: LostReason[];
  channelOptions?: ChannelOption[];
  activeChannelId?: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [chosenView, setChosenView] = useState<"kanban" | "list" | null>(() => {
    const fromUrl = searchParams.get("visao");
    if (fromUrl === "lista") return "list";
    if (fromUrl === "kanban") return "kanban";
    return null;
  });

  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
  const effectiveView = chosenView ?? (isMobile ? "list" : "kanban");
  const [filters, setFilters] = useState<BoardFilters>({
    search: searchParams.get("busca") ?? "",
    channel: searchParams.get("canal") ?? "",
    productId: searchParams.get("produto") ?? "",
    ownerId: searchParams.get("responsavel") ?? "",
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (chosenView === "list") params.set("visao", "lista");
    else if (chosenView === "kanban") params.set("visao", "kanban");
    if (filters.search) params.set("busca", filters.search);
    if (filters.channel) params.set("canal", filters.channel);
    if (filters.productId) params.set("produto", filters.productId);
    if (filters.ownerId) params.set("responsavel", filters.ownerId);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : "/pipeline");
  }, [chosenView, filters]);

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
    <section className="flex min-w-0 flex-col gap-5">
      {/* Cabeçalho do Pipeline com Alternância e Novo Lead */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
            Pipeline
          </h1>
          <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
            {filtered.length} leads
          </span>

          {channelOptions && channelOptions.length > 0 ? (
            <div className="ml-1">
              <ChannelSelector channels={channelOptions} />
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Alternador Kanban / Lista em pílula */}
          <div
            role="group"
            aria-label="Alternar visualização"
            className="flex rounded-full bg-secondary/60 p-1 border border-border"
          >
            <button
              type="button"
              aria-pressed={effectiveView === "kanban"}
              onClick={() => setChosenView("kanban")}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs font-medium transition-all",
                effectiveView === "kanban"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              ☷ Kanban
            </button>
            <button
              type="button"
              aria-pressed={effectiveView === "list"}
              onClick={() => setChosenView("list")}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs font-medium transition-all",
                effectiveView === "list"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              ☰ Lista
            </button>
          </div>

          <NewLeadDialog
            stages={stages}
            products={products}
            members={members}
            defaultChannelConnectionId={activeChannelId}
          />
        </div>
      </div>

      {/* Filtros em Pílulas */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Input
          aria-label="Buscar por nome, telefone ou e-mail"
          placeholder="🔍 Buscar lead..."
          value={filters.search}
          onChange={(event) =>
            setFilters((f) => ({ ...f, search: event.target.value }))
          }
          className="w-60 rounded-full bg-card px-4 text-xs h-9 shadow-xs"
        />
        <select
          aria-label="Filtrar por canal"
          value={filters.channel}
          onChange={(event) =>
            setFilters((f) => ({ ...f, channel: event.target.value }))
          }
          className="h-9 rounded-full border border-border bg-card px-3.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
          className="h-9 rounded-full border border-border bg-card px-3.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
          className="h-9 rounded-full border border-border bg-card px-3.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
            className="rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            ✕ Limpar filtros
          </Button>
        ) : null}
      </div>

      {effectiveView === "kanban" ? (
        <KanbanBoard
          stages={stages}
          leads={filtered}
          members={members}
          pipelineId={pipelineId}
          isAdmin={isAdmin}
          lostReasons={lostReasons}
        />
      ) : (
        <LeadList stages={stages} leads={filtered} members={members} />
      )}
    </section>
  );
}
