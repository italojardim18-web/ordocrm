/**
 * Símbolo e assinatura da ORDO.
 *
 * Construção conforme o brand book (05 / SÍMBOLO):
 *   - malha base 12 × 12
 *   - anel externo com espessura 8% da malha
 *   - anel interno com espessura 2,5%
 *   - dois eixos de corte alternados a 0° e 90°
 *   - centro vazio: "o campo de visão que surge quando o ruído é organizado"
 *
 * Regras de integridade respeitadas aqui: não girar, não distorcer, sem
 * gradientes e sem efeitos. O anel externo usa a cor corrente (`currentColor`)
 * e o interno usa brass, como no material original.
 */

const GRID = 12;
const OUTER_STROKE = GRID * 0.08; // 8%
const INNER_STROKE = GRID * 0.025; // 2,5%
const OUTER_RADIUS = 4.6;
const INNER_RADIUS = 2.9;

/** Comprimento de arco (em graus) removido em cada corte. */
const GAP = 26;

function arcDasharray(radius: number, gapDegrees: number) {
  const circumference = 2 * Math.PI * radius;
  const gap = (circumference * gapDegrees) / 360;
  const dash = circumference / 2 - gap;
  return `${dash} ${gap}`;
}

export function OrdoSymbol({
  className,
  title = "ORDO",
}: {
  className?: string;
  title?: string;
}) {
  const half = GRID / 2;

  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      {/* Anel externo: cortes no eixo 0° */}
      <circle
        cx={half}
        cy={half}
        r={OUTER_RADIUS}
        stroke="currentColor"
        strokeWidth={OUTER_STROKE}
        strokeDasharray={arcDasharray(OUTER_RADIUS, GAP)}
        strokeLinecap="butt"
      />
      {/* Anel interno: mesmos cortes girados 90°, em brass */}
      <circle
        cx={half}
        cy={half}
        r={INNER_RADIUS}
        stroke="var(--brass)"
        strokeWidth={INNER_STROKE}
        strokeDasharray={arcDasharray(INNER_RADIUS, GAP)}
        strokeLinecap="butt"
        transform={`rotate(90 ${half} ${half})`}
      />
    </svg>
  );
}

/**
 * Assinatura completa. `by Práxis Mentis` é assinatura de origem e nunca
 * compete por atenção — por isso vem menor, com menos peso e menos contraste.
 * Em escalas pequenas (`compact`), o brand book manda remover a assinatura em
 * vez de reduzi-la a ponto de comprometer a legibilidade.
 */
export function OrdoLockup({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <OrdoSymbol className="size-7 shrink-0" title="" />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl tracking-[0.16em] font-bold">ORDO CRM</span>
        {!compact ? (
          <span className="mt-1 text-[0.5rem] tracking-[0.12em] opacity-80 font-medium">
            by Práxis mentis
          </span>
        ) : null}
      </span>
    </span>
  );
}
