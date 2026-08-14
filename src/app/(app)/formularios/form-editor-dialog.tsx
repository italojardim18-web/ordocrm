"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateForm } from "./actions";
import type { FormEndpoint, FormQuestion, FormQuestionType, FormSchema } from "@/lib/forms/types";
import type { Pipeline, Stage } from "@/lib/crm/types";

const QUESTION_TYPES: { type: FormQuestionType; label: string; icon: string }[] = [
  { type: "text", label: "Texto Curto", icon: "✏️" },
  { type: "phone", label: "WhatsApp / Telefone", icon: "📱" },
  { type: "email", label: "E-mail", icon: "✉️" },
  { type: "textarea", label: "Texto Longo / Mensagem", icon: "📄" },
  { type: "radio", label: "Escolha Única", icon: "🔘" },
  { type: "select", label: "Lista Suspensa", icon: "🔽" },
  { type: "scale", label: "Escala (1 a 10)", icon: "⭐" },
  { type: "date", label: "Data", icon: "📅" },
];

export function FormEditorDialog({
  form,
  stages = [],
  pipelines = [],
  open,
  onOpenChange,
}: {
  form: FormEndpoint | null;
  stages?: Stage[];
  pipelines?: Pipeline[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<"questions" | "pipeline" | "messages">("questions");
  const [name, setName] = useState(form?.name || "");
  const [slug, setSlug] = useState(form?.slug || "");
  const [pipelineId, setPipelineId] = useState(form?.pipeline_id || "");
  const [schema, setSchema] = useState<FormSchema>(
    form?.schema || {
      welcome: { title: "Bem-vindo", description: "Preencha suas informações para iniciarmos seu atendimento.", buttonText: "Começar" },
      questions: [],
      thankyou: { title: "Obrigado!", description: "Recebemos suas informações com sucesso. Entraremos em contato em breve." },
    },
  );
  const [isPending, startTransition] = useTransition();

  // Reset state when form changes
  if (form && form.name !== name && !isPending && open) {
    setName(form.name);
    setSlug(form.slug);
    setPipelineId(form.pipeline_id || "");
    if (form.schema) setSchema(form.schema);
  }

  function addQuestion(type: FormQuestionType) {
    const newQ: FormQuestion = {
      id: `q_${Date.now()}`,
      type,
      title: type === "phone" ? "Qual o seu WhatsApp?" : type === "email" ? "Qual o seu e-mail?" : "Nova Pergunta",
      placeholder: "",
      required: true,
      mapsTo: type === "phone" ? "phone" : type === "email" ? "email" : type === "text" ? "name" : "notes",
      options: type === "radio" || type === "select" ? ["Opção 1", "Opção 2"] : undefined,
    };
    setSchema((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
  }

  function removeQuestion(id: string) {
    setSchema((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }

  function updateQuestion(id: string, updates: Partial<FormQuestion>) {
    setSchema((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));
  }

  function handleSave() {
    if (!form) return;
    if (!name.trim()) {
      toast.error("O nome do formulário é obrigatório");
      return;
    }

    startTransition(async () => {
      const res = await updateForm(form.id, {
        name,
        slug: slug.trim() || form.slug,
        pipeline_id: pipelineId || null,
        schema,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Formulário salvo com sucesso!");
        onOpenChange(false);
      }
    });
  }

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-6 border-border shadow-2xl">
        <DialogHeader className="pb-3 border-b border-border/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <DialogTitle className="font-heading text-2xl text-primary font-bold">
                Editor do Formulário
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure as perguntas, mapeamento do Lead e conexão com o funil do CRM
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-full text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5 shadow-xs"
              >
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>

          {/* Abas do Editor */}
          <div className="flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => setTab("questions")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tab === "questions"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              📝 Perguntas ({schema.questions.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("pipeline")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tab === "pipeline"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              ⚡ Funil & Destino do Lead
            </button>
            <button
              type="button"
              onClick={() => setTab("messages")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tab === "messages"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              ✨ Boas-vindas & Agradecimento
            </button>
          </div>
        </DialogHeader>

        {/* Conteúdo da Aba Perguntas */}
        {tab === "questions" ? (
          <div className="flex flex-col gap-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/25 border border-border/70">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Nome do Formulário:</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Triagem Inicial de Pacientes"
                  className="rounded-xl h-9 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Slug da URL Pública:</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-mono">/f/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="triagem"
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Lista de Perguntas */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">Campos do Formulário</h3>
                <span className="text-xs text-muted-foreground">
                  Arraste ou adicione novos campos abaixo
                </span>
              </div>

              {schema.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="flex flex-col gap-2.5 p-4 rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <Input
                      value={q.title}
                      onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                      placeholder="Título da pergunta..."
                      className="flex-1 font-semibold text-xs h-9 rounded-xl"
                    />
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, { type: e.target.value as FormQuestionType })}
                      aria-label="Tipo da pergunta"
                      className="h-9 rounded-xl border border-border bg-muted/40 px-2.5 text-xs font-medium"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.type} value={t.type}>
                          {t.icon} {t.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(q.id)}
                      className="text-destructive hover:bg-destructive/10 size-8 rounded-full"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-border/50">
                    <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                      <input
                        type="checkbox"
                        checked={q.required ?? true}
                        onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                        className="rounded border-border"
                      />
                      Obrigatório
                    </label>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-muted-foreground text-[11px]">Vincular ao CRM:</span>
                      <select
                        value={q.mapsTo ?? "notes"}
                        onChange={(e) => updateQuestion(q.id, { mapsTo: e.target.value as any })}
                        aria-label="Vincular ao CRM"
                        className="h-7 rounded-lg border border-border bg-muted/30 px-2 text-[11px] font-semibold text-primary"
                      >
                        <option value="name">Nome do Lead</option>
                        <option value="phone">WhatsApp do Lead</option>
                        <option value="email">E-mail do Lead</option>
                        <option value="notes">Nota Clínica / Histórico</option>
                        <option value="none">Apenas resposta do formulário</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botões de Adicionar Campo */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  + Adicionar Campo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_TYPES.map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => addQuestion(t.type)}
                      className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary shadow-2xs"
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Conteúdo da Aba Funil */}
        {tab === "pipeline" ? (
          <div className="flex flex-col gap-4 pt-3">
            <div className="rounded-2xl border border-border p-4 bg-muted/20 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-primary">Destino dos Novos Leads</h3>
              <p className="text-xs text-muted-foreground">
                Quando um paciente envia este formulário, o ORDO cria o lead em tempo real na etapa escolhida.
              </p>

              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Pipeline / Funil de Vendas:</label>
                <select
                  value={pipelineId}
                  onChange={(e) => setPipelineId(e.target.value)}
                  className="h-10 rounded-xl border border-border bg-card px-3.5 text-xs font-medium shadow-xs"
                >
                  <option value="">Pipeline Padrão do Workspace</option>
                  {pipelines.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {/* Conteúdo da Aba Mensagens */}
        {tab === "messages" ? (
          <div className="flex flex-col gap-5 pt-3">
            {/* Boas-Vindas */}
            <div className="flex flex-col gap-2.5 p-4 rounded-2xl border border-border bg-card shadow-xs">
              <h3 className="text-sm font-bold text-primary">Tela de Boas-Vindas</h3>
              <Input
                value={schema.welcome?.title || ""}
                onChange={(e) =>
                  setSchema((prev) => ({
                    ...prev,
                    welcome: { ...prev.welcome, title: e.target.value },
                  }))
                }
                placeholder="Título de boas-vindas..."
                className="rounded-xl h-9 text-xs font-semibold"
              />
              <textarea
                value={schema.welcome?.description || ""}
                onChange={(e) =>
                  setSchema((prev) => ({
                    ...prev,
                    welcome: { ...prev.welcome, description: e.target.value },
                  }))
                }
                rows={2}
                placeholder="Texto explicativo antes de iniciar as perguntas..."
                className="w-full rounded-xl border border-border bg-muted/20 p-2.5 text-xs resize-none"
              />
            </div>

            {/* Agradecimento */}
            <div className="flex flex-col gap-2.5 p-4 rounded-2xl border border-border bg-card shadow-xs">
              <h3 className="text-sm font-bold text-primary">Tela de Agradecimento (Pós-Envio)</h3>
              <Input
                value={schema.thankyou?.title || ""}
                onChange={(e) =>
                  setSchema((prev) => ({
                    ...prev,
                    thankyou: { ...prev.thankyou, title: e.target.value },
                  }))
                }
                placeholder="Título final (ex: Obrigado!)..."
                className="rounded-xl h-9 text-xs font-semibold"
              />
              <textarea
                value={schema.thankyou?.description || ""}
                onChange={(e) =>
                  setSchema((prev) => ({
                    ...prev,
                    thankyou: { ...prev.thankyou, description: e.target.value },
                  }))
                }
                rows={2}
                placeholder="Mensagem de confirmação exibida ao paciente..."
                className="w-full rounded-xl border border-border bg-muted/20 p-2.5 text-xs resize-none"
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
