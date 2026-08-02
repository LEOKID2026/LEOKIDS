# 1. Klasse English Learning Book — Drafts

**Status:** Draft content — **10 / 10** pages. Not owner-approved. No runtime wired.
**Datum:** Juni 2026
**Folder:** `docs/learning-book/english/g1/drafts/`
**Book title:** Englischbuch — 1. Klasse

---

## Aktueller Status

| Eintrag | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draft markdown pages | ✅ **10 / 10** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Content verification | ✅ `scripts/verify-english-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g1-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Not created |

---

## Benennung

- Child-facing subject: **Englisch**
- Internal IDs: `english:g1:{pageId}`, `subject: english`

---

## Batch A — Wortschatz (3)

| Datei | Entwurfstitel |
|------|-------------|
| `vocab_colors.md` | Farben auf Englisch |
| `vocab_numbers.md` | Zahlen 0–10 auf Englisch |
| `vocab_family.md` | Familie auf Englisch |

## Batch B — Wortschatz (4)

| Datei | Entwurfstitel |
|------|-------------|
| `vocab_animals.md` | Tiere auf Englisch |
| `vocab_emotions.md` | Gefühle auf Englisch |
| `vocab_actions.md` | Handlungen auf Englisch |
| `vocab_school.md` | Schule auf Englisch |

## Batch C — Grundmuster (3)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | I am / You are — Einführung | Merged be line and be_basic pool |
| `sentence_base.md` | Kurze Sätze — Grundlagen | |
| `translation_classroom.md` | Klassenraum-Ausdrücke | |

---

## Content rules

- Hebrew explanations; English examples on own lines
- 7 sections per page; no `[DRAFT]` in section bodies
- Section 7 text-only — no practice routing
- No alphabet/phonics pages (not in spine)

---

## Überprüfungspaket neu erzeugen

```bash
node scripts/build-english-g1-hebrew-review-pack.mjs
node scripts/verify-english-g1-book-content.mjs
```

---

## Explicit stop rule

- ❌ No registry, routes, practice CTA, SQL, commit, push, deploy
- ✅ Drafts remain source for future runtime task
