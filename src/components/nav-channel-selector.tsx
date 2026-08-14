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
      className="flex items-center gap-1 rounded-full bg-sidebar-accent/50 p-1 border border-sidebar-border/40 text-xs text-sidebar-foreground"
    >
      <button
        type="button"
        onClick={() => handleChange("todas")}
        disabled={pending}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition-all",
          current === "todas"
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs font-semibold"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
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
            "rounded-full px-3 py-1 text-xs font-medium transition-all flex items-center gap-1.5",
            current === ch.id
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs font-semibold"
              : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
          )}
        >
          <span className="text-[10px]">📱</span>
          <span>{ch.label}</span>
        </button>
      ))}
    </div>
  );
}
