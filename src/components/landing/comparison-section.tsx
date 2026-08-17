"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function ComparisonSection() {
  return (
    <section id="comparativo" className="py-24 bg-white text-stone-900 border-t border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge className="bg-[#B2966F] text-[#291015] font-bold text-xs px-3 py-1 mb-4">
            Comparativo de Produtividade
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#291015]">
            Como é a sua rotina hoje vs. com o Ecossistema ORDO
          </h2>
          <p className="mt-4 text-base text-stone-600 font-sans leading-relaxed">
            Veja a diferença prática entre ter ferramentas desconexas e operar com um ecossistema clínico centralizado.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* LADO 1: ROTINA FRAGMENTADA (SEM ORDO) */}
          <div className="rounded-3xl border-2 border-rose-200/80 bg-rose-50/40 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <span className="text-xl">❌</span>
                <span>Sem o Ecossistema ORDO (Rotina Fragmentada)</span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>WhatsApp pessoal misturado com pacientes, sem separação entre Dr. e Secretária.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Mensagens perdidas no meio do dia e pacientes que somem sem retorno (sem follow-up).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Links do Google Meet gerados manualmente um a um, copiando e colando nos chats.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Prontuários em um software, formulários em outro e financeiro em planilhas do Excel.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Horas perdidas toda semana com retrabalho e digitação manual repetitiva.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-3 border border-rose-200 text-xs text-rose-800 font-medium text-center">
              Resultado: Sobrecarga mental, perda de pacientes e tempo clínico desperdiçado.
            </div>
          </div>

          {/* LADO 2: COM O ECOSSISTEMA ORDO */}
          <div className="rounded-3xl border-2 border-[#521D2A] bg-gradient-to-b from-[#521D2A] to-[#291015] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xl text-white">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#B2966F] font-bold text-sm">
                <span className="text-xl">✨</span>
                <span>Com o Ecossistema ORDO (Ordem & Clareza)</span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B2966F] font-bold">✓</span>
                  <span>WhatsApp Multi-Linhas oficial: Dr. e Secretária atendem juntos sem desconectar iPad ou celular.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B2966F] font-bold">✓</span>
                  <span>Funil de pacientes no Kanban com lembretes automáticos de retorno e temperatura do lead.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B2966F] font-bold">✓</span>
                  <span>Google Meet automático gerado na hora do agendamento com cópia em 1 clique.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B2966F] font-bold">✓</span>
                  <span>Formulários, CRM, Prontuário e Financeiro 100% integrados em um só login.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B2966F] font-bold">✓</span>
                  <span>Modo Sigilo Clínico (Olhinho) para abrir o sistema com segurança diante de pacientes e terceiros.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-white/10 p-3 border border-[#B2966F]/40 text-xs text-[#E2D2BC] font-medium text-center">
              Resultado: Mais tempo para os atendimentos, pacientes acolhidos e faturamento previsível.
            </div>
          </div>
        </div>

        {/* CTA Intermediário */}
        <div className="mt-12 text-center">
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#521D2A] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#6b2737] hover:scale-105 transition-all"
          >
            <span>Ver Planos & Economizar com o Combo</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
