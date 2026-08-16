"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrdoSymbol } from "@/components/ordo-mark";

interface SidebarProps {
  isAdmin: boolean;
  notifications?: {
    conversas: number;
    pipeline: number;
    agenda: number;
    contatos: number;
  };
}

export function AppSidebar({
  isAdmin,
  notifications = { conversas: 0, pipeline: 0, agenda: 0, contatos: 0 },
}: SidebarProps) {
  const pathname = usePathname();

  // Estados dos menus expansíveis flutuantes
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const [configMenuOpen, setConfigMenuOpen] = useState(false);

  const appsMenuRef = useRef<HTMLDivElement>(null);
  const configMenuRef = useRef<HTMLDivElement>(null);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appsMenuRef.current && !appsMenuRef.current.contains(e.target as Node)) {
        setAppsMenuOpen(false);
      }
      if (configMenuRef.current && !configMenuRef.current.contains(e.target as Node)) {
        setConfigMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha menus ao trocar de rota
  useEffect(() => {
    setAppsMenuOpen(false);
    setConfigMenuOpen(false);
  }, [pathname]);

  // Todas as funcionalidades do sistema abertas pelo ícone do ORDO
  const allAppFeatures = [
    { href: "/pipeline", label: "Pipeline Kanban", icon: "📋", desc: "Gestão do funil de pacientes" },
    { href: "/conversas", label: "Conversas (WhatsApp)", icon: "💬", desc: "Central de atendimento multi-linhas", count: notifications.conversas },
    { href: "/agenda", label: "Agenda & Google Meet", icon: "📅", desc: "Sessões e videoconferências", count: notifications.agenda },
    { href: "/formularios", label: "ORDO Forms", icon: "📝", desc: "Triagens e anamneses públicas" },
    { href: "/agente-ia", label: "Agente de IA", icon: "🤖", desc: "Assistente inteligente clínico" },
    { href: "/contatos", label: "Lista de Contatos", icon: "👥", desc: "Base central de pacientes e leads" },
    { href: "/origens", label: "Origens do Lead", icon: "🌐", desc: "Canais de aquisição e tráfego" },
    { href: "/resultado", label: "Resultado Comercial", icon: "🏆", desc: "Conversões e faturamento" },
    { href: "/estatisticas", label: "Estatísticas & Relatórios", icon: "📈", desc: "Análise analítica e metas" },
  ];

  // Itens de Configuração e Ecossistema abertos pela Engrenagem
  const configFeatures = [
    { href: "/configuracoes/seguranca-lgpd", label: "Segurança & LGPD", icon: "🛡️", desc: "Sigilo, auditoria e criptografia", adminOnly: true },
    { href: "/configuracoes/integracoes", label: "Integrações", icon: "🔗", desc: "Google Calendar, Meet e WhatsApp", adminOnly: true },
    { href: "/ajuda", label: "Manual do Usuário & Ajuda", icon: "📖", desc: "Guias completos do sistema", adminOnly: false },
    { href: "/planos", label: "Tabela de Planos & Preços", icon: "💎", desc: "Módulos e precificação oficial", adminOnly: false },
    { href: "/ecossistema", label: "Página do Ecossistema (MKT)", icon: "🏛️", desc: "Apresentação e vendas", adminOnly: false },
    { href: "/configuracoes/workspace", label: "Configurações Gerais", icon: "⚙️", desc: "Membros, equipe e dados clínicos", adminOnly: true },
  ];

  // Atalhos rápidos fixos na barra lateral minimizada (apenas os 3 essenciais)
  const quickItems = [
    { href: "/pipeline", label: "Pipeline", icon: "📋" },
    { href: "/conversas", label: "Conversas", icon: "💬", count: notifications.conversas, badgeColor: "bg-rose-600 text-white" },
    { href: "/agenda", label: "Agenda", icon: "📅", count: notifications.agenda, badgeColor: "bg-primary text-primary-foreground" },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-16 py-4 bg-[#291015] border-r border-[#521D2A] shrink-0 sticky top-0 h-screen z-30 shadow-xl select-none print:hidden">
      {/* TOPO: Logo ORDO (ao clicar abre todas as funcionalidades) */}
      <div className="flex flex-col items-center gap-5 relative w-full" ref={appsMenuRef}>
        <button
          type="button"
          onClick={() => {
            setAppsMenuOpen(!appsMenuOpen);
            setConfigMenuOpen(false);
          }}
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl transition-all shadow-md group relative",
            appsMenuOpen
              ? "bg-[#B2966F] text-[#291015] scale-105 ring-2 ring-[#B2966F]/80"
              : "bg-[#521D2A] text-white hover:scale-105 border border-[#B2966F]/40"
          )}
          title="Abrir Todas as Funcionalidades do ORDO"
        >
          <OrdoSymbol className={cn("size-6 transition-colors", appsMenuOpen ? "text-[#291015]" : "text-[#B2966F]")} />
          
          {/* Indicador de expansão */}
          <span className="absolute -bottom-1 -right-1 size-3.5 bg-[#B2966F] text-[#291015] rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs">
            {appsMenuOpen ? "✕" : "▼"}
          </span>
        </button>

        {/* POPOVER / MENU FLUTUANTE EXPANSÍVEL: TODAS AS FUNCIONALIDADES */}
        {appsMenuOpen && (
          <div className="absolute left-16 top-0 w-72 rounded-3xl bg-[#1E0B10]/95 backdrop-blur-xl border-2 border-[#521D2A] p-3 shadow-2xl z-50 text-white animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 px-2.5 pb-2.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏛️</span>
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#B2966F]">
                  Módulos do Sistema
                </span>
              </div>
              <span className="text-[10px] text-stone-400">9 Recursos</span>
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-[75vh] overflow-y-auto pr-1 kanban-scroll">
              {allAppFeatures.map((f) => {
                const isActive = pathname.startsWith(f.href);
                return (
                  <Link
                    key={f.href}
                    href={f.href}
                    onClick={() => setAppsMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-xl transition-all text-left group",
                      isActive
                        ? "bg-[#521D2A] text-white font-bold border border-[#B2966F]/40 shadow-xs"
                        : "hover:bg-white/10 text-stone-200 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{f.icon}</span>
                      <div className="flex flex-col min-w-0 truncate">
                        <span className="text-xs font-semibold truncate leading-tight group-hover:text-[#B2966F] transition-colors">
                          {f.label}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate leading-tight mt-0.5">
                          {f.desc}
                        </span>
                      </div>
                    </div>
                    {f.count && f.count > 0 ? (
                      <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-xs">
                        {f.count}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ATALHOS RÁPIDOS PRINCIPAIS (Super Compactos) */}
        <nav className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-1.5 border border-white/10">
          {quickItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const badgeCount = item.count ?? 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex size-9 items-center justify-center rounded-xl text-base transition-all duration-150",
                  isActive
                    ? "bg-[#521D2A] text-white shadow-xs scale-105 border border-[#B2966F]/50"
                    : "text-stone-300 hover:bg-white/10 hover:text-white hover:scale-105"
                )}
                title={item.label}
              >
                <span>{item.icon}</span>

                {badgeCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 flex min-w-3.5 h-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold shadow-xs",
                      item.badgeColor || "bg-primary text-primary-foreground"
                    )}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}

                {/* Tooltip lateral */}
                <span className="absolute left-12 hidden whitespace-nowrap rounded-xl bg-[#521D2A] px-2.5 py-1 text-xs font-semibold text-white shadow-xl group-hover:block z-50 border border-[#B2966F]/40">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* RODAPÉ DA BARRA LATERAL: Engrenagem de Configurações + Suporte WhatsApp */}
      <div className="flex flex-col items-center gap-2 relative w-full" ref={configMenuRef}>
        {/* POPOVER / MENU FLUTUANTE EXPANSÍVEL: CONFIGURAÇÕES & ECOSSISTEMA */}
        {configMenuOpen && (
          <div className="absolute left-16 bottom-2 w-72 rounded-3xl bg-[#1E0B10]/95 backdrop-blur-xl border-2 border-[#521D2A] p-3 shadow-2xl z-50 text-white animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 px-2.5 pb-2.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚙️</span>
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#B2966F]">
                  Configurações & Gestão
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {configFeatures
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setConfigMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 p-2 rounded-xl transition-all text-left group",
                        isActive
                          ? "bg-[#521D2A] text-white font-bold border border-[#B2966F]/40 shadow-xs"
                          : "hover:bg-white/10 text-stone-200 hover:text-white"
                      )}
                    >
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div className="flex flex-col min-w-0 truncate">
                        <span className="text-xs font-semibold truncate leading-tight group-hover:text-[#B2966F] transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate leading-tight mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {/* Botão da Engrenagem que abre o menu inferior */}
        <button
          type="button"
          onClick={() => {
            setConfigMenuOpen(!configMenuOpen);
            setAppsMenuOpen(false);
          }}
          className={cn(
            "group relative flex size-9 items-center justify-center rounded-xl text-base transition-all duration-150",
            configMenuOpen
              ? "bg-[#B2966F] text-[#291015] scale-105 shadow-md"
              : "text-stone-300 hover:bg-white/10 hover:text-white hover:scale-105"
          )}
          title="Configurações & Ecossistema"
        >
          <span>⚙️</span>
          <span className="absolute left-12 hidden whitespace-nowrap rounded-xl bg-[#521D2A] px-2.5 py-1 text-xs font-semibold text-white shadow-xl group-hover:block z-50 border border-[#B2966F]/40">
            Configurações
          </span>
        </button>

        {/* Botão de Suporte WhatsApp (Compacto e contido) */}
        <a
          href="https://wa.me/5567999110001?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20ORDO%20CRM"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex size-9 items-center justify-center rounded-full bg-white/10 text-stone-300 hover:bg-[#521D2A] hover:text-white transition-all hover:scale-105 border border-white/10 text-sm shadow-xs"
          title="Suporte WhatsApp"
        >
          <span>🎧</span>
          <span className="absolute left-12 bottom-0 hidden whitespace-nowrap rounded-xl bg-[#521D2A] px-2.5 py-1 text-xs font-semibold text-white shadow-xl group-hover:block z-50 border border-[#B2966F]/40">
            Suporte WhatsApp ↗
          </span>
        </a>
      </div>
    </aside>
  );
}
