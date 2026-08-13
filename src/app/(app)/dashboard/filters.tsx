"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PERIOD_PRESETS } from "@/lib/crm/dashboard";
import { CHANNEL_LABELS } from "@/lib/format";
import type { Member, Product } from "@/lib/crm/types";
import { Label } from "@/components/ui/label";

/** Filtros globais: vivem na URL, então o estado é compartilhável e voltável. */
export function DashboardFilters({
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
      className="flex flex-wrap items-end gap-3"
      aria-busy={pending}
      data-pending={pending ? "" : undefined}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filterPeriod" className="text-xs">
          Período
        </Label>
        <select
          id="filterPeriod"
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
        <Label htmlFor="filterChannel" className="text-xs">
          Origem
        </Label>
        <select
          id="filterChannel"
          className={selectClass}
          value={searchParams.get("origem") ?? ""}
          onChange={(event) => update("origem", event.target.value)}
        >
          <option value="">Todas</option>
          {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filterProduct" className="text-xs">
          Produto
        </Label>
        <select
          id="filterProduct"
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
        <Label htmlFor="filterOwner" className="text-xs">
          Responsável
        </Label>
        <select
          id="filterOwner"
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
