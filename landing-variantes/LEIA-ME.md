# Variantes de landing page — Ecossistema ORDO

Duas versões completas das landing pages `/`, `/ecossistema` e `/planos`.
Só uma fica no ar por vez; a outra espera aqui.

| Nome | O que é |
| --- | --- |
| **Editorial** | Identidade do brand book ORDO: burgundy lidera, brass orienta, Bodoni em peso normal, arcos do símbolo como moldura. Sem gradiente, sem emoji, sem glassmorphism. Voz calma — uma ideia por frase, um CTA primário por tela. |
| **Conversão** | Versão original: gradientes, emojis, badges coloridas, apelo comercial direto ("Pare de perder pacientes"). É a que estava no ar. |

Nas duas variantes os **preços, os links de WhatsApp, as âncoras** (`#crm`,
`#forms`, `#manager`), o seletor anual/mensal e o ScrollSpy são idênticos.
O que muda é a pele, não o conteúdo comercial.

## Como colocar uma no ar

```bash
cd ~/ordo
python3 landing-variantes/trocar.py editorial     # coloca a Editorial no ar
python3 landing-variantes/trocar.py conversao     # volta para a Conversão
python3 landing-variantes/trocar.py               # só mostra qual está no ar
```

O script sempre salva a versão que estava no ar em
`landing-variantes/_backup-<data>/` antes de trocar — nada se perde, mesmo se
você tiver editado alguma coisa depois.

Aliases aceitos: `brandbook` e `ordo` viram `editorial`; `antiga`, `original` e
`comercial` viram `conversao`.

Depois da troca, rode `npm run dev` (ou `npm run build`) para ver o resultado.

## Pedindo para mim

Basta dizer:

> **"coloque a landing Editorial no ar"**

ou

> **"coloque a landing Conversão no ar"**

que eu rodo a troca, confiro o typecheck e o lint, e te aviso.

## Estrutura

```
landing-variantes/
  editorial/
    components/   → vai para src/components/landing/
    app/          → home-page.tsx, ecossistema-page.tsx, planos-page.tsx
  conversao/
    components/
    app/
  trocar.py
  .no-ar          → guarda o nome da variante ativa
```

Um detalhe do funcionamento: a Editorial tem um arquivo a mais
(`landing-atoms.tsx`, com os átomos visuais compartilhados) e a Conversão não.
Por isso o script limpa a pasta `src/components/landing/` antes de copiar, em
vez de sobrescrever arquivo a arquivo.
