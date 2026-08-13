/**
 * Testes de RLS e isolamento multiempresa.
 *
 * Exigem o stack local do Supabase rodando (`supabase start`, requer Docker)
 * com as migrations aplicadas e o seed carregado (`supabase db reset`).
 * Sem SUPABASE_URL/SUPABASE_ANON_KEY no ambiente, a suíte é ignorada com aviso.
 *
 * Usuários do seed (senha: praxis123!):
 *   admin@praxis.dev      → admin do workspace A (Ítalo Jardim)
 *   assistente@praxis.dev → assistente do workspace A
 *   admin@outra.dev       → admin do workspace B (Outra Empresa)
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasStack = Boolean(SUPABASE_URL && ANON_KEY);

const WORKSPACE_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const WORKSPACE_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PASSWORD = "praxis123!";

function anonClient() {
  return createClient(SUPABASE_URL!, ANON_KEY!, {
    auth: { persistSession: false },
  });
}

async function signIn(email: string): Promise<SupabaseClient> {
  const client = anonClient();
  const { error } = await client.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (error) {
    throw new Error(`login de ${email} falhou: ${error.message}`);
  }
  return client;
}

describe.skipIf(!hasStack)("RLS — fundação multiempresa", () => {
  let adminA: SupabaseClient;
  let assistantA: SupabaseClient;
  let adminB: SupabaseClient;

  beforeAll(async () => {
    [adminA, assistantA, adminB] = await Promise.all([
      signIn("admin@praxis.dev"),
      signIn("assistente@praxis.dev"),
      signIn("admin@outra.dev"),
    ]);
  });

  it("um workspace não enxerga o outro (workspaces)", async () => {
    const { data } = await adminA.from("workspaces").select("id");
    const ids = (data ?? []).map((w) => w.id);
    expect(ids).toContain(WORKSPACE_A);
    expect(ids).not.toContain(WORKSPACE_B);

    const { data: dataB } = await adminB.from("workspaces").select("id");
    const idsB = (dataB ?? []).map((w) => w.id);
    expect(idsB).toContain(WORKSPACE_B);
    expect(idsB).not.toContain(WORKSPACE_A);
  });

  it("membros de outro workspace são invisíveis", async () => {
    const { data } = await adminA
      .from("workspace_members")
      .select("workspace_id");
    expect(data?.length).toBeGreaterThan(0);
    expect(
      (data ?? []).every((m) => m.workspace_id === WORKSPACE_A),
    ).toBe(true);
  });

  it("não é possível inserir membro em outro workspace", async () => {
    const {
      data: { user },
    } = await adminA.auth.getUser();

    const { error } = await adminA.from("workspace_members").insert({
      workspace_id: WORKSPACE_B,
      user_id: user!.id,
      role: "admin",
    });
    expect(error).not.toBeNull();
  });

  it("não é possível atualizar workspace alheio", async () => {
    await adminA
      .from("workspaces")
      .update({ name: "invadido" })
      .eq("id", WORKSPACE_B);

    const { data } = await adminB
      .from("workspaces")
      .select("name")
      .eq("id", WORKSPACE_B)
      .single();
    expect(data?.name).not.toBe("invadido");
  });

  it("assistente não cria convites", async () => {
    const { error } = await assistantA.rpc("create_invitation", {
      ws_id: WORKSPACE_A,
      invitee_email: "novo@praxis.dev",
      invitee_role: "assistant",
    });
    expect(error).not.toBeNull();
  });

  it("assistente não lê convites nem auditoria", async () => {
    const { data: invitations } = await assistantA
      .from("workspace_invitations")
      .select("id");
    expect(invitations ?? []).toHaveLength(0);

    const { data: audits } = await assistantA.from("audit_logs").select("id");
    expect(audits ?? []).toHaveLength(0);
  });

  it("admin não altera o próprio papel (antiescalação)", async () => {
    const {
      data: { user },
    } = await adminA.auth.getUser();

    const { data: membership } = await adminA
      .from("workspace_members")
      .select("id")
      .eq("user_id", user!.id)
      .single();

    const { error } = await adminA.rpc("change_member_role", {
      member_id: membership!.id,
      new_role: "assistant",
    });
    expect(error).not.toBeNull();
  });

  it("assistente não muda papel de ninguém", async () => {
    const { data: members } = await assistantA
      .from("workspace_members")
      .select("id, user_id");
    const other = members?.find((m) => m.id);

    const { error } = await assistantA.rpc("change_member_role", {
      member_id: other!.id,
      new_role: "admin",
    });
    expect(error).not.toBeNull();
  });

  it("escrita direta em workspace_members é bloqueada mesmo para admin", async () => {
    const { data: members } = await adminA
      .from("workspace_members")
      .select("id, role")
      .eq("role", "assistant");
    const target = members?.[0];

    await adminA
      .from("workspace_members")
      .update({ role: "admin" })
      .eq("id", target!.id);

    const { data: after } = await adminA
      .from("workspace_members")
      .select("role")
      .eq("id", target!.id)
      .single();
    expect(after?.role).toBe("assistant");
  });

  it("fluxo de convite: admin convida, e-mail errado não aceita", async () => {
    const email = `convite-${Date.now()}@praxis.dev`;
    const { data, error } = await adminA.rpc("create_invitation", {
      ws_id: WORKSPACE_A,
      invitee_email: email,
      invitee_role: "assistant",
    });
    expect(error).toBeNull();

    const token = (data as { token: string }[] | null)?.[0]?.token;
    expect(token).toBeTruthy();

    // Convite é legível anonimamente (página pública), com dados mínimos.
    const anon = anonClient();
    const { data: publicInfo } = await anon.rpc("get_invitation_public", {
      raw_token: token,
    });
    expect(
      (publicInfo as { email: string }[] | null)?.[0]?.email,
    ).toBe(email);

    // Usuário autenticado com OUTRO e-mail não pode aceitar.
    const { error: acceptError } = await adminB.rpc("accept_invitation", {
      raw_token: token,
    });
    expect(acceptError).not.toBeNull();
  });
});

if (!hasStack) {
  describe("RLS — fundação multiempresa", () => {
    it.skip("ignorado: stack local do Supabase indisponível (defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY)", () => {});
  });
}
