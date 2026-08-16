"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface CalendarConfigItem {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  source: "ordo" | "google";
}

export const PRESET_COLORS = [
  { name: "Vinho ORDO", hex: "#521D2A", bg: "#521D2A", border: "#722a3b", text: "#ffffff" },
  { name: "Esmeralda", hex: "#0D9488", bg: "#0D9488", border: "#14B8A6", text: "#ffffff" },
  { name: "Safira", hex: "#2563EB", bg: "#2563EB", border: "#3B82F6", text: "#ffffff" },
  { name: "Ametista", hex: "#7C3AED", bg: "#7C3AED", border: "#8B5CF6", text: "#ffffff" },
  { name: "Âmbar", hex: "#D97706", bg: "#D97706", border: "#F59E0B", text: "#ffffff" },
  { name: "Terracota", hex: "#EA580C", bg: "#EA580C", border: "#F97316", text: "#ffffff" },
  { name: "Rosa Chá", hex: "#DB2777", bg: "#DB2777", border: "#EC4899", text: "#ffffff" },
  { name: "Floresta", hex: "#15803D", bg: "#15803D", border: "#22C55E", text: "#ffffff" },
  { name: "Grafite", hex: "#475569", bg: "#475569", border: "#64748B", text: "#ffffff" },
  { name: "Ciano", hex: "#0891B2", bg: "#0891B2", border: "#06B6D4", text: "#ffffff" },
];

interface AgendaColorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  calendars: CalendarConfigItem[];
  onSaveConfig: (updated: CalendarConfigItem[]) => void;
}

export function AgendaColorsDialog({
  isOpen,
  onClose,
  calendars,
  onSaveConfig,
}: AgendaColorsDialogProps) {
  const [localList, setLocalList] = useState<CalendarConfigItem[]>(calendars);

  useEffect(() => {
    setLocalList(calendars);
  }, [calendars]);

  const handleToggleVisible = (id: string) => {
    setLocalList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  const handleColorChange = (id: string, color: string) => {
    setLocalList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, color } : item))
    );
  };

  const handleSave = () => {
    onSaveConfig(localList);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            <span>🎨 Personalizar Cores e Agendas</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Escolha as cores de cada agenda (ORDO, PsicoManager, Pessoal) e selecione quais devem ficar visíveis na sua grade.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {localList.map((cal) => (
            <div
              key={cal.id}
              className="flex flex-col gap-2 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-900/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="size-4 rounded-full shadow-xs border border-white/40"
                    style={{ backgroundColor: cal.color }}
                  />
                  <div>
                    <Label className="font-semibold text-sm text-stone-800 dark:text-stone-200">
                      {cal.name}
                    </Label>
                    <p className="text-[10px] text-stone-500">
                      {cal.source === "ordo" ? "Atendimentos do CRM" : "Google Calendar"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVisible(cal.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      cal.visible ? "bg-emerald-600" : "bg-stone-300 dark:bg-stone-700"
                    }`}
                    role="switch"
                    aria-checked={cal.visible}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        cal.visible ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-300 min-w-12">
                    {cal.visible ? "Visível" : "Oculto"}
                  </span>
                </div>
              </div>

              {/* Seletor de Cores Rápidas */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {PRESET_COLORS.map((preset) => {
                  const isSelected = cal.color.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleColorChange(cal.id, preset.hex)}
                      className={`size-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${
                        isSelected ? "ring-2 ring-offset-2 ring-stone-900 dark:ring-stone-100 scale-110" : ""
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    >
                      {isSelected && (
                        <span className="text-white text-[10px] font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-[#521D2A] text-white hover:bg-[#722a3b]"
          >
            Salvar Preferências
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
