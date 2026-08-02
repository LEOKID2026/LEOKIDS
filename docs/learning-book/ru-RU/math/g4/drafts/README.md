# Учебная книга: Математика — 4 класс — черновики

**Статус:** Все партии написаны — **37 / 37** черновиков страниц готово (Партии A–G). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/math/g4/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **37 / 37** (Batches A–G) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g4-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/math-g4-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G4) | ❌ Not created — no fake mappings |

---

## Источник истины

| Документ / файл | Роль |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 37 Grade 4 Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/learning-book/math/g1/drafts/`, `g2/drafts/`, `g3/drafts/` | Style reference only — **not modified** |
| `utils/math-constants.js` | Grade 4 operations context only |

---

## Партия A — разрядное значение, сравнение, последовательности и округление (8)

| Файл | Черновой заголовок |
|------|-------------|
| `ns_place_hundreds.md` | ערך המקום — אלפים ועד 10,000 |
| `ns_neighbors.md` | שכנים — מספרים גדולים |
| `ns_complement100.md` | השלמה ל-100 |
| `ns_complement10.md` | זוגות ל-10 — חזרה |
| `ns_even_odd.md` | Чётное/нечётное — большие числа |
| `cmp.md` | Сравнение больших чисел |
| `sequence.md` | Последовательности — большие скачки |
| `round.md` | Округление до десятков/сотен/тысяч |

---

## Партия B — свойства 0 и 1 (4)

| Файл | Черновой заголовок |
|------|-------------|
| `zero_add.md` | חיבור עם 0 |
| `zero_sub.md` | חיסור 0 |
| `zero_mul.md` | כפל ב-0 |
| `one_mul.md` | כפל ב-1 |

---

## Партия C — сложение, вычитание и умножение (5)

| Файл | Черновой заголовок |
|------|-------------|
| `add_two.md` | Сложение двух чисел — до 10 000 |
| `sub_two.md` | Вычитание двух чисел — до 10 000 |
| `add_three.md` | Сложение трёх чисел |
| `mul.md` | Умножение — таблица умножения и стратегии |
| `mul_vertical.md` | כפל במאונך |

---

## Партия D — деление, делимость, простые, множители и кратные (8)

| Файл | Черновой заголовок |
|------|-------------|
| `div.md` | Деление — деление поровну |
| `div_with_remainder.md` | חילוק עם שארית |
| `div_long.md` | חילוק ארוך |
| `divisibility.md` | התחלקות — 2, 3, 5, 6, 9, 10 |
| `prime_composite.md` | מספרים ראשוניים ופריקים |
| `fm_factor.md` | גורמים של מספר |
| `fm_multiple.md` | כפולות של מספר |
| `fm_gcd.md` | מ.א.ח |

---

## Партия E — десятичные числа, уравнения и оценка (7)

| Файл | Черновой заголовок |
|------|-------------|
| `dec_add.md` | Сложение десятичных — две цифры |
| `dec_sub.md` | Вычитание десятичных — две цифры |
| `eq_add.md` | Уравнение на сложение — неизвестное число |
| `eq_sub.md` | Уравнение на вычитание — неизвестное число |
| `est_add.md` | Оценка результата — сложение |
| `est_mul.md` | Оценка результата — умножение |
| `est_quantity.md` | הערכת כמות |

---

## Партия F — степени (2)

| Файл | Черновой заголовок |
|------|-------------|
| `power_base.md` | Степень — основание и показатель |
| `power_calc.md` | חזקה — חישוב |

---

## Партия G — текстовые задачи (3)

| Файл | Черновой заголовок |
|------|-------------|
| `wp_comparison_more.md` | Текстовая задача — на сколько больше? |
| `wp_leftover.md` | Текстовая задача — что осталось? |
| `wp_time_sum.md` | Текстовая задача — сумма времён |

---

## Заметки

- `book_placeholder.md` — infrastructure placeholder; **not** part of the 37-page book.
- All pages: `age_band: grades_3_4`, `approval_status: draft`, `grade: g4`.
- Раздел 7: только текст приглашения — **без маршрутизации практики**.
- Текст для ребёнка использует **математика**, not **Математика**.
- Сгруппированные тысячи (`1,000`, `10,000`) встречаются на многих страницах — рендерер должен изолировать LTR (см. правку Bidi G3).

---

## Пересоздать пакет обзора

```bash
node scripts/build-math-g4-hebrew-review-pack.mjs
node scripts/verify-math-g4-book-content.mjs
```

---

## Явное правило остановки

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Только документация и черновики markdown
