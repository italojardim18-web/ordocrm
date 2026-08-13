import { config } from "./config.js";

/**
 * Agendador da fila de saída.
 *
 * A ponte já precisa ficar sempre ligada, então ela mesma cutuca o ORDO para
 * processar mensagens pendentes. Evita depender de cron do sistema ou de
 * agendador da hospedagem — uma peça a menos para configurar e quebrar.
 */

let timer = null;

async function processarFila() {
  if (!config.jobsSecret) return;

  try {
    const resposta = await fetch(
      `${config.ordoUrl.replace(/\/$/, "")}/api/jobs/outbox`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${config.jobsSecret}` },
        signal: AbortSignal.timeout(45_000),
      },
    );

    if (!resposta.ok) {
      if (resposta.status === 401) {
        console.error("[fila] JOBS_SECRET não confere com o do ORDO");
      }
      return;
    }

    const resultado = await resposta.json();
    if (resultado.sent > 0 || resultado.failed > 0) {
      console.log(
        `[fila] enviadas: ${resultado.sent} · falhas: ${resultado.failed} · aguardando: ${resultado.skipped}`,
      );
    }
  } catch (erro) {
    // Silencioso: o ORDO pode estar reiniciando. A próxima rodada tenta de novo.
    if (erro.name !== "TimeoutError") {
      console.warn("[fila] não consegui falar com o ORDO:", erro.message);
    }
  }
}

export function iniciarAgendador() {
  if (!config.jobsSecret) {
    console.warn(
      "[fila] JOBS_SECRET ausente — o envio de mensagens ficará parado.\n" +
        "       Defina a mesma variável aqui e no ORDO.",
    );
    return;
  }

  console.log(
    `[fila] processando a cada ${config.outboxIntervalMs / 1000}s`,
  );
  timer = setInterval(processarFila, config.outboxIntervalMs);
  // Uma rodada logo de saída, para não esperar o primeiro intervalo.
  processarFila();
}

export function pararAgendador() {
  if (timer) clearInterval(timer);
}
