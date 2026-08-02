# Livre d'apprentissage de la géométrie CM2 — Brouillons

**Statut :** Tous les lots créés – **17/17** brouillons de pages terminés (lots A à G). Examen du propriétaire en attente.  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/geometry/g5/drafts/`  
**Titre du livre (face à l'enfant) :** ספר גאומטריה — כיתה ה׳

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **17 / 17** (Batches A–G) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g5-book-content.mjs` |
| Draft manifest | ✅ `scripts/lib/geometry-g5-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope |

---

## Lot A — מקבילות, מרובעים וזוויות (3)

| File | Draft title |
|------|-------------|
| `parallel_perpendicular.md` | קווים מקבילים ומאונכים |
| `quadrilaterals.md` | סיווג מרובעים — כיתה ה׳ |
| `triangle_angles.md` | זוויות במשולש |

## Lot B — היקף ושטח — ריבוע ומשולש (3)

| File | Draft title |
|------|-------------|
| `square_perimeter.md` | היקף ריבוע |
| `triangle_perimeter.md` | היקף משולש |
| `square_area.md` | שטח ריבוע |

## Lot C — שטח — מקבילית וטרפז (2)

| File | Draft title |
|------|-------------|
| `parallelogram_area.md` | שטח מקבילית |
| `trapezoid_area.md` | שטח טרפז |

## Lot D — גובה במצולעים (3)

| File | Draft title |
|------|-------------|
| `heights_triangle.md` | גובה במשולש |
| `heights_parallelogram.md` | גובה במקבילית |
| `heights_trapezoid.md` | גובה בטרפז |

## Lot E — אלכסונים (3)

| File | Draft title |
|------|-------------|
| `diagonal_square.md` | אלכסון בריבוע |
| `diagonal_rectangle.md` | אלכסון במלבן |
| `diagonal_parallelogram.md` | אלכסון במקבילית |

## Lot F — גופים ונפח (2)

| File | Draft title |
|------|-------------|
| `solids.md` | גופים תלת-ממדיים — חזרה |
| `rectangular_prism_volume.md` | נפח תיבה |

## Lot G — ריצוף (1)

| File | Draft title |
|------|-------------|
| `tiling.md` | ריצוף במישור |

---

## Remarques

- Toutes les pages : `age_band: classes_5_6`, `approval_status: draft`, `classe: g5`.
- La copie destinée aux enfants utilise **גאומטריה**, et non **הנדסה**.
- Section 7 : brouillon d'invitation uniquement — **pas de routage pratique**.
- `book_placeholder.md` — espace réservé à l'infrastructure ; **ne** fait pas partie du livre de 17 pages.

---

## Régénérer

```bash
node scripts/generate-geometry-g5-drafts.mjs
node scripts/build-geometry-g5-hebrew-review-pack.mjs
node scripts/verify-geometry-g5-book-content.mjs
```
