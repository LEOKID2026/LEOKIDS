# Livre d'apprentissage des mathématiques de CE2 — Brouillons

**Statut :** Tous les lots créés — **26 / 26** brouillons de pages terminés (lots A + B + C + D). Examen du propriétaire en attente.  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/math/g3/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **26 / 26** (Batches A + B + C + D) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g3-book-content.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G3) | ❌ Not created — no fake mappings |

---

## Source de vérité

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 26 CE2 Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/learning-book/math/g1/drafts/`, `math/g2/drafts/` | Style reference only — **not modified** |
| `utils/math-constants.js` | CE2 operations context |

---

## Lot A — יסודות מספרים, השוואה וסדרות (7)

| File | Draft title |
|------|-------------|
| `ns_place_hundreds.md` | מאות, עשרות ואחדות — עד 1,000 |
| `ns_neighbors.md` | שכנים של מספר — עד 1,000 |
| `ns_complement10.md` | זוגות שמרכיבים 10 — חזרה |
| `ns_complement100.md` | זוגות שמרכיבים 100 |
| `ns_even_odd.md` | זוגי ואי-זוגי — מספרים גדולים |
| `cmp.md` | השוואת מספרים עד 1,000 |
| `sequence.md` | סדרות מספרים |

---

## Lot B — חיבור, חיסור, כפל וחילוק (9)

| File | Draft title |
|------|-------------|
| `add_two.md` | חיבור שני מספרים — עד 1,000 |
| `sub_two.md` | חיסור שני מספרים — עד 1,000 |
| `add_three.md` | חיבור שלושה מספרים |
| `mul.md` | כפל — לוח הכפל |
| `mul_tens.md` | כפל בעשרות |
| `mul_hundreds.md` | כפל במאות |
| `div.md` | חילוק — חלוקה שווה |
| `div_with_remainder.md` | חילוק עם שארית |
| `divisibility.md` | התחלקות ב-2, ב-5 וב-10 |

---

## Lot C — משוואות, עשרוניים וסדר פעולות (7)

| File | Draft title |
|------|-------------|
| `eq_add.md` | משוואת חיבור — מספר חסר |
| `eq_sub.md` | משוואת חיסור — מספר חסר |
| `dec_add.md` | חיבור עשרוניים |
| `dec_sub.md` | חיסור עשרוניים |
| `order_add_mul.md` | סדר פעולות — חיבור וכפל |
| `order_mul_sub.md` | סדר פעולות — כפל וחיסור |
| `order_parentheses.md` | סוגריים בחישוב |

---

## Lot D — שאלות מילוליות (3)

| File | Draft title |
|------|-------------|
| `wp_comparison_more.md` | שאלה מילולית — כמה יותר? |
| `wp_leftover.md` | שאלה מילולית — מה נשאר? |
| `wp_time_sum.md` | שאלה מילולית — סכום זמנים |

---

## Remarques

- `book_placeholder.md` — espace réservé à l'infrastructure résultant de l'expansion de la structure ; **ne** fait pas partie du livre de 26 pages.
- Toutes les pages : `age_band: classes_3_4`, `approval_status: draft`.
- Section 7 : projet de texte d'invitation uniquement – **pas de routage pratique**.
- La copie destinée aux enfants utilise **חשבון**, et non **מתמטיקה**.

---

## Régénérer le pack de révision

```bash
node scripts/build-math-g3-hebrew-review-pack.mjs
node scripts/verify-math-g3-book-content.mjs
```

---

## Règle d'arrêt explicite

Jusqu'à ce que le propriétaire approuve le contenu :

- ❌ Pas de registre, de routes, de SQL, de validation, de push ou de déploiement
- ✅ Documentation et brouillon de démarque uniquement
