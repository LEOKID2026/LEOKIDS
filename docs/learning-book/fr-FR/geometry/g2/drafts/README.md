# Livre d'apprentissage de la géométrie de CE1 — Brouillons

**Statut :** Tous les lots créés – **3 / 3** brouillons de pages terminés. Examen du propriétaire en attente.  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/geometry/g2/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **3 / 3** (Batches A–C) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/geometry-g2-draft-manifest.mjs` |
| Registre d'exécution/itinéraires | ✅ wired (`geometry-g2-registry`, `/learning/book/geometry/g2`) |

---

## Appellation

- Le contenu du livre destiné aux enfants utilise **גאומטריה**, et non **הנדסה**.
- ID internes : `geometry:g2:{pageId}`, `subject: geometry`.

---

## Lot A — גופים (1)

| File | Draft title |
|------|-------------|
| `solids.md` | גופים תלת־ממדיים — שמות והיכרות |

---

## Lot B — שטח (1)

| File | Draft title |
|------|-------------|
| `square_area.md` | שטח של ריבוע |

---

## Lot C — הזזה ושיקוף (1)

| File | Draft title |
|------|-------------|
| `transformations.md` | הזזה ושיקוף — המשך |

---

## Remarques

- `book_placeholder.md` — espace réservé à l'infrastructure ; **ne** fait pas partie du livre de 3 pages.
- Toutes les pages : `age_band: classes_1_2`, `approval_status: draft`, `classe: g2`.
- Les pages G1 pour `shapes_basic_square` / `shapes_basic_rectangle` ne sont pas répétées — ces compétences se terminent au niveau 1 dans la colonne vertébrale.
- `geometry:kind:no_question` — méta uniquement ; pas de page d'apprentissage.

---

## Régénérer le pack de révision

```bash
node scripts/build-geometry-g2-hebrew-review-pack.mjs
node scripts/verify-geometry-g2-book-content.mjs
```

---

## Règle d'arrêt explicite

Jusqu'à ce que le propriétaire approuve le contenu :

- ❌ Pas de registre, de routes, de SQL, de validation, de push ou de déploiement
- ✅ Documentation et brouillon de démarque uniquement
