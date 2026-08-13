"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import { saveProduct, setProductActive, type ProductState } from "./actions";
import type { Product } from "@/lib/crm/types";
import { formatBRL } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ProductForm({
  product,
  onSaved,
}: {
  product: Product | null;
  onSaved: () => void;
}) {
  const action = saveProduct.bind(null, product?.id ?? null);
  const [state, formAction, pending] = useActionState<ProductState, FormData>(
    async (prev, formData) => {
      const result = await action(prev, formData);
      if (result.done) {
        toast.success(product ? "Produto atualizado." : "Produto criado.");
        onSaved();
      }
      return result;
    },
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="productName">Nome</Label>
        <Input
          id="productName"
          name="name"
          defaultValue={product?.name ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productCategory">Categoria</Label>
        <select
          id="productCategory"
          name="category"
          defaultValue={product?.category ?? "terapia"}
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
        >
          <option value="terapia">Terapia</option>
          <option value="supervisao">Supervisão</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productDescription">Descrição curta</Label>
        <Input
          id="productDescription"
          name="description"
          defaultValue={product?.description ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productPrice">Preço padrão (R$, opcional)</Label>
        <Input
          id="productPrice"
          name="defaultPrice"
          inputMode="decimal"
          placeholder="0,00"
          defaultValue={
            product?.default_price != null
              ? product.default_price.toFixed(2).replace(".", ",")
              : ""
          }
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}

export function ProductManager({ products }: { products: Product[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Produtos aparecem nos interesses do lead e nas oportunidades.
        </p>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>Novo produto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar produto" : "Novo produto"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editing}
              onSaved={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <ul className="divide-y">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category === "terapia"
                      ? "Terapia"
                      : product.category === "supervisao"
                        ? "Supervisão"
                        : "Outro"}
                    {" · "}
                    {formatBRL(product.default_price)}
                  </p>
                </div>
                {!product.is_active ? (
                  <Badge variant="outline">Arquivado</Badge>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(product);
                    setDialogOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await setProductActive(product.id, !product.is_active);
                      toast.success(
                        product.is_active
                          ? "Produto arquivado."
                          : "Produto reativado.",
                      );
                    })
                  }
                >
                  {product.is_active ? "Arquivar" : "Reativar"}
                </Button>
              </li>
            ))}
          </ul>
          {products.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
