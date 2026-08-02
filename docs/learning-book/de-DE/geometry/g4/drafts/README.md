# 4. Klasse Geometrie Learning Book — Drafts

**Status:** All batches authored — **14 / 14** draft pages complete. Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/Geometrie/g4/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/Geometrie_GRADE_4_lernenING_BOOK_PLAN.md` |
| Draft pages | ✅ **14 / 14** (Batches A–E) |
| Review pack | ✅ `docs/Learning-book/Geometrie_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Verifier | ✅ `scripts/verify-Geometrie-g4-book-content.mjs` |
| Manifest | ✅ `scripts/lib/Geometrie-g4-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g4-registry`, `/learning/book/geometry/g4`) |

---

## Batches

| Batch | Pages |
|-------|--------|
| **A** | `shapes_basic_properties_Quadrat`, `shapes_basic_properties_Rechteck`, `shapes_basic_properties_Winkel`, `symmetry` |
| **B** | `Vierecks`, `parallel_perpendicular` |
| **C** | `Quadrat_Umfang`, `Quadrat_Fläche`, `Dreieck_Umfang`, `Dreieck_Winkel` |
| **D** | `Diagonale_Quadrat`, `Diagonale_Rechteck` |
| **E** | `solids`, `rectangular_prism_Volumen` |

---

## Benennung


- IDs: `Geometrie:g4:{pageId}`, `age_band: Klassen_3_4`.

---

## Neu erzeugen

```bash
node scripts/build-geometry-g4-hebrew-review-pack.mjs
node scripts/verify-geometry-g4-book-content.mjs
```

---

## Stop rule

Inhalt freigegeben — Laufzeit verdrahtet. Kein SQL, Commit, Push oder Deploy ohne Anfrage der Eigentümerin oder des Eigentümers.
