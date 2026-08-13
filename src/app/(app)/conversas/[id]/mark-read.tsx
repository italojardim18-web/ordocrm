"use client";

import { useEffect } from "react";
import { markRead } from "../actions";

/**
 * Marca a conversa como lida após a montagem.
 * Precisa acontecer fora da renderização: revalidação durante o render de um
 * Server Component não é suportada.
 */
export function MarkReadOnMount({
  conversationId,
  unreadCount,
}: {
  conversationId: string;
  unreadCount: number;
}) {
  useEffect(() => {
    if (unreadCount > 0) {
      void markRead(conversationId);
    }
  }, [conversationId, unreadCount]);

  return null;
}
