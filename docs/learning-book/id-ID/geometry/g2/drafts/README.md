# Kelas 2 Geometri Pembelajaran Buku — Draf

**Status:** Semua batches authored — **3 / 3** draf halaman selesaikan. Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/geometry/g2/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **3 / 3** (Batches –C) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_2_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-geometry-g2-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/geometry-g2-draft-manifest.mjs` |
| Runtime registry / routes | ✅ wired (`geometry-g2-registry`, `/learning/book/geometry/g2`) |

---

## Penamaan

- Anak-facing buku konten uses ****, tidak ****.
- Internal IDs: `geometry:g2:{pageId}`, `subject: geometry`.

---

## Batch — (1)

| Berkas | Judul draf |
|------|-------------|
| `solids.md` | — |

---

## Batch B — (1)

| Berkas | Judul draf |
|------|-------------|
| `square_area.md` | |

---

## Batch C — (1)

| Berkas | Judul draf |
|------|-------------|
| `transformations.md` | — |

---

## Catatan

- `book_placeholder.md` — infrastructure placeholder; **tidak** bagian dari 3-halaman buku.
- Semua halaman: `age_band: grades_1_2`, `approval_status: draft`, `grade: g2`.
- G1 halaman untuk `shapes_basic_square` / `shapes_basic_rectangle` adalah tidak repeated — itu skills akhir di Kelas 1 di spine.
- `geometry:kind:no_question` — meta hanya; tidak pembelajaran halaman.

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-geometry-g2-hebrew-review-pack.mjs
node scripts/verify-geometry-g2-book-content.mjs
```

---

## Aturan berhenti eksplisit

Sampai owner approves konten:

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy
- ✅ Documentation dan draf markdown hanya
