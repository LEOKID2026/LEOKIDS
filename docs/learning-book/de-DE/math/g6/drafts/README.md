# 6. Klasse Math Learning Book — Drafts

**Status:** All batches authored — **44 / 44** draft pages complete (Batches A–I). Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/math/g6/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/MATH_GRADE_6_lernenING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **44 / 44** (Batches A–I) |
| Review pack | ✅ `docs/Learning-book/MATH_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g6-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/math-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G6) | ❌ Not created — no fake mappings |

---

## Source of Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 44 6. Klasse Math `skill_id` entries in scope |
| `docs/Learning-book/MATH_GRADE_6_lernenING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/Learning-book/MATH_lernenING_PAGE_TEMPLATE.md` | Section C (Grades 5–6) seven-section template |
| `docs/Learning-book/math/g1–g4/drafts/` | Style reference only — **nicht modified** |
| `utils/math-constants.js` | 6. Klasse operations context only |

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



| Datei | Entwurfstitel |
|------|-------------|








---

## Hinweise

- All pages: `age_band: Klassen_5_6`, `approval_status: draft`, `grade: g6`.
- Section 7: draft invitation text only — **no practice routing**.

- Grouped thousands (`1,000`, `10,000`, `100,000`, `200,000`) appear in many pages — renderer must isolate LTR.
- Bruch-/Prozentfähigkeiten der 5. Klasse (`frac_add_sub`, `frac_reduce` usw.) sind **nicht** im G6-Spine-Umfang — als in der 5. Klasse abgedeckt angenommen.

---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-math-g6-hebrew-review-pack.mjs
node scripts/verify-math-g6-book-content.mjs
```

To regenerate draft pages from generator (if edited):

```bash
node scripts/generate-math-g6-drafts.mjs
```

---

## Explizite Stopp-Regel

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Nur Dokumentation und Entwurfs-Markdown
