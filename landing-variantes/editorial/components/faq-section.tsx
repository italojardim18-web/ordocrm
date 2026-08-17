"use client";

import { useState } from "react";
import { SectionLabel } from "./landing-atoms";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "O ORDO CRM desconecta o WhatsApp do meu celular ou iPad?",
    a: "Não. O ORDO usa a conexão oficial de múltiplos aparelhos: o seu WhatsApp continua funcionando no iPhone, no Android, no iPad e no computador enquanto o CRM opera em paralelo, sem interrupção.",
  },
  {
    q: "Como funciona o WhatsApp multi-linhas?",
    a: "No plano PRO você conecta mais de um número ao mesmo tempo. Você e a recepção atendem na mesma tela, filtrando por linha ou vendo o panorama inteiro da clínica.",
  },
  {
    q: "Os dados dos pacientes estão de acordo com o CFP e a LGPD?",
    a: "Sim. Campos sensíveis são cifrados no armazenamento, o acesso é verificado a cada requisição e os registros de operação não guardam conteúdo clínico. O modo de sigilo clínico ainda oculta nomes e valores da tela em um clique, para quando você precisar abrir o sistema diante de terceiros.",
  },
  {
    q: "Posso usar minha conta atual do Google Agenda e do Meet?",
    a: "Sim. A conexão leva menos de um minuto. Todo agendamento feito no ORDO cria a sala do Meet e sincroniza com as suas agendas pessoal e profissional.",
  },
  {
    q: "Como funciona a garantia de 7 dias?",
    a: "Se em sete dias o sistema não tiver mudado a organização do seu consultório, você pede o cancelamento e recebe 100% do valor de volta. Sem burocracia.",
  },
  {
    q: "Como é a migração e o suporte?",
    a: "Há manual interativo dentro do sistema, material passo a passo e atendimento humano no WhatsApp para a configuração inicial do funil e das conexões.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-[#181716]/10 bg-white py-24 text-[#181716]">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel tone="light">Dúvidas</SectionLabel>
          <h2 className="mt-6 font-heading text-3xl font-normal leading-tight tracking-tight text-[#291015] sm:text-4xl">
            Perguntas frequentes.
          </h2>
        </div>

        <div className="mt-12 border-t border-[#181716]/12">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="border-b border-[#181716]/12">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-8 py-6 text-left"
                >
                  <span
                    className={cn(
                      "font-heading text-lg font-normal transition-colors",
                      isOpen ? "text-[#521D2A]" : "text-[#291015]"
                    )}
                  >
                    {faq.q}
                  </span>
                  {/* Eixo que gira: horizontal fechado, vertical some ao abrir. */}
                  <span aria-hidden className="relative mt-3 block size-3 shrink-0">
                    <span className="absolute left-0 top-1/2 h-px w-3 bg-[#B2966F]" />
                    <span
                      className={cn(
                        "absolute left-1/2 top-0 h-3 w-px bg-[#B2966F] transition-transform duration-300",
                        isOpen ? "scale-y-0" : "scale-y-100"
                      )}
                    />
                  </span>
                </button>

                {isOpen && (
                  <p className="max-w-3xl pb-7 text-sm leading-relaxed text-[#181716]/70">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
