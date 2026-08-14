"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChannelConnectionItem, OperationalOverview } from "@/lib/crm/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OperationsPanelProps {
  overview: OperationalOverview;
  channels: ChannelConnectionItem[];
  selectedChannelId?: string | null;
}

const STAGE_COLORS: Record<string, string> = {
  new: "bg-sky-500",
  qualification: "bg-indigo-500",
  follow_up_pre_session: "bg-amber-500",
  alignment_session: "bg-purple-500",
  follow_up_post_session: "bg-orange-500",
  won: "bg-emerald-500",
  lost: "bg-rose-500",
  custom: "bg-teal-500",
};

export function OperationsPanel({
  overview,
  channels,
  selectedChannelId,
}: OperationsPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChannelChange(channelId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (channelId) {
      params.set("canal", channelId);
    } else {
      params.delete("canal");
    }
    router.push(`?${params.toString()}`);
  }

  const maxLeadCount = Math.max(
    ...overview.pipeline_distribution.map((s) => s.lead_count),
    1,
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card/60 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-primary">
              Visão da operação
            </h2>
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Semana atual
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Acompanhamento em tempo real de atendimento, pipeline e gargalos operacionais.
          </p>
        </div>

        {channels.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Linha WhatsApp:</span>
            <select
              aria-label="Filtrar por linha de WhatsApp"
              value={selectedChannelId ?? ""}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="border-input h-8 rounded-md border bg-card px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">📱 Todos os números</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  📱 {c.display_name || c.phone_number || "WhatsApp"}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {/* 3 Métricas Principais */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>💬</span>
            <span>Conversas abertas</span>
          </div>
          <span className="text-2xl font-bold text-primary tabular-nums">
            {overview.open_conversations}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Leads em atendimento ativo
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>📋</span>
            <span>Tarefas & Retornos para hoje</span>
          </div>
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {overview.tasks_today}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Vencem nas próximas 24h
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>📅</span>
            <span>Agendamentos da semana</span>
          </div>
          <span className="text-2xl font-bold text-primary tabular-nums">
            {overview.appointments_week}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Sessões / Consultas marcadas
          </span>
        </div>
      </div>

      {/* Distribuição no Pipeline e Bloco Atenção Agora */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Distribuição por Etapas */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Distribuição no pipeline
            </span>
            <Link
              href="/pipeline"
              className="text-xs text-primary hover:underline"
            >
              Ver quadro →
            </Link>
          </div>

          <div className="flex min-h-28 items-end gap-2 pt-4">
            {overview.pipeline_distribution.map((stage) => {
              const heightPct = Math.max(
                12,
                Math.round((stage.lead_count / maxLeadCount) * 100),
              );
              const colorClass = STAGE_COLORS[stage.stage_type] ?? "bg-primary";
              return (
                <div
                  key={stage.id}
                  className="flex flex-1 flex-col items-center gap-1.5"
                >
                  <span className="text-[11px] font-semibold text-foreground tabular-nums">
                    {stage.lead_count}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all duration-300"
                    style={{
                      height: `${heightPct}%`,
                      minHeight: "12px",
                      maxHeight: "80px",
                    }}
                  >
                    <div className={`size-full rounded-t-md ${colorClass} opacity-85 hover:opacity-100`} />
                  </div>
                  <span
                    className="w-full truncate text-center text-[10px] text-muted-foreground"
                    title={stage.name}
                  >
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco Atenção Agora */}
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 lg:col-span-5">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Atenção agora
          </span>

          <div className="flex flex-col gap-2">
            <Link
              href="/pipeline"
              className="group flex items-center justify-between rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5 transition-colors hover:bg-amber-500/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400">⏱️</span>
                <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                  {overview.attention_proposals} propostas aguardam retorno
                </span>
              </div>
              <span className="text-xs text-amber-700 transition-transform group-hover:translate-x-0.5 dark:text-amber-400">
                →
              </span>
            </Link>

            <Link
              href="/pipeline"
              className="group flex items-center justify-between rounded-md border border-rose-500/30 bg-rose-500/5 p-2.5 transition-colors hover:bg-rose-500/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-rose-600 dark:text-rose-400">⚠️</span>
                <span className="text-xs font-medium text-rose-900 dark:text-rose-200">
                  {overview.attention_no_next_step} conversas sem próximo passo
                </span>
              </div>
              <span className="text-xs text-rose-700 transition-transform group-hover:translate-x-0.5 dark:text-rose-400">
                →
              </span>
            </Link>

            <Link
              href="/agenda"
              className="group flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 p-2.5 transition-colors hover:bg-primary/10"
            >
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span className="text-xs font-medium text-foreground">
                  Agenda do time com {overview.attention_upcoming_sessions} sessões
                </span>
              </div>
              <span className="text-xs text-primary transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
