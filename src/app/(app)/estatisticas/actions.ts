"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateWorkspaceGoals(revenueGoal: number, clientsGoal: number) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado." };

  if (context.membership.role !== "admin") {
    return { error: "Apenas administradores podem alterar as metas do workspace." };
  }

  if (revenueGoal <= 0 || clientsGoal <= 0) {
    return { error: "Os valores das metas devem ser maiores que zero." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("workspaces")
    .update({
      monthly_revenue_goal: revenueGoal,
      monthly_clients_goal: clientsGoal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", context.workspace.id);

  if (error) {
    return { error: "Erro ao salvar metas: " + error.message };
  }

  revalidatePath("/estatisticas");
  revalidatePath("/dashboard");
  return { success: true };
}
