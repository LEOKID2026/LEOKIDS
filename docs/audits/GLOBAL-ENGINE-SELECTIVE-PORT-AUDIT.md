# Global Engine Selective Port Audit

**Status:** READ-ONLY audit complete. No cherry-pick. No production code changes. No commit / push / build / deploy.

| Field | Value |
|---|---|
| Source repo | `LEOKID2026/LIOSH-WEBSITE` (`liosh-source`) |
| Source tip | `3b9a89a6dad7fcf6764237df39898a68e7113c56` |
| Target repo | `LEOKID2026/LEOKIDS` |
| Target HEAD | `56564f4cb41c01657571cb1e9c3272ff9d92cba1` |
| Prior selective port | `60a0eaddcd5a746aa70ce701141dcf2a49be8079` (ancestor of HEAD) |
| Audit generated | 2026-07-26 (UTC) |
| Artifacts | CSVs + JSON in this folder |

---

## 0. Initial state gate

### Commands run

- `git fetch origin main`
- `git status --short`
- `git log -10 --oneline`
- Added/used read-only remote `liosh-source` → LIOSH-WEBSITE; fetched `main`
- No branch / ref mutations beyond fetch

### Worktree cleanliness

**Worktree is NOT clean** (pre-existing local residue; not modified by this audit):

| Path | State |
|---|---|
| `public/student/offline-precache-generated.js` | modified |
| `android/build/` | untracked |
| `docs/reports/` | untracked |
| `playwright.parent-demo.config.ts` | untracked |
| `scripts/port/` | untracked |
| `scripts/qa/acceptance-6d6df01-browser.mjs` | untracked |

Also created for this audit only (allowed read-only helper + deliverables):

- `scripts/audit/generate-global-engine-selective-port-audit.mjs`
- `docs/audits/global-engine-*.csv` / `.json` / this MD

**Implication:** future port work must not overwrite these local paths. Prefer a clean worktree or an isolated worktree before implementation.

---

## 1. Global product inventory (from code, not assumptions)

### 1.1 Active subjects

Authoritative product lists on global HEAD:

- `lib/learning/normalized-subject-practice.js` → `NORMALIZED_SUBJECT_IDS` / `POLICY_SUBJECT_IDS`: **math, geometry, english, science**
- `utils/detailed-parent-report.js` → `SUBJECT_IDS`: same four
- `lib/learning/subject-permissions/subject-key-map.js` + `mcq-subject-default-error-tags.js`: global product comment = four subjects only
- Curriculum: `curriculum/international/{math,geometry,english,science}/g1–g6.json`
- Taxonomy content packs: `content-packs/en/learning/taxonomy/{math,geometry,english,science}.content.json`

| subjectId | English name | Grades | Generator | Classifier | Taxonomy rows | Reports | Demo | State |
|---|---|---|---|---|---|---|---|---|
| math | Math | 1–6 | `utils/math-question-generator.js` | `math-numeric-classifier.js` | 10 | yes | yes | **active** |
| geometry | Geometry | 1–6 | `utils/geometry-question-generator.js` | math-numeric + MCQ + `taxonomy-geometry.js` | 8 | yes | yes | **active** |
| english | English | 1–6 | `utils/english-question-generator.js` | `english-typed-classifier.js` | 8 | yes | yes | **active** |
| science | Science | 1–6 | bank `data/science-questions.js` | **missing** `science-typed-classifier.js` (MCQ defaults only) | 8 | yes | yes | **active / partial** |
| history | History | n/a | none | none | 0 | stub keys only | no | **absent** |
| moledet-geography | Social Studies / Homeland | n/a | none | none | 0 | stub keys only | no | **absent** |
| hebrew | Hebrew | n/a | none | none | 0 | stub / leftover HE files | no | **absent** |

**Residue risk:** `display-level.js` still lists `hebrew` / `history` / `moledet*` in `ADVANCED_ALLOWED_SUBJECT_IDS`. `evidence-quality.js` and some integrity maps still mention Israeli subject ids. These must not be reactivated by an unfiltered master port.

Full matrix: `global-engine-subject-coverage-audit.csv`.

### 1.2 Locale architecture

| Area | Global reality |
|---|---|
| Primary locale | English (`content-packs/en/**`, burn-down copy) |
| Direction | LTR product; pseudo-RTL `ar-XB` tooling may exist; not Hebrew RTL product |
| Report copy | English packs + `parent-facing-error-pattern.js`; **Hebrew siblings still present** (e.g. `parent-facing-error-pattern-he.js`, `*He` fields in detailed report) |
| Demo | Localized public parent demo already on HEAD (`7c4993794`, `56564f4cb` nav fix); English demo UI packs |
| Dates | **`lib/learning-supabase/israel-calendar.server.js` still present** and used by parent report activity time, missions, coins, cron — Asia/Jerusalem. Demo paths tend toward UTC. **Policy inconsistency.** |
| Browser language | Must not assume Hebrew; port must use English i18n layers |

---

## 2. Relation to prior port `60a0eadd`

`60a0eadd` intentionally ported evidence-based engine slices for **math / geometry / English / science** and excluded Hebrew banks, Israeli subjects, and Israeli thresholds.

The 15 commits under review are **all after** the LIOSH tip that fed that port. Therefore:

- **Do not assume any of the 15 is fully already on global.**
- Blob identity check tip↔HEAD for changed paths: **0 identical files** (`A_already_equivalent = 0`).
- Earlier universal pieces from `60a0eadd` may still exist in older form; the **gaps below are real** on HEAD.

### Critical modules missing on global HEAD (present on source tip)

| Module | Source path | Gap |
|---|---|---|
| ADC V2 | `utils/action-decision-contract/action-decision-contract-v2.js` + public/executor/calibration/consumer/prerequisite | missing |
| Unified decision context | `utils/learning-pattern-decision/build-unified-decision-context.js` | missing |
| factualObservations builder | `utils/learning-pattern-decision/build-factual-observations.js` | missing |
| Compose finding | `compose-parent-finding-with-factual-observations.js` | missing |
| Display chrome | `utils/parent-report-surface/parent-topic-display-chrome.js` | missing |
| Fuzzy tolerance | `lib/learning/fuzzy-tolerance.js` (+ subject slices) | missing |
| Science typed classifier | `lib/learning/classifiers/science-typed-classifier.js` | missing |
| Demo/report rebuild | `lib/parent-server/rebuild-parent-report-from-aggregate.server.js` | missing |

---

## 3. Classification legend (mandatory)

| Code | Meaning |
|---|---|
| **A** `already_equivalent` | Same blob/behavior proven on global |
| **B** `universal_direct` | Locale-free engine logic; can port after subject filter |
| **C** `universal_with_locale_adaptation` | Structure OK; English/LTR/i18n adaptation required |
| **D** `subject_filtered` | Only for active global subjects / their topics |
| **E** `global_reimplementation` | Goal relevant; Israeli implementation must not be copied |
| **F** `israeli_only_skip` | Do not port |
| **G** `dependency_or_risk` | Needs missing modules or may break global behavior |

---

## 4. Aggregate file classification (15 commits)

Unique source paths in range: **257**. File×commit rows: **357**.

| Classification | Rows |
|---|---|
| B universal_direct | 164 |
| C universal_with_locale_adaptation | 75 |
| F israeli_only_skip | 52 |
| D subject_filtered | 42 |
| G dependency_or_risk | 23 |
| E global_reimplementation | 1 |
| A already_equivalent | **0** |

Among non-F rows: **188** paths exist on global (need diff port), **117** missing (need add or skip after inspection).

Full file matrix: `global-engine-selective-port-file-matrix.csv`.

---

## 5. Commit-by-commit map

Policy for all 15: **`canApplyAsUnit = false`**, **`needsSplitIntoNewGlobalCommits = true`**. Never cherry-pick IL SHAs onto LEOKIDS.

| # | SHA | Message (short) | Files | Verdict |
|---|---|---|---|---|
| 1 | `30ebd6ebe` | decision engine production integration | 117 | **Partial** — ADC V2 + runtime wiring core (B), subject masters filtered (D), HE/IL subjects/docs (F), missing hooks (G) |
| 2 | `d656f72ca` | RI0 maintenance neutral | 6 | **Partial / mostly B+C** — parent neutrality logic; adapt copy surface |
| 3 | `c0bc9878f` | ADC V2 legacy compatibility | 13 | **Partial / mostly B+C** — required with ADC stack; HE translations file → C/F |
| 4 | `03f6acdb6` | remediation + runtime integration | 42 | **Partial** — engine fixes B; Israeli residue F; deps G |
| 5 | `b272d5828` | cross-subject diagnostic evidence | 63 | **Partial** — math/geo/en/sci slices D/B; hebrew/history/moledet F |
| 6 | `313ad8359` | restore parent-report runtime deps | 7 | **Partial** — B/C restore missing report deps |
| 7 | `d26669ae3` | `no_clear_pattern` parent silence | 1 | **Partial / B** — silence rule is universal |
| 8 | `d0b64032d` | forbid engineDecision source literals | 1 | **Partial / C** — sanitization universal; copy path locale-aware |
| 9 | `6bafc6225` | restore approved «מה רואים» prefix | 1 | **IL copy / C→EN** — do not copy Hebrew; add English parent-safe prefix in i18n |
| 10 | `01f3235ce` | diagnostic runtime regression tests | 14 | **Partial** — port tests for global subjects only; skip HE fixtures |
| 11 | `503ca523c` | pin H-02 runtime fixture | 1 | **Risk / filter** — fixture module imports Hebrew banks; port only math/english fixture rows or rewrite global fixture |
| 12 | `21cf310f6` | approved Hebrew parent-facing copy | 28 | **Mostly C/F** — meaning → English packs; skip HE files |
| 13 | `726847121` | demo ↔ production decision pipeline | 9 | **Partial / C** — pipeline parity only; do not replace global EN demo packs with IL demo |
| 14 | `45d5d8046` | Israel date bounds + observed-pattern copy | 6 | **E + F + C** — **do not port `israel-calendar`**; design global date policy; EN pattern copy only |
| 15 | `3b9a89a6d` | factualObservations + topic status rules | 48 | **Partial / B+C+F** — builder/chrome/recurrence B; labels & report text C; IL audits/HE maps F |

Commit matrix: `global-engine-selective-port-commit-matrix.csv`.

### Coverage summary vs the 15

| Bucket | Count | Notes |
|---|---|---|
| Already fully covered on global | **0** | None of the 15 are tip-equivalent on HEAD |
| Fully portable as a single IL commit | **0** | Policy + mixed F/C content |
| Partially relevant (split required) | **15** | All need selective extraction |
| Israeli-only / skip-dominant intent | **~4** | #9 HE prefix, #11 H-02/HE fixture risk, #12 HE copy, #14 Israel dates (plus F slices inside #1/#5/#15) |

---

## 6. Special topics

### 6.1 ADC V2

| Capability | On global HEAD? |
|---|---|
| `action-decision-contract-v2` | **No** |
| `public-action-decision-v2` | **No** |
| Executors / student hooks / route sync | **No** |
| practice-more budget / prerequisite override | **No** |
| Legacy compatibility centralization (`c0bc9878f`) | **No** |

**Conclusion:** ADC stack from commits 1/3/4 is the largest universal gap after `60a0eadd`. Port as new focused global commits, wire only global masters, map HE parent ADC strings into English packs (C).

### 6.2 factualObservations / LPD

| Capability | On global HEAD? |
|---|---|
| `build-factual-observations` | **No** |
| Schema on LPD/EDC | **No** (needs port) |
| Compose parent finding | **No** |
| Alias aggregation + recurrence ladder | **No** (source tip) |
| regular / detailed / short parity | **No** for factualObservations |
| Display beside mastery/partial | **No** chrome module |

**Conclusion:** Universal structure (B) + English factual labels (C). Do **not** port the Hebrew 93-label map file.

### 6.3 93 labels → English factual pack

- Source map audited for global subjects → **76 tags** in `global-parent-factual-labels-audit.csv`
- Existing EN map (`parent-facing-error-pattern.js`) is largely **causal / unsafe** (“may be”, “foundational mix-up”, “difficulty seems…”)
- Stats: **5** seedable factual proposals; **71** still missing/unsafe/need rewrite
- Forbidden interpretive wording must not ship: confused / does not understand / guessed / careless / lacks foundation / has difficulty with
- Preferred style: *“Addition was used instead of subtraction”*, *“The answer differed by 1”*, …

### 6.4 Parent report UI chrome

Source chrome bands (neutral / remediate / maintain / advance) are product-universal. Global theme layer differs — port **meaning mapping**, not Israeli CSS wholesale. Module `parent-topic-display-chrome.js` is missing and should be adapted to global theme tokens.

### 6.5 Demo

Global already has localized public parent demo + EN packs + nav context fix.

Port only missing **pipeline parity** from `726847121` / rebuild helper:

- production decision parity
- factualObservations once builders exist
- report builders read-only behavior
- English copy only
- active subjects only

Do **not** copy Israeli demo activities or HE locale packs.

### 6.6 Dates

- **Do not port** `israel-calendar.server.js` as the global SSOT.
- Global currently **still depends** on Asia/Jerusalem in parent report activity time, missions, coins, cron — so the **date-boundary class of bug likely exists**, but the fix must be a **global reimplementation** (UTC vs user timezone vs locale timezone policy).
- Demo UTC vs production Jerusalem is already inconsistent.

### 6.7 Reports (regular / detailed / short)

Compare intent, not HE strings:

- Port contract/schema/sanitization/decision gating (B)
- Map every HE parent string to English i18n / burn-down / `parent-facing-error-pattern.js` factual pack (C)
- Skip `*he.js` and Israeli audit docs (F)

---

## 7. Proposed future global commit slices (after explicit approval)

Suggested focused commits (illustrative; not executed):

1. **ADC V2 core + legacy compat** (from #1/#3/#4, no HE translations file)
2. **Unified decision context + LPD gating + silence/literal fixes** (#2/#6/#7/#8)
3. **Fuzzy tolerance + subject classifiers** for math/geometry/english/science only (#5/#4 D)
4. **factualObservations builder + compose + chrome + EN factual labels** (#15 + label rewrite)
5. **Demo/report rebuild parity** (#13, EN only)
6. **Global date-boundary policy** (#14 as E — new design)
7. **Filtered regression tests** (#10; rewrite #11)

---

## 8. Equivalence / risk checks performed (read-only)

Allowed local scripts only; **no build**, no wide Playwright.

Checked:

- [x] Active subject registries vs stubs
- [x] Presence/absence of ADC / factualObservations / chrome / fuzzy / science classifier / rebuild
- [x] Blob identity tip↔HEAD for 15-commit paths (0 identical)
- [x] Prior port ancestry (`60a0eadd` ⊂ HEAD)
- [x] Hebrew leftover parent-facing files present
- [x] Israel timezone dependency still present
- [x] Unsafe English parent phrases in current EN map
- [x] Demo already localized (do not replace)
- [ ] Full engine decision / ADC output parity tests — **blocked until port**
- [ ] Playwright — not run (per instructions)

---

## 9. Risks before any implementation

1. Dirty worktree with unrelated local files.
2. ADC + hooks missing — largest functional gap; partial port can leave dead imports.
3. Enabling factualObservations without EN factual rewrite will ship causal/unsafe parent language.
4. Unfiltered masters can resurrect hebrew/history/moledet stubs.
5. Copying `israel-calendar` would entrench Asia/Jerusalem on a global product.
6. Fixture module for H-02 pulls Hebrew question banks — dependency risk.
7. Cherry-picking any of the 15 IL commits would violate locale/subject policy even when “mostly B”.

---

## 10. Stop point

Audit artifacts delivered. **Stopped.**

Awaiting explicit approval for a focused English-adapted global port (new commits on LEOKIDS, not cherry-picks of the 15).

### Deliverables

1. `docs/audits/GLOBAL-ENGINE-SELECTIVE-PORT-AUDIT.md` (this file)
2. `docs/audits/global-engine-selective-port-file-matrix.csv`
3. `docs/audits/global-engine-selective-port-commit-matrix.csv`
4. `docs/audits/global-engine-subject-coverage-audit.csv`
5. `docs/audits/global-parent-factual-labels-audit.csv`
6. `docs/audits/global-engine-selective-port-audit.json`
