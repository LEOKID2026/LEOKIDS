# Книга английского — 6 класс — черновики

**Статус:** Черновик — **17 / 17** страниц. Не утверждено владельцем. Runtime не подключён.
**Дата:** июнь 2026
**Название книги:** Английский язык — 6 класс
**age_band:** `grades_5_6`

---

## Пакеты

| Batch | Pages | Focus |
|-------|-------|-------|
| A | 7 | Continuing vocab (G6 depth) |
| B | 3 | New vocab (culture, global_issues, history) |
| C | 4 | Grammar (complex tenses, conditionals, modals, comparatives) |
| D | 1 | Advanced sentences |
| E | 2 | Translation (technology, global) |

---

## Заметки об объединении

- `grammar_complex_tenses.md` — merged complex_tenses line + pool; PP intro only
- `grammar_conditionals.md` — merged conditionals line + pool; type 0/1 only
- `grammar_modals.md` — should/might/could (not G5 can/must focus)

## Исключённые списки слов

family, school, food, sports, colors, numbers, actions, house, body, weather — spine `maxGrade < 6`

---

## Пересоздать

```bash
node scripts/build-english-g6-hebrew-review-pack.mjs
node scripts/verify-english-g6-book-content.mjs
```

---

## Правило остановки

❌ No registry, routes, practice CTA, SQL, commit, push, deploy
