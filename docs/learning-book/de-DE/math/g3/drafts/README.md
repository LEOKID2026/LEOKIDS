# 3. Klasse Math Learning Book — Drafts

**Status:** All batches authored — **26 / 26** draft pages complete (Batches A + B + C + D). Owner review pending.  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/math/g3/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/MATH_GRADE_3_lernenING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **26 / 26** (Batches A + B + C + D) |
| Review pack | ✅ `docs/Learning-book/MATH_GRADE_3_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-math-g3-book-content.mjs` |
| Runtime registry / routes | ❌ Not in scope — content-only task |
| Practice CTA resolver (G3) | ❌ Not created — no fake mappings |

---

## Source of Truth

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 26 3. Klasse Math `skill_id` entries in scope |
| `docs/Learning-book/MATH_GRADE_3_lernenING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/Learning-book/MATH_lernenING_PAGE_TEMPLATE.md` | Section B (Grades 3–4) seven-section template |
| `docs/Learning-book/math/g1/drafts/`, `math/g2/drafts/` | Style reference only — **nicht modified** |
| `utils/math-constants.js` | 3. Klasse operations context |

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

- `book_placeholder.md` — Infrastruktur-Platzhalter aus der Strukturerweiterung; **nicht** Teil des 26-Seiten-Buchs.
- All pages: `age_band: Klassen_3_4`, `approval_status: draft`.
- Section 7: draft invitation text only — **no practice routing**.


---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-math-g3-hebrew-review-pack.mjs
node scripts/verify-math-g3-book-content.mjs
```

---

## Explizite Stopp-Regel

Until owner approves content:

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Nur Dokumentation und Entwurfs-Markdown
