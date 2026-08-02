# 4ª primaria Geometry Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **14 / 14** pagine bozza complete. Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/geometry/g4/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/GEOMETRY_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Draft pages | ✅ **14 / 14** (Batches UN–E) |
| Pacchetto di revisione | ✅ `docs/learning-book/GEOMETRY_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g4-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g4-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g4-registry`, `/learning/book/geometry/g4`) |

---

## Batches

| Batch | Pages |
|-------|--------|
| **UN** | `shapes_basic_properties_square`, `shapes_basic_properties_rectangle`, `shapes_basic_properties_angles`, `symmetry` |
| **B** | `quadrilaterals`, `parallel_perpendicular` |
| **C** | `square_perimeter`, `square_area`, `triangle_perimeter`, `triangle_angles` |
| **D** | `diagonal_square`, `diagonal_rectangle` |
| **E** | `solids`, `rectangular_prism_volume` |

---

## Denominazione

- Book title: **Libro di Geometria — 4ª primaria** (not ****).
- IDs: `geometry:g4:{pageId}`, `age_band: grades_3_4`.

---

## Regenerate

```bash
node scripts/build-geometry-g4-hebrew-review-pack.mjs
node scripts/verify-geometry-g4-book-content.mjs
```

---

## Stop rule

Content approved — runtime wired. No SQL, commit, push, o deploy senza owner request.
