"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "sonner";
import { moveLead } from "./actions";
import type { LeadCard, Member, Stage } from "@/lib/crm/types";
import { NewStageColumn } from "./new-stage-column";
import { channelLabel, formatBRL, formatDate } from "@/lib/format";
import { positionBetween } from "@/lib/positions";
import { initials } from "@/lib/validation";
import {
  computeLeadTemperature,
  TEMPERATURE_CONFIG,
} from "@/lib/crm/temperature";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BoardState = Record<string, LeadCard[]>;

function groupByStage(stages: Stage[], leads: LeadCard[]): BoardState {
  const board: BoardState = {};
  for (const stage of stages) board[stage.id] = [];
  for (const lead of leads) {
    if (board[lead.stage_id]) board[lead.stage_id].push(lead);
  }
  for (const stage of stages) {
    board[stage.id].sort((a, b) => a.position - b.position);
  }
  return board;
}

function hasOverdueTask(lead: LeadCard): boolean {
  const now = Date.now();
  return lead.tasks.some(
    (t) => !t.completed_at && t.due_at && new Date(t.due_at).getTime() < now,
  );
}

function getFollowUpStatus(followUpAt: string | null | undefined): {
  label: string;
  variant: "destructive" | "outline" | "secondary";
  className?: string;
} | null {
  if (!followUpAt) return null;
  const now = new Date();
  const date = new Date(followUpAt);
  const isPast = date.getTime() < now.getTime();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isPast && !isToday) {
    return {
      label: "Follow-up atrasado",
      variant: "destructive",
    };
  }
  if (isToday) {
    return {
      label: "Follow-up hoje",
      variant: "outline",
      className: "border-amber-500/40 text-amber-700 bg-amber-500/10 dark:text-amber-400 font-medium",
    };
  }
  return {
    label: `Retorno: ${formatDate(date)}`,
    variant: "outline",
    className: "text-muted-foreground",
  };
}

function LeadCardView({
  lead,
  stages,
  members,
  onMoveTo,
  dragging,
}: {
  lead: LeadCard;
  stages: Stage[];
  members: Member[];
  onMoveTo: (leadId: string, stageId: string) => void;
  dragging?: boolean;
}) {
  const owner = members.find((m) => m.userId === lead.owner_id);
  const overdue = hasOverdueTask(lead);
  const temp = computeLeadTemperature(lead);
  const tempCfg = TEMPERATURE_CONFIG[temp.temperature];
  const followUpStatus = getFollowUpStatus(lead.follow_up_at);

  return (
    <div
      className={`ordo-card-compact p-4 flex flex-col gap-3 transition-all ${
        dragging
          ? "opacity-60 scale-105 shadow-xl rotate-1 border-primary"
          : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {/* Topo do Card: Nome e Menu */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/pipeline/lead/${lead.id}`}
          className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground hover:text-primary hover:underline transition-colors"
        >
          {lead.name}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações de ${lead.name}`}
              className="tap-target -mr-1 -mt-1 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
            >
              ⋯
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
            <DropdownMenuItem asChild>
              <Link href={`/pipeline/lead/${lead.id}`}>👤 Abrir Lead 360°</Link>
            </DropdownMenuItem>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Mover para etapa
            </DropdownMenuLabel>
            {stages
              .filter((s) => s.id !== lead.stage_id)
              .map((stage) => (
                <DropdownMenuItem
                  key={stage.id}
                  onSelect={() => onMoveTo(lead.id, stage.id)}
                >
                  {stage.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Badges e Pílulas de Status */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          title={temp.reason}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${tempCfg.badgeClass}`}
        >
          <span>{tempCfg.emoji}</span>
          <span>{tempCfg.label}</span>
        </span>
        <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0.5 font-medium">
          {channelLabel(lead.channel)}
        </Badge>
        {followUpStatus ? (
          <Badge
            variant={followUpStatus.variant}
            className={`rounded-full text-[10px] px-2 py-0.5 ${followUpStatus.className ?? ""}`}
          >
            {followUpStatus.label}
          </Badge>
        ) : overdue ? (
          <Badge variant="destructive" className="rounded-full text-[10px] px-2 py-0.5 font-semibold">
            Tarefa atrasada
          </Badge>
        ) : null}

        {lead.tags && lead.tags.length > 0 ? (
          lead.tags.map((t) => (
            <span
              key={t.id}
              style={{ backgroundColor: `${t.color}15`, borderColor: `${t.color}40`, color: t.color }}
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[9px] font-semibold"
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: t.color }} />
              <span>{t.name}</span>
            </span>
          ))
        ) : null}
      </div>

      {/* Rodapé do Card: Valor em Destaque e Avatar */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
        <span className="font-heading font-semibold text-primary tracking-tight">
          {formatBRL(lead.potential_value)}
        </span>
        {owner ? (
          <span
            aria-label={`Responsável: ${owner.fullName}`}
            title={owner.fullName}
            className="flex size-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground ring-1 ring-border shadow-2xs"
          >
            {initials(owner.fullName)}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground/60">Sem resp.</span>
        )}
      </div>
    </div>
  );
}

function SortableLeadCard(props: {
  lead: LeadCard;
  stages: Stage[];
  members: Member[];
  onMoveTo: (leadId: string, stageId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.lead.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="touch-manipulation list-none"
    >
      <LeadCardView {...props} dragging={isDragging} />
    </li>
  );
}

function StageColumn({
  stage,
  leads,
  stages,
  members,
  onMoveTo,
}: {
  stage: Stage;
  leads: LeadCard[];
  stages: Stage[];
  members: Member[];
  onMoveTo: (leadId: string, stageId: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id: stage.id });
  const total = leads.reduce((sum, l) => sum + (l.potential_value ?? 0), 0);

  return (
    <div className="flex w-72 sm:w-76 xl:w-80 shrink-0 flex-col rounded-3xl bg-muted/45 p-3 border border-border/60 shadow-2xs">
      {/* Cabeçalho da Coluna em Pílula */}
      <div className="flex items-center justify-between gap-2 px-2 pb-3 pt-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
            {leads.length}
          </span>
          <h2 className="truncate text-sm font-bold text-foreground tracking-tight">
            {stage.name}
          </h2>
        </div>
        {total > 0 ? (
          <span className="shrink-0 rounded-full bg-card px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-border/60">
            {formatBRL(total)}
          </span>
        ) : null}
      </div>

      {/* Lista de Cards da Etapa */}
      <SortableContext
        items={leads.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className="flex min-h-64 flex-1 flex-col gap-2.5 rounded-2xl p-1 transition-colors"
        >
          {leads.map((lead) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              stages={stages}
              members={members}
              onMoveTo={onMoveTo}
            />
          ))}
          {leads.length === 0 ? (
            <li className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground/70">
              Arraste leads para cá
            </li>
          ) : null}
        </ul>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({
  stages,
  leads,
  members,
  pipelineId,
  isAdmin,
}: {
  stages: Stage[];
  leads: LeadCard[];
  members: Member[];
  pipelineId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [board, setBoard] = useState<BoardState>(() =>
    groupByStage(stages, leads),
  );
  const [activeLead, setActiveLead] = useState<LeadCard | null>(null);

  useMemo(() => {
    setBoard(groupByStage(stages, leads));
  }, [stages, leads]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor),
  );

  function moveToStage(leadId: string, toStageId: string) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage_id === toStageId) return;

    const targetList = board[toStageId] ?? [];
    const position =
      targetList.length > 0
        ? targetList[targetList.length - 1].position + 1000
        : 1000;

    startTransition(async () => {
      const res = await moveLead(leadId, toStageId, position);
      if (res?.error) {
        toast.error(res.error);
        router.refresh();
      } else {
        toast.success("Lead movido.");
        router.refresh();
      }
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const lead = leads.find((l) => l.id === event.active.id);
    if (lead) setActiveLead(lead);
  }

  function persistMove(leadId: string, toStageId: string, position: number) {
    startTransition(async () => {
      const res = await moveLead(leadId, toStageId, position);
      if (res?.error) {
        toast.error(res.error);
        router.refresh();
      }
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    let fromColumn: string | null = null;
    for (const [stageId, stageLeads] of Object.entries(board)) {
      if (stageLeads.some((l) => l.id === activeId)) {
        fromColumn = stageId;
        break;
      }
    }
    if (!fromColumn) return;

    let toColumn: string | null = null;
    if (stages.some((s) => s.id === overId)) {
      toColumn = overId;
    } else {
      for (const [stageId, stageLeads] of Object.entries(board)) {
        if (stageLeads.some((l) => l.id === overId)) {
          toColumn = stageId;
          break;
        }
      }
    }
    if (!toColumn) return;

    const source = board[fromColumn].filter((l) => l.id !== activeId);
    const moved = board[fromColumn].find((l) => l.id === activeId);
    if (!moved) return;

    const targetBase =
      fromColumn === toColumn ? source : [...board[toColumn]];

    let insertAt =
      overId === toColumn
        ? targetBase.length
        : targetBase.findIndex((l) => l.id === overId);
    if (insertAt < 0) insertAt = targetBase.length;

    const before = insertAt > 0 ? targetBase[insertAt - 1].position : null;
    const after =
      insertAt < targetBase.length ? targetBase[insertAt].position : null;
    const position = positionBetween(before, after);

    const movedLead = { ...moved, stage_id: toColumn, position };
    const target = [
      ...targetBase.slice(0, insertAt),
      movedLead,
      ...targetBase.slice(insertAt),
    ];

    if (fromColumn === toColumn) {
      if (moved.position === position) return;
      setBoard({ ...board, [toColumn]: target });
    } else {
      setBoard({ ...board, [fromColumn]: source, [toColumn]: target });
    }

    persistMove(activeId, toColumn, position);
  }

  return (
    <DndContext
      id="pipeline-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveLead(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
        {stages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            leads={board[stage.id] ?? []}
            stages={stages}
            members={members}
            onMoveTo={moveToStage}
          />
        ))}
        {/* Opção ao final do pipeline de criar nova coluna */}
        <NewStageColumn pipelineId={pipelineId} isAdmin={isAdmin} />
      </div>
      <DragOverlay>
        {activeLead ? (
          <LeadCardView
            lead={activeLead}
            stages={stages}
            members={members}
            onMoveTo={() => {}}
            dragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
