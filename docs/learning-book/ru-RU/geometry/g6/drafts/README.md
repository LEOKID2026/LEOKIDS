# Учебная книга: Геометрия — 6 класс — черновики

**Статус:** Все партии написаны — **19 / 19** черновиков страниц готово (Партии A–G). Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/geometry/g6/drafts/`  
****Название книги (для ребёнка):**** Геометрия — 6 класс

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **19 / 19** (Batches A–G) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-geometry-g6-book-content.mjs` |
| Draft manifest | ✅ `scripts/lib/geometry-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope |

---

## Партия A — периметр, площадь и углы (6)

| Файл | Черновой заголовок |
|------|-------------|
| `square_perimeter.md` | היקף ריבוע — כיתה ו׳ |
| `triangle_perimeter.md` | היקף משולש — כיתה ו׳ |
| `square_area.md` | Площадь квадрата — 6 класс |
| `parallelogram_area.md` | שטח מקבילית — כיתה ו׳ |
| `trapezoid_area.md` | שטח טרפז — כיתה ו׳ |
| `triangle_angles.md` | זוויות במשולש — כיתה ו׳ |

## Партия B — окружность и круг (2)

| Файл | Черновой заголовок |
|------|-------------|
| `circle_perimeter.md` | היקף מעגל |
| `circle_area.md` | שטח עיגול |

## Партия C — теорема Пифагора (2)

| Файл | Черновой заголовок |
|------|-------------|
| `pythagoras_hyp.md` | Теорема Пифагора — нахождение гипотенузы |
| `pythagoras_leg.md` | Теорема Пифагора — нахождение катета |

## Партия D — тела и базовый объём (2)

| Файл | Черновой заголовок |
|------|-------------|
| `solids.md` | Тела — цилиндр, пирамида, конус, сфера |
| `rectangular_prism_volume.md` | נפח תיבה — כיתה ו׳ |

## Партия E — объём призм (2)

| Файл | Черновой заголовок |
|------|-------------|
| `prism_volume_rectangular.md` | נפח מנסרה — בסיס מלבן |
| `prism_volume_triangle.md` | נפח מנסרה — בסיס משולש |

## Партия F — объём пирамид (2)

| Файл | Черновой заголовок |
|------|-------------|
| `pyramid_volume_square.md` | נפח פירמידה — בסיס ריבוע |
| `pyramid_volume_rectangular.md` | נפח פירמידה — בסיס מלבן |

## Партия G — объём цилиндра, конуса и шара (3)

| Файл | Черновой заголовок |
|------|-------------|
| `cylinder_volume.md` | נפח גליל |
| `cone_volume.md` | נפח חרוט |
| `sphere_volume.md` | נפח כדור |

---

## Заметки

- All pages: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- Текст для ребёнка использует **Геометрия**, не **инженерия**.
- Раздел 5 и раздел 6 используют **одну и ту же задачу по геометрии** (те же числа, единицы, сюжет).
- Раздел 7: только черновик приглашения — **без маршрутизации практики**.
- `book_placeholder.md` — infrastructure placeholder; **not** part of the 19-page book.

---

## Пересоздать

```bash
node scripts/generate-geometry-g6-drafts.mjs
node scripts/build-geometry-g6-hebrew-review-pack.mjs
node scripts/verify-geometry-g6-book-content.mjs
```
