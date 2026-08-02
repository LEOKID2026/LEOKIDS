# 1ª secondaria Geometry Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **19 / 19** pagine bozza complete (Batch UN–G). Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/geometry/g6/drafts/` 
**Book title (child-facing):** Libro di Geometria — 1ª secondaria

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/GEOMETRY_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **19 / 19** (Batches UN–G) |
| Pacchetto di revisione | ✅ `docs/learning-book/GEOMETRY_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-geometry-g6-book-content.mjs` |
| Draft manifest | ✅ `scripts/lib/geometry-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Non in scope |

---

## Batch A — , (6)

| File | Draft title |
|------|-------------|
| `square_perimeter.md` | — 1ª secondaria |
| `triangle_perimeter.md` | — 1ª secondaria |
| `square_area.md` | — 1ª secondaria |
| `parallelogram_area.md` | — 1ª secondaria |
| `trapezoid_area.md` | — 1ª secondaria |
| `triangle_angles.md` | — 1ª secondaria |

## Batch B — (2)

| File | Draft title |
|------|-------------|
| `circle_perimeter.md` | |
| `circle_area.md` | |

## Batch C — (2)

| File | Draft title |
|------|-------------|
| `pythagoras_hyp.md` | — |
| `pythagoras_leg.md` | — |

## Batch D — (2)

| File | Draft title |
|------|-------------|
| `solids.md` | — , , , |
| `rectangular_prism_volume.md` | — 1ª secondaria |

## Batch E — (2)

| File | Draft title |
|------|-------------|
| `prism_volume_rectangular.md` | — |
| `prism_volume_triangle.md` | — |

## Batch F — (2)

| File | Draft title |
|------|-------------|
| `pyramid_volume_square.md` | — |
| `pyramid_volume_rectangular.md` | — |

## Batch G — , (3)

| File | Draft title |
|------|-------------|
| `cylinder_volume.md` | |
| `cone_volume.md` | |
| `sphere_volume.md` | |

---

## Notes

- Tutti pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- Child-facing copy uses ****, not ****.
- Section 5 e Section 6 use **stesso geometry problem** (stesso numeri, units, story).
- Section 7: draft invitation solo — **no esercitazione routing**.
- `book_placeholder.md` — infrastructure placeholder; **non** parte di 19-page book.

---

## Regenerate

```bash
node scripts/generate-geometry-g6-drafts.mjs
node scripts/build-geometry-g6-hebrew-review-pack.mjs
node scripts/verify-geometry-g6-book-content.mjs
```
