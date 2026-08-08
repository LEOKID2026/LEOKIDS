# Kelas 6 Bahasa Inggris Pembelajaran Buku — Draf

**Status:** Draf konten — **17 / 17** halaman. Tidak owner-approved. Tidak runtime wired.
**Tanggal:** Juni 2026
**Buku title:** —
**age_band:** `grades_5_6`

---

## Batch

| Batch | Halaman | Focus |
|-------|-------|-------|
| | 7 | Continuing vocab (G6 depth) |
| B | 3 | Baru vocab (culture, global_issues, history) |
| C | 4 | Grammar (complex tenses, conditionals, modals, comparatives) |
| D | 1 | Advanced kalimat |
| E | 2 | Translasi (technology, global) |

---

## Merge notes

- `grammar_complex_tenses.md` — merged complex_tenses garis + pool; PP intro hanya
- `grammar_conditionals.md` — merged conditionals garis + pool; type 0/1 hanya
- `grammar_modals.md` — seharusnya/mungkin/bisa (tidak G5 bisa/harus focus)

## Dikecualikan kata lists

keluarga, sekolah, makanan, sports, colors, bilangan, actions, rumah, tubuh, weather — spine `maxGrade < 6`

---

## Hasilkan ulang

```bash
node scripts/build-english-g6-hebrew-review-pack.mjs
node scripts/verify-english-g6-book-content.mjs
```

---

## Aturan berhenti

❌ Tidak registry, routes, latihan CTA, SQL, commit, push, deploy
