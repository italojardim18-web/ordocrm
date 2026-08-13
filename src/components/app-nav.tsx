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

const MAIN_LINKS = [
  { href: "/pipeline", label: "Pipeline" },
  { href: "/dashboard", label: "Dashboard" },
];

export function AppNav({
  workspaceName,
  userName,
  userEmail,
  isAdmin,
}: {
  workspaceName: string;
  userName: string | null;
  userEmail: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  return (
    <header className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-sm font-medium">{workspaceName}</span>
        </div>
        <nav aria-label="Navegação principal" className="flex items-center gap-1">
          {MAIN_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu do usuário"
                className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                    {initials(userName || userEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>{userName || "Sem nome"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/configuracoes/perfil">Perfil</Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracoes/produtos">Produtos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracoes/pipeline">Pipeline e etapas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracoes/usuarios">Usuários</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracoes/workspace">Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Integrações (em breve)
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => logout()}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
