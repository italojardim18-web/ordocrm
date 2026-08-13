import "server-only";
import { signBridgePayload } from "./bridge";
import { decryptToken } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Worker da fila de saída.
 *
 * Processa mensagens pendentes com recuo exponencial. É idempotente por
 * mensagem: uma linha do outbox só sai de `pending` quando é entregue ou
 * quando esgota as tentativas.
 */

const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 10;

/**
 * Mensagem parada há muito tempo não deve mais ser enviada.
 * Uma resposta comercial de dois dias atrás chega fora de contexto e soa pior
 * do que não chegar — melhor falhar visível e deixar a pessoa reenviar.
 */
const MAX_AGE_HOURS = 12;

interface OutboxRow {
  id: number;
  workspace_id: string;
  message_id: string | null;
  provider: string;
  attempts: number;
  created_at: string;
  payload: {
    external_conversation_id?: string;
    body?: string;
  };
}

interface BridgeConnection {
  bridge_url: string | null;
  bridge_secret_enc: string | null;
  transport: string;
  status: string;
}

/** Recuo exponencial: 1min, 2min, 4min, 8min… */
function nextRetryAt(attempts: number): string {
  const minutes = Math.min(2 ** attempts, 60);
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export interface OutboxResult {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
}

export async function processOutbox(): Promise<OutboxResult> {
  const admin = createAdminClient();

  // Antes de despachar a fila, promove os agendamentos que venceram: assim
  // uma mensagem marcada para agora sai nesta mesma rodada.
  await admin.rpc("dispatch_due_messages", { p_limit: 20 });
  const result: OutboxResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
  };

  const { data: pending } = await admin
    .from("outbox_messages")
    .select(
      "id, workspace_id, message_id, provider, attempts, created_at, payload",
    )
    .eq("status", "pending")
    .lte("next_retry_at", new Date().toISOString())
    .order("created_at")
    .limit(BATCH_SIZE)
    .returns<OutboxRow[]>();

  if (!pending?.length) return result;

  // Conexões por workspace, buscadas uma vez só.
  const workspaceIds = [...new Set(pending.map((row) => row.workspace_id))];
  const { data: connections } = await admin
    .from("channel_connections")
    .select("workspace_id, bridge_url, bridge_secret_enc, transport, status")
    .in("workspace_id", workspaceIds)
    .eq("provider", "whatsapp");

  const byWorkspace = new Map<string, BridgeConnection>(
    (connections ?? []).map((c) => [c.workspace_id as string, c as BridgeConnection]),
  );

  for (const row of pending) {
    result.processed += 1;
    const connection = byWorkspace.get(row.workspace_id);

    // Sem canal conectado não há o que tentar: a mensagem espera sem gastar
    // tentativa (senão esgotaria as 5 antes de existir conexão).
    if (
      !connection ||
      connection.status !== "connected" ||
      connection.transport !== "bridge" ||
      !connection.bridge_url ||
      !connection.bridge_secret_enc
    ) {
      result.skipped += 1;
      continue;
    }

    const to = row.payload?.external_conversation_id;
    const text = row.payload?.body;

    if (!to || !text) {
      await markFailed(row, "payload sem destinatário ou texto", true);
      result.failed += 1;
      continue;
    }

    // Guarda contra fila represada: melhor não entregar do que entregar
    // uma resposta comercial fora de hora.
    const idadeHoras =
      (Date.now() - new Date(row.created_at).getTime()) / 3_600_000;
    if (idadeHoras > MAX_AGE_HOURS) {
      await markFailed(
        row,
        `mensagem parada há ${Math.round(idadeHoras)}h — não enviada por estar fora de contexto`,
        true,
      );
      result.failed += 1;
      continue;
    }

    try {
      const body = JSON.stringify({ to, text });
      const secret = decryptToken(connection.bridge_secret_enc);

      const response = await fetch(
        `${connection.bridge_url.replace(/\/$/, "")}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Ordo-Signature": `sha256=${signBridgePayload(body, secret)}`,
          },
          body,
          signal: AbortSignal.timeout(20_000),
        },
      );

      // 503 = ponte no ar mas sessão ainda não pareada/conectada. Não é falha
      // da mensagem: esperar sem gastar tentativa, senão a fila se esgota
      // sozinha enquanto o WhatsApp reconecta.
      if (response.status === 503) {
        await admin
          .from("outbox_messages")
          .update({ next_retry_at: new Date(Date.now() + 60_000).toISOString() })
          .eq("id", row.id);
        result.skipped += 1;
        continue;
      }

      if (!response.ok) {
        const detalhe = await response.text();
        await markFailed(row, `ponte respondeu ${response.status}: ${detalhe.slice(0, 160)}`);
        result.failed += 1;
        continue;
      }

      const { externalMessageId } = (await response.json()) as {
        externalMessageId?: string;
      };

      await admin
        .from("outbox_messages")
        .update({ status: "sent", attempts: row.attempts + 1, last_error: null })
        .eq("id", row.id);

      if (row.message_id) {
        await admin
          .from("messages")
          .update({
            status: "sent",
            // Grava o id do WhatsApp: o eco que voltar é reconhecido como
            // esta mesma mensagem, sem duplicar na conversa.
            external_message_id: externalMessageId ?? null,
          })
          .eq("id", row.message_id);
      }

      result.sent += 1;
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message.slice(0, 200) : "erro desconhecido";
      await markFailed(row, mensagem);
      result.failed += 1;
    }
  }

  return result;

  async function markFailed(row: OutboxRow, error: string, definitivo = false) {
    const attempts = row.attempts + 1;
    const esgotou = definitivo || attempts >= MAX_ATTEMPTS;

    await admin
      .from("outbox_messages")
      .update({
        status: esgotou ? "failed" : "pending",
        attempts,
        last_error: error,
        next_retry_at: nextRetryAt(attempts),
      })
      .eq("id", row.id);

    if (esgotou && row.message_id) {
      await admin
        .from("messages")
        .update({ status: "failed", error })
        .eq("id", row.message_id);
    }
  }
}
