"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface StageState {
  error?: string;
  done?: boolean;
}

const STAGE_TYPES = [
  "new",
  "qualification",
  "follow_up_pre_session",
  "alignment_session",
  "follow_up_post_session",
  "won",
  "lost",
  "custom",
] as const;

export async function renameStage(
  stageId: string,
  _prev: StageState,
  formData: FormData,
): Promise<StageState> {
  const context = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 80) return { error: "Nome inválido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pipeline_stages")
    .update({ name })
    .eq("id", stageId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível renomear a etapa." };

  revalidatePath("/configuracoes/pipeline");
  revalidatePath("/pipeline");
  return { done: true };
}

export async function addStage(
  pipelineId: string,
  _prev: StageState,
  formData: FormData,
): Promise<StageState> {
  const context = await requireAdmin();

  const parsed = z
    .object({
      name: z.string().trim().min(1, "Informe o nome.").max(80),
      stageType: z.enum(STAGE_TYPES),
    })
    .safeParse({
      name: formData.get("name"),
      stageType: formData.get("stageType"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  const { data: last } = await supabase
    .from("pipeline_stages")
    .select("position")
    .eq("pipeline_id", pipelineId)
    .eq("workspace_id", context.workspace.id)
    .order("position", { ascending: false })
    .limit(1);

  const position = (last?.[0]?.position ?? 0) + 1000;

  const { error } = await supabase.from("pipeline_stages").insert({
    workspace_id: context.workspace.id,
    pipeline_id: pipelineId,
    name: parsed.data.name,
    stage_type: parsed.data.stageType,
    position,
  });

  if (error) return { error: "Não foi possível criar a etapa." };

  revalidatePath("/configuracoes/pipeline");
  revalidatePath("/pipeline");
  return { done: true };
}

/** Troca a posição de duas etapas adjacentes (mover para cima/baixo). */
export async function swapStagePositions(
  stageId: string,
  otherStageId: string,
): Promise<{ error?: string }> {
  const context = await requireAdmin();
  const supabase = await createClient();

  const { data: stages } = await supabase
    .from("pipeline_stages")
    .select("id, position")
    .in("id", [stageId, otherStageId])
    .eq("workspace_id", context.workspace.id);

  if (!stages || stages.length !== 2) return { error: "Etapas inválidas." };

  const [a, b] = stages;
  await supabase
    .from("pipeline_stages")
    .update({ position: b.position })
    .eq("id", a.id)
    .eq("workspace_id", context.workspace.id);
  await supabase
    .from("pipeline_stages")
    .update({ position: a.position })
    .eq("id", b.id)
    .eq("workspace_id", context.workspace.id);

  revalidatePath("/configuracoes/pipeline");
  revalidatePath("/pipeline");
  return {};
}

export async function archiveStage(
  stageId: string,
): Promise<{ error?: string }> {
  const context = await requireAdmin();
  const supabase = await createClient();

  const { count } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("stage_id", stageId)
    .eq("workspace_id", context.workspace.id)
    .is("deleted_at", null);

  if ((count ?? 0) > 0) {
    return {
      error:
        "A etapa tem leads. Mova-os antes de arquivar ou use excluir com migração.",
    };
  }

  const { error } = await supabase
    .from("pipeline_stages")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", stageId)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: "Não foi possível arquivar a etapa." };

  revalidatePath("/configuracoes/pipeline");
  revalidatePath("/pipeline");
  return {};
}

export async function deleteStage(
  stageId: string,
  targetStageId: string | null,
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.rpc("delete_stage_migrating_leads", {
    p_stage_id: stageId,
    p_target_stage_id: targetStageId,
  });

  if (error) {
    return {
      error:
        "Não foi possível excluir. Se a etapa tem leads, escolha a etapa de destino.",
    };
  }

  revalidatePath("/configuracoes/pipeline");
  revalidatePath("/pipeline");
  return {};
}
