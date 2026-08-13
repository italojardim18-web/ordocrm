import type { Metadata } from "next";
import { getSessionContext } from "@/lib/auth";
import {
  getBoardLeads,
  getDefaultPipeline,
  getMembers,
  getProducts,
  getStages,
} from "@/lib/crm/queries";
import { redirect } from "next/navigation";
import { PipelineView } from "./pipeline-view";

export const metadata: Metadata = { title: "Pipeline" };

export default async function PipelinePage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

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

  const [stages, leads, products, members] = await Promise.all([
    getStages(pipeline.id),
    getBoardLeads(pipeline.id),
    getProducts(context.workspace.id, true),
    getMembers(context.workspace.id),
  ]);

  return (
    <PipelineView
      workspaceId={context.workspace.id}
      stages={stages}
      leads={leads}
      products={products}
      members={members}
    />
  );
}
