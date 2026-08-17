"use client";

import { ArcField, Numeral, SectionLabel } from "./landing-atoms";

const DEPOIMENTOS = [
  {
    numeral: "01",
    quote:
      "Eu perdia três ou quatro pacientes por mês porque a mensagem sumia no WhatsApp ou o retorno pós-avaliação não acontecia. Hoje a secretária e eu atendemos na mesma tela, sem misturar nada.",
    author: "Dra. Camila Vasconcelos",
    role: "Neuropsicóloga clínica · São Paulo, SP",
    tag: "Avaliação neuropsicológica",
  },
  {
    numeral: "02",
    quote:
      "A agenda sincronizada e a sala do Meet criada sozinha me devolvem uns quarenta minutos por dia. E o modo de sigilo me deixa abrir o sistema com o paciente sentado à minha frente.",
    author: "Dr. Marcelo Fagundes",
    role: "Psicólogo cognitivo-comportamental · Rio de Janeiro, RJ",
    tag: "Psicoterapia individual",
  },
  {
    numeral: "03",
    quote:
      "Colocamos o Forms na bio do Instagram. O paciente responde a triagem e já aparece na coluna de entrada do CRM. A taxa de agendamento subiu perto de 45% no primeiro mês.",
    author: "Juliana Mendes",
    role: "Gestora de clínica de saúde mental · Belo Horizonte, MG",
    tag: "Gestão de clínica",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[#291015] py-24 text-[#F2EEE7]">
      <ArcField />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Quem já usa</SectionLabel>
          <h2 className="mt-6 font-heading text-3xl font-normal leading-tight tracking-tight text-[#F2EEE7] sm:text-4xl">
            A rotina antiga não volta.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#F2EEE7]/65">
            Psicólogos, neuropsicólogos e clínicas que trocaram a dispersão por
            estrutura.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px border border-[#F2EEE7]/12 bg-[#F2EEE7]/12 md:grid-cols-3">
          {DEPOIMENTOS.map((t) => (
            <figure key={t.author} className="flex flex-col justify-between gap-8 bg-[#291015] p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between">
                  <Numeral>{t.numeral}</Numeral>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#F2EEE7]/45">
                    {t.tag}
                  </span>
                </div>
                <blockquote className="font-heading text-lg font-normal italic leading-relaxed text-[#F2EEE7]/90">
                  {t.quote}
                </blockquote>
              </div>

              <figcaption className="border-t border-[#F2EEE7]/15 pt-5">
                <span className="block text-sm text-[#F2EEE7]">{t.author}</span>
                <span className="mt-1 block text-[11px] text-[#F2EEE7]/50">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
