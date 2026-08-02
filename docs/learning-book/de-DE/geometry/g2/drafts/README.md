# 2. Klasse Geometrie Learning Book — Drafts

**Status:** All batches authored — **3 / 3** draft pages complete. Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/Geometrie/g2/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/Geometrie_GRADE_2_lernenING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **3 / 3** (Batches A–C) |
| Review pack | ✅ `docs/Learning-book/Geometrie_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-Geometrie-g2-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/Geometrie-g2-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g2-registry`, `/learning/book/geometry/g2`) |

---

## Benennung


- Internal IDs: `Geometrie:g2:{pageId}`, `subject: Geometrie`.

---



| Datei | Entwurfstitel |
|------|-------------|


---



| Datei | Entwurfstitel |
|------|-------------|


---



| Datei | Entwurfstitel |
|------|-------------|


---

## Hinweise

- `book_placeholder.md` — Infrastruktur-Platzhalter; **nicht** Teil des 3-Seiten-Buchs.
- All pages: `age_band: Klassen_1_2`, `approval_status: draft`, `grade: g2`.
- G1-Seiten für `shapes_basic_square` / `shapes_basic_rectangle` werden nicht wiederholt — diese Fähigkeiten enden laut Spine in der 1. Klasse.
- `Geometrie:kind:no_question` — meta only; no Learning page.

---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-geometry-g2-hebrew-review-pack.mjs
node scripts/verify-geometry-g2-book-content.mjs
```

---

## Explizite Stopp-Regel

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Nur Dokumentation und Entwurfs-Markdown
