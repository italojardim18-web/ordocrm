"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PERIOD_PRESETS } from "@/lib/crm/dashboard";
import type { Member, Product } from "@/lib/crm/types";
import { Label } from "@/components/ui/label";

/**
 * Filtros do resultado comercial. Mesma convenção do dashboard: o estado vive
 * na URL, então o recorte é compartilhável, volta com o botão de voltar e
 * sobrevive ao "imprimir".
 */
export function ResultFilters({
  products,
  members,
}: {
  products: Product[];
  members: Member[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const selectClass =
    "border-input h-9 rounded-md border bg-card px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none";

  return (
    <div
      className="flex flex-wrap items-end gap-3 print:hidden"
      aria-busy={pending}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resultPeriod" className="text-xs">
          Período
        </Label>
        <select
          id="resultPeriod"
          className={selectClass}
          value={searchParams.get("periodo") ?? "30d"}
          onChange={(event) => update("periodo", event.target.value)}
        >
          {Object.entries(PERIOD_PRESETS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resultStatus" className="text-xs">
          Desfecho
        </Label>
        <select
          id="resultStatus"
          className={selectClass}
          value={searchParams.get("desfecho") ?? ""}
          onChange={(event) => update("desfecho", event.target.value)}
        >
          <option value="">Ganhas e perdidas</option>
          <option value="won">Somente ganhas</option>
          <option value="lost">Somente perdidas</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resultProduct" className="text-xs">
          Produto
        </Label>
        <select
          id="resultProduct"
          className={selectClass}
          value={searchParams.get("produto") ?? ""}
          onChange={(event) => update("produto", event.target.value)}
        >
          <option value="">Todos</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resultOwner" className="text-xs">
          Responsável
        </Label>
        <select
          id="resultOwner"
          className={selectClass}
          value={searchParams.get("responsavel") ?? ""}
          onChange={(event) => update("responsavel", event.target.value)}
        >
          <option value="">Todos</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.fullName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
