import type { Stage, StageType } from "./types";

/**
 * Identifica se uma etapa representa perda/desistência/cancelamento,
 * considerando tanto o tipo semântico interno quanto variações comuns no nome visível.
 */
export function isStageLost(
  stage: { stage_type?: StageType | string; name?: string } | null | undefined,
): boolean {
  if (!stage) return false;
  if (stage.stage_type === "lost") return true;

  const name = (stage.name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  return (
    name.includes("perdid") ||
    name.includes("perda") ||
    name.includes("desist") ||
    name.includes("cancel") ||
    name.includes("sem interesse") ||
    name.includes("nao compareceu") ||
    name.includes("no show") ||
    name.includes("no-show") ||
    name.includes("recus") ||
    name.includes("lost") ||
    name.includes("descart")
  );
}
