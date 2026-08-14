import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { FormsManager } from "./forms-manager";
import type { FormEndpoint, FormFolder } from "@/lib/forms/types";
import { getDefaultPipeline, getStages } from "@/lib/crm/queries";

export const metadata: Metadata = {
  title: "ORDO Forms",
};

export default async function FormulariosPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const admin = createAdminClient();

  const [formsRes, foldersRes, defaultPipeline, allPipelinesRes] = await Promise.all([
    admin
      .from("form_endpoints")
      .select("*")
      .eq("workspace_id", context.workspace.id)
      .order("created_at", { ascending: false }),
    admin
      .from("form_folders")
      .select("*")
      .eq("workspace_id", context.workspace.id)
      .order("name", { ascending: true }),
    getDefaultPipeline(context.workspace.id),
    admin
      .from("pipelines")
      .select("id, name, is_default")
      .eq("workspace_id", context.workspace.id)
      .is("archived_at", null),
  ]);

  const forms = (formsRes.data ?? []) as unknown as FormEndpoint[];
  const folders = (foldersRes.data ?? []) as FormFolder[];
  const stages = defaultPipeline ? await getStages(defaultPipeline.id) : [];
  const pipelines = (allPipelinesRes.data ?? []) as any[];

  return (
    <FormsManager
      initialForms={forms}
      initialFolders={folders}
      stages={stages}
      pipelines={pipelines}
    />
  );
}
