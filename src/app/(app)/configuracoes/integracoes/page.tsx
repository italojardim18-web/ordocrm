import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getGoogleConfig, listCalendars } from "@/lib/calendar/google";
import {
  getFreshAccessToken,
  getWorkspaceConnection,
} from "@/lib/calendar/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { CalendarPicker, DisconnectButton } from "./calendar-controls";
import { MessageSimulator } from "./health";

export const metadata: Metadata = { title: "Integrações" };

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const context = await requireAdmin();
  const { erro } = await searchParams;

  const config = getGoogleConfig();
  const connection = config
    ? await getWorkspaceConnection(context.workspace.id)
    : null;

  const supabase = await createClient();
  const [
    { data: channels },
    { count: webhookCount },
    { count: failedWebhooks },
    { count: pendingOutbox },
  ] = await Promise.all([
    supabase
      .from("channel_connections")
      .select("provider, status")
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", context.workspace.id)
      .eq("status", "failed"),
    supabase
      .from("outbox_messages")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", context.workspace.id)
      .eq("status", "pending"),
  ]);

  const whatsapp = (channels ?? []).find((c) => c.provider === "whatsapp");
  const instagram = (channels ?? []).find((c) => c.provider === "instagram");

  let calendars: { id: string; summary: string }[] = [];
  let calendarListError = false;
  if (connection) {
    try {
      const token = await getFreshAccessToken(connection);
      calendars = await listCalendars(token);
    } catch {
      calendarListError = true;
    }
  }

  const errorMessages: Record<string, string> = {
    "sem-config":
      "Credenciais Google ausentes no servidor (GOOGLE_CLIENT_ID/SECRET).",
    "estado-invalido": "A autorização expirou ou foi adulterada. Tente de novo.",
    "sem-refresh-token":
      "O Google não devolveu refresh token. Remova o acesso do app em myaccount.google.com/permissions e conecte novamente.",
    "troca-de-codigo": "Falha ao concluir a autorização. Tente novamente.",
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-primary">Integrações</h1>

      {erro && errorMessages[erro] ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessages[erro]}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Google Calendar</CardTitle>
            {!config ? (
              <Badge variant="outline">Aguardando configuração</Badge>
            ) : connection ? (
              <Badge className="bg-positive text-primary-foreground">
                Conectado
              </Badge>
            ) : (
              <Badge variant="secondary">Não conectado</Badge>
            )}
          </div>
          <CardDescription>
            Sessões agendadas no CRM são criadas, atualizadas e canceladas no
            calendário conectado, com link do Meet quando disponível.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!config ? (
            <div className="text-sm text-muted-foreground">
              <p>
                Para ativar, defina <code>GOOGLE_CLIENT_ID</code>,{" "}
                <code>GOOGLE_CLIENT_SECRET</code> e{" "}
                <code>INTEGRATION_TOKEN_KEY</code> no ambiente do servidor e
                cadastre o redirect{" "}
                <code>/api/integrations/google/callback</code> no Google Cloud
                Console. O passo a passo completo está em{" "}
                <code>README.md</code>.
              </p>
            </div>
          ) : !connection ? (
            <Button asChild className="self-start">
              <Link href="/api/integrations/google/start">
                Conectar Google Calendar
              </Link>
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm">
                Conectado como{" "}
                <strong>{connection.account_email ?? "conta Google"}</strong>
                {connection.calendar_id ? (
                  <>
                    {" "}
                    · calendário atual:{" "}
                    <strong>
                      {connection.calendar_name ?? connection.calendar_id}
                    </strong>
                  </>
                ) : (
                  " · nenhum calendário escolhido ainda"
                )}
              </p>
              {calendarListError ? (
                <p className="text-sm text-destructive">
                  Não foi possível listar os calendários agora. Recarregue a
                  página ou reconecte.
                </p>
              ) : (
                <CalendarPicker
                  calendars={calendars}
                  currentId={connection.calendar_id}
                />
              )}
              <DisconnectButton />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>WhatsApp Business (Cloud API)</CardTitle>
            <Badge variant="outline">
              {whatsapp?.status === "connected"
                ? "Conectado"
                : "Aguardando configuração"}
            </Badge>
          </div>
          <CardDescription>
            Recebimento e envio de mensagens pela API oficial da Meta. Depende
            de conta Meta Business verificada e número registrado na Cloud API.
            O webhook do CRM já está pronto em{" "}
            <code>/api/webhooks/meta</code>.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Instagram (mensagens)</CardTitle>
            <Badge variant="outline">
              {instagram?.status === "connected"
                ? "Conectado"
                : "Aguardando configuração"}
            </Badge>
          </div>
          <CardDescription>
            Conversas do Direct pela API oficial. Depende de conta profissional
            vinculada ao portfólio Meta e da aprovação do app (App Review).
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saúde das integrações</CardTitle>
          <CardDescription>
            Eventos recebidos e fila de envio dos últimos registros.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Eventos recebidos</dt>
              <dd className="text-lg font-medium">{webhookCount ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Eventos com falha</dt>
              <dd className="text-lg font-medium">{failedWebhooks ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fila de envio pendente</dt>
              <dd className="text-lg font-medium">{pendingOutbox ?? 0}</dd>
            </div>
          </dl>
          {process.env.NODE_ENV !== "production" ? <MessageSimulator /> : null}
        </CardContent>
      </Card>
    </section>
  );
}
