"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateStageAutomationSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface StageTriggerItem {
  id: string;
  name: string;
  stage_type: string;
  position: number;
  automation_message_enabled: boolean;
  automation_message_template: string | null;
  automation_reminder_24h: boolean;
  automation_reminder_template: string | null;
}

interface StageTriggersPanelProps {
  stages: StageTriggerItem[];
  isAdmin: boolean;
}

export function StageTriggersPanel({ stages, isAdmin }: StageTriggersPanelProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>(
    stages.find((s) => s.stage_type === "alignment_session")?.id || stages[0]?.id || "",
  );

  const activeStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const [enabled, setEnabled] = useState(Boolean(activeStage?.automation_message_enabled));
  const [template, setTemplate] = useState(
    activeStage?.automation_message_template ||
      "Olá [Nome]! Sua sessão está confirmada para [Data] às [Horario]. Segue o link de acesso da nossa sala virtual: [LinkMeet]. Qualquer dúvida antes do horário, estou à disposição!",
  );
  const [reminder24h, setReminder24h] = useState(Boolean(activeStage?.automation_reminder_24h));
  const [reminderTemplate, setReminderTemplate] = useState(
    activeStage?.automation_reminder_template ||
      "Olá [Nome], lembrete acolhedor: nossa consulta é amanhã, dia [Data] às [Horario]. Link do Google Meet: [LinkMeet]. Até amanhã!",
  );

  const [isPending, startTransition] = useTransition();

  function handleSelectStage(stage: StageTriggerItem) {
    setSelectedStageId(stage.id);
    setEnabled(Boolean(stage.automation_message_enabled));
    setTemplate(
      stage.automation_message_template ||
        "Olá [Nome]! Sua sessão está confirmada para [Data] às [Horario]. Segue o link da nossa sala virtual: [LinkMeet]. Qualquer dúvida antes do horário, estou à disposição!",
    );
    setReminder24h(Boolean(stage.automation_reminder_24h));
    setReminderTemplate(
      stage.automation_reminder_template ||
        "Olá [Nome], lembrete de consulta: nossa sessão é amanhã, dia [Data] às [Horario]. Link da sala: [LinkMeet]. Até amanhã!",
    );
  }

  // Prévia substituindo as tags por dados reais de exemplo
  const previewInstant = template
    .replace(/\[Nome\]/gi, "Mariana")
    .replace(/\[Data\]/gi, "18/08/2026")
    .replace(/\[Horario\]/gi, "15:00")
    .replace(/\[LinkMeet\]/gi, "https://meet.google.com/abc-defg-hij")
    .replace(/\[Profissional\]/gi, "Dr. Ítalo Jardim");

  const previewReminder = reminderTemplate
    .replace(/\[Nome\]/gi, "Mariana")
    .replace(/\[Data\]/gi, "18/08/2026")
    .replace(/\[Horario\]/gi, "15:00")
    .replace(/\[LinkMeet\]/gi, "https://meet.google.com/abc-defg-hij")
    .replace(/\[Profissional\]/gi, "Dr. Ítalo Jardim");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Apenas administradores podem configurar os gatilhos.");
      return;
    }

    startTransition(async () => {
      const res = await updateStageAutomationSettings({
        stageId: activeStage.id,
        enabled,
        template,
        reminder24h,
        reminderTemplate,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Automações da etapa "${activeStage.name}" salvas com sucesso!`);
      }
    });
  }

  return (
    <div className="ordo-card p-6 flex flex-col gap-6 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div className="flex flex-col">
            <h2 className="font-heading text-lg font-bold text-primary">
              Automação de Mensagens por Mudança de Etapa (Gatilhos do Funil)
            </h2>
            <p className="text-xs text-muted-foreground">
              Dispare mensagens e lembretes de WhatsApp automaticamente quando um lead for movido para uma etapa.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="rounded-full text-xs px-3 py-1 border-primary/30 text-primary bg-primary/5">
          Estilo Kommo / Gatilhos Inteligentes
        </Badge>
      </div>

      {/* Seletor de Etapas em Pílulas */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-foreground">
          Selecione a etapa para configurar o gatilho automático:
        </label>
        <div className="flex flex-wrap gap-2">
          {stages.map((st) => {
            const isSelected = st.id === selectedStageId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStage(st)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                    : "bg-muted/30 border-border text-foreground hover:bg-muted/60"
                }`}
              >
                <span>{st.name}</span>
                {st.automation_message_enabled ? (
                  <span className={`size-2 rounded-full ${isSelected ? "bg-white animate-pulse" : "bg-emerald-500"}`} />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {activeStage ? (
        <form onSubmit={handleSave} className="flex flex-col gap-5 pt-2">
          {/* Card da Etapa Ativa */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-muted/20 border border-border/70">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Etapa selecionada:</span>
              <span className="text-sm font-bold text-foreground">{activeStage.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-foreground">
                {enabled ? "Disparo Automático Ativo" : "Disparo Pausado"}
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

          {/* 1. Mensagem Imediata de Entrada na Etapa */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  1. Mensagem enviada assim que o lead entrar na etapa
                </label>
              </div>
              <textarea
                rows={4}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Ex: Olá [Nome], sua sessão está confirmada para [Data] às [Horario]..."
                className="w-full rounded-2xl border border-border/80 bg-card p-3.5 text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
              <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground mt-1">
                <span>Tags:</span>
                <code className="bg-muted px-1 rounded">`[Nome]`</code>
                <code className="bg-muted px-1 rounded">`[Data]`</code>
                <code className="bg-muted px-1 rounded">`[Horario]`</code>
                <code className="bg-muted px-1 rounded">`[LinkMeet]`</code>
                <code className="bg-muted px-1 rounded">`[Profissional]`</code>
              </div>
            </div>

            {/* Balão de Prévia */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">
                Prévia da Mensagem Imediata:
              </span>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 flex flex-col justify-end min-h-[7.5rem]">
                <div className="self-end max-w-[90%] rounded-2xl bg-primary text-primary-foreground p-3.5 shadow-xs text-xs leading-relaxed rounded-br-xs">
                  <p className="whitespace-pre-wrap">{previewInstant}</p>
                  <span className="text-[9px] text-primary-foreground/75 mt-1 block text-right">
                    10:30 ✓✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Lembrete 24 Horas Antes (Anti-No-Show) */}
          <div className="rounded-2xl border border-border/80 p-4.5 bg-muted/10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⏰</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    2. Lembrete Automático 24 Horas Antes da Consulta (Redução de No-Show)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Envia um lembrete no dia anterior da sessão com o link do Meet e confirmação.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reminder24h"
                  checked={reminder24h}
                  onChange={(e) => setReminder24h(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="reminder24h" className="text-xs font-semibold cursor-pointer">
                  Ativar lembrete 24h
                </label>
              </div>
            </div>

            {reminder24h ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Texto do Lembrete de 24h
                  </label>
                  <textarea
                    rows={3}
                    value={reminderTemplate}
                    onChange={(e) => setReminderTemplate(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-card p-3.5 text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground">
                    Prévia do Lembrete 24h:
                  </span>
                  <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 flex flex-col justify-end min-h-[6rem]">
                    <div className="self-end max-w-[90%] rounded-2xl bg-secondary text-foreground p-3.5 shadow-xs text-xs leading-relaxed rounded-br-xs border border-border/50">
                      <p className="whitespace-pre-wrap">{previewReminder}</p>
                      <span className="text-[9px] text-muted-foreground mt-1 block text-right">
                        Ontem 14:00 ✓✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {isAdmin ? (
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-full px-6 text-xs font-semibold text-primary-foreground shadow-xs"
              >
                {isPending ? "Salvando..." : `Salvar Gatilho de "${activeStage.name}"`}
              </Button>
            </div>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
