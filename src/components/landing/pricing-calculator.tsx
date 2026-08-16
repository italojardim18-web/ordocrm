"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PricingCalculator({ showAllSystems = true }: { showAllSystems?: boolean }) {
  // Estado do Seletor: "anual" (default com 20% OFF) ou "mensal"
  const [billingCycle, setBillingCycle] = useState<"anual" | "mensal">("anual");

  return (
    <section id="precos" className="py-24 bg-[#FBF9F6] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho de Preços */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge className="bg-[#521D2A] text-white text-xs px-3 py-1 mb-4">
            Estrutura Oficial de Precificação
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#291015]">
            Planos transparentes. Escolha o módulo ou o Ecossistema Completo.
          </h2>
          <p className="mt-4 text-base text-stone-600 font-sans leading-relaxed">
            Sem taxas escondidas. Comece com um software individual ou aproveite a integração total com 20% de desconto no plano anual.
          </p>

          {/* Toggle Anual vs. Mensal */}
          <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-white p-1.5 border border-stone-300/80 shadow-md">
            <button
              type="button"
              onClick={() => setBillingCycle("anual")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-2",
                billingCycle === "anual"
                  ? "bg-[#521D2A] text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              <span>Plano Anual</span>
              <span className="rounded-full bg-[#B2966F] text-[#291015] px-2 py-0.5 text-[10px] font-black">
                20% OFF
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("mensal")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all",
                billingCycle === "mensal"
                  ? "bg-[#521D2A] text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              Plano Mensal
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESTAQUE PRINCIPAL: COMBO ECOSSISTEMA COMPLETO PRO                        */}
        {/* ========================================================================= */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl border-2 border-[#B2966F] bg-gradient-to-b from-[#291015] to-[#3B151F] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-r from-[#B2966F] to-[#C9B18F] px-4 py-1.5 text-xs font-black text-[#291015] uppercase tracking-wider">
            ⭐ Mais Recomendado · Melhor Custo-Benefício
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 sm:pt-0">
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Combo Ecossistema ORDO PRO
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                A solução definitiva para o consultório que deseja automatizar captação, atendimento e prontuário sem perder nenhum paciente.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>ORDO CRM PRO:</strong> WhatsApp Multi-Linha</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>ORDO Forms PRO:</strong> Formulários ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>ORDO Manager PRO:</strong> Prontuário & Finanças</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Google Meet & Agenda:</strong> Automático</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>ORDO Analytics (IA):</strong> Acesso Antecipado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Suporte Prioritário:</strong> Direto no WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center rounded-2xl bg-white/5 p-6 border border-white/10 text-center lg:text-right">
              <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider">
                Investimento Completo:
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                {billingCycle === "anual" && (
                  <span className="text-sm line-through text-stone-400 font-semibold mr-1.5">
                    R$ 397/mês
                  </span>
                )}
                <span className="font-heading text-4xl sm:text-5xl font-bold text-[#E2D2BC]">
                  {billingCycle === "anual" ? "R$ 297" : "R$ 397"}
                </span>
                <span className="text-xs text-stone-300 font-medium">/mês</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {billingCycle === "anual" ? "Cobrado anualmente (Economia de R$ 1.200/ano)" : "Cobrança mensal sem fidelidade"}
              </p>

              <a
                href="https://wa.me/5521999999999?text=Olá!%20Gostaria%20de%20assinar%20o%20Combo%20Ecossistema%20ORDO%20PRO."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#B2966F] to-[#C9B18F] py-3.5 text-center text-xs sm:text-sm font-bold text-[#291015] shadow-xl hover:scale-105 transition-transform"
              >
                Garantir o Combo com 20% OFF ↗
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEÇÃO 2: PLANOS INDIVIDUAIS POR PRODUTO (FORMS, CRM, MANAGER)             */}
        {/* ========================================================================= */}
        {showAllSystems && (
          <div className="mt-20 space-y-16">
            {/* 1. TABELA ORDO CRM */}
            <div id="crm" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#291015] flex items-center gap-2">
                    <span>💬</span>
                    <span>1. ORDO CRM (Central de Atendimento & Vendas)</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">WhatsApp multi-linhas, pipeline Kanban, agendamentos e Google Meet nativo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Individual */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-[#521D2A]/50 transition-all">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Individual (Solo)</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">CRM Solo</h4>
                    <p className="text-xs text-stone-500 mt-1">Ideal para profissionais autônomos que atendem por conta própria.</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      {billingCycle === "anual" && <span className="text-xs line-through text-stone-400 mr-1">R$ 97</span>}
                      <span className="font-heading text-3xl font-bold text-[#521D2A]">
                        {billingCycle === "anual" ? "R$ 77,00" : "R$ 97,00"}
                      </span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>
                    {billingCycle === "anual" && <p className="text-[10px] text-emerald-700 font-semibold">R$ 924/ano (20% OFF)</p>}

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ Acesso para 1 Profissional</li>
                      <li>✓ 1 Conexão de WhatsApp oficial</li>
                      <li>✓ Funil Pipeline Kanban</li>
                      <li>✓ Agenda integrada com Google Calendar</li>
                      <li>✓ Google Meet nativo com 1 clique</li>
                      <li>✓ Modo Sigilo Clínico (Olhinho)</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl border border-[#521D2A] text-center py-2.5 text-xs font-bold text-[#521D2A] hover:bg-[#521D2A] hover:text-white transition-all"
                  >
                    Contratar CRM Individual
                  </Link>
                </div>

                {/* PRO */}
                <div className="rounded-3xl border-2 border-[#521D2A] bg-white p-6 shadow-xl flex flex-col justify-between gap-6 relative">
                  <div className="absolute -top-3 right-4 rounded-full bg-[#521D2A] text-white px-3 py-0.5 text-[10px] font-bold">
                    Profissional + Secretária
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#521D2A] uppercase">Plano PRO</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">CRM PRO</h4>
                    <p className="text-xs text-stone-500 mt-1">Para consultórios com secretária ou recepção operando juntas.</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      {billingCycle === "anual" && <span className="text-xs line-through text-stone-400 mr-1">R$ 197</span>}
                      <span className="font-heading text-3xl font-bold text-[#521D2A]">
                        {billingCycle === "anual" ? "R$ 157,00" : "R$ 197,00"}
                      </span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>
                    {billingCycle === "anual" && <p className="text-[10px] text-emerald-700 font-semibold">R$ 1.884/ano (20% OFF)</p>}

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ <strong>Profissional + Secretária</strong> inclusos</li>
                      <li>✓ <strong>WhatsApp Multi-Linhas</strong> (Dr. e Recepção)</li>
                      <li>✓ <strong>Transcrição Automática de Áudios</strong></li>
                      <li>✓ <strong>Ficha Lead 360 Completa</strong></li>
                      <li>✓ Google Meet & Sincronização Google Calendar</li>
                      <li>✓ Modo Sigilo Clínico</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl bg-[#521D2A] text-center py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6b2737] transition-all"
                  >
                    Contratar CRM PRO
                  </Link>
                </div>

                {/* Clínica */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-[#521D2A]/50 transition-all">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Clínica & Equipe</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">CRM Clínica</h4>
                    <p className="text-xs text-stone-500 mt-1">Múltiplos profissionais, salas e recepções centralizadas.</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-heading text-2xl font-bold text-stone-900">
                        Sob Consulta
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500">Proposta personalizada para sua estrutura</p>

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ Múltiplos profissionais e agendas</li>
                      <li>✓ Reunião de Implementação Assistida</li>
                      <li>✓ Dashboard completo de métricas de atribuição</li>
                      <li>✓ SLA e Gerente de Contas dedicado</li>
                    </ul>
                  </div>

                  <a
                    href="https://wa.me/5521999999999?text=Olá!%20Gostaria%20de%20uma%20proposta%20para%20o%20ORDO%20CRM%20Clínica."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl border border-stone-300 text-center py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
                  >
                    Falar com Consultor
                  </a>
                </div>
              </div>
            </div>

            {/* 2. TABELA ORDO FORMS */}
            <div id="forms" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#291015] flex items-center gap-2">
                    <span>📝</span>
                    <span>2. ORDO Forms (Captação, Anamnese & Triagem)</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">Formulários públicos com busca de CEP, validação de CPF e integração direta no CRM.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Grátis */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Degustação</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">Forms Grátis</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-heading text-3xl font-bold text-stone-900">R$ 0,00</span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ Até 100 respostas/mês</li>
                      <li>✓ Até 3 formulários ativos</li>
                      <li>✓ 100MB de armazenamento</li>
                      <li>✓ Busca automática de CEP</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl border border-stone-300 text-center py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
                  >
                    Criar Conta Grátis
                  </Link>
                </div>

                {/* Individual */}
                <div className="rounded-3xl border border-[#521D2A] bg-white p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-[#521D2A] transition-all">
                  <div>
                    <span className="text-xs font-bold text-[#521D2A] uppercase">Solo</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">Forms Individual</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      {billingCycle === "anual" && <span className="text-xs line-through text-stone-400 mr-1">R$ 77</span>}
                      <span className="font-heading text-3xl font-bold text-[#521D2A]">
                        {billingCycle === "anual" ? "R$ 61,00" : "R$ 77,00"}
                      </span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>
                    {billingCycle === "anual" && <p className="text-[10px] text-emerald-700 font-semibold">R$ 732/ano (20% OFF)</p>}

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ <strong>1.000 respostas/mês</strong></li>
                      <li>✓ <strong>Formulários Ilimitados</strong></li>
                      <li>✓ 1GB de arquivos e anexos</li>
                      <li>✓ Personalização visual completa</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl bg-[#521D2A] text-center py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#6b2737] transition-all"
                  >
                    Assinar Forms Solo
                  </Link>
                </div>

                {/* Clínica PRO */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Clínica (PRO)</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">Forms PRO</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      {billingCycle === "anual" && <span className="text-xs line-through text-stone-400 mr-1">R$ 187</span>}
                      <span className="font-heading text-3xl font-bold text-stone-900">
                        {billingCycle === "anual" ? "R$ 149,00" : "R$ 187,00"}
                      </span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>
                    {billingCycle === "anual" && <p className="text-[10px] text-emerald-700 font-semibold">R$ 1.788/ano (20% OFF)</p>}

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ 5.000 respostas/mês e 5GB de arquivos</li>
                      <li>✓ Remoção total de marca d'água</li>
                      <li>✓ Validação de CPF/CNPJ</li>
                      <li>✓ Integração com Calendly e Analytics</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl border border-stone-300 text-center py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
                  >
                    Assinar Forms PRO
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. TABELA ORDO MANAGER */}
            <div id="manager" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#291015] flex items-center gap-2">
                    <span>📋</span>
                    <span>3. ORDO Manager (Prontuário Eletrônico & Gestão Clínica)</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">Evolução de sessões, histórico de pacientes e controle financeiro integrado.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Grátis */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Degustação</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">Manager Básico</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-heading text-3xl font-bold text-stone-900">R$ 0,00</span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ Criação básica de pacientes</li>
                      <li>✓ Acompanhamento inicial</li>
                      <li>✓ Financeiro básico</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl border border-stone-300 text-center py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
                  >
                    Começar Básico
                  </Link>
                </div>

                {/* Standard */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Standard</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">Manager Standard</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      {billingCycle === "anual" && <span className="text-xs line-through text-stone-400 mr-1">R$ 97</span>}
                      <span className="font-heading text-3xl font-bold text-stone-900">
                        {billingCycle === "anual" ? "R$ 77,00" : "R$ 97,00"}
                      </span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>
                    {billingCycle === "anual" && <p className="text-[10px] text-emerald-700 font-semibold">R$ 924/ano (20% OFF)</p>}

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ Prontuário Eletrônico Completo</li>
                      <li>✓ Financeiro Avançado (Recibos e Pacotes)</li>
                      <li>✓ Gestão de Sessões e Retornos</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl border border-stone-300 text-center py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
                  >
                    Assinar Standard
                  </Link>
                </div>

                {/* PRO */}
                <div className="rounded-3xl border-2 border-[#521D2A] bg-white p-6 shadow-xl flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold text-[#521D2A] uppercase">PRO Integrado</span>
                    <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">Manager PRO</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      {billingCycle === "anual" && <span className="text-xs line-through text-stone-400 mr-1">R$ 147</span>}
                      <span className="font-heading text-3xl font-bold text-[#521D2A]">
                        {billingCycle === "anual" ? "R$ 117,00" : "R$ 147,00"}
                      </span>
                      <span className="text-xs text-stone-500">/mês</span>
                    </div>
                    {billingCycle === "anual" && <p className="text-[10px] text-emerald-700 font-semibold">R$ 1.404/ano (20% OFF)</p>}

                    <ul className="mt-5 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                      <li>✓ Todas as funções do Manager Avançado</li>
                      <li>✓ <strong>Integração nativa bidirecional com ORDO CRM</strong></li>
                      <li>✓ <strong>Integração com ORDO Forms</strong></li>
                      <li>✓ Preparado para futuro ORDO Analytics (IA)</li>
                    </ul>
                  </div>

                  <Link
                    href="/login"
                    className="w-full rounded-xl bg-[#521D2A] text-center py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#6b2737] transition-all"
                  >
                    Assinar Manager PRO
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
