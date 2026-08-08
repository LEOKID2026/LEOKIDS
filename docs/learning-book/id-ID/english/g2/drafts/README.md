# Kelas 2 Bahasa Inggris Pembelajaran Buku — Draf

**Status:** Draf konten — **15 / 15** halaman. Tidak owner-approved. Tidak runtime wired.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/english/g2/drafts/`
**Buku title:** —

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **15 / 15** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-english-g2-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/english-g2-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Tidak dibuat |

---

## Penamaan

- Anak-facing subject: ****
- Internal IDs: `english:g2:{pageId}`, `subject: english`

---

## Batch — continuing vocab (7)

| Berkas | Judul draf |
|------|-------------|
| `vocab_colors.md` | — |
| `vocab_numbers.md` | — 20 |
| `vocab_family.md` | — |
| `vocab_animals.md` | — |
| `vocab_emotions.md` | — |
| `vocab_actions.md` | — |
| `vocab_school.md` | — |

## Batch B — baru vocab (2)

| Berkas | Judul draf |
|------|-------------|
| `vocab_food.md` | |
| `vocab_house.md` | — |

## Batch C — grammar (2)

| File | Draf title | Merge catatan |
|------|-------------|------------|
| `grammar_be.md` | am / adalah / adalah — | Merged garis -menjadi_basic |
| `grammar_plural_questions.md` | | Merged plural garis -pertanyaan_frames |

## Batch D — kalimat -translasi (4)

| Berkas | Judul draf |
|------|-------------|
| `sentence_base.md` | — |
| `sentence_routine.md` | — |
| `translation_classroom.md` | — |
| `translation_routines.md` | — |

---

## Konten rules

- Continuing halaman harus differ dari G1 — deeper kalimat, tidak copy-paste
- Tidak standalone writing halaman (writing access baris dikecualikan)
- Section 7 text-hanya — tidak latihan routing

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-english-g2-hebrew-review-pack.mjs
node scripts/verify-english-g2-book-content.mjs
```

---

## Explicit stop aturan

- ❌ Tidak registry, routes, latihan CTA, SQL, commit, push, deploy
- ✅ Draf tetap source untuk future runtime task
