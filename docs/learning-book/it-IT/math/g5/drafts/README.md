# 5ª primaria Math Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **40 / 40** pagine bozza complete (Batch UN–H). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/math/g5/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **40 / 40** (Batches UN–H) |
| Pacchetto di revisione | ✅ `docs/learning-book/MATH_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-math-g5-book-content.mjs` |
| Draft manifest (scripts solo) | ✅ `scripts/lib/math-g5-draft-manifest.mjs` |
| Contenuto in bozza source (scripts solo) | ✅ `scripts/lib/math-g5-draft-content.mjs` |
| Draft generator (optional regen) | ✅ `scripts/gen-math-g5-drafts.mjs` |
| Runtime registry / routes | ❌ Non in scope — content-solo task |
| Esercitazione CTA resolver (G5) | ❌ Non created — no fake mappings |

---

## Source di Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Tutti 40 5ª primaria Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Sette-section template (Grades 5–6 age band) |
| `docs/learning-book/math/g1/drafts/` … `g4/drafts/` | Style reference solo — **non modified** |
| `utils/math-constants.js` | 5ª primaria operations context solo |

---

## Batch A — , , (6)

| File | Draft title |
|------|-------------|
| `ns_place_hundreds.md` | — 100,000 |
| `ns_neighbors.md` | — 100,000 |
| `ns_complement100.md` | -100 |
| `cmp.md` | — 100,000 |
| `sequence.md` | — |
| `round.md` | — |

---

## Batch B — , (4)

| File | Draft title |
|------|-------------|
| `add_two.md` | — 100,000 |
| `sub_two.md` | — 100,000 |
| `add_three.md` | |
| `mul.md` | — |

---

## Batch C — (3)

| File | Draft title |
|------|-------------|
| `div.md` | — |
| `div_with_remainder.md` | |
| `div_two_digit.md` | - |

---

## Batch D — (5)

| File | Draft title |
|------|-------------|
| `frac_reduce.md` | |
| `frac_expand.md` | |
| `frac_add_sub.md` | |
| `mixed_to_frac.md` | |
| `frac_to_mixed.md` | |

---

## Batch E — (6)

| File | Draft title |
|------|-------------|
| `dec_add.md` | |
| `dec_sub.md` | |
| `eq_add.md` | |
| `eq_sub.md` | |
| `eq_mul.md` | |
| `eq_div.md` | |

---

## Batch F — , , .. (6)

| File | Draft title |
|------|-------------|
| `fm_factor.md` | |
| `fm_multiple.md` | |
| `fm_gcd.md` | (..) |
| `est_add.md` | |
| `est_mul.md` | |
| `est_quantity.md` | |

---

## Batch G — (2)

| File | Draft title |
|------|-------------|
| `perc_part_of.md` | |
| `perc_discount.md` | |

---

## Batch H — (8)

| File | Draft title |
|------|-------------|
| `wp_comparison_more.md` | ? |
| `wp_leftover.md` | ? |
| `wp_time_sum.md` | |
| `wp_multi_step.md` | |
| `wp_distance_time.md` | , , |
| `wp_shop_discount.md` | |
| `wp_unit_cm_to_m.md` | ↔ |
| `wp_unit_g_to_kg.md` | ↔ |

---

## Notes

- `book_placeholder.md` — infrastructure placeholder; **non** parte di 40-page book.
- Tutti pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- Section 7: draft invitation text solo — **no esercitazione routing**.
- Child-facing copy uses ****, not ****.
- Grouped thousands (`1,000`, `10,000`, `48,726`) appear in molti pages — renderer must isolate LTR.

---

## Regenerate drafts / review pack

```bash
node scripts/gen-math-g5-drafts.mjs
node scripts/build-math-g5-hebrew-review-pack.mjs
node scripts/verify-math-g5-book-content.mjs
```

---

## Explicit Stop Rule

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, o deploy
- ✅ Documentation e draft markdown solo
