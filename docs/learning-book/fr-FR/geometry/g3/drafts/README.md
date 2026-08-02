# Livre d'apprentissage de la géométrie de CE2 — Brouillons

**Statut :** **Approuvé par le propriétaire** — **9 / 9** pages ; exécution câblée.  
**Approbation :** `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md`  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/geometry/g3/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md` |
| Draft pages | ✅ **9 / 9** (Batches A–E) |
| Runtime routes | ✅ `/learning/book/geometry/g3` + `[pageId]` |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g3-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g3-draft-manifest.mjs` |

---

## Lots

| Batch | Pages |
|-------|--------|
| **A** | `triangles`, `quadrilaterals` |
| **B** | `parallel_perpendicular` |
| **C** | `square_area`, `square_perimeter`, `triangle_perimeter` |
| **D** | `triangle_angles` |
| **E** | `rotation`, `solids` |

---

## Appellation

- Face à l'enfant : **גאומטריה** (pas הנדסה).
- ID : `geometry:g3:{pageId}`, `age_band: classes_3_4`.

---

## Régénérer

```bash
node scripts/build-geometry-g3-hebrew-review-pack.mjs
node scripts/verify-geometry-g3-book-content.mjs
```

---

## Règle d'arrêt

Pas de registre, de routes, de SQL, de validation, de transmission ou de déploiement jusqu'à ce que le propriétaire approuve le contenu.
