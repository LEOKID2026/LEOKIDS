# 3. Klasse Geometrie Learning Book — Drafts

**Status:** **Owner-approved** — **9 / 9** pages; runtime wired.  
**Signoff:** `docs/Learning-book/Geometrie_GRADE_3_lernenING_BOOK_SIGNOFF.md`  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/Geometrie/g3/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/Geometrie_GRADE_3_lernenING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/Learning-book/Geometrie_GRADE_3_lernenING_BOOK_SIGNOFF.md` |
| Draft pages | ✅ **9 / 9** (Batches A–E) |
| Runtime routes | ✅ `/Learning/book/Geometrie/g3` + `[pageId]` |
| Review pack | ✅ `docs/Learning-book/Geometrie_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-Geometrie-g3-book-content.mjs` |
| Manifest | ✅ `scripts/lib/Geometrie-g3-draft-manifest.mjs` |

---

## Batches

| Batch | Pages |
|-------|--------|
| **A** | `Dreiecks`, `Vierecks` |
| **B** | `parallel_perpendicular` |
| **C** | `Quadrat_Fläche`, `Quadrat_Umfang`, `Dreieck_Umfang` |
| **D** | `Dreieck_Winkel` |
| **E** | `rotation`, `solids` |

---

## Benennung


- IDs: `Geometrie:g3:{pageId}`, `age_band: Klassen_3_4`.

---

## Neu erzeugen

```bash
node scripts/build-geometry-g3-hebrew-review-pack.mjs
node scripts/verify-geometry-g3-book-content.mjs
```

---

## Stop rule

No registry, routes, SQL, commit, push, or deploy until owner approves content.
