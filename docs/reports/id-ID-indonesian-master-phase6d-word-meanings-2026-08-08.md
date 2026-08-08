# Indonesian Master — Phase 6D Word Meanings

**Date:** 2026-08-08  
**Scope:** Content-only Indonesian meanings for English Word Meanings. No locale-router / shared wiring.

## Authority (computed this phase)

| Item | Value |
|------|--------|
| Canonical lemma authority | `data/english-questions/word-lists.js` → `WORD_LISTS` |
| English meaning pack (incomplete SoT glosses) | `data/english-questions/word-meanings/en.js` → `WORD_MEANINGS_EN` (20 lists / **721** entries; missing `sight` + some lemmas) |
| Locale router | `data/english-questions/word-meanings-locale.js` (**not modified**) |
| Localized pack schema reference | e.g. `word-meanings/pt-BR.js` (schema only) |
| Indonesian target | `data/english-questions/word-meanings/id-ID.js` → `WORD_MEANINGS_ID_ID` |

**Canonical count used:** **21 lists / 745 list-lemma pairs** (matches full localized masters such as pt-BR; not the incomplete 721 EN meanings file).

Router contract today: `MEANING_PACKS` + `isLocalizedMeaningLocale` have **no** `id-ID`. Until MAIN wires, runtime falls through to the English lemma as the “meaning.”

## Semantic contract

- English **lemma keys** unchanged (what the child learns).
- Indonesian **gloss values** = child-friendly Bahasa Indonesia.
- No example-sentence field in this schema (lemma → string only).
- List-aware sense overrides where needed (e.g. `colors.orange` → oranye vs `food.orange` → jeruk; `weather.cold` → dingin vs `health.cold` → pilek; `animals.mouse` → tikus vs `technology.mouse` → mouse komputer).

```text
Indonesian Master — Phase 6D Word Meanings

Canonical authority = data/english-questions/word-lists.js (WORD_LISTS)
Locale router = data/english-questions/word-meanings-locale.js
Indonesian target = data/english-questions/word-meanings/id-ID.js

English entries = 745 (WORD_LISTS pairs; EN meanings file alone = 721 / incomplete)
Indonesian entries = 745
Missing lemmas = 0
Extra lemmas = 0
Duplicate lemmas = 0
Empty meanings = 0

Indonesian meanings translated = 745
English lemmas intentionally retained = 745 (all keys)
English-learning examples retained = 0 (no example field in schema)
Untranslated English definitions = 0
  (identical lemma=gloss only for intentional Indonesian loanwords: zebra, wifi, pizza, …)
Meaning fidelity defects = 0
Age/readability defects = 0

Canonical lemmas modified = 0
Question logic modified = 0

Files created =
  data/english-questions/word-meanings/id-ID.js
  artifacts/id-ID-phase6d/generate-id-ID-word-meanings.mjs
  artifacts/id-ID-phase6d/validate-id-ID-word-meanings.mjs
  artifacts/id-ID-phase6d/word-lists-lemmas.json
  artifacts/id-ID-phase6d/all-pairs.json
  artifacts/id-ID-phase6d/unique-lemmas.json
  artifacts/id-ID-phase6d/pairs.tsv
  artifacts/id-ID-phase6d/validation-final.json
  tests/i18n/id-ID-phase6d-word-meanings.test.mjs
  docs/reports/id-ID-indonesian-master-phase6d-word-meanings-2026-08-08.md

Files outside ownership modified = 0

Shared locale-router registration required = YES
MAIN wiring files =
  data/english-questions/word-meanings-locale.js
  - import WORD_MEANINGS_ID_ID from ./word-meanings/id-ID.js
  - MEANING_PACKS["id-ID"] = WORD_MEANINGS_ID_ID
  - isLocalizedMeaningLocale: add id-ID / id-id branch (and fallback chain mapping if needed)

Focused validation/tests =
  node artifacts/id-ID-phase6d/validate-id-ID-word-meanings.mjs
  node --test tests/i18n/id-ID-phase6d-word-meanings.test.mjs
Tests passed = validator PASS + node:test 6/6
Tests failed = 0

English SoT modified = 0
Other locales modified = 0
Shared wiring modified = 0
API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 6D RESULT = PASS
```

## Spot audit (natural Indonesian)

| Entry | Gloss |
|-------|--------|
| dog | anjing |
| apple | apel |
| orange (color) | oranye |
| orange (food) | jeruk |
| happy | senang |
| run | berlari |
| teacher | guru |
| climate_change | perubahan iklim |
| the (sight) | kata "the" (penunjuk benda) |
| and | dan |

## Non-goals confirmed

- No changes to `word-meanings-locale.js`
- No question-bank / stem / science / writing / content-pack / Help / SEO / API edits
- No build / commit / push
