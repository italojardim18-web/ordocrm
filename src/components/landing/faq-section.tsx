"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "O ORDO CRM desconecta o WhatsApp do meu celular ou iPad?",
      a: "Não! O ORDO utiliza a conexão oficial de múltiplos aparelhos. Isso significa que seu WhatsApp continua funcionando normalmente no seu iPhone, Android, iPad e computador pessoal, enquanto o ORDO CRM opera na nuvem sem nenhuma interrupção.",
    },
    {
      q: "Como funciona o WhatsApp Multi-Linhas (Doutor + Secretária)?",
      a: "No plano PRO, você pode conectar mais de um número de WhatsApp ao mesmo tempo. Você e sua secretária/recepcionista podem atender na mesma tela, filtrando instantaneamente por linha ou vendo o panorama geral da clínica em tempo real.",
    },
    {
      q: "Os dados dos meus pacientes estão seguros e de acordo com o CFP e a LGPD?",
      a: "Sim, 100%! O ORDO foi construído com criptografia de ponta a ponta (AES-256), servidores isolados e controle rigoroso de acesso. Além disso, o sistema conta com o 'Modo Sigilo Clínico' (o botão do Olhinho), que ofusca nomes e valores na tela em 1 clique caso você precise abrir o CRM na frente de um paciente ou em local público.",
    },
    {
      q: "Posso usar a minha conta atual do Google Agenda e Google Meet?",
      a: "Sim! Você conecta sua conta Google em menos de 1 minuto. Todos os agendamentos feitos no ORDO geram automaticamente a sala do Google Meet e sincronizam com sua agenda pessoal e profissional.",
    },
    {
      q: "Como funciona a garantia de 7 dias?",
      a: "Se você assinar qualquer plano do ORDO e achar que ele não transformou a organização do seu consultório, basta solicitar o cancelamento dentro dos primeiros 7 dias que devolveremos 100% do valor pago, sem burocracia.",
    },
    {
      q: "Como funciona a migração e o suporte para o meu consultório?",
      a: "Nossa equipe oferece materiais passo a passo, manual interativo dentro do sistema e atendimento humanizado direto pelo WhatsApp para ajudar na configuração inicial do seu funil e conexões.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white text-stone-900 border-t border-stone-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge className="bg-stone-100 text-stone-700 text-xs px-3 py-1 mb-4 border border-stone-200">
            Tire Suas Dúvidas
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#291015]">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-sm text-stone-600 font-sans">
            Tudo o que você precisa saber sobre o ecossistema, planos e segurança.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition-all overflow-hidden",
                  isOpen
                    ? "border-[#521D2A] bg-[#FBF9F6] shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-stone-900 gap-4"
                >
                  <span className="font-heading text-base text-[#291015]">{faq.q}</span>
                  <span className={cn("text-lg transition-transform", isOpen ? "rotate-180 text-[#521D2A]" : "text-stone-400")}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans border-t border-stone-100 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
