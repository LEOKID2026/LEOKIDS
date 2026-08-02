# 2ª primaria Math Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **22 / 22** pagine bozza complete (Batch UN + B + C + D). Full review polish pass applied (June 2026). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/math/g2/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| UI style lock | ✅ `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` |
| Pagine markdown in bozza | ✅ **22 / 22** (Batches UN + B + C + D) |
| Batch UN polish pass | ✅ Applied (June 2026) |
| Batch B polish pass | ✅ Applied (June 2026) |
| Batch C authoring | ✅ Complete + polish pass applied (June 2026) |
| Batch D authoring | ✅ Complete (June 2026) — owner review pending |
| Full review polish pass | ✅ Applied (June 2026) |
| Runtime registry | ✅ `lib/learning-book/math-g2-registry.js` |
| Page loader | ✅ `lib/learning-book/load-math-g2-pages.js` |
| App route `/learning/book/math/g2` | ✅ Implemented (dev preview) |
| Esercitazione CTA resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-practice-target.js` |
| Book page resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-book-page.js` |
| Math Master book entry | ✅ General tile + topic + in-apprendimento buttons (g2) |
| Verification script | ✅ `scripts/verify-math-g2-book.mjs` |

---

## Owner Decisions (Recorded — June 2026)

| Topic | Decision |
|-------|----------|
| UI / reader | Reuse 1ª primaria book reader — no redesign |
| `divisibility` | **2, 5, 10 solo** in G2; child-facing ultimo-digit rules; no 3/6/9 |
| Fractions (Batch C) | **Visual solo** — metà e quarto; no frazione arithmetic |
| `frac_*_reverse` | Doubling (metà) o 4 parti uguali (quarto) a trovare intero |
| `wp_time_date` / `wp_time_days` | **Weekdays solo** per G2 (Batch D) |
| `wp_coins` | Simple uguale gruppi / moltiplicazione allowed (Batch D) |

---

## Source di Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Tutti 22 2ª primaria Math `skill_id` entries |
| `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Page types e wide-span rules |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Sette-section Grades 1–2 template |
| `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` | Reader UX — reuse 1ª primaria |
| `utils/math-constants.js` | 2ª primaria numero ranges e allowed operations |
| `docs/learning-book/math/g1/drafts/` | **Style reference solo** |

---

## Batch A — 

**Stato:** ✅ Draft complete + polish pass applied

| File | Draft title |
|------|-------------|
| `ns_place_tens_units.md` | , — 1,000 |
| `ns_neighbors.md` | — |
| `ns_complement10.md` | 10 — |
| `ns_even_odd.md` | - — |
| `cmp.md` | 1,000 |

---

## Batch B — , , 

**Stato:** ✅ Draft complete + polish pass applied

| File | Draft title |
|------|-------------|
| `add_two.md` | — 100 |
| `sub_two.md` | — 100 |
| `add_vertical.md` | |
| `sub_vertical.md` | |
| `mul.md` | — |
| `div.md` | — |

---

## Batch C — 

**Stato:** ✅ **Draft complete + polish pass applied** (June 2026) — owner review pending

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `divisibility.md` | `math:g2:divisibility` | `math:kind:divisibility` | concept_foundation | 2, 5 10? |
| `frac_half.md` | `math:g2:frac_half` | `math:kind:frac_half` | visual_intuition | |
| `frac_half_reverse.md` | `math:g2:frac_half_reverse` | `math:kind:frac_half_reverse` | visual_intuition | |
| `frac_quarter.md` | `math:g2:frac_quarter` | `math:kind:frac_quarter` | visual_intuition | |
| `frac_quarter_reverse.md` | `math:g2:frac_quarter_reverse` | `math:kind:frac_quarter_reverse` | visual_intuition | |

Tutti Batch C pages:

- `subject`: math · `grade`: g2 · `age_band`: grades_1_2 · `approval_status`: **draft**
- Section headings: ? / / / / / ! / !
- Tutti titoli legacy: **`[DRAFT — not owner-approved]`**

### Batch C polish pass (June 2026)

| Fix | Detail |
|-----|--------|
| `frac_half` / `frac_quarter` | Section 7: ** ** / ** ** (not “/ ”) |
| `frac_half_reverse` | Section 1: removed ****; Section 6: clearer “add only 1” mistake |
| `frac_quarter_reverse` | Section 1: ** …**; Section 6: half vs quarter contrast (**5 + 5** vs **5 + 5 + 5 + 5**) |

### Batch C content scope notes

- `divisibility`: **2, 5, 10 only**; “ 2/5/10”; last-digit rules; e.g. 40; **no** 3/6/9; shallow “ ” only
- `frac_half`: visual; = ; e.g. 12 = 6; no formal numerator/denominator
- `frac_half_reverse`: know half → find whole; doubling; e.g. = 6 → 12
- `frac_quarter`: visual; = ; e.g. 12 = 3; no thirds/eighths
- `frac_quarter_reverse`: know quarter → find whole; 4 equal parts; 4 × or repeated add; e.g. = 4 → 16

### Batch C section 5 / 6 alignment

| Page | Section 5 (try esso) | Section 6 (errore) |
|------|-------------------|---------------------|
| `divisibility` | 35 — dividere by 2, 5, 10? | 35 confused con ÷10 |
| `frac_half` | 10 = ? | 10 split unequally (4+6) |
| `frac_half_reverse` | = 5 → whole? | 5 + 1 = 6 instead of 5 + 5 |
| `frac_quarter` | 20 = ? | 20 split in 2 (half = 10) |
| `frac_quarter_reverse` | = 5 → whole? | 5 + 5 = 10 (half not quarter) |

---

## Batch D — 

**Stato:** ✅ **Draft complete** (June 2026) — owner review pending

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `wp_coins.md` | `math:g2:wp_coins` | `math:kind:wp_coins` | word_problem_strategy | — |
| `wp_coins_spent.md` | `math:g2:wp_coins_spent` | `math:kind:wp_coins_spent` | word_problem_strategy | — |
| `wp_time_date.md` | `math:g2:wp_time_date` | `math:kind:wp_time_date` | word_problem_strategy | — |
| `wp_time_days.md` | `math:g2:wp_time_days` | `math:kind:wp_time_days` | word_problem_strategy | — |
| `wp_groups_g2.md` | `math:g2:wp_groups_g2` | `math:kind:wp_groups_g2` | word_problem_strategy | — |
| `wp_division_simple.md` | `math:g2:wp_division_simple` | `math:kind:wp_division_simple` | word_problem_strategy | — |

Tutti Batch D pages:

- `subject`: math · `grade`: g2 · `age_band`: grades_1_2 · `approval_status`: **draft**
- Section headings: ? / / / / / ! / !
- Tutti titoli legacy: **`[DRAFT — not owner-approved]`**
- Word-problem frame: ** ? / ? / ?**

### Batch D content scope notes

- `wp_coins`: ₪ intero shekels solo; single-passaggio totals; uguale gruppi / moltiplicazione OK (e.g. 4 × 5); up a ~100; no agorot, no multi-passaggio money
- `wp_coins_spent`: paid − cost = change; single-passaggio; uno purchase; up a ~100; no agorot
- `wp_time_date`: **weekdays solo**; forward/back day jumps; no clock, month, calendar, o year arithmetic
- `wp_time_days`: contare jumps tra weekdays; **fare non contare start day as prima jump**; no clock o calendar dates
- `wp_groups_g2`: uguale-gruppi moltiplicazione stories; uno-passaggio; factors within G2; cross-link a Batch B `mul`; no divisione qui
- `wp_division_simple`: uguale-sharing stories; uno-passaggio; no remainder; cross-link a Batch B `div`; no long divisione

### Batch D section 5 / 6 alignment

| Page | Section 5 (try esso) | Section 6 (errore) |
|------|-------------------|---------------------|
| `wp_coins` | 3 coins × 10 ₪ =? | counted 3 instead di 3 × 10 = 30 |
| `wp_coins_spent` | paid 40, cost 28 → change? | 40 − 20 = 20 (partial sottrarre) |
| `wp_time_date` | Wed + 2 days →? | stopped at Thu (1 jump) non Fri |
| `wp_time_days` | Mon → Fri, come molti days? | counted Mon o stopped at Thu (3 non 4) |
| `wp_groups_g2` | 6 bags × 3 apples =? | 6 + 3 = 9 instead di 6 × 3 = 18 |
| `wp_division_simple` | 20 stickers ÷ 5 kids =? | 20 − 5 = 15 instead di 20 ÷ 5 = 4 |

---

## Batch Plan (complete)

**Totale pages: 22 — tutti drafted**

| Batch | Title (draft) | Pages | Status |
|-------|---------------|-------|--------|
| **A** | | 5 | ✅ drafted + polished |
| **B** | , , | 6 | ✅ drafted + polished |
| **C** | | 5 | ✅ drafted + polished |
| **D** | | 6 | ✅ drafted — owner review pending |

---

## Full review polish pass (June 2026)

Mandatory Hebrew/content fixes da full review pack review, prima implementation:

| Page | Fix |
|------|-----|
| `add_two` | Grammar: ` ` (feminine plural) |
| `wp_coins_spent` | Wording: ` `; Section 6: `` (not ``) |
| `wp_division_simple` | Clarity: ` `; ` … ` (§4 + §5) |

**Status unchanged:** **22 / 22** pages drafted · tutti `approval_status: draft`.

---

## Site implementation (June 2026)

2ª primaria book connected a site per **dev preview** — reuses 1ª primaria reader UX exactly (`MathG2BookShell`, shared `LearningPageBody` / `BookTocModal`).

| Item | Location |
|------|----------|
| Registry + page order | `lib/learning-book/math-g2-registry.js` |
| Markdown loader | `lib/learning-book/load-math-g2-pages.js` |
| Book nav / snapshots / esercitazione preset | `lib/learning-book/math-g2-book-nav.js` |
| Topic → book page | `lib/learning-book/resolve-math-g2-book-page.js` |
| Section 7 esercitazione CTA | `lib/learning-book/resolve-math-g2-practice-target.js` |
| Routes | `/learning/book/math/g2`, `/learning/book/math/g2/[pageId]` |
| Math Master | General 📖 tile (g2 only), ` `, in-learning `📖 ` |
| Verify | `node scripts/verify-math-g2-book.mjs` |

**Child-facing UI:** ` — 2ª primaria` · no `[DRAFT]` markers · no internal metadata.

**Esercitazione CTA:** Tutti **22** pages mapped via `resolve-math-g2-practice-target.js` + `forceKind` branches in `utils/math-question-generator.js`.

**Hidden buttons (no confident mapping):**
- Setup ` ` hidden for umbrella ops: `number_sense`, `word_problems`, `fractions`, `mixed`
- In-learning `📖 ` hidden when kind/operation cannot resolve to a single G2 page

**Non done:** SQL · commit · push · deploy · owner content approval.

See anche: `docs/learning-book/MATH_GRADE_2_BOOK_IMPLEMENTATION_SUMMARY.md`

---

## Open Questions (post–Batch D)

1. **Batch D titoli legacy** — owner review prima implementation
2. **Esercitazione CTA mappings** — G2 resolver still non implemented
3. **Full book sign-off** — tutti 22 pages pending owner approval

---

## Explicit Stop Rule

> **2ª primaria UI è implemented per dev preview solo.** Fare non deploy o treat draft content as owner-approved until sign-off.

Until owner approves content:

- ❌ No SQL, commit, push, o deploy per production release
- ✅ Dev routes `/learning/book/math/g2` available per QA

---

## Confirmations

- **22** draft `.md` pages (Batches UN + B + C + D); tutti `approval_status: draft`.
- Tutti 2ª primaria draft pages ora exist — **22 / 22**.
- G2 registry, loader, routes, resolvers, e Math Master wiring implemented (June 2026).
- 1ª primaria reader UX remains locked reference (`MATH_LEARNING_BOOK_UI_STYLE_LOCK.md`).
- No SQL, commit, push, o deploy in questo workstream.
