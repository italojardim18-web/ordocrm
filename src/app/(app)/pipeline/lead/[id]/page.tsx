import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import {
  getLeadFull,
  getLostReasons,
  getMembers,
  getProducts,
  getStages,
  isCalendarConnected,
} from "@/lib/crm/queries";
import { channelLabel, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentsPanel } from "./appointments-panel";
import { LeadActions } from "./lead-actions";
import { LeadProfileForm } from "./lead-profile-form";
import { ActivityPanel, NotesPanel, TasksPanel } from "./lead-panels";
import { OpportunitiesPanel } from "./opportunities-panel";
import { ConversationPanel } from "./conversation-panel";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const full = await getLeadFull(id);
  if (!full) notFound();

  const {
    lead,
    notes,
    tasks,
    activities,
    interests,
    appointments,
    opportunities,
  } = full;

  const [stages, products, members, lostReasons, calendarConnected] =
    await Promise.all([
      getStages(lead.pipeline_id),
      getProducts(context.workspace.id, true),
      getMembers(context.workspace.id),
      getLostReasons(context.workspace.id),
      isCalendarConnected(context.workspace.id),
    ]);

  const currentStage = stages.find((s) => s.id === lead.stage_id);
  const lostReason = lead.lost_reason_id
    ? lostReasons.find((r) => r.id === lead.lost_reason_id)
    : null;

  const utms = [
    lead.utm_source && `source: ${lead.utm_source}`,
    lead.utm_medium && `medium: ${lead.utm_medium}`,
    lead.utm_campaign && `campaign: ${lead.utm_campaign}`,
    lead.utm_content && `content: ${lead.utm_content}`,
    lead.utm_term && `term: ${lead.utm_term}`,
  ].filter(Boolean);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/pipeline"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Voltar ao pipeline
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-primary">{lead.name}</h1>
          <Badge variant="secondary">{currentStage?.name ?? "—"}</Badge>
          <Badge variant="outline">{channelLabel(lead.channel)}</Badge>
          {lead.reactivated_count > 0 ? (
            <Badge variant="outline">
              Reativado {lead.reactivated_count}x
            </Badge>
          ) : null}
        </div>
        {currentStage?.stage_type === "lost" ? (
          <p className="text-sm text-destructive">
            Perdido em {formatDateTime(lead.lost_at)}
            {lostReason ? ` — ${lostReason.label}` : ""}
            {lead.lost_note ? ` (${lead.lost_note})` : ""}
          </p>
        ) : null}
      </div>

      <LeadActions
        lead={lead}
        stages={stages}
        lostReasons={lostReasons}
        members={members}
      />

      <div className="grid min-h-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,18rem)] xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,22rem)]">
        {/* Esquerda: quem é o lead. */}
        <div className="flex flex-col gap-5">
          <LeadProfileForm
            lead={lead}
            products={products}
            interests={interests}
          />

          <Card>
            <CardHeader>
              <CardTitle>Origem e campanha</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p>
                <span className="text-muted-foreground">Canal:</span>{" "}
                {channelLabel(lead.channel)}
              </p>
              {lead.source_detail ? (
                <p>
                  <span className="text-muted-foreground">Detalhe:</span>{" "}
                  {lead.source_detail}
                </p>
              ) : null}
              {utms.length > 0 ? (
                <p className="text-muted-foreground">{utms.join(" · ")}</p>
              ) : (
                <p className="text-muted-foreground">Sem UTMs registradas.</p>
              )}
              <p>
                <span className="text-muted-foreground">Entrada:</span>{" "}
                {formatDateTime(lead.created_at)}
              </p>
              {lead.first_contact_at ? (
                <p>
                  <span className="text-muted-foreground">
                    Primeiro contato:
                  </span>{" "}
                  {formatDateTime(lead.first_contact_at)}
                </p>
              ) : null}
              {lead.engaged_at ? (
                <p>
                  <span className="text-muted-foreground">Engajou em:</span>{" "}
                  {formatDateTime(lead.engaged_at)}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Centro: a conversa — a ação mais frequente fica no meio. */}
        <div className="flex min-h-[32rem] flex-col lg:h-[calc(100svh-14rem)]">
          <ConversationPanel
            leadId={lead.id}
            workspaceId={context.workspace.id}
          />
        </div>

        {/* Direita: o processo comercial. */}
        <div className="flex flex-col gap-5">
          <AppointmentsPanel
            leadId={lead.id}
            appointments={appointments}
            calendarConnected={calendarConnected}
            leadHasEmail={Boolean(lead.email)}
          />
          <OpportunitiesPanel
            leadId={lead.id}
            opportunities={opportunities}
            products={products}
            lostReasons={lostReasons}
          />
          <NotesPanel
            leadId={lead.id}
            notes={notes}
            members={members}
            isAdmin={context.membership.role === "admin"}
          />
          <TasksPanel leadId={lead.id} tasks={tasks} members={members} />
          <ActivityPanel
            leadId={lead.id}
            activities={activities}
            members={members}
            createdAt={lead.created_at}
          />
        </div>
      </div>
    </section>
  );
}
