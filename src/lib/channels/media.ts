import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BridgeMedia } from "./bridge";

/**
 * Guarda a mídia da conversa no Storage.
 *
 * Caminho: <workspace>/<conversa>/<arquivo>. A primeira pasta é o workspace
 * porque as policies do bucket leem justamente ela para decidir acesso — o
 * isolamento entre empresas sai da própria chave do arquivo.
 */

const BUCKET = "message-media";

/** Extensão a partir do mime, para o arquivo abrir certo ao ser baixado. */
function extensaoDe(mime: string | null | undefined): string {
  if (!mime) return "bin";
  const mapa: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
    "audio/wav": "wav",
    "video/mp4": "mp4",
    "video/3gpp": "3gp",
    "video/quicktime": "mov",
    "application/pdf": "pdf",
    "text/plain": "txt",
  };
  return mapa[mime.split(";")[0].trim()] ?? "bin";
}

export interface MediaSalva {
  path: string;
  mime: string | null;
  size: number;
  filename: string | null;
  duration: number | null;
}

export async function salvarMidia(
  workspaceId: string,
  conversationId: string,
  externalMessageId: string,
  media: BridgeMedia,
): Promise<MediaSalva | null> {
  const admin = createAdminClient();

  let bytes: Buffer;
  try {
    bytes = Buffer.from(media.base64, "base64");
  } catch {
    return null;
  }
  if (bytes.length === 0) return null;

  const mime = media.mime?.split(";")[0].trim() ?? null;
  // O id externo no nome mantém a gravação idempotente: reprocessar o mesmo
  // evento sobrescreve o arquivo em vez de criar cópias.
  const seguro = externalMessageId.replace(/[^A-Za-z0-9._-]/g, "");
  const path = `${workspaceId}/${conversationId}/${seguro}.${extensaoDe(mime)}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: mime ?? "application/octet-stream",
    upsert: true,
  });

  if (error) {
    console.error("[mídia] falha ao gravar:", error.message);
    return null;
  }

  return {
    path,
    mime,
    size: bytes.length,
    filename: media.filename ?? null,
    duration: media.duration ?? null,
  };
}

/**
 * URL temporária para exibir o arquivo.
 * O bucket é privado, então nada é servido sem assinatura — e a assinatura
 * expira, evitando link de conversa circulando por aí.
 */
export async function urlAssinada(
  path: string,
  segundos = 3600,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, segundos);
  return data?.signedUrl ?? null;
}
