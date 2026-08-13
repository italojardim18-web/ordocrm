"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getGoogleConfig, revokeToken } from "@/lib/calendar/google";
import { decryptToken } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function chooseCalendar(
  calendarId: string,
  calendarName: string,
): Promise<{ error?: string }> {
  const context = await requireAdmin();
  if (!calendarId) return { error: "Escolha um calendário." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("calendar_connections")
    .update({ calendar_id: calendarId, calendar_name: calendarName })
    .eq("workspace_id", context.workspace.id)
    .eq("provider", "google")
    .eq("status", "connected");

  if (error) return { error: "Não foi possível salvar o calendário." };

  revalidatePath("/configuracoes/integracoes");
  return {};
}

export async function disconnectGoogle(): Promise<{ error?: string }> {
  const context = await requireAdmin();
  const admin = createAdminClient();

  const { data: connection } = await admin
    .from("calendar_connections")
    .select("id, refresh_token_enc")
    .eq("workspace_id", context.workspace.id)
    .eq("provider", "google")
    .maybeSingle();

  if (!connection) return {};

  if (connection.refresh_token_enc && getGoogleConfig()) {
    try {
      await revokeToken(decryptToken(connection.refresh_token_enc));
    } catch {
      // Revogação é best-effort: os tokens são removidos localmente mesmo assim.
    }
  }

  await admin
    .from("calendar_connections")
    .update({
      status: "disconnected",
      access_token_enc: null,
      refresh_token_enc: null,
      token_expires_at: null,
      calendar_id: null,
      calendar_name: null,
    })
    .eq("id", connection.id);

  await admin.from("audit_logs").insert({
    workspace_id: context.workspace.id,
    actor_id: context.user.id,
    action: "calendar_disconnected",
    entity_type: "calendar_connection",
  });

  revalidatePath("/configuracoes/integracoes");
  return {};
}
