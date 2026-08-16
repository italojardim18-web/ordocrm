"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface SessaoItem {
  id: string;
  title: string;
  starts_at: string;
  ends_at?: string | null;
  status: string;
  lead_id?: string | null;
  lead_name?: string | null;
  source?: "ordo" | "google";
}

interface AgendaViewProps {
  sessoes: SessaoItem[];
  eventosGoogle: Array<{
    id: string;
    titulo: string;
    inicio: string | null;
    fim: string | null;
    diaInteiro: boolean;
  }>;
  workspaceTimezone: string;
  isGoogleConnected: boolean;
}

const DIAS_SEMANA_ABREV = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
const DIAS_SEMANA_COMPLETO = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  scheduled: { label: "Agendada", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  completed: { label: "Realizada", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  cancelled: { label: "Cancelada", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
  no_show: { label: "Não compareceu", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
};

export function AgendaView({
  sessoes,
  eventosGoogle,
  workspaceTimezone,
  isGoogleConnected,
}: AgendaViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Modo de visualização: "semana" (default), "mes", "dia"
  const [viewMode, setViewMode] = useState<"mes" | "semana" | "dia">(
    (searchParams.get("view") as "mes" | "semana" | "dia") || "semana"
  );

  // Data de referência
  const initialDate = useMemo(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const parsed = new Date(`${dataParam}T12:00:00`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [searchParams]);

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll automático inicial para o horário comercial (~08:00)
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Cada hora tem aproximadamente 64px, 8h = ~512px
      scrollContainerRef.current.scrollTop = 480;
    }
  }, [viewMode]);

  // Auxiliares de fuso horário
  const formatTimezoneHour = (date: Date): number => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: workspaceTimezone,
      hour: "numeric",
      hour12: false,
    });
    return parseInt(formatter.format(date), 10);
  };

  const formatTimezoneDateStr = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: workspaceTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date); // dd/mm/yyyy
  };

  const formatTimezoneTime = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", {
      timeZone: workspaceTimezone,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obter início da semana (Domingo)
  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay(); // 0 = Domingo
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  // Lista dos 7 dias da semana selecionada
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  }, [startOfWeek]);

  // Lista de todos os compromissos unificados (ORDO + Google)
  const allEvents = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      starts_at: Date;
      ends_at?: Date | null;
      status: string;
      lead_id?: string | null;
      lead_name?: string | null;
      source: "ordo" | "google";
      diaInteiro?: boolean;
    }> = [];

    // Sessões do CRM
    sessoes.forEach((s) => {
      list.push({
        id: s.id,
        title: s.title,
        starts_at: new Date(s.starts_at),
        ends_at: s.ends_at ? new Date(s.ends_at) : null,
        status: s.status,
        lead_id: s.lead_id,
        lead_name: s.lead_name,
        source: "ordo",
      });
    });

    const titulosOrdo = new Set(sessoes.map((s) => s.title));

    // Eventos do Google (sem duplicar os do ORDO)
    eventosGoogle.forEach((e) => {
      if (e.inicio && !titulosOrdo.has(e.titulo)) {
        list.push({
          id: e.id,
          title: e.titulo,
          starts_at: new Date(e.inicio),
          ends_at: e.fim ? new Date(e.fim) : null,
          status: "google",
          source: "google",
          diaInteiro: e.diaInteiro,
        });
      }
    });

    return list;
  }, [sessoes, eventosGoogle]);

  // Navegação
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === "dia") {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === "semana") {
      d.setDate(d.getDate() - 7);
    } else if (viewMode === "mes") {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
    updateUrl(d, viewMode);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === "dia") {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === "semana") {
      d.setDate(d.getDate() + 7);
    } else if (viewMode === "mes") {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
    updateUrl(d, viewMode);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    updateUrl(today, viewMode);
  };

  const handleViewChange = (mode: "mes" | "semana" | "dia") => {
    setViewMode(mode);
    updateUrl(currentDate, mode);
  };

  const updateUrl = (date: Date, mode: "mes" | "semana" | "dia") => {
    const iso = date.toISOString().slice(0, 10);
    router.push(`/agenda?data=${iso}&view=${mode}`);
  };

  // Texto do cabeçalho central
  const headerPeriodText = useMemo(() => {
    if (viewMode === "dia") {
      const diaSem = DIAS_SEMANA_COMPLETO[currentDate.getDay()];
      const diaNum = currentDate.getDate();
      const mesNome = MESES[currentDate.getMonth()];
      const ano = currentDate.getFullYear();
      return `${diaSem}, ${diaNum} de ${mesNome} de ${ano}`;
    }

    if (viewMode === "semana") {
      const fimSemana = new Date(startOfWeek);
      fimSemana.setDate(fimSemana.getDate() + 6);

      const d1 = startOfWeek.getDate();
      const d2 = fimSemana.getDate();
      const m1 = MESES[startOfWeek.getMonth()].slice(0, 3);
      const m2 = MESES[fimSemana.getMonth()].slice(0, 3);
      const ano = fimSemana.getFullYear();

      if (startOfWeek.getMonth() === fimSemana.getMonth()) {
        return `${d1} – ${d2} de ${m1}. de ${ano}`;
      }
      return `${d1} de ${m1}. – ${d2} de ${m2}. de ${ano}`;
    }

    // Mês
    const mesNome = MESES[currentDate.getMonth()];
    const mesCap = mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
    return `${mesCap} de ${currentDate.getFullYear()}`;
  }, [viewMode, currentDate, startOfWeek]);

  // Checar se é hoje
  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Lista de horas do dia (00h a 23h)
  const hoursOfDay = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Controles Superior Estilo ORDO */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/80">
        {/* Navegação < > e Hoje */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-700 dark:bg-stone-800/80">
            <button
              onClick={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-white hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-700"
              title="Período anterior"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-white hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-700"
              title="Próximo período"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleToday}
            className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-white dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            hoje
          </button>
        </div>

        {/* Período Atual em Destaque */}
        <div className="text-center">
          <h2 className="font-serif text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100 md:text-xl">
            {headerPeriodText}
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Fuso horário: <span className="font-medium text-stone-700 dark:text-stone-300">{workspaceTimezone}</span>
          </p>
        </div>

        {/* Seletor de Modo: mês | semana | dia */}
        <div className="inline-flex items-center rounded-xl border border-stone-200 bg-stone-100/80 p-1 dark:border-stone-700 dark:bg-stone-800/80">
          <button
            onClick={() => handleViewChange("mes")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === "mes"
                ? "bg-[#521D2A] text-white shadow-sm dark:bg-[#722a3b]"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            mês
          </button>
          <button
            onClick={() => handleViewChange("semana")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === "semana"
                ? "bg-[#521D2A] text-white shadow-sm dark:bg-[#722a3b]"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            semana
          </button>
          <button
            onClick={() => handleViewChange("dia")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === "dia"
                ? "bg-[#521D2A] text-white shadow-sm dark:bg-[#722a3b]"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            dia
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISUALIZAÇÃO: SEMANA COMPLETA (GRADE HORÁRIA 24H)                     */}
      {/* ========================================================================= */}
      {viewMode === "semana" && (
        <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
          {/* Cabeçalho dos 7 Dias */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-stone-200 bg-stone-50/90 dark:border-stone-800 dark:bg-stone-900/90">
            <div className="border-r border-stone-200/80 p-2 text-center text-[11px] font-semibold text-stone-400 dark:border-stone-800">
              GMT
            </div>
            {weekDays.map((dia, idx) => {
              const ehHoje = isToday(dia);
              const diaNum = dia.getDate().toString().padStart(2, "0");
              const mesNum = (dia.getMonth() + 1).toString().padStart(2, "0");

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentDate(dia);
                    setViewMode("dia");
                    updateUrl(dia, "dia");
                  }}
                  className={`cursor-pointer border-r border-stone-200/80 p-2.5 text-center transition-colors last:border-r-0 hover:bg-stone-100/60 dark:border-stone-800 dark:hover:bg-stone-800/60 ${
                    ehHoje ? "bg-amber-50/40 dark:bg-amber-950/20" : ""
                  }`}
                >
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {DIAS_SEMANA_ABREV[dia.getDay()]} {diaNum}/{mesNum}
                  </p>
                  {ehHoje && (
                    <span className="mt-0.5 inline-block rounded-full bg-[#521D2A] px-1.5 py-0.2 text-[9px] font-medium text-white">
                      Hoje
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grade com Scroll Vertical de 24 Horas */}
          <div
            ref={scrollContainerRef}
            className="relative grid max-h-[720px] grid-cols-[60px_repeat(7,1fr)] overflow-y-auto"
          >
            {/* Linhas de Horas */}
            {hoursOfDay.map((hour) => {
              const hourStr = hour.toString().padStart(2, "0");

              return (
                <div key={hour} className="contents">
                  {/* Coluna da Hora à Esquerda (00, 01 ... 23) */}
                  <div className="sticky left-0 z-10 flex items-start justify-center border-b border-r border-stone-100 bg-stone-50/95 py-2 text-xs font-semibold text-stone-500 dark:border-stone-800/80 dark:bg-stone-900/95 dark:text-stone-400">
                    {hourStr}:00
                  </div>

                  {/* 7 Células de Dias para esta Hora */}
                  {weekDays.map((dia, diaIdx) => {
                    const diaStr = formatTimezoneDateStr(dia);
                    const ehHoje = isToday(dia);

                    // Filtra eventos para este dia e esta hora no fuso configurado
                    const eventosNoSlot = allEvents.filter((ev) => {
                      const evDiaStr = formatTimezoneDateStr(ev.starts_at);
                      if (evDiaStr !== diaStr) return false;
                      const evHour = formatTimezoneHour(ev.starts_at);
                      return evHour === hour;
                    });

                    return (
                      <div
                        key={diaIdx}
                        className={`group relative min-h-[58px] border-b border-r border-stone-100/90 p-1 transition-colors last:border-r-0 hover:bg-stone-50/50 dark:border-stone-800/60 dark:hover:bg-stone-900/40 ${
                          ehHoje ? "bg-amber-50/15 dark:bg-amber-950/10" : ""
                        }`}
                      >
                        {eventosNoSlot.map((ev) => {
                          const horaInicio = formatTimezoneTime(ev.starts_at.toISOString());
                          const statusInfo = STATUS_LABELS[ev.status] || {
                            label: ev.status,
                            bg: "bg-stone-100",
                            text: "text-stone-700",
                            border: "border-stone-200",
                          };

                          if (ev.source === "ordo") {
                            return (
                              <Link
                                key={ev.id}
                                href={ev.lead_id ? `/pipeline/lead/${ev.lead_id}` : "#"}
                                className={`mb-1 block rounded-lg border p-1.5 text-xs shadow-xs transition-transform hover:scale-[1.02] ${statusInfo.bg} ${statusInfo.border}`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                                    {horaInicio}
                                  </span>
                                  <span className={`text-[9px] font-medium ${statusInfo.text}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="truncate font-medium text-stone-800 dark:text-stone-200">
                                  {ev.lead_name || ev.title}
                                </p>
                                {ev.lead_name && ev.title !== ev.lead_name && (
                                  <p className="truncate text-[10px] text-stone-500 dark:text-stone-400">
                                    {ev.title}
                                  </p>
                                )}
                              </Link>
                            );
                          }

                          // Evento Google
                          return (
                            <div
                              key={ev.id}
                              className="mb-1 rounded-lg border border-dashed border-stone-300 bg-stone-50/90 p-1.5 text-xs dark:border-stone-700 dark:bg-stone-800/70"
                              title="Google Calendar"
                            >
                              <span className="font-semibold text-stone-700 dark:text-stone-300">
                                {horaInicio}
                              </span>
                              <p className="truncate text-stone-600 dark:text-stone-400">
                                {ev.title}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VISUALIZAÇÃO: DIA COMPLETO (DETALHADA)                                 */}
      {/* ========================================================================= */}
      {viewMode === "dia" && (
        <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
          <div className="border-b border-stone-200 bg-stone-50/90 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/90">
            <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
              {DIAS_SEMANA_COMPLETO[currentDate.getDay()]}, {currentDate.getDate()} de {MESES[currentDate.getMonth()]}
            </h3>
            <p className="text-xs text-stone-500">
              Grade horária de atendimentos e compromissos do dia
            </p>
          </div>

          <div
            ref={scrollContainerRef}
            className="grid max-h-[720px] grid-cols-[80px_1fr] overflow-y-auto"
          >
            {hoursOfDay.map((hour) => {
              const hourStr = hour.toString().padStart(2, "0");
              const diaStr = formatTimezoneDateStr(currentDate);

              const eventosNoSlot = allEvents.filter((ev) => {
                const evDiaStr = formatTimezoneDateStr(ev.starts_at);
                if (evDiaStr !== diaStr) return false;
                const evHour = formatTimezoneHour(ev.starts_at);
                return evHour === hour;
              });

              return (
                <div key={hour} className="contents">
                  <div className="sticky left-0 flex items-start justify-center border-b border-r border-stone-100 bg-stone-50/95 py-3 text-xs font-semibold text-stone-500 dark:border-stone-800/80 dark:bg-stone-900/95 dark:text-stone-400">
                    {hourStr}:00
                  </div>

                  <div className="min-h-[70px] border-b border-stone-100 p-2 hover:bg-stone-50/40 dark:border-stone-800/80 dark:hover:bg-stone-900/30">
                    {eventosNoSlot.length === 0 ? (
                      <div className="h-full" />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {eventosNoSlot.map((ev) => {
                          const horaInicio = formatTimezoneTime(ev.starts_at.toISOString());
                          const statusInfo = STATUS_LABELS[ev.status] || {
                            label: ev.status,
                            bg: "bg-stone-100",
                            text: "text-stone-700",
                            border: "border-stone-200",
                          };

                          if (ev.source === "ordo") {
                            return (
                              <Link
                                key={ev.id}
                                href={ev.lead_id ? `/pipeline/lead/${ev.lead_id}` : "#"}
                                className={`flex items-center justify-between rounded-xl border p-3 shadow-xs transition-all hover:scale-[1.01] ${statusInfo.bg} ${statusInfo.border}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 font-serif text-sm font-bold text-[#521D2A] shadow-xs dark:bg-stone-800 dark:text-amber-300">
                                    {horaInicio}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-stone-900 dark:text-stone-100">
                                      {ev.lead_name || ev.title}
                                    </h4>
                                    <p className="text-xs text-stone-500 dark:text-stone-400">
                                      {ev.title}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.text} bg-white/80 dark:bg-stone-900`}>
                                    {statusInfo.label}
                                  </span>
                                  <span className="text-xs text-stone-400">Abrir Lead →</span>
                                </div>
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={ev.id}
                              className="flex items-center justify-between rounded-xl border border-dashed border-stone-300 bg-stone-50/90 p-3 text-xs dark:border-stone-700 dark:bg-stone-800/80"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-700 dark:text-stone-300">
                                  {horaInicio}
                                </span>
                                <span className="text-stone-600 dark:text-stone-300">
                                  {ev.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-400">Google Calendar</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VISUALIZAÇÃO: MÊS (GRADE CALENDÁRIO MENSAL)                            */}
      {/* ========================================================================= */}
      {viewMode === "mes" && (
        <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
          {/* Cabeçalho dos Dias */}
          <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/90 text-center dark:border-stone-800 dark:bg-stone-900/90">
            {DIAS_SEMANA_ABREV.map((d, i) => (
              <div key={i} className="py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                {d}
              </div>
            ))}
          </div>

          {/* Matriz dos Dias do Mês */}
          <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 dark:divide-stone-800/60">
            {(() => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();

              const firstDayOfMonth = new Date(year, month, 1);
              const lastDayOfMonth = new Date(year, month + 1, 0);

              const startOffset = firstDayOfMonth.getDay(); // 0 = Domingo
              const totalDays = lastDayOfMonth.getDate();

              // Dias do mês anterior para preencher
              const prevMonthDays = Array.from({ length: startOffset }, (_, i) => {
                const d = new Date(year, month, 0 - (startOffset - 1 - i));
                return { date: d, isCurrentMonth: false };
              });

              // Dias do mês atual
              const currentMonthDays = Array.from({ length: totalDays }, (_, i) => {
                const d = new Date(year, month, i + 1);
                return { date: d, isCurrentMonth: true };
              });

              // Completar até fechar semanas completas (múltiplo de 7)
              const remaining = (7 - ((prevMonthDays.length + currentMonthDays.length) % 7)) % 7;
              const nextMonthDays = Array.from({ length: remaining }, (_, i) => {
                const d = new Date(year, month + 1, i + 1);
                return { date: d, isCurrentMonth: false };
              });

              const allCalendarCells = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

              return allCalendarCells.map((cell, idx) => {
                const diaStr = formatTimezoneDateStr(cell.date);
                const ehHoje = isToday(cell.date);

                const eventosDoDia = allEvents.filter(
                  (ev) => formatTimezoneDateStr(ev.starts_at) === diaStr
                );

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentDate(cell.date);
                      setViewMode("dia");
                      updateUrl(cell.date, "dia");
                    }}
                    className={`group flex min-h-[110px] cursor-pointer flex-col p-2 transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-900/60 ${
                      !cell.isCurrentMonth
                        ? "bg-stone-50/40 text-stone-400 dark:bg-stone-950/40 dark:text-stone-600"
                        : "bg-white text-stone-800 dark:bg-stone-950 dark:text-stone-200"
                    } ${ehHoje ? "bg-amber-50/30 dark:bg-amber-950/20" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          ehHoje
                            ? "bg-[#521D2A] text-white"
                            : "text-stone-700 dark:text-stone-300"
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>
                      {eventosDoDia.length > 0 && (
                        <span className="text-[10px] font-medium text-stone-400">
                          {eventosDoDia.length} {eventosDoDia.length === 1 ? "sessão" : "sessões"}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-1 flex-col gap-1 overflow-hidden">
                      {eventosDoDia.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className="truncate rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                        >
                          <span className="font-semibold">{formatTimezoneTime(ev.starts_at.toISOString())}</span>{" "}
                          {ev.lead_name || ev.title}
                        </div>
                      ))}
                      {eventosDoDia.length > 3 && (
                        <span className="text-[9px] font-medium text-stone-500">
                          +{eventosDoDia.length - 3} mais...
                        </span>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
