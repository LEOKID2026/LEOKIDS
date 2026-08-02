# Livre d'apprentissage de la géométrie, 6e — Brouillons

**Statut :** Tous les lots créés – **19/19** brouillons de pages terminés (lots A à G). Examen du propriétaire en attente.  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/geometry/g6/drafts/`  
**Titre du livre (face à l'enfant) :** ספר גאומטריה — כיתה ו׳

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **19 / 19** (Batches A–G) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g6-book-content.mjs` |
| Draft manifest | ✅ `scripts/lib/geometry-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope |

---

## Lot A — היקף, שטח וזוויות (6)

| File | Draft title |
|------|-------------|
| `square_perimeter.md` | היקף ריבוע — כיתה ו׳ |
| `triangle_perimeter.md` | היקף משולש — כיתה ו׳ |
| `square_area.md` | שטח ריבוע — כיתה ו׳ |
| `parallelogram_area.md` | שטח מקבילית — כיתה ו׳ |
| `trapezoid_area.md` | שטח טרפז — כיתה ו׳ |
| `triangle_angles.md` | זוויות במשולש — כיתה ו׳ |

## Lot B — מעגל ועיגול (2)

| File | Draft title |
|------|-------------|
| `circle_perimeter.md` | היקף מעגל |
| `circle_area.md` | שטח עיגול |

## Lot C — משפט פיתגורס (2)

| File | Draft title |
|------|-------------|
| `pythagoras_hyp.md` | משפט פיתגורס — מציאת יתר |
| `pythagoras_leg.md` | משפט פיתגורס — מציאת ניצב |

## Lot D — גופים ונפח בסיסי (2)

| File | Draft title |
|------|-------------|
| `solids.md` | גופים — גליל, פירמידה, חרוט, כדור |
| `rectangular_prism_volume.md` | נפח תיבה — כיתה ו׳ |

## Lot E — נפח מנסרות (2)

| File | Draft title |
|------|-------------|
| `prism_volume_rectangular.md` | נפח מנסרה — בסיס מלבן |
| `prism_volume_triangle.md` | נפח מנסרה — בסיס משולש |

## Lot F — נפח פירמידות (2)

| File | Draft title |
|------|-------------|
| `pyramid_volume_square.md` | נפח פירמידה — בסיס ריבוע |
| `pyramid_volume_rectangular.md` | נפח פירמידה — בסיס מלבן |

## Lot G — נפח גליל, חרוט וכדור (3)

| File | Draft title |
|------|-------------|
| `cylinder_volume.md` | נפח גליל |
| `cone_volume.md` | נפח חרוט |
| `sphere_volume.md` | נפח כדור |

---

## Remarques

- Toutes les pages : `age_band: classes_5_6`, `approval_status: draft`, `classe: g6`.
- La copie destinée aux enfants utilise **גאומטריה**, et non **הנדסה**.
- Les sections 5 et 6 utilisent le **même problème de géométrie** (mêmes nombres, unités, histoire).
- Section 7 : brouillon d'invitation uniquement — **pas de routage pratique**.
- `book_placeholder.md` — espace réservé à l'infrastructure ; **ne** fait pas partie du livre de 19 pages.

---

## Régénérer

```bash
node scripts/generate-geometry-g6-drafts.mjs
node scripts/build-geometry-g6-hebrew-review-pack.mjs
node scripts/verify-geometry-g6-book-content.mjs
```
