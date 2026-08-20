"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120),
  category: z.string().trim().min(1, "Informe a categoria.").max(60),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  defaultPrice: z.string().optional(),
});

export interface ProductState {
  error?: string;
  done?: boolean;
}

function parsePrice(raw: string | undefined): number | null {
  if (!raw?.trim()) return null;
  const value = Number(raw.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function saveProduct(
  productId: string | null,
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const context = await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description") ?? "",
    defaultPrice: formData.get("defaultPrice") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    category: parsed.data.category,
    description: parsed.data.description || null,
    default_price: parsePrice(parsed.data.defaultPrice),
  };

  const { error } = productId
    ? await supabase
        .from("products")
        .update(payload)
        .eq("id", productId)
        .eq("workspace_id", context.workspace.id)
    : await supabase
        .from("products")
        .insert({ ...payload, workspace_id: context.workspace.id });

  if (error) return { error: "Não foi possível salvar o produto." };

  revalidatePath("/configuracoes/produtos");
  return { done: true };
}

export async function setProductActive(productId: string, active: boolean) {
  const context = await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ is_active: active })
    .eq("id", productId)
    .eq("workspace_id", context.workspace.id);
  revalidatePath("/configuracoes/produtos");
}
