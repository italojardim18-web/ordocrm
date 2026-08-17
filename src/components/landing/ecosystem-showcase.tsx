"use client";

import { useState } from "react";
import Link from "next/link";
import { Rule, SectionLabel, Tick } from "./landing-atoms";
import { cn } from "@/lib/utils";

type Chave = "crm" | "forms" | "manager" | "analytics";

type Sistema = {
  chave: Chave;
  numeral: string;
  nome: string;
  aba: string;
  modulo: string;
  preco: string;
  titulo: string;
  descricao: string;
  recursos: { nome: string; texto: string }[];
  cta: { texto: string; href: string };
  previa: { titulo: string; etiqueta: string; linhas: { autor: string; texto: string }[] };
  emBreve?: boolean;
};

const SISTEMAS: Sistema[] = [
  {
    chave: "crm",
    numeral: "01",
    nome: "ORDO CRM",
    aba: "CRM",
    modulo: "Conversão e atendimento",
    preco: "A partir de R$ 77/mês no anual",
    titulo: "A conversa com o paciente, organizada.",
    descricao:
      "Os números do consultório ficam no sistema; o seu celular continua seu. Profissional e recepção atendem na mesma tela, sem disputar aparelho.",
    recursos: [
      {
        nome: "WhatsApp multi-linhas",
        texto: "Profissional e secretária atendendo em paralelo, com filtro por linha.",
      },
      {
        nome: "Transcrição de áudio",
        texto: "Áudios longos viram texto legível para ler entre uma sessão e outra.",
      },
      {
        nome: "Google Meet nativo",
        texto: "A sala é criada no agendamento e o link se copia em um clique.",
      },
      {
        nome: "Modo de sigilo clínico",
        texto: "Nomes e valores somem da tela quando alguém se aproxima.",
      },
    ],
    cta: { texto: "Ver planos do CRM", href: "/planos#crm" },
    previa: {
      titulo: "Central de conversas",
      etiqueta: "2 linhas conectadas",
      linhas: [
        {
          autor: "Beatriz · WhatsApp do profissional",
          texto: "Gostaria de agendar a devolutiva da avaliação neuropsicológica.",
        },
        {
          autor: "Recepção",
          texto: "Reservado para quinta, 16:00. A sala do Meet segue no link acima.",
        },
      ],
    },
  },
  {
    chave: "forms",
    numeral: "02",
    nome: "ORDO Forms",
    aba: "Forms",
    modulo: "Captação e triagem",
    preco: "Plano gratuito disponível",
    titulo: "A triagem que preenche o funil sozinha.",
    descricao:
      "Páginas públicas de triagem, anamnese e captação para o link da bio ou para campanhas. Sem código, com busca de CEP e validação de documentos.",
    recursos: [
      {
        nome: "Formulários ilimitados",
        texto: "Triagem infantil, adulta, de casal ou questionário pré-consulta.",
      },
      {
        nome: "Entrada automática no funil",
        texto: "A resposta chega na coluna de entrada do CRM no mesmo instante.",
      },
      {
        nome: "Busca de CEP e validações",
        texto: "Endereço e dados cadastrais preenchidos sem atrito.",
      },
      {
        nome: "Sua marca",
        texto: "Cores e logotipo da clínica, sem menção a terceiros.",
      },
    ],
    cta: { texto: "Ver planos do Forms", href: "/planos#forms" },
    previa: {
      titulo: "Formulário público",
      etiqueta: "Pré-visualização",
      linhas: [
        {
          autor: "Qual é a sua principal queixa ou objetivo?",
          texto: "Investigação de foco e suspeita de TDAH na fase adulta.",
        },
        { autor: "Melhor período para atendimento", texto: "Tarde" },
      ],
    },
  },
  {
    chave: "manager",
    numeral: "03",
    nome: "ORDO Manager",
    aba: "Manager",
    modulo: "Prontuário e gestão clínica",
    preco: "A partir de R$ 77/mês no anual",
    titulo: "O cuidado depois do sim.",
    descricao:
      "Prontuário eletrônico, evolução de sessões, recibos e controle de faturamento por sessão, pacote ou avaliação. O histórico chega pronto do CRM.",
    recursos: [
      {
        nome: "Prontuário sigiloso",
        texto: "Evolução estruturada das sessões, com campos sensíveis cifrados.",
      },
      {
        nome: "Financeiro integrado",
        texto: "Pagamentos por sessão, pacote ou avaliação, com emissão de recibos.",
      },
      {
        nome: "Sincronização bidirecional",
        texto: "Contratou no CRM, o prontuário já existe no Manager.",
      },
      {
        nome: "Gestão de retornos",
        texto: "A frequência do paciente fica visível antes do abandono.",
      },
    ],
    cta: { texto: "Ver planos do Manager", href: "/planos#manager" },
    previa: {
      titulo: "Prontuário eletrônico",
      etiqueta: "Criptografia ativa",
      linhas: [
        {
          autor: "Sessão 08 · Evolução clínica",
          texto:
            "Aplicação dos instrumentos de atenção concentrada e memória operacional. Boa tolerância à tarefa.",
        },
      ],
    },
  },
  {
    chave: "analytics",
    numeral: "04",
    nome: "ORDO Analytics",
    aba: "Analytics",
    modulo: "Inteligência clínica",
    preco: "Em desenvolvimento",
    titulo: "A escrita clínica com apoio, não com automatismo.",
    descricao:
      "Rascunhos de laudos, devolutivas e consolidação financeira a partir do que já está no sistema. O texto nasce rascunho; a decisão continua sua.",
    recursos: [
      {
        nome: "Rascunho de documentos",
        texto: "Estrutura sugerida a partir das anotações, sempre editável.",
      },
      {
        nome: "Leitura financeira",
        texto: "Sazonalidade e projeção de faturamento do consultório.",
      },
    ],
    cta: { texto: "Garantir acesso antecipado", href: "/planos" },
    previa: {
      titulo: "Assistente clínico",
      etiqueta: "Rascunho para revisão",
      linhas: [
        {
          autor: "Sugestão de documento",
          texto:
            "Consolidando os resultados dos testes aplicados para a síntese diagnóstica da avaliação.",
        },
      ],
    },
    emBreve: true,
  },
];

export function EcosystemShowcase() {
  const [ativo, setAtivo] = useState<Chave>("crm");
  const sistema = SISTEMAS.find((s) => s.chave === ativo) ?? SISTEMAS[0];

  return (
    <section id="pilares" className="bg-[#F2EEE7] py-24 text-[#181716]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel tone="light">A arquitetura</SectionLabel>
          <h2 className="mt-6 font-heading text-3xl font-normal leading-tight tracking-tight text-[#291015] sm:text-4xl lg:text-5xl">
            Quatro sistemas. Um só cadastro.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#181716]/70">
            Cada sistema resolve um gargalo real da rotina e conversa com os outros
            três. Você compra o que precisa agora e soma o resto depois.
          </p>
        </div>

        {/* Abas: texto com eixo em brass. Sem pílulas, sem escala, sem ícone. */}
        <div className="mt-14 flex flex-wrap items-end gap-x-10 gap-y-4 border-b border-[#181716]/12">
          {SISTEMAS.map((s) => (
            <button
              key={s.chave}
              type="button"
              onClick={() => setAtivo(s.chave)}
              className={cn(
                "relative -mb-px flex items-baseline gap-2.5 pb-4 text-sm transition-colors",
                ativo === s.chave
                  ? "text-[#521D2A]"
                  : "text-[#181716]/50 hover:text-[#181716]"
              )}
            >
              <span className="font-heading text-xs tracking-widest">{s.numeral}</span>
              <span className="font-medium">{s.aba}</span>
              {s.emBreve && (
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#B2966F]">
                  em breve
                </span>
              )}
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full origin-left bg-[#521D2A] transition-transform duration-300",
                  ativo === s.chave ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#B2966F]">
              {sistema.modulo} · {sistema.preco}
            </p>

            <h3 className="mt-5 font-heading text-2xl font-normal leading-snug text-[#291015] sm:text-3xl">
              {sistema.titulo}
            </h3>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#181716]/70">
              {sistema.descricao}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
              {sistema.recursos.map((r) => (
                <div key={r.nome} className="flex gap-3">
                  <Tick />
                  <div>
                    <dt className="text-sm font-medium text-[#521D2A]">{r.nome}</dt>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-[#181716]/60">
                      {r.texto}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <Link
              href={sistema.cta.href}
              className="mt-10 inline-block rounded-lg bg-[#521D2A] px-7 py-3.5 text-sm font-medium text-[#F2EEE7] transition-colors hover:bg-[#6B2737]"
            >
              {sistema.cta.texto}
            </Link>
          </div>

          {/* Prévia: superfície calma, dado em primeiro plano. */}
          <div className="lg:col-span-5">
            <div className="border border-[#181716]/12 bg-white">
              <div className="flex items-center justify-between border-b border-[#181716]/10 px-5 py-4">
                <span className="font-heading text-sm font-normal text-[#521D2A]">
                  {sistema.previa.titulo}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#181716]/45">
                  {sistema.previa.etiqueta}
                </span>
              </div>

              <div className="flex flex-col gap-5 p-5">
                {sistema.previa.linhas.map((linha) => (
                  <div key={linha.autor} className="border-l border-[#B2966F] pl-4">
                    <p className="text-xs font-medium text-[#291015]">{linha.autor}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#181716]/65">
                      {linha.texto}
                    </p>
                  </div>
                ))}
              </div>

              <Rule tone="light" />

              <p className="px-5 py-4 text-[11px] tracking-wide text-[#181716]/45">
                {sistema.nome} · ORDO by Práxis Mentis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
