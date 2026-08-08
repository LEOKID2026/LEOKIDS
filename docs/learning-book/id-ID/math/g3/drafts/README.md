# Kelas 3 Matematika Pembelajaran Buku — Draf

**Status:** Semua batches authored — **26 / 26** draf halaman selesaikan (Batches + B + C + D). Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/math/g3/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **26 / 26** (Batches + B + C + D) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-math-g3-book-content.mjs` |
| Runtime registry / routes | ❌ Tidak di cakupan — konten-hanya task |
| Latihan CTA resolver (G3) | ❌ Tidak dibuat — tidak fake mappings |

---

## Sumber kebenaran

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Semua 26 entri `skill_id` Matematika Kelas 3 dalam cakupan |
| `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/learning-book/math/g1/drafts/`, `math/g2/drafts/` | Style reference hanya — **tidak modified** |
| `utils/math-constants.js` | Konteks operasi Kelas 3 |

---

## Batch —, (7)

| Berkas | Judul draf |
|------|-------------|
| `ns_place_hundreds.md` |, — 1,000 |
| `ns_neighbors.md` | — 1,000 |
| `ns_complement10.md` | 10 — |
| `ns_complement100.md` | 100 |
| `ns_even_odd.md` | - — |
| `cmp.md` | 1,000 |
| `sequence.md` | |

---

## Batch B —,, (9)

| Berkas | Judul draf |
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

## Batch C —, (7)

| Berkas | Judul draf |
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

| Berkas | Judul draf |
|------|-------------|
| `wp_comparison_more.md` | —? |
| `wp_leftover.md` | —? |
| `wp_time_sum.md` | — |

---

## Catatan

- `book_placeholder.md` — infrastructure placeholder dari structure expansion; **tidak** bagian dari 26-halaman buku.
- Semua halaman: `age_band: grades_3_4`, `approval_status: draft`.
- Section 7: draf invitation text hanya — **tidak latihan routing**.
- Anak-facing copy uses ****, tidak ****.

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-math-g3-hebrew-review-pack.mjs
node scripts/verify-math-g3-book-content.mjs
```

---

## Aturan berhenti eksplisit

Sampai owner approves konten:

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy
- ✅ Documentation dan draf markdown hanya
