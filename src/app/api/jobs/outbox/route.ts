import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { processOutbox } from "@/lib/channels/outbox";

/**
 * Processa a fila de saída. Chamada por agendador (Vercel Cron, cron do
 * servidor ou o próprio serviço da ponte).
 *
 * Protegida por token: sem ele, qualquer um dispararia envios.
 */
export const maxDuration = 60;

function autorizado(request: NextRequest): boolean {
  const esperado = process.env.JOBS_SECRET;
  if (!esperado) return false;

  const recebido =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";

  if (recebido.length !== esperado.length) return false;
  return timingSafeEqual(Buffer.from(recebido), Buffer.from(esperado));
}

export async function POST(request: NextRequest) {
  if (!autorizado(request)) {
    return new NextResponse("não autorizado", { status: 401 });
  }

  const resultado = await processOutbox();
  return NextResponse.json(resultado);
}

// O Vercel Cron dispara com GET.
export async function GET(request: NextRequest) {
  return POST(request);
}
