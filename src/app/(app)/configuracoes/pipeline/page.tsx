import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDefaultPipeline, getStages } from "@/lib/crm/queries";
import { createClient } from "@/lib/supabase/server";
import { StageManager } from "./stage-manager";

export const metadata: Metadata = { title: "Pipeline e etapas" };

export default async function PipelineSettingsPage() {
  const context = await requireAdmin();
  const pipeline = await getDefaultPipeline(context.workspace.id);

  if (!pipeline) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-primary">
          Pipeline e etapas
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Nenhum pipeline encontrado para este workspace.
        </p>
      </section>
    );
  }

  const stages = await getStages(pipeline.id);

  const supabase = await createClient();
  const { data: counts } = await supabase
    .from("leads")
    .select("stage_id")
    .eq("pipeline_id", pipeline.id)
    .is("deleted_at", null);

  const leadCounts: Record<string, number> = {};
  for (const row of counts ?? []) {
    leadCounts[row.stage_id] = (leadCounts[row.stage_id] ?? 0) + 1;
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-primary">Pipeline e etapas</h1>
      <StageManager
        pipelineId={pipeline.id}
        pipelineName={pipeline.name}
        stages={stages}
        leadCounts={leadCounts}
      />
    </section>
  );
}
