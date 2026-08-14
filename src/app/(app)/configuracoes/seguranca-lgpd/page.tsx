import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { DpoSettingsForm } from "./dpo-settings-form";

export const metadata: Metadata = { title: "Segurança & Conformidade LGPD" };

export default async function LgpdSecurityPage() {
  const context = await getSessionContext();
  if (!context) redirect("/login");

  const supabase = await createClient();

  const [
    { data: ws },
    { data: auditLogs },
  ] = await Promise.all([
    supabase
      .from("workspaces")
      .select("dpo_name, dpo_email, dpo_phone, data_retention_days, privacy_policy_text")
      .eq("id", context.workspace.id)
      .single(),
    supabase
      .from("audit_logs")
      .select("id, action, entity_type, entity_id, details, created_at, profiles (full_name, email)")
      .eq("workspace_id", context.workspace.id)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const isAdmin = context.membership.role === "admin";

  return (
    <section className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              Segurança & Conformidade LGPD
            </h1>
            <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-0.5 text-xs font-semibold">
              100% Conforme (Lei 13.709/2018)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Proteção de dados de saúde, gestão do encarregado (DPO), portabilidade e registros imutáveis de auditoria.
          </p>
        </div>
      </div>

      {/* Grid de Pilares de Segurança Ativos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="ordo-card p-4.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xl">🔐</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              AES-256
            </span>
          </div>
          <span className="text-xs font-bold text-foreground">Criptografia em Repouso</span>
          <p className="text-[11px] text-muted-foreground">
            Segredos, tokens e metadados sensíveis são armazenados com criptografia simétrica autenticada.
          </p>
        </div>

        <div className="ordo-card p-4.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xl">🛡️</span>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              RLS Ativo
            </span>
          </div>
          <span className="text-xs font-bold text-foreground">Isolamento Multi-Tenant</span>
          <p className="text-[11px] text-muted-foreground">
            Políticas de Row-Level Security no Postgres impedem qualquer vazamento cruzado entre clínicas.
          </p>
        </div>

        <div className="ordo-card p-4.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xl">📜</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Art. 18 LGPD
            </span>
          </div>
          <span className="text-xs font-bold text-foreground">Direitos dos Titulares</span>
          <p className="text-[11px] text-muted-foreground">
            Ferramentas nativas para Portabilidade (Exportação de Dossiê) e Direito ao Esquecimento (Anonimização).
          </p>
        </div>

        <div className="ordo-card p-4.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xl">👁️</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Audit Trail
            </span>
          </div>
          <span className="text-xs font-bold text-foreground">Auditoria Imutável</span>
          <p className="text-[11px] text-muted-foreground">
            Rastreabilidade de cada exportação, visualização ou modificação de dados de pacientes.
          </p>
        </div>
      </div>

      {/* Formulário de Configuração de DPO e Retenção */}
      <DpoSettingsForm
        initialDpoName={ws?.dpo_name || "Dr. Ítalo Jardim"}
        initialDpoEmail={ws?.dpo_email || "contato@italojardim.com.br"}
        initialDpoPhone={ws?.dpo_phone || ""}
        initialRetentionDays={ws?.data_retention_days || 1825}
        initialPrivacyPolicy={ws?.privacy_policy_text || ""}
        isAdmin={isAdmin}
      />

      {/* Tabela de Logs de Auditoria LGPD */}
      <div className="ordo-card p-6 flex flex-col gap-4 bg-card">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="font-heading text-base font-bold text-primary">
              Trilha de Auditoria & Acessos Sensíveis
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Últimos 30 eventos registrados no banco de dados.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/70 text-muted-foreground">
              <tr>
                <th className="pb-2.5 font-semibold">Data / Hora</th>
                <th className="pb-2.5 font-semibold">Usuário Responsável</th>
                <th className="pb-2.5 font-semibold">Ação LGPD / Segurança</th>
                <th className="pb-2.5 font-semibold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {(auditLogs ?? []).map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 text-muted-foreground whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>

                  <td className="py-2.5 font-semibold text-foreground">
                    {log.profiles?.full_name || log.profiles?.email || "Sistema / Automação"}
                  </td>

                  <td className="py-2.5">
                    <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0">
                      {log.action}
                    </Badge>
                  </td>

                  <td className="py-2.5 text-muted-foreground font-mono text-[11px]">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}

              {(!auditLogs || auditLogs.length === 0) ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground italic">
                    Nenhum registro de auditoria no período.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
