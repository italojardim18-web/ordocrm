import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";
import { listarEventosGoogle } from "@/lib/calendar/service";

export async function GET(req: NextRequest) {
  try {
    const context = await getSessionContext();
    if (!context) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeMin = searchParams.get("timeMin") || new Date(Date.now() - 14 * 86400000).toISOString();
    const timeMax = searchParams.get("timeMax") || new Date(Date.now() + 28 * 86400000).toISOString();
    const force = searchParams.get("force") === "true";

    const eventos = await listarEventosGoogle(
      context.workspace.id,
      timeMin,
      timeMax,
      force
    );

    return NextResponse.json({ eventos }, { status: 200 });
  } catch (err: any) {
    console.error("Erro na API de eventos do Google Calendar:", err);
    return NextResponse.json({ eventos: [] }, { status: 200 });
  }
}
