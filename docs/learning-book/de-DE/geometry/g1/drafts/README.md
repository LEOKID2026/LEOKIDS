# 1. Klasse Geometrie Learning Book — Drafts

**Status:** **Owner-approved content** — **3 / 3** pages. Runtime insertion not started.  
**Signoff:** `docs/Learning-book/Geometrie_GRADE_1_lernenING_BOOK_SIGNOFF.md`  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/Geometrie/g1/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/Geometrie_GRADE_1_lernenING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/Learning-book/Geometrie_GRADE_1_lernenING_BOOK_SIGNOFF.md` |
| Draft markdown pages | ✅ **3 / 3** (Batches A–B) — **content approved** |
| Review pack | ✅ `docs/Learning-book/Geometrie_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-Geometrie-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/Geometrie-g1-draft-manifest.mjs` |
| Runtime routes | ✅ `/Learning/book/Geometrie/g1` + `[pageId]` (3 SSG pages) |
| Practice CTA resolver | ❌ Not created — post-runtime task |

---

## Benennung


- Internal IDs remain `Geometrie:g1:{pageId}` and `subject: Geometrie`.

---

## Source of Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | 1. Klasse Geometrie `skill_id` entries in scope |
| `docs/Learning-book/Geometrie_GRADE_1_lernenING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/Learning-book/MATH_lernenING_PAGE_TEMPLATE.md` | Seven-section template (Grades 1–2 age band) |
| `docs/Learning-book/math/g1/drafts/` | Style reference only — **nicht modified** |
| `utils/Geometrie-constants.js` | G1 topic descriptions (context only) |

---



| Datei | Entwurfstitel |
|------|-------------|



---



| Datei | Entwurfstitel |
|------|-------------|


---

## Hinweise

- `book_placeholder.md` — Infrastruktur-Platzhalter; **nicht** Teil des 3-Seiten-Buchs.
- All pages: `age_band: Klassen_1_2`, `approval_status: draft`, `grade: g1`.
- Section 7: draft invitation only — **no practice routing**.
- No ASCII diagrams or markdown tables in child-facing bodies.
- `geometry:kind:no_question` is spine meta only — **no** learning page.

---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-geometry-g1-hebrew-review-pack.mjs
node scripts/verify-geometry-g1-book-content.mjs
```

---

## Explizite Stopp-Regel

Content ist owner-approved; **runtime insertion nicht started**:

- ❌ No registry, routes, SQL, commit, push, or deploy (unless explicitly requested)
- ✅ Approved Hebrew drafts remain source for a future runtime task
