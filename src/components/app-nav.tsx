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

const MAIN_LINKS = [
  { href: "/dashboard", label: "📊 Dashboard" },
  { href: "/pipeline", label: "⚡ Pipeline" },
  { href: "/agenda", label: "📅 Agenda" },
  { href: "/conversas", label: "💬 Conversas" },
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
    <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border/30 backdrop-blur-md sticky top-0 z-20 shadow-xs">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Marca do produto à esquerda — MAIOR e mais DESTACADA */}
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/pipeline"
            className="flex shrink-0 items-center gap-3 rounded-2xl px-3 py-1.5 transition-all hover:opacity-90 group"
          >
            <OrdoSymbol className="size-8 text-sidebar-foreground transition-transform group-hover:scale-105" title="ORDO" />
            <div className="flex flex-col">
              <span className="font-heading text-xl tracking-[0.26em] font-bold text-sidebar-foreground leading-none">
                ORDO
              </span>
              <span className="text-[10px] tracking-widest text-sidebar-foreground/60 uppercase font-sans mt-0.5">
                by Práxis Mentis
              </span>
            </div>
          </Link>

          <span aria-hidden className="hidden sm:inline-block h-6 w-px bg-sidebar-border/60" />

          {/* Nome do Workspace em Pílula Flutuante */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-sidebar-accent/40 px-3.5 py-1 border border-sidebar-border/30 text-xs text-sidebar-foreground/80 font-medium shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="truncate max-w-44">{workspaceName}</span>
          </div>
        </div>

        {/* Botões Flutuantes Centrais (Pill Navigation) */}
        <nav
          aria-label="Navegação rápida"
          className="hidden md:flex items-center gap-1.5 rounded-full bg-sidebar-accent/50 p-1.5 border border-sidebar-border/40 shadow-xs"
        >
          {MAIN_LINKS.map((link) => {
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
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm scale-102"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Lado Direito: Seletor de Linha WhatsApp + Avatar */}
        <div className="flex items-center gap-3">
          {/* Seletor de Linha WhatsApp em Pílula Flutuante */}
          <div className="flex items-center">
            <NavChannelSelector channels={channels} />
          </div>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu do usuário"
                className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent ring-2 ring-sidebar-border/60 transition-transform hover:scale-105 size-9"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground font-bold">
                    {initials(userName || userEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-2xl border-border/80 bg-card">
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
                <Link href="/configuracoes/integracoes">🔗 Conexões & WhatsApp</Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/produtos">📦 Produtos & Serviços</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/pipeline">⚡ Funil de Vendas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/usuarios">👥 Equipe & Membros</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
                    <Link href="/configuracoes/workspace">🏢 Dados da Empresa</Link>
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                variant="destructive"
                className="rounded-xl cursor-pointer py-2"
                onSelect={() => logout()}
              >
                🚪 Sair do sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
