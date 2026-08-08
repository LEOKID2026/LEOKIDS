# Kelas 1 Geometri Pembelajaran Buku — Draf

**Status:** **Owner-approved konten** — **3 / 3** halaman. Runtime insertion tidak dimulai.
**Signoff:** `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md`
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/geometry/g1/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Owner signoff | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md` |
| Draf markdown halaman | ✅ **3 / 3** (Batches –B) — **konten approved** |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_1_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-geometry-g1-book-content.mjs` |
| Draf manifest (scripts hanya) | ✅ `scripts/lib/geometry-g1-draft-manifest.mjs` |
| Runtime routes | ✅ `/learning/book/geometry/g1` + `[pageId]` (3 SSG halaman) |
| Latihan CTA resolver | ❌ Tidak dibuat — post-runtime task |

---

## Penamaan

- Anak-facing buku konten uses ****, tidak **** (owner-approved).
- Internal IDs tetap `geometry:g1:{pageId}` dan `subject: geometry`.

---

## Sumber kebenaran

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Entri `skill_id` geometri Kelas 1 dalam cakupan |
| `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section template (Grades 1–2 age band) |
| `docs/learning-book/math/g1/drafts/` | Style reference hanya — **tidak modified** |
| `utils/geometry-constants.js` | G1 topic descriptions (context hanya) |

---

## Batch — (2)

| Berkas | Judul draf |
|------|-------------|
| `shapes_basic_square.md` | |
| `shapes_basic_rectangle.md` | |

---

## Batch B — (1)

| Berkas | Judul draf |
|------|-------------|
| `transformations.md` | — |

---

## Catatan

- `book_placeholder.md` — infrastructure placeholder; **tidak** bagian dari 3-halaman buku.
- Semua halaman: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Section 7: draf invitation hanya — **tidak latihan routing**.
- Tidak ASCII diagrams atau markdown meja di anak-facing bodies.
- `geometry:kind:no_question` adalah spine meta hanya — **tidak** pembelajaran halaman.

---

## Hasilkan ulang paket tinjauan

```bash
node scripts/build-geometry-g1-hebrew-review-pack.mjs
node scripts/verify-geometry-g1-book-content.mjs
```

---

## Aturan berhenti eksplisit

Konten adalah owner-approved; **runtime insertion tidak dimulai**:

- ❌ Tidak registry, routes, SQL, commit, push, atau deploy (unless explicitly requested)
- ✅ Approved Hebrew draf tetap sumber untuk future runtime task
