# Учебная книга: Математика — 6 класс — черновики

**Статус:** Все партии написаны — **44 / 44** черновиков страниц готово (Партии A–I). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/math/g6/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **44 / 44** (Batches A–I) |
| Review pack | ✅ `docs/learning-book/MATH_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g6-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/math-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G6) | ❌ Not created — no fake mappings |

---

## Источник истины

| Документ / файл | Роль |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 44 Grade 6 Math `skill_id` entries in scope |
| `docs/learning-book/MATH_GRADE_6_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Section C (Grades 5–6) seven-section template |
| `docs/learning-book/math/g1–g4/drafts/` | Style reference only — **not modified** |
| `utils/math-constants.js` | Grade 6 operations context only |

---

## Партия A — разрядное значение, сравнение, последовательности и округление (6)

| Файл | Черновой заголовок |
|------|-------------|
| `ns_place_hundreds.md` | ערך המקום — עד 200,000 |
| `ns_neighbors.md` | שכנים — מספרים גדולים |
| `ns_complement100.md` | השלמה ל-100 |
| `cmp.md` | Сравнение больших чисел |
| `sequence.md` | Последовательности — большие скачки |
| `round.md` | Округление — десятки, сотни, тысячи |

---

## Партия B — сложение, вычитание, умножение и деление (6)

| Файл | Черновой заголовок |
|------|-------------|
| `add_two.md` | Сложение двух чисел — до 200 000 |
| `sub_two.md` | Вычитание двух чисел — до 200 000 |
| `add_three.md` | Сложение трёх чисел |
| `mul.md` | Умножение — стратегии и большие числа |
| `div.md` | Деление — деление поровну |
| `div_with_remainder.md` | חילוק עם שארית |

---

## Партия C — множители, кратные и НОД (3)

| Файл | Черновой заголовок |
|------|-------------|
| `fm_factor.md` | גורמים של מספר |
| `fm_multiple.md` | כפולות של מספר |
| `fm_gcd.md` | Наибольший общий делитель (НОД) |

---

## Партия D — уравнения (4)

| Файл | Черновой заголовок |
|------|-------------|
| `eq_add.md` | Уравнение на сложение — неизвестное число |
| `eq_sub.md` | Уравнение на вычитание — неизвестное число |
| `eq_mul.md` | Уравнение на умножение — неизвестное число |
| `eq_div.md` | Уравнение на деление — неизвестное число |

---

## Партия E — десятичные числа (7)

| Файл | Черновой заголовок |
|------|-------------|
| `dec_add.md` | Сложение десятичных чисел |
| `dec_sub.md` | Вычитание десятичных чисел |
| `dec_multiply.md` | Умножение десятичных чисел |
| `dec_multiply_10_100.md` | Умножение десятичного на 10 или 100 |
| `dec_divide.md` | Деление десятичных чисел |
| `dec_divide_10_100.md` | Деление десятичного на 10 или 100 |
| `dec_repeating.md` | עשרוניים מחזוריים |

---

## Партия F — дроби (3)

| Файл | Черновой заголовок |
|------|-------------|
| `frac_as_division.md` | שבר כחילוק |
| `frac_multiply.md` | כפל שברים |
| `frac_divide.md` | חילוק שברים |

---

## Партия G — отношение и масштаб (6)

| Файл | Черновой заголовок |
|------|-------------|
| `ratio_first.md` | Отношение — что это значит? |
| `ratio_second.md` | Отношение между двумя величинами |
| `ratio_find.md` | Нахождение неизвестной величины в отношении |
| `scale_find.md` | Масштаб — нахождение расстояния |
| `scale_map_to_real.md` | ממפה למציאות |
| `scale_real_to_map.md` | ממציאות למפה |

---

## Партия H — проценты (2)

| Файл | Черновой заголовок |
|------|-------------|
| `perc_part_of.md` | אחוז מכמות |
| `perc_discount.md` | הנחה באחוזים |

---

## Партия I — текстовые задачи (7)

| Файл | Черновой заголовок |
|------|-------------|
| `wp_comparison_more.md` | Текстовая задача — на сколько больше? |
| `wp_leftover.md` | Текстовая задача — что осталось? |
| `wp_time_sum.md` | Текстовая задача — сумма времён |
| `wp_distance_time.md` | מרחק, זמן ומהירות |
| `wp_shop_discount.md` | Текстовая задача — акция в магазине |
| `wp_unit_cm_to_m.md` | המרת יחידות — ס״מ ומטר |
| `wp_unit_g_to_kg.md` | Перевод единиц — грамм и килограмм |

---

## Заметки

- All pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- Раздел 7: только текст приглашения — **без маршрутизации практики**.
- Текст для ребёнка использует **математика**, not **Математика**.
- Сгруппированные тысячи (`1,000`, `10,000`, `100,000`, `200,000`) встречаются на многих страницах — рендерер должен изолировать LTR.
- Навыки дробей/процентов 5 класса (`frac_add_sub`, `frac_reduce` и т.д.) **не** входят в охват spine 6 класса — предполагаются покрытыми в книге 5 класса.

---

## Пересоздать пакет обзора

```bash
node scripts/build-math-g6-hebrew-review-pack.mjs
node scripts/verify-math-g6-book-content.mjs
```

Чтобы пересоздать черновые страницы из генератора (если правили):

```bash
node scripts/generate-math-g6-drafts.mjs
```

---

## Явное правило остановки

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Только документация и черновики markdown
