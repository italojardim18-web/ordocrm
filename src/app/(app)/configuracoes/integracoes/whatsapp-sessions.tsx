"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SessionInfo {
  sessionId: string;
  estado: string;
  hasQr: boolean;
}

const BRIDGE_BASE = "/api/bridge";

const ESTADO_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  conectado: { label: "Conectado", variant: "default" },
  aguardando_qr: { label: "Aguardando QR", variant: "secondary" },
  reconectando: { label: "Reconectando…", variant: "outline" },
  desconectado: { label: "Desconectado", variant: "destructive" },
  iniciando: { label: "Iniciando…", variant: "outline" },
  sem_sessao: { label: "Sem sessão", variant: "outline" },
};

export function WhatsAppSessions() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSessionId, setNewSessionId] = useState("");
  const [adding, startAdding] = useTransition();
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${BRIDGE_BASE}/sessions`);
      if (!res.ok) throw new Error(`Ponte retornou ${res.status}`);
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao conectar com a ponte");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const timer = setInterval(fetchSessions, 5000);
    return () => clearInterval(timer);
  }, [fetchSessions]);

  // Busca QR de sessões que estão aguardando
  useEffect(() => {
    for (const s of sessions) {
      if (s.hasQr && !qrMap[s.sessionId]) {
        fetch(`${BRIDGE_BASE}/sessions/${s.sessionId}/qr`)
          .then((r) => r.json())
          .then((d) => {
            if (d.qr) {
              setQrMap((prev) => ({ ...prev, [s.sessionId]: d.qr }));
            }
          })
          .catch(() => {});
      }
      if (!s.hasQr && qrMap[s.sessionId]) {
        setQrMap((prev) => {
          const next = { ...prev };
          delete next[s.sessionId];
          return next;
        });
      }
    }
  }, [sessions, qrMap]);

  function handleAddSession() {
    const id = newSessionId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    if (!id) return;

    startAdding(async () => {
      try {
        await fetch(`${BRIDGE_BASE}/sessions/${id}/start`, { method: "POST" });
        setNewSessionId("");
        await fetchSessions();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao criar sessão");
      }
    });
  }

  async function handleStop(sessionId: string) {
    try {
      await fetch(`${BRIDGE_BASE}/sessions/${sessionId}/stop`, { method: "POST" });
      await fetchSessions();
    } catch { /* silent */ }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Conectando à ponte…</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-destructive">
          Não foi possível conectar à ponte: {error}
        </p>
        <p className="text-xs text-muted-foreground">
          Verifique se a ponte está rodando.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Sessões existentes */}
      {sessions.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {sessions.map((s) => {
            const estado = ESTADO_LABELS[s.estado] ?? ESTADO_LABELS.desconectado;
            return (
              <li
                key={s.sessionId}
                className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      📱 {s.sessionId === "principal" ? "Linha principal" : s.sessionId}
                    </span>
                    <Badge variant={estado.variant}>{estado.label}</Badge>
                  </div>
                  {s.estado === "conectado" ? (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleStop(s.sessionId)}
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      Desconectar
                    </Button>
                  ) : null}
                </div>

                {/* QR Code para escanear */}
                {qrMap[s.sessionId] ? (
                  <div className="flex flex-col items-center gap-2 rounded-md border bg-white p-4">
                    <img
                      src={qrMap[s.sessionId]}
                      alt={`QR code para parear ${s.sessionId}`}
                      className="size-48"
                    />
                    <p className="text-xs text-muted-foreground text-center max-w-64">
                      Abra o WhatsApp no celular → <strong>Configurações</strong> →{" "}
                      <strong>Aparelhos conectados</strong> → <strong>Conectar aparelho</strong> →
                      escaneie este QR.
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Nenhuma sessão de WhatsApp encontrada.
        </p>
      )}

      {/* Adicionar nova linha */}
      <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
        <Label htmlFor="newSessionId" className="text-xs font-medium text-muted-foreground">
          Adicionar nova linha de WhatsApp
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="newSessionId"
            placeholder="Ex.: secretaria, recepcao"
            value={newSessionId}
            onChange={(e) => setNewSessionId(e.target.value)}
            className="max-w-60"
          />
          <Button
            size="sm"
            onClick={handleAddSession}
            disabled={adding || !newSessionId.trim()}
          >
            {adding ? "Criando…" : "Adicionar linha"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Um novo QR code aparecerá para o celular dessa linha escanear.
        </p>
      </div>
    </div>
  );
}
