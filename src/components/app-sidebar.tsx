"use client";

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

  // Itens da barra lateral solicitados pelo usuário (incluindo Origens do Lead)
  const sidebarItems = [
    {
      href: "/conversas",
      label: "Conversas",
      icon: "💬",
      count: notifications.conversas,
      badgeColor: "bg-rose-600 text-white",
    },
    {
      href: "/agenda",
      label: "Agenda",
      icon: "📅",
      count: notifications.agenda,
      badgeColor: "bg-primary text-primary-foreground",
    },
    { href: "/formularios", label: "ORDO Forms", icon: "📝" },
    { href: "/agente-ia", label: "Agente de IA", icon: "🤖" },
    { href: "/contatos", label: "Lista de Contatos", icon: "👥" },
    { href: "/origens", label: "Origens do Lead", icon: "🌐" },
    { href: "/resultado", label: "Resultado Comercial", icon: "🏆" },
    { href: "/estatisticas", label: "Estatísticas & Relatórios", icon: "📈" },
  ];

  const bottomItems = [
    { href: "/ajuda", label: "Manual do Usuário & Ajuda", icon: "📖", adminOnly: false },
    { href: "/configuracoes/integracoes", label: "Integrações", icon: "🔗", adminOnly: true },
    { href: "/configuracoes/seguranca-lgpd", label: "Segurança & LGPD", icon: "🛡️", adminOnly: true },
    { href: "/configuracoes/workspace", label: "Configurações", icon: "⚙️", adminOnly: true },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-20 py-6 bg-sidebar border-r border-sidebar-border/40 shrink-0 sticky top-0 h-screen z-30 shadow-sm print:hidden">
      {/* Topo: Logo Símbolo ORDO */}
      <div className="flex flex-col items-center gap-7">
        <Link
          href="/pipeline"
          className="flex size-12 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-foreground shadow-md transition-transform hover:scale-105"
          title="ORDO CRM"
        >
          <OrdoSymbol className="size-7" />
        </Link>

        {/* Menu Principal da Barra Lateral */}
        <nav className="flex flex-col items-center gap-2.5 rounded-3xl bg-sidebar-accent/35 p-2 border border-sidebar-border/30 shadow-inner">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const badgeCount = item.count ?? 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex size-11 items-center justify-center rounded-2xl text-lg transition-all duration-150",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm scale-105 ring-1 ring-sidebar-border"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-105",
                )}
                title={item.label}
              >
                <span>{item.icon}</span>

                {/* Bolinha discreta de Notificação no Canto Superior Direito */}
                {badgeCount > 0 ? (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 flex min-w-4 h-4 items-center justify-center rounded-full px-1 text-[9px] font-bold shadow-xs animate-in zoom-in-50 duration-200",
                      item.badgeColor || "bg-primary text-primary-foreground",
                    )}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                ) : null}

                {/* Tooltip lateral flutuante */}
                <span className="absolute left-14 hidden whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xl group-hover:block z-50">
                  {item.label}
                  {badgeCount > 0 ? ` (${badgeCount})` : ""}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé da Barra Lateral: Configurações, Integrações e Suporte */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-sidebar-accent/25 p-2 border border-sidebar-border/20">
          {bottomItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex size-10 items-center justify-center rounded-xl text-base transition-all duration-150",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs font-bold"
                      : "text-sidebar-foreground/65 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground hover:scale-105",
                  )}
                  title={item.label}
                >
                  <span>{item.icon}</span>

                  {/* Tooltip lateral */}
                  <span className="absolute left-14 hidden whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xl group-hover:block z-50">
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </div>

        {/* Botão de Suporte WhatsApp */}
        <div className="group relative">
          <a
            href="https://wa.me/5567999110001?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20ORDO%20CRM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11 items-center justify-center rounded-full bg-sidebar-accent/60 text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all hover:scale-105 border border-sidebar-border/40 text-base shadow-xs"
            title="Suporte & Ajuda WhatsApp"
          >
            🎧
          </a>
          <span className="absolute left-14 bottom-2 hidden whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xl group-hover:block z-50">
            Suporte WhatsApp ↗
          </span>
        </div>
      </div>
    </aside>
  );
}
