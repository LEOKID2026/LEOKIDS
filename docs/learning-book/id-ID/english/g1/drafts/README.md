# Kelas 1 Bahasa Inggris Pembelajaran Buku — Draf

**Status:** Draf konten — **10 / 10** halaman. Tidak owner-approved. Tidak runtime wired.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/english/g1/drafts/`
**Buku title:** —

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/ENGLISH_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **10 / 10** |
| Review pack | ✅ `docs/learning-book/ENGLISH_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-english-g1-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/english-g1-draft-manifest.mjs` |
| Runtime / registry / routes | ❌ Tidak dibuat |

---

## Penamaan

- Anak-facing subject: ****
- Internal IDs: `english:g1:{pageId}`, `subject: english`

---

## Batch — (3)

| Berkas | Judul draf |
|------|-------------|
| `vocab_colors.md` | |
| `vocab_numbers.md` | 0–10 |
| `vocab_family.md` | |

## Batch B — (4)

| Berkas | Judul draf |
|------|-------------|
| `vocab_animals.md` | |
| `vocab_emotions.md` | |
| `vocab_actions.md` | |
| `vocab_school.md` | |

## Batch C — (3)

| File | Draf title | Merge catatan |
|------|-------------|------------|
| `grammar_be.md` | AKU am / Kamu adalah — | Merged menjadi garis -menjadi_basic pool |
| `sentence_base.md` | — | |
| `translation_classroom.md` | | |

---

## Konten rules

- Hebrew explanations; Bahasa Inggris contoh pada sendiri garis
- 7 sections per halaman; tidak `[DRAFT]` di section bodies
- Section 7 text-hanya — tidak latihan routing
- Tidak alphabet/phonics halaman (tidak di spine)

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-english-g1-hebrew-review-pack.mjs
node scripts/verify-english-g1-book-content.mjs
```

---

## Explicit stop aturan

- ❌ Tidak registry, routes, latihan CTA, SQL, commit, push, deploy
- ✅ Draf tetap source untuk future runtime task
