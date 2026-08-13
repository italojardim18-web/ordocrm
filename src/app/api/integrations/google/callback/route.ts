import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  emailFromIdToken,
  exchangeCode,
  getGoogleConfig,
} from "@/lib/calendar/google";
import { encryptToken } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/** Callback do OAuth: troca o código, cifra os tokens e grava a conexão. */
export async function GET(request: NextRequest) {
  const context = await requireAdmin();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const settingsUrl = `${origin}/configuracoes/integracoes`;

  const config = getGoogleConfig();
  if (!config) {
    return NextResponse.redirect(`${settingsUrl}?erro=sem-config`);
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("g_oauth_state")?.value;
  cookieStore.delete("g_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${settingsUrl}?erro=estado-invalido`);
  }

  try {
    const redirectUri = `${origin}/api/integrations/google/callback`;
    const tokens = await exchangeCode(config, code, redirectUri);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${settingsUrl}?erro=sem-refresh-token`);
    }

    const admin = createAdminClient();
    await admin.from("calendar_connections").upsert(
      {
        workspace_id: context.workspace.id,
        user_id: context.user.id,
        provider: "google",
        account_email: emailFromIdToken(tokens.id_token),
        status: "connected",
        access_token_enc: encryptToken(tokens.access_token),
        refresh_token_enc: encryptToken(tokens.refresh_token),
        token_expires_at: new Date(
          Date.now() + tokens.expires_in * 1000,
        ).toISOString(),
      },
      { onConflict: "workspace_id,provider,user_id" },
    );

    await admin.from("audit_logs").insert({
      workspace_id: context.workspace.id,
      actor_id: context.user.id,
      action: "calendar_connected",
      entity_type: "calendar_connection",
    });

    return NextResponse.redirect(`${settingsUrl}?ok=1`);
  } catch {
    return NextResponse.redirect(`${settingsUrl}?erro=troca-de-codigo`);
  }
}
