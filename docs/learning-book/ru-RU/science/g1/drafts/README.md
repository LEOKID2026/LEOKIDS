# 1 класс Естественные науки изучение Book — Drafts

**Статус:** Черновик содержания — **6 / 6** страниц. Без вставки в runtime.  
**План:** `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md`  
**Главный охват:** `docs/learning-book/SCIENCE_LEARNING_BOOK_MASTER_SCOPE_PLAN.md`  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/science/g1/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **6 / 6** (Batches A–B) |
| Content verification | ✅ `scripts/verify-science-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/science-g1-draft-manifest.mjs` |
| Runtime routes / registry | ❌ Not created |

---

## Именование

- Содержание книги для ребёнка использует **естественные науки**.
- Internal IDs remain `science:g1:{topic}` and `subject: science`.

---

## Партия A — мир живого (3)

| Файл | Черновой заголовок |
|------|-------------|
| `body.md` | Тело человека — органы чувств и движение |
| `animals.md` | Животные — живое и неживое |
| `plants.md` | Растения — что нужно растениям |

---

## Партия B — материалы, Земля и окружающая среда (3)

| Файл | Черновой заголовок |
|------|-------------|
| `materials.md` | Материалы — повседневные свойства |
| `earth_space.md` | כדור הארץ ומזג אוויר |
| `environment.md` | הסביבה שלנו |

---

## Заметки

- All pages: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Раздел 7: только текст — **без маршрутизации практики**.
- Нет небезопасных опытов, химикатов, огня или инструкций по электричеству.
- `science:topic:experiments` excluded in G1 (spine minGrade 2).

---

## Проверить

```bash
node scripts/verify-science-g1-book-content.mjs
node scripts/verify-science-learning-book-master-scope.mjs
```

---

## Явное правило остановки

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Черновики остаются источником для будущей задачи runtime
