# Indonesian Master — Phase 2B Learning & Student UI

**Date:** 2026-08-08  
**Scope:** Namespace translation only for `learning`, `worksheets`, `games`.  
**Ownership:** `locales/id-ID/{learning,worksheets,games}.json` only.

```text
Indonesian Master — Phase 2B Learning & Student UI

learning = locales/id-ID/learning.json (created; 617/617 leaves)
worksheets = locales/id-ID/worksheets.json (created; 334/334 leaves)
games = locales/id-ID/games.json (created; 80/80 leaves)

English source leaves = 1031
Indonesian target leaves = 1031
Missing keys = 0
Extra keys = 0
Empty leaves = 0
Placeholder mismatches = 0

Intentional English-learning leaves retained = 17
  (english.steps / english.mistakes grammar exemplars + writingCustomWordsPlaceholder "cat, dog";
   UI chrome around them is Indonesian; formulas/product titles counted separately)
Unexplained English UI leaves = 0

Grade terminology defects = 0  (Kelas 1–6; no Fase A/B/C)
Student terminology defects = 0  (murid; no siswa / peserta didik)
Game terminology defects = 0  (gim; no permainan / random game)
Worksheet terminology defects = 0  (lembar kerja)
Register defects = 0  (kamu / child-friendly; no Anda on owned surfaces)

Math/question logic modified = 0
Question banks modified = 0

Files created =
  locales/id-ID/learning.json
  locales/id-ID/worksheets.json
  locales/id-ID/games.json
  docs/reports/id-ID-indonesian-master-phase2b-learning-student-ui-2026-08-08.md
  artifacts/id-ID-phase2b/count-leaves.mjs
  artifacts/id-ID-phase2b/audit-parity.mjs
  artifacts/id-ID-phase2b/audit-english-exception.mjs
  artifacts/id-ID-phase2b/parity-audit.json
  artifacts/id-ID-phase2b/english-exception-audit.json

Files outside ownership modified = 0
  (did not touch common/ui/auth/validation/platform/reports/teacher/school/copilot/emails/legal/seo,
   content-packs, help-center, public SEO, English SoT, other locales, or load-messages.js)

Focused tests =
  tests/i18n/id-ID-wiring.test.mjs
  tests/i18n/message-loader.test.mjs
  artifacts/id-ID-phase2b/audit-parity.mjs (structure/placeholders/terminology)
  artifacts/id-ID-phase2b/audit-english-exception.mjs (English-subject exception)
Tests passed = 17/17 node:test + parity audit PASS + english-exception unexplained=0
Tests failed = 0

Pre-existing book-path failures modified = 0
English SoT modified = 0
Other locales modified = 0
Shared wiring modified = 0
  Note: LOCALE_BUNDLES["id-ID"] remains Object.freeze({}) from Phase 1;
  disk translations are ready; runtime merge still falls back to en until a later wiring owner registers the namespaces.
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 2B RESULT = PASS
```

## Terminology applied

| Locked EN | id-ID |
|-----------|-------|
| Grade | Kelas (Kelas 1…Kelas 6) |
| Student | murid |
| Worksheet | lembar kerja |
| Practice | latihan |
| Game | gim |
| Subject | mata pelajaran |
| Score | skor / nilai by context |

Student register: `kamu`, short natural imperatives (Pilih…, Coba lagi, Kerja bagus, Lanjut, Berikutnya, Periksa jawaban).

## English-subject exception

Retained English where it is the learning target (grammar exemplars `I/am/is/are`, spelling samples `cat, dog`). Surrounding instructions, feedback, navigation, and topic chrome are Indonesian (e.g. Fonik, Kosakata, Tata bahasa as topic labels).
