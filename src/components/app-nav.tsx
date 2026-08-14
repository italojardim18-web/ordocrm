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
  { href: "/pipeline", label: "Pipeline" },
  { href: "/agenda", label: "Agenda" },
  { href: "/dashboard", label: "Dashboard" },
];

const SECONDARY_LINK = { href: "/conversas", label: "Conversas" };

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
    <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border/40">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Marca do produto à esquerda */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/pipeline"
            className="flex shrink-0 items-center gap-2.5 rounded-full px-2 py-1 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-sidebar-ring"
          >
            <OrdoSymbol className="size-6 text-sidebar-foreground" title="ORDO" />
            <span className="font-heading text-base tracking-[0.25em] font-semibold text-sidebar-foreground">
              ORDO
            </span>
          </Link>
          <span aria-hidden className="h-4 w-px bg-sidebar-border/60" />
          <span className="truncate text-xs tracking-wide text-sidebar-foreground/70 font-medium">
            {workspaceName}
          </span>
        </div>

        {/* Navegação principal em pílulas (Pill Tabs) */}
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-1.5 rounded-full bg-sidebar-accent/40 p-1 border border-sidebar-border/40"
        >
          {MAIN_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-semibold"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Seletor de Linha WhatsApp no Painel Superior */}
        <div className="hidden md:flex items-center ml-2">
          <NavChannelSelector channels={channels} />
        </div>

        {/* Ações à direita: Conversas e Avatar */}
        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href={SECONDARY_LINK.href}
            aria-current={
              pathname.startsWith(SECONDARY_LINK.href) ? "page" : undefined
            }
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border border-sidebar-border/40",
              pathname.startsWith(SECONDARY_LINK.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-xs"
                : "bg-sidebar-accent/30 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            💬 {SECONDARY_LINK.label}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu do usuário"
                className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent ring-1 ring-sidebar-border/60 transition-transform hover:scale-105"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground font-semibold">
                    {initials(userName || userEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-border/80">
              <DropdownMenuLabel className="flex flex-col px-3 py-2">
                <span className="font-semibold text-sm">{userName || "Sem nome"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link href="/configuracoes/perfil">👤 Perfil</Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/configuracoes/produtos">📦 Produtos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/configuracoes/pipeline">⚡ Pipeline e etapas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/configuracoes/usuarios">👥 Usuários</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/configuracoes/workspace">🏢 Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/configuracoes/integracoes">🔗 Integrações</Link>
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                variant="destructive"
                className="rounded-xl cursor-pointer"
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
