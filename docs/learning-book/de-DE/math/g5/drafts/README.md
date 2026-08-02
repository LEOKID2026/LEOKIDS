# 5. Klasse Math Learning Book — Drafts

**Status:** All batches authored — **40 / 40** draft pages complete (Batches A–H). Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/math/g5/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/MATH_GRADE_5_lernenING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **40 / 40** (Batches A–H) |
| Review pack | ✅ `docs/Learning-book/MATH_GRADE_5_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g5-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/math-g5-draft-manifest.mjs` |
| Draft content source (scripts only) | ✅ `scripts/lib/math-g5-draft-content.mjs` |
| Draft generator (optional regen) | ✅ `scripts/gen-math-g5-drafts.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G5) | ❌ Not created — no fake mappings |

---

## Source of Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 40 5. Klasse Math `skill_id` entries in scope |
| `docs/Learning-book/MATH_GRADE_5_lernenING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/Learning-book/MATH_lernenING_PAGE_TEMPLATE.md` | Seven-section template (Grades 5–6 age band) |
| `docs/Learning-book/math/g1/drafts/` … `g4/drafts/` | Style reference only — **nicht modified** |
| `utils/math-constants.js` | 5. Klasse operations context only |

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



| Datei | Entwurfstitel |
|------|-------------|









---

## Hinweise

- `book_placeholder.md` — Infrastruktur-Platzhalter; **nicht** Teil des 40-Seiten-Buchs.
- All pages: `age_band: Klassen_5_6`, `approval_status: draft`, `grade: g5`.
- Section 7: draft invitation text only — **no practice routing**.

- Grouped thousands (`1,000`, `10,000`, `48,726`) appear in many pages — renderer must isolate LTR.

---

## Regenerate drafts / review pack

```bash
node scripts/gen-math-g5-drafts.mjs
node scripts/build-math-g5-hebrew-review-pack.mjs
node scripts/verify-math-g5-book-content.mjs
```

---

## Explizite Stopp-Regel

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Nur Dokumentation und Entwurfs-Markdown
