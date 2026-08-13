"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { workspaceSchema } from "@/lib/validation";

export interface WorkspaceState {
  error?: string;
  done?: boolean;
}

export async function updateWorkspace(
  _prevState: WorkspaceState,
  formData: FormData,
): Promise<WorkspaceState> {
  const context = await requireAdmin();

  const parsed = workspaceSchema.safeParse({
    name: formData.get("name"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createClient();

  const { error: wsError } = await supabase
    .from("workspaces")
    .update({ name: parsed.data.name, timezone: parsed.data.timezone })
    .eq("id", context.workspace.id);

  if (wsError) {
    return { error: "Não foi possível salvar o workspace." };
  }

  const { error: brandingError } = await supabase
    .from("workspace_branding")
    .upsert({
      workspace_id: context.workspace.id,
      display_name: displayName || null,
    });

  if (brandingError) {
    return { error: "Workspace salvo, mas a marca não pôde ser atualizada." };
  }

  revalidatePath("/", "layout");
  return { done: true };
}
