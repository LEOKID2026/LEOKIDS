# Kelas 1 Sains Pembelajaran Buku — Draf

**Status:** Draf konten — **6 / 6** halaman. Tidak runtime insertion.
**Plan:** `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md`
**Master cakupan:** `docs/learning-book/SCIENCE_LEARNING_BOOK_MASTER_SCOPE_PLAN.md`
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/science/g1/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **6 / 6** (Batches –B) |
| Konten verification | ✅ `scripts/verify-science-g1-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/science-g1-draft-manifest.mjs` |
| Runtime routes / registry | ❌ Tidak dibuat |

---

## Penamaan

- Anak-facing buku konten uses ****.
- Internal IDs tetap `science:g1:{topic}` dan `subject: science`.

---

## Batch — (3)

| Berkas | Judul draf |
|------|-------------|
| `body.md` | — |
| `animals.md` | — |
| `plants.md` | — |

---

## Batch B —, (3)

| Berkas | Judul draf |
|------|-------------|
| `materials.md` | — |
| `earth_space.md` | |
| `environment.md` | |

---

## Catatan

- Semua halaman: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Section 7: text-hanya — **tidak latihan routing**.
- Tidak unsafe experiments, chemicals, api, atau electricity instructions.
- `science:topic:experiments` dikecualikan di G1 (spine minGrade 2).

---

## Verifikasi

```bash
node scripts/verify-science-g1-book-content.mjs
node scripts/verify-science-learning-book-master-scope.mjs
```

---

## Aturan berhenti eksplisit

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy
- ✅ Hebrew draf tetap sumber untuk future runtime task
