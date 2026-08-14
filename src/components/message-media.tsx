import { urlAssinada } from "@/lib/channels/media";

/**
 * Mídia dentro da bolha da conversa.
 *
 * O bucket é privado: cada arquivo é servido por URL assinada de curta
 * duração, gerada no servidor. Nada de link permanente de conversa de lead
 * circulando.
 */

export interface MediaProps {
  path: string | null;
  mime: string | null;
  filename: string | null;
  size: number | null;
  duration: number | null;
  /** Descrição textual para leitores de tela e para quando o arquivo falhar. */
  legenda?: string | null;
  transcript?: string | null;
  transcriptStatus?: string | null;
  transcriptError?: string | null;
}

function tamanhoLegivel(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function duracaoLegivel(segundos: number | null): string {
  if (!segundos) return "";
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function MessageMedia({
  path,
  mime,
  filename,
  size,
  duration,
  legenda,
  transcript,
  transcriptStatus,
  transcriptError,
}: MediaProps) {
  if (!path) {
    // Mídia que a ponte não conseguiu baixar: dizer isso é melhor do que
    // fingir que a mensagem estava vazia.
    return (
      <p className="text-sm italic opacity-80">
        [arquivo não recuperado do WhatsApp]
      </p>
    );
  }

  const url = await urlAssinada(path);
  if (!url) {
    return <p className="text-sm italic opacity-80">[arquivo indisponível]</p>;
  }

  const tipo = mime ?? "";

  if (tipo.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={legenda || filename || "Imagem recebida na conversa"}
        className="max-h-72 w-auto rounded-md"
      />
    );
  }

  if (tipo.startsWith("audio/")) {
    return (
      <div className="flex flex-col gap-1.5 max-w-72">
        <audio controls preload="none" src={url} className="w-full">
          Seu navegador não reproduz áudio.
        </audio>
        <div className="flex items-center justify-between text-[10px] opacity-70 px-0.5">
          {duration ? <span>{duracaoLegivel(duration)}</span> : <span />}
          {transcriptStatus === "pending" ? (
            <span className="italic">⏳ Transcrevendo...</span>
          ) : null}
        </div>
        {transcript ? (
          <div className="rounded bg-background/60 p-2 text-xs text-foreground shadow-2xs">
            <span className="mb-0.5 block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Transcrição
            </span>
            <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
          </div>
        ) : transcriptStatus === "failed" ? (
          <span className="text-[10px] text-muted-foreground italic" title={transcriptError ?? undefined}>
            [Transcrição falhou]
          </span>
        ) : null}
      </div>
    );
  }

  if (tipo.startsWith("video/")) {
    return (
      <video controls preload="none" src={url} className="max-h-72 rounded-md">
        Seu navegador não reproduz vídeo.
      </video>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 underline underline-offset-2"
    >
      📎 {filename || "Documento"}
      {size ? (
        <span className="text-[10px] opacity-70">{tamanhoLegivel(size)}</span>
      ) : null}
    </a>
  );
}
