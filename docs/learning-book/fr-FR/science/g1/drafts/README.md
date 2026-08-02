# Livre d'apprentissage des sciences de CP — Brouillons

**Statut :** Brouillon de contenu — **6 / 6** pages. Aucune insertion d’exécution.  
**Plan :** `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md`  
**Portée principale :** `docs/learning-book/SCIENCE_LEARNING_BOOK_MASTER_SCOPE_PLAN.md`  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/science/g1/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **6 / 6** (Batches A–B) |
| Content verification | ✅ `scripts/verify-science-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/science-g1-draft-manifest.mjs` |
| Runtime routes / registry | ❌ Not created |

---

## Appellation

- Le contenu du livre destiné aux enfants utilise **מדעים**.
- Les identifiants internes restent `science:g1:{topic}` et `subject: science`.

---

## Lot A — עולם החיים (3)

| File | Draft title |
|------|-------------|
| `body.md` | גוף האדם — חושים ותנועה |
| `animals.md` | בעלי חיים — חי לעומת דומם |
| `plants.md` | צמחים — מה צמחים צריכים |

---

## Lot B — חומרים, כדור הארץ וסביבה (3)

| File | Draft title |
|------|-------------|
| `materials.md` | חומרים — תכונות יומיומיות |
| `earth_space.md` | כדור הארץ ומזג אוויר |
| `environment.md` | הסביבה שלנו |

---

## Remarques

- Toutes les pages : `age_band: classes_1_2`, `approval_status: draft`, `classe: g1`.
- Section 7 : texte uniquement — **pas de routage pratique**.
- Pas d'expériences dangereuses, de produits chimiques, d'incendie ou d'instructions électriques.
- `science:topic:experiments` exclu en G1 (colonne vertébrale minGrade 2).

---

## Vérifier

```bash
node scripts/verify-science-g1-book-content.mjs
node scripts/verify-science-learning-book-master-scope.mjs
```

---

## Règle d'arrêt explicite

- ❌ Pas de registre, de routes, de SQL, de validation, de push ou de déploiement
- ✅ Les brouillons en hébreu restent la source d'une future tâche d'exécution
