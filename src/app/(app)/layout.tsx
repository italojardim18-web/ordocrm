import { AppNav } from "@/components/app-nav";
import { getSessionContext } from "@/lib/auth";
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

  return (
    <div className="flex min-h-svh flex-col">
      <AppNav
        workspaceName={context.workspace.displayName}
        userName={context.profile.fullName}
        userEmail={context.user.email}
        isAdmin={context.membership.role === "admin"}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
