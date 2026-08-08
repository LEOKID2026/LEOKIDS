# Kelas 6 Geometri Pembelajaran Buku — Draf

**Status:** Semua batches authored — **19 / 19** draf halaman selesaikan (Batches –G). Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/geometry/g6/drafts/`
**Buku title (anak-facing):** —

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/GEOMETRY_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Draf markdown halaman | ✅ **19 / 19** (Batches –G) |
| Review pack | ✅ `docs/learning-book/GEOMETRY_GRADE_6_HEBREW_REVIEW_PACK.md` (generated) |
| Konten verification | ✅ `scripts/verify-geometry-g6-book-content.mjs` |
| Draf manifest | ✅ `scripts/lib/geometry-g6-draft-manifest.mjs` |
| Runtime registry / routes | ❌ Tidak di cakupan |

---

## Batch —, (6)

| Berkas | Judul draf |
|------|-------------|
| `square_perimeter.md` | — |
| `triangle_perimeter.md` | — |
| `square_area.md` | — |
| `parallelogram_area.md` | — |
| `trapezoid_area.md` | — |
| `triangle_angles.md` | — |

## Batch B — (2)

| Berkas | Judul draf |
|------|-------------|
| `circle_perimeter.md` | |
| `circle_area.md` | |

## Batch C — (2)

| Berkas | Judul draf |
|------|-------------|
| `pythagoras_hyp.md` | — |
| `pythagoras_leg.md` | — |

## Batch D — (2)

| Berkas | Judul draf |
|------|-------------|
| `solids.md` | —,,, |
| `rectangular_prism_volume.md` | — |

## Batch E — (2)

| Berkas | Judul draf |
|------|-------------|
| `prism_volume_rectangular.md` | — |
| `prism_volume_triangle.md` | — |

## Batch F — (2)

| Berkas | Judul draf |
|------|-------------|
| `pyramid_volume_square.md` | — |
| `pyramid_volume_rectangular.md` | — |

## Batch G —, (3)

| Berkas | Judul draf |
|------|-------------|
| `cylinder_volume.md` | |
| `cone_volume.md` | |
| `sphere_volume.md` | |

---

## Catatan

- Semua halaman: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- Anak-facing copy uses ****, tidak ****.
- Section 5 dan Section 6 gunakan **sama geometri soal** (sama bilangan, satuan, story).
- Section 7: draf invitation hanya — **tidak latihan routing**.
- `book_placeholder.md` — infrastructure placeholder; **tidak** bagian dari 19-halaman buku.

---

## Hasilkan ulang

```bash
node scripts/generate-geometry-g6-drafts.mjs
node scripts/build-geometry-g6-hebrew-review-pack.mjs
node scripts/verify-geometry-g6-book-content.mjs
```
