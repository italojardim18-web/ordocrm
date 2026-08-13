"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface SendState {
  error?: string;
  done?: boolean;
}

export async function sendMessage(
  conversationId: string,
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Escreva a mensagem." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("send_channel_message", {
    p_conversation_id: conversationId,
    p_body: body,
  });

  if (error) return { error: "Não foi possível enfileirar a mensagem." };

  revalidatePath(`/conversas/${conversationId}`);
  revalidatePath("/conversas");
  return { done: true };
}

export async function markRead(conversationId: string) {
  const supabase = await createClient();
  await supabase.rpc("mark_conversation_read", {
    p_conversation_id: conversationId,
  });
  revalidatePath("/conversas");
}

export interface ScheduleState {
  error?: string;
  done?: boolean;
}

/** Agenda uma mensagem para sair em data e hora futuras. */
export async function scheduleMessage(
  conversationId: string,
  _prev: ScheduleState,
  formData: FormData,
): Promise<ScheduleState> {
  const context = await getSessionContext();
  if (!context) return { error: "Sessão expirada." };

  const body = String(formData.get("body") ?? "").trim();
  const quando = String(formData.get("scheduledFor") ?? "");

  if (!body) return { error: "Escreva a mensagem." };
  if (!quando) return { error: "Escolha a data e a hora." };

  const data = new Date(quando);
  if (Number.isNaN(data.getTime())) return { error: "Data inválida." };
  if (data.getTime() <= Date.now()) {
    return { error: "Escolha um horário no futuro." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("schedule_message", {
    p_conversation_id: conversationId,
    p_body: body,
    p_scheduled_for: data.toISOString(),
  });

  if (error) return { error: "Não foi possível agendar a mensagem." };

  revalidatePath(`/conversas/${conversationId}`);
  revalidatePath("/pipeline");
  return { done: true };
}

export async function cancelScheduledMessage(
  id: string,
  conversationId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_scheduled_message", { p_id: id });
  if (error) return { error: "Não foi possível cancelar." };

  revalidatePath(`/conversas/${conversationId}`);
  revalidatePath("/pipeline");
  return {};
}
