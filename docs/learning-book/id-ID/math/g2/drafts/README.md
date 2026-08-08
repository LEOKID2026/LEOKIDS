# Kelas 2 Matematika Pembelajaran Buku — Draf

**Status:** Semua batches authored — **22 / 22** draf halaman selesaikan (Batches + B + C + D). Penuh review polish pass applied (June 2026). Owner review pending.
**Tanggal:** Juni 2026
**Folder:** `docs/learning-book/math/g2/drafts/`

---

## Status saat ini

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| UI style lock | ✅ `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` |
| Draf markdown halaman | ✅ **22 / 22** (Batches + B + C + D) |
| Batch polish pass | ✅ Applied (June 2026) |
| Batch B polish pass | ✅ Applied (June 2026) |
| Batch C authoring | ✅ Selesaikan + polish pass applied (June 2026) |
| Batch D authoring | ✅ Selesaikan (June 2026) — owner review pending |
| Penuh review polish pass | ✅ Applied (June 2026) |
| Runtime registry | ✅ `lib/learning-book/math-g2-registry.js` |
| Halaman loader | ✅ `lib/learning-book/load-math-g2-pages.js` |
| App route `/learning/book/math/g2` | ✅ Implemented (dev preview) |
| Latihan CTA resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-practice-target.js` |
| Buku halaman resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-book-page.js` |
| Matematika Master buku entry | ✅ General ubin + topic + di-pembelajaran buttons (g2) |
| Verification script | ✅ `scripts/verify-math-g2-book.mjs` |

---

## Owner Decisions (Recorded — June 2026)

| Topic | Decision |
|-------|----------|
| UI / pembaca | Gunakan ulang pembaca buku Kelas 1 — tanpa desain ulang |
| `divisibility` | **2, 5, 10 hanya** di G2; anak-facing terakhir-digit rules; tidak 3/6/9 |
| Pecahan (Batch C) | **Visual hanya** — setengah dan seperempat; tidak pecahan arithmetic |
| `frac_*_reverse` | Doubling (setengah) atau 4 sama bagian (seperempat) ke temukan keseluruhan |
| `wp_time_date` / `wp_time_days` | **Weekdays hanya** untuk G2 (Batch D) |
| `wp_coins` | Simple sama kelompok / perkalian diizinkan (Batch D) |

---

## Sumber kebenaran

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Semua 22 entri `skill_id` Matematika Kelas 2 |
| `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Halaman types dan wide-span rules |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section Grades 1–2 template |
| `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` | UX pembaca — gunakan ulang Kelas 1 |
| `utils/math-constants.js` | Rentang bilangan Kelas 2 dan operasi yang diizinkan |
| `docs/learning-book/math/g1/drafts/` | **Style reference hanya** |

---

## Batch —

**Status:** ✅ Draf selesaikan + polish pass applied

| Berkas | Judul draf |
|------|-------------|
| `ns_place_tens_units.md` |, — 1,000 |
| `ns_neighbors.md` | — |
| `ns_complement10.md` | 10 — |
| `ns_even_odd.md` | - — |
| `cmp.md` | 1,000 |

---

## Batch B —,,

**Status:** ✅ Draf selesaikan + polish pass applied

| Berkas | Judul draf |
|------|-------------|
| `add_two.md` | — 100 |
| `sub_two.md` | — 100 |
| `add_vertical.md` | |
| `sub_vertical.md` | |
| `mul.md` | — |
| `div.md` | — |

---

## Batch C —

**Status:** ✅ **Draf selesaikan + polish pass applied** (June 2026) — owner review pending

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `divisibility.md` | `math:g2:divisibility` | `math:kind:divisibility` | concept_foundation | 2, 5 10? |
| `frac_half.md` | `math:g2:frac_half` | `math:kind:frac_half` | visual_intuition | |
| `frac_half_reverse.md` | `math:g2:frac_half_reverse` | `math:kind:frac_half_reverse` | visual_intuition | |
| `frac_quarter.md` | `math:g2:frac_quarter` | `math:kind:frac_quarter` | visual_intuition | |
| `frac_quarter_reverse.md` | `math:g2:frac_quarter_reverse` | `math:kind:frac_quarter_reverse` | visual_intuition | |

Semua Batch C halaman:

- `subject`: matematika · `grade`: g2 · `age_band`: grades_1_2 · `approval_status`: **draf**
- Section headings:? / / / / /! /!
- Semua Hebrew titles: **`[DRAFT — not owner-approved]`**

### Batch C polish pass (June 2026)

| Fix | Detail |
|-----|--------|
| `frac_half` / `frac_quarter` | Section 7: ** ** / ** ** (tidak “/ ”) |
| `frac_half_reverse` | Section 1: dihapus ****; Section 6: clearer “jumlahkan hanya 1” mistake |
| `frac_quarter_reverse` | Section 1: ** …**; Section 6: setengah vs seperempat contrast (**5 + 5** vs **5 + 5 + 5 + 5**) |

### Batch C konten cakupan notes

- `divisibility`: **2, 5, 10 hanya**; “ 2/5/10”; terakhir-digit rules; e.g. 40; **tidak** 3/6/9; shallow “ ” hanya
- `frac_half`: visual; =; e.g. 12 = 6; tidak formal pembilang/penyebut
- `frac_half_reverse`: tahu setengah → temukan keseluruhan; doubling; e.g. = 6 → 12
- `frac_quarter`: visual; =; e.g. 12 = 3; tidak thirds/eighths
- `frac_quarter_reverse`: tahu seperempat → temukan keseluruhan; 4 sama bagian; 4 × atau repeated jumlahkan; e.g. = 4 → 16

### Batch C section 5 / 6 alignment

| Halaman | Section 5 (coba itu) | Section 6 (mistake) |
|------|-------------------|---------------------|
| `divisibility` | 35 — bagilah oleh 2, 5, 10? | 35 confused dengan ÷10 |
| `frac_half` | 10 =? | 10 split unequally (4+6) |
| `frac_half_reverse` | = 5 → keseluruhan? | 5 + 1 = 6 bukan 5 + 5 |
| `frac_quarter` | 20 =? | 20 split di 2 (setengah = 10) |
| `frac_quarter_reverse` | = 5 → keseluruhan? | 5 + 5 = 10 (setengah tidak seperempat) |

---

## Batch D —

**Status:** ✅ **Draf selesaikan** (June 2026) — owner review pending

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `wp_coins.md` | `math:g2:wp_coins` | `math:kind:wp_coins` | kata_soal_strategy | — |
| `wp_coins_spent.md` | `math:g2:wp_coins_spent` | `math:kind:wp_coins_spent` | kata_soal_strategy | — |
| `wp_time_date.md` | `math:g2:wp_time_date` | `math:kind:wp_time_date` | kata_soal_strategy | — |
| `wp_time_days.md` | `math:g2:wp_time_days` | `math:kind:wp_time_days` | kata_soal_strategy | — |
| `wp_groups_g2.md` | `math:g2:wp_groups_g2` | `math:kind:wp_groups_g2` | kata_soal_strategy | — |
| `wp_division_simple.md` | `math:g2:wp_division_simple` | `math:kind:wp_division_simple` | kata_soal_strategy | — |

Semua Batch D halaman:

- `subject`: matematika · `grade`: g2 · `age_band`: grades_1_2 · `approval_status`: **draf**
- Section headings:? / / / / /! /!
- Semua Hebrew titles: **`[DRAFT — not owner-approved]`**
- Kata-soal frame: **? /? /?**

### Batch D konten cakupan notes

- `wp_coins`: ₪ keseluruhan rupiah hanya; tunggal-langkah totals; sama kelompok / perkalian OK (e.g. 4 × 5); sampai ~100; tidak agorot, tidak multi-langkah uang
- `wp_coins_spent`: paid − cost = perubahan; tunggal-langkah; satu purchase; sampai ~100; tidak agorot
- `wp_time_date`: **weekdays hanya**; maju/back hari jumps; tidak clock, bulan, calendar, atau tahun arithmetic
- `wp_time_days`: hitung jumps antara weekdays; **lakukan tidak hitung mulai hari as pertama jump**; tidak clock atau calendar dates
- `wp_groups_g2`: sama-kelompok perkalian stories; satu-langkah; faktor dalam G2; cross-link ke Batch B `mul`; tidak pembagian di sini
- `wp_division_simple`: sama-sharing stories; satu-langkah; tidak sisa; cross-link ke Batch B `div`; tidak panjang pembagian

### Batch D section 5 / 6 alignment

| Halaman | Section 5 (coba itu) | Section 6 (mistake) |
|------|-------------------|---------------------|
| `wp_coins` | 3 koin × 10 ₪ =? | counted 3 bukan 3 × 10 = 30 |
| `wp_coins_spent` | paid 40, cost 28 → perubahan? | 40 − 20 = 20 (partial kurangkan) |
| `wp_time_date` | Wed + 2 hari →? | berhenti di Thu (1 jump) tidak Fri |
| `wp_time_days` | Mon → Fri, bagaimana banyak hari? | counted Mon atau berhenti di Thu (3 tidak 4) |
| `wp_groups_g2` | 6 tas × 3 apel =? | 6 + 3 = 9 bukan 6 × 3 = 18 |
| `wp_division_simple` | 20 stiker ÷ 5 kids =? | 20 − 5 = 15 bukan 20 ÷ 5 = 4 |

---

## Batch Plan (selesaikan)

**Total halaman: 22 — semua drafted**

| Batch | Title (draf) | Halaman | Status |
|-------|---------------|-------|--------|
| **** | | 5 | ✅ drafted + polished |
| **B** |,, | 6 | ✅ drafted + polished |
| **C** | | 5 | ✅ drafted + polished |
| **D** | | 6 | ✅ drafted — owner review pending |

---

## Penuh review polish pass (June 2026)

Mandatory Hebrew/konten fixes dari penuh review pack review, sebelum implementation:

| Halaman | Fix |
|------|-----|
| `add_two` | Grammar: `מחברים את שתי התוצאות` (feminine plural) |
| `wp_coins_spent` | Wording: `יותר מהמחיר`; Section 6: `לחסר` (tidak `לחסור`) |
| `wp_division_simple` | Clarity: `חלק שווה`; `באופן שווה בין … ילדים` (§4 + §5) |

**Status unchanged:** **22 / 22** halaman drafted · semua `approval_status: draft`.

---

## Site implementation (June 2026)

Kelas 2 buku terhubung ke site untuk **dev preview** — reuses Kelas 1 reader UX tepat (`MathG2BookShell`, dibagi `LearningPageBody` / `BookTocModal`).

| Item | Location |
|------|----------|
| Registry + halaman order | `lib/learning-book/math-g2-registry.js` |
| Markdown loader | `lib/learning-book/load-math-g2-pages.js` |
| Buku nav / snapshots / latihan preset | `lib/learning-book/math-g2-book-nav.js` |
| Topic → buku halaman | `lib/learning-book/resolve-math-g2-book-page.js` |
| Section 7 latihan CTA | `lib/learning-book/resolve-math-g2-practice-target.js` |
| Routes | `/learning/book/math/g2`, `/learning/book/math/g2/[pageId]` |
| Matematika Master | General 📖 ubin (g2 hanya), `הסבר בספר`, di-pembelajaran `📖 הסבר` |
| Verify | `node scripts/verify-math-g2-book.mjs` |

**Anak-facing UI:** `ספר חשבון — כיתה ב׳` · tidak `[DRAFT]` markers · tidak internal metadata.

**Latihan CTA:** Semua **22** halaman mapped melalui `resolve-math-g2-practice-target.js` + `forceKind` branches di `utils/math-question-generator.js`.

**Hidden buttons (tidak confident mapping):**
- Setup `הסבר בספר` hidden untuk umbrella ops: `number_sense`, `word_problems`, `fractions`, `mixed`
- Di-pembelajaran `📖 הסבר` hidden ketika kind/operation cannot resolve ke tunggal G2 halaman

**Tidak selesai:** SQL · commit · push · deploy · owner konten approval.

Lihat juga: `docs/learning-book/MATH_GRADE_2_BOOK_IMPLEMENTATION_SUMMARY.md`

---

## Terbuka Pertanyaan (post–Batch D)

1. **Batch D Hebrew titles** — owner review sebelum implementation
2. **Latihan CTA mappings** — G2 resolver masih tidak implemented
3. **Penuh buku tanda-mati** — semua 22 halaman pending owner approval

---

## Aturan berhenti eksplisit

> **Kelas 2 UI adalah implemented untuk dev preview hanya.** Lakukan tidak deploy atau treat draf konten as owner-approved sampai tanda-mati.

Sampai owner approves konten:

- ❌ Tidak SQL, commit, push, atau deploy untuk production release
- ✅ Dev routes `/learning/book/math/g2` available untuk QA

---

## Confirmations

- **22** draf `.md` halaman (Batches + B + C + D); semua `approval_status: draft`.
- Semua Kelas 2 draf halaman sekarang exist — **22 / 22**.
- G2 registry, loader, routes, resolvers, dan Matematika Master wiring implemented (June 2026).
- Kelas 1 reader UX tetap locked reference (`MATH_LEARNING_BOOK_UI_STYLE_LOCK.md`).
- Tidak SQL, commit, push, atau deploy di ini workstream.
