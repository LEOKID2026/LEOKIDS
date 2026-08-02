# 1ª primaria Science Libro di apprendimento — Bozze

**Stato:** Contenuto in bozza — **6 / 6** pages. No runtime insertion. 
**Plan:** `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md` 
**Master scope:** `docs/learning-book/SCIENCE_LEARNING_BOOK_MASTER_SCOPE_PLAN.md` 
**Data:** June 2026 
**Cartella:** `docs/learning-book/science/g1/drafts/`

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **6 / 6** (Batches UN–B) |
| Verifica del contenuto | ✅ `scripts/verify-science-g1-book-content.mjs` |
| Draft manifest (scripts solo) | ✅ `scripts/lib/science-g1-draft-manifest.mjs` |
| Runtime routes / registry | ❌ Non created |

---

## Denominazione

- Child-facing book content uses ****.
- Internal IDs remain `science:g1:{topic}` e `subject: science`.

---

## Batch A — (3)

| File | Draft title |
|------|-------------|
| `body.md` | — |
| `animals.md` | — |
| `plants.md` | — |

---

## Batch B — , (3)

| File | Draft title |
|------|-------------|
| `materials.md` | — |
| `earth_space.md` | |
| `environment.md` | |

---

## Notes

- Tutti pages: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Section 7: text-solo — **no esercitazione routing**.
- No unsafe experiments, chemicals, fire, o electricity instructions.
- `science:topic:experiments` excluded in G1 (spine min2ª primaria).

---

## Verify

```bash
node scripts/verify-science-g1-book-content.mjs
node scripts/verify-science-learning-book-master-scope.mjs
```

---

## Explicit Stop Rule

- ❌ No registry, routes, SQL, commit, push, o deploy
- ✅ Hebrew drafts remain source per un future runtime task
