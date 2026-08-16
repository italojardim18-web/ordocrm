"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PrivacyModeToggle({ className }: { className?: string }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Inicializa o estado lendo do localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("ordo_privacy_mode") === "true";
      setIsPrivacyMode(saved);
      if (saved) {
        document.documentElement.classList.add("privacy-mode");
        document.body.classList.add("privacy-mode");
      } else {
        document.documentElement.classList.remove("privacy-mode");
        document.body.classList.remove("privacy-mode");
      }
    } catch {
      /* fallback */
    }
  }, []);

  // Listener para atalho de teclado global (Alt + P ou Cmd + Shift + P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "p") || (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p")) {
        e.preventDefault();
        togglePrivacyMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPrivacyMode]);

  const togglePrivacyMode = () => {
    const next = !isPrivacyMode;
    setIsPrivacyMode(next);
    try {
      localStorage.setItem("ordo_privacy_mode", String(next));
      if (next) {
        document.documentElement.classList.add("privacy-mode");
        document.body.classList.add("privacy-mode");
        toast.info("🛡️ Modo Sigilo Ativado", {
          description: "Nomes de pacientes, conversas e valores financeiros foram ocultados.",
          duration: 3000,
        });
      } else {
        document.documentElement.classList.remove("privacy-mode");
        document.body.classList.remove("privacy-mode");
        toast.success("👁️ Modo Sigilo Desativado", {
          description: "Informações confidenciais agora estão visíveis.",
          duration: 2500,
        });
      }
    } catch {
      /* fallback */
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "size-9 sm:size-10 rounded-full border border-border/60 bg-card p-2 opacity-60",
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={togglePrivacyMode}
      aria-pressed={isPrivacyMode}
      aria-label={isPrivacyMode ? "Desativar Modo Sigilo (Mostrar dados)" : "Ativar Modo Sigilo (Ocultar dados sensíveis)"}
      title={
        isPrivacyMode
          ? "Modo Sigilo ATIVO: Dados de pacientes e financeiros estão ocultos. Clique para exibir (Atalho: Alt + P)"
          : "Modo Sigilo DESATIVADO: Clique para ocultar nomes de pacientes e valores na tela (Atalho: Alt + P)"
      }
      className={cn(
        "group relative flex size-9 sm:size-10 items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40",
        isPrivacyMode
          ? "border-amber-400 bg-amber-50 text-amber-900 shadow-sm ring-2 ring-amber-300/60 dark:border-amber-600 dark:bg-amber-950/80 dark:text-amber-200"
          : "border-border/80 bg-card text-muted-foreground shadow-xs hover:border-primary/40 hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {isPrivacyMode ? (
        /* Ícone Olho Fechado / Oculto */
        <svg
          className="size-4.5 sm:size-5 transition-transform group-hover:scale-110"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
          />
        </svg>
      ) : (
        /* Ícone Olho Aberto / Visível */
        <svg
          className="size-4.5 sm:size-5 transition-transform group-hover:scale-110"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}

      {/* Ponto indicador ativo */}
      {isPrivacyMode && (
        <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
        </span>
      )}
    </button>
  );
}
