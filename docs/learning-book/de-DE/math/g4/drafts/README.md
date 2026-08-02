# 4. Klasse Math Learning Book — Drafts

**Status:** All batches authored — **37 / 37** draft pages complete (Batches A–G). Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/math/g4/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/MATH_GRADE_4_lernenING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **37 / 37** (Batches A–G) |
| Review pack | ✅ `docs/Learning-book/MATH_GRADE_4_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g4-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/math-g4-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G4) | ❌ Not created — no fake mappings |

---

## Source of Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 37 4. Klasse Math `skill_id` entries in scope |
| `docs/Learning-book/MATH_GRADE_4_lernenING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/Learning-book/MATH_lernenING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/Learning-book/math/g1/drafts/`, `g2/drafts/`, `g3/drafts/` | Style reference only — **nicht modified** |
| `utils/math-constants.js` | 4. Klasse operations context only |

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



| Datei | Entwurfstitel |
|------|-------------|









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

- `book_placeholder.md` — Infrastruktur-Platzhalter; **nicht** Teil des 37-Seiten-Buchs.
- All pages: `age_band: Klassen_3_4`, `approval_status: draft`, `grade: g4`.
- Section 7: draft invitation text only — **no practice routing**.

- Grouped thousands (`1,000`, `10,000`) appear in many pages — renderer must isolate LTR (see G3 Bidi fix).

---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-math-g4-hebrew-review-pack.mjs
node scripts/verify-math-g4-book-content.mjs
```

---

## Explizite Stopp-Regel

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Nur Dokumentation und Entwurfs-Markdown
