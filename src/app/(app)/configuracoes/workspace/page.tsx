import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { WorkspaceForm } from "./workspace-form";

export const metadata: Metadata = { title: "Workspace" };

export default async function WorkspaceSettingsPage() {
  const context = await requireAdmin();

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-primary">Workspace</h1>
      <WorkspaceForm
        name={context.workspace.name}
        timezone={context.workspace.timezone}
        displayName={context.workspace.displayName}
      />
    </section>
  );
}
