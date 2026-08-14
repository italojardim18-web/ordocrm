"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FormEndpoint } from "@/lib/forms/types";

export function ShareDialog({
  form,
  open,
  onOpenChange,
}: {
  form: FormEndpoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<"link" | "embed">("link");

  if (!form) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://app.ordocrm.com.br";
  const publicUrl = `${baseUrl}/f/${form.slug}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="650" frameborder="0" style="border-radius: 16px; border: 1px solid #ded7cc;"></iframe>`;

  function copyText(text: string, msg: string) {
    navigator.clipboard.writeText(text);
    toast.success(msg);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl bg-card p-6 border-border shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="font-heading text-xl text-primary font-bold">
            Compartilhar Formulário
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {form.name} · Link público e integração
          </DialogDescription>
        </DialogHeader>

        {/* Abas */}
        <div className="flex rounded-full bg-muted/60 p-1 border border-border/80 text-xs">
          <button
            type="button"
            onClick={() => setTab("link")}
            className={`flex-1 rounded-full py-1.5 font-semibold transition-all ${
              tab === "link"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔗 Link Direto
          </button>
          <button
            type="button"
            onClick={() => setTab("embed")}
            className={`flex-1 rounded-full py-1.5 font-semibold transition-all ${
              tab === "embed"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💻 Incorporar (Site)
          </button>
        </div>

        {tab === "link" ? (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                URL Pública do Paciente:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="h-10 flex-1 rounded-2xl border border-border bg-muted/30 px-3.5 text-xs text-foreground font-mono"
                />
                <Button
                  onClick={() => copyText(publicUrl, "Link copiado para a área de transferência!")}
                  className="rounded-2xl bg-primary text-primary-foreground text-xs font-semibold shrink-0"
                >
                  Copiar
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 flex flex-col gap-2">
              <p className="text-xs font-medium text-foreground">
                💡 <strong>Dica de Uso:</strong>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Envie esse link no WhatsApp do paciente, insira na bio do seu Instagram ou anexe às suas automações de etapa do ORDO CRM. Cada resposta criará um novo lead automaticamente no seu Pipeline!
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                Abrir formulário no navegador ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            <label className="text-xs font-semibold text-foreground">
              Código HTML para colocar no seu site:
            </label>
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full rounded-2xl border border-border bg-muted/30 p-3 text-xs font-mono text-foreground resize-none"
            />
            <Button
              onClick={() => copyText(embedCode, "Código de incorporação copiado!")}
              className="w-full rounded-2xl bg-primary text-primary-foreground text-xs font-semibold"
            >
              Copiar Código HTML
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
