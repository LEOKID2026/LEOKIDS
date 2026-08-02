# Учебная книга: Геометрия — 3 класс — черновики

**Статус:** **одобрено владельцем** — **9 / 9** страниц; runtime подключён.  
**Утверждение:** `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md`  
**Дата:** июнь 2026  
**Папка:** `docs/learning-book/geometry/g3/drafts/`

---

## Текущий статус

| Пункт | Статус |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md` |
| Draft pages | ✅ **9 / 9** (Batches A–E) |
| Runtime routes | ✅ `/learning/book/geometry/g3` + `[pageId]` |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-geometry-g3-book-content.mjs` |
| Manifest | ✅ `scripts/lib/geometry-g3-draft-manifest.mjs` |

---

## Пакеты

| Batch | Pages |
|-------|--------|
| **A** | `triangles`, `quadrilaterals` |
| **B** | `parallel_perpendicular` |
| **C** | `square_area`, `square_perimeter`, `triangle_perimeter` |
| **D** | `triangle_angles` |
| **E** | `rotation`, `solids` |

---

## Именование

- Для ребёнка: **Геометрия** (не инженерия).
- IDs: `geometry:g3:{pageId}`, `age_band: grades_3_4`.

---

## Пересоздать

```bash
node scripts/build-geometry-g3-hebrew-review-pack.mjs
node scripts/verify-geometry-g3-book-content.mjs
```

---

## Правило остановки

No registry, routes, SQL, commit, push, or deploy until owner approves content.
