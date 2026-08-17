"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export interface ChannelOption {
  id: string;
  label: string;
  phoneNumber: string | null;
}

/**
 * Seletor Exclusivo de Linha de Atendimento (WhatsApp).
 *
 * Garante que o usuário visualize estritamente uma linha por vez (ex: "Dr. Ítalo" OU "Secretária"),
 * eliminando a sobreposição ou confusão de conversas entre médico e secretária.
 */
export function ChannelSelector({ channels }: { channels: ChannelOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  if (channels.length === 0) return null;

  // Se não houver linha especificada na URL, o padrão é a primeira linha cadastrada (Dr. Ítalo)
  const current = searchParams.get("linha") || channels[0]?.id;

  function handleChange(channelId: string) {
    if (channelId === current) return;
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("linha", channelId);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  return (
    <div
      role="tablist"
      aria-label="Selecionar Linha de Atendimento"
      className="flex items-center gap-1.5 rounded-full bg-secondary/80 p-1 border border-border/80 shadow-2xs"
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pl-2 pr-1 hidden sm:inline">
        Linha Ativa:
      </span>
      {channels.map((ch) => {
        const isSelected = current === ch.id;
        const isSecretaria =
          ch.label.toLowerCase().includes("secretaria") ||
          ch.label.toLowerCase().includes("secretária");
        const icon = isSecretaria ? "👩‍💼" : "👨‍⚕️";

        return (
          <button
            key={ch.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => handleChange(ch.id)}
            disabled={pending}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs scale-100 ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-background/60",
            )}
          >
            <span>{icon}</span>
            <span>{ch.label}</span>
            {ch.phoneNumber ? (
              <span className="text-[10px] opacity-70 font-normal hidden md:inline">
                ({ch.phoneNumber})
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
