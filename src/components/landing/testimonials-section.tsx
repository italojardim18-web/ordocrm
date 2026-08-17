"use client";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Antes do ORDO, eu perdia pelo menos 3 a 4 pacientes por mês simplesmente porque as mensagens sumiam no WhatsApp ou eu esquecia de fazer o follow-up pós-avaliação. Hoje a secretária e eu atendemos na mesma tela sem misturar nada.",
      author: "Dra. Camila Vasconcelos",
      role: "Neuropsicóloga Clínica · São Paulo/SP",
      tag: "Avaliação Neuropsicológica",
    },
    {
      quote:
        "A integração com a Google Agenda e a geração automática do link do Google Meet me economizam uns 40 minutos por dia. E o botão de Sigilo (Olhinho) me dá total tranquilidade para abrir o CRM durante a sessão com o paciente na minha frente.",
      author: "Dr. Marcelo Fagundes",
      role: "Psicólogo Cognitivo-Comportamental · Rio de Janeiro/RJ",
      tag: "Psicoterapia Individual",
    },
    {
      quote:
        "Colocamos o ORDO Forms na bio do Instagram e o paciente responde a triagem e já cai direto na coluna de 'Entrada' do CRM. A taxa de agendamento da clínica aumentou quase 45% no primeiro mês.",
      author: "Juliana Mendes",
      role: "Gestora de Clínica de Saúde Mental · Belo Horizonte/MG",
      tag: "Gestão de Clínica",
    },
  ];

  return (
    <section className="py-24 bg-[#291015] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B2966F]">
            Resultados Comprovados
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
            Quem usa o ORDO não volta para a rotina antiga
          </h2>
          <p className="mt-4 text-sm text-stone-300 font-sans">
            Psicólogos, neuropsicólogos e clínicas que transformaram a desorganização em autoridade e faturamento previsível.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-[#521D2A] bg-white/5 p-6 sm:p-8 flex flex-col justify-between gap-6 backdrop-blur-md shadow-lg"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="rounded-full bg-[#521D2A] text-[#B2966F] text-[10px] font-bold px-2.5 py-0.5 border border-[#B2966F]/30">
                    {t.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col">
                <span className="font-heading text-sm font-bold text-white">{t.author}</span>
                <span className="text-[11px] text-stone-400">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
