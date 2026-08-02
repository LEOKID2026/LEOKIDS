# 3ª primaria Math Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **26 / 26** pagine bozza complete (Batch UN + B + C + D). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/math/g3/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **26 / 26** (Batches UN + B + C + D) |
| Pacchetto di revisione | ✅ `docs/learning-book/MATH_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-math-g3-book-content.mjs` |
| Runtime registry / routes | ❌ Non in scope — content-solo task |
| Esercitazione CTA resolver (G3) | ❌ Non created — no fake mappings |

---

## Source di Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Tutti 26 3ª primaria Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) sette-section template |
| `docs/learning-book/math/g1/drafts/`, `math/g2/drafts/` | Style reference solo — **non modified** |
| `utils/math-constants.js` | 3ª primaria operations context |

---

## Batch A — , (7)

| File | Draft title |
|------|-------------|
| `ns_place_hundreds.md` | , — 1,000 |
| `ns_neighbors.md` | — 1,000 |
| `ns_complement10.md` | 10 — |
| `ns_complement100.md` | 100 |
| `ns_even_odd.md` | - — |
| `cmp.md` | 1,000 |
| `sequence.md` | |

---

## Batch B — , , (9)

| File | Draft title |
|------|-------------|
| `add_two.md` | — 1,000 |
| `sub_two.md` | — 1,000 |
| `add_three.md` | |
| `mul.md` | — |
| `mul_tens.md` | |
| `mul_hundreds.md` | |
| `div.md` | — |
| `div_with_remainder.md` | |
| `divisibility.md` | -2, -5 -10 |

---

## Batch C — , (7)

| File | Draft title |
|------|-------------|
| `eq_add.md` | — |
| `eq_sub.md` | — |
| `dec_add.md` | |
| `dec_sub.md` | |
| `order_add_mul.md` | — |
| `order_mul_sub.md` | — |
| `order_parentheses.md` | |

---

## Batch D — (3)

| File | Draft title |
|------|-------------|
| `wp_comparison_more.md` | — ? |
| `wp_leftover.md` | — ? |
| `wp_time_sum.md` | — |

---

## Notes

- `book_placeholder.md` — infrastructure placeholder da structure expansion; **non** parte di 26-page book.
- Tutti pages: `age_band: grades_3_4`, `approval_status: draft`.
- Section 7: draft invitation text solo — **no esercitazione routing**.
- Child-facing copy uses ****, not ****.

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-math-g3-hebrew-review-pack.mjs
node scripts/verify-math-g3-book-content.mjs
```

---

## Explicit Stop Rule

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, o deploy
- ✅ Documentation e draft markdown solo
