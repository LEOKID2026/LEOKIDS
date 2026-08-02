# Writing-pack requirements for de-DE (shared wiring still required)

Do **not** edit `data/writing/word-packs.locale.js` in the content-only layer.
This document specifies the exact German (Germany) chrome strings the main agent should
wire into `PACK_TITLE_DE_DE` / `COLOR_INSTRUCTION_DE_DE` maps, mirroring the existing
`PACK_TITLE_PT_PT` / `PACK_TITLE_ES_419` pattern in that file.

## Pack titles (chrome only; English learning words stay English)

| pack id | German (Germany) title |
|---------|-------------------------|
| colors | Farben |
| animals | Tiere |
| family | Familie |
| food | Lebensmittel |
| school | Schule |
| body | Körper |
| home | Haus |
| nature | Natur |
| transport | Verkehrsmittel |
| numbers | Zahlen |
| cvc | CVC-Wörter |
| sight | Häufige Wörter |

## CVC label decision

Use product label **`CVC-Wörter`**.

- Clear and short in the Leo Kids UI, consistent with the pt-PT/es-419 pattern
  (`Palavras CVC` / `Palabras CVC`) — keeps the English abbreviation "CVC"
  (Konsonant-Vokal-Konsonant) since it is a literacy-teaching term, not prose.
- Optional longer helper (tooltip / help only):
  `Wörter nach dem Muster Konsonant–Vokal–Konsonant`.

## "Sight words" label decision

Use product label **`Häufige Wörter`** (literally "frequent/common words" — the
standard German term for high-frequency sight words in early literacy).

## Color instructions (colors pack)

| EN | DE |
|----|----|
| Color in red | Male rot aus |
| Color in blue | Male blau aus |
| Color in green | Male grün aus |
| Color in yellow | Male gelb aus |
| Color in orange | Male orange aus |
| Color in purple | Male lila aus |
| Color in pink | Male rosa aus |
| Color in black | Male schwarz aus |

## Writing chrome verbs (child "du")

- Schreibe
- Spure nach
- Male aus

## Wiring instructions for the main agent

Wire via shared `PACK_TITLE_DE_DE` + `COLOR_INSTRUCTION_DE_DE` maps and locale chain
`de-DE → en`, following the exact pattern of `PACK_TITLE_PT_PT` /
`COLOR_INSTRUCTION_PT_PT` in `data/writing/word-packs.locale.js`:

```js
const PACK_TITLE_DE_DE = Object.freeze({
  colors: "Farben",
  animals: "Tiere",
  family: "Familie",
  food: "Lebensmittel",
  school: "Schule",
  body: "Körper",
  home: "Haus",
  nature: "Natur",
  transport: "Verkehrsmittel",
  numbers: "Zahlen",
  cvc: "CVC-Wörter",
  sight: "Häufige Wörter",
});

const COLOR_INSTRUCTION_DE_DE = Object.freeze({
  "Color in red": "Male rot aus",
  "Color in blue": "Male blau aus",
  "Color in green": "Male grün aus",
  "Color in yellow": "Male gelb aus",
  "Color in orange": "Male orange aus",
  "Color in purple": "Male lila aus",
  "Color in pink": "Male rosa aus",
  "Color in black": "Male schwarz aus",
});
```

Add an `isDeDe(locale)` helper (mirrors `isPtPt`/`isPtBr`) and extend the
`resolveWritingWordPacks` ternary chain with the `de-DE` case, resolving
`titles`/`colorMap` the same way pt-PT/pt-BR/es-419 are resolved today.
English learning words (`text` field) must remain unchanged for de-DE — only
`title`/`titleHe` chrome and `colorInstruction`/`colorInstructionHe` chrome change.
