import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Fila em disco para eventos que o ORDO ainda não aceitou.
 *
 * Sem isto, mensagem recebida enquanto o ORDO estiver fora do ar seria
 * perdida para sempre: o WhatsApp não reenvia histórico para dispositivo
 * conectado. Com a ponte iniciando junto com o Mac, essa janela é garantida —
 * o ORDO demora mais para subir do que a sessão do WhatsApp para conectar.
 */

const DIR = process.env.BRIDGE_SPOOL_DIR ?? "./spool";

async function garantirPasta() {
  await mkdir(DIR, { recursive: true });
}

/** Guarda um envelope que não pôde ser entregue. */
export async function guardar(envelope) {
  await garantirPasta();
  const nome = `${Date.now()}-${randomUUID().slice(0, 8)}.json`;
  await writeFile(join(DIR, nome), JSON.stringify(envelope), "utf8");
  console.warn(`[spool] evento guardado em disco (${nome})`);
}

/**
 * Tenta entregar tudo que está guardado, em ordem cronológica.
 * Só apaga o arquivo depois da entrega confirmada.
 */
export async function drenar(entregar) {
  await garantirPasta();

  let arquivos;
  try {
    arquivos = (await readdir(DIR)).filter((n) => n.endsWith(".json")).sort();
  } catch {
    return { entregues: 0, pendentes: 0 };
  }

  if (arquivos.length === 0) return { entregues: 0, pendentes: 0 };

  let entregues = 0;

  for (const arquivo of arquivos) {
    const caminho = join(DIR, arquivo);
    let envelope;

    try {
      envelope = JSON.parse(await readFile(caminho, "utf8"));
    } catch {
      // Arquivo corrompido não trava a fila: sai do caminho.
      console.warn(`[spool] ${arquivo} ilegível, descartando`);
      await unlink(caminho).catch(() => {});
      continue;
    }

    const resultado = await entregar(envelope);
    if (resultado.ok || resultado.unrecoverable) {
      await unlink(caminho).catch(() => {});
      if (resultado.ok) entregues += 1;
    } else {
      break; // ORDO ainda indisponível (ex: servidor desligado ou erro 500)
    }
  }

  const pendentes = arquivos.length - entregues;
  if (entregues > 0) {
    console.log(
      `[spool] ${entregues} evento(s) entregues; ${pendentes} na espera`,
    );
  }

  return { entregues, pendentes };
}
