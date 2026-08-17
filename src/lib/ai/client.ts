/**
 * Cliente Unificado de Inteligência Artificial para o ORDO CRM
 * Prioridade 1: Ollama Local (127.0.0.1:11434) - 100% privado, ilimitado e sem custos
 * Prioridade 2 (Fallback / Opcional): Groq (Llama 3.3 70B), OpenAI (GPT-4o mini), Google Gemini
 */

export interface OllamaStatus {
  online: boolean;
  url: string;
  models: string[];
  selectedModel: string;
  error?: string;
}

export interface AICompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  jsonFormat?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResponse {
  text: string;
  model: string;
  source: "ollama_local" | "groq" | "openai" | "gemini" | "local_nlp";
}

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";

/** Verifica se o Ollama está online e lista os modelos instalados */
export async function checkOllamaStatus(): Promise<OllamaStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        online: false,
        url: OLLAMA_HOST,
        models: [],
        selectedModel: "",
        error: `Ollama respondeu com status ${res.status}`,
      };
    }

    const data = await res.json();
    const models: string[] = (data.models || []).map((m: any) => m.name || m.model);

    // Seleciona o melhor modelo disponível (dá preferência a qwen2.5, llama3.3, llama3.2, mistral)
    const preferredOrder = ["qwen2.5:7b", "qwen2.5", "llama3.3", "llama3.2", "llama3.1", "llama3", "mistral", "gemma2"];
    let selectedModel = models[0] || "qwen2.5:7b";

    for (const pref of preferredOrder) {
      const found = models.find((m) => m.toLowerCase().includes(pref));
      if (found) {
        selectedModel = found;
        break;
      }
    }

    return {
      online: true,
      url: OLLAMA_HOST,
      models,
      selectedModel,
    };
  } catch (err: any) {
    return {
      online: false,
      url: OLLAMA_HOST,
      models: [],
      selectedModel: "",
      error: err.name === "AbortError" ? "Timeout de conexão (Ollama não está rodando)" : err.message,
    };
  }
}

/** Executa uma inferência unificada priorizando a IA Local */
export async function generateAICompletion(
  opts: AICompletionOptions
): Promise<AICompletionResponse | null> {
  const { systemPrompt, userPrompt, jsonFormat = false, temperature = 0.3 } = opts;

  // ---------------------------------------------------------------------------
  // 1. TENTA OLLAMA LOCAL (PRIORIDADE MÁXIMA)
  // ---------------------------------------------------------------------------
  try {
    const status = await checkOllamaStatus();
    if (status.online && status.selectedModel) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s max para geração local

      const bodyPayload: Record<string, any> = {
        model: status.selectedModel,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: {
          temperature,
        },
      };

      if (jsonFormat) {
        bodyPayload.format = "json";
      }

      const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        if (json.response) {
          return {
            text: json.response.trim(),
            model: `Ollama Local (${status.selectedModel})`,
            source: "ollama_local",
          };
        }
      }
    }
  } catch (err) {
    console.warn("Ollama local completion failed, attempting fallback:", err);
  }

  // ---------------------------------------------------------------------------
  // 2. TENTA GROQ (LLAMA 3.3 70B TURBO)
  // ---------------------------------------------------------------------------
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          ...(jsonFormat ? { response_format: { type: "json_object" } } : {}),
          temperature,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.choices?.[0]?.message?.content;
        if (text) {
          return {
            text: text.trim(),
            model: "Llama 3.3 70B (Groq Nuvem)",
            source: "groq",
          };
        }
      }
    } catch (err) {
      console.warn("Groq fallback failed:", err);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. TENTA OPENAI (GPT-4o mini)
  // ---------------------------------------------------------------------------
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          ...(jsonFormat ? { response_format: { type: "json_object" } } : {}),
          temperature,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.choices?.[0]?.message?.content;
        if (text) {
          return {
            text: text.trim(),
            model: "GPT-4o mini (OpenAI)",
            source: "openai",
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI fallback failed:", err);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. TENTA GOOGLE GEMINI (1.5 Flash)
  // ---------------------------------------------------------------------------
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            ...(jsonFormat ? { responseMimeType: "application/json" } : {}),
            temperature,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            text: text.trim(),
            model: "Gemini 1.5 Flash (Google)",
            source: "gemini",
          };
        }
      }
    } catch (err) {
      console.warn("Gemini fallback failed:", err);
    }
  }

  return null;
}
