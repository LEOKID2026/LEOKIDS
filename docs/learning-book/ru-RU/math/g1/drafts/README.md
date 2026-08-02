# Учебная книга: Математика — 1 класс — черновики

**Статус:** Только черновик содержания. Без кода. Без UI. Без SQL. Без commit/push/deploy.
**Дата:** июнь 2026
**Папка:** `docs/learning-book/math/g1/drafts/`

---

## Решения владельца (зафиксированы)

| Decision | Status |
|----------|--------|
| Shared section 7 heading | **Approved for draft use:** `בואו נתרגל!` |
| Crocodile metaphor (`cmp.md`) | **Оставить для черновика 1 класса:** `голодный крокодил` — дружелюбно к ребёнку, только черновик (не финальный утверждённый текст продукта) |
| Batch A Hebrew titles | **Accepted for continued draft use** — all remain `[DRAFT — not owner-approved]` |
| Batch B Hebrew titles | **Accepted for continued draft use** — all remain `[DRAFT — not owner-approved]` |
| `add_second_decade` title | **Для черновика:** `Сложение во втором десятке — числа от 11 до 19` (сохранить понятие "второй десяток", понятно ребёнку) |
| Ten-frame term | **Draft use:** `מסגרת עשר` (standardized; not "מסגרת של 10") |
| Place-value blocks | **Для черновика:** `десяток-палочка`, `отдельные кубики` |
| Even/odd method | **Сначала пары**; правило последней цифры как **совет** only |
| `add_tens_only` scope | **Grade 1 cap: 30** — use 10, 20, 30 only |
| Batch C Hebrew titles | **Accepted for continued draft use** — all remain `[DRAFT — not owner-approved]` |
| Batch C polish pass | **Accepted for continued draft use** (June 2026) |
| Batch D Hebrew titles | **Draft only** — all remain `[DRAFT — not owner-approved]` |
| Missing-number language | **Draft use:** `מספר חסר`, `מקום ריק` — not variables/algebra |
| Missing-number titles | **Draft use:** `משפט חיבור/חיסור עם מספר חסר` |
| `mul` example 4 × 3 = 12 | **Accepted for draft use** — within Grade 1 scope (product ≤ 20) |
| All pages | **`approval_status: draft`** — nothing moved to review/approved/active |

---

## Партия A — числовая прямая / основы чувства числа

**Фокус:** Основы числовой прямой и чувства числа

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `ns_counting_forward.md` | `math:g1:ns_counting_forward` | `math:kind:ns_counting_forward` | visual_intuition |
| `ns_counting_backward.md` | `math:g1:ns_counting_backward` | `math:kind:ns_counting_backward` | visual_intuition |
| `ns_number_line.md` | `math:g1:ns_number_line` | `math:kind:ns_number_line` | visual_intuition |
| `ns_neighbors.md` | `math:g1:ns_neighbors` | `math:kind:ns_neighbors` | visual_intuition |
| `cmp.md` | `math:g1:cmp` | `math:kind:cmp` | visual_intuition |

### Статус полировки пакета A

**Проход полировки завершён:** июнь 2026

| Исправление | Подробность |
|-----|--------|
| Section 7 heading | **"בואו נתרגל!"** on all 5 pages |
| Typos | божья коровка, перед зеркалом, легко ошибиться |
| Scope wording | Negative-number note scoped to Grade 1 page |

---

## Партия B — разрядное значение / основы действий

**Фокус:** Разрядное значение, чётные/нечётные, дополнения до 10, сложение во втором десятке, сложение целых десятков

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `ns_place_tens_units.md` | `math:g1:ns_place_tens_units` | `math:kind:ns_place_tens_units` | concept_foundation |
| `ns_even_odd.md` | `math:g1:ns_even_odd` | `math:kind:ns_even_odd` | concept_foundation |
| `ns_complement10.md` | `math:g1:ns_complement10` | `math:kind:ns_complement10` | visual_intuition |
| `add_second_decade.md` | `math:g1:add_second_decade` | `math:kind:add_second_decade` | concept_foundation |
| `add_tens_only.md` | `math:g1:add_tens_only` | `math:kind:add_tens_only` | visual_intuition |

All Batch B pages:
- `subject`: math
- `grade`: g1
- `age_band`: grades_1_2
- `approval_status`: **draft**
- Заголовок раздела 7: **Давай попрактикуемся!**
- Все заголовки: **`[DRAFT — не утверждено владельцем]`**

### Заметки об охвате содержания пакета B

- `ns_place_tens_units`: двузначные числа до 30; `десяток-палочка` / `отдельные кубики`; без развёрнутой записи `+` как основного объяснения
- `ns_even_odd`: числа 1–20; **сначала пары**; правило последней цифры только как **совет**
- `ns_complement10`: пары с суммой 10; наглядный термин **`десяток-рамка`**
- `add_second_decade`: заголовок **`Сложение во втором десятке — числа от 11 до 19`**; стратегия «дополни до 10»; макс. сумма 20
- `add_tens_only`: **только 10, 20, 30**; макс. сумма 30; формулировка **`в 1 классе используем десятки 10, 20 и 30`**

### Статус полировки пакета B

**Проход полировки завершён:** июнь 2026

| Исправление | Подробность |
|-----|--------|
| `add_second_decade` title | Обновлено до **`Сложение во втором десятке — числа от 11 до 19`**; понятное ребёнку объяснение второй десяток повсюду |
| Ten-frame term | Standardized to **`מסגרת עשר`** (`ns_complement10.md`) |
| Place-value terms | Стандартизировано как **`десяток-палочка`**, **`отдельные кубики`**; убран стиль как основное объяснение |
| Even/odd | Pairing as main method; last-digit rule demoted to **טיפ**; clearer wording for 11 example |
| `add_tens_only` scope | Explicit **Grade 1 cap 30**; removed ellipsis implying 40/50/100 |

**Подтверждение:** Все страницы партии B остаются **`approval_status: draft`**. Все заголовки остаются **`[DRAFT — не утверждено владельцем]`**.

---

## Партия C — основы действий

**Фокус:** Базовое сложение, вычитание, предложения с неизвестным числом, раннее умножение (без текстовых задач)

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `add_two.md` | `math:g1:add_two` | `math:kind:add_two` | visual_intuition |
| `sub_two.md` | `math:g1:sub_two` | `math:kind:sub_two` | visual_intuition |
| `eq_add_simple.md` | `math:g1:eq_add_simple` | `math:kind:eq_add_simple` | concept_foundation |
| `eq_sub_simple.md` | `math:g1:eq_sub_simple` | `math:kind:eq_sub_simple` | concept_foundation |
| `mul.md` | `math:g1:mul` | `math:kind:mul` | visual_intuition |

All Batch C pages:
- `subject`: math
- `grade`: g1
- `age_band`: grades_1_2
- `approval_status`: **draft**
- Заголовок раздела 7: **Давай попрактикуемся!**
- Все заголовки: **`[DRAFT — не утверждено владельцем]`**

### Заметки об охвате содержания пакета C

- `add_two`: joining two groups; number line / objects; sums up to 30; no vertical addition
- `sub_two`: taking away / moving backward; not below 0; no borrowing or vertical subtraction
- `eq_add_simple`: missing number as puzzle; `__` / `מספר חסר`; links to `מסגרת עשר` where helpful
- `eq_sub_simple`: missing number in subtraction; concrete number line / objects; no formal algebra
- `mul`: повторное сложение / равные группы only; **קבוצות עד 5, תוצאה עד 20**; `4 × 3 = 12` accepted; no full таблица умножения, no division

### Черновые заголовки пакета C

| learning_page_id | Draft title |
|------------------|-------------|
| `math:g1:add_two` | חיבור של שני מספרים |
| `math:g1:sub_two` | חיסור של שני מספרים |
| `math:g1:eq_add_simple` | Предложение сложения с неизвестным числом |
| `math:g1:eq_sub_simple` | Предложение вычитания с неизвестным числом |
| `math:g1:mul` | Умножение — повторное сложение |

### Статус полировки пакета C

**Проход полировки завершён:** июнь 2026

| Исправление | Подробность |
|-----|--------|
| `add_two.md` | `два количества` → **`два количества`**; раздел частых ошибок уточнён (первое число считается первым шагом) |
| `sub_two.md` | Исправлено 8−3 наглядный пример: **3 взяли, 5 осталось** (было наоборот) |
| `eq_add_simple.md` | `לעוד` → **`להוסיף`** |
| `eq_sub_simple.md` | Упрощена формулировка неизвестного в начале; исправлено 8−__=3 наглядный пример (**5 взяли, 3 осталось**) |
| `mul.md` | Убрано из текста для ребёнка **`Множители`**; формулировка охвата **`в 1 классе используем маленькое умножение: группы до 5, результат до 20`** |

**Подтверждение:** Все страницы партии C остаются **`approval_status: draft`**. Все заголовки остаются **`[DRAFT — не утверждено владельцем]`**.

**Правка партии C принята:** июнь 2026 — владелец подтвердил продолжение использования черновиков (заголовки, язык неизвестного числа, `4 × 3 = 12`, охват умножения).

**Доработка:** пример в `add_two.md` — `Посчитай всё` → **`Посчитай ещё 3 после 5: 6, 7, 8`**

---

## Batch D — текстовые задачи

**Фокус:** Чтение простых текстовых задач — монеты, траты/сдача, дни и календарь

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `wp_coins.md` | `math:g1:wp_coins` | `math:kind:wp_coins` | word_problem_strategy |
| `wp_coins_spent.md` | `math:g1:wp_coins_spent` | `math:kind:wp_coins_spent` | word_problem_strategy |
| `wp_time_date.md` | `math:g1:wp_time_date` | `math:kind:wp_time_date` | word_problem_strategy |
| `wp_time_days.md` | `math:g1:wp_time_days` | `math:kind:wp_time_days` | word_problem_strategy |

All Batch D pages:
- `subject`: math
- `grade`: g1
- `age_band`: grades_1_2
- `approval_status`: **draft**
- Заголовок раздела 7: **Давай попрактикуемся!**
- Все заголовки: **`[DRAFT — не утверждено владельцем]`**

### Заметки об охвате содержания пакета D

- `wp_coins`: coin values added together; "how much altogether?"; repeated addition only; no spending/change, no multiplication
- `wp_coins_spent`: had / spent / left; simple change (paid 10, cost 7, change 3); subtraction only; no multi-item purchases
- `wp_time_date`: days of the week; today/tomorrow/yesterday; "in 2 days"; no clock, no months/years
- `wp_time_days`: counting days forward/backward on a weekday row; within one week; no clock, no months/years

### Черновые заголовки пакета D

| learning_page_id | Draft title |
|------------------|-------------|
| `math:g1:wp_coins` | Текстовые задачи — достоинства монет |
| `math:g1:wp_coins_spent` | Текстовые задачи — сколько осталось или сдача |
| `math:g1:wp_time_date` | שאלות מילוליות — ימים ותאריכים |
| `math:g1:wp_time_days` | Текстовые задачи — расстояние между днями |

**Подтверждение:** Все страницы партии D остаются **`approval_status: draft`**. Все заголовки остаются **`[DRAFT — не утверждено владельцем]`**.

### Статус полировки пакета D

**Проход полировки завершён:** июнь 2026

| Исправление | Подробность |
|-----|--------|
| `wp_coins.md` | Fixed worked-example arithmetic: **12₪ → 13₪** (`5 + 5 + 1 + 1 + 1 = 13`); visual example **5 + 5 + 2 = 12** unchanged |
| `wp_time_days.md` | Clarified day-counting common mistake — do not count start day as first jump; do not stop before target day |

**Confirmation:** All **19** pages remain **`approval_status: draft`**. All titles remain **`[DRAFT — not owner-approved]`**. No code, UI, runtime registry, SQL, commit, push, or deploy.

---

## Сводка всех черновиков страниц

| Batch | Files | Status |
|-------|-------|--------|
| A | 5 | draft |
| B | 5 | draft |
| C | 5 | draft |
| D | 4 | draft |
| **Total** | **19** | **all draft** |

**Учебная книга: Математика — 1 класс:** Все **19** страниц навыков теперь есть как черновики в этой папке.

---

## Использованные исходные документы

| Document | Role |
|----------|------|
| `docs/learning-book/MATH_LEARNING_BOOK_MASTER_PLAN.md` | Product rules, hard constraints, age-band policy |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Skill IDs, page types, grade scope |
| `docs/learning-book/MATH_GRADE_1_LEARNING_BOOK_COVERAGE.md` | Per-skill content guidance and exclusions |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Grades 1–2 section structure |
| `docs/learning-book/MATH_LEARNING_BOOK_IMPLEMENTATION_NOTES.md` | No-fallback and approval lifecycle reference |
| `data/curriculum-spine/v1/skills.json` | Canonical skill_id registry |
| `utils/math-constants.js` | Grade 1 number range (0–30 max) |

---

## Подтверждения

- All **19** learning pages are **draft only** (`approval_status: draft`).
- No page is set to `review`, `approved`, or `active`.
- Все заголовки остаются **`[DRAFT — не утверждено владельцем]`**.
- **Код приложения** не менялся.
- **UI и кнопки** не добавлялись.
- **No runtime registry files** were created.
- **Продуктовый текст на иврите в приложении** не менялся.
- **SQL** не выполнялся.
- **No commit, push, or deploy** was performed.

---

## Открытые вопросы для проверки владельца

### Партия B — принято для черновиков (правка)

Следующее решено для продолжения использования как **черновик** (не финальный утверждённый текст продукта):

| Topic | Decision |
|-------|----------|
| `add_second_decade` title | `חיבור בעשרייה השנייה — מספרים בין 11 ל־19` |
| Ten-frame | `מסגרת עשר` |
| Place value | `десяток-палочка`, `отдельные кубики` |
| Even/odd | Pairing first; last-digit as **טיפ** |
| `add_tens_only` | Cap at 30; 10, 20, 30 only |

### Партия C — принято для черновиков (правка)

| Topic | Decision |
|-------|----------|
| Missing-number titles | `משפט חיבור/חיסור עם מספר חסר` |
| Missing-number language | `מספר חסר`, `מקום ריק` |
| `4 × 3 = 12` in `mul.md` | Accepted — within Grade 1 scope (product ≤ 20) |

### Ещё открыто (партия A + общее)

1. **"сосед до / сосед после"** — подтвердить соответствие языку класса.
2. **Направление числовой прямой RTL** — подтвердить, что 0 слева совпадает с визуалами продукта.
3. **Визуальные материалы** — только текстовые описания; подтвердить иллюстрации для фазы 1.
4. **Финальное утверждение заголовков** — все 19 страниц остаются `[DRAFT — not owner-approved]` до явного утверждения владельцем.

### Пакет D — ожидает обзора владельца

| Topic | Notes |
|-------|-------|
| Word-problem reading frame | `Что знаем?` / `Что спрашивают?` / `Что делаем?` на всех страницах |
| Coin addition | Repeated addition only — no multiplication on `wp_coins` |
| `wp_coins_spent` title | Черновик: `Текстовые задачи — сколько осталось или сдача` |
| Calendar scope | Weekday names only — no clock, no month/year arithmetic |
| Day-counting | Within one week; same "don't count start as first jump" pattern as number line |

---

## Рекомендуемый следующий шаг

1. **Создать документ решений/утверждения для 1 класса** — собрать все решения владельца по черновикам (партии A–D), открытые вопросы и чек-лист утверждения для `draft` → `review`.
2. **Проверка владельца** партии D (полировка) и полного набора черновиков 1 класса.
3. После утверждения 1 класса рассмотреть **дополнение к руководству по стилю**, затем начать 2 класс или планирование внедрения.

**Не переходить ко 2 классу или к внедрению, пока документ утверждения 1 класса не проверен.**
