"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  setLeadInterests,
  updateLead,
  type SimpleState,
} from "../../actions";
import type { LeadDetail, Product } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadProfileForm({
  lead,
  products,
  interests,
}: {
  lead: LeadDetail;
  products: Product[];
  interests: string[];
}) {
  const [state, formAction, pending] = useActionState<SimpleState, FormData>(
    async (prev, formData) => {
      const result = await updateLead.bind(null, lead.id)(prev, formData);
      if (result.done) toast.success("Cadastro atualizado.");
      return result;
    },
    {},
  );

  const [selected, setSelected] = useState<Set<string>>(new Set(interests));
  const [savingInterests, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form action={formAction} className="flex flex-col gap-4">
          <div
            className="flex flex-col gap-3"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" name="name" defaultValue={lead.name} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="socialName">Nome social</Label>
              <Input
                id="socialName"
                name="socialName"
                defaultValue={lead.social_name ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefone/WhatsApp</Label>
              <Input
                id="phone"
                name="phone"
                inputMode="tel"
                defaultValue={lead.phone ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={lead.email ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" defaultValue={lead.city ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">UF</Label>
              <Input
                id="state"
                name="state"
                maxLength={2}
                defaultValue={lead.state ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contactPreference">Preferência de contato</Label>
              <Input
                id="contactPreference"
                name="contactPreference"
                placeholder="WhatsApp, ligação, e-mail…"
                defaultValue={lead.contact_preference ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="potentialValue">Valor potencial (R$)</Label>
              <Input
                id="potentialValue"
                name="potentialValue"
                inputMode="decimal"
                defaultValue={
                  lead.potential_value != null
                    ? lead.potential_value.toFixed(2).replace(".", ",")
                    : ""
                }
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="sourceDetail">Origem detalhada</Label>
              <Input
                id="sourceDetail"
                name="sourceDetail"
                defaultValue={lead.source_detail ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="nextAction">Próxima ação</Label>
              <Input
                id="nextAction"
                name="nextAction"
                defaultValue={lead.next_action ?? ""}
              />
            </div>
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="self-start">
            {pending ? "Salvando…" : "Salvar cadastro"}
          </Button>
        </form>

        <div className="flex flex-col gap-3 border-t pt-4">
          <p className="text-sm font-medium">Produtos de interesse</p>
          <div className="flex flex-col gap-2">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.has(product.id)}
                  onChange={(event) => {
                    setSelected((current) => {
                      const next = new Set(current);
                      if (event.target.checked) next.add(product.id);
                      else next.delete(product.id);
                      return next;
                    });
                  }}
                />
                {product.name}
              </label>
            ))}
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum produto ativo cadastrado.
              </p>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            disabled={savingInterests}
            onClick={() =>
              startTransition(async () => {
                await setLeadInterests(lead.id, Array.from(selected));
                toast.success("Interesses atualizados.");
              })
            }
          >
            {savingInterests ? "Salvando…" : "Salvar interesses"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
