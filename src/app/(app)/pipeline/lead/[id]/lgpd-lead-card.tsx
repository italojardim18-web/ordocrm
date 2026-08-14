"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { exportLeadDataLGPD, anonymizeLeadLGPD, updateConsentStatus } from "@/app/(app)/configuracoes/seguranca-lgpd/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LgpdLeadCardProps {
  leadId: string;
  leadName: string;
  consentStatus: string | null;
  consentPurpose: string | null;
  isAnonymized: boolean;
  isAdmin: boolean;
}

export function LgpdLeadCard({
  leadId,
  leadName,
  consentStatus,
  consentPurpose,
  isAnonymized,
  isAdmin,
}: LgpdLeadCardProps) {
  const [status, setStatus] = useState(consentStatus || "granted");
  const [purpose, setPurpose] = useState(consentPurpose || "atendimento_clinico");
  const [isExporting, setIsExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleExport() {
    setIsExporting(true);
    try {
      const res = await exportLeadDataLGPD(leadId);
      if (res.error) {
        toast.error(res.error);
        return;
      }

      // Download do Dossiê em JSON formatado
      const jsonStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dossie-lgpd-${leadName.replace(/\s+/g, "_").toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Dossiê LGPD exportado com sucesso e registrado na auditoria!");
    } catch (err: any) {
      toast.error("Erro ao exportar dossiê: " + err.message);
    } finally {
      setIsExporting(false);
    }
  }

  function handleAnonymize() {
    if (!isAdmin) {
      toast.error("Apenas administradores podem anonimizar registros.");
      return;
    }

    const confirma = confirm(
      `ATENÇÃO: A anonimização do paciente "${leadName}" é irreversível conforme o Art. 18 da LGPD.\n\nO nome será substituído por um código anônimo, telefone e e-mail serão apagados, preservando apenas métricas contábeis.\n\nDeseja prosseguir?`,
    );
    if (!confirma) return;

    startTransition(async () => {
      const res = await anonymizeLeadLGPD(leadId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Paciente anonimizado como "${res.newName}" com sucesso!`);
      }
    });
  }

  function handleSaveConsent(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateConsentStatus(leadId, status as any, purpose);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Consentimento LGPD atualizado!");
      }
    });
  }

  return (
    <div className="ordo-card p-5 flex flex-col gap-4 bg-card">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <h3 className="font-heading text-sm font-bold text-primary">
            Privacidade & LGPD
          </h3>
        </div>

        {isAnonymized ? (
          <Badge variant="outline" className="rounded-full text-[10px] bg-muted text-muted-foreground border-border">
            Anonimizado (Art. 18)
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className={`rounded-full text-[10px] ${
              status === "granted"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-700 border-amber-500/30"
            }`}
          >
            {status === "granted" ? "Consentimento Ativo" : "Consentimento Revogado"}
          </Badge>
        )}
      </div>

      {!isAnonymized ? (
        <form onSubmit={handleSaveConsent} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-foreground">
              Finalidade de Tratamento:
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="h-8 rounded-xl border border-border bg-card px-2.5 text-xs shadow-2xs"
            >
              <option value="atendimento_clinico">Atendimento Clínico & Prontuário</option>
              <option value="contato_whatsapp">Contato e Agendamentos WhatsApp</option>
              <option value="pesquisa_e_supervisao">Supervisão & Discussão de Caso</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-7 rounded-lg border border-border bg-card px-2 text-[11px] font-semibold"
            >
              <option value="granted">Autorizado ✓</option>
              <option value="revoked">Revogado ✕</option>
              <option value="pending">Pendente ⏳</option>
            </select>

            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              variant="outline"
              className="h-7 rounded-full text-[11px] px-3 font-semibold"
            >
              Salvar
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Os dados pessoais deste titular foram permanentemente anonimizados conforme exigência legal.
        </p>
      )}

      <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isExporting}
          onClick={handleExport}
          className="h-8 rounded-full text-xs font-semibold w-full flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>📥</span>
          <span>{isExporting ? "Gerando Dossiê..." : "Exportar Dados (Portabilidade)"}</span>
        </Button>

        {isAdmin && !isAnonymized ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={isPending}
            onClick={handleAnonymize}
            className="h-7 rounded-full text-[11px] font-semibold text-destructive hover:bg-destructive/10 w-full"
          >
            Anonimizar Paciente (Esquecimento)
          </Button>
        ) : null}
      </div>
    </div>
  );
}
