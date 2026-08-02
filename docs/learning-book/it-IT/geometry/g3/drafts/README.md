# 3ª primaria Geometry Libro di apprendimento — Bozze

**Stato:** **Owner-approved** — **9 / 9** pages; runtime wired. 
**Signoff:** `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md` 
**Data:** June 2026 
**Cartella:** `docs/learning-book/geometry/g3/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md` |
| Draft pages | ✅ **9 / 9** (Batches UN–E) |
| Runtime routes | ✅ `/learning/book/geometry/g3` + `[pageId]` |
| Pacchetto di revisione | ✅ `docs/learning-book/GEOMETRY_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g3-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g3-draft-manifest.mjs` |

---

## Batches

| Batch | Pages |
|-------|--------|
| **UN** | `triangles`, `quadrilaterals` |
| **B** | `parallel_perpendicular` |
| **C** | `square_area`, `square_perimeter`, `triangle_perimeter` |
| **D** | `triangle_angles` |
| **E** | `rotation`, `solids` |

---

## Denominazione

- Child-facing: **** (not ).
- IDs: `geometry:g3:{pageId}`, `age_band: grades_3_4`.

---

## Regenerate

```bash
node scripts/build-geometry-g3-hebrew-review-pack.mjs
node scripts/verify-geometry-g3-book-content.mjs
```

---

## Stop rule

No registry, routes, SQL, commit, push, o deploy until owner approves content.
