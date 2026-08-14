"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChannelConnectionItem, OperationalOverview } from "@/lib/crm/types";
import { Badge } from "@/components/ui/badge";

interface OperationsPanelProps {
  overview: OperationalOverview;
  channels: ChannelConnectionItem[];
  selectedChannelId?: string | null;
}

const STAGE_COLORS: Record<string, string> = {
  new: "bg-primary/70 hover:bg-primary",
  qualification: "bg-[#b2966f] hover:bg-[#9c815c]",
  follow_up_pre_session: "bg-amber-600/80 hover:bg-amber-600",
  alignment_session: "bg-primary hover:bg-primary",
  follow_up_post_session: "bg-stone-500 hover:bg-stone-600",
  won: "bg-emerald-600 hover:bg-emerald-700",
  lost: "bg-rose-600 hover:bg-rose-700",
  custom: "bg-[#b2966f] hover:bg-[#9c815c]",
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
      params.set("linha", channelId);
    } else {
      params.delete("linha");
    }
    router.push(`?${params.toString()}`);
  }

  const maxLeadCount = Math.max(
    ...overview.pipeline_distribution.map((s) => s.lead_count),
    1,
  );

  return (
    <div className="ordo-card p-6 flex flex-col gap-6">
      {/* Cabeçalho do Painel Operacional */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading text-xl font-bold text-primary tracking-tight">
              Painel operacional
            </h2>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-[11px] font-semibold text-secondary-foreground">
              Semana atual
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Acompanhamento em tempo real de atendimento, pipeline e gargalos operacionais.
          </p>
        </div>

        {channels.length > 0 ? (
          <div className="flex items-center gap-2">
            <select
              aria-label="Filtrar por linha de WhatsApp"
              value={selectedChannelId ?? ""}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="h-9 rounded-full border border-border bg-card px-4 text-xs font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">📱 Todas as linhas</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  📱 {c.display_name || c.phone_number || "WhatsApp"}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {/* 3 Cartões de Métricas Principais (Estilo Modern SaaS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ordo-card-compact p-5 flex flex-col justify-between gap-3 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-primary">
                💬
              </span>
              <span>Conversas abertas</span>
            </div>
            <Link
              href="/conversas"
              className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground text-xs"
              title="Ver conversas"
            >
              ↗
            </Link>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-primary tabular-nums tracking-tight">
              {overview.open_conversations}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Leads em atendimento ativo
            </p>
          </div>
        </div>

        <div className="ordo-card-compact p-5 flex flex-col justify-between gap-3 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-primary">
                📋
              </span>
              <span>Tarefas & Retornos</span>
            </div>
            <Link
              href="/pipeline"
              className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground text-xs"
              title="Ver tarefas"
            >
              ↗
            </Link>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-amber-700 dark:text-amber-400 tabular-nums tracking-tight">
              {overview.tasks_today}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Vencem nas próximas 24 horas
            </p>
          </div>
        </div>

        <div className="ordo-card-compact p-5 flex flex-col justify-between gap-3 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-primary">
                📅
              </span>
              <span>Agendamentos</span>
            </div>
            <Link
              href="/agenda"
              className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground text-xs"
              title="Ver agenda"
            >
              ↗
            </Link>
          </div>
          <div>
            <span className="font-heading text-3xl font-bold text-primary tabular-nums tracking-tight">
              {overview.appointments_week}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sessões agendadas nesta semana
            </p>
          </div>
        </div>
      </div>

      {/* Distribuição no Pipeline e Bloco Atenção Agora */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Distribuição por Etapas */}
        <div className="ordo-card-compact p-5 flex flex-col gap-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Distribuição no pipeline
              </span>
            </div>
            <Link
              href="/pipeline"
              className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-primary hover:bg-secondary transition-colors"
            >
              Ver quadro ↗
            </Link>
          </div>

          <div className="flex min-h-32 items-end gap-2.5 pt-4">
            {overview.pipeline_distribution.map((stage) => {
              const heightPct = Math.max(
                14,
                Math.round((stage.lead_count / maxLeadCount) * 100),
              );
              const colorClass = STAGE_COLORS[stage.stage_type] ?? "bg-primary";
              return (
                <div
                  key={stage.id}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-bold text-primary tabular-nums">
                    {stage.lead_count}
                  </span>
                  <div
                    className="w-full rounded-full transition-all duration-300 overflow-hidden bg-muted/40"
                    style={{
                      height: `${heightPct}%`,
                      minHeight: "16px",
                      maxHeight: "90px",
                    }}
                  >
                    <div className={`size-full rounded-full ${colorClass} transition-opacity`} />
                  </div>
                  <span
                    className="w-full truncate text-center text-[11px] font-medium text-muted-foreground"
                    title={stage.name}
                  >
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco: Atenção Agora (Gargalos operacionais) */}
        <div className="ordo-card-compact p-5 flex flex-col gap-4 lg:col-span-5 bg-card/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Atenção agora
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">Ações críticas</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Propostas sem retorno */}
            <Link
              href="/pipeline"
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 transition-all hover:bg-muted/40 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-sm dark:bg-rose-950 dark:text-rose-300">
                  ⏳
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    Propostas aguardando retorno
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Paradas há mais de 48h sem resposta
                  </span>
                </div>
              </div>
              <span className="flex size-6 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-700 dark:text-rose-300">
                {overview.attention_proposals}
              </span>
            </Link>

            {/* Conversas sem próximo passo */}
            <Link
              href="/conversas"
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 transition-all hover:bg-muted/40 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-sm dark:bg-amber-950 dark:text-amber-300">
                  ⚠️
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    Conversas sem próximo passo
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Sem tarefa ou follow-up definido
                  </span>
                </div>
              </div>
              <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-800 dark:text-amber-300">
                {overview.attention_no_next_step}
              </span>
            </Link>

            {/* Sessões agendadas que exigem preparação */}
            <Link
              href="/agenda"
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 transition-all hover:bg-muted/40 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary text-sm">
                  🎯
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    Sessões na agenda desta semana
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Com link do Meet sincronizado
                  </span>
                </div>
              </div>
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {overview.attention_upcoming_sessions}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
