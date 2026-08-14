"use server";

import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FormEndpoint, FormFolder, FormSchema, FormSettings, FormTheme } from "@/lib/forms/types";

export async function listForms() {
  const context = await getSessionContext();
  if (!context) throw new Error("Não autenticado");

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("form_endpoints")
    .select("*")
    .eq("workspace_id", context.workspace.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar formulários:", error);
    return [];
  }

  return (data ?? []) as unknown as FormEndpoint[];
}

export async function listFormFolders(): Promise<FormFolder[]> {
  const context = await getSessionContext();
  if (!context) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("form_folders")
    .select("*")
    .eq("workspace_id", context.workspace.id)
    .order("name", { ascending: true });

  return (data ?? []) as FormFolder[];
}

export async function createForm(input: {
  name: string;
  slug?: string;
  folder?: string;
  pipeline_id?: string;
}) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado" };

  const admin = createAdminClient();

  const generatedSlug = (input.slug || input.name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || `form-${Date.now().toString(36)}`;

  // Verificar se o slug já existe
  const { data: existing } = await admin
    .from("form_endpoints")
    .select("id")
    .eq("slug", generatedSlug)
    .maybeSingle();

  const finalSlug = existing ? `${generatedSlug}-${Date.now().toString(36).slice(-4)}` : generatedSlug;

  const defaultSchema: FormSchema = {
    welcome: {
      title: input.name,
      description: "Por favor, preencha as informações abaixo para iniciarmos seu atendimento.",
      buttonText: "Começar",
    },
    questions: [
      {
        id: `q_${Date.now()}_1`,
        type: "text",
        title: "Qual é o seu nome completo?",
        placeholder: "Seu nome",
        required: true,
        mapsTo: "name",
      },
      {
        id: `q_${Date.now()}_2`,
        type: "phone",
        title: "Qual é o seu WhatsApp com DDD?",
        placeholder: "(00) 00000-0000",
        required: true,
        mapsTo: "phone",
      },
      {
        id: `q_${Date.now()}_3`,
        type: "email",
        title: "Qual o seu melhor e-mail?",
        placeholder: "seu@email.com",
        required: false,
        mapsTo: "email",
      },
      {
        id: `q_${Date.now()}_4`,
        type: "textarea",
        title: "Conte brevemente o que você busca ou o motivo do contato:",
        placeholder: "Descreva aqui...",
        required: false,
        mapsTo: "notes",
      },
    ],
    thankyou: {
      title: "Obrigado!",
      description: "Recebemos suas informações com sucesso. Nossa equipe entrará em contato em breve.",
    },
  };

  const { data, error } = await admin
    .from("form_endpoints")
    .insert({
      workspace_id: context.workspace.id,
      name: input.name,
      slug: finalSlug,
      folder: input.folder || "Geral",
      pipeline_id: input.pipeline_id || null,
      is_active: true,
      schema: defaultSchema,
      theme: {
        primaryColor: "#521D2A",
        backgroundColor: "#F2EEE7",
        cardBackground: "#FFFFFF",
        borderRadius: "1rem",
      },
      settings: {
        autoCreateLead: true,
        notifyEmail: true,
      },
    })
    .select()
    .single();

  if (error) {
    return { error: `Erro ao criar formulário: ${error.message}` };
  }

  revalidatePath("/formularios");
  return { data };
}

export async function updateForm(
  id: string,
  data: {
    name?: string;
    headline?: string | null;
    description?: string | null;
    slug?: string;
    folder?: string | null;
    pipeline_id?: string | null;
    product_id?: string | null;
    owner_id?: string | null;
    is_active?: boolean;
    schema?: FormSchema;
    theme?: FormTheme;
    settings?: FormSettings;
  },
) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("form_endpoints")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("workspace_id", context.workspace.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/formularios");
  revalidatePath(`/f/${data.slug}`);
  return { success: true };
}

export async function toggleFormActive(id: string, is_active: boolean) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("form_endpoints")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: error.message };

  revalidatePath("/formularios");
  return { success: true };
}

export async function deleteForm(id: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("form_endpoints")
    .delete()
    .eq("id", id)
    .eq("workspace_id", context.workspace.id);

  if (error) return { error: error.message };

  revalidatePath("/formularios");
  return { success: true };
}

export async function duplicateForm(id: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado" };

  const admin = createAdminClient();
  const { data: original, error: fetchError } = await admin
    .from("form_endpoints")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", context.workspace.id)
    .single();

  if (fetchError || !original) return { error: "Formulário não encontrado" };

  const newSlug = `${original.slug}-copia-${Date.now().toString(36).slice(-4)}`;

  const { error: insertError } = await admin.from("form_endpoints").insert({
    workspace_id: context.workspace.id,
    name: `${original.name} (Cópia)`,
    slug: newSlug,
    headline: original.headline,
    description: original.description,
    folder: original.folder,
    pipeline_id: original.pipeline_id,
    product_id: original.product_id,
    owner_id: original.owner_id,
    is_active: false,
    schema: original.schema,
    theme: original.theme,
    settings: original.settings,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/formularios");
  return { success: true };
}

export async function createFormFolder(name: string) {
  const context = await getSessionContext();
  if (!context) return { error: "Não autenticado" };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("form_folders")
    .insert({ workspace_id: context.workspace.id, name })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/formularios");
  return { data };
}
