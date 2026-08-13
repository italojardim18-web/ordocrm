import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pipeline" };

export default function PipelinePage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-primary">Pipeline</h1>
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card p-8 text-center">
        <p className="font-medium">O Kanban de leads chega na Fase 2.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          A fundação (workspaces, papéis e segurança) está pronta. A próxima
          fase traz leads, etapas configuráveis, Kanban e lista.
        </p>
      </div>
    </section>
  );
}
