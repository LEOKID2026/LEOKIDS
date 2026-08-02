# Livre d'apprentissage de la géométrie, CM1 — Brouillons

**Statut :** Tous les lots créés – **14/14** brouillons de pages terminés. Examen du propriétaire en attente.  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/geometry/g4/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Draft pages | ✅ **14 / 14** (Batches A–E) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g4-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g4-draft-manifest.mjs` |
| Registre d'exécution/itinéraires | ✅ wired (`geometry-g4-registry`, `/learning/book/geometry/g4`) |

---

## Lots

| Batch | Pages |
|-------|--------|
| **A** | `shapes_basic_properties_square`, `shapes_basic_properties_rectangle`, `shapes_basic_properties_angles`, `symmetry` |
| **B** | `quadrilaterals`, `parallel_perpendicular` |
| **C** | `square_perimeter`, `square_area`, `triangle_perimeter`, `triangle_angles` |
| **D** | `diagonal_square`, `diagonal_rectangle` |
| **E** | `solids`, `rectangular_prism_volume` |

---

## Appellation

- Titre du livre : **ספר גאומטריה — כיתה ד׳** (pas **הנדסה**).
- ID : `geometry:g4:{pageId}`, `age_band: classes_3_4`.

---

## Régénérer

```bash
node scripts/build-geometry-g4-hebrew-review-pack.mjs
node scripts/verify-geometry-g4-book-content.mjs
```

---

## Règle d'arrêt

Contenu approuvé – runtime câblé. Pas de SQL, de validation, de push ou de déploiement sans demande du propriétaire.
