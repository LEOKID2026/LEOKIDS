# Учебная книга: Геометрия — 4 класс — черновики

**Статус:** Все партии написаны — **14 / 14** черновиков страниц готово. Ожидается проверка владельца.  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/geometry/g4/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Draft pages | ✅ **14 / 14** (Batches A–E) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g4-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g4-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g4-registry`, `/learning/book/geometry/g4`) |

---

## Пакеты

| Batch | Pages |
|-------|--------|
| **A** | `shapes_basic_properties_square`, `shapes_basic_properties_rectangle`, `shapes_basic_properties_angles`, `symmetry` |
| **B** | `quadrilaterals`, `parallel_perpendicular` |
| **C** | `square_perimeter`, `square_area`, `triangle_perimeter`, `triangle_angles` |
| **D** | `diagonal_square`, `diagonal_rectangle` |
| **E** | `solids`, `rectangular_prism_volume` |

---

## Именование

- Название книги: **Геометрия — 4 класс** (не **инженерия**).
- IDs: `geometry:g4:{pageId}`, `age_band: grades_3_4`.

---

## Пересоздать

```bash
node scripts/build-geometry-g4-hebrew-review-pack.mjs
node scripts/verify-geometry-g4-book-content.mjs
```

---

## Правило остановки

Content approved — runtime wired. No SQL, commit, push, or deploy without owner request.
