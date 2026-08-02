# 2. Klasse Math Learning Book — Drafts

**Status:** All batches authored — **22 / 22** draft pages complete (Batches A + B + C + D). Full review polish pass applied (June 2026). Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/math/g2/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/MATH_GRADE_2_lernenING_BOOK_PLAN.md` |
| UI style lock | ✅ `docs/Learning-book/MATH_lernenING_BOOK_UI_STYLE_LOCK.md` |
| Draft markdown pages | ✅ **22 / 22** (Batches A + B + C + D) |
| Batch A polish pass | ✅ Applied (June 2026) |
| Batch B polish pass | ✅ Applied (June 2026) |
| Batch C authoring | ✅ Complete + polish pass applied (June 2026) |
| Batch D authoring | ✅ Complete (June 2026) — owner review pending |
| Full review polish pass | ✅ Applied (June 2026) |
| Runtime registry | ✅ `lib/learning-book/math-g2-registry.js` |
| Page loader | ✅ `lib/Learning-book/load-math-g2-pages.js` |
| App route `/Learning/book/math/g2` | ✅ Implemented (dev preview) |
| üben CTA relöser (G2) | ✅ `lib/Learning-book/relöse-math-g2-üben-target.js` |
| Book page relöser (G2) | ✅ `lib/Learning-book/relöse-math-g2-book-page.js` |
| Math Master book entry | ✅ General tile + topic + in-Learning buttons (g2) |
| Verification script | ✅ `scripts/verify-math-g2-book.mjs` |

---

## Owner Decisions (Recorded — June 2026)

| Topic | Decision |
|-------|----------|
| UI / lieser | Reuse 1. Klasse book lieser — no redesign |
| `divisibility` | **2, 5, 10 only** in G2; child-facing last-digit rules; no 3/6/9 |
| Fractions (Batch C) | **Visual only** — half and quarter; no fraction arithmetic |
| `frac_*_reverse` | Verdoppeln (Hälfte) oder 4 gleiche Teile (Viertel), um das Ganze zu finden |
| `wp_time_date` / `wp_time_days` | **Weekdays only** for G2 (Batch D) |
| `wp_coins` | Simple gleich groups / multiplication allowed (Batch D) |

---

## Source of Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 22 2. Klasse Math `skill_id` entries |
| `docs/Learning-book/MATH_GRADE_2_lernenING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Page types und wide-span rules |
| `docs/Learning-book/MATH_lernenING_PAGE_TEMPLATE.md` | Seven-section Grades 1–2 template |
| `docs/Learning-book/MATH_lernenING_BOOK_UI_STYLE_LOCK.md` | lieser UX — reuse 1. Klasse |
| `utils/math-constants.js` | 2. Klasse number ranges and allowed operations |
| `docs/Learning-book/math/g1/drafts/` | **Style reference only** |

---



**Status:** ✅ Draft complete + polish pass applied

| Datei | Entwurfstitel |
|------|-------------|






---



**Status:** ✅ Draft complete + polish pass applied

| Datei | Entwurfstitel |
|------|-------------|







---



**Status:** ✅ **Draft complete + polish pass applied** (June 2026) — owner review pending

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|






All Batch C pages:

- `subject`: math · `grade`: g2 · `age_band`: Klassen_1_2 · `approval_status`: **draft**

- All Hebrew titles: **`[DRAFT — not owner-approved]`**

### Batch C polish pass (June 2026)

| Fix | Detail |
|-----|--------|




### Batch C content scope notes







### Batch C section 5 / 6 alignment

| Seite | Abschnitt 5 (selbst versuchen) | Abschnitt 6 (Fehler) |
|------|-------------------|---------------------|
| `divisibility` | 35 — divide by 2, 5, 10? | 35 confused with ÷10 |





---



**Status:** ✅ **Draft complete** (June 2026) — owner review pending

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|







All Batch D pages:

- `subject`: math · `grade`: g2 · `age_band`: Klassen_1_2 · `approval_status`: **draft**

- All Hebrew titles: **`[DRAFT — not owner-approved]`**


### Batch D content scope notes

- `wp_coins`: ₪ whole Euro only; single-step totals; gleich groups / multiplication OK (e.g. 4 × 5); up ~100; no agorot, no multi-step money
- `wp_coins_spent`: bezahlt − Preis = Wechselgeld; ein Schritt; ein Kauf; bis etwa 100; keine Cent
- `wp_time_date`: **weekdays only**; forward/back day jumps; no clock, month, calendar, or year arithmetic
- `wp_time_days`: zählen jumps between weekdays; **do nicht zählen start day as first jump**; no clock oder calendar dates
- `wp_groups_g2`: gleich-groups multiplication stories; one-step; Teiler within G2; cross-link to Batch B `mul`; no division here
- `wp_division_simple`: equal-sharing stories; one-step; kein Rest; cross-link to Batch B `div`; no long division

### Batch D section 5 / 6 alignment

| Seite | Abschnitt 5 (selbst versuchen) | Abschnitt 6 (Fehler) |
|------|-------------------|---------------------|
| `wp_coins` | 3 coins × 10 ₪ = ? | zählened 3 instead of 3 × 10 = 30 |
| `wp_coins_spent` | bezahlt 40, Preis 28 → Wechselgeld? | 40 − 20 = 20 (teilweise subtrahiert) |
| `wp_time_date` | Wed + 2 days → ? | stopped at Thu (1 jump) not Fri |
| `wp_time_days` | Mon → Fri, wie viele days? | counted Mon oder stopped at Thu (3 nicht 4) |
| `wp_groups_g2` | 6 bags × 3 apples = ? | 6 + 3 = 9 instead of 6 × 3 = 18 |
| `wp_division_simple` | 20 stickers ÷ 5 kids = ? | 20 − 5 = 15 instead of 20 ÷ 5 = 4 |

---

## Batch Plan (complete)

**Total pages: 22 — all drafted**

| Batch | Title (draft) | Pages | Status |
|-------|---------------|-------|--------|





---

## Full review polish pass (June 2026)

Mandatory Hebrew/content fixes von full review pack review, before implementation:

| Page | Fix |
|------|-----|




**Status unchanged:** **22 / 22** pages drafted · all `approval_status: draft`.

---

## Site implementation (June 2026)

2. Klasse book connected site für **dev preview** — reuses 1. Klasse lieser UX exactly (`MathG2BookShell`, shared `lerneningPageBody` / `BookTocModal`).

| Item | Location |
|------|----------|
| Registry + page order | `lib/learning-book/math-g2-registry.js` |
| Markdown loader | `lib/Learning-book/load-math-g2-pages.js` |
| Book nav / snapshots / üben preset | `lib/Learning-book/math-g2-book-nav.js` |
| Topic → book page | `lib/Learning-book/relöse-math-g2-book-page.js` |
| Section 7 üben CTA | `lib/Learning-book/relöse-math-g2-üben-target.js` |
| Routes | `/Learning/book/math/g2`, `/Learning/book/math/g2/[pageId]` |

| Verify | `node scripts/verify-math-g2-book.mjs` |



**üben CTA:** All **22** pages mapped via `relöse-math-g2-üben-target.js` + `forceKind` branches in `utils/math-question-generator.js`.

**Hidden buttons (no confident mapping):**



**Not done:** SQL · commit · push · deploy · owner content approval.

See also: `docs/Learning-book/MATH_GRADE_2_BOOK_IMPLEMENTATION_SUMMARY.md`

---

## Open Questions (post–Batch D)

1. **Batch D Hebrew titles** — owner review before implementation
2. **Practice CTA mappings** — G2 resolver still not implemented
3. **Full book sign-off** — all 22 pages pending owner approval

---

## Explizite Stopp-Regel

> **Die UI der 2. Klasse ist nur für die Entwicklungsvorschau umgesetzt.** Nicht bereitstellen oder Entwurfsinhalt als freigegeben behandeln, bis die Freigabe vorliegt.

Until owner approves content:

- ❌ No SQL, commit, push, or deploy for production release
- ✅ Dev routes `/Learning/book/math/g2` available for QA

---

## Confirmations

- **22** draft `.md` pages (Batches A + B + C + D); all `approval_status: draft`.
- All 2. Klasse draft pages now exist — **22 / 22**.
- G2 registry, loader, routes, resolvers, and Math Master wiring implemented (June 2026).
- 1. Klasse lieser UX remains the locked reference (`MATH_lernenING_BOOK_UI_STYLE_LOCK.md`).
- Kein SQL, Commit, Push oder Deploy in diesem Arbeitsstrom.
