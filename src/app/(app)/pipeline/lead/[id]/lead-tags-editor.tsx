"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addTagToLead, removeTagFromLead, createWorkspaceTag } from "../../actions";
import type { TagItem } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PALETTE = [
  "#521D2A", // Burgundy ORDO
  "#B2966F", // Brass Dourado
  "#10B981", // Esmeralda
  "#3B82F6", // Azul
  "#8B5CF6", // Roxo
  "#F59E0B", // Âmbar
  "#EC4899", // Rosa
  "#64748B", // Grafite / Slate
];

interface LeadTagsEditorProps {
  leadId: string;
  leadTags: TagItem[];
  allWorkspaceTags: TagItem[];
}

export function LeadTagsEditor({
  leadId,
  leadTags,
  allWorkspaceTags,
}: LeadTagsEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(PALETTE[0]);

  const activeTagIds = new Set(leadTags.map((t) => t.id));
  const availableTags = allWorkspaceTags.filter((t) => !activeTagIds.has(t.id));

  function handleAdd(tagId: string) {
    startTransition(async () => {
      const res = await addTagToLead(leadId, tagId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Etiqueta adicionada.");
      }
    });
  }

  function handleRemove(tagId: string) {
    startTransition(async () => {
      const res = await removeTagFromLead(leadId, tagId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Etiqueta removida.");
      }
    });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagName.trim()) return;

    startTransition(async () => {
      const res = await createWorkspaceTag(newTagName.trim(), newTagColor);
      if (res.error || !res.tag) {
        toast.error(res.error || "Erro ao criar etiqueta.");
      } else {
        toast.success(`Etiqueta "${res.tag.name}" criada!`);
        // Adiciona imediatamente ao lead
        await addTagToLead(leadId, res.tag.id);
        setNewTagName("");
        setIsCreating(false);
      }
    });
  }

  return (
    <div className="ordo-card-compact p-4 flex flex-col gap-3 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏷️</span>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Etiquetas / Tags
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full h-7 px-2.5 text-[11px] font-semibold border-primary/30 text-primary hover:bg-primary/10"
        >
          {isOpen ? "Fechar" : "+ Adicionar"}
        </Button>
      </div>

      {/* Lista de Tags Ativas */}
      <div className="flex flex-wrap gap-1.5 min-h-6 items-center">
        {leadTags.map((tag) => (
          <span
            key={tag.id}
            style={{ backgroundColor: `${tag.color}15`, borderColor: `${tag.color}40`, color: tag.color }}
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs"
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
            <span>{tag.name}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag.id)}
              disabled={isPending}
              className="ml-0.5 rounded-full hover:opacity-75 text-[11px]"
              title="Remover etiqueta"
            >
              ✕
            </button>
          </span>
        ))}

        {leadTags.length === 0 ? (
          <span className="text-[11px] text-muted-foreground italic">
            Nenhuma etiqueta atribuída a este lead.
          </span>
        ) : null}
      </div>

      {/* Dropdown / Modal Inline de Seleção e Criação */}
      {isOpen ? (
        <div className="border-t border-border/60 pt-3 flex flex-col gap-2.5">
          {!isCreating ? (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Escolha uma etiqueta existente:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAdd(tag.id)}
                    disabled={isPending}
                    style={{ borderColor: `${tag.color}50`, color: tag.color }}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-semibold hover:bg-muted transition-colors"
                  >
                    <span className="size-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    <span>+ {tag.name}</span>
                  </button>
                ))}

                {availableTags.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">
                    Todas as etiquetas existentes já foram adicionadas.
                  </span>
                ) : null}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ✨ Criar nova etiqueta personalizada
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="flex flex-col gap-2.5 bg-muted/20 p-2.5 rounded-xl border border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Nova Etiqueta</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Voltar
                </button>
              </div>

              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nome (ex: VIP, Casal, Indicação)"
                maxLength={40}
                required
                className="h-8 text-xs rounded-xl"
              />

              {/* Seletor de Cores */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Cor:</span>
                <div className="flex gap-1.5">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewTagColor(c)}
                      style={{ backgroundColor: c }}
                      className={`size-5 rounded-full transition-transform ${
                        newTagColor === c ? "scale-125 ring-2 ring-foreground" : "hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={isPending || !newTagName.trim()}
                className="h-7 text-xs rounded-xl font-semibold mt-1"
              >
                {isPending ? "Criando..." : "Salvar e Aplicar"}
              </Button>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
