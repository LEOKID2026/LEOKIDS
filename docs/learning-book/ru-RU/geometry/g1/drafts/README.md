# Учебная книга: Геометрия — 1 класс — черновики

**Статус:** **Содержание утверждено владельцем** — **3 / 3** pages. Вставка в runtime не начата.  
**Утверждение:** `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md`  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/geometry/g1/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md` |
| Draft markdown pages | ✅ **3 / 3** (Batches A–B) — **content approved** |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/geometry-g1-draft-manifest.mjs` |
| Runtime routes | ✅ `/learning/book/geometry/g1` + `[pageId]` (3 SSG pages) |
| Practice CTA resolver | ❌ Not created — post-runtime task |

---

## Именование

- Содержание книги для ребёнка использует **Геометрия**, не **инженерия** (утверждено владельцем).
- Internal IDs remain `geometry:g1:{pageId}` and `subject: geometry`.

---

## Источник истины

| Документ / файл | Роль |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Grade 1 geometry `skill_id` entries in scope |
| `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section template (Grades 1–2 age band) |
| `docs/learning-book/math/g1/drafts/` | Style reference only — **not modified** |
| `utils/geometry-constants.js` | G1 topic descriptions (context only) |

---

## Партия A — базовые фигуры (2)

| Файл | Черновой заголовок |
|------|-------------|
| `shapes_basic_square.md` | הכרת הריבוע |
| `shapes_basic_rectangle.md` | הכרת המלבן |

---

## Партия B — перенос и отражение (1)

| Файл | Черновой заголовок |
|------|-------------|
| `transformations.md` | הזזה ושיקוף — היכרות |

---

## Заметки

- `book_placeholder.md` — infrastructure placeholder; **not** part of the 3-page book.
- All pages: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Раздел 7: только черновик приглашения — **без маршрутизации практики**.
- В тексте для ребёнка нет ASCII-схем и markdown-таблиц.
- `geometry:kind:no_question` is spine meta only — **no** learning page.

---

## Пересоздать пакет обзора

```bash
node scripts/build-geometry-g1-hebrew-review-pack.mjs
node scripts/verify-geometry-g1-book-content.mjs
```

---

## Явное правило остановки

Содержание утверждено владельцем; **вставка в runtime не начата**:

- ❌ No registry, routes, SQL, commit, push, or deploy (unless explicitly requested)
- ✅ Утверждённые черновики остаются источником для будущей задачи runtime
