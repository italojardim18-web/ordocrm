"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testOllamaConnectionAction, saveAIKeysAction, type AISettingsState } from "@/app/(app)/configuracoes/integracoes/ai-actions";

export function AISettingsCard({ initialSettings }: { initialSettings: AISettingsState }) {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<AISettingsState>(initialSettings);

  // Estados dos inputs de API externa
  const [groqKey, setGroqKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");

  const [showKeys, setShowKeys] = useState(false);

  // Testar conexão com o Ollama
  const handleTestOllama = () => {
    startTransition(async () => {
      const res = await testOllamaConnectionAction();
      setSettings((prev) => ({
        ...prev,
        ollamaOnline: res.online,
        ollamaModels: res.models,
        selectedModel: res.selectedModel,
      }));

      if (res.online) {
        toast.success(`Ollama conectado com sucesso! Modelo ativo: ${res.selectedModel}`);
      } else {
        toast.error(`Não foi possível conectar ao Ollama em ${res.url}. Certifique-se de que o app Ollama está aberto.`);
      }
    });
  };

  // Salvar chaves externas
  const handleSaveKeys = () => {
    startTransition(async () => {
      const res = await saveAIKeysAction({
        groqKey: groqKey ? groqKey : undefined,
        openaiKey: openaiKey ? openaiKey : undefined,
        geminiKey: geminiKey ? geminiKey : undefined,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Chaves de IA salvas com sucesso!");
        setSettings((prev) => ({
          ...prev,
          hasGroqKey: groqKey.trim() !== "" || prev.hasGroqKey,
          hasOpenAIKey: openaiKey.trim() !== "" || prev.hasOpenAIKey,
          hasGeminiKey: geminiKey.trim() !== "" || prev.hasGeminiKey,
        }));
        setGroqKey("");
        setOpenaiKey("");
        setGeminiKey("");
      }
    });
  };

  return (
    <Card className="border-[#521D2A]/40 bg-gradient-to-br from-[#521D2A]/[0.05] via-background to-primary/[0.02] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#521D2A] text-[#B2966F] text-xl font-bold shadow-xs">
              🤖
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                Motores de Inteligência Artificial & LLMs
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  Multiprovedor
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Configuração da IA Local (Ollama) prioritária e chaves de APIs na nuvem para resumos, assistente e diagnóstico.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 text-xs">
        {/* ========================================================================= */}
        {/* 1. SEÇÃO PRINCIPAL: IA LOCAL (OLLAMA)                                     */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 p-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    IA Local (Ollama) · Prioridade Máxima
                  </span>
                  {settings.ollamaOnline ? (
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                      ● Online & Conectado
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px]">
                      ○ Desconectado
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  100% privado no seu computador. Não envia dados para a nuvem (Conformidade total CFP e LGPD).
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestOllama}
              disabled={isPending}
              className="h-8 text-xs font-semibold bg-white dark:bg-stone-900 shadow-2xs"
            >
              {isPending ? "Testando..." : "🔌 Testar Conexão"}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 pt-1">
            <div className="rounded-xl border bg-card p-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Servidor Local
              </span>
              <span className="font-mono text-xs font-medium text-primary truncate">
                {settings.ollamaUrl}
              </span>
            </div>

            <div className="rounded-xl border bg-card p-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Modelo Ativo
              </span>
              <span className="font-semibold text-xs text-emerald-700 dark:text-emerald-300 truncate">
                {settings.selectedModel || "Nenhum modelo detectado"}
              </span>
            </div>

            <div className="rounded-xl border bg-card p-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Modelos Instalados
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {settings.ollamaModels.length > 0
                  ? settings.ollamaModels.join(", ")
                  : "Execute: ollama pull qwen2.5:7b"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SEÇÃO OPCIONAL: APIS EXTERNAS NA NUVEM (FALLBACK)                      */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-card p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">☁️</span>
              <div>
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Chaves de APIs Externas (Opcional / Fallback)
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Utilizadas como contingência caso o Ollama local esteja desligado.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              className="text-primary hover:underline text-xs font-semibold"
            >
              {showKeys ? "Ocultar campos" : "Configurar chaves"}
            </button>
          </div>

          {/* Badges de Chaves Configuradas */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs">
              <span className="font-semibold">Groq (Llama 3.3):</span>
              {settings.hasGroqKey ? (
                <span className="text-emerald-600 font-bold">✓ Ativo</span>
              ) : (
                <span className="text-muted-foreground">Não configurado</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs">
              <span className="font-semibold">OpenAI (GPT-4o):</span>
              {settings.hasOpenAIKey ? (
                <span className="text-emerald-600 font-bold">✓ Ativo</span>
              ) : (
                <span className="text-muted-foreground">Não configurado</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs">
              <span className="font-semibold">Google Gemini:</span>
              {settings.hasGeminiKey ? (
                <span className="text-emerald-600 font-bold">✓ Ativo</span>
              ) : (
                <span className="text-muted-foreground">Não configurado</span>
              )}
            </div>
          </div>

          {/* Formulário de inserção de chaves */}
          {showKeys && (
            <div className="flex flex-col gap-3 pt-2 border-t animate-in fade-in duration-150">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Groq API Key (Recomendado gratuito - Llama 3.3 70B)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder={settings.hasGroqKey ? "•••••••••••••••• (Chave já salva)" : "Cole sua chave gsk_..."}
                  className="rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  OpenAI API Key (Opcional - GPT-4o mini)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder={settings.hasOpenAIKey ? "•••••••••••••••• (Chave já salva)" : "Cole sua chave sk-..."}
                  className="rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Google Gemini API Key (Opcional - Gemini 1.5 Flash)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder={settings.hasGeminiKey ? "•••••••••••••••• (Chave já salva)" : "Cole sua chave AIzaSy..."}
                  className="rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleSaveKeys}
                  disabled={isPending || (!groqKey && !openaiKey && !geminiKey)}
                  className="bg-[#521D2A] text-white hover:bg-[#6b2737] text-xs font-semibold px-4"
                >
                  {isPending ? "Salvando..." : "💾 Salvar Chaves de IA"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
