# Учебная книга: Математика — 3 класс — черновики

**Статус:** Все партии написаны — **26 / 26** черновиков страниц готово (Партии A + B + C + D). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/math/g3/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **26 / 26** (Batches A + B + C + D) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g3-book-content.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G3) | ❌ Not created — no fake mappings |

---

## Источник истины

| Документ / файл | Роль |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 26 Grade 3 Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/learning-book/math/g1/drafts/`, `math/g2/drafts/` | Style reference only — **not modified** |
| `utils/math-constants.js` | Grade 3 operations context |

---

## Партия A — основы чисел, сравнение и последовательности (7)

| Файл | Черновой заголовок |
|------|-------------|
| `ns_place_hundreds.md` | מאות, עשרות ואחדות — עד 1,000 |
| `ns_neighbors.md` | שכנים של מספר — עד 1,000 |
| `ns_complement10.md` | Пары, составляющие 10 — повторение |
| `ns_complement100.md` | זוגות שמרכיבים 100 |
| `ns_even_odd.md` | Чётное и нечётное — большие числа |
| `cmp.md` | Сравнение чисел до 1000 |
| `sequence.md` | Числовые последовательности |

---

## Партия B — сложение, вычитание, умножение и деление (9)

| Файл | Черновой заголовок |
|------|-------------|
| `add_two.md` | Сложение двух чисел — до 1000 |
| `sub_two.md` | Вычитание двух чисел — до 1000 |
| `add_three.md` | Сложение трёх чисел |
| `mul.md` | Умножение — таблица умножения |
| `mul_tens.md` | Умножение на десятки |
| `mul_hundreds.md` | כפל במאות |
| `div.md` | Деление — деление поровну |
| `div_with_remainder.md` | חילוק עם שארית |
| `divisibility.md` | התחלקות ב-2, ב-5 וב-10 |

---

## Партия C — уравнения, десятичные числа и порядок действий (7)

| Файл | Черновой заголовок |
|------|-------------|
| `eq_add.md` | Уравнение на сложение — неизвестное число |
| `eq_sub.md` | Уравнение на вычитание — неизвестное число |
| `dec_add.md` | Сложение десятичных |
| `dec_sub.md` | Вычитание десятичных |
| `order_add_mul.md` | Порядок действий — сложение и умножение |
| `order_mul_sub.md` | Порядок действий — умножение и вычитание |
| `order_parentheses.md` | סוגריים בחישוב |

---

## Партия D — текстовые задачи (3)

| Файл | Черновой заголовок |
|------|-------------|
| `wp_comparison_more.md` | Текстовая задача — на сколько больше? |
| `wp_leftover.md` | Текстовая задача — что осталось? |
| `wp_time_sum.md` | Текстовая задача — сумма времён |

---

## Заметки

- `book_placeholder.md` — infrastructure placeholder from structure expansion; **not** part of the 26-page book.
- All pages: `age_band: grades_3_4`, `approval_status: draft`.
- Раздел 7: только текст приглашения — **без маршрутизации практики**.
- Текст для ребёнка использует **математика**, not **Математика**.

---

## Пересоздать пакет обзора

```bash
node scripts/build-math-g3-hebrew-review-pack.mjs
node scripts/verify-math-g3-book-content.mjs
```

---

## Явное правило остановки

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Только документация и черновики markdown
