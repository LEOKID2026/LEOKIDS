# Учебная книга: Геометрия — 2 класс — черновики

**Статус:** Все партии написаны — **3 / 3** черновиков страниц готово. Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/geometry/g2/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **3 / 3** (Batches A–C) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/geometry-g2-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g2-registry`, `/learning/book/geometry/g2`) |

---

## Именование

- Содержание книги для ребёнка использует **Геометрия**, не **инженерия**.
- Internal IDs: `geometry:g2:{pageId}`, `subject: geometry`.

---

## Партия A — тела (1)

| Файл | Черновой заголовок |
|------|-------------|
| `solids.md` | Трёхмерные тела — названия и знакомство |

---

## Партия B — площадь (1)

| Файл | Черновой заголовок |
|------|-------------|
| `square_area.md` | שטח של ריבוע |

---

## Партия C — перенос и отражение (1)

| Файл | Черновой заголовок |
|------|-------------|
| `transformations.md` | הזזה ושיקוף — המשך |

---

## Заметки

- `book_placeholder.md` — infrastructure placeholder; **not** part of the 3-page book.
- All pages: `age_band: grades_1_2`, `approval_status: draft`, `grade: g2`.
- G1 pages for `shapes_basic_square` / `shapes_basic_rectangle` are not repeated — those skills end at Grade 1 in the spine.
- `geometry:kind:no_question` — meta only; no learning page.

---

## Пересоздать пакет обзора

```bash
node scripts/build-geometry-g2-hebrew-review-pack.mjs
node scripts/verify-geometry-g2-book-content.mjs
```

---

## Явное правило остановки

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Только документация и черновики markdown
