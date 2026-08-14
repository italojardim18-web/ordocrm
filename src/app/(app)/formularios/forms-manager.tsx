"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createForm, createFormFolder, deleteForm, duplicateForm, toggleFormActive } from "./actions";
import { FormEditorDialog } from "./form-editor-dialog";
import { ShareDialog } from "./share-dialog";
import type { FormEndpoint, FormFolder } from "@/lib/forms/types";
import type { Pipeline, Stage } from "@/lib/crm/types";
import { formatDate } from "@/lib/format";

export function FormsManager({
  initialForms,
  initialFolders,
  stages,
  pipelines,
}: {
  initialForms: FormEndpoint[];
  initialFolders: FormFolder[];
  stages: Stage[];
  pipelines: Pipeline[];
}) {
  const [forms, setForms] = useState<FormEndpoint[]>(initialForms);
  const [folders, setFolders] = useState<FormFolder[]>(initialFolders);
  const [activeFolder, setActiveFolder] = useState<string>("todos");
  const [search, setSearch] = useState("");

  // Modais
  const [editingForm, setEditingForm] = useState<FormEndpoint | null>(null);
  const [sharingForm, setSharingForm] = useState<FormEndpoint | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [newFormFolder, setNewFormFolder] = useState("Geral");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Filtragem
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      const matchFolder =
        activeFolder === "todos"
          ? true
          : activeFolder === "sem"
          ? !f.folder || f.folder === "Geral"
          : f.folder === activeFolder;

      const matchSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.slug.toLowerCase().includes(search.toLowerCase());

      return matchFolder && matchSearch;
    });
  }, [forms, activeFolder, search]);

  const totalSubmissions = useMemo(() => {
    return forms.reduce((acc, f) => acc + (f.submissions_count || 0), 0);
  }, [forms]);

  const totalActive = useMemo(() => {
    return forms.filter((f) => f.is_active).length;
  }, [forms]);

  function handleCreateForm() {
    if (!newFormName.trim()) {
      toast.error("Informe o nome do formulário");
      return;
    }

    startTransition(async () => {
      const res = await createForm({
        name: newFormName,
        folder: newFormFolder,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.data) {
        toast.success("Formulário criado com sucesso!");
        setForms((prev) => [res.data as unknown as FormEndpoint, ...prev]);
        setNewFormName("");
        setIsCreating(false);
        setEditingForm(res.data as unknown as FormEndpoint);
      }
    });
  }

  function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    startTransition(async () => {
      const res = await createFormFolder(newFolderName);
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.data) {
        toast.success("Pasta criada!");
        setFolders((prev) => [...prev, res.data as FormFolder]);
        setNewFolderName("");
        setIsCreatingFolder(false);
      }
    });
  }

  function handleToggleStatus(form: FormEndpoint) {
    const nextStatus = !form.is_active;
    startTransition(async () => {
      const res = await toggleFormActive(form.id, nextStatus);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(nextStatus ? "Formulário ativado!" : "Formulário pausado.");
        setForms((prev) =>
          prev.map((f) => (f.id === form.id ? { ...f, is_active: nextStatus } : f)),
        );
      }
    });
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      const res = await duplicateForm(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Formulário duplicado!");
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este formulário?")) return;
    startTransition(async () => {
      const res = await deleteForm(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Formulário removido.");
        setForms((prev) => prev.filter((f) => f.id !== id));
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-3xl font-bold text-primary tracking-tight">
              ORDO Forms
            </h1>
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
              {forms.length} formulários
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Formulários de captação, triagem clínica e aplicação integrados ao seu CRM
          </p>
        </div>

        <Button
          onClick={() => setIsCreating(true)}
          className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 shadow-sm hover:scale-102 transition-transform"
        >
          + Criar Formulário
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Total de Formulários
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-2xl font-bold text-primary">{forms.length}</span>
            <span className="text-xs text-muted-foreground">({totalActive} ativos)</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Leads / Respostas Recebidas
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-2xl font-bold text-primary">{totalSubmissions}</span>
            <span className="text-xs text-emerald-600 font-medium">100% integrados</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Conexão com Funil
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-2xl font-bold text-primary">Tempo Real</span>
            <span className="text-xs text-muted-foreground">Pipeline automático</span>
          </div>
        </div>
      </div>

      {/* Corpo com Pastas e Grid de Formulários */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Coluna Esquerda: Pastas */}
        <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Pastas
            </span>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="text-xs text-primary hover:underline font-semibold"
            >
              + Nova
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveFolder("todos")}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                activeFolder === "todos"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span>📁 Todos os formulários</span>
              <span className="text-[11px] opacity-75">{forms.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFolder("sem")}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                activeFolder === "sem"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span>📄 Geral / Sem pasta</span>
              <span className="text-[11px] opacity-75">
                {forms.filter((f) => !f.folder || f.folder === "Geral").length}
              </span>
            </button>

            {folders.map((folder) => {
              const count = forms.filter((f) => f.folder === folder.name).length;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setActiveFolder(folder.name)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    activeFolder === folder.name
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="truncate">📁 {folder.name}</span>
                  <span className="text-[11px] opacity-75">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Filtros e Cards */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="🔍 Buscar formulário por nome ou link..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-full bg-card h-10 px-4 text-xs shadow-xs"
            />
          </div>

          {filteredForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card p-10 text-center gap-3">
              <span className="text-3xl">📝</span>
              <h3 className="text-sm font-bold text-foreground">Nenhum formulário encontrado</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Crie seu primeiro formulário para captar pacientes, agendar consultas e qualificar leads automaticamente.
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="rounded-full bg-primary text-primary-foreground text-xs font-bold mt-2"
              >
                + Criar Meu Primeiro Formulário
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    {/* Topo do Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${
                              form.is_active ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <h2 className="font-bold text-sm text-foreground hover:text-primary transition-colors">
                            {form.name}
                          </h2>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          /f/{form.slug}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full">
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 shadow-xl">
                          <DropdownMenuItem
                            onClick={() => setEditingForm(form)}
                            className="text-xs cursor-pointer"
                          >
                            ✏️ Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSharingForm(form)}
                            className="text-xs cursor-pointer"
                          >
                            🔗 Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(form)}
                            className="text-xs cursor-pointer"
                          >
                            {form.is_active ? "⏸️ Pausar" : "▶️ Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(form.id)}
                            className="text-xs cursor-pointer"
                          >
                            📑 Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(form.id)}
                            className="text-xs text-destructive cursor-pointer"
                          >
                            🗑️ Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Estatísticas do Card */}
                    <div className="flex items-center gap-4 py-4 text-xs text-muted-foreground border-y border-border/50 my-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">
                          {form.submissions_count || 0}
                        </span>
                        <span className="text-[10px]">Respostas</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">
                          {form.schema?.questions?.length || 0}
                        </span>
                        <span className="text-[10px]">Perguntas</span>
                      </div>
                      <div className="flex flex-col ml-auto text-right">
                        <span className="text-[10px] text-muted-foreground">Atualizado</span>
                        <span className="text-[11px] font-medium text-foreground">
                          {formatDate(form.updated_at || form.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Inferiores */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSharingForm(form)}
                      className="flex-1 rounded-full text-xs font-semibold"
                    >
                      🔗 Link & QR
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setEditingForm(form)}
                      className="flex-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
                    >
                      ✏️ Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Criar Formulário */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-md rounded-3xl bg-card p-6 border-border shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="font-heading text-xl text-primary font-bold">
              Criar Novo Formulário
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3.5 pt-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Nome do Formulário:</label>
              <Input
                placeholder="Ex: Formulário de Triagem Inicial"
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
                className="rounded-xl h-9 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground">Pasta:</label>
              <select
                value={newFormFolder}
                onChange={(e) => setNewFormFolder(e.target.value)}
                className="h-9 rounded-xl border border-border bg-card px-3 text-xs"
              >
                <option value="Geral">Geral</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(false)}
                className="rounded-full text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleCreateForm}
                disabled={isPending}
                className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5"
              >
                {isPending ? "Criando..." : "Criar Formulário"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Nova Pasta */}
      <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
        <DialogContent className="max-w-xs rounded-3xl bg-card p-5 border-border shadow-2xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="font-heading text-lg text-primary font-bold">
              Nova Pasta
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <Input
              placeholder="Nome da pasta..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingFolder(false)}
                className="rounded-full text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleCreateFolder}
                disabled={isPending}
                className="rounded-full bg-primary text-primary-foreground text-xs font-bold"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editor Visual */}
      <FormEditorDialog
        form={editingForm}
        stages={stages}
        pipelines={pipelines}
        open={Boolean(editingForm)}
        onOpenChange={(open) => {
          if (!open) setEditingForm(null);
        }}
      />

      {/* Compartilhamento */}
      <ShareDialog
        form={sharingForm}
        open={Boolean(sharingForm)}
        onOpenChange={(open) => {
          if (!open) setSharingForm(null);
        }}
      />
    </div>
  );
}
