"use client";

import { useState } from "react";
import { Rule, SectionLabel, Tick } from "./landing-atoms";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "5567999110001";

type Ciclo = "anual" | "mensal";

type Plano = {
  faixa: string;
  nome: string;
  resumo?: string;
  precoAnual: string;
  precoMensal: string;
  precoCheio?: string;
  totalAnual?: string;
  itens: string[];
  cta: string;
  destaque?: boolean;
  selo?: string;
};

type Familia = {
  id: string;
  numeral: string;
  nome: string;
  descricao: string;
  planos: Plano[];
};

const FAMILIAS: Familia[] = [
  {
    id: "crm",
    numeral: "01",
    nome: "ORDO CRM",
    descricao:
      "WhatsApp multi-linhas, funil kanban, agendamentos e Google Meet nativo.",
    planos: [
      {
        faixa: "Individual",
        nome: "CRM Solo",
        resumo: "Para quem atende por conta própria.",
        precoAnual: "R$ 77,00",
        precoMensal: "R$ 97,00",
        precoCheio: "R$ 97",
        totalAnual: "R$ 924/ano",
        itens: [
          "Acesso para 1 profissional",
          "1 conexão de WhatsApp oficial",
          "Funil pipeline kanban",
          "Agenda integrada ao Google Calendar",
          "Google Meet em um clique",
          "Modo de sigilo clínico",
        ],
        cta: "ORDO CRM Solo",
      },
      {
        faixa: "Profissional e secretária",
        nome: "CRM PRO",
        resumo: "Para consultórios com recepção operando junto.",
        precoAnual: "R$ 157,00",
        precoMensal: "R$ 197,00",
        precoCheio: "R$ 197",
        totalAnual: "R$ 1.884/ano",
        itens: [
          "Profissional e secretária inclusos",
          "WhatsApp multi-linhas",
          "Transcrição automática de áudios",
          "Ficha do paciente completa",
          "Google Meet e Google Calendar",
          "Modo de sigilo clínico",
        ],
        cta: "ORDO CRM PRO",
        destaque: true,
        selo: "Mais adotado",
      },
      {
        faixa: "Clínica e equipe",
        nome: "CRM Clínica",
        resumo: "Múltiplos profissionais, salas e recepções.",
        precoAnual: "Sob consulta",
        precoMensal: "Sob consulta",
        itens: [
          "Múltiplos profissionais e agendas",
          "Implementação assistida",
          "Painel de métricas de atribuição",
          "SLA e gerente de contas dedicado",
        ],
        cta: "ORDO CRM Clínica sob consulta",
      },
    ],
  },
  {
    id: "forms",
    numeral: "02",
    nome: "ORDO Forms",
    descricao:
      "Formulários públicos com busca de CEP, validação de documentos e entrada direta no CRM.",
    planos: [
      {
        faixa: "Degustação",
        nome: "Forms Grátis",
        precoAnual: "R$ 0,00",
        precoMensal: "R$ 0,00",
        itens: [
          "Até 100 respostas por mês",
          "Até 3 formulários ativos",
          "100 MB de armazenamento",
          "Busca automática de CEP",
        ],
        cta: "ORDO Forms Grátis",
      },
      {
        faixa: "Individual",
        nome: "Forms Individual",
        precoAnual: "R$ 61,00",
        precoMensal: "R$ 77,00",
        precoCheio: "R$ 77",
        totalAnual: "R$ 732/ano",
        itens: [
          "1.000 respostas por mês",
          "Formulários ilimitados",
          "1 GB de arquivos e anexos",
          "Personalização visual completa",
        ],
        cta: "ORDO Forms Individual",
        destaque: true,
      },
      {
        faixa: "Clínica",
        nome: "Forms PRO",
        precoAnual: "R$ 149,00",
        precoMensal: "R$ 187,00",
        precoCheio: "R$ 187",
        totalAnual: "R$ 1.788/ano",
        itens: [
          "5.000 respostas por mês e 5 GB de arquivos",
          "Remoção total de marca d'água",
          "Validação de CPF e CNPJ",
          "Integração com Calendly e Analytics",
        ],
        cta: "ORDO Forms Clínica PRO",
      },
    ],
  },
  {
    id: "manager",
    numeral: "03",
    nome: "ORDO Manager",
    descricao:
      "Evolução de sessões, histórico do paciente e controle financeiro integrado.",
    planos: [
      {
        faixa: "Degustação",
        nome: "Manager Básico",
        precoAnual: "R$ 0,00",
        precoMensal: "R$ 0,00",
        itens: [
          "Cadastro básico de pacientes",
          "Acompanhamento inicial",
          "Financeiro básico",
        ],
        cta: "ORDO Manager Grátis",
      },
      {
        faixa: "Standard",
        nome: "Manager Standard",
        precoAnual: "R$ 77,00",
        precoMensal: "R$ 97,00",
        precoCheio: "R$ 97",
        totalAnual: "R$ 924/ano",
        itens: [
          "Prontuário eletrônico completo",
          "Financeiro avançado, com recibos e pacotes",
          "Gestão de sessões e retornos",
        ],
        cta: "ORDO Manager Standard",
      },
      {
        faixa: "PRO integrado",
        nome: "Manager PRO",
        precoAnual: "R$ 117,00",
        precoMensal: "R$ 147,00",
        precoCheio: "R$ 147",
        totalAnual: "R$ 1.404/ano",
        itens: [
          "Todas as funções do Manager avançado",
          "Integração bidirecional com o ORDO CRM",
          "Integração com o ORDO Forms",
          "Preparado para o ORDO Analytics",
        ],
        cta: "ORDO Manager PRO",
        destaque: true,
      },
    ],
  },
];

const COMBO_ITENS = [
  "ORDO CRM PRO — WhatsApp multi-linhas",
  "ORDO Forms PRO — formulários ilimitados",
  "ORDO Manager PRO — prontuário e financeiro",
  "Google Meet e Google Agenda automáticos",
  "ORDO Analytics — acesso antecipado",
  "Suporte prioritário no WhatsApp",
];

export function PricingCalculator({ showAllSystems = true }: { showAllSystems?: boolean }) {
  const [ciclo, setCiclo] = useState<Ciclo>("anual");
  const anual = ciclo === "anual";

  const getWaLink = (plano: string) => {
    const text = encodeURIComponent(
      `Olá! Tenho interesse em contratar o plano: ${plano} (${anual ? "Plano Anual com 20% OFF" : "Plano Mensal"}). Como posso proceder?`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  return (
    <section id="precos" className="bg-[#F2EEE7] py-24 text-[#181716]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <SectionLabel tone="light">Planos</SectionLabel>
            <h2 className="mt-6 font-heading text-3xl font-normal leading-tight tracking-tight text-[#291015] sm:text-4xl lg:text-5xl">
              Preço à vista de tudo.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#181716]/70">
              Sem taxa escondida. Comece por um sistema e some os outros quando fizer
              sentido — ou leve o ecossistema inteiro com 20% de desconto no anual.
            </p>
          </div>

          {/* Seletor de ciclo: dois estados, uma linha em brass. */}
          <div className="inline-flex shrink-0 border border-[#181716]/15">
            <button
              type="button"
              onClick={() => setCiclo("anual")}
              className={cn(
                "px-6 py-3 text-xs tracking-wide transition-colors",
                anual ? "bg-[#521D2A] text-[#F2EEE7]" : "text-[#181716]/60 hover:text-[#181716]"
              )}
            >
              Anual · 20% menos
            </button>
            <button
              type="button"
              onClick={() => setCiclo("mensal")}
              className={cn(
                "border-l border-[#181716]/15 px-6 py-3 text-xs tracking-wide transition-colors",
                !anual ? "bg-[#521D2A] text-[#F2EEE7]" : "text-[#181716]/60 hover:text-[#181716]"
              )}
            >
              Mensal
            </button>
          </div>
        </div>

        {/* Combo: a composição em burgundy, com brass apenas no eixo. */}
        <div className="mt-14 grid grid-cols-1 border border-[#521D2A] bg-[#291015] text-[#F2EEE7] lg:grid-cols-12">
          <div className="flex flex-col gap-6 p-8 lg:col-span-7 lg:p-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#B2966F]">
                Recomendado
              </p>
              <h3 className="mt-4 font-heading text-2xl font-normal text-[#F2EEE7] sm:text-3xl">
                Combo Ecossistema ORDO PRO
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#F2EEE7]/70">
                Captação, atendimento e prontuário em um único contrato — para o
                consultório que não quer mais nenhum paciente parado no meio do caminho.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {COMBO_ITENS.map((item) => (
                <li key={item} className="flex gap-3 text-[13px] text-[#F2EEE7]/80">
                  <Tick />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-5 border-t border-[#F2EEE7]/15 p-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-12">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#F2EEE7]/45">
              Investimento
            </span>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-5xl font-normal text-[#F2EEE7]">
                {anual ? "R$ 297" : "R$ 397"}
              </span>
              <span className="text-xs text-[#F2EEE7]/55">/mês</span>
            </div>

            {anual && (
              <p className="text-xs text-[#F2EEE7]/50">
                <span className="line-through">R$ 397/mês</span> · cobrado anualmente ·
                economia de R$ 1.200 no ano
              </p>
            )}
            {!anual && <p className="text-xs text-[#F2EEE7]/50">Cobrança mensal, sem fidelidade.</p>}

            <a
              href={getWaLink("Combo Ecossistema ORDO PRO")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-lg bg-[#B2966F] px-6 py-4 text-center text-sm font-medium text-[#291015] transition-colors hover:bg-[#c4ab8a]"
            >
              Falar sobre o combo
            </a>
          </div>
        </div>

        {showAllSystems && (
          <div className="mt-24 flex flex-col gap-20">
            {FAMILIAS.map((familia) => (
              <div key={familia.id} id={familia.id} className="scroll-mt-28">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-heading text-sm tracking-[0.2em] text-[#B2966F]">
                    {familia.numeral}
                  </span>
                  <h3 className="font-heading text-2xl font-normal text-[#291015]">
                    {familia.nome}
                  </h3>
                  <p className="text-[13px] text-[#181716]/55">{familia.descricao}</p>
                </div>

                <Rule tone="light" className="mt-5" />

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {familia.planos.map((plano) => {
                    const preco = anual ? plano.precoAnual : plano.precoMensal;
                    const gratuito = preco.startsWith("R$ 0");
                    const sobConsulta = preco === "Sob consulta";

                    return (
                      <div
                        key={plano.nome}
                        className={cn(
                          "relative flex flex-col justify-between gap-8 border bg-white p-7",
                          plano.destaque ? "border-[#521D2A]" : "border-[#181716]/12"
                        )}
                      >
                        {plano.selo && (
                          <span className="absolute -top-3 left-7 bg-[#521D2A] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#F2EEE7]">
                            {plano.selo}
                          </span>
                        )}

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#181716]/45">
                            {plano.faixa}
                          </p>
                          <h4 className="mt-3 font-heading text-xl font-normal text-[#291015]">
                            {plano.nome}
                          </h4>
                          {plano.resumo && (
                            <p className="mt-2 text-[13px] leading-relaxed text-[#181716]/60">
                              {plano.resumo}
                            </p>
                          )}

                          <div className="mt-6 flex items-baseline gap-2">
                            <span
                              className={cn(
                                "font-heading font-normal",
                                sobConsulta ? "text-2xl" : "text-3xl",
                                plano.destaque ? "text-[#521D2A]" : "text-[#291015]"
                              )}
                            >
                              {preco}
                            </span>
                            {!sobConsulta && (
                              <span className="text-xs text-[#181716]/50">/mês</span>
                            )}
                          </div>

                          {anual && plano.precoCheio && (
                            <p className="mt-1.5 text-[11px] text-[#181716]/45">
                              <span className="line-through">{plano.precoCheio}</span> ·{" "}
                              {plano.totalAnual}
                            </p>
                          )}
                          {sobConsulta && (
                            <p className="mt-1.5 text-[11px] text-[#181716]/45">
                              Proposta sob medida para a sua estrutura.
                            </p>
                          )}
                          {gratuito && (
                            <p className="mt-1.5 text-[11px] text-[#181716]/45">
                              Sem cartão de crédito.
                            </p>
                          )}

                          <ul className="mt-7 flex flex-col gap-3 border-t border-[#181716]/10 pt-6">
                            {plano.itens.map((item) => (
                              <li
                                key={item}
                                className="flex gap-3 text-[13px] leading-relaxed text-[#181716]/65"
                              >
                                <Tick tone={plano.destaque ? "burgundy" : "stone"} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <a
                          href={getWaLink(plano.cta)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "rounded-lg py-3 text-center text-[13px] font-medium transition-colors",
                            plano.destaque
                              ? "bg-[#521D2A] text-[#F2EEE7] hover:bg-[#6B2737]"
                              : "border border-[#521D2A]/40 text-[#521D2A] hover:bg-[#521D2A] hover:text-[#F2EEE7]"
                          )}
                        >
                          {sobConsulta ? "Falar com um consultor" : `Contratar ${plano.nome}`}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
