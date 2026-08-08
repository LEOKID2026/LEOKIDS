# Kelas 5 Matematika Pembelajaran Buku — Draf

**Status:** Semua batches authored — **40 / 40** draf halaman selesaikan (Batches –H). Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/math/g5/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **40 / 40** (Batches –H) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-math-g5-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/math-g5-draft-manifest.mjs` |
| Draf konten sumber (scripts hanya) | ✅ `scripts/lib/math-g5-draft-content.mjs` |
| Draf generator (optional regen) | ✅ `scripts/gen-math-g5-drafts.mjs` |
| Runtime registry / routes | ❌ Tidak di cakupan — konten-hanya task |
| Latihan CTA resolver (G5) | ❌ Tidak dibuat — tidak fake mappings |

---

## Sumber kebenaran

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Semua 40 entri `skill_id` Matematika Kelas 5 dalam cakupan |
| `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section template (Grades 5–6 age band) |
| `docs/learning-book/math/g1/drafts/` … `g4/drafts/` | Style reference hanya — **tidak modified** |
| `utils/math-constants.js` | Hanya konteks operasi Kelas 5 |

---

## Batch —,, (6)

| Berkas | Judul draf |
|------|-------------|
| `ns_place_hundreds.md` | — 100,000 |
| `ns_neighbors.md` | — 100,000 |
| `ns_complement100.md` | -100 |
| `cmp.md` | — 100,000 |
| `sequence.md` | — |
| `round.md` | — |

---

## Batch B —, (4)

| Berkas | Judul draf |
|------|-------------|
| `add_two.md` | — 100,000 |
| `sub_two.md` | — 100,000 |
| `add_three.md` | |
| `mul.md` | — |

---

## Batch C — (3)

| Berkas | Judul draf |
|------|-------------|
| `div.md` | — |
| `div_with_remainder.md` | |
| `div_two_digit.md` | - |

---

## Batch D — (5)

| Berkas | Judul draf |
|------|-------------|
| `frac_reduce.md` | |
| `frac_expand.md` | |
| `frac_add_sub.md` | |
| `mixed_to_frac.md` | |
| `frac_to_mixed.md` | |

---

## Batch E — (6)

| Berkas | Judul draf |
|------|-------------|
| `dec_add.md` | |
| `dec_sub.md` | |
| `eq_add.md` | |
| `eq_sub.md` | |
| `eq_mul.md` | |
| `eq_div.md` | |

---

## Batch F —,,.. (6)

| Berkas | Judul draf |
|------|-------------|
| `fm_factor.md` | |
| `fm_multiple.md` | |
| `fm_gcd.md` | (..) |
| `est_add.md` | |
| `est_mul.md` | |
| `est_quantity.md` | |

---

## Batch G — (2)

| Berkas | Judul draf |
|------|-------------|
| `perc_part_of.md` | |
| `perc_discount.md` | |

---

## Batch H — (8)

| Berkas | Judul draf |
|------|-------------|
| `wp_comparison_more.md` |? |
| `wp_leftover.md` |? |
| `wp_time_sum.md` | |
| `wp_multi_step.md` | |
| `wp_distance_time.md` |,, |
| `wp_shop_discount.md` | |
| `wp_unit_cm_to_m.md` | ↔ |
| `wp_unit_g_to_kg.md` | ↔ |

---

## Catatan

- `book_placeholder.md` — infrastructure placeholder; **tidak** bagian dari 40-halaman buku.
- Semua halaman: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- Section 7: draf invitation text hanya — **tidak latihan routing**.
- Anak-facing copy uses ****, tidak ****.
- Grouped ribuan (`1,000`, `10,000`, `48,726`) appear di banyak halaman — renderer harus isolate LTR.

---

## Regenerate draf / review pack

```bash
node scripts/gen-math-g5-drafts.mjs
node scripts/build-math-g5-hebrew-review-pack.mjs
node scripts/verify-math-g5-book-content.mjs
```

---

## Aturan berhenti eksplisit

Sampai owner approves konten:

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy
- ✅ Documentation dan draf markdown hanya
