"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export interface ChannelOption {
  id: string;
  label: string;
  phoneNumber: string | null;
}

/**
 * Seletor de linha de WhatsApp — permite filtrar as telas do CRM
 * por número (ex: "Dr. Ítalo", "Secretária", ou "Todas as linhas").
 *
 * Usa searchParams para persistir a escolha na URL, possibilitando
 * compartilhamento e back/forward do navegador.
 */
export function ChannelSelector({ channels }: { channels: ChannelOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = searchParams.get("linha") ?? "todas";

  function handleChange(value: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "todas") {
        params.delete("linha");
      } else {
        params.set("linha", value);
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  if (channels.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-lg border bg-card p-1">
      <button
        type="button"
        onClick={() => handleChange("todas")}
        disabled={pending}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          current === "todas"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        Todas as linhas
      </button>
      {channels.map((ch) => (
        <button
          key={ch.id}
          type="button"
          onClick={() => handleChange(ch.id)}
          disabled={pending}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            current === ch.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          📱 {ch.label}
          {ch.phoneNumber ? (
            <span className="ml-1 text-[10px] opacity-60">{ch.phoneNumber}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
