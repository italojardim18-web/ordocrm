"use client";

import Link from "next/link";
import { ArcField, Numeral, Rule, SectionLabel } from "./landing-atoms";

/**
 * Estrutura da campanha (brand book 16 / CAMPANHA):
 *   marca no topo · linha editorial · mensagem em Bodoni · chamada curta · um único CTA.
 */

const FLUXO = [
  {
    numeral: "01",
    produto: "ORDO Forms",
    etapa: "Captação",
    texto:
      "A triagem fica no link da bio. O paciente responde e entra no funil sem digitação.",
    estado: "Nova resposta · Mariana S. · Avaliação",
  },
  {
    numeral: "02",
    produto: "ORDO CRM",
    etapa: "Conversa",
    texto:
      "WhatsApp do profissional e da recepção na mesma tela. Follow-up e agenda no mesmo lugar.",
    estado: "Sala do Meet criada · quarta, 15:00",
  },
  {
    numeral: "03",
    produto: "ORDO Manager",
    etapa: "Clínica",
    texto:
      "Prontuário, evolução de sessões e financeiro. O histórico chega pronto do CRM.",
    estado: "Prontuário aberto · histórico sincronizado",
  },
];

const GARANTIAS = [
  "Conformidade com LGPD e CFP",
  "Criptografia AES-256",
  "iPad, Mac, PC e celular",
  "Google Agenda e Meet",
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[#291015] pt-36 pb-24 text-[#F2EEE7]">
      <ArcField />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <SectionLabel>Ecossistema clínico e comercial</SectionLabel>

          <h1 className="mt-8 font-heading text-4xl font-normal leading-[1.08] tracking-tight text-[#F2EEE7] sm:text-5xl lg:text-6xl">
            A clínica inteira
            <br />
            em seu lugar.
          </h1>

          <div className="mt-8 max-w-xl">
            <Rule className="bg-[#B2966F]/40" />
          </div>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-[#F2EEE7]/70">
            Captação, conversa, prontuário e financeiro em um único ecossistema. Um
            cadastro atravessa tudo — do primeiro contato no WhatsApp à evolução da
            sessão. Nada é digitado duas vezes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              href="/planos"
              className="rounded-lg bg-[#B2966F] px-8 py-4 text-sm font-medium text-[#291015] transition-colors hover:bg-[#c4ab8a]"
            >
              Conhecer os planos
            </Link>
            <Link
              href="/ecossistema#pilares"
              className="border-b border-[#F2EEE7]/25 pb-1 text-sm text-[#F2EEE7]/75 transition-colors hover:border-[#B2966F] hover:text-[#F2EEE7]"
            >
              Ver os quatro sistemas
            </Link>
          </div>
        </div>

        {/* Garantias: texto puro, sem ícones. A linha separa, não decora. */}
        <div className="mt-16">
          <Rule />
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 text-xs tracking-wide text-[#F2EEE7]/55 sm:grid-cols-2 lg:grid-cols-4">
            {GARANTIAS.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span aria-hidden className="h-px w-4 bg-[#B2966F]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* O fluxo do ecossistema, em três movimentos. */}
        <div className="mt-20 border border-[#F2EEE7]/12 bg-[#181716]/40">
          <div className="flex items-center justify-between border-b border-[#F2EEE7]/12 px-6 py-4">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#F2EEE7]/45">
              Um cadastro. Três sistemas.
            </span>
            <span className="text-[11px] tracking-wide text-[#B2966F]">Sincronizados</span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-[#F2EEE7]/12 md:grid-cols-3 md:divide-x md:divide-y-0">
            {FLUXO.map((item) => (
              <article key={item.numeral} className="flex flex-col gap-4 p-6 lg:p-8">
                <div className="flex items-baseline justify-between">
                  <Numeral>{item.numeral}</Numeral>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#F2EEE7]/45">
                    {item.etapa}
                  </span>
                </div>

                <h2 className="font-heading text-xl font-normal text-[#F2EEE7]">{item.produto}</h2>

                <p className="text-[13px] leading-relaxed text-[#F2EEE7]/65">{item.texto}</p>

                <div className="mt-auto border-l border-[#B2966F] pl-3 pt-1 text-[11px] text-[#F2EEE7]/50">
                  {item.estado}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
