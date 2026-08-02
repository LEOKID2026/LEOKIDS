# Книга английского — 1 класс — черновики

**Статус:** Черновик — **10 / 10** страниц. Не утверждено владельцем. Runtime не подключён.
**Дата:** июнь 2026
**Папка:** `docs/learning-book/english/g1/drafts/`
**Название книги:** Английский язык — 1 класс

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **10 / 10** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-english-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g1-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Not created |

---

## Именование

- Предмет для ребёнка: **английский**
- Internal IDs: `english:g1:{pageId}`, `subject: english`

---

## Партия A — словарный запас (3)

| Файл | Черновой заголовок |
|------|-------------|
| `vocab_colors.md` | צבעים באנגלית |
| `vocab_numbers.md` | מספרים 0–10 באנגלית |
| `vocab_family.md` | משפחה באנגלית |

## Партия B — словарный запас (4)

| Файл | Черновой заголовок |
|------|-------------|
| `vocab_animals.md` | חיות באנגלית |
| `vocab_emotions.md` | רגשות באנגלית |
| `vocab_actions.md` | פעולות באנגלית |
| `vocab_school.md` | בית ספר באנגלית |

## Партия C — базовые шаблоны (3)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | I am / You are — היכרות | Merged be line ו-be_basic pool |
| `sentence_base.md` | Короткие предложения — основа | |
| `translation_classroom.md` | ביטויי כיתה | |

---

## Правила содержания

- Пояснения на русском; английские примеры на отдельных строках
- 7 разделов на страницу; без `[DRAFT]` в тексте разделов
- Раздел 7 только текст — без маршрутизации практики
- Нет страниц алфавита/фонетики (нет в spine)

---

## Пересоздать пакет обзора

```bash
node scripts/build-english-g1-hebrew-review-pack.mjs
node scripts/verify-english-g1-book-content.mjs
```

---

## Явное правило остановки

- ❌ No registry, routes, practice CTA, SQL, commit, push, deploy
- ✅ Черновики остаются источником для будущего runtime
