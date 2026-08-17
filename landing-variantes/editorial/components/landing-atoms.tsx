/**
 * Átomos visuais compartilhados das landing pages do Ecossistema ORDO.
 *
 * Brand book 11 / LINGUAGEM GRÁFICA:
 *   01 — arcos como moldura, nunca como ruído
 *   02 — Brass reservado para eixos, chamadas e orientação
 *   03 — assimetria equilibrada e amplas áreas vazias
 *   04 — linhas têm função: conectar, separar ou indicar fluxo
 *
 * Nenhum gradiente, nenhum efeito, nenhum emoji: a hierarquia vem do tipo,
 * do espaço e da cor — nesta ordem.
 */

import { OrdoSymbol } from "@/components/ordo-mark";
import { cn } from "@/lib/utils";

/** Paleta oficial (brand book 08 / COR). Burgundy lidera. Brass orienta. */
export const ORDO = {
  burgundy: "#521D2A",
  burgundyDark: "#291015",
  parchment: "#F2EEE7",
  stone: "#B6AEA4",
  graphite: "#181716",
  brass: "#B2966F",
} as const;

/**
 * Campo de arcos: repetição com intenção, usado como moldura de fundo em
 * superfícies escuras. Sempre decorativo e sempre discreto.
 */
export function ArcField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -right-24 -top-24 flex gap-16 opacity-[0.06]">
        {[0, 1, 2].map((i) => (
          <OrdoSymbol key={i} className="size-64 text-[#F2EEE7]" title="" />
        ))}
      </div>
      <div className="absolute -bottom-32 -left-20 flex gap-16 opacity-[0.05]">
        {[0, 1].map((i) => (
          <OrdoSymbol key={i} className="size-72 text-[#F2EEE7]" title="" />
        ))}
      </div>
    </div>
  );
}

/**
 * Etiqueta de seção. Substitui os emojis por um eixo em brass — a linha
 * indica fluxo, exatamente como manda a linguagem gráfica.
 */
export function SectionLabel({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]",
        tone === "dark" ? "text-[#B2966F]" : "text-[#521D2A]",
        className
      )}
    >
      <span className="h-px w-8 bg-[#B2966F]" />
      {children}
    </span>
  );
}

/** Numeral editorial em Bodoni — usado no lugar de ícones decorativos. */
export function Numeral({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-heading text-2xl font-normal leading-none text-[#B2966F]", className)}>
      {children}
    </span>
  );
}

/** Marcador de item de lista: um traço curto em brass. Nunca um emoji. */
export function Tick({ tone = "brass" }: { tone?: "brass" | "burgundy" | "stone" }) {
  const color =
    tone === "brass" ? "bg-[#B2966F]" : tone === "burgundy" ? "bg-[#521D2A]" : "bg-[#B6AEA4]";
  return <span aria-hidden className={cn("mt-2 h-px w-3 shrink-0", color)} />;
}

/** Regra editorial: a linha que separa blocos de leitura. */
export function Rule({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block h-px w-full",
        tone === "dark" ? "bg-[#F2EEE7]/15" : "bg-[#181716]/10",
        className
      )}
    />
  );
}

/** Assinatura da marca: símbolo + wordmark, na hierarquia do brand book. */
export function BrandSignature({
  tone = "light",
  showParent = true,
}: {
  tone?: "light" | "dark";
  showParent?: boolean;
}) {
  const wordmark = tone === "light" ? "text-[#F2EEE7]" : "text-[#521D2A]";
  const parent = tone === "light" ? "text-[#F2EEE7]/55" : "text-[#181716]/55";

  return (
    <span className="flex items-center gap-3">
      <OrdoSymbol className={cn("size-8", tone === "light" ? "text-[#F2EEE7]" : "text-[#521D2A]")} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading text-xl font-normal tracking-[0.22em]", wordmark)}>
          ORDO
        </span>
        {showParent && (
          <span className={cn("mt-1 text-[9px] font-medium tracking-[0.18em] uppercase", parent)}>
            by Práxis Mentis
          </span>
        )}
      </span>
    </span>
  );
}
