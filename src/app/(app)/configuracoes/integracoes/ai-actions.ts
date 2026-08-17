"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { checkOllamaStatus } from "@/lib/ai/client";

export interface AISettingsState {
  ollamaOnline: boolean;
  ollamaUrl: string;
  ollamaModels: string[];
  selectedModel: string;
  hasGroqKey: boolean;
  hasOpenAIKey: boolean;
  hasGeminiKey: boolean;
}

export async function getAISettingsAction(): Promise<AISettingsState> {
  const ollama = await checkOllamaStatus();

  return {
    ollamaOnline: ollama.online,
    ollamaUrl: ollama.url,
    ollamaModels: ollama.models,
    selectedModel: ollama.selectedModel,
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
  };
}

export async function testOllamaConnectionAction() {
  const status = await checkOllamaStatus();
  return status;
}

export async function saveAIKeysAction(keys: {
  groqKey?: string;
  openaiKey?: string;
  geminiKey?: string;
}) {
  await requireAdmin();

  try {
    const envPath = path.join(process.cwd(), ".env.local");
    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf-8");
    }

    const lines = content.split("\n");
    const updateKey = (key: string, val?: string) => {
      if (val === undefined) return;
      const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
      if (val.trim() === "") {
        if (idx !== -1) lines.splice(idx, 1);
      } else {
        const newLine = `${key}=${val.trim()}`;
        if (idx !== -1) {
          lines[idx] = newLine;
        } else {
          lines.push(newLine);
        }
        process.env[key] = val.trim();
      }
    };

    if (keys.groqKey !== undefined) updateKey("GROQ_API_KEY", keys.groqKey);
    if (keys.openaiKey !== undefined) updateKey("OPENAI_API_KEY", keys.openaiKey);
    if (keys.geminiKey !== undefined) updateKey("GEMINI_API_KEY", keys.geminiKey);

    fs.writeFileSync(envPath, lines.join("\n").trim() + "\n", "utf-8");

    revalidatePath("/configuracoes/integracoes");
    revalidatePath("/agente-ia");
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao salvar chaves: " + err.message };
  }
}
