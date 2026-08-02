# 2ª primaria Libro di Inglese — Bozze

**Stato:** Contenuto in bozza — **15 / 15** pages. Non approvato dal proprietario. Nessun runtime collegato.
**Date:** June 2026
**Folder:** `docs/learning-book/english/g2/drafts/`
**Book title:** Libro di Inglese — 2ª primaria

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/ENGLISH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **15 / 15** |
| Pacchetto di revisione | ✅ `docs/learning-book/ENGLISH_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-english-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g2-draft-manifest.mjs` |
| Runtime / registro / route | ❌ Non creato |

---

## Denominazione

- Child-facing subject: ****
- Internal IDs: `english:g2:{pageId}`, `subject: english`

---

## Batch UN — continuing vocab (7)

| File | Draft title |
|------|-------------|
| `vocab_colors.md` | — |
| `vocab_numbers.md` | — 20 |
| `vocab_family.md` | — |
| `vocab_animals.md` | — |
| `vocab_emotions.md` | — |
| `vocab_actions.md` | — |
| `vocab_school.md` | — |

## Batch B — new vocab (2)

| File | Draft title |
|------|-------------|
| `vocab_food.md` | |
| `vocab_house.md` | — |

## Batch C — grammar (2)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | am / is / are — | Merged line -be_basic |
| `grammar_plural_questions.md` | | Merged plural line -question_frames |

## Batch D — sentences -translation (4)

| File | Draft title |
|------|-------------|
| `sentence_base.md` | — 2ª primaria |
| `sentence_routine.md` | — |
| `translation_classroom.md` | — |
| `translation_routines.md` | — |

---

## Regole di contenuto

- Continuing pages must differ from G1 — deeper sentences, not copy-paste
- No standalone writing page (writing access row excluded)
- Section 7 text-only — no practice routing

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-english-g2-hebrew-review-pack.mjs
node scripts/verify-english-g2-book-content.mjs
```

---

## Regola di stop esplicita

- ❌ No registry, routes, practice CTA, SQL, commit, push, deploy
- ✅ Drafts remain source for future runtime task
