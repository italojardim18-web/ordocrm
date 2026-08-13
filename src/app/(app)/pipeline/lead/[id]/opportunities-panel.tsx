"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createOpportunity,
  markOpportunityLost,
  registerSale,
  type CommercialState,
} from "./commercial-actions";
import type { LostReason, OpportunityRow, Product } from "@/lib/crm/types";
import { formatBRL, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OpportunitiesPanel({
  leadId,
  opportunities,
  products,
  lostReasons,
}: {
  leadId: string;
  opportunities: OpportunityRow[];
  products: Product[];
  lostReasons: LostReason[];
}) {
  const [saleOpen, setSaleOpen] = useState(false);
  const [saleOpportunityId, setSaleOpportunityId] = useState("");
  const [pending, startTransition] = useTransition();

  const [createState, createAction, creating] = useActionState<
    CommercialState,
    FormData
  >(
    async (prev, formData) => {
      const result = await createOpportunity(leadId, prev, formData);
      if (result.done) toast.success("Oportunidade criada.");
      return result;
    },
    {},
  );

  const [saleState, saleAction, selling] = useActionState<
    CommercialState,
    FormData
  >(
    async (prev, formData) => {
      const result = await registerSale(leadId, prev, formData);
      if (result.done) {
        toast.success("Venda registrada. Lead movido para Venda realizada.");
        setSaleOpen(false);
      }
      return result;
    },
    {},
  );

  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name ?? "Produto arquivado";

  const openOpportunities = opportunities.filter((o) => o.status === "open");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Oportunidades e vendas</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setSaleOpportunityId(openOpportunities[0]?.id ?? "");
              setSaleOpen(true);
            }}
          >
            Registrar venda
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={createAction} className="flex flex-wrap items-end gap-2">
          <div className="flex min-w-44 flex-1 flex-col gap-2">
            <Label htmlFor="oppProduct">Nova oportunidade</Label>
            <select
              id="oppProduct"
              name="productId"
              required
              defaultValue=""
              className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
            >
              <option value="" disabled>
                Produto…
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="oppValue">Valor potencial (R$)</Label>
            <Input
              id="oppValue"
              name="potentialValue"
              inputMode="decimal"
              className="w-32"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" disabled={creating}>
            {creating ? "Criando…" : "Adicionar"}
          </Button>
          {createState.error ? (
            <p role="alert" className="w-full text-sm text-destructive">
              {createState.error}
            </p>
          ) : null}
        </form>

        <ul className="flex flex-col gap-2 border-t pt-4">
          {opportunities.map((opportunity) => (
            <li
              key={opportunity.id}
              className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {productName(opportunity.product_id)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {opportunity.status === "won"
                    ? `Vendido por ${formatBRL(opportunity.sold_value)} em ${formatDate(opportunity.closed_at)}`
                    : opportunity.status === "lost"
                      ? `Perdida em ${formatDate(opportunity.closed_at)}`
                      : `Potencial: ${formatBRL(opportunity.potential_value)}`}
                  {opportunity.payment_method
                    ? ` · ${opportunity.payment_method}`
                    : ""}
                </p>
              </div>
              <Badge
                variant={
                  opportunity.status === "won"
                    ? "default"
                    : opportunity.status === "lost"
                      ? "destructive"
                      : "secondary"
                }
              >
                {opportunity.status === "won"
                  ? "Ganha"
                  : opportunity.status === "lost"
                    ? "Perdida"
                    : "Aberta"}
              </Badge>
              {opportunity.status === "open" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await markOpportunityLost(
                        opportunity.id,
                        leadId,
                        lostReasons[0]?.id ?? null,
                      );
                      if (result.error) toast.error(result.error);
                      else toast.success("Oportunidade marcada como perdida.");
                    })
                  }
                >
                  Marcar perdida
                </Button>
              ) : null}
            </li>
          ))}
          {opportunities.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Nenhuma oportunidade registrada.
            </li>
          ) : null}
        </ul>
      </CardContent>

      <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar venda</DialogTitle>
            <DialogDescription>
              A venda fecha a oportunidade e move o lead para a etapa de venda
              realizada, tudo na mesma transação.
            </DialogDescription>
          </DialogHeader>
          <form action={saleAction} className="flex flex-col gap-4">
            {openOpportunities.length > 0 ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="saleOpportunity">Oportunidade</Label>
                <select
                  id="saleOpportunity"
                  name="opportunityId"
                  value={saleOpportunityId}
                  onChange={(event) => setSaleOpportunityId(event.target.value)}
                  className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
                >
                  <option value="">Criar nova oportunidade</option>
                  {openOpportunities.map((opportunity) => (
                    <option key={opportunity.id} value={opportunity.id}>
                      {productName(opportunity.product_id)} —{" "}
                      {formatBRL(opportunity.potential_value)}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <Label htmlFor="saleProduct">Produto vendido *</Label>
              <select
                id="saleProduct"
                name="productId"
                required
                defaultValue={
                  openOpportunities[0]?.product_id ?? products[0]?.id ?? ""
                }
                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="saleValue">Valor vendido (R$) *</Label>
                <Input
                  id="saleValue"
                  name="soldValue"
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="salePayment">Forma de pagamento</Label>
                <Input
                  id="salePayment"
                  name="paymentMethod"
                  placeholder="Pix, cartão, boleto…"
                />
              </div>
            </div>
            {saleState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {saleState.error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSaleOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={selling}>
                {selling ? "Registrando…" : "Confirmar venda"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
