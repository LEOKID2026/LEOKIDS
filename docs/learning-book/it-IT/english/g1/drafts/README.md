# 1ª primaria Libro di Inglese — Bozze

**Stato:** Contenuto in bozza — **10 / 10** pages. Non approvato dal proprietario. Nessun runtime collegato.
**Date:** June 2026
**Folder:** `docs/learning-book/english/g1/drafts/`
**Book title:** Libro di Inglese — 1ª primaria

---

## Stato attuale

| Item | Status |
|------|--------|
| Piano curricolare | ✅ `docs/learning-book/ENGLISH_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Pagine markdown in bozza | ✅ **10 / 10** |
| Pacchetto di revisione | ✅ `docs/learning-book/ENGLISH_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Verifica del contenuto | ✅ `scripts/verify-english-g1-book-content.mjs` |
| Draft manifest (scripts only) | ✅ `scripts/lib/english-g1-draft-manifest.mjs` |
| Runtime / registro / route | ❌ Non creato |

---

## Denominazione

- Child-facing subject: ****
- Internal IDs: `english:g1:{pageId}`, `subject: english`

---

## Batch A — Vocabolario (3)

| File | Draft title |
|------|-------------|
| `vocab_colors.md` | Colori in inglese |
| `vocab_numbers.md` | Numeri 0–10 in inglese |
| `vocab_family.md` | Famiglia in inglese |

## Batch B — Vocabolario (4)

| File | Draft title |
|------|-------------|
| `vocab_animals.md` | |
| `vocab_emotions.md` | |
| `vocab_actions.md` | |
| `vocab_school.md` | |

## Batch C — (3)

| File | Draft title | Merge note |
|------|-------------|------------|
| `grammar_be.md` | I am / You are — introduzione | Merged be line -be_basic pool |
| `sentence_base.md` | Frasi brevi — base | |
| `translation_classroom.md` | | |

---

## Regole di contenuto

- Spiegazioni in italiano; esempi in inglese su righe separate
- 7 sections per page; no `[DRAFT]` in section bodies
- Section 7 text-only — no practice routing
- No alphabet/phonics pages (not in spine)

---

## Rigenera il pacchetto di revisione

```bash
node scripts/build-english-g1-hebrew-review-pack.mjs
node scripts/verify-english-g1-book-content.mjs
```

---

## Regola di stop esplicita

- ❌ No registry, routes, practice CTA, SQL, commit, push, deploy
- ✅ Drafts remain source for future runtime task
