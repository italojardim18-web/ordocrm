"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#291015] via-[#3B151F] to-[#291015] pt-32 pb-24 text-white">
      {/* Luz ambiente e brilho de fundo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-[#722A3B]/30 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 size-[450px] rounded-full bg-[#B2966F]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge de Autoridade / Lançamento */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B2966F]/40 bg-[#521D2A]/60 px-4 py-1.5 text-xs font-semibold text-[#B2966F] shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95">
          <span className="flex size-2 rounded-full bg-[#B2966F] animate-pulse" />
          <span>Ecossistema Clínico & Comercial Integrado para Saúde Mental</span>
        </div>

        {/* Headline Principal (Impacto G4 + Sintropia) */}
        <h1 className="mt-8 max-w-5xl font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.12]">
          A rotina clínica, captação e gestão do seu consultório em um{" "}
          <span className="bg-gradient-to-r from-[#B2966F] via-[#E2D2BC] to-[#B2966F] bg-clip-text text-transparent underline decoration-[#B2966F]/40">
            único ecossistema conectado
          </span>
          .
        </h1>

        {/* Subheadline com foco na dor do profissional */}
        <p className="mt-6 max-w-3xl text-base sm:text-lg text-stone-300/90 leading-relaxed font-sans">
          Da captação no WhatsApp e formulários de anamnese, até o prontuário eletrônico sigiloso, agenda com Google Meet automático e financeiro completo. 
          <strong> Pare de perder pacientes e horas de trabalho com ferramentas que não conversam entre si.</strong>
        </p>

        {/* CTAs de Alta Conversão */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/planos"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#B2966F] via-[#C9B18F] to-[#B2966F] px-8 py-4 text-sm font-bold text-[#291015] shadow-2xl transition-all hover:scale-105 hover:shadow-[#B2966F]/30"
          >
            <span>Conhecer Planos & Começar</span>
            <span className="text-base">↗</span>
          </Link>

          <a
            href="#pilares"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            <span>Explorar os 4 Sistemas</span>
            <span>↓</span>
          </a>
        </div>

        {/* Badges de Confiança */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400 border-t border-white/10 pt-8 w-full max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="text-base text-emerald-400">🛡️</span>
            <span>100% em Conformidade com a LGPD e CFP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-blue-400">🔒</span>
            <span>Criptografia AES-256 de Ponta a Ponta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-amber-400">📱</span>
            <span>Suporte Nativo a iPad, Mac, PC e Celular</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-purple-400">⚡</span>
            <span>Sincronização com Google Agenda e Meet</span>
          </div>
        </div>

        {/* Mockup Interativo do Ecossistema em Ação */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border-2 border-[#521D2A] bg-[#1E0B10]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-rose-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-stone-400">
                app.ordocrm.com.br · Ecossistema Integrado
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                ● 3 Softwares Sincronizados em Tempo Real
              </Badge>
            </div>
          </div>

          {/* Cards Representando o Fluxo Contínuo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Card 1: ORDO Forms */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between gap-3 hover:border-[#B2966F]/50 transition-all group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📝</span>
                  <span className="rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-500/30">
                    Passo 1 · Captação
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-white group-hover:text-[#B2966F] transition-colors">
                  ORDO Forms
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Triagem e anamnese no link da bio. O paciente preenche e entra automaticamente no funil.
                </p>
              </div>
              <div className="rounded-xl bg-black/40 p-2.5 text-[11px] font-mono text-emerald-400 border border-white/5">
                ✓ Novo lead captado: <strong>Mariana S. (Avaliação)</strong>
              </div>
            </div>

            {/* Card 2: ORDO CRM */}
            <div className="rounded-2xl border border-[#B2966F]/50 bg-[#521D2A]/40 p-4 flex flex-col justify-between gap-3 shadow-lg group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💬</span>
                  <span className="rounded-full bg-[#B2966F]/30 text-[#E2D2BC] text-[10px] font-bold px-2 py-0.5 border border-[#B2966F]/40">
                    Passo 2 · Conversão
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-white group-hover:text-[#B2966F] transition-colors">
                  ORDO CRM
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  WhatsApp Multi-Linhas (Doutor + Secretária), Follow-up, Google Meet e Modo Sigilo.
                </p>
              </div>
              <div className="rounded-xl bg-black/40 p-2.5 text-[11px] font-mono text-amber-300 border border-white/5">
                🎥 Meet gerado: <strong>Quarta-feira às 15:00</strong>
              </div>
            </div>

            {/* Card 3: ORDO Manager */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between gap-3 hover:border-[#B2966F]/50 transition-all group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📋</span>
                  <span className="rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 border border-purple-500/30">
                    Passo 3 · Clínica
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-white group-hover:text-[#B2966F] transition-colors">
                  ORDO Manager
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Prontuário eletrônico completo, evolução clínica protegida e gestão financeira automática.
                </p>
              </div>
              <div className="rounded-xl bg-black/40 p-2.5 text-[11px] font-mono text-purple-300 border border-white/5">
                🔒 Prontuário aberto · <strong>Histórico sincronizado</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
