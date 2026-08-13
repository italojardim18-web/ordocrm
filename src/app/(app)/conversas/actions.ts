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
