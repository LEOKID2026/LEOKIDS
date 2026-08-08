# Kelas 4 Matematika Pembelajaran Buku — Draf

**Status:** Semua batches authored — **37 / 37** draf halaman selesaikan (Batches –G). Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/math/g4/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **37 / 37** (Batches –G) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-math-g4-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/math-g4-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Tidak di cakupan — konten-hanya task |
| Latihan CTA resolver (G4) | ❌ Tidak dibuat — tidak fake mappings |

---

## Sumber kebenaran

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Semua 37 entri `skill_id` Matematika Kelas 4 dalam cakupan |
| `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/learning-book/math/g1/drafts/`, `g2/drafts/`, `g3/drafts/` | Style reference hanya — **tidak modified** |
| `utils/math-constants.js` | Hanya konteks operasi Kelas 4 |

---

## Batch —,, (8)

| Berkas | Judul draf |
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

| Berkas | Judul draf |
|------|-------------|
| `zero_add.md` | 0 |
| `zero_sub.md` | 0 |
| `zero_mul.md` | -0 |
| `one_mul.md` | כפל ב-1 |

---

## Batch C —, (5)

| Berkas | Judul draf |
|------|-------------|
| `add_two.md` | — 10,000 |
| `sub_two.md` | — 10,000 |
| `add_three.md` | |
| `mul.md` | — |
| `mul_vertical.md` | |

---

## Batch D —,,, (8)

| Berkas | Judul draf |
|------|-------------|
| `div.md` | — |
| `div_with_remainder.md` | |
| `div_long.md` | |
| `divisibility.md` | — 2, 3, 5, 6, 9, 10 |
| `prime_composite.md` | |
| `fm_factor.md` | |
| `fm_multiple.md` | |
| `fm_gcd.md` |.. |

---

## Batch E —, (7)

| Berkas | Judul draf |
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

| Berkas | Judul draf |
|------|-------------|
| `power_base.md` | — |
| `power_calc.md` | — |

---

## Batch G — (3)

| Berkas | Judul draf |
|------|-------------|
| `wp_comparison_more.md` | —? |
| `wp_leftover.md` | —? |
| `wp_time_sum.md` | — |

---

## Catatan

- `book_placeholder.md` — infrastructure placeholder; **tidak** bagian dari 37-halaman buku.
- Semua halaman: `age_band: grades_3_4`, `approval_status: draft`, `grade: g4`.
- Section 7: draf invitation text hanya — **tidak latihan routing**.
- Anak-facing copy uses ****, tidak ****.
- Grouped ribuan (`1,000`, `10,000`) appear di banyak halaman — renderer harus isolate LTR (lihat G3 Bidi fix).

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-math-g4-hebrew-review-pack.mjs
node scripts/verify-math-g4-book-content.mjs
```

---

## Aturan berhenti eksplisit

Sampai owner approves konten:

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy
- ✅ Documentation dan draf markdown hanya
