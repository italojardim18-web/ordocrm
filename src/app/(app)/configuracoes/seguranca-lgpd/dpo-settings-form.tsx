"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateDpoSettings } from "./actions";
import { Button } from "@/components/ui/button";

interface DpoSettingsFormProps {
  initialDpoName: string;
  initialDpoEmail: string;
  initialDpoPhone: string;
  initialRetentionDays: number;
  initialPrivacyPolicy: string;
  isAdmin: boolean;
}

export function DpoSettingsForm({
  initialDpoName,
  initialDpoEmail,
  initialDpoPhone,
  initialRetentionDays,
  initialPrivacyPolicy,
  isAdmin,
}: DpoSettingsFormProps) {
  const [dpoName, setDpoName] = useState(initialDpoName);
  const [dpoEmail, setDpoEmail] = useState(initialDpoEmail);
  const [dpoPhone, setDpoPhone] = useState(initialDpoPhone);
  const [retentionDays, setRetentionDays] = useState(initialRetentionDays);
  const [privacyPolicy, setPrivacyPolicy] = useState(
    initialPrivacyPolicy ||
      "Esta clínica coleta dados estritamente necessários para o atendimento clínico, prontuário médico e agendamento de consultas. O titular tem o direito de solicitar a confirmação, o acesso, a correção e a anonimização dos seus dados pessoais a qualquer momento, conforme o Art. 18 da LGPD.",
  );

  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Apenas administradores podem alterar as políticas de segurança.");
      return;
    }

    startTransition(async () => {
      const res = await updateDpoSettings({
        dpoName,
        dpoEmail,
        dpoPhone,
        retentionDays,
        privacyPolicy,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Configurações do DPO e Políticas LGPD salvas com sucesso!");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="ordo-card p-6 flex flex-col gap-5 bg-card">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <h2 className="font-heading text-base font-bold text-primary">
            Encarregado de Proteção de Dados (DPO) & Retenção Legal
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">
            Nome do DPO / Responsável Técnico
          </label>
          <input
            type="text"
            value={dpoName}
            onChange={(e) => setDpoName(e.target.value)}
            disabled={!isAdmin}
            required
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs shadow-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">
            E-mail de Contato do DPO
          </label>
          <input
            type="email"
            value={dpoEmail}
            onChange={(e) => setDpoEmail(e.target.value)}
            disabled={!isAdmin}
            required
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs shadow-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">
            Prazo de Retenção de Dados Clínicos
          </label>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            disabled={!isAdmin}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs shadow-xs"
          >
            <option value={730}>2 anos</option>
            <option value={1825}>5 anos (Padrão CFM / LGPD)</option>
            <option value={3650}>10 anos</option>
            <option value={7300}>20 anos (Prontuário Permanente)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-foreground">
          Termo de Privacidade & Finalidade de Tratamento
        </label>
        <textarea
          rows={3}
          value={privacyPolicy}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          disabled={!isAdmin}
          className="w-full rounded-2xl border border-border bg-card p-3.5 text-xs focus:ring-2 focus:ring-primary focus:outline-hidden leading-relaxed"
        />
        <span className="text-[10px] text-muted-foreground">
          Texto exibido ou enviado ao paciente ao coletar consentimento para tratamentos e contatos via WhatsApp.
        </span>
      </div>

      {isAdmin ? (
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full px-6 text-xs font-semibold text-primary-foreground shadow-xs"
          >
            {isPending ? "Salvando..." : "Salvar Diretrizes de Segurança & LGPD"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
