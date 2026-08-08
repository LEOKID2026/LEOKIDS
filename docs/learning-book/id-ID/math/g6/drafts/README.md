# Kelas 6 Matematika Pembelajaran Buku — Draf

**Status:** Semua batches authored — **44 / 44** draf halaman selesaikan (Batches –AKU). Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/math/g6/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **44 / 44** (Batches –AKU) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-math-g6-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/math-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Tidak di cakupan — konten-hanya task |
| Latihan CTA resolver (G6) | ❌ Tidak dibuat — tidak fake mappings |

---

## Sumber kebenaran

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Semua 44 entri `skill_id` Matematika Kelas 6 dalam cakupan |
| `docs/learning-book/MATH_GRADE_6_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section C (Grades 5–6) seven-section template |
| `docs/learning-book/math/g1–g4/drafts/` | Style reference hanya — **tidak modified** |
| `utils/math-constants.js` | Hanya konteks operasi Kelas 6 |

---

## Batch —,, (6)

| Berkas | Judul draf |
|------|-------------|
| `ns_place_hundreds.md` | — 200,000 |
| `ns_neighbors.md` | — |
| `ns_complement100.md` | -100 |
| `cmp.md` | |
| `sequence.md` | — |
| `round.md` | —,, |

---

## Batch B —,, (6)

| Berkas | Judul draf |
|------|-------------|
| `add_two.md` | — 200,000 |
| `sub_two.md` | — 200,000 |
| `add_three.md` | |
| `mul.md` | — |
| `div.md` | — |
| `div_with_remainder.md` | |

---

## Batch C —,.. (3)

| Berkas | Judul draf |
|------|-------------|
| `fm_factor.md` | |
| `fm_multiple.md` | |
| `fm_gcd.md` | (..) |

---

## Batch D — (4)

| Berkas | Judul draf |
|------|-------------|
| `eq_add.md` | — |
| `eq_sub.md` | — |
| `eq_mul.md` | — |
| `eq_div.md` | — |

---

## Batch E — (7)

| Berkas | Judul draf |
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

| Berkas | Judul draf |
|------|-------------|
| `frac_as_division.md` | |
| `frac_multiply.md` | |
| `frac_divide.md` | |

---

## Batch G — (6)

| Berkas | Judul draf |
|------|-------------|
| `ratio_first.md` | —? |
| `ratio_second.md` | |
| `ratio_find.md` | |
| `scale_find.md` | — |
| `scale_map_to_real.md` | |
| `scale_real_to_map.md` | |

---

## Batch H — (2)

| Berkas | Judul draf |
|------|-------------|
| `perc_part_of.md` | |
| `perc_discount.md` | |

---

## Batch AKU — (7)

| Berkas | Judul draf |
|------|-------------|
| `wp_comparison_more.md` | —? |
| `wp_leftover.md` | —? |
| `wp_time_sum.md` | — |
| `wp_distance_time.md` |, |
| `wp_shop_discount.md` | — |
| `wp_unit_cm_to_m.md` | — |
| `wp_unit_g_to_kg.md` | — |

---

## Catatan

- Semua halaman: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- Section 7: draf invitation text hanya — **tidak latihan routing**.
- Anak-facing copy uses ****, tidak ****.
- Grouped ribuan (`1,000`, `10,000`, `100,000`, `200,000`) appear di banyak halaman — renderer harus isolate LTR.
- Kelas 5 pecahan/persen skills (`frac_add_sub`, `frac_reduce`, etc.) adalah **tidak** di G6 spine cakupan — assumed covered di G5 buku.

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-math-g6-hebrew-review-pack.mjs
node scripts/verify-math-g6-book-content.mjs
```

Ke regenerate draf halaman dari generator (jika edited):

```bash
node scripts/generate-math-g6-drafts.mjs
```

---

## Aturan berhenti eksplisit

Sampai owner approves konten:

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy
- ✅ Documentation dan draf markdown hanya
