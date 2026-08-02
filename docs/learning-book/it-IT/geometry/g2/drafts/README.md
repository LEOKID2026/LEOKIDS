# 2ª primaria Geometry Libro di apprendimento — Bozze

**Stato:** Tutti i batch redatti — **3 / 3** pagine bozza complete. Owner review pending. 
**Data:** June 2026 
**Cartella:** `docs/learning-book/geometry/g2/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/GEOMETRY_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **3 / 3** (Batches UN–C) |
| Pacchetto di revisione | ✅ `docs/learning-book/GEOMETRY_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-geometry-g2-book-content.mjs` |
| Draft manifest (scripts solo) | ✅ `scripts/lib/geometry-g2-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g2-registry`, `/learning/book/geometry/g2`) |

---

## Denominazione

- Child-facing book content uses ****, not ****.
- ID interni: `geometry:g2:{pageId}`, `subject: geometry`.

---

## Batch A — (1)

| File | Draft title |
|------|-------------|
| `solids.md` | — |

---

## Batch B — (1)

| File | Draft title |
|------|-------------|
| `square_area.md` | |

---

## Batch C — (1)

| File | Draft title |
|------|-------------|
| `transformations.md` | — |

---

## Notes

- `book_placeholder.md` — infrastructure placeholder; **non** parte di 3-page book.
- Tutti pages: `age_band: grades_1_2`, `approval_status: draft`, `grade: g2`.
- G1 pages per `shapes_basic_square` / `shapes_basic_rectangle` sono non repeated — quei skills end at 1ª primaria in spine.
- `geometry:kind:no_question` — meta solo; no apprendimento page.

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-geometry-g2-hebrew-review-pack.mjs
node scripts/verify-geometry-g2-book-content.mjs
```

---

## Explicit Stop Rule

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, o deploy
- ✅ Documentation e draft markdown solo
