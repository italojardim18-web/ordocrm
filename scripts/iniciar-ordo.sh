#!/bin/bash
#
# Sobe a pilha do ORDO na ordem correta e mantém a ponte em primeiro plano.
# Chamado pelo LaunchAgent na inicialização do Mac.
#
# Ordem importa: Docker → banco → aplicação → ponte. A ponte é a última
# porque só faz sentido receber mensagem quando há para onde entregar.
# Mesmo assim ela guarda em disco o que não conseguir entregar.

set -u

export PATH="/opt/homebrew/bin:$HOME/.local/node24/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Segredos ficam fora do repositório, em ~/.ordo/env (chmod 600).
if [ -f "$HOME/.ordo/env" ]; then
  set -a
  . "$HOME/.ordo/env"
  set +a
fi

RAIZ="$HOME/ordo"
LOG="$HOME/Library/Logs/ordo"
mkdir -p "$LOG"

registrar() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

esperar_por() {
  # esperar_por <descrição> <segundos> <comando...>
  local desc="$1" limite="$2"; shift 2
  local passo=0
  while [ "$passo" -lt "$limite" ]; do
    if "$@" >/dev/null 2>&1; then
      registrar "$desc: pronto"
      return 0
    fi
    sleep 2
    passo=$((passo + 2))
  done
  registrar "$desc: NÃO subiu em ${limite}s"
  return 1
}

registrar "=== iniciando ORDO ==="

# 1) Docker (Colima) — o banco roda dentro dele
if ! colima status >/dev/null 2>&1; then
  registrar "subindo Colima…"
  colima start >>"$LOG/colima.log" 2>&1
fi
esperar_por "Colima" 180 colima status

# 2) Supabase local
cd "$RAIZ" || { registrar "pasta $RAIZ não encontrada"; exit 1; }
if ! curl -sf "http://127.0.0.1:54321/rest/v1/" -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" >/dev/null 2>&1; then
  registrar "subindo Supabase…"
  DOCKER_HOST="unix://$HOME/.colima/default/docker.sock" \
    supabase start >>"$LOG/supabase.log" 2>&1 &
fi
esperar_por "Supabase" 300 curl -sf "http://127.0.0.1:54321/rest/v1/"

# 3) Aplicação ORDO — modo produção: mais leve e estável que o dev
registrar "subindo a aplicação…"
if [ ! -d "$RAIZ/.next" ]; then
  registrar "sem build; compilando…"
  npm run build >>"$LOG/build.log" 2>&1
fi
npm run start >>"$LOG/app.log" 2>&1 &
APP_PID=$!
esperar_por "Aplicação" 120 curl -sf "http://localhost:3000/login"

# 4) Ponte do WhatsApp — fica em primeiro plano para o launchd supervisionar
registrar "subindo a ponte…"
cd "$RAIZ/bridge" || exit 1

encerrar() {
  registrar "encerrando…"
  kill "$APP_PID" 2>/dev/null
  exit 0
}
trap encerrar SIGINT SIGTERM

exec npm start
