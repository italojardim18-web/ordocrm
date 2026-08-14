"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormEndpoint, FormQuestion } from "@/lib/forms/types";

export function PublicForm({
  slug,
  endpoint,
  brandName,
  successMessage,
}: {
  slug: string;
  endpoint?: FormEndpoint;
  brandName?: string | null;
  successMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const mountedAt = useRef<number>(0);
  const utms = useRef<Record<string, string>>({});

  // Respostas dinâmicas
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: FormQuestion[] = endpoint?.schema?.questions && endpoint.schema.questions.length > 0
    ? endpoint.schema.questions
    : [
        { id: "name", type: "text", title: "Qual é o seu nome completo?", placeholder: "Seu nome", required: true, mapsTo: "name" },
        { id: "phone", type: "phone", title: "Qual é o seu WhatsApp com DDD?", placeholder: "(00) 00000-0000", required: true, mapsTo: "phone" },
        { id: "email", type: "email", title: "Qual o seu melhor e-mail?", placeholder: "seu@email.com", required: false, mapsTo: "email" },
        { id: "message", type: "textarea", title: "Como podemos ajudar você?", placeholder: "Escreva sua mensagem...", required: false, mapsTo: "notes" },
      ];

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

  function handleInputChange(question: FormQuestion, value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    // Mapear campos principais
    let nameVal = "";
    let phoneVal = "";
    let emailVal = "";
    let messageVal = "";
    const extraAnswers: Record<string, string> = {};

    for (const q of questions) {
      const val = answers[q.id]?.trim() || "";
      if (q.mapsTo === "name") nameVal = val;
      else if (q.mapsTo === "phone") phoneVal = val;
      else if (q.mapsTo === "email") emailVal = val;
      else if (q.mapsTo === "notes") {
        if (!messageVal) messageVal = val;
        else extraAnswers[q.title] = val;
      } else {
        extraAnswers[q.title] = val;
      }
    }

    // Fallbacks se não mapeado diretamente
    if (!nameVal) nameVal = answers["name"] || answers["q_nome"] || "Contato via Formulário";
    if (!phoneVal) phoneVal = answers["phone"] || answers["q_phone"] || "";
    if (!emailVal) emailVal = answers["email"] || answers["q_email"] || "";

    const payload = {
      name: nameVal,
      phone: phoneVal,
      email: emailVal,
      message: messageVal,
      answers: extraAnswers,
      elapsed: Date.now() - mountedAt.current,
      ...utms.current,
    };

    try {
      const response = await fetch(`/api/forms/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Não foi possível enviar suas informações.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Falha de conexão. Por favor, tente novamente.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-border/80 bg-card p-8 text-center shadow-xl animate-in fade-in"
      >
        <span className="text-4xl">✨</span>
        <h2 className="text-xl font-heading font-bold text-primary mt-3">
          {endpoint?.schema?.thankyou?.title || successMessage}
        </h2>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {endpoint?.schema?.thankyou?.description ||
            "Recebemos suas respostas com sucesso. Nossa equipe entrará em contato em breve."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xl"
    >
      {questions.map((q, idx) => {
        const val = answers[q.id] || "";

        return (
          <div key={q.id} className="flex flex-col gap-1.5">
            <Label htmlFor={q.id} className="text-xs font-semibold text-foreground">
              {q.title} {q.required ? <span className="text-primary font-bold">*</span> : null}
            </Label>

            {q.type === "textarea" ? (
              <textarea
                id={q.id}
                required={q.required}
                rows={3}
                placeholder={q.placeholder || "Digite sua resposta..."}
                value={val}
                onChange={(e) => handleInputChange(q, e.target.value)}
                className="w-full rounded-2xl border border-border bg-muted/20 p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
              />
            ) : q.type === "scale" ? (
              <div className="flex items-center justify-between gap-1 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleInputChange(q, String(num))}
                    className={`size-8 rounded-xl text-xs font-bold transition-all ${
                      val === String(num)
                        ? "bg-primary text-primary-foreground shadow-xs scale-105"
                        : "border border-border bg-muted/30 text-foreground hover:bg-muted"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            ) : q.type === "radio" && q.options && q.options.length > 0 ? (
              <div className="flex flex-col gap-1.5 pt-1">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 rounded-2xl border p-2.5 text-xs cursor-pointer transition-all ${
                      val === opt
                        ? "border-primary bg-primary/5 font-bold text-primary"
                        : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      required={q.required}
                      checked={val === opt}
                      onChange={() => handleInputChange(q, opt)}
                      className="text-primary"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : q.type === "select" && q.options && q.options.length > 0 ? (
              <select
                id={q.id}
                required={q.required}
                value={val}
                onChange={(e) => handleInputChange(q, e.target.value)}
                className="h-10 rounded-2xl border border-border bg-muted/20 px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Selecione uma opção...</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={q.id}
                type={q.type === "phone" ? "tel" : q.type === "email" ? "email" : q.type === "date" ? "date" : "text"}
                required={q.required}
                placeholder={q.placeholder || (q.type === "phone" ? "(00) 00000-0000" : "")}
                value={val}
                onChange={(e) => handleInputChange(q, e.target.value)}
                className="h-10 rounded-2xl bg-muted/20 text-xs px-3.5"
              />
            )}
          </div>
        );
      })}

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium text-center">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="h-11 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md mt-2 hover:scale-101 transition-transform"
      >
        {status === "sending" ? "Enviando informações..." : "Enviar Formulário"}
      </Button>

      <div className="flex items-center justify-center gap-1.5 pt-2 opacity-60">
        <span className="text-[10px] text-muted-foreground">Powered by</span>
        <span className="font-heading text-xs font-bold text-primary tracking-wider">ORDO CRM</span>
      </div>
    </form>
  );
}
