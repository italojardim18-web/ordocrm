import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Transcrição de áudios de mensagens do WhatsApp / canais.
 *
 * Suporta:
 * 1. Groq Cloud (Whisper-large-v3-turbo / Whisper-large-v3) — ultrarrápido e gratuito/econômico
 * 2. OpenAI Whisper (whisper-1)
 *
 * Se nenhuma chave estiver configurada, marca transcript_status como 'skipped'.
 */

export async function processarTranscricaoAudio(
  messageId: string,
  audioBuffer: Buffer,
  mimeType: string = "audio/ogg",
  filename: string = "audio.ogg",
) {
  const admin = createAdminClient();

  const groqApiKey = process.env.GROQ_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!groqApiKey && !openaiApiKey) {
    // Nenhuma chave de IA configurada ainda
    await admin
      .from("messages")
      .update({
        transcript_status: "skipped",
        transcript_error: "Defina GROQ_API_KEY ou OPENAI_API_KEY no ~/.ordo/env para transcrição automática de áudios.",
      })
      .eq("id", messageId);
    return;
  }

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append("file", blob, filename);

    let apiUrl = "https://api.groq.com/openai/v1/audio/transcriptions";
    let authHeader = `Bearer ${groqApiKey}`;
    let model = "whisper-large-v3-turbo";

    if (!groqApiKey && openaiApiKey) {
      apiUrl = "https://api.openai.com/v1/audio/transcriptions";
      authHeader = `Bearer ${openaiApiKey}`;
      model = "whisper-1";
    }

    formData.append("model", model);
    formData.append("language", "pt");
    formData.append("response_format", "json");

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API de transcrição retornou ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = (await res.json()) as { text?: string };
    const texto = data.text?.trim() ?? "";

    if (texto) {
      await admin
        .from("messages")
        .update({
          transcript: texto,
          transcript_status: "completed",
          transcript_error: null,
          transcribed_at: new Date().toISOString(),
        })
        .eq("id", messageId);
    } else {
      await admin
        .from("messages")
        .update({
          transcript_status: "failed",
          transcript_error: "Áudio inaudível ou sem fala detectada.",
          transcribed_at: new Date().toISOString(),
        })
        .eq("id", messageId);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Erro desconhecido na transcrição";
    console.error(`[transcrição] falha na mensagem ${messageId}:`, errMsg);
    await admin
      .from("messages")
      .update({
        transcript_status: "failed",
        transcript_error: errMsg.slice(0, 300),
        transcribed_at: new Date().toISOString(),
      })
      .eq("id", messageId);
  }
}
