import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PublicForm } from "./public-form";

export const metadata: Metadata = {
  title: "Contato",
  robots: { index: false },
};

async function getEndpoint(slug: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("form_endpoints")
    .select(
      "id, workspace_id, name, headline, description, success_message, is_active, schema, theme, settings",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!data?.is_active) return null;

  const { data: branding } = await admin
    .from("workspace_branding")
    .select("display_name")
    .eq("workspace_id", data.workspace_id)
    .maybeSingle();

  return { endpoint: data, brandName: branding?.display_name ?? null };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getEndpoint(slug);
  if (!result) notFound();

  const { endpoint, brandName } = result;

  return (
    <div className="flex min-h-svh flex-col items-center bg-primary px-4 py-10">
      <main className="w-full max-w-md">
        <header className="mb-6 text-center">
          {brandName ? (
            <p className="mb-2 text-xs tracking-[0.25em] text-primary-foreground/70 uppercase">
              {brandName}
            </p>
          ) : null}
          <h1 className="text-2xl font-light text-primary-foreground">
            {endpoint.headline ?? endpoint.name}
          </h1>
          {endpoint.description ? (
            <p className="mt-2 text-sm text-primary-foreground/80">
              {endpoint.description}
            </p>
          ) : null}
        </header>

        <PublicForm
          slug={slug}
          endpoint={endpoint as any}
          brandName={brandName}
          successMessage={endpoint.success_message ?? endpoint.schema?.thankyou?.title ?? "Recebemos seu contato!"}
        />
      </main>
    </div>
  );
}
