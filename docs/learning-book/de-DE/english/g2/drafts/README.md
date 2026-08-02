# 2. Klasse English Learning Book — Drafts

**Status:** Draft content — **15 / 15** pages. Not owner-approved. No runtime wired.
**Datum:** Juni 2026
**Folder:** `docs/learning-book/english/g2/drafts/`
**Book title:** Englischbuch — 2. Klasse

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **15 / 15** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-english-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g2-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Not created |

---

## Benennung

- Child-facing subject: **Englisch**
- Internal IDs: `english:g2:{pageId}`, `subject: english`

---

## Batch A — continuing vocab (7)

| Datei | Entwurfstitel |
|------|-------------|
| `vocab_colors.md` | Farben — im Satz verwenden |
| `vocab_numbers.md` | Zahlen — bis 20 |
| `vocab_family.md` | Familie — Wörter im Satz |
| `vocab_animals.md` | Tiere — Namen und Sätze |
| `vocab_emotions.md` | Gefühle — im Satz |
| `vocab_actions.md` | Handlungen — Verb im Satz |
| `vocab_school.md` | Schule — Gegenstände im Satz |

## Batch B — new vocab (2)

| Datei | Entwurfstitel |
|------|-------------|
| `vocab_food.md` | Essen auf Englisch |
| `vocab_house.md` | Zuhause — Räume und Gegenstände |

## Batch C — grammar (2)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | am / is / are — Vertiefung | Merged Vertiefung line and be_basic |
| `grammar_plural_questions.md` | Plural und einfache Fragen | Merged plural line and question_frames |

## Batch D — sentences and translation (4)

| Datei | Entwurfstitel |
|------|-------------|
| `sentence_base.md` | Kurze Sätze — 2. Klasse |
| `sentence_routine.md` | Tagesablauf — Sätze |
| `translation_classroom.md` | Klassenraum-Ausdrücke — Sätze |
| `translation_routines.md` | Tagesablauf — Übersetzung |

---

## Content rules

- Continuing pages must differ from G1 — deeper sentences, not copy-paste
- No standalone writing page (writing access row excluded)
- Section 7 text-only — no practice routing

---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-english-g2-hebrew-review-pack.mjs
node scripts/verify-english-g2-book-content.mjs
```

---

## Explicit stop rule

- ❌ No registry, routes, practice CTA, SQL, commit, push, deploy
- ✅ Drafts remain source for future runtime task
