# Учебная книга: Геометрия — 5 класс — черновики

**Статус:** Все партии написаны — **17 / 17** черновиков страниц готово (Партии A–G). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/geometry/g5/drafts/`  
****Название книги (для ребёнка):**** Геометрия — 5 класс

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **17 / 17** (Batches A–G) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g5-book-content.mjs` |
| Draft manifest | ✅ `scripts/lib/geometry-g5-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope |

---

## Партия A — параллельность, четырёхугольники и углы (3)

| Файл | Черновой заголовок |
|------|-------------|
| `parallel_perpendicular.md` | קווים מקבילים ומאונכים |
| `quadrilaterals.md` | Классификация четырёхугольников — 5 класс |
| `triangle_angles.md` | זוויות במשולש |

## Партия B — периметр и площадь — квадрат и треугольник (3)

| Файл | Черновой заголовок |
|------|-------------|
| `square_perimeter.md` | היקף ריבוע |
| `triangle_perimeter.md` | היקף משולש |
| `square_area.md` | שטח ריבוע |

## Партия C — площадь — параллелограмм и трапеция (2)

| Файл | Черновой заголовок |
|------|-------------|
| `parallelogram_area.md` | שטח מקבילית |
| `trapezoid_area.md` | שטח טרפז |

## Партия D — высота в многоугольниках (3)

| Файл | Черновой заголовок |
|------|-------------|
| `heights_triangle.md` | גובה במשולש |
| `heights_parallelogram.md` | גובה במקבילית |
| `heights_trapezoid.md` | גובה בטרפז |

## Партия E — диагонали (3)

| Файл | Черновой заголовок |
|------|-------------|
| `diagonal_square.md` | אלכסון בריבוע |
| `diagonal_rectangle.md` | אלכסון במלבן |
| `diagonal_parallelogram.md` | אלכסון במקבילית |

## Партия F — тела и объём (2)

| Файл | Черновой заголовок |
|------|-------------|
| `solids.md` | Трёхмерные тела — повторение |
| `rectangular_prism_volume.md` | נפח תיבה |

## Партия G — замощение (1)

| Файл | Черновой заголовок |
|------|-------------|
| `tiling.md` | Замощение плоскости |

---

## Заметки

- All pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- Текст для ребёнка использует **Геометрия**, не **инженерия**.
- Раздел 7: только черновик приглашения — **без маршрутизации практики**.
- `book_placeholder.md` — infrastructure placeholder; **not** part of the 17-page book.

---

## Пересоздать

```bash
node scripts/generate-geometry-g5-drafts.mjs
node scripts/build-geometry-g5-hebrew-review-pack.mjs
node scripts/verify-geometry-g5-book-content.mjs
```
