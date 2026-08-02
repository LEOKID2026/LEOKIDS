# 1. Klasse Naturwissenschaften Learning Book — Drafts

**Status:** Draft content — **6 / 6** pages. No runtime insertion.  
**Plan:** `docs/Learning-book/Naturwissenschaften_GRADE_1_lernenING_BOOK_PLAN.md`  
**Master scope:** `docs/Learning-book/Naturwissenschaften_lernenING_BOOK_MASTER_SCOPE_PLAN.md`  
**Datum:** Juni 2026  
**Folder:** `docs/Learning-book/Naturwissenschaften/g1/drafts/`

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/Learning-book/Naturwissenschaften_GRADE_1_lernenING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **6 / 6** (Batches A–B) |
| Content verification | ✅ `scripts/verify-Naturwissenschaften-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/Naturwissenschaften-g1-draft-manifest.mjs` |
| Runtime routes / registry | ❌ Not created |

---

## Benennung


- Internal IDs remain `Naturwissenschaften:g1:{topic}` and `subject: Naturwissenschaften`.

---



| Datei | Entwurfstitel |
|------|-------------|




---



| Datei | Entwurfstitel |
|------|-------------|




---

## Hinweise

- All pages: `age_band: Klassen_1_2`, `approval_status: draft`, `grade: g1`.
- Section 7: text-only — **no practice routing**.
- No unsafe experiments, chemicals, fire, or electricity instructions.
- `Naturwissenschaften:topic:experiments` excluded in G1 (spine min2. Klasse).

---

## Verify

```bash
node scripts/verify-science-g1-book-content.mjs
node scripts/verify-science-learning-book-master-scope.mjs
```

---

## Explizite Stopp-Regel

- ❌ No registry, routes, SQL, commit, push, or deploy
- ✅ Hebrew drafts remain source for a future runtime task
