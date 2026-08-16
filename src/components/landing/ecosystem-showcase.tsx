"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function EcosystemShowcase() {
  const [activeTab, setActiveTab] = useState<"crm" | "forms" | "manager" | "analytics">("crm");

  return (
    <section id="pilares" className="py-24 bg-[#FBF9F6] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge className="bg-[#521D2A] text-white hover:bg-[#6b2737] text-xs px-3 py-1 mb-4">
            A Arquitetura Completa
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#291015]">
            4 pilares integrados. Zero retrabalho.
          </h2>
          <p className="mt-4 text-base text-stone-600 font-sans leading-relaxed">
            Cada software foi desenvolvido por especialistas em saúde mental para resolver um gargalo real da sua carreira, operando em perfeita harmonia.
          </p>
        </div>

        {/* Abas Interativas de Seleção */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("crm")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs",
              activeTab === "crm"
                ? "bg-[#521D2A] text-white shadow-md scale-105"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            )}
          >
            <span>💬</span>
            <span>1. ORDO CRM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("forms")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs",
              activeTab === "forms"
                ? "bg-[#521D2A] text-white shadow-md scale-105"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            )}
          >
            <span>📝</span>
            <span>2. ORDO Forms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manager")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs",
              activeTab === "manager"
                ? "bg-[#521D2A] text-white shadow-md scale-105"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            )}
          >
            <span>📋</span>
            <span>3. ORDO Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs",
              activeTab === "analytics"
                ? "bg-[#521D2A] text-white shadow-md scale-105"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            )}
          >
            <span>🤖</span>
            <span>4. ORDO Analytics (IA)</span>
            <span className="rounded bg-[#B2966F] text-[#291015] px-1.5 py-0.2 text-[9px] font-bold">Em Breve</span>
          </button>
        </div>

        {/* Conteúdo Dinâmico da Aba Selecionada */}
        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xl">
          {/* TAB 1: ORDO CRM */}
          {activeTab === "crm" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="lg:col-span-6 flex flex-col gap-5 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#521D2A]">
                  <span>Módulo de Conversão & Atendimento</span>
                  <span>•</span>
                  <span>A partir de R$ 77/mês no anual</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#291015]">
                  ORDO CRM: O WhatsApp Clínico definitivo focado em conversão e sigilo
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Nunca mais perca mensagens de pacientes nem misture sua vida pessoal com a clínica. Conecte os WhatsApps do consultório enquanto usa seu celular e iPad livremente.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">📱 WhatsApp Multi-Linhas</p>
                    <p className="text-stone-500 mt-1">Dr. Ítalo e Secretária atendendo em paralelo com filtro instantâneo por linha.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">🎙️ Transcrição de Áudio</p>
                    <p className="text-stone-500 mt-1">Áudios longos convertidos em texto legível na hora para você ler entre consultas.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">🎥 Google Meet Nativo</p>
                    <p className="text-stone-500 mt-1">Link de videoconferência gerado automaticamente no agendamento com botão de copiar em 1 clique.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">👁️ Modo Sigilo Clínico</p>
                    <p className="text-stone-500 mt-1">Oculte nomes de pacientes e faturamento com um clique no olhinho ao abrir na frente de terceiros.</p>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/planos#crm"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#521D2A] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#6b2737]"
                  >
                    <span>Ver Planos do ORDO CRM</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl border border-stone-200 bg-[#291015] p-5 text-white shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-heading text-sm font-bold text-white">Central de Conversas · ORDO CRM</span>
                  <span className="rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5">● 2 Linhas Conectadas</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <p className="font-bold text-amber-300">Dra. Beatriz · Psicóloga (WhatsApp)</p>
                    <p className="text-stone-300 text-[11px] mt-0.5">"Olá! Gostaria de agendar a devolutiva da avaliação neuropsicológica..."</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#521D2A]/80 border border-[#B2966F]/30">
                    <p className="font-bold text-[#E2D2BC]">Recepção / Secretária</p>
                    <p className="text-stone-200 text-[11px] mt-0.5">"Perfeito! Horário reservado para Quinta às 16:00. Segue a sala do Google Meet: meet.google.com/xyz-ordo"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDO FORMS */}
          {activeTab === "forms" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="lg:col-span-6 flex flex-col gap-5 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#521D2A]">
                  <span>Módulo de Captação & Triagem</span>
                  <span>•</span>
                  <span>Plano Grátis Disponível</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#291015]">
                  ORDO Forms: Formulários clínicos e de captação que alimentam seu CRM
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Crie páginas públicas de triagem, anamnese e captação para colocar no link da bio do Instagram ou campanhas de tráfego pago. Sem código, com busca automática de CEP e validação de CPF.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">📝 Formulários Ilimitados</p>
                    <p className="text-stone-500 mt-1">Crie triagens infantis, adultas, de casal ou questionários pré-consulta sem limite no plano Solo.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">⚡ Entrada Automática no Funil</p>
                    <p className="text-stone-500 mt-1">O paciente respondeu? Ele cai instantaneamente na coluna de Entrada do seu ORDO CRM.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">📍 Busca CEP & Validações</p>
                    <p className="text-stone-500 mt-1">Preenchimento inteligente de endereço e dados cadastrais sem atrito.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">🎨 Sua Marca Própria</p>
                    <p className="text-stone-500 mt-1">Personalize cores, logotipo da sua clínica e remova qualquer menção externa.</p>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/planos#forms"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#521D2A] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#6b2737]"
                  >
                    <span>Ver Planos do ORDO Forms</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl border border-stone-200 bg-[#FBF9F6] p-6 text-stone-900 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="font-heading text-sm font-bold text-[#521D2A]">Visualização de Formulário Público</span>
                  <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 font-bold">ORDO Forms</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Qual é a sua principal queixa ou objetivo?</label>
                    <div className="p-2.5 rounded-lg border border-stone-300 bg-white text-stone-600">
                      Investigação de foco e suspeita de TDAH na fase adulta...
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Melhor período para atendimento:</label>
                    <div className="flex gap-2">
                      <span className="rounded-lg bg-[#521D2A] text-white px-3 py-1.5 text-xs font-semibold">Tarde</span>
                      <span className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs">Noite</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDO MANAGER */}
          {activeTab === "manager" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="lg:col-span-6 flex flex-col gap-5 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#521D2A]">
                  <span>Módulo Clínico & Prontuário Eletrônico</span>
                  <span>•</span>
                  <span>A partir de R$ 77/mês no anual</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#291015]">
                  ORDO Manager: Gestão clínica profunda, prontuários sigilosos e financeiro
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  O software clínico que cuida do paciente após a contratação. Prontuário eletrônico completo, evolução de sessões, emissão de recibos e controle de faturamento por sessão ou pacote.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">🔒 Prontuário Sigiloso</p>
                    <p className="text-stone-500 mt-1">Evolução estruturada de sessões com segurança em nível hospitalar.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">💰 Financeiro Integrado</p>
                    <p className="text-stone-500 mt-1">Controle de pagamentos por sessão, pacote terapêutico ou avaliação com emissão de recibos.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">🔗 Sincronização Bidirecional</p>
                    <p className="text-stone-500 mt-1">Integração nativa com ORDO CRM e Forms: o paciente contratou no CRM, o prontuário já é criado no Manager.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">📅 Gestão de Retornos</p>
                    <p className="text-stone-500 mt-1">Acompanhe a frequência do paciente e evite abandonos de tratamento.</p>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/planos#manager"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#521D2A] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#6b2737]"
                  >
                    <span>Ver Planos do ORDO Manager</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-xl flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="font-heading text-sm font-bold text-[#521D2A]">Prontuário Eletrônico · ORDO Manager</span>
                  <span className="rounded-full bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 font-bold">Criptografia Ativa</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <p className="font-bold text-stone-800">Sessão #08 · Evolução Clínica</p>
                  <p className="text-stone-500 text-[11px] mt-1">"Aplicação dos instrumentos neuropsicológicos para atenção concentrada e memória operacional. Paciente apresentou boa tolerância..."</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDO ANALYTICS (IA) */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="lg:col-span-6 flex flex-col gap-5 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B2966F]">
                  <span>Inteligência Artificial Clínica</span>
                  <span>•</span>
                  <span>Em Desenvolvimento</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#291015]">
                  ORDO Analytics: O estagiário virtual com IA do psicólogo autônomo
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Imagine economizar até 10 horas semanais na elaboração de laudos, documentos clínicos, relatórios de devolutiva e consolidação financeira. O Analytics atuará como seu braço direito inteligente.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">📄 Rascunho de Laudos com IA</p>
                    <p className="text-stone-500 mt-1">Estruturação de documentos baseados nas anotações da sessão com total controle do profissional.</p>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FBF9F6] p-3 text-xs">
                    <p className="font-bold text-[#521D2A]">📈 Previsão Financeira</p>
                    <p className="text-stone-500 mt-1">Análise preditiva de faturamento e sazonalidade para o consultório.</p>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/planos"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B2966F] to-[#C9B18F] px-6 py-3 text-xs font-bold text-[#291015] shadow-md"
                  >
                    <span>Garantir Acesso Antecipado no Combo PRO</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl border border-stone-200 bg-[#291015] p-6 text-white shadow-xl flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-heading text-sm font-bold text-[#B2966F]">ORDO Analytics · Assistente Clínico</span>
                  <span className="rounded-full bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 font-bold">IA em Aprendizado</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
                  <p className="font-bold text-stone-200">🤖 Sugestão de Documento:</p>
                  <p className="text-stone-300 text-[11px] mt-1">"Consolidando resultados dos testes aplicados para elaboração da síntese diagnóstica da avaliação neuropsicológica..."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
