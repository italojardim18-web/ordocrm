import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Agente de IA & Automações" };

export default async function AIAgentPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  return (
    <section className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              Agente de IA & Automações
            </h1>
            <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-0.5 text-xs font-semibold">
              Ativo
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Inteligência artificial para transcrição de áudios, resumos clínicos e assistência operacional.
          </p>
        </div>
      </div>

      {/* Grid de Funcionalidades de IA */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Módulo 1: Transcrição de Áudio */}
        <div className="ordo-card p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎙️</span>
              <Badge variant="outline" className="rounded-full text-[10px] text-emerald-700 bg-emerald-500/10 border-emerald-500/30">
                Whisper AI
              </Badge>
            </div>
            <h3 className="font-heading text-base font-bold text-primary">
              Transcrição de Áudios
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Converte automaticamente mensagens de voz do WhatsApp em texto no inbox em poucos segundos, permitindo leitura rápida sem precisar ouvir o áudio.
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground">
            ⚡ Suporta modelos <strong>Whisper Large v3</strong> e <strong>Groq Turbo</strong>.
          </div>
        </div>

        {/* Módulo 2: Resumo Inteligente do Lead */}
        <div className="ordo-card p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🧠</span>
              <Badge variant="outline" className="rounded-full text-[10px] text-primary bg-primary/10 border-primary/30">
                Resumo 360°
              </Badge>
            </div>
            <h3 className="font-heading text-base font-bold text-primary">
              Síntese & Análise de Perfil
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Analisa todo o histórico de conversas do paciente, identifica a necessidade principal, momento de vida e pontos de atenção para a consulta.
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground">
            📋 Exibido no card <strong>Resumo do Lead</strong> dentro do Lead 360°.
          </div>
        </div>

        {/* Módulo 3: Temperatura Automática */}
        <div className="ordo-card p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔥</span>
              <Badge variant="outline" className="rounded-full text-[10px] text-amber-800 bg-amber-500/10 border-amber-500/30">
                Predição
              </Badge>
            </div>
            <h3 className="font-heading text-base font-bold text-primary">
              Cálculo de Temperatura
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Classifica cada contato em <strong>Quente, Morno ou Frio</strong> com base no tempo de resposta, engajamento e recência do último contato.
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground">
            🎯 Automatiza a priorização diária no Pipeline e no Painel Operacional.
          </div>
        </div>
      </div>

      {/* Guia de Configuração de Chaves de IA */}
      <div className="ordo-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          <h2 className="font-heading text-base font-bold text-primary">
            Configuração de Provedores de IA
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          O ORDO é compatível com os provedores de inteligência artificial de alta performance. As chaves são salvas com segurança no arquivo local de ambiente:
        </p>

        <div className="rounded-2xl bg-muted/50 p-4 border border-border text-xs font-mono">
          <p className="text-muted-foreground mb-1"># Arquivo: ~/.ordo/env</p>
          <p className="text-foreground">GROQ_API_KEY="gsk_..."</p>
          <p className="text-foreground">OPENAI_API_KEY="sk-..."</p>
        </div>
      </div>
    </section>
  );
}
