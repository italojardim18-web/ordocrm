import type { LeadTemperature } from "./types";

export interface TemperatureInput {
  created_at: string;
  engaged_at?: string | null;
  last_interaction_at?: string | null;
  temperature_override?: LeadTemperature | null;
  temperature_override_at?: string | null;
  follow_up_at?: string | null;
}

export interface TemperatureResult {
  temperature: LeadTemperature;
  isOverride: boolean;
  reason: string;
}

export const TEMPERATURE_CONFIG: Record<
  LeadTemperature,
  {
    label: string;
    emoji: string;
    description: string;
    badgeClass: string;
  }
> = {
  hot: {
    label: "Quente",
    emoji: "🔥",
    description: "Contato recente ou em negociação ativa",
    badgeClass: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
  },
  warm: {
    label: "Morno",
    emoji: "🟡",
    description: "Contato regular nos últimos dias ou em follow-up",
    badgeClass: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:text-yellow-400",
  },
  cold: {
    label: "Frio",
    emoji: "❄️",
    description: "Sem interação há mais de uma semana ou sem resposta",
    badgeClass: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400",
  },
};

/**
 * Calcula a temperatura de um lead com base na atividade recente e histórico.
 * Se houver override manual humano, ele tem prioridade sobre a regra automática.
 */
export function computeLeadTemperature(
  lead: TemperatureInput,
  now: Date = new Date(),
): TemperatureResult {
  if (lead.temperature_override) {
    return {
      temperature: lead.temperature_override,
      isOverride: true,
      reason: "Definido manualmente pela equipe",
    };
  }

  const nowMs = now.getTime();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  // 1. Prioriza a última conversa/ligação real (last_interaction_at)
  if (lead.last_interaction_at) {
    const interactionMs = new Date(lead.last_interaction_at).getTime();
    const diffMs = Math.max(0, nowMs - interactionMs);
    const diffDays = Math.floor(diffMs / ONE_DAY);

    if (diffMs <= 48 * ONE_HOUR) {
      const hours = Math.max(1, Math.round(diffMs / ONE_HOUR));
      return {
        temperature: "hot",
        isOverride: false,
        reason: hours <= 24 ? "Conversou nas últimas 24h" : "Conversou nas últimas 48h",
      };
    }

    if (diffDays <= 7) {
      return {
        temperature: "warm",
        isOverride: false,
        reason: `Última conversa há ${diffDays} dia(s)`,
      };
    }

    return {
      temperature: "cold",
      isOverride: false,
      reason: `Sem contato há ${diffDays} dias`,
    };
  }

  // 2. Se não tem last_interaction_at registrado, usa engaged_at
  if (lead.engaged_at) {
    const engagedMs = new Date(lead.engaged_at).getTime();
    const diffMs = Math.max(0, nowMs - engagedMs);
    const diffDays = Math.floor(diffMs / ONE_DAY);

    if (diffMs <= 48 * ONE_HOUR) {
      return {
        temperature: "hot",
        isOverride: false,
        reason: "Engajou recentemente",
      };
    }

    if (diffDays <= 7) {
      return {
        temperature: "warm",
        isOverride: false,
        reason: `Engajamento há ${diffDays} dia(s)`,
      };
    }

    return {
      temperature: "cold",
      isOverride: false,
      reason: "Sem novas interações após engajamento",
    };
  }

  // 3. Lead recém-criado sem engajamento
  const createdMs = new Date(lead.created_at).getTime();
  const diffMs = Math.max(0, nowMs - createdMs);

  if (diffMs <= 24 * ONE_HOUR) {
    return {
      temperature: "warm",
      isOverride: false,
      reason: "Novo lead aguardando primeiro contato",
    };
  }

  return {
    temperature: "cold",
    isOverride: false,
    reason: "Lead sem resposta após criação",
  };
}
