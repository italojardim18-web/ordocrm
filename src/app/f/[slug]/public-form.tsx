"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PublicForm({
  slug,
  successMessage,
}: {
  slug: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(0);
  const utms = useRef<Record<string, string>>({});

  // UTMs e instante de montagem são lidos uma vez, sem virar estado de render.
  useEffect(() => {
    mountedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const value = params.get(key);
      if (value) captured[key] = value.slice(0, 120);
    }
    utms.current = captured;
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("elapsed", String(Date.now() - mountedAt.current));
    for (const [key, value] of Object.entries(utms.current)) {
      formData.set(key, value);
    }

    try {
      const response = await fetch(`/api/forms/${slug}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Não foi possível enviar.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-lg border bg-card p-6 text-center"
      >
        <p className="text-lg font-medium text-primary">{successMessage}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Em breve entraremos em contato pelo canal informado.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border bg-card p-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" name="name" required minLength={2} maxLength={160} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">WhatsApp</Label>
        <Input
          id="phone"
          name="phone"
          inputMode="tel"
          placeholder="(67) 99999-0000"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">
        Informe ao menos um: WhatsApp ou e-mail.
      </p>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Como podemos ajudar?</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          className="border-input rounded-md border bg-transparent p-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
        />
      </div>

      {/* Honeypot: invisível para pessoas, atraente para robôs. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar contato"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Seus dados são usados apenas para retornar seu contato comercial. Não
        preencha informações de saúde neste formulário.
      </p>
    </form>
  );
}
