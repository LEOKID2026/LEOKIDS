# 5ª primaria Geometry Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **17 / 17** pagine bozza complete (Batch UN–G). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/geometry/g5/drafts/` 
**Book title (child-facing):** Libro di Geometria — 5ª primaria

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/GEOMETRY_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **17 / 17** (Batches UN–G) |
| Pacchetto di revisione | ✅ `docs/learning-book/GEOMETRY_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-geometry-g5-book-content.mjs` |
| Draft manifest | ✅ `scripts/lib/geometry-g5-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Non in scope |

---

## Batch A — , (3)

| File | Draft title |
|------|-------------|
| `parallel_perpendicular.md` | |
| `quadrilaterals.md` | — 5ª primaria |
| `triangle_angles.md` | |

## Batch B — — (3)

| File | Draft title |
|------|-------------|
| `square_perimeter.md` | |
| `triangle_perimeter.md` | |
| `square_area.md` | |

## Batch C — — (2)

| File | Draft title |
|------|-------------|
| `parallelogram_area.md` | |
| `trapezoid_area.md` | |

## Batch D — (3)

| File | Draft title |
|------|-------------|
| `heights_triangle.md` | |
| `heights_parallelogram.md` | |
| `heights_trapezoid.md` | |

## Batch E — (3)

| File | Draft title |
|------|-------------|
| `diagonal_square.md` | |
| `diagonal_rectangle.md` | |
| `diagonal_parallelogram.md` | |

## Batch F — (2)

| File | Draft title |
|------|-------------|
| `solids.md` | - — |
| `rectangular_prism_volume.md` | |

## Batch G — (1)

| File | Draft title |
|------|-------------|
| `tiling.md` | |

---

## Notes

- Tutti pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- Child-facing copy uses ****, not ****.
- Section 7: draft invitation solo — **no esercitazione routing**.
- `book_placeholder.md` — infrastructure placeholder; **non** parte di 17-page book.

---

## Regenerate

```bash
node scripts/generate-geometry-g5-drafts.mjs
node scripts/build-geometry-g5-hebrew-review-pack.mjs
node scripts/verify-geometry-g5-book-content.mjs
```
