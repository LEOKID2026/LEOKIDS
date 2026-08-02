# Учебная книга: Математика — 5 класс — черновики

**Статус:** Все партии написаны — **40 / 40** черновиков страниц готово (Партии A–H). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/math/g5/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **40 / 40** (Batches A–H) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g5-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/math-g5-draft-manifest.mjs` |
| Draft content source (scripts only) | ✅ `scripts/lib/math-g5-draft-content.mjs` |
| Draft generator (optional regen) | ✅ `scripts/gen-math-g5-drafts.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G5) | ❌ Not created — no fake mappings |

---

## Источник истины

| Документ / файл | Роль |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 40 Grade 5 Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section template (Grades 5–6 age band) |
| `docs/learning-book/math/g1/drafts/` … `g4/drafts/` | Style reference only — **not modified** |
| `utils/math-constants.js` | Grade 5 operations context only |

---

## Партия A — разрядное значение, сравнение, последовательности и округление (6)

| Файл | Черновой заголовок |
|------|-------------|
| `ns_place_hundreds.md` | ערך המקום — עד 100,000 |
| `ns_neighbors.md` | שכנים — עד 100,000 |
| `ns_complement100.md` | השלמה ל-100 |
| `cmp.md` | Сравнение чисел — до 100 000 |
| `sequence.md` | Последовательности — большие скачки |
| `round.md` | Округление — десятки тысяч |

---

## Партия B — сложение, вычитание и умножение (4)

| Файл | Черновой заголовок |
|------|-------------|
| `add_two.md` | חיבור — עד 100,000 |
| `sub_two.md` | חיסור — עד 100,000 |
| `add_three.md` | Сложение трёх чисел |
| `mul.md` | Умножение — стратегии |

---

## Партия C — деление (3)

| Файл | Черновой заголовок |
|------|-------------|
| `div.md` | Деление — деление поровну |
| `div_with_remainder.md` | חילוק עם שארית |
| `div_two_digit.md` | Деление на двузначный делитель |

---

## Партия D — дроби (5)

| Файл | Черновой заголовок |
|------|-------------|
| `frac_reduce.md` | צמצום שבר |
| `frac_expand.md` | הרחבת שבר |
| `frac_add_sub.md` | Сложение и вычитание дробей |
| `mixed_to_frac.md` | מספר מעורב לשבר |
| `frac_to_mixed.md` | שבר למספר מעורב |

---

## Партия E — десятичные числа и уравнения (6)

| Файл | Черновой заголовок |
|------|-------------|
| `dec_add.md` | Сложение десятичных |
| `dec_sub.md` | Вычитание десятичных |
| `eq_add.md` | Уравнение на сложение |
| `eq_sub.md` | Уравнение на вычитание |
| `eq_mul.md` | Уравнение на умножение |
| `eq_div.md` | Уравнение на деление |

---

## Партия F — множители, кратные, НОД и оценка (6)

| Файл | Черновой заголовок |
|------|-------------|
| `fm_factor.md` | גורמים |
| `fm_multiple.md` | כפולות |
| `fm_gcd.md` | Наибольший общий делитель (НОД) |
| `est_add.md` | Оценка сложения |
| `est_mul.md` | Оценка умножения |
| `est_quantity.md` | אומדן כמות |

---

## Партия G — проценты (2)

| Файл | Черновой заголовок |
|------|-------------|
| `perc_part_of.md` | אחוז מכמות |
| `perc_discount.md` | הנחה באחוזים |

---

## Партия H — текстовые задачи (8)

| Файл | Черновой заголовок |
|------|-------------|
| `wp_comparison_more.md` | כמה יותר? |
| `wp_leftover.md` | מה נשאר? |
| `wp_time_sum.md` | סכום זמנים |
| `wp_multi_step.md` | שאלה מרובת שלבים |
| `wp_distance_time.md` | מרחק, זמן, מהירות |
| `wp_shop_discount.md` | קניות והנחה |
| `wp_unit_cm_to_m.md` | ס״מ ↔ מטר |
| `wp_unit_g_to_kg.md` | גרם ↔ ק״ג |

---

## Заметки

- `book_placeholder.md` — infrastructure placeholder; **not** part of the 40-page book.
- All pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- Раздел 7: только текст приглашения — **без маршрутизации практики**.
- Текст для ребёнка использует **математика**, not **Математика**.
- Сгруппированные тысячи (`1,000`, `10,000`, `48,726`) встречаются на многих страницах — рендерер должен изолировать LTR.

---

## Пересоздать черновики / пакет проверки

```bash
node scripts/gen-math-g5-drafts.mjs
node scripts/build-math-g5-hebrew-review-pack.mjs
node scripts/verify-math-g5-book-content.mjs
```

---

## Явное правило остановки

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Только документация и черновики markdown
