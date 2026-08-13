/** Dois períodos conflitam quando se sobrepõem em qualquer trecho. */
export function periodsOverlap(
  aStart: Date | string,
  aEnd: Date | string,
  bStart: Date | string,
  bEnd: Date | string,
): boolean {
  const as = new Date(aStart).getTime();
  const ae = new Date(aEnd).getTime();
  const bs = new Date(bStart).getTime();
  const be = new Date(bEnd).getTime();
  return as < be && bs < ae;
}

export interface BusyPeriod {
  start: string;
  end: string;
  label?: string;
}

/** Retorna os períodos que conflitam com o intervalo proposto. */
export function findConflicts(
  startsAt: string,
  endsAt: string,
  busy: BusyPeriod[],
): BusyPeriod[] {
  return busy.filter((period) =>
    periodsOverlap(startsAt, endsAt, period.start, period.end),
  );
}
