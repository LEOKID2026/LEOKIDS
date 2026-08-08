# Kelas 3 Geometri Pembelajaran Buku — Draf

**Status:** **Owner-approved** — **9 / 9** halaman; runtime wired.
**Signoff:** `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md`
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/geometry/g3/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md` |
| Draf halaman | ✅ **9 / 9** (Batches –E) |
| Runtime routes | ✅ `/learning/book/geometry/g3` + `[pageId]` |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g3-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g3-draft-manifest.mjs` |

---

## Batch

| Batch | Halaman |
|-------|--------|
| **** | `triangles`, `quadrilaterals` |
| **B** | `parallel_perpendicular` |
| **C** | `square_area`, `square_perimeter`, `triangle_perimeter` |
| **D** | `triangle_angles` |
| **E** | `rotation`, `solids` |

---

## Penamaan

- Anak-facing: **** (tidak).
- IDs: `geometry:g3:{pageId}`, `age_band: grades_3_4`.

---

## Hasilkan ulang

```bash
node scripts/build-geometry-g3-hebrew-review-pack.mjs
node scripts/verify-geometry-g3-book-content.mjs
```

---

## Aturan berhenti

Tidak registry, routes, SQL, commit, push, atau deploy sampai owner approves konten.
