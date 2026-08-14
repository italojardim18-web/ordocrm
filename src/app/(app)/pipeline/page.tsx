import type { Metadata } from "next";
import { getSessionContext } from "@/lib/auth";
import {
  getBoardLeads,
  getChannelConnections,
  getDefaultPipeline,
  getMembers,
  getProducts,
  getStages,
} from "@/lib/crm/queries";
import { redirect } from "next/navigation";
import { PipelineView } from "./pipeline-view";
import { ChannelSelector } from "@/components/channel-selector";

export const metadata: Metadata = { title: "Pipeline" };

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const sp = await searchParams;
  const selectedChannel = typeof sp.linha === "string" ? sp.linha : null;

  const pipeline = await getDefaultPipeline(context.workspace.id);

  if (!pipeline) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-primary">Pipeline</h1>
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="font-medium">Nenhum pipeline configurado.</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Peça a um administrador para configurar o pipeline do workspace.
          </p>
        </div>
      </section>
    );
  }

  const [stages, leads, products, members, channelConnections] = await Promise.all([
    getStages(pipeline.id),
    getBoardLeads(pipeline.id, selectedChannel),
    getProducts(context.workspace.id, true),
    getMembers(context.workspace.id),
    getChannelConnections(context.workspace.id),
  ]);

  const channelOptions = channelConnections.map((ch) => ({
    id: ch.id,
    label: ch.display_name ?? ch.provider,
    phoneNumber: ch.phone_number,
  }));

  return (
    <div className="flex flex-col gap-3">
      {channelOptions.length > 1 ? (
        <div className="flex items-center justify-end">
          <ChannelSelector channels={channelOptions} />
        </div>
      ) : null}
      <PipelineView
        workspaceId={context.workspace.id}
        pipelineId={pipeline.id}
        isAdmin={context.membership.role === "admin"}
        stages={stages}
        leads={leads}
        products={products}
        members={members}
      />
    </div>
  );
}
