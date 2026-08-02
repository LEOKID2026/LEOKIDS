# Livre d'apprentissage de l'anglais de CP — Brouillons

**Statut :** Brouillon de contenu — **10 / 10** pages. Non approuvé par le propriétaire. Aucun runtime câblé.
**Date :** juin 2026
**Dossier :** `docs/learning-book/english/g1/drafts/`
**Titre du livre :** ספר אנגלית — כיתה א׳

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **10 / 10** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-english-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g1-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Not created |

---

## Appellation

- Sujet face à l'enfant : **אנגלית**
- ID internes : `english:g1:{pageId}`, `subject: english`

---

## Lot A — אוצר מילים (3)

| File | Draft title |
|------|-------------|
| `vocab_colors.md` | צבעים באנגלית |
| `vocab_numbers.md` | מספרים 0–10 באנגלית |
| `vocab_family.md` | משפחה באנגלית |

## Lot B — אוצר מילים (4)

| File | Draft title |
|------|-------------|
| `vocab_animals.md` | חיות באנגלית |
| `vocab_emotions.md` | רגשות באנגלית |
| `vocab_actions.md` | פעולות באנגלית |
| `vocab_school.md` | בית ספר באנגלית |

## Lot C — תבניות בסיסיות (3)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | I am / You are — היכרות | Merged be line ו-be_basic pool |
| `sentence_base.md` | משפטים קצרים — בסיס | |
| `translation_classroom.md` | ביטויי כיתה | |

---

## Règles de contenu

- Explications en hébreu ; Exemples en anglais sur tes propres lignes
- 7 sections par page ; pas de `[DRAFT]` dans les corps de section
- Section 7 en texte uniquement — pas de pratique de routage
- Pas de pages alphabet/phonétique (pas dans le dos)

---

## Régénérer le pack de révision

```bash
node scripts/build-english-g1-hebrew-review-pack.mjs
node scripts/verify-english-g1-book-content.mjs
```

---

## Règle d'arrêt explicite

- ❌ Pas de registre, pas de routes, pratique CTA, SQL, commit, push, déploiement
- ✅ Les brouillons restent la source des futures tâches d'exécution
