import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient();

    // Busca workspaces com reativação ativada
    const { data: workspaces, error: wsError } = await admin
      .from("workspaces")
      .select("id, reactivation_enabled, reactivation_days, reactivation_template, reactivation_channel_connection_id")
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

      // Busca leads perdidos há mais tempo que o limite e que ainda não foram reativados
      const { data: leadsPerdidos } = await admin
        .from("leads")
        .select("id, name, phone, channel_connection_id, lost_at, conversations (id)")
        .eq("workspace_id", ws.id)
        .not("lost_at", "is", null)
        .lte("lost_at", dataLimite)
        .or("reactivation_status.is.null,reactivation_status.eq.none")
        .is("deleted_at", null);

      if (!leadsPerdidos || leadsPerdidos.length === 0) continue;

      for (const lead of leadsPerdidos) {
        const conv = (lead.conversations as any)?.[0];
        if (!conv) continue;

        const primeiroNome = lead.name.split(" ")[0] || "Olá";
        const template = ws.reactivation_template || "Olá [Nome], tudo bem? Como você tem passado desde nosso último contato?";
        const mensagemFormatada = template.replace(/\[Nome\]/gi, primeiroNome);

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
          content: `Automação disparou mensagem de reativação: "${mensagemFormatada.slice(0, 100)}..."`,
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
