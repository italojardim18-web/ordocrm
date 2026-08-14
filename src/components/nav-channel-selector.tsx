"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export interface ChannelItem {
  id: string;
  label: string;
  phoneNumber?: string | null;
}

export function NavChannelSelector({ channels }: { channels: ChannelItem[] }) {
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

  const opcoes: ChannelItem[] =
    channels.length > 0
      ? channels
      : [
          { id: "a2083d65-2f36-461f-968e-69b335214e17", label: "Dr. Ítalo" },
          { id: "d247fc51-f06d-48d7-ba12-ce3e36307076", label: "Secretária" },
        ];

  return (
    <div
      role="group"
      aria-label="Filtro de linha de WhatsApp"
      className="flex items-center gap-1 rounded-full bg-card/90 backdrop-blur-md p-1 border border-border/80 text-xs shadow-sm"
    >
      <button
        type="button"
        onClick={() => handleChange("todas")}
        disabled={pending}
        className={cn(
          "rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold transition-all shadow-2xs whitespace-nowrap",
          current === "todas"
            ? "bg-primary text-primary-foreground shadow-xs font-bold"
            : "text-primary hover:bg-primary/10",
        )}
      >
        Todas
      </button>
      {opcoes.map((ch) => (
        <button
          key={ch.id}
          type="button"
          onClick={() => handleChange(ch.id)}
          disabled={pending}
          className={cn(
            "rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs whitespace-nowrap",
            current === ch.id
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-primary hover:bg-primary/10",
          )}
        >
          <span className="hidden sm:inline-block text-[11px]">📱</span>
          <span>{ch.label}</span>
        </button>
      ))}
    </div>
  );
}
