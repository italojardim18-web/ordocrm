import { NextRequest, NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth";

/**
 * Proxy para a ponte do WhatsApp.
 *
 * O navegador não pode acessar localhost:8787 diretamente (CORS).
 * Esta rota repassa as chamadas para a ponte, autenticando pelo
 * contexto de sessão do CRM (só admin pode gerenciar).
 */

const BRIDGE_URL = process.env.BRIDGE_URL ?? "http://localhost:8787";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const context = await getSessionContext();
  if (!context || context.membership.role !== "admin") {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const { path } = await params;
  const bridgePath = "/" + path.join("/");

  try {
    const res = await fetch(`${BRIDGE_URL}${bridgePath}`, {
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { erro: e instanceof Error ? e.message : "ponte inacessível" },
      { status: 502 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const context = await getSessionContext();
  if (!context || context.membership.role !== "admin") {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const { path } = await params;
  const bridgePath = "/" + path.join("/");

  try {
    const body = await req.text();
    const res = await fetch(`${BRIDGE_URL}${bridgePath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body || undefined,
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();

    // Sincroniza channel_connections no Supabase quando uma sessão é iniciada
    if (res.ok && path[0] === "sessions" && path[2] === "start") {
      const sessionId = path[1];
      const displayName =
        sessionId === "principal"
          ? "Dr. Ítalo"
          : sessionId === "secretaria"
            ? "Secretária"
            : sessionId.charAt(0).toUpperCase() + sessionId.slice(1);

      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      
      const { data: existing } = await admin
        .from("channel_connections")
        .select("id")
        .eq("workspace_id", context.workspace.id)
        .eq("display_name", displayName)
        .maybeSingle();

      if (!existing) {
        await admin.from("channel_connections").insert({
          workspace_id: context.workspace.id,
          provider: "whatsapp",
          display_name: displayName,
          transport: "bridge",
          status: "connected",
        });
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { erro: e instanceof Error ? e.message : "ponte inacessível" },
      { status: 502 },
    );
  }
}
