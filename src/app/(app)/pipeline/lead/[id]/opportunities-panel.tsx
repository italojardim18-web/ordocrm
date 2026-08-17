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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const [saleProductId, setSaleProductId] = useState("");
  const [saleValue, setSaleValue] = useState("");
  const [salePayment, setSalePayment] = useState("");

  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [lostOpportunityId, setLostOpportunityId] = useState("");
  const [lostReasonId, setLostReasonId] = useState("");

  const [pending, startTransition] = useTransition();

  const [createState, createAction, creating] = useActionState<
    CommercialState,
    FormData
  >(
    async (prev, formData) => {
      const result = await createOpportunity(leadId, prev, formData);
      if (result.done) toast.success("Oportunidade de venda criada.");
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
        toast.success("🎉 Venda realizada com sucesso! Lead movido para Ganho.");
        setSaleOpen(false);
      }
      return result;
    },
    {},
  );

  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name ?? "Produto arquivado";

  const openOpportunities = opportunities.filter((o) => o.status === "open");

  function openSaleForOpportunity(opportunity?: OpportunityRow) {
    if (opportunity) {
      setSaleOpportunityId(opportunity.id);
      setSaleProductId(opportunity.product_id);
      setSaleValue(
        opportunity.potential_value !== null && opportunity.potential_value !== undefined
          ? String(opportunity.potential_value)
          : "",
      );
    } else {
      const firstOpen = openOpportunities[0];
      setSaleOpportunityId(firstOpen?.id ?? "");
      setSaleProductId(firstOpen?.product_id ?? products[0]?.id ?? "");
      setSaleValue(
        firstOpen?.potential_value !== null && firstOpen?.potential_value !== undefined
          ? String(firstOpen.potential_value)
          : "",
      );
    }
    setSalePayment("");
    setSaleOpen(true);
  }

  function openLostForOpportunity(opportunity: OpportunityRow) {
    setLostOpportunityId(opportunity.id);
    setLostReasonId(lostReasons[0]?.id ?? "");
    setLostDialogOpen(true);
  }

  function handleConfirmLost() {
    if (!lostOpportunityId) return;
    startTransition(async () => {
      const result = await markOpportunityLost(
        lostOpportunityId,
        leadId,
        lostReasonId || null,
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Oportunidade marcada como perdida.");
        setLostDialogOpen(false);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span>💼</span>
              <span>Oportunidades e Vendas</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Gerencie potenciais negócios, vendas realizadas e motivos de perda.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
            onClick={() => openSaleForOpportunity()}
          >
            <span>+</span>
            <span>Registrar Venda</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Formulário para Nova Oportunidade */}
        <form action={createAction} className="flex flex-wrap items-end gap-2 p-3 rounded-xl bg-muted/40 border border-border/60">
          <div className="flex min-w-44 flex-1 flex-col gap-1.5">
            <Label htmlFor="oppProduct" className="text-xs font-semibold">Nova Oportunidade (Produto/Serviço)</Label>
            <select
              id="oppProduct"
              name="productId"
              required
              defaultValue=""
              className="border-input h-9 rounded-md border bg-background px-3 text-xs shadow-xs"
            >
              <option value="" disabled>
                Selecione o produto…
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} {product.default_price ? `(${formatBRL(product.default_price)})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oppValue" className="text-xs font-semibold">Valor Potencial (R$)</Label>
            <Input
              id="oppValue"
              name="potentialValue"
              placeholder="0,00"
              inputMode="decimal"
              className="w-32 text-xs bg-background"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" disabled={creating} className="text-xs font-semibold">
            {creating ? "Adicionando…" : "+ Adicionar Potencial"}
          </Button>
          {createState.error ? (
            <p role="alert" className="w-full text-xs text-destructive mt-1">
              {createState.error}
            </p>
          ) : null}
        </form>

        {/* Lista de Oportunidades com Ações de Venda Realizada e Perdida */}
        <ul className="flex flex-col gap-3 border-t border-border/60 pt-3">
          {opportunities.map((opportunity) => {
            const isWon = opportunity.status === "won";
            const isLost = opportunity.status === "lost";
            const isOpen = opportunity.status === "open";

            return (
              <li
                key={opportunity.id}
                className={`flex flex-col gap-3 rounded-xl p-3.5 border transition-all ${
                  isWon
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : isLost
                      ? "bg-rose-500/5 border-rose-500/20 opacity-80"
                      : "bg-card border-border/80 shadow-2xs"
                }`}
              >
                {/* Cabeçalho do Card: Nome do Produto e Badge de Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {productName(opportunity.product_id)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {isWon
                        ? `Fechado por ${formatBRL(opportunity.sold_value)} em ${formatDate(opportunity.closed_at)}`
                        : isLost
                          ? `Perdida em ${formatDate(opportunity.closed_at)}`
                          : `Valor potencial: ${formatBRL(opportunity.potential_value)}`}
                      {opportunity.payment_method
                        ? ` · ${opportunity.payment_method}`
                        : ""}
                    </p>
                  </div>

                  <Badge
                    variant={
                      isWon
                        ? "default"
                        : isLost
                          ? "destructive"
                          : "secondary"
                    }
                    className={
                      isWon
                        ? "bg-emerald-600 text-white font-semibold text-[10px] shrink-0"
                        : isLost
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] shrink-0"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] shrink-0"
                    }
                  >
                    {isWon
                      ? "🎉 Venda Realizada"
                      : isLost
                        ? "❌ Perdida"
                        : "⏳ Em Negociação"}
                  </Badge>
                </div>

                {/* Botões de Ação para Oportunidade Aberta */}
                {isOpen ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs h-8 gap-1.5"
                      onClick={() => openSaleForOpportunity(opportunity)}
                    >
                      <span>🎉</span>
                      <span>Venda Realizada</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      className="text-xs text-muted-foreground hover:text-destructive hover:bg-rose-500/10 border-border/80 h-8 px-3"
                      onClick={() => openLostForOpportunity(opportunity)}
                    >
                      Marcar perdida
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}

          {opportunities.length === 0 ? (
            <li className="text-xs text-muted-foreground py-4 text-center">
              Nenhuma oportunidade de venda cadastrada para este lead.
            </li>
          ) : null}
        </ul>
      </CardContent>

      {/* Dialog para Registrar Venda Realizada */}
      <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <span>🎉</span>
              <span>Registrar Venda Realizada</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              A venda fecha a oportunidade como realizada e move o lead para a etapa de Venda Concluída no pipeline.
            </DialogDescription>
          </DialogHeader>

          <form action={saleAction} className="flex flex-col gap-4 pt-2">
            {openOpportunities.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="saleOpportunity" className="text-xs font-semibold">Oportunidade Vinculada</Label>
                <select
                  id="saleOpportunity"
                  name="opportunityId"
                  value={saleOpportunityId}
                  onChange={(event) => {
                    const oppId = event.target.value;
                    setSaleOpportunityId(oppId);
                    const opp = openOpportunities.find((o) => o.id === oppId);
                    if (opp) {
                      setSaleProductId(opp.product_id);
                      if (opp.potential_value) setSaleValue(String(opp.potential_value));
                    }
                  }}
                  className="border-input h-9 rounded-md border bg-background px-3 text-xs shadow-xs"
                >
                  <option value="">Registrar venda direta (nova oportunidade)</option>
                  {openOpportunities.map((opportunity) => (
                    <option key={opportunity.id} value={opportunity.id}>
                      {productName(opportunity.product_id)} — {formatBRL(opportunity.potential_value)}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="saleProduct" className="text-xs font-semibold">Produto / Serviço Vendido *</Label>
              <select
                id="saleProduct"
                name="productId"
                required
                value={saleProductId || openOpportunities[0]?.product_id || products[0]?.id || ""}
                onChange={(e) => setSaleProductId(e.target.value)}
                className="border-input h-9 rounded-md border bg-background px-3 text-xs shadow-xs"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="saleValue" className="text-xs font-semibold">Valor Vendido (R$) *</Label>
                <Input
                  id="saleValue"
                  name="soldValue"
                  inputMode="decimal"
                  placeholder="Ex: 350,00"
                  value={saleValue}
                  onChange={(e) => setSaleValue(e.target.value)}
                  required
                  className="text-xs bg-background"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="salePayment" className="text-xs font-semibold">Forma de Pagamento</Label>
                <Input
                  id="salePayment"
                  name="paymentMethod"
                  placeholder="Pix, Cartão, Boleto…"
                  value={salePayment}
                  onChange={(e) => setSalePayment(e.target.value)}
                  className="text-xs bg-background"
                />
              </div>
            </div>

            {saleState.error ? (
              <p role="alert" className="text-xs text-destructive">
                {saleState.error}
              </p>
            ) : null}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSaleOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={selling}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
              >
                {selling ? "Confirmando Venda…" : "🎉 Confirmar Venda Realizada"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para Marcar Oportunidade como Perdida */}
      <Dialog open={lostDialogOpen} onOpenChange={setLostDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <span>❌</span>
              <span>Marcar Oportunidade como Perdida</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informe o motivo de encerramento da oportunidade para análises estatísticas.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-2">
            {lostReasons.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lostReason" className="text-xs font-semibold">Motivo da Perda</Label>
                <select
                  id="lostReason"
                  value={lostReasonId}
                  onChange={(e) => setLostReasonId(e.target.value)}
                  className="border-input h-9 rounded-md border bg-background px-3 text-xs shadow-xs"
                >
                  <option value="">Sem motivo especificado</option>
                  {lostReasons.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Deseja confirmar a perda desta oportunidade?
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLostDialogOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={handleConfirmLost}
                className="text-xs font-semibold"
              >
                {pending ? "Salvando…" : "Confirmar Perda"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
