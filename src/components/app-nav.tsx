"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(app)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { OrdoSymbol } from "@/components/ordo-mark";
import { NavChannelSelector, type ChannelItem } from "./nav-channel-selector";

const TOP_LINKS = [
  { href: "/pipeline", label: "⚡ Pipeline" },
  { href: "/dashboard", label: "📊 Dashboard" },
];

export function AppNav({
  workspaceName,
  userName,
  userEmail,
  isAdmin,
  channels = [],
}: {
  workspaceName: string;
  userName: string | null;
  userEmail: string;
  isAdmin: boolean;
  channels?: ChannelItem[];
}) {
  const pathname = usePathname();

  return (
    <header className="bg-background/90 backdrop-blur-md text-foreground sticky top-0 z-40 py-2.5 px-3 sm:px-6 border-b border-border/50 shadow-2xs transition-colors print:hidden">
      <div className="w-full flex h-13 items-center justify-between gap-2 sm:gap-4">
        {/* Logo ORDO Ampliado e Destacado à Esquerda */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/pipeline"
            className="flex shrink-0 items-center gap-2 sm:gap-2.5 rounded-2xl p-1 transition-transform hover:scale-102 group"
          >
            <OrdoSymbol className="size-7 sm:size-8 text-primary transition-transform group-hover:scale-105" title="ORDO" />
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-baseline gap-1 sm:gap-1.5 leading-none">
                <span className="font-heading text-xl sm:text-2xl tracking-[0.20em] sm:tracking-[0.22em] font-bold text-primary">
                  ORDO
                </span>
                <span className="font-heading text-[10px] sm:text-xs tracking-[0.10em] sm:tracking-[0.14em] font-semibold text-primary/75">
                  CRM
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-wider text-muted-foreground font-sans mt-0.5 font-medium text-center w-full">
                by Práxis mentis
              </span>
            </div>
          </Link>

          <span aria-hidden className="hidden md:inline-block h-5 w-px bg-border/80" />

          {/* Nome do Workspace */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-card px-3 py-1 border border-border/80 text-xs font-medium text-foreground shadow-xs">
            <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
            <span className="truncate max-w-28 xl:max-w-44">{workspaceName}</span>
          </div>
        </div>

        {/* Botões Flutuantes Centrais na cor Burgundy */}
        <nav
          aria-label="Navegação superior"
          className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-card/90 backdrop-blur-md p-1 border border-border/80 shadow-xs shrink-0"
        >
          {TOP_LINKS.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-150 shadow-2xs whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-primary hover:bg-primary/10",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Lado Direito: Seletor de Linha WhatsApp + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Seletor de Linha WhatsApp em Pílula Flutuante Burgundy */}
          <div className="flex items-center">
            <NavChannelSelector channels={channels} />
          </div>

          {/* Avatar do Usuário com Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu do usuário"
                className="rounded-full bg-card border border-border/80 shadow-xs hover:bg-muted text-primary transition-transform hover:scale-105 size-9 sm:size-10"
              >
                <Avatar className="size-7 sm:size-8">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground font-bold">
                    {initials(userName || userEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-border bg-card">
              <DropdownMenuLabel className="flex flex-col px-3 py-2">
                <span className="font-bold text-sm text-foreground">{userName || "Sem nome"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                <Link href="/configuracoes/perfil">👤 Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                <Link href="/configuracoes/integracoes">🔗 Conexões WhatsApp</Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/produtos">📦 Produtos & Preços</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/pipeline">⚡ Funil de Vendas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/usuarios">👥 Equipe</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/workspace">🏢 Empresa</Link>
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                variant="destructive"
                className="rounded-xl cursor-pointer py-2"
                onSelect={() => logout()}
              >
                🚪 Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
