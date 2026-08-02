# 1ª secondaria Math Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **44 / 44** pagine bozza complete (Batch UN–I). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/math/g6/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/MATH_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **44 / 44** (Batches UN–I) |
| Pacchetto di revisione | ✅ `docs/learning-book/MATH_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-math-g6-book-content.mjs` |
| Draft manifest (scripts solo) | ✅ `scripts/lib/math-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Non in scope — content-solo task |
| Esercitazione CTA resolver (G6) | ❌ Non created — no fake mappings |

---

## Source di Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Tutti 44 1ª secondaria Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_6_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section C (Grades 5–6) sette-section template |
| `docs/learning-book/math/g1–g4/drafts/` | Style reference solo — **non modified** |
| `utils/math-constants.js` | 1ª secondaria operations context solo |

---

## Batch A — , , (6)

| File | Draft title |
|------|-------------|
| `ns_place_hundreds.md` | — 200,000 |
| `ns_neighbors.md` | — |
| `ns_complement100.md` | -100 |
| `cmp.md` | |
| `sequence.md` | — |
| `round.md` | — , , |

---

## Batch B — , , (6)

| File | Draft title |
|------|-------------|
| `add_two.md` | — 200,000 |
| `sub_two.md` | — 200,000 |
| `add_three.md` | |
| `mul.md` | — |
| `div.md` | — |
| `div_with_remainder.md` | |

---

## Batch C — , .. (3)

| File | Draft title |
|------|-------------|
| `fm_factor.md` | |
| `fm_multiple.md` | |
| `fm_gcd.md` | (..) |

---

## Batch D — (4)

| File | Draft title |
|------|-------------|
| `eq_add.md` | — |
| `eq_sub.md` | — |
| `eq_mul.md` | — |
| `eq_div.md` | — |

---

## Batch E — (7)

| File | Draft title |
|------|-------------|
| `dec_add.md` | |
| `dec_sub.md` | |
| `dec_multiply.md` | |
| `dec_multiply_10_100.md` | -10 -100 |
| `dec_divide.md` | |
| `dec_divide_10_100.md` | -10 -100 |
| `dec_repeating.md` | |

---

## Batch F — (3)

| File | Draft title |
|------|-------------|
| `frac_as_division.md` | |
| `frac_multiply.md` | |
| `frac_divide.md` | |

---

## Batch G — (6)

| File | Draft title |
|------|-------------|
| `ratio_first.md` | — ? |
| `ratio_second.md` | |
| `ratio_find.md` | |
| `scale_find.md` | — |
| `scale_map_to_real.md` | |
| `scale_real_to_map.md` | |

---

## Batch H — (2)

| File | Draft title |
|------|-------------|
| `perc_part_of.md` | |
| `perc_discount.md` | |

---

## Batch I — (7)

| File | Draft title |
|------|-------------|
| `wp_comparison_more.md` | — ? |
| `wp_leftover.md` | — ? |
| `wp_time_sum.md` | — |
| `wp_distance_time.md` | , |
| `wp_shop_discount.md` | — |
| `wp_unit_cm_to_m.md` | — |
| `wp_unit_g_to_kg.md` | — |

---

## Notes

- Tutti pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- Section 7: draft invitation text solo — **no esercitazione routing**.
- Child-facing copy uses ****, not ****.
- Grouped thousands (`1,000`, `10,000`, `100,000`, `200,000`) appear in molti pages — renderer must isolate LTR.
- 5ª primaria frazione/percent skills (`frac_add_sub`, `frac_reduce`, etc.) sono **non** in G6 spine scope — assumed covered in G5 book.

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-math-g6-hebrew-review-pack.mjs
node scripts/verify-math-g6-book-content.mjs
```

A regenerate draft pages da generator (se edited):

```bash
node scripts/generate-math-g6-drafts.mjs
```

---

## Explicit Stop Rule

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, o deploy
- ✅ Documentation e draft markdown solo
