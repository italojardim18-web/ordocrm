import { AppNav } from "@/components/app-nav";
import { AppSidebar } from "@/components/app-sidebar";
import { getSessionContext } from "@/lib/auth";
import { getChannelConnections } from "@/lib/crm/queries";
import { Button } from "@/components/ui/button";
import { logout } from "./actions";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await getSessionContext();

  if (!context) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-xl font-semibold">Sem acesso a um workspace</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Sua conta existe, mas ainda não está vinculada a nenhum workspace.
          Peça um convite ao administrador da sua equipe.
        </p>
        <form action={logout}>
          <Button variant="outline">Sair</Button>
        </form>
      </div>
    );
  }

  const channelConnections = await getChannelConnections(context.workspace.id);
  const channels = channelConnections.map((ch) => ({
    id: ch.id,
    label: ch.display_name ?? ch.provider,
    phoneNumber: ch.phone_number,
  }));

  const isAdmin = context.membership.role === "admin";

  return (
    <div className="flex min-h-svh bg-background">
      {/* Barra Lateral Esquerda com Dock de Ferramentas / Configurações / Suporte */}
      <AppSidebar isAdmin={isAdmin} />

      {/* Área Principal de Conteúdo com Barra Superior Moderna */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppNav
          workspaceName={context.workspace.displayName}
          userName={context.profile.fullName}
          userEmail={context.user.email}
          isAdmin={isAdmin}
          channels={channels}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
