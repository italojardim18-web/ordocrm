"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  createAgendaAppointmentAction,
  updateAppointmentStatusAction,
  deleteAppointmentAction,
  searchLeadsForAgenda,
  type AgendaActionResult,
} from "./agenda-actions";

export interface AppointmentDialogData {
  isOpen: boolean;
  mode: "create" | "view";
  initialDate?: Date;
  initialHour?: number;
  appointment?: {
    id: string;
    title: string;
    description?: string | null;
    starts_at: Date;
    ends_at?: Date | null;
    status: string;
    lead_id?: string | null;
    lead_name?: string | null;
    meet_link?: string | null;
    link?: string | null;
    source: "ordo" | "google";
  } | null;
}

interface AppointmentDialogProps {
  data: AppointmentDialogData;
  onClose: () => void;
  workspaceTimezone: string;
  isGoogleConnected: boolean;
}

const PROCEDIMENTO_SUGESTOES = [
  "Sessão de Psicoterapia",
  "Avaliação Neuropsicológica",
  "Consulta de Alinhamento",
  "Sessão de Retorno",
  "Supervisão Clínica",
  "Devolutiva de Avaliação",
];

export function AppointmentDialog({
  data,
  onClose,
  workspaceTimezone,
  isGoogleConnected,
}: AppointmentDialogProps) {
  const [isPending, startTransition] = useTransition();

  // Campos do formulário
  const [title, setTitle] = useState("");
  const [leadId, setLeadId] = useState<string>("");
  const [leadQuery, setLeadQuery] = useState("");
  const [leadResults, setLeadResults] = useState<Array<{ id: string; name: string; phone: string | null; email: string | null }>>([]);
  const [selectedLeadName, setSelectedLeadName] = useState<string>("");
  const [isSearchingLeads, setIsSearchingLeads] = useState(false);

  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("08:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState("");
  const [withMeet, setWithMeet] = useState(false);
  const [inviteLead, setInviteLead] = useState(true);

  // Conflito
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Inicializar dados ao abrir modal
  useEffect(() => {
    if (!data.isOpen) return;

    setConflictWarning(null);

    if (data.mode === "create") {
      const base = data.initialDate || new Date();
      const yyyy = base.getFullYear();
      const mm = String(base.getMonth() + 1).padStart(2, "0");
      const dd = String(base.getDate()).padStart(2, "0");
      setDateStr(`${yyyy}-${mm}-${dd}`);

      const h = data.initialHour !== undefined ? data.initialHour : 8;
      setTimeStr(`${String(h).padStart(2, "0")}:00`);
      setTitle("Sessão de Psicoterapia");
      setLeadId("");
      setSelectedLeadName("");
      setLeadQuery("");
      setDescription("");
      setDurationMinutes(50);
      setWithMeet(isGoogleConnected);
    }
  }, [data.isOpen, data.mode, data.initialDate, data.initialHour, isGoogleConnected]);

  // Busca de leads dinâmica
  useEffect(() => {
    if (!data.isOpen || data.mode !== "create") return;

    let active = true;
    setIsSearchingLeads(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchLeadsForAgenda(leadQuery);
        if (active) setLeadResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsSearchingLeads(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [leadQuery, data.isOpen, data.mode]);

  // Suporte a tecla Esc para fechar modal
  useEffect(() => {
    if (!data.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data.isOpen, onClose]);

  if (!data.isOpen) return null;

  const handleSubmitCreate = (force = false) => {
    if (!title.trim()) {
      toast.error("Informe o título do compromisso.");
      return;
    }

    const startsAtIso = `${dateStr}T${timeStr}:00`;

    startTransition(async () => {
      const res: AgendaActionResult = await createAgendaAppointmentAction({
        leadId: leadId || null,
        title: title.trim(),
        startsAt: startsAtIso,
        durationMinutes,
        description: description.trim() || null,
        withMeet,
        inviteLead,
        force,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.warning && !force) {
        setConflictWarning(res.warning || "Conflito de horário detectado.");
        return;
      }

      toast.success("Agendamento criado com sucesso!");
      onClose();
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!data.appointment?.id) return;

    startTransition(async () => {
      const res = await updateAppointmentStatusAction(data.appointment!.id, newStatus as any);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Status atualizado!");
        onClose();
      }
    });
  };

  const handleDelete = () => {
    if (!data.appointment?.id) return;
    if (!confirm("Deseja realmente cancelar e excluir este agendamento?")) return;

    startTransition(async () => {
      const res = await deleteAppointmentAction(data.appointment!.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Agendamento cancelado.");
        onClose();
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* MODO CRIAÇÃO */}
        {data.mode === "create" && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100">
                Novo Agendamento
              </h3>
              <p className="text-xs text-stone-500">
                Cadastre a consulta na agenda e no pipeline do paciente
              </p>
            </div>

            {/* Aviso de Conflito de Horário */}
            {conflictWarning && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                <p className="font-semibold">⚠️ {conflictWarning}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleSubmitCreate(true)}
                    disabled={isPending}
                    className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                  >
                    Agendar Mesmo Assim
                  </button>
                  <button
                    onClick={() => setConflictWarning(null)}
                    className="rounded-lg border border-amber-400 bg-white px-3 py-1 text-xs font-medium text-amber-800 dark:bg-stone-900 dark:text-amber-200"
                  >
                    Alterar Horário
                  </button>
                </div>
              </div>
            )}

            {/* Seleção do Paciente / Lead */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Paciente / Lead
              </label>
              {selectedLeadName ? (
                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-800">
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    👤 {selectedLeadName}
                  </span>
                  <button
                    onClick={() => {
                      setLeadId("");
                      setSelectedLeadName("");
                    }}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar paciente por nome, telefone ou e-mail..."
                    value={leadQuery}
                    onChange={(e) => setLeadQuery(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#521D2A] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                  {leadResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1 shadow-lg dark:border-stone-700 dark:bg-stone-800">
                      {leadResults.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => {
                            setLeadId(lead.id);
                            setSelectedLeadName(lead.name);
                            setLeadQuery("");
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-700"
                        >
                          <span className="font-medium text-stone-900 dark:text-stone-100">{lead.name}</span>
                          <span className="text-[11px] text-stone-400">{lead.phone || lead.email || "Sem contato"}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Procedimento / Título */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Procedimento / Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Sessão de Psicoterapia"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-[#521D2A] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {PROCEDIMENTO_SUGESTOES.slice(0, 3).map((sugestao) => (
                  <button
                    key={sugestao}
                    type="button"
                    onClick={() => setTitle(sugestao)}
                    className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>

            {/* Data, Horário e Duração */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Data</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-white px-2 py-2 text-xs text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Horário</label>
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-white px-2 py-2 text-xs text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Duração</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="rounded-xl border border-stone-200 bg-white px-2 py-2 text-xs text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  <option value={30}>30 min</option>
                  <option value={50}>50 min (Padrão)</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1h 30min</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
            </div>

            {/* Opções de Google Calendar */}
            {isGoogleConnected && (
              <div className="flex flex-col gap-2 rounded-xl border border-stone-200/80 bg-stone-50/80 p-3 dark:border-stone-700 dark:bg-stone-800/50">
                <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={withMeet}
                    onChange={(e) => setWithMeet(e.target.checked)}
                    className="rounded text-[#521D2A] focus:ring-0"
                  />
                  <span>Gerar link do <strong>Google Meet</strong> automaticamente</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={inviteLead}
                    onChange={(e) => setInviteLead(e.target.checked)}
                    className="rounded text-[#521D2A] focus:ring-0"
                  />
                  <span>Enviar convite para o e-mail do paciente</span>
                </label>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="mt-2 flex items-center justify-end gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSubmitCreate(false)}
                disabled={isPending}
                className="rounded-xl bg-[#521D2A] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#6b2737] disabled:opacity-50 dark:bg-[#722a3b]"
              >
                {isPending ? "Agendando..." : "Confirmar Agendamento"}
              </button>
            </div>
          </div>
        )}

        {/* MODO VISUALIZAÇÃO / DETALHES */}
        {data.mode === "view" && data.appointment && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#521D2A]/10 px-2.5 py-0.5 text-xs font-semibold text-[#521D2A] dark:bg-amber-400/10 dark:text-amber-300">
                  {data.appointment.source === "google" ? "Google Calendar" : "Sessão ORDO"}
                </span>
                <span className="text-xs text-stone-400">
                  {data.appointment.starts_at.toLocaleDateString("pt-BR")}
                </span>
              </div>
              <h3 className="mt-1 font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                {data.appointment.lead_name || data.appointment.title}
              </h3>
              {data.appointment.lead_name && data.appointment.title !== data.appointment.lead_name && (
                <p className="text-xs text-stone-500">{data.appointment.title}</p>
              )}
            </div>

            {/* Horário */}
            <div className="flex items-center gap-2 rounded-xl bg-stone-50 p-3 text-xs text-stone-700 dark:bg-stone-800/80 dark:text-stone-300">
              <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Horário:{" "}
                <strong>
                  {data.appointment.starts_at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </strong>
                {data.appointment.ends_at && (
                  <> até {data.appointment.ends_at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</>
                )}
              </span>
            </div>

            {/* Link do Google Meet */}
            {(data.appointment.meet_link || data.appointment.link) && (
              <div className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-800 dark:bg-emerald-950/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
                      🎥
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                        Google Meet (Sala de Vídeo)
                      </h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate max-w-[200px] sm:max-w-[260px]">
                        {data.appointment.meet_link || data.appointment.link}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const url = data.appointment?.meet_link || data.appointment?.link;
                        if (url) {
                          navigator.clipboard.writeText(url);
                          toast.success("Link do Google Meet copiado para a área de transferência!");
                        }
                      }}
                      className="rounded-lg border border-emerald-300 bg-white px-2.5 py-1.5 text-xs font-medium text-emerald-800 shadow-2xs hover:bg-emerald-50 dark:border-emerald-700 dark:bg-stone-900 dark:text-emerald-300"
                    >
                      📋 Copiar
                    </button>

                    <a
                      href={data.appointment.meet_link || data.appointment.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700"
                    >
                      <span>Entrar</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Alterar Status */}
            {data.appointment.source === "ordo" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                  Status do Atendimento:
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("scheduled")}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition-all ${
                      data.appointment.status === "scheduled"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300"
                    }`}
                  >
                    Agendada
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("completed")}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition-all ${
                      data.appointment.status === "completed"
                        ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300"
                    }`}
                  >
                    Realizada
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("no_show")}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition-all ${
                      data.appointment.status === "no_show"
                        ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300"
                    }`}
                  >
                    Não Compareceu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("cancelled")}
                    className={`rounded-xl border p-2 text-center text-xs font-medium transition-all ${
                      data.appointment.status === "cancelled"
                        ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300"
                    }`}
                  >
                    Cancelada
                  </button>
                </div>
              </div>
            )}

            {/* Acesso ao Lead 360 */}
            {data.appointment.lead_id && (
              <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                <p className="text-xs text-stone-500">Prontuário & Histórico Clínico:</p>
                <Link
                  href={`/pipeline/lead/${data.appointment.lead_id}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#521D2A] hover:underline dark:text-amber-300"
                >
                  Abrir Lead 360 no Pipeline →
                </Link>
              </div>
            )}

            {/* Botões do Rodapé */}
            <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
              {data.appointment.source === "ordo" ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-xs font-medium text-rose-600 hover:underline disabled:opacity-50"
                >
                  Excluir Agendamento
                </button>
              ) : (
                <span className="text-[11px] text-stone-400">Sincronizado via Google</span>
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
              >
                Concluído
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
