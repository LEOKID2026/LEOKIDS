# Global Subject Cleanup Report (Fast Track A)

**Date:** 2026-07-16  
**Scope only:** `LEO-KIDS-GLOBAL`  
**Not touched:** `LEO-KIDS`, `LEO-KIDS-WEB-TRY`, games/arcade/solo/educational-games, Supabase, Vercel, push/deploy

---

## 1. Git state before work

| Item | Value |
|------|--------|
| Path | `C:\Users\ERAN YOSEF\Desktop\final projects\FINAL-WEB\LEO-KIDS-FINAL\LEO-KIDS-GLOBAL` |
| Local `.git` | **Missing** at start (folder lived under parent `FINAL-WEB` repo) |
| Action | `git init -b main` in this folder |
| Branch | `main` |
| Secrets check | `.env*`, `.vercel/`, `node_modules/`, `.next/` gitignored — not staged |

## 2. Baseline commit

```text
1bfa240 chore: baseline global site before subject cleanup
```

## 3. Cleanup commit

```text
refactor: remove non-global learning subjects
```

(Created after this report is written and changes are staged.)

## 4. Subjects kept (4)

- `math`
- `geometry`
- `english`
- `science`

Confirm runtime allowlists:

- `LEARNING_SUBJECT_ALLOWLIST` → math, geometry, english, science  
- `SUBJECT_PERMISSION_KEYS` → math, geometry, english, science  
- `SUBJECT_IDS` (diagnostics) → math, geometry, english, science  

Master pages present: `math-master`, `geometry-master`, `english-master`, `science-master`.

## 5. Subjects removed (physical delete)

- `hebrew`
- `history`
- `moledet`
- `geography`
- `moledet_geography` / `moledet-geography`

## 6–7. Diff size (vs baseline)

From `git diff --shortstat` before cleanup commit:

```text
~1023 files changed, ~316 insertions(+), ~240683 deletions(-)
~927 deleted paths, ~96 modified paths
```

Bulk content removal is largely learning-book markdown + hebrew audio assets under `docs/learning-book/*` and `public/audio/*`.

## 8. Directories deleted (wholesale)

- `data/hebrew-questions/`
- `data/hebrew-literacy-g1` … `g6/`
- `data/geography-questions/`
- `data/history-questions/`
- `docs/learning-book/hebrew/`
- `docs/learning-book/history/`
- `docs/learning-book/moledet-geography/`
- `public/audio/learning-books/hebrew-g1/`
- `public/audio/learning-books/hebrew-g2/`
- `public/audio/hebrew/`

## 9. Routes deleted

**Learning masters**

- `/learning/hebrew-master`, `/learning/history-master`, `/learning/moledet-master`, `/learning/geography-master`, `/learning/moledet-geography-master`
- Matching `/student/learning/*-master` pages

**Practice**

- `/practice/hebrew`, `/practice/history`, `/practice/moledet`, `/practice/geography`

## 10. API routes deleted

- `pages/api/hebrew-audio-ensure.js`
- `pages/api/hebrew-audio-stream.js`
- `pages/api/hebrew-audio-artifact.js`
- `pages/api/hebrew-nakdan.js`

## 11. Question banks / generators deleted (representative)

- `utils/hebrew-question-generator.js`, `utils/hebrew-rich-question-bank.js`, related `utils/hebrew-*` subject engines
- `utils/moledet-geography-question-generator.js` + related `utils/moledet-geography-*`
- `utils/history-*` subject engines
- `data/hebrew-*` curricula/maps/ministry JSON
- `data/history-curriculum.js`, `data/moledet-*-curriculum.js`, `data/geography-subject-curriculum.js`
- Diagnostic taxonomies: `taxonomy-hebrew.js`, `taxonomy-history.js`, `taxonomy-moledet.js`

**Kept for shared Hebrew UI / math bidi (not deleted-subject engines):**  
`learning-mixed-hebrew-math*`, `hebrew-approved-verbal-master-contract.client.js`, spelling/nikud helpers used by kept masters, `prepare-hebrew-book-audio-text.js` (hyphen TTS helper for math/english books).

## 12. Learning books deleted

- Hebrew g1–g6 registries + resolvers + nav/practice maps  
- Moledet g2–g4, geography g5–g6, history g6 registries + moledet-geography book pipeline  
- Markdown under `docs/learning-book/{hebrew,history,moledet-geography}/`

## 13. Worksheets deleted / cleaned

Deleted:

- `lib/worksheets/worksheet-hebrew-*`
- Hebrew renderers under `components/worksheets/renderers/`
- Hebrew ready-catalog rows removed from `data/worksheets/ready-catalog.entries.js`

Kept: math, geometry, english (+ science remains an optional disabled print subject as before).

## 14. Tests deleted or adapted

Deleted e.g.:

- `tests/learning/hebrew-*`, `history-canonical-metadata`, `moledet-geography-canonical-metadata`
- `tests/worksheets/hebrew-*`
- `tests/classroom-activities/generate-hebrew-*`, `generate-moledet-geography-*`
- `tests/e2e/hebrew-final-visual-runtime-qa.spec.ts`

Adapted:

- Worksheet suite expectations (3 print cores)
- Master-path unit/e2e lists → kept subjects
- `tests/worksheets/run-all.mjs` (removed deleted file refs)

## 15. Build results

```text
npm run build → SUCCESS (exit 0)
Next.js 15.5.18 compiled successfully
```

## 16. Test results (local, no Supabase user creation)

| Suite | Result |
|-------|--------|
| `npm run test:worksheets` | **all passed** |
| `tests/learning/*canonical-metadata*` (math/geometry/english/science) | **34 pass / 0 fail** |
| `npm run test:diagnostic-engine-v2-harness` | Harness still includes historical hebrew/history/moledet **fixtures** that pass as no-op branches; kept subjects pass. Full fixture prune deferred (not required for app runtime). |

## 17. Remaining mentions of deleted subjects (classified)

| Kind | Examples | Action |
|------|----------|--------|
| Historical migrations / SQL seeds | `supabase/migrations/*`, `subject-grade-catalog-seed.sql` mentions | **Left untouched** (owner rule) |
| Plan / this report / GLOBALIZATION plan | docs | OK |
| Hebrew UI language / BIDI / TTS helpers | `*.he.js`, mixed-hebrew-math, game speech sanitize | OK — not learning subjects |
| Games | arcade/solo/edu | **Untouched** |
| Dev / QA scripts under `scripts/` | learning-simulator, some inventory scripts still name deleted modules | Not imported by Next app; prune later |
| Diagnostic harness fixtures | hebrew/history/moledet cases | May still pass with empty taxonomies; safe for now |

No active learning runtime import of deleted subject modules remains under `pages/`, `lib/`, `utils/`, `components/` (verified by missing-module scan + successful production build).

## 18. Confirmation — kept subjects active

Math, Geometry, English, Science remain in hubs, allowlists, diagnostics subject IDs, and master routes.

## 19. Confirmation — games untouched

`git diff` on:

- `components/arcade/`
- `components/solo-games/`
- `components/educational-games/`
- `pages/student/games/`
- `pages/student/arcade/`
- `pages/api/arcade/`
- `lib/arcade/`

→ **no changes**.

Accidentally deleted then restored: `scripts/qa/game-hebrew-*.mjs` (game QA, not subjects).

## 20. Confirmation — no push / deploy / Vercel / Supabase / IL site

- No `git push`
- No Vercel link/deploy
- No Supabase / SQL / migration edits
- No edits under sibling `LEO-KIDS` or `LEO-KIDS-WEB-TRY`

---

## Plan update

`GLOBALIZATION-AUDIT-AND-IMPLEMENTATION-PLAN.md` updated for Fast Track A:

- Four subjects including Science  
- Physical delete (not feature-flag hide) of Hebrew/History/Moledet/Geography  
- Games out of scope  
- No Supabase this round  
