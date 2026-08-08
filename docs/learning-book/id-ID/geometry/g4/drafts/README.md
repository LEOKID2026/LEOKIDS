# Kelas 4 Geometri Pembelajaran Buku — Draf

**Status:** Semua batches authored — **14 / 14** draf halaman selesaikan. Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/geometry/g4/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Draf halaman | ✅ **14 / 14** (Batches –E) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g4-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g4-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g4-registry`, `/learning/book/geometry/g4`) |

---

## Batch

| Batch | Halaman |
|-------|--------|
| **** | `shapes_basic_properties_square`, `shapes_basic_properties_rectangle`, `shapes_basic_properties_angles`, `symmetry` |
| **B** | `quadrilaterals`, `parallel_perpendicular` |
| **C** | `square_perimeter`, `square_area`, `triangle_perimeter`, `triangle_angles` |
| **D** | `diagonal_square`, `diagonal_rectangle` |
| **E** | `solids`, `rectangular_prism_volume` |

---

## Penamaan

- Buku title: ** — ** (tidak ****).
- IDs: `geometry:g4:{pageId}`, `age_band: grades_3_4`.

---

## Hasilkan ulang

```bash
node scripts/build-geometry-g4-hebrew-review-pack.mjs
node scripts/verify-geometry-g4-book-content.mjs
```

---

## Aturan berhenti

Konten approved — runtime wired. Tidak SQL, commit, push, atau deploy tanpa owner request.
