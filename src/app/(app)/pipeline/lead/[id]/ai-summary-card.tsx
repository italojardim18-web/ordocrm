import type { LeadDetail } from "@/lib/crm/types";
import { formatDateTime } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AISummaryCardProps {
  lead: LeadDetail;
}

export function AISummaryCard({ lead }: AISummaryCardProps) {
  const hasSummary =
    lead.notes_summary ||
    lead.summary_need ||
    lead.summary_moment ||
    lead.summary_preference ||
    lead.summary_open_point;

  if (!hasSummary) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-1.5">
              <span>✨</span> Resumo Comercial Inteligente
            </CardTitle>
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Aguardando interações
            </Badge>
          </div>
          <CardDescription>
            Estrutura automaticamente a necessidade, momento e preferências do lead a partir das mensagens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground italic">
            Nenhum resumo comercial gerado ainda. As informações serão sintetizadas automaticamente conforme conversas e notas forem adicionadas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-1.5 text-primary">
            <span>✨</span> Resumo Comercial
          </CardTitle>
          {lead.summary_source_count ? (
            <Badge variant="secondary" className="text-[10px]">
              {lead.summary_source_count} interação(ões) analisada(s)
            </Badge>
          ) : null}
        </div>
        {lead.summary_generated_at ? (
          <CardDescription className="text-[11px]">
            Atualizado em {formatDateTime(lead.summary_generated_at)}
            {lead.summary_model ? ` · ${lead.summary_model}` : ""}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 text-xs">
        {lead.notes_summary ? (
          <div className="rounded-md bg-muted/60 p-2.5 text-foreground leading-relaxed">
            {lead.notes_summary}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {lead.summary_need ? (
            <div className="flex flex-col gap-1 rounded border bg-card p-2">
              <span className="font-semibold text-primary text-[11px] uppercase tracking-wider">
                🎯 Necessidade
              </span>
              <p className="text-muted-foreground">{lead.summary_need}</p>
            </div>
          ) : null}

          {lead.summary_moment ? (
            <div className="flex flex-col gap-1 rounded border bg-card p-2">
              <span className="font-semibold text-primary text-[11px] uppercase tracking-wider">
                ⏳ Momento & Urgência
              </span>
              <p className="text-muted-foreground">{lead.summary_moment}</p>
            </div>
          ) : null}

          {lead.summary_preference ? (
            <div className="flex flex-col gap-1 rounded border bg-card p-2">
              <span className="font-semibold text-primary text-[11px] uppercase tracking-wider">
                💡 Preferências / Restrições
              </span>
              <p className="text-muted-foreground">{lead.summary_preference}</p>
            </div>
          ) : null}

          {lead.summary_open_point ? (
            <div className="flex flex-col gap-1 rounded border bg-card p-2">
              <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px] uppercase tracking-wider">
                📌 Ponto em Aberto
              </span>
              <p className="text-muted-foreground">{lead.summary_open_point}</p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
