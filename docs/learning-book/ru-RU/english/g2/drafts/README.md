# Книга английского — 2 класс — черновики

**Статус:** Черновик — **15 / 15** страниц. Не утверждено владельцем. Runtime не подключён.
**Дата:** июнь 2026
**Папка:** `docs/learning-book/english/g2/drafts/`
**Название книги:** Английский язык — 2 класс

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **15 / 15** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-english-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g2-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Not created |

---

## Именование

- Предмет для ребёнка: **английский**
- Internal IDs: `english:g2:{pageId}`, `subject: english`

---

## Пакет A — продолжение словаря (7)

| Файл | Черновой заголовок |
|------|-------------|
| `vocab_colors.md` | Цвета — использование в предложении |
| `vocab_numbers.md` | מספרים — עד 20 |
| `vocab_family.md` | Семья — слова в предложении |
| `vocab_animals.md` | Животные — названия и предложения |
| `vocab_emotions.md` | רגשות — במשפט |
| `vocab_actions.md` | Действия — глагол в предложении |
| `vocab_school.md` | Школа — предметы в предложении |

## Пакет B — новый словарь (2)

| Файл | Черновой заголовок |
|------|-------------|
| `vocab_food.md` | מזון באנגלית |
| `vocab_house.md` | בית — חדרים וחפצים |

## Партия C — грамматика (2)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | am / is / are — חיזוק | Merged חיזוק line ו-be_basic |
| `grammar_plural_questions.md` | ריבוי ושאלות פשוטות | Merged plural line ו-question_frames |

## Batch D — sentences ו-translation (4)

| Файл | Черновой заголовок |
|------|-------------|
| `sentence_base.md` | Короткие предложения — 2 класс |
| `sentence_routine.md` | שגרת יום — משפטים |
| `translation_classroom.md` | ביטויי כיתה — משפטים |
| `translation_routines.md` | שגרת יום — תרגום |

---

## Правила содержания

- Последующие страницы должны отличаться от 1 класса — более глубокие предложения, не копипаст
- Нет отдельной страницы письма (строка writing access исключена)
- Раздел 7 только текст — без маршрутизации практики

---

## Пересоздать пакет обзора

```bash
node scripts/build-english-g2-hebrew-review-pack.mjs
node scripts/verify-english-g2-book-content.mjs
```

---

## Явное правило остановки

- ❌ No registry, routes, practice CTA, SQL, commit, push, deploy
- ✅ Черновики остаются источником для будущего runtime
