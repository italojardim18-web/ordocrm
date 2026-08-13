import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildAuthUrl, getGoogleConfig } from "@/lib/calendar/google";

/** Inicia o OAuth do Google Calendar (apenas admin). */
export async function GET(request: NextRequest) {
  await requireAdmin();

  const config = getGoogleConfig();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (!config) {
    return NextResponse.redirect(
      `${origin}/configuracoes/integracoes?erro=sem-config`,
    );
  }

  const state = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("g_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const redirectUri = `${origin}/api/integrations/google/callback`;
  return NextResponse.redirect(buildAuthUrl(config, redirectUri, state));
}
