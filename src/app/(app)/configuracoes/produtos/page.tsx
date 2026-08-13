import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/crm/queries";
import { ProductManager } from "./product-manager";

export const metadata: Metadata = { title: "Produtos" };

export default async function ProductsPage() {
  const context = await requireAdmin();
  const products = await getProducts(context.workspace.id);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-primary">Produtos</h1>
      <ProductManager products={products} />
    </section>
  );
}
