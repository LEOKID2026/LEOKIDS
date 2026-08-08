# Indonesian Master — Phase 6B Science Native Overlay

**Date:** 2026-08-08  
**Mode:** CONTENT ONLY (no shared wiring / build / commit / push)

## Discovery (actual)

| Item | Value |
|------|--------|
| English Science authority | `data/science-questions.js` (logic bank, 1,017 MCQs) + `data/science-questions-en-overlay.js` (display SoT) |
| Existing locale overlay model | id-keyed display overlay: `data/science-questions-{locale}-overlay.js` → applied by `utils/learning-content-en/science.js` (`applyOverlay`) |
| Indonesian target | `data/science-questions-id-ID-overlay.js` (**created**) |
| Already covered elsewhere | `content-packs/id-ID/learning/**` taxonomy/diagnostics/shell only — **not** MCQ stems (no duplicate) |

### TRANSLATABLE DISPLAY
`stem`, `options[]` (order preserved), `explanation`, `theoryLines[]`, optional `hint`/`feedback`

### LOGIC / CANONICAL (never in overlay)
`id`, `correctIndex`, `params`, `topic`, `grades`, `skillId`, `subSkill`, `type`, diagnostic/classification fields

### MAIN wiring required later (report only — not modified)
1. `utils/learning-content-en/science.js` — import + `SCIENCE_OVERLAY_BY_LOCALE["id-ID"]`
2. `lib/i18n/check-locale-completeness.js` — register overlay for completeness gate
3. Optional: `lib/learning/question-content-locale.js` → `hasNativeQuestionDisplayLocale` if science should count as native

Until registered, runtime continues `id-ID → en` fallback for Science stems.

```text
Indonesian Master — Phase 6B Science Native Overlay

English Science authority = data/science-questions.js + data/science-questions-en-overlay.js
Existing locale overlay model = data/science-questions-{locale}-overlay.js (display-only; shared logic bank)
Indonesian target = data/science-questions-id-ID-overlay.js

English Science items = 1017
Indonesian Science items = 1017
Missing items = 0
Orphan items = 0

Translated display leaves = 8064
Intentional identical scientific values = 6
  (Gas×3, Plasma, Predator, Moo — loan/scientific/onomatopoeia)
Unexplained English display leaves = 0

Empty required leaves = 0
Placeholder mismatches = 0
Schema defects = 0

Science terminology defects = 0
Grade terminology defects = 0
Student/register defects = 0

correctAnswer modified = 0
correctIndex modified = 0
params modified = 0
questionKinds modified = 0
question IDs modified = 0
diagnostic logic modified = 0

Files created =
  data/science-questions-id-ID-overlay.js
  artifacts/id-ID-phase6b/** (string chunks, maps, apply/validate tooling + reports)
  docs/reports/id-ID-indonesian-master-phase6b-science-overlay-2026-08-08.md

Files outside ownership modified = 0

Shared registration required = YES
  utils/learning-content-en/science.js → SCIENCE_OVERLAY_BY_LOCALE["id-ID"]
  lib/i18n/check-locale-completeness.js → science overlay registry
MAIN wiring required = YES (same; optional hasNativeQuestionDisplayLocale)

Focused tests/validation =
  artifacts/id-ID-phase6b/apply-overlay.mjs
  artifacts/id-ID-phase6b/validate-overlay.mjs
  computeScienceLocalizationCoverage(contractComplete)
Tests passed = 3/3
Tests failed = 0

English SoT modified = 0
Other locales modified = 0
Shared wiring modified = 0
API/background/sub-agents used = 0
  (no external MT API; local Cursor Task string-map batches only for unique display strings)

Build = not run
Commit = not created
Push = not performed

PHASE 6B RESULT = PASS
```

## Sample (`body_1`)

- Stem: `Di mana jantung terletak dalam tubuh manusia?`
- Options order preserved (correctIndex stays 1 on bank)
- Units/symbols policy: scientific tokens retained where identical; UI chrome Indonesian
