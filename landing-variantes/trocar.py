#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Coloca uma variante de landing page no ar.

    python3 landing-variantes/trocar.py editorial
    python3 landing-variantes/trocar.py conversao
    python3 landing-variantes/trocar.py                # mostra qual está no ar

A versão que estava no ar é sempre copiada para landing-variantes/_backup-<data>/
antes da troca, então nenhuma edição sua se perde.

A troca é feita só por sobrescrita: as duas variantes têm exatamente o mesmo
conjunto de arquivos, então nada precisa ser apagado. Isso faz o script
funcionar tanto no Mac quanto em pastas montadas onde apagar é proibido.
"""

import shutil
import sys
from datetime import datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
PROJETO = RAIZ.parent

DESTINO_COMPONENTES = PROJETO / "src" / "components" / "landing"
PAGINAS = {
    "home-page.tsx": PROJETO / "src" / "app" / "page.tsx",
    "ecossistema-page.tsx": PROJETO / "src" / "app" / "ecossistema" / "page.tsx",
    "planos-page.tsx": PROJETO / "src" / "app" / "planos" / "page.tsx",
}

VARIANTES = {
    "editorial": "Editorial — identidade do brand book ORDO (burgundy, Bodoni, sem gradiente nem emoji)",
    "conversao": "Conversão — versão original, com gradientes, emojis e apelo comercial direto",
}

ALIASES = {
    "brandbook": "editorial",
    "brand-book": "editorial",
    "brand book": "editorial",
    "ordo": "editorial",
    "nova": "editorial",
    "antiga": "conversao",
    "original": "conversao",
    "comercial": "conversao",
    "conversão": "conversao",
}

MARCADOR = RAIZ / ".no-ar"


def no_ar():
    if MARCADOR.exists():
        return MARCADOR.read_text(encoding="utf-8").strip()
    return "desconhecida"


def salvar_backup():
    carimbo = datetime.now().strftime("%Y%m%d-%H%M%S")
    destino = RAIZ / f"_backup-{carimbo}"
    (destino / "components").mkdir(parents=True, exist_ok=True)
    (destino / "app").mkdir(parents=True, exist_ok=True)

    for arquivo in sorted(DESTINO_COMPONENTES.glob("*.tsx")):
        shutil.copy2(arquivo, destino / "components" / arquivo.name)
    for nome, caminho in PAGINAS.items():
        if caminho.exists():
            shutil.copy2(caminho, destino / "app" / nome)

    return destino


def aplicar(variante):
    origem = RAIZ / variante
    if not origem.is_dir():
        sys.exit(f"Variante '{variante}' não encontrada em {RAIZ}")

    backup = salvar_backup()

    DESTINO_COMPONENTES.mkdir(parents=True, exist_ok=True)
    copiados = 0
    for arquivo in sorted((origem / "components").glob("*.tsx")):
        shutil.copyfile(arquivo, DESTINO_COMPONENTES / arquivo.name)
        copiados += 1

    for nome, caminho in PAGINAS.items():
        fonte = origem / "app" / nome
        if fonte.exists():
            caminho.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(fonte, caminho)
            copiados += 1

    MARCADOR.write_text(variante + "\n", encoding="utf-8")

    print(f"Landing '{variante}' no ar. {copiados} arquivos atualizados.")
    print(f"  {VARIANTES[variante]}")
    print(f"  Versão anterior guardada em: {backup.relative_to(PROJETO)}")
    print()
    print("Agora rode:  npm run dev   (ou npm run build)")


def main():
    if len(sys.argv) < 2:
        print(f"No ar agora: {no_ar()}\n")
        print("Variantes disponíveis:")
        for nome, descricao in VARIANTES.items():
            print(f"  {nome:12} {descricao}")
        print("\nUso: python3 landing-variantes/trocar.py <variante>")
        return

    variante = " ".join(sys.argv[1:]).strip().lower()
    variante = ALIASES.get(variante, variante)

    if variante not in VARIANTES:
        sys.exit(f"Variante desconhecida: {variante}. Use: {', '.join(VARIANTES)}")

    aplicar(variante)


if __name__ == "__main__":
    main()
