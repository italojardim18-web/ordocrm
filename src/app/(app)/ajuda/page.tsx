import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Manual do Usuário & Central de Ajuda | ORDO CRM",
  description: "Guia completo de uso, módulos, rotinas clínicas e boas práticas do ORDO CRM by Práxis Mentis.",
};

export default function AjudaPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 pb-16">
      {/* Topo / Header com Identidade Visual */}
      <div className="flex flex-col gap-3 border-b border-stone-200 pb-6 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#521D2A] text-xl text-white shadow-sm">
            📖
          </span>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Manual do Usuário & Central de Ajuda
            </h1>
            <p className="text-sm text-stone-500">
              ORDO CRM by Práxis Mentis · Guia Oficial de Funcionalidades, Rotinas Clínicas e Integrações
            </p>
          </div>
        </div>
      </div>

      {/* Sumário Rápido de Acesso */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <a
          href="#pipeline"
          className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs transition-all hover:border-[#521D2A]/40 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <span className="text-lg">⚡</span>
          <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">1. Pipeline & Kanban</span>
          <span className="text-[11px] text-stone-500">Gestão de Leads e Fases</span>
        </a>

        <a
          href="#conversas"
          className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs transition-all hover:border-[#521D2A]/40 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <span className="text-lg">💬</span>
          <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">2. Conversas & WhatsApp</span>
          <span className="text-[11px] text-stone-500">Dr. Ítalo + Secretária</span>
        </a>

        <a
          href="#agenda"
          className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs transition-all hover:border-[#521D2A]/40 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <span className="text-lg">📅</span>
          <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">3. Agenda & Google Meet</span>
          <span className="text-[11px] text-stone-500">Agendamentos e Cores</span>
        </a>

        <a
          href="#lead360"
          className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs transition-all hover:border-[#521D2A]/40 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <span className="text-lg">📋</span>
          <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">4. Lead 360 & Prontuário</span>
          <span className="text-[11px] text-stone-500">Histórico e Triagem</span>
        </a>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 1: VISÃO GERAL DO SISTEMA                                           */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">Módulo 01</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Visão Geral & Filosofia do ORDO CRM
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">O que é o ORDO CRM?</CardTitle>
            <CardDescription>
              Sistema de gestão comercial e de relacionamento clínico desenvolvido sob medida para psicólogos, neuropsicólogos e clínicas de saúde mental.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
            <p>
              O <strong>ORDO CRM</strong> organiza todo o ciclo de vida do paciente na sua clínica: desde a primeira mensagem enviada no WhatsApp ou preenchimento de formulário de anúncio, passando pela triagem, agendamento de consultas com Google Meet automático, até o acompanhamento clínico (Follow-up) e reativação de pacientes inativos.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-900/60">
                <p className="font-semibold text-xs text-[#521D2A] dark:text-amber-300">🔒 Segurança & LGPD</p>
                <p className="text-xs text-stone-500 mt-1">Criptografia AES-256 de ponta a ponta e isolamento total de dados de saúde mental.</p>
              </div>
              <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-900/60">
                <p className="font-semibold text-xs text-[#521D2A] dark:text-amber-300">📱 WhatsApp Multi-Linhas</p>
                <p className="text-xs text-stone-500 mt-1">Dr. Ítalo e Secretária conectados em paralelo com filtro instantâneo por linha.</p>
              </div>
              <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-900/60">
                <p className="font-semibold text-xs text-[#521D2A] dark:text-amber-300">🌐 Sincronização Google</p>
                <p className="text-xs text-stone-500 mt-1">Integração bidirecional com Google Calendar, Google Meet, PsicoManager e agenda pessoal.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 2: PIPELINE COMERCIAL & FUNIL (KANBAN)                              */}
      {/* ========================================================================= */}
      <section id="pipeline" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">Módulo 02</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Pipeline Comercial & Funil de Atendimento (Kanban)
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como funciona o Funil de Atendimento?</CardTitle>
            <CardDescription>
              O Pipeline organiza os pacientes em colunas verticais que representam o momento exato em que eles estão na jornada da clínica.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">1. Entrada</span>
                <p className="text-xs text-stone-600 dark:text-stone-400">Leads recém-chegados pelo WhatsApp, formulários ou Instagram aguardando primeiro contato.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">2. Triagem / Qualificação</span>
                <p className="text-xs text-stone-600 dark:text-stone-400">Identificação da queixa principal, faixa etária (criança, adolescente ou adulto) e alinhamento do serviço indicado.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">3. Proposta & Valores</span>
                <p className="text-xs text-stone-600 dark:text-stone-400">Envio de investimento, horários disponíveis e condições para a sessão ou avaliação neuropsicológica.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-300">4. Consulta Agendada</span>
                <p className="text-xs text-stone-600 dark:text-stone-400">Data e horário confirmados na Agenda com link automático do Google Meet.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-bold dark:bg-blue-950 dark:text-blue-300">5. Atendimento / Em Tratamento</span>
                <p className="text-xs text-stone-600 dark:text-stone-400">Paciente em acompanhamento regular ou processo de avaliação neuropsicológica em andamento.</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              💡 <strong>Dica Prática:</strong> Você pode arrastar os cards entre as colunas (Drag-and-Drop) ou clicar em qualquer lead para abrir a ficha completa do paciente (Lead 360).
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 3: CENTRAL DE CONVERSAS & WHATSAPP MULTI-LINHAS                     */}
      {/* ========================================================================= */}
      <section id="conversas" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">Módulo 03</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Central de Conversas & WhatsApp Multi-Linhas
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como utilizar as conversas do WhatsApp?</CardTitle>
            <CardDescription>
              Atendimento centralizado com suporte a múltiplos números (Dr. Ítalo e Secretária) na mesma tela.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Filtro por Linha no Topo:</strong> Use os botões <code>Todas</code>, <code>Dr. Ítalo</code> ou <code>Secretária</code> para visualizar apenas as conversas do seu número ou da recepção.
              </li>
              <li>
                <strong>Envio Rápido e Mídias:</strong> Envie mensagens de texto, áudios, imagens, documentos em PDF e arquivos diretamente pelo CRM.
              </li>
              <li>
                <strong>Transcrição de Áudios:</strong> Áudios recebidos de pacientes são transcritos automaticamente para facilitar a leitura rápida durante o atendimento.
              </li>
              <li>
                <strong>Identidade de Aparelho Conectado:</strong> O WhatsApp reconhece o ORDO CRM como um dispositivo oficial separado (você pode usar celular, iPad e CRM simultaneamente sem desconectar).
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 4: AGENDA CLÍNICA & GOOGLE MEET                                     */}
      {/* ========================================================================= */}
      <section id="agenda" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">Módulo 04</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Agenda Clínica, Google Calendar & Google Meet
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como agendar e gerenciar atendimentos?</CardTitle>
            <CardDescription>
              Grade horária semanal, diária e mensal com cálculo proporcional de duração e integração completa com a sua Google Agenda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
            <div className="space-y-2 text-xs">
              <p>
                <strong>1. Agendamento por Clique na Grade:</strong> Clique em qualquer horário vazio (ex: Quarta-feira às 14:00) para abrir o modal pré-preenchido.
              </p>
              <p>
                <strong>2. Duração Proporcional:</strong> Consultas de 50 min, 1h, 1h30 ou 2h ocupam o tamanho exato na grade horária.
              </p>
              <p>
                <strong>3. Google Meet Automático:</strong> Ao cadastrar um atendimento com vídeo, o link do Google Meet é criado na hora e fica disponível para cópia em 1 clique e entrada direta.
              </p>
              <p>
                <strong>4. Personalização de Cores & Filtros:</strong> Clique no botão <code>🎨 Cores & Agendas</code> para definir cores individuais para cada agenda (ORDO, PsicoManager, Pessoal) e ocultar/exibir compromissos com facilidade.
              </p>
              <p>
                <strong>5. Sincronização Bidirecional:</strong> O botão <code>🔄 Sincronizar Google Agenda</code> força a atualização em tempo real, bloqueando horários ocupados para evitar conflitos.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 5: LEAD 360 & HISTÓRICO CLÍNICO                                     */}
      {/* ========================================================================= */}
      <section id="lead360" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">Módulo 05</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Lead 360 & Prontuário do Paciente
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ficha Centralizada do Paciente</CardTitle>
            <CardDescription>
              Acesso a todas as informações clínicas, comerciais e histórico de mensagens em uma única tela.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-700 dark:text-stone-300">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">Dados Pessoais & Contato</p>
                <p className="text-stone-500 mt-1">Nome, telefone, e-mail, origem do lead, temperatura (Frio, Morno, Quente) e fase atual.</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">Linha do Tempo (Timeline)</p>
                <p className="text-stone-500 mt-1">Histórico completo de mensagens trocadas, agendamentos realizados, anotações de triagem e mudanças de fase.</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">Notas Clínicas Privadas</p>
                <p className="text-stone-500 mt-1">Espaço seguro para observações clínicas, encaminhamentos e apontamentos da sessão.</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">Agendamentos do Paciente</p>
                <p className="text-stone-500 mt-1">Histórico de todas as sessões anteriores e futuras com status (Realizada, Cancelada, Falta).</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 6: ORDO FORMS, ORIGENS & RESULTADOS                                 */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">Módulo 06</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            ORDO Forms, Origens do Lead & Resultados Comerciais
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automação de Entrada e Métricas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">📝 ORDO Forms</p>
                <p className="text-stone-500 mt-1">Crie formulários públicos de triagem para colocar no seu site ou link da bio do Instagram. Os pacientes preenchem e entram direto no funil.</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">🌐 Origens do Lead</p>
                <p className="text-stone-500 mt-1">Acompanhe de onde vêm seus pacientes (Google Ads, Instagram, Indicação, Parcerias, Site) e saiba qual canal traz mais retorno financeiro.</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-stone-100">🏆 Resultado Comercial</p>
                <p className="text-xs text-stone-500 mt-1">Painel financeiro com faturamento mensal, ticket médio por procedimento, taxa de conversão de novos pacientes e previsão de receitas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO 7: PERGUNTAS FREQUENTES (FAQ)                                       */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#521D2A] text-white">FAQ</Badge>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Perguntas Frequentes & Dúvidas Rápidas
          </h2>
        </div>

        <div className="space-y-3">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">O WhatsApp desconectou. Como reconectar?</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400">
              Vá em <strong>Configurações → Integrações</strong>. Na linha desconectada, clique em <strong>⚡ Reconectar / Gerar QR</strong>. Abra o WhatsApp no celular → Aparelhos conectados → Conectar aparelho e aponte a câmera.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Como sincronizar meus compromissos do PsicoManager com o ORDO?</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400">
              Como o PsicoManager sincroniza com a sua Google Agenda, ao conectar a sua conta Google no ORDO, o sistema lê automaticamente todas as suas agendas (incluindo a do PsicoManager) e exibe os horários com a etiqueta <code>PsicoManager</code>.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Posso usar o CRM no meu iPad ou Celular?</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-stone-600 dark:text-stone-400">
              Sim! O ORDO CRM é 100% responsivo e funciona no Safari, Chrome ou qualquer navegador do iPad, tablet, notebook e smartphone.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rodapé da Central de Ajuda */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-stone-100 p-4 text-xs text-stone-600 dark:bg-stone-900 dark:text-stone-400">
        <div>
          <p className="font-semibold text-stone-900 dark:text-stone-100">ORDO CRM by Práxis Mentis</p>
          <p>Desenvolvido para excelência clínica e organização comercial em saúde mental.</p>
        </div>
        <Link
          href="/pipeline"
          className="rounded-xl bg-[#521D2A] px-4 py-2 font-semibold text-white shadow-xs hover:bg-[#722a3b]"
        >
          Voltar ao Pipeline →
        </Link>
      </div>
    </div>
  );
}
