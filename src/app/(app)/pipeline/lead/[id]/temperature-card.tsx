"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setLeadTemperatureOverride } from "../../actions";
import {
  computeLeadTemperature,
  TEMPERATURE_CONFIG,
} from "@/lib/crm/temperature";
import type { LeadDetail, LeadTemperature } from "@/lib/crm/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TemperatureCardProps {
  lead: LeadDetail;
}

export function TemperatureCard({ lead }: TemperatureCardProps) {
  const [isPending, startTransition] = useTransition();

  const tempResult = computeLeadTemperature(lead);
  const currentConfig = TEMPERATURE_CONFIG[tempResult.temperature];

  function handleOverrideChange(value: string) {
    startTransition(async () => {
      const override = value === "auto" ? null : (value as LeadTemperature);
      const res = await setLeadTemperatureOverride(lead.id, override);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          override
            ? `Temperatura definida para ${TEMPERATURE_CONFIG[override].label}.`
            : "Temperatura redefinida para cálculo automático.",
        );
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Temperatura do Lead</CardTitle>
          <span
            className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold border ${currentConfig.badgeClass}`}
          >
            <span>{currentConfig.emoji}</span>
            <span>{currentConfig.label}</span>
          </span>
        </div>
        <CardDescription>{tempResult.reason}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-xs">
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/50 p-2">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {tempResult.isOverride ? "Ajuste manual" : "Cálculo do sistema"}
            </span>
            <span className="text-muted-foreground">
              {tempResult.isOverride
                ? "Substitui a regra automática"
                : currentConfig.description}
            </span>
          </div>

          <div className="shrink-0">
            <select
              aria-label="Ajustar temperatura"
              disabled={isPending}
              value={lead.temperature_override ?? "auto"}
              onChange={(e) => handleOverrideChange(e.target.value)}
              className="border-input h-8 rounded-md border bg-card px-2 text-xs shadow-xs"
            >
              <option value="auto">⚡ Automático</option>
              <option value="hot">🔥 Quente</option>
              <option value="warm">🟡 Morno</option>
              <option value="cold">❄️ Frio</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
