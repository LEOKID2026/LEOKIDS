# 4ª primaria Math Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **37 / 37** pagine bozza complete (Batch UN–G). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/math/g4/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **37 / 37** (Batches UN–G) |
| Pacchetto di revisione | ✅ `docs/learning-book/MATH_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-math-g4-book-content.mjs` |
| Draft manifest (scripts solo) | ✅ `scripts/lib/math-g4-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Non in scope — content-solo task |
| Esercitazione CTA resolver (G4) | ❌ Non created — no fake mappings |

---

## Source di Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Tutti 37 4ª primaria Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) sette-section template |
| `docs/learning-book/math/g1/drafts/`, `g2/drafts/`, `g3/drafts/` | Style reference solo — **non modified** |
| `utils/math-constants.js` | 4ª primaria operations context solo |

---

## Batch A — , , (8)

| File | Draft title |
|------|-------------|
| `ns_place_hundreds.md` | — 10,000 |
| `ns_neighbors.md` | — |
| `ns_complement100.md` | -100 |
| `ns_complement10.md` | -10 — |
| `ns_even_odd.md` | /- — |
| `cmp.md` | |
| `sequence.md` | — |
| `round.md` | // |

---

## Batch B — 0 -1 (4)

| File | Draft title |
|------|-------------|
| `zero_add.md` | 0 |
| `zero_sub.md` | 0 |
| `zero_mul.md` | -0 |
| `one_mul.md` | -1 |

---

## Batch C — , (5)

| File | Draft title |
|------|-------------|
| `add_two.md` | — 10,000 |
| `sub_two.md` | — 10,000 |
| `add_three.md` | |
| `mul.md` | — |
| `mul_vertical.md` | |

---

## Batch D — , , , (8)

| File | Draft title |
|------|-------------|
| `div.md` | — |
| `div_with_remainder.md` | |
| `div_long.md` | |
| `divisibility.md` | — 2, 3, 5, 6, 9, 10 |
| `prime_composite.md` | |
| `fm_factor.md` | |
| `fm_multiple.md` | |
| `fm_gcd.md` | .. |

---

## Batch E — , (7)

| File | Draft title |
|------|-------------|
| `dec_add.md` | — |
| `dec_sub.md` | — |
| `eq_add.md` | — |
| `eq_sub.md` | — |
| `est_add.md` | — |
| `est_mul.md` | — |
| `est_quantity.md` | |

---

## Batch F — (2)

| File | Draft title |
|------|-------------|
| `power_base.md` | — |
| `power_calc.md` | — |

---

## Batch G — (3)

| File | Draft title |
|------|-------------|
| `wp_comparison_more.md` | — ? |
| `wp_leftover.md` | — ? |
| `wp_time_sum.md` | — |

---

## Notes

- `book_placeholder.md` — infrastructure placeholder; **non** parte di 37-page book.
- Tutti pages: `age_band: grades_3_4`, `approval_status: draft`, `grade: g4`.
- Section 7: draft invitation text solo — **no esercitazione routing**.
- Child-facing copy uses ****, not ****.
- Grouped thousands (`1,000`, `10,000`) appear in molti pages — renderer must isolate LTR (see G3 Bidi fix).

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-math-g4-hebrew-review-pack.mjs
node scripts/verify-math-g4-book-content.mjs
```

---

## Explicit Stop Rule

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, o deploy
- ✅ Documentation e draft markdown solo
