"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrdoSymbol } from "@/components/ordo-mark";

interface SidebarProps {
  isAdmin: boolean;
}

export function AppSidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();

  const mainNavigation = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/pipeline", label: "Pipeline", icon: "⚡" },
    { href: "/agenda", label: "Agenda", icon: "📅" },
    { href: "/conversas", label: "Conversas", icon: "💬" },
  ];

  const configNavigation = [
    { href: "/configuracoes/integracoes", label: "Integrações", icon: "🔗", adminOnly: true },
    { href: "/configuracoes/produtos", label: "Produtos", icon: "📦", adminOnly: true },
    { href: "/configuracoes/usuarios", label: "Equipe", icon: "👥", adminOnly: true },
    { href: "/configuracoes/workspace", label: "Workspace", icon: "🏢", adminOnly: true },
    { href: "/configuracoes/perfil", label: "Perfil", icon: "👤", adminOnly: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-20 py-5 bg-sidebar border-r border-sidebar-border/40 shrink-0 sticky top-0 h-screen z-30">
      {/* Topo: Símbolo ORDO */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/pipeline"
          className="flex size-11 items-center justify-center rounded-2xl bg-sidebar-primary/80 text-sidebar-foreground shadow-md transition-transform hover:scale-105"
          title="ORDO CRM"
        >
          <OrdoSymbol className="size-7" />
        </Link>

        {/* Menu Principal de Navegação (Formato Dock Flutuante) */}
        <nav className="flex flex-col items-center gap-2 rounded-3xl bg-sidebar-accent/30 p-2 border border-sidebar-border/30">
          {mainNavigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex size-10 items-center justify-center rounded-2xl text-base transition-all duration-150",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm scale-105"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-105",
                )}
                title={item.label}
              >
                <span>{item.icon}</span>

                {/* Tooltip lateral */}
                <span className="absolute left-14 hidden whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg group-hover:block z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Meio/Fim: Itens de Configuração e Integrações */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-sidebar-accent/20 p-2 border border-sidebar-border/20">
          {configNavigation
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex size-9 items-center justify-center rounded-xl text-sm transition-all duration-150",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs font-bold"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground hover:scale-105",
                  )}
                  title={item.label}
                >
                  <span>{item.icon}</span>

                  {/* Tooltip lateral */}
                  <span className="absolute left-14 hidden whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg group-hover:block z-50">
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </div>

        {/* Botão de Suporte / Ajuda no rodapé da barra lateral */}
        <div className="group relative">
          <a
            href="https://wa.me/5567999110001?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20ORDO%20CRM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full bg-sidebar-accent/50 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all hover:scale-105 border border-sidebar-border/30 text-sm"
            title="Suporte & Ajuda"
          >
            🎧
          </a>
          <span className="absolute left-14 bottom-1 hidden whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg group-hover:block z-50">
            Suporte WhatsApp ↗
          </span>
        </div>
      </div>
    </aside>
  );
}
