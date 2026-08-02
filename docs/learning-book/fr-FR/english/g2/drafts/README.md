# Livre d'apprentissage de l'anglais de CE1 — Brouillons

**Statut :** Brouillon de contenu — **15/15** pages. Non approuvé par le propriétaire. Aucun runtime câblé.
**Date :** juin 2026
**Dossier :** `docs/learning-book/english/g2/drafts/`
**Titre du livre :** ספר אנגלית — כיתה ב׳

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **15 / 15** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-english-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g2-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Not created |

---

## Appellation

- Sujet face à l'enfant : **אנגלית**
- ID internes : `english:g2:{pageId}`, `subject: english`

---

## Lot A - vocabulaire continu (7)

| File | Draft title |
|------|-------------|
| `vocab_colors.md` | צבעים — שימוש במשפט |
| `vocab_numbers.md` | מספרים — עד 20 |
| `vocab_family.md` | משפחה — מילים במשפט |
| `vocab_animals.md` | חיות — שמות ומשפטים |
| `vocab_emotions.md` | רגשות — במשפט |
| `vocab_actions.md` | פעולות — פועל במשפט |
| `vocab_school.md` | בית ספר — חפצים במשפט |

## Lot B — nouveau vocabulaire (2)

| File | Draft title |
|------|-------------|
| `vocab_food.md` | מזון באנגלית |
| `vocab_house.md` | בית — חדרים וחפצים |

## Lot C — grammaire (2)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | am / is / are — חיזוק | Merged חיזוק line ו-be_basic |
| `grammar_plural_questions.md` | ריבוי ושאלות פשוטות | Merged plural line ו-question_frames |

## Lot D — phrases ו-traduction (4)

| File | Draft title |
|------|-------------|
| `sentence_base.md` | משפטים קצרים — כיתה ב׳ |
| `sentence_routine.md` | שגרת יום — משפטים |
| `translation_classroom.md` | ביטויי כיתה — משפטים |
| `translation_routines.md` | שגרת יום — תרגום |

---

## Règles de contenu

- Les pages suivantes doivent différer de G1 – phrases plus profondes, pas de copier-coller
- Pas de page d'écriture autonome (ligne d'accès en écriture exclue)
- Section 7 en texte uniquement — pas de pratique de routage

---

## Régénérer le pack de révision

```bash
node scripts/build-english-g2-hebrew-review-pack.mjs
node scripts/verify-english-g2-book-content.mjs
```

---

## Règle d'arrêt explicite

- ❌ Pas de registre, pas de routes, pratique CTA, SQL, commit, push, déploiement
- ✅ Les brouillons restent la source des futures tâches d'exécution
