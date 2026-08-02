# 1ª secondaria Libro di Inglese — Bozze

**Stato:** Contenuto in bozza — **17 / 17** pages. Non approvato dal proprietario. Nessun runtime collegato.
**Date:** June 2026
**Book title:** Libro di Inglese — 1ª secondaria
**age_band:** `grades_5_6`

---

## Batches

| Batch | Pages | Focus |
|-------|-------|-------|
| A | 7 | Continuing vocab (G6 depth) |
| B | 3 | New vocab (culture, global_issues, history) |
| C | 4 | Grammar (complex tenses, conditionals, modals, comparatives) |
| D | 1 | Advanced sentences |
| E | 2 | Translation (technology, global) |

---

## Merge notes

- `grammar_complex_tenses.md` — merged complex_tenses line + pool; PP intro only
- `grammar_conditionals.md` — merged conditionals line + pool; type 0/1 only
- `grammar_modals.md` — should/might/could (not G5 can/must focus)

## Excluded word lists

family, school, food, sports, colors, numbers, actions, house, body, weather — spine `maxGrade < 6`

---

## Regenerate

```bash
node scripts/build-english-g6-hebrew-review-pack.mjs
node scripts/verify-english-g6-book-content.mjs
```

---

## Stop rule

❌ No registry, routes, practice CTA, SQL, commit, push, deploy
