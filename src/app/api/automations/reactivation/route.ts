import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateAIReactivationMessage } from "@/lib/ai/reactivation-ai";

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient();

    // Busca workspaces com reativação ativada
    const { data: workspaces, error: wsError } = await admin
      .from("workspaces")
      .select("id, name, reactivation_enabled, reactivation_days, reactivation_template, reactivation_channel_connection_id")
      .eq("reactivation_enabled", true);

    if (wsError || !workspaces?.length) {
      return NextResponse.json({ processed: 0, message: "Nenhum workspace com reativação ativa." });
    }

    let totalDisparados = 0;
    const now = Date.now();

    for (const ws of workspaces) {
      const diasLimite = ws.reactivation_days || 30;
      const msLimite = diasLimite * 24 * 60 * 60 * 1000;
      const dataLimite = new Date(now - msLimite).toISOString();

      // Busca leads perdidos há mais tempo que o limite e marcados para reativação (pending ou none)
      const { data: leadsPerdidos } = await admin
        .from("leads")
        .select(`
          id,
          name,
          phone,
          channel_connection_id,
          lost_at,
          lost_note,
          lost_reasons (label),
          conversations (
            id,
            messages (body, direction, created_at)
          )
        `)
        .eq("workspace_id", ws.id)
        .not("lost_at", "is", null)
        .lte("lost_at", dataLimite)
        .or("reactivation_status.eq.pending,reactivation_status.is.null,reactivation_status.eq.none")
        .is("deleted_at", null);

      if (!leadsPerdidos || leadsPerdidos.length === 0) continue;

      for (const lead of leadsPerdidos) {
        const conv = (lead.conversations as any)?.[0];
        if (!conv) continue;

        let mensagemFormatada = "";

        // Se o lead tiver motivo ou anotação de perda, gera com IA contextual
        if (lead.lost_note || (lead.lost_reasons as any)?.label) {
          try {
            const lostTime = lead.lost_at ? new Date(lead.lost_at).getTime() : now;
            const daysPassed = Math.max(0, Math.floor((now - lostTime) / (1000 * 60 * 60 * 24)));

            const recentMessages: { body: string; direction: "inbound" | "outbound" }[] = [];
            if (conv.messages) {
              const sorted = [...conv.messages].sort(
                (a: any, b: any) =>
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
              for (const m of sorted.slice(-4)) {
                if (m.body) recentMessages.push({ body: m.body, direction: m.direction });
              }
            }

            const aiResult = await generateAIReactivationMessage({
              leadName: lead.name,
              lostReason: (lead.lost_reasons as any)?.label || null,
              lostNote: lead.lost_note || null,
              daysPassed,
              recentMessages,
              workspaceName: ws.name,
            });
            mensagemFormatada = aiResult.message;
          } catch (err) {
            console.warn("Erro ao gerar IA para cron de reativação:", err);
          }
        }

        // Fallback para o template padrão
        if (!mensagemFormatada) {
          const primeiroNome = lead.name.split(" ")[0] || "Olá";
          const template = ws.reactivation_template || "Olá [Nome], tudo bem? Como você tem passado desde nosso último contato?";
          mensagemFormatada = template.replace(/\[Nome\]/gi, primeiroNome);
        }

        // Enfileira a mensagem
        await admin.from("messages").insert({
          workspace_id: ws.id,
          conversation_id: conv.id,
          provider: "whatsapp",
          direction: "outbound",
          status: "pending",
          body: mensagemFormatada,
          sent_at: new Date().toISOString(),
        });

        // Atualiza o lead
        await admin
          .from("leads")
          .update({
            reactivated_at: new Date().toISOString(),
            reactivation_status: "reactivated",
            reactivated_count: 1,
          })
          .eq("id", lead.id);

        // Registra atividade
        await admin.from("activities").insert({
          workspace_id: ws.id,
          lead_id: lead.id,
          type: "message",
          content: `Automação disparou mensagem de reativação:\n"${mensagemFormatada.slice(0, 120)}..."`,
          meta: { trigger: "cron_reactivation", days: diasLimite },
        });

        totalDisparados += 1;
      }
    }

    return NextResponse.json({ success: true, totalDisparados });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro no processamento." }, { status: 500 });
  }
}
