# Учебная книга: Математика — 2 класс — черновики

**Статус:** Все партии написаны — **22 / 22** черновиков страниц готово (Партии A + B + C + D). Применён полный проход правки (июнь 2026). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/math/g2/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| UI style lock | ✅ `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` |
| Draft markdown pages | ✅ **22 / 22** (Batches A + B + C + D) |
| Batch A polish pass | ✅ Applied (June 2026) |
| Batch B polish pass | ✅ Applied (June 2026) |
| Batch C authoring | ✅ Complete + polish pass applied (June 2026) |
| Batch D authoring | ✅ Complete (June 2026) — owner review pending |
| Full review polish pass | ✅ Applied (June 2026) |
| Runtime registry | ✅ `lib/learning-book/math-g2-registry.js` |
| Page loader | ✅ `lib/learning-book/load-math-g2-pages.js` |
| App route `/learning/book/math/g2` | ✅ Implemented (dev preview) |
| Practice CTA resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-practice-target.js` |
| Book page resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-book-page.js` |
| Math Master book entry | ✅ General tile + topic + in-learning buttons (g2) |
| Verification script | ✅ `scripts/verify-math-g2-book.mjs` |

---

## Решения владельца (зафиксированы — июнь 2026)

| Topic | Decision |
|-------|----------|
| UI / reader | Reuse Grade 1 book reader — no redesign |
| `divisibility` | **2, 5, 10 only** in G2; child-facing last-digit rules; no 3/6/9 |
| Fractions (Batch C) | **Visual only** — half and quarter; no fraction arithmetic |
| `frac_*_reverse` | Doubling (half) or 4 equal parts (quarter) to find whole |
| `wp_time_date` / `wp_time_days` | **Weekdays only** for G2 (Batch D) |
| `wp_coins` | Simple equal groups / multiplication allowed (Batch D) |

---

## Источник истины

| Документ / файл | Роль |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 22 Grade 2 Math `skill_id` entries |
| `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Page types and wide-span rules |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section Grades 1–2 template |
| `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` | Reader UX — reuse Grade 1 |
| `utils/math-constants.js` | Grade 2 number ranges and allowed operations |
| `docs/learning-book/math/g1/drafts/` | **Style reference only** |

---

## Партия A — основы чисел и сравнение

**Статус:** ✅ Черновик готов + применена правка

| Файл | Черновой заголовок |
|------|-------------|
| `ns_place_tens_units.md` | מאות, עשרות ואחדות — עד 1,000 |
| `ns_neighbors.md` | Соседи числа — ещё большие числа |
| `ns_complement10.md` | Пары, составляющие 10 — помощь в сложении |
| `ns_even_odd.md` | Чётное и нечётное — повторение и практика |
| `cmp.md` | Сравнение чисел до 1000 |

---

## Партия B — сложение, вычитание, умножение и деление

**Статус:** ✅ Черновик готов + применена правка

| Файл | Черновой заголовок |
|------|-------------|
| `add_two.md` | Сложение двух чисел — до 100 |
| `sub_two.md` | Вычитание двух чисел — до 100 |
| `add_vertical.md` | חיבור במאונך |
| `sub_vertical.md` | חיסור במאונך |
| `mul.md` | Таблица умножения — равные группы |
| `div.md` | Деление — деление поровну |

---

## Партия C — делимость и дроби

**Статус:** ✅ **Черновик готов + применена правка** (июнь 2026) — ожидается проверка владельца

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `divisibility.md` | `math:g2:divisibility` | `math:kind:divisibility` | concept_foundation | מתי מספר מתחלק ב־2, ב־5 וב־10? |
| `frac_half.md` | `math:g2:frac_half` | `math:kind:frac_half` | visual_intuition | חצי מהשלם |
| `frac_half_reverse.md` | `math:g2:frac_half_reverse` | `math:kind:frac_half_reverse` | visual_intuition | מציאת השלם כשיש חצי |
| `frac_quarter.md` | `math:g2:frac_quarter` | `math:kind:frac_quarter` | visual_intuition | רבע מהשלם |
| `frac_quarter_reverse.md` | `math:g2:frac_quarter_reverse` | `math:kind:frac_quarter_reverse` | visual_intuition | מציאת השלם כשיש רבע |

All Batch C pages:

- `subject`: math · `grade`: g2 · `age_band`: grades_1_2 · `approval_status`: **draft**
- Заголовки разделов: Чему учимся? / Объяснение / Пример / Давай разберём / Попробуй сам / Осторожно! / Давай попрактикуемся!
- Все заголовки: **`[DRAFT — не утверждено владельцем]`**

### Проход полировки пакета C (июнь 2026)

| Исправление | Подробность |
|-----|--------|
| `frac_half` / `frac_quarter` | Раздел 7: **две равные части** / **четыре равные части** (не «две/четыре равны») |
| `frac_half_reverse` | Раздел 1: убрано **перевернуть**; Раздел 6: яснее ошибка |
| `frac_quarter_reverse` | Раздел 1: **когда нам известна четверть…**; Раздел 6: контраст половины и четверти (**5 + 5** vs **5 + 5 + 5 + 5**) |

### Заметки об охвате содержания пакета C

- `divisibility`: **только 2, 5, 10**; «делится на 2/5/10»; правила последней цифры; напр. 40; **без** 3/6/9; поверхностно только «без остатка»
- `frac_half`: наглядно; половина = одна часть из двух равных частей; напр. половина от 12 = 6; без формальных числителя/знаменателя
- `frac_half_reverse`: знаешь половину → найди целое; удвоение; напр. половина = 6 → целое 12
- `frac_quarter`: наглядно; четверть = одна часть из четырёх равных частей; напр. четверть от 12 = 3; без третей/восьмых
- `frac_quarter_reverse`: знаешь четверть → найди целое; 4 равные части; 4 × или повторное сложение; напр. четверть = 4 → целое 16

### Выравнивание разделов 5 / 6 пакета C

| Страница | Раздел 5 (попробуй сам) | Раздел 6 (ошибка) |
|------|-------------------|---------------------|
| `divisibility` | 35 — divide by 2, 5, 10? | 35 confused with ÷10 |
| `frac_half` | половина от 10 = ? | 10 неравное деление (4+6) |
| `frac_half_reverse` | חצי = 5 → whole? | 5 + 1 = 6 instead of 5 + 5 |
| `frac_quarter` | четверть от 20 = ? | 20 деление на 2 (половина = 10) |
| `frac_quarter_reverse` | רבע = 5 → whole? | 5 + 5 = 10 (half not quarter) |

---

## Партия D — текстовые задачи

**Статус:** ✅ **черновик готов** (июнь 2026) — ожидает обзора владельца

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `wp_coins.md` | `math:g2:wp_coins` | `math:kind:wp_coins` | word_problem_strategy | שאלות מילוליות — מטבעות |
| `wp_coins_spent.md` | `math:g2:wp_coins_spent` | `math:kind:wp_coins_spent` | word_problem_strategy | שאלות מילוליות — קניות ועודף |
| `wp_time_date.md` | `math:g2:wp_time_date` | `math:kind:wp_time_date` | word_problem_strategy | שאלות מילוליות — ימי השבוע |
| `wp_time_days.md` | `math:g2:wp_time_days` | `math:kind:wp_time_days` | word_problem_strategy | שאלות מילוליות — כמה ימים בין יום ליום |
| `wp_groups_g2.md` | `math:g2:wp_groups_g2` | `math:kind:wp_groups_g2` | word_problem_strategy | שאלות מילוליות — קבוצות שוות |
| `wp_division_simple.md` | `math:g2:wp_division_simple` | `math:kind:wp_division_simple` | word_problem_strategy | שאלות מילוליות — חלוקה שווה |

All Batch D pages:

- `subject`: math · `grade`: g2 · `age_band`: grades_1_2 · `approval_status`: **draft**
- Заголовки разделов: Чему учимся? / Объяснение / Пример / Давай разберём / Попробуй сам / Осторожно! / Давай попрактикуемся!
- Все заголовки: **`[DRAFT — не утверждено владельцем]`**
- Рамка текстовой задачи: **Что знаем? / Что спрашивают? / Что делаем?**

### Заметки об охвате содержания пакета D

- `wp_coins`: только целые рубли; суммы в один шаг; равные группы / умножение допустимы (например 4 × 5); до ~100; без копеек, без многошаговых денежных задач
- `wp_coins_spent`: paid − cost = change; single-step; one purchase; up to ~100; no agorot
- `wp_time_date`: **weekdays only**; forward/back day jumps; no clock, month, calendar, or year arithmetic
- `wp_time_days`: count jumps between weekdays; **do not count start day as first jump**; no clock or calendar dates
- `wp_groups_g2`: equal-groups multiplication stories; one-step; factors within G2; cross-link to Batch B `mul`; no division here
- `wp_division_simple`: equal-sharing stories; one-step; no remainder; cross-link to Batch B `div`; no long division

### Выравнивание разделов 5 / 6 пакета D

| Страница | Раздел 5 (попробуй сам) | Раздел 6 (ошибка) |
|------|-------------------|---------------------|
| `wp_coins` | 3 coins × 10 ₪ = ? | counted 3 instead of 3 × 10 = 30 |
| `wp_coins_spent` | paid 40, cost 28 → change? | 40 − 20 = 20 (partial subtract) |
| `wp_time_date` | Wed + 2 days → ? | stopped at Thu (1 jump) not Fri |
| `wp_time_days` | Mon → Fri, how many days? | counted Mon or stopped at Thu (3 not 4) |
| `wp_groups_g2` | 6 bags × 3 apples = ? | 6 + 3 = 9 instead of 6 × 3 = 18 |
| `wp_division_simple` | 20 stickers ÷ 5 kids = ? | 20 − 5 = 15 instead of 20 ÷ 5 = 4 |

---

## План партий (завершён)

**Всего страниц: 22 — все в черновиках**

| Batch | Title (draft) | Pages | Status |
|-------|---------------|-------|--------|
| **A** | Основы чисел и сравнение | 5 | ✅ черновик + отполировано |
| **B** | Сложение, вычитание, умножение и деление | 6 | ✅ черновик + отполировано |
| **C** | Делимость и дроби | 5 | ✅ черновик + отполировано |
| **D** | Текстовые задачи | 6 | ✅ черновик — ждёт проверки владельца |

---

## Полный проход правки (июнь 2026)

Обязательные правки содержания из полного обзора пакета, до внедрения:

| Page | Fix |
|------|-----|
| `add_two` | Грамматика: `складываем оба результата` (жен. мн.) |
| `wp_coins_spent` | Формулировка: `больше цены`; Раздел 6: `вычесть` (not `вычесть`) |
| `wp_division_simple` | Ясность: `равная доля`; `поровну между … детьми` (§4 + §5) |

**Статус без изменений:** **22 / 22** страниц в черновиках · все `approval_status: draft`.

---

## Внедрение на сайте (июнь 2026)

Grade 2 book connected to the site for **dev preview** — reuses Grade 1 reader UX exactly (`MathG2BookShell`, shared `LearningPageBody` / `BookTocModal`).

| Item | Location |
|------|----------|
| Registry + page order | `lib/learning-book/math-g2-registry.js` |
| Markdown loader | `lib/learning-book/load-math-g2-pages.js` |
| Book nav / snapshots / practice preset | `lib/learning-book/math-g2-book-nav.js` |
| Topic → book page | `lib/learning-book/resolve-math-g2-book-page.js` |
| Section 7 practice CTA | `lib/learning-book/resolve-math-g2-practice-target.js` |
| Routes | `/learning/book/math/g2`, `/learning/book/math/g2/[pageId]` |
| Math Master | Общая плитка 📖 (g2 only), `Объяснение в книге`, в обучении `📖 Объяснение` |
| Verify | `node scripts/verify-math-g2-book.mjs` |

**UI для ребёнка:** `Математика — 2 класс` · без маркеров `[DRAFT]` · без внутренних метаданных.

**CTA практики:** All **22** pages mapped via `resolve-math-g2-practice-target.js` + `forceKind` branches in `utils/math-question-generator.js`.

**Скрытые кнопки (нет уверенного сопоставления):**
- Setup `הסבר בספר` hidden for umbrella ops: `number_sense`, `word_problems`, `fractions`, `mixed`
- В обучении `📖 Объяснение` скрыто, когда kind/operation не сводится к одной странице G2

**Не сделано:** SQL · commit · push · deploy · одобрение содержания владельцем.

See also: `docs/learning-book/MATH_GRADE_2_BOOK_IMPLEMENTATION_SUMMARY.md`

---

## Открытые вопросы (после партии D)

1. **Заголовки партии D** — проверка владельца до внедрения
2. **Сопоставления CTA практики** — резолвер G2 ещё не реализован
3. **Полное утверждение книги** — все 22 страницы ждут одобрения владельца

---

## Явное правило остановки

> **Grade 2 UI is implemented for dev preview only.** Do not deploy or treat draft content as owner-approved until sign-off.

Until owner approves content:

- ❌ No SQL, commit, push, or deploy for production release
- ✅ Dev routes `/learning/book/math/g2` available for QA

---

## Подтверждения

- **22** draft `.md` pages (Batches A + B + C + D); all `approval_status: draft`.
- Все черновики 2 класса теперь есть — **22 / 22**.
- Реестр, загрузчик, маршруты, резолверы и wiring Math Master для 2 класса внедрены (июнь 2026).
- Grade 1 reader UX remains the locked reference (`MATH_LEARNING_BOOK_UI_STYLE_LOCK.md`).
- No SQL, commit, push, or deploy in this workstream.
