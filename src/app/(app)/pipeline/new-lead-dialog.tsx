"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createLead, type CreateLeadState } from "./actions";
import type { Member, Product, Stage } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewLeadDialog({
  stages,
  products,
  members,
  defaultChannelConnectionId,
}: {
  stages: Stage[];
  products: Product[];
  members: Member[];
  defaultChannelConnectionId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [force, setForce] = useState(false);

  const firstStage = useMemo(
    () => stages.find((s) => s.stage_type === "new") ?? stages[0],
    [stages],
  );

  const [state, formAction, pending] = useActionState<
    CreateLeadState,
    FormData
  >(
    async (prev, formData) => {
      if (!firstStage) return { error: "Pipeline sem etapas." };
      const result = await createLead(firstStage.id, force, prev, formData);
      if (result.createdId) {
        toast.success("Lead criado.");
        setOpen(false);
        setForce(false);
      }
      return result;
    },
    {},
  );

  if (!firstStage) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setForce(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>Novo lead</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
          <DialogDescription>
            Cadastro mínimo — o restante é completado após o primeiro contato.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="hidden"
            name="channelConnectionId"
            value={defaultChannelConnectionId ?? ""}
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="leadName">Nome *</Label>
            <Input id="leadName" name="name" required maxLength={160} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadChannel">Canal</Label>
              <select
                id="leadChannel"
                name="channel"
                defaultValue="manual"
                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="form">Formulário</option>
                <option value="paid_traffic">Tráfego pago</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadPhone">Telefone/WhatsApp</Label>
              <Input id="leadPhone" name="phone" inputMode="tel" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadEmail">E-mail</Label>
              <Input id="leadEmail" name="email" type="email" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadValue">Valor potencial (R$)</Label>
              <Input id="leadValue" name="potentialValue" inputMode="decimal" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadProduct">Produto de interesse</Label>
              <select
                id="leadProduct"
                name="productId"
                defaultValue=""
                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
              >
                <option value="">Nenhum</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="leadOwner">Responsável</Label>
              <select
                id="leadOwner"
                name="ownerId"
                defaultValue=""
                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
              >
                <option value="">Ninguém</option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state.duplicates && state.duplicates.length > 0 ? (
            <div
              role="alert"
              className="flex flex-col gap-2 rounded-md border border-brass bg-muted p-3 text-sm"
            >
              <p className="font-medium">Possível duplicidade encontrada:</p>
              <ul className="list-inside list-disc">
                {state.duplicates.map((dup) => (
                  <li key={dup.id}>
                    <Link
                      href={`/pipeline/lead/${dup.id}`}
                      className="underline underline-offset-2"
                    >
                      {dup.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={force}
                  onChange={(event) => setForce(event.target.checked)}
                />
                Criar mesmo assim (não é a mesma pessoa)
              </label>
            </div>
          ) : null}

          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="self-start">
            {pending ? "Criando…" : "Criar lead"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
