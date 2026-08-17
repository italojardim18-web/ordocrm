"use client";

import Link from "next/link";
import { SectionLabel, Tick } from "./landing-atoms";

const FRAGMENTADA = [
  "WhatsApp pessoal misturado com o do consultório, sem separar profissional e recepção.",
  "Mensagens perdidas no meio do dia e pacientes que somem sem retorno.",
  "Links de videochamada gerados manualmente, um a um.",
  "Prontuário em um lugar, formulários em outro, financeiro na planilha.",
  "Horas por semana em retrabalho e digitação repetida.",
];

const ORDENADA = [
  "Linhas separadas na mesma tela: profissional e recepção atendem juntos.",
  "Funil com lembrete de retorno — o paciente não some no meio do caminho.",
  "Sala do Meet criada no agendamento, com link pronto para copiar.",
  "Forms, CRM, prontuário e financeiro em um só acesso.",
  "Modo de sigilo para abrir o sistema diante de quem quer que seja.",
];

export function ComparisonSection() {
  return (
    <section id="comparativo" className="border-t border-[#181716]/10 bg-white py-24 text-[#181716]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel tone="light">Antes e depois</SectionLabel>
          <h2 className="mt-6 font-heading text-3xl font-normal leading-tight tracking-tight text-[#291015] sm:text-4xl lg:text-5xl">
            A mesma rotina, com e sem ordem.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#181716]/70">
            A diferença entre ferramentas que não conversam e um ecossistema em que
            o cadastro atravessa tudo.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px border border-[#181716]/12 bg-[#181716]/12 lg:grid-cols-2">
          {/* Rotina fragmentada — tratada em stone, nunca em vermelho de alerta. */}
          <div className="flex flex-col justify-between gap-8 bg-[#F2EEE7] p-8 lg:p-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#181716]/45">
                Hoje, sem o ecossistema
              </p>
              <ul className="mt-8 flex flex-col gap-5">
                {FRAGMENTADA.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#181716]/65">
                    <Tick tone="stone" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="border-t border-[#181716]/12 pt-6 text-sm text-[#181716]/55">
              Sobrecarga, pacientes perdidos e tempo clínico gasto fora da clínica.
            </p>
          </div>

          {/* Rotina ordenada — burgundy lidera. */}
          <div className="flex flex-col justify-between gap-8 bg-[#521D2A] p-8 text-[#F2EEE7] lg:p-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#B2966F]">
                Com o Ecossistema ORDO
              </p>
              <ul className="mt-8 flex flex-col gap-5">
                {ORDENADA.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#F2EEE7]/85">
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="border-t border-[#F2EEE7]/20 pt-6 text-sm text-[#F2EEE7]/70">
              Mais tempo para atender, pacientes acolhidos e faturamento previsível.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/planos"
            className="inline-block rounded-lg bg-[#521D2A] px-8 py-4 text-sm font-medium text-[#F2EEE7] transition-colors hover:bg-[#6B2737]"
          >
            Ver planos e combinações
          </Link>
        </div>
      </div>
    </section>
  );
}
