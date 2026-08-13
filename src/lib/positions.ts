/**
 * Posições fracionárias do Kanban: inserir entre dois cards usa a média,
 * no topo usa (menor - passo), no fim usa (maior + passo).
 */
const STEP = 1000;

export function positionBetween(
  before: number | null,
  after: number | null,
): number {
  if (before === null && after === null) return STEP;
  if (before === null) return (after as number) - STEP;
  if (after === null) return before + STEP;
  return (before + after) / 2;
}

/** Posição para um novo card no topo da coluna. */
export function positionForTop(first: number | null): number {
  return positionBetween(null, first);
}

/** Posição para um card ao final da coluna. */
export function positionForBottom(last: number | null): number {
  return positionBetween(last, null);
}
