import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-card p-8 text-center">
        <p className="font-medium">Os indicadores chegam na Fase 5.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          O dashboard usará dados reais do pipeline: novos leads, engajamento,
          sessões, vendas e receita, com fórmulas documentadas.
        </p>
      </div>
    </section>
  );
}
