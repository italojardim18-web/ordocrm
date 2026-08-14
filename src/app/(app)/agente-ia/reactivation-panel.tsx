"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { updateReactivationSettings, triggerManualReactivation } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";

const DAYS_OPTIONS = [
  { value: 15, label: "15 dias", desc: "Reativação rápida" },
  { value: 30, label: "30 dias (Recomendado)", desc: "1 mês após a perda" },
  { value: 45, label: "45 dias", desc: "1 mês e meio" },
  { value: 60, label: "60 dias", desc: "2 meses de intervalo" },
];

export interface LostLeadItem {
  id: string;
  name: string;
  phone: string | null;
  lost_at: string | null;
  lost_reason: string | null;
  daysPassed: number;
  reactivated_at: string | null;
  reactivation_status: string | null;
}

interface ReactivationPanelProps {
  initialEnabled: boolean;
  initialDays: number;
  initialTemplate: string;
  initialChannelId?: string | null;
  channels: { id: string; label: string }[];
  lostLeads: LostLeadItem[];
  isAdmin: boolean;
}

export function ReactivationPanel({
  initialEnabled,
  initialDays,
  initialTemplate,
  initialChannelId,
  channels,
  lostLeads,
  isAdmin,
}: ReactivationPanelProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [days, setDays] = useState(initialDays);
  const [template, setTemplate] = useState(initialTemplate);
  const [channelId, setChannelId] = useState(initialChannelId || "");

  const [isPending, startTransition] = useTransition();
  const [reactivatingId, setReactivatingId] = useState<string | null>(null);

  // Exemplo de prévia com primeiro nome fictício
  const previewMessage = template.replace(/\[Nome\]/gi, "Mariana");

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Apenas administradores podem salvar as automações.");
      return;
    }

    startTransition(async () => {
      const res = await updateReactivationSettings({
        enabled,
        days,
        template,
        channelConnectionId: channelId || null,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Configurações de reativação salvas com sucesso!");
      }
    });
  }

  async function handleManualReactivate(leadId: string, leadName: string) {
    setReactivatingId(leadId);
    try {
      const res = await triggerManualReactivation(leadId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Mensagem de reativação enviada para ${leadName}!`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao reativar lead.");
    } finally {
      setReactivatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Bloco 1: Painel de Configurações da Automação */}
      <form onSubmit={handleSaveSettings} className="ordo-card p-6 flex flex-col gap-5 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔁</span>
            <div className="flex flex-col">
              <h2 className="font-heading text-lg font-bold text-primary">
                Automação de Reativação de Leads Perdidos
              </h2>
              <p className="text-xs text-muted-foreground">
                Envie mensagens automáticas e acolhedoras pelo WhatsApp para retomar contato com pacientes inativos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground">
              {enabled ? "Automação Ativa" : "Automação Pausada"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                enabled ? "bg-emerald-600" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 1. Escolha do Intervalo de Tempo */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-foreground">
            1. Quando disparar a reativação após o lead ser marcado como Perdido?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {DAYS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDays(opt.value)}
                className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                  days === opt.value
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                    : "bg-muted/30 border-border/70 text-foreground hover:bg-muted/60"
                }`}
              >
                <span className="text-xs font-bold">{opt.label}</span>
                <span className={`text-[10px] mt-0.5 ${days === opt.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Seleção de Linha de WhatsApp de Envio */}
        {channels.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">
              2. Qual linha de WhatsApp deve enviar a mensagem?
            </label>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs shadow-xs max-w-md"
            >
              <option value="">📱 Mesma linha que atendeu o paciente originalmente</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  📱 Linha {ch.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {/* 3. Modelo de Mensagem Personalizável */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                3. Mensagem de WhatsApp
              </label>
              <span className="text-[11px] text-primary font-semibold">
                Tag disponível: <code>[Nome]</code>
              </span>
            </div>
            <textarea
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Digite o texto da mensagem..."
              className="w-full rounded-2xl border border-border/80 bg-card p-3.5 text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
            <span className="text-[10px] text-muted-foreground">
              A tag <code>[Nome]</code> será trocada automaticamente pelo primeiro nome do lead no envio.
            </span>
          </div>

          {/* Prévia ao Vivo no Balão do WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-muted-foreground">
              Prévia de Envio ao Paciente:
            </span>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 flex flex-col justify-end min-h-[7.5rem]">
              <div className="self-end max-w-[90%] rounded-2xl bg-primary text-primary-foreground p-3.5 shadow-xs text-xs leading-relaxed rounded-br-xs">
                <p className="whitespace-pre-wrap">{previewMessage}</p>
                <span className="text-[9px] text-primary-foreground/75 mt-1 block text-right">
                  10:30 ✓✓
                </span>
              </div>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full px-6 text-xs font-semibold text-primary-foreground shadow-xs"
            >
              {isPending ? "Salvando..." : "Salvar Configurações de Automação"}
            </Button>
          </div>
        ) : null}
      </form>

      {/* Bloco 2: Fila de Leads em Status Perdido com Ação Rápida */}
      <div className="ordo-card p-6 flex flex-col gap-4 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="font-heading text-base font-bold text-primary">
              Fila de Leads para Reativação ({lostLeads.length})
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Disparo automático programado para <strong>{days} dias</strong> após a perda.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/70 text-muted-foreground">
              <tr>
                <th className="pb-2.5 font-semibold">Paciente / Lead</th>
                <th className="pb-2.5 font-semibold">Telefone</th>
                <th className="pb-2.5 font-semibold">Motivo da Perda</th>
                <th className="pb-2.5 font-semibold text-center">Tempo Decorrido</th>
                <th className="pb-2.5 font-semibold">Status de Reativação</th>
                <th className="pb-2.5 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {lostLeads.map((lead) => {
                const atingiuPrazo = lead.daysPassed >= days;
                const foiReativado = lead.reactivation_status === "reactivated";

                return (
                  <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 font-semibold text-foreground">
                      <Link href={`/pipeline/lead/${lead.id}`} className="hover:text-primary hover:underline">
                        {lead.name}
                      </Link>
                    </td>

                    <td className="py-3 text-muted-foreground">
                      {lead.phone ?? "—"}
                    </td>

                    <td className="py-3">
                      <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                        {lead.lost_reason || "Sem motivo registrado"}
                      </Badge>
                    </td>

                    <td className="py-3 text-center">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {lead.daysPassed} {lead.daysPassed === 1 ? "dia" : "dias"}
                      </span>
                    </td>

                    <td className="py-3">
                      {foiReativado ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                          ✓ Mensagem Enviada ({formatDateTime(lead.reactivated_at)})
                        </span>
                      ) : atingiuPrazo ? (
                        <span className="rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-bold animate-pulse">
                          ⚡ Pronto para disparo
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          Faltam {Math.max(0, days - lead.daysPassed)} dias
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant={foiReativado ? "outline" : "default"}
                        disabled={reactivatingId === lead.id}
                        onClick={() => handleManualReactivate(lead.id, lead.name)}
                        className="rounded-full text-xs font-semibold h-7 px-3 shadow-2xs"
                      >
                        {reactivatingId === lead.id
                          ? "Enviando..."
                          : foiReativado
                            ? "Reenviar ↗"
                            : "⚡ Reativar Agora"}
                      </Button>
                    </td>
                  </tr>
                );
              })}

              {lostLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground italic">
                    Nenhum lead marcado como perdido no momento.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
