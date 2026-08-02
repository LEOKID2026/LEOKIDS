# Livre d'apprentissage de la géométrie CP — Brouillons

**Statut :** **Contenu approuvé par le propriétaire** — **3/3** pages. L'insertion du runtime n'a pas démarré.  
**Approbation :** `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md`  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/geometry/g1/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md` |
| Draft markdown pages | ✅ **3 / 3** (Batches A–B) — **content approved** |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/geometry-g1-draft-manifest.mjs` |
| Runtime routes | ✅ `/learning/book/geometry/g1` + `[pageId]` (3 SSG pages) |
| Practice CTA resolver | ❌ Not created — post-runtime task |

---

## Appellation

- Le contenu du livre destiné aux enfants utilise **גאומטריה**, et non **הנדסה** (approuvé par le propriétaire).
- Les identifiants internes restent `geometry:g1:{pageId}` et `subject: geometry`.

---

## Source de vérité

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | CP geometry `skill_id` entries in scope |
| `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section template (Grades 1–2 age band) |
| `docs/learning-book/math/g1/drafts/` | Style reference only — **not modified** |
| `utils/geometry-constants.js` | G1 topic descriptions (context only) |

---

## Lot A — צורות בסיסיות (2)

| File | Draft title |
|------|-------------|
| `shapes_basic_square.md` | הכרת הריבוע |
| `shapes_basic_rectangle.md` | הכרת המלבן |

---

## Lot B — הזזה ושיקוף (1)

| File | Draft title |
|------|-------------|
| `transformations.md` | הזזה ושיקוף — היכרות |

---

## Remarques

- `book_placeholder.md` — espace réservé à l'infrastructure ; **ne** fait pas partie du livre de 3 pages.
- Toutes les pages : `age_band: classes_1_2`, `approval_status: draft`, `classe: g1`.
- Section 7 : brouillon d'invitation uniquement — **pas de routage pratique**.
- Pas de diagrammes ASCII ni de tableaux de démarques dans les corps destinés aux enfants.
- `geometry:kind:no_question` est uniquement une méta de la colonne vertébrale - **pas** de page d'apprentissage.

---

## Régénérer le pack de révision

```bash
node scripts/build-geometry-g1-hebrew-review-pack.mjs
node scripts/verify-geometry-g1-book-content.mjs
```

---

## Règle d'arrêt explicite

Le contenu est approuvé par le propriétaire ; **l'insertion d'exécution n'a pas démarré** :

- ❌ Pas de registre, de routes, de SQL, de validation, de push ou de déploiement (sauf demande explicite)
- ✅ Les brouillons hébreux approuvés restent la source d'une future tâche d'exécution
