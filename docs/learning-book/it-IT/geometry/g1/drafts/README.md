# 1ª primaria Geometry Libro di apprendimento — Bozze

**Stato:** **Owner-approved content** — **3 / 3** pages. Runtime insertion non started. 
**Signoff:** `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md` 
**Data:** June 2026 
**Cartella:** `docs/learning-book/geometry/g1/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md` |
| Pagine markdown in bozza | ✅ **3 / 3** (Batches UN–B) — **content approved** |
| Pacchetto di revisione | ✅ `docs/learning-book/GEOMETRY_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-geometry-g1-book-content.mjs` |
| Draft manifest (scripts solo) | ✅ `scripts/lib/geometry-g1-draft-manifest.mjs` |
| Runtime routes | ✅ `/learning/book/geometry/g1` + `[pageId]` (3 SSG pages) |
| Esercitazione CTA resolver | ❌ Non created — post-runtime task |

---

## Denominazione

- Child-facing book content uses ****, not **** (owner-approved).
- Internal IDs remain `geometry:g1:{pageId}` e `subject: geometry`.

---

## Source di Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | 1ª primaria geometry `skill_id` entries in scope |
| `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Sette-section template (Grades 1–2 age band) |
| `docs/learning-book/math/g1/drafts/` | Style reference solo — **non modified** |
| `utils/geometry-constants.js` | G1 topic descriptions (context solo) |

---

## Batch A — (2)

| File | Draft title |
|------|-------------|
| `shapes_basic_square.md` | |
| `shapes_basic_rectangle.md` | |

---

## Batch B — (1)

| File | Draft title |
|------|-------------|
| `transformations.md` | — |

---

## Notes

- `book_placeholder.md` — infrastructure placeholder; **non** parte di 3-page book.
- Tutti pages: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Section 7: draft invitation solo — **no esercitazione routing**.
- No ASCII diagrams o markdown tables in child-facing bodies.
- `geometry:kind:no_question` è spine meta solo — **no** apprendimento page.

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-geometry-g1-hebrew-review-pack.mjs
node scripts/verify-geometry-g1-book-content.mjs
```

---

## Explicit Stop Rule

Content è owner-approved; **runtime insertion non started**:

- ❌ No registry, routes, SQL, commit, push, o deploy (unless explicitly requested)
- ✅ Approved Hebrew drafts remain source per un future runtime task
