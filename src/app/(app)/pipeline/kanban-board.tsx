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
      className: "border-amber-500/40 text-amber-700 bg-amber-500/10 dark:text-amber-400",
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
      className={`flex flex-col gap-2 rounded-md border bg-card p-3 shadow-xs ${
        dragging ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/pipeline/lead/${lead.id}`}
          className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
        >
          {lead.name}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações de ${lead.name}`}
              className="tap-target -mr-1 -mt-1 shrink-0"
            >
              ⋯
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/pipeline/lead/${lead.id}`}>Abrir lead</Link>
            </DropdownMenuItem>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Mover para
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
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          title={temp.reason}
          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium border ${tempCfg.badgeClass}`}
        >
          <span>{tempCfg.emoji}</span>
          <span>{tempCfg.label}</span>
        </span>
        <Badge variant="secondary" className="text-[10px]">
          {channelLabel(lead.channel)}
        </Badge>
        {followUpStatus ? (
          <Badge
            variant={followUpStatus.variant}
            className={`text-[10px] ${followUpStatus.className ?? ""}`}
          >
            {followUpStatus.label}
          </Badge>
        ) : overdue ? (
          <Badge variant="destructive" className="text-[10px]">
            Tarefa atrasada
          </Badge>
        ) : null}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatBRL(lead.potential_value)}</span>
        {owner ? (
          <span
            aria-label={`Responsável: ${owner.fullName}`}
            title={owner.fullName}
            className="flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground"
          >
            {initials(owner.fullName)}
          </span>
        ) : null}
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
      className="touch-manipulation"
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
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted">
      <div className="flex items-baseline justify-between gap-2 px-3 pb-2 pt-3">
        <h2 className="truncate text-sm font-semibold">{stage.name}</h2>
        <span className="shrink-0 text-xs text-muted-foreground">
          {leads.length}
          {total > 0 ? ` · ${formatBRL(total)}` : ""}
        </span>
      </div>
      <SortableContext
        items={leads.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          aria-label={`Etapa ${stage.name}`}
          className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto p-2"
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
            <li className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
              Sem leads nesta etapa
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
  const [board, setBoard] = useState<BoardState>(() =>
    groupByStage(stages, leads),
  );
  const [activeLead, setActiveLead] = useState<LeadCard | null>(null);
  const [, startTransition] = useTransition();

  // Sincroniza com os dados do servidor (refresh, realtime, filtros) usando o
  // padrão oficial de "ajustar estado durante a renderização".
  const [prevSync, setPrevSync] = useState<{
    stages: Stage[];
    leads: LeadCard[];
  }>({ stages, leads });
  if (prevSync.stages !== stages || prevSync.leads !== leads) {
    setPrevSync({ stages, leads });
    setBoard(groupByStage(stages, leads));
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const leadById = useMemo(() => {
    const map = new Map<string, LeadCard>();
    for (const list of Object.values(board)) {
      for (const lead of list) map.set(lead.id, lead);
    }
    return map;
  }, [board]);

  function findColumn(id: string): string | null {
    if (board[id]) return id;
    for (const [stageId, list] of Object.entries(board)) {
      if (list.some((l) => l.id === id)) return stageId;
    }
    return null;
  }

  function persistMove(leadId: string, stageId: string, position: number) {
    startTransition(async () => {
      const result = await moveLead(leadId, stageId, position);
      if (result.error) {
        toast.error(result.error);
        // Rollback: volta ao estado real do servidor.
        router.refresh();
      }
    });
  }

  /** Movimentação acessível pelo menu do card: vai para o fim da etapa. */
  function moveToStage(leadId: string, stageId: string) {
    const lead = leadById.get(leadId);
    if (!lead) return;
    const target = board[stageId] ?? [];
    const position = positionBetween(
      target.length > 0 ? target[target.length - 1].position : null,
      null,
    );
    setBoard((current) => {
      const next: BoardState = {};
      for (const [sid, list] of Object.entries(current)) {
        next[sid] = list.filter((l) => l.id !== leadId);
      }
      next[stageId] = [
        ...next[stageId],
        { ...lead, stage_id: stageId, position },
      ];
      return next;
    });
    persistMove(leadId, stageId, position);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveLead(leadById.get(String(event.active.id)) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromColumn = findColumn(activeId);
    const toColumn = board[overId] ? overId : findColumn(overId);
    if (!fromColumn || !toColumn) return;

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
      <div className="flex gap-3 overflow-x-auto pb-4">
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
        <NewStageColumn pipelineId={pipelineId} isAdmin={isAdmin} />
      </div>
      <DragOverlay>
        {activeLead ? (
          <LeadCardView
            lead={activeLead}
            stages={stages}
            members={members}
            onMoveTo={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
