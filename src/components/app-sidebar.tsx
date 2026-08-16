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
    { href: "/pipeline", label: "Pipeline Kanban", icon: "📋", desc: "Gestão e funil de pacientes" },
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

  // Botões principais fixos e centralizados na barra (Tamanho ergonômico e confortável)
  const fixedMainItems = [
    { href: "/pipeline", label: "Pipeline Kanban", icon: "📋" },
    { href: "/conversas", label: "Conversas (WhatsApp)", icon: "💬", count: notifications.conversas, badgeColor: "bg-rose-600 text-white" },
    { href: "/agenda", label: "Agenda & Meet", icon: "📅", count: notifications.agenda, badgeColor: "bg-primary text-primary-foreground" },
    { href: "/formularios", label: "ORDO Forms", icon: "📝" },
    { href: "/estatisticas", label: "Estatísticas & Relatórios", icon: "📈" },
  ];

  return (
    <>
      {/* Backdrop transparente escurecido quando algum menu estiver aberto */}
      {(appsMenuOpen || configMenuOpen) && (
        <div
          className="fixed inset-0 z-45 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => {
            setAppsMenuOpen(false);
            setConfigMenuOpen(false);
          }}
        />
      )}

      <aside className="hidden lg:flex flex-col items-center justify-between w-20 py-5 bg-[#291015] border-r border-[#521D2A]/80 shrink-0 sticky top-0 h-screen z-50 shadow-2xl select-none print:hidden">
        {/* ========================================================================= */}
        {/* TOPO: Símbolo Oficial ORDO com Abertura do Menu Completo                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center relative w-full" ref={appsMenuRef}>
          <button
            type="button"
            onClick={() => {
              setAppsMenuOpen(!appsMenuOpen);
              setConfigMenuOpen(false);
            }}
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl transition-all shadow-md group relative",
              appsMenuOpen
                ? "bg-[#B2966F] text-[#291015] scale-105 ring-2 ring-[#B2966F]/90 shadow-lg"
                : "bg-[#521D2A] text-white hover:scale-105 border border-[#B2966F]/40 hover:border-[#B2966F]"
            )}
            title="Clique para ver todos os módulos do ORDO"
          >
            <OrdoSymbol className={cn("size-7 transition-colors", appsMenuOpen ? "text-[#291015]" : "text-[#B2966F]")} />
            
            {/* Indicador de expansão */}
            <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#B2966F] text-[10px] font-bold text-[#291015] shadow-xs">
              {appsMenuOpen ? "✕" : "✦"}
            </span>
          </button>

          {/* DRAWER LATERAL: TODAS AS FUNCIONALIDADES (De ponta a ponta, sem cortes) */}
          {appsMenuOpen && (
            <div className="fixed left-20 top-0 bottom-0 h-screen w-84 bg-[#1E0B10] border-r-2 border-[#521D2A] p-5 shadow-2xl z-50 text-white animate-in fade-in slide-in-from-left duration-200 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                {/* Cabeçalho do Drawer */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#521D2A] text-[#B2966F] border border-[#B2966F]/30 text-sm shadow-inner">
                      🏛️
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-heading text-sm font-bold uppercase tracking-wider text-[#B2966F]">
                        Ecossistema ORDO
                      </span>
                      <span className="text-[11px] text-stone-400">Todos os Módulos Clínicos</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppsMenuOpen(false)}
                    className="flex size-8 items-center justify-center text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Lista de Módulos */}
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 kanban-scroll">
                  {allAppFeatures.map((f) => {
                    const isActive = pathname.startsWith(f.href);
                    return (
                      <Link
                        key={f.href}
                        href={f.href}
                        onClick={() => setAppsMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-2xl transition-all text-left group",
                          isActive
                            ? "bg-[#521D2A] text-white font-bold border border-[#B2966F]/50 shadow-md scale-[1.02]"
                            : "hover:bg-white/10 text-stone-200 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl shrink-0 p-1.5 rounded-xl bg-white/5 border border-white/5">{f.icon}</span>
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
                          <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            {f.count}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Rodapé do Drawer */}
              <div className="border-t border-white/10 pt-3 px-1 text-[11px] text-stone-400 flex items-center justify-between">
                <span>ORDO by Práxis Mentis</span>
                <span className="text-[#B2966F] font-semibold">v2.5</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CENTRO: Botões Principais Confortáveis e Centralizados Verticalmente       */}
        {/* ========================================================================= */}
        <nav className="flex flex-col items-center gap-3.5 my-auto py-2">
          {fixedMainItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const badgeCount = item.count ?? 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex size-12 items-center justify-center rounded-2xl text-xl transition-all duration-150 shadow-sm",
                  isActive
                    ? "bg-[#521D2A] text-white shadow-md scale-105 ring-2 ring-[#B2966F]/60 border border-[#B2966F]"
                    : "text-stone-300 bg-white/5 hover:bg-white/15 hover:text-white hover:scale-105 border border-white/5"
                )}
                title={item.label}
              >
                <span>{item.icon}</span>

                {/* Badge de notificação destacado */}
                {badgeCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 flex min-w-4 h-4 items-center justify-center rounded-full px-1 text-[9px] font-bold shadow-md ring-1 ring-black/40",
                      item.badgeColor || "bg-primary text-primary-foreground"
                    )}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}

                {/* Tooltip lateral flutuante */}
                <span className="absolute left-16 hidden whitespace-nowrap rounded-xl bg-[#521D2A] px-3 py-1.5 text-xs font-semibold text-white shadow-2xl group-hover:block z-50 border border-[#B2966F]/50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ========================================================================= */}
        {/* RODAPÉ: Engrenagem de Configurações & Botão de Suporte WhatsApp            */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center gap-3 relative w-full pt-2 border-t border-white/10" ref={configMenuRef}>
          {/* DRAWER LATERAL: CONFIGURAÇÕES & ECOSSISTEMA */}
          {configMenuOpen && (
            <div className="fixed left-20 top-0 bottom-0 h-screen w-84 bg-[#1E0B10] border-r-2 border-[#521D2A] p-5 shadow-2xl z-50 text-white animate-in fade-in slide-in-from-left duration-200 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#521D2A] text-[#B2966F] border border-[#B2966F]/30 text-sm shadow-inner">
                      ⚙️
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-heading text-sm font-bold uppercase tracking-wider text-[#B2966F]">
                        Configurações & Gestão
                      </span>
                      <span className="text-[11px] text-stone-400">Preferências do Consultório</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfigMenuOpen(false)}
                    className="flex size-8 items-center justify-center text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 kanban-scroll">
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
                            "flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left group",
                            isActive
                              ? "bg-[#521D2A] text-white font-bold border border-[#B2966F]/50 shadow-md scale-[1.02]"
                              : "hover:bg-white/10 text-stone-200 hover:text-white"
                          )}
                        >
                          <span className="text-xl shrink-0 p-1.5 rounded-xl bg-white/5 border border-white/5">{item.icon}</span>
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

              <div className="border-t border-white/10 pt-3 px-1 text-[11px] text-stone-400 flex items-center justify-between">
                <span>ORDO CRM v2.5</span>
                <span className="text-emerald-400 font-semibold">● Ativo</span>
              </div>
            </div>
          )}

          {/* Botão da Engrenagem */}
          <button
            type="button"
            onClick={() => {
              setConfigMenuOpen(!configMenuOpen);
              setAppsMenuOpen(false);
            }}
            className={cn(
              "group relative flex size-11 items-center justify-center rounded-2xl text-lg transition-all duration-150 shadow-sm",
              configMenuOpen
                ? "bg-[#B2966F] text-[#291015] scale-105 shadow-md ring-2 ring-[#B2966F]/80"
                : "text-stone-300 bg-white/5 hover:bg-white/15 hover:text-white hover:scale-105 border border-white/5"
            )}
            title="Configurações & Ecossistema"
          >
            <span>⚙️</span>
            <span className="absolute left-16 hidden whitespace-nowrap rounded-xl bg-[#521D2A] px-3 py-1.5 text-xs font-semibold text-white shadow-2xl group-hover:block z-50 border border-[#B2966F]/50">
              Configurações
            </span>
          </button>

          {/* Botão de Suporte WhatsApp (Compacto, elegante e 100% contido) */}
          <a
            href="https://wa.me/5567999110001?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20ORDO%20CRM"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex size-11 items-center justify-center rounded-2xl bg-white/10 text-stone-300 hover:bg-[#521D2A] hover:text-white transition-all hover:scale-105 border border-white/10 text-base shadow-sm"
            title="Suporte & Ajuda WhatsApp"
          >
            <span>🎧</span>
            <span className="absolute left-16 bottom-0 hidden whitespace-nowrap rounded-xl bg-[#521D2A] px-3 py-1.5 text-xs font-semibold text-white shadow-2xl group-hover:block z-50 border border-[#B2966F]/50">
              Suporte WhatsApp ↗
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}
