# Independent Audit — English Global free of Hebrew

**Date:** 2026-08-05  
**Scope:** LEO KIDS GLOBAL — public English only  
**Method:** Fresh static + runtime audit (no reliance on prior reports/commits/promises)  
**Artifacts:**  
- `docs/reports/en-hebrew-independent-static-scan.json`  
- `docs/reports/en-hebrew-static-scan-raw.json`  
- `docs/reports/en-hebrew-independent-runtime-crawl.json`  
- `docs/reports/en-hebrew-independent-runtime-deep.json`  
- `docs/reports/en-hebrew-independent-demo-trail.json`  
- `docs/reports/en-hebrew-independent-authed-demo-crawl.json`  
- helper scripts: `docs/reports/_en-he-*.mjs`

---

## 1. Status line

| Field | Value |
|---|---|
| **Status** | **PASS** |
| **Can English be used now as the fix base for all other languages?** | **Yes** |

**Verdict:** The public English surface is free of Hebrew in static EN content packs/locales and in live English routes/demo student+parent flows. Admin Hebrew remains intentionally present and isolated from public English imports.

---

## 2. What was checked

### Directories / trees
- `locales/en/` (15 JSON namespaces)
- `content-packs/en/` (~732 files: books, games, learning, reports, rewards, burn-downs)
- `data/help-center/content/` (+ help index wiring)
- `data/english-questions/`
- `utils/learning-content-en/`
- `public/`
- `components/` (non-admin vs admin separation)
- `pages/` (non-admin vs admin separation)
- `lib/` (i18n resolver, teacher-ui, auth-registration, rewards)
- `curriculum/`, `data/`, `hooks/`, `contexts/`, `workers/` (repo-wide Hebrew signal scan)
- Explicitly **not** mixed into this verdict: other language locales (`ar-*`, `es-*`, `pt-*`, …)

### File types
`.js` `.jsx` `.ts` `.tsx` `.mjs` `.cjs` `.json` `.md` `.mdx` `.sql` `.css` `.html` `.txt` (+ SVG in targeted reward checks)

### Routes (runtime, cookie `lk_global_locale=en`, `Accept-Language: en-US`)
Public marketing/SEO: `/`, `/en`, `/kids`, `/parents`, `/teachers`, `/schools`, `/about`, `/contact`, `/gallery`, `/games`  
Help/Guides/Practice: `/help` (+ discovered help article links), `/guides` (+ click-through), `/practice/*`, `/practice/worksheets`  
Auth entry: `/parent/login`, `/student/login`, `/teacher/login`, `/school/register`, `/school/staff/login`, `/auth/forgot-password`  
Learning: `/learning`, `/learning/curriculum`, `/learning/*-master`  
Demo/offline/errors: `/demo/enter`, `/demo/parent/enter`, `/offline`, `/404`  
Student demo session: `/student/home`, `/student/cards`, `/student/game`, learning masters, `/games`  
Parent surfaces after demo attempt: `/parent/dashboard`, `/parent/worksheets`, `/learning/parent-report`, `/parent/school-inbox`

### Flows
- Homepage + nav/menu click attempts  
- Help hub → article links  
- Guides click-through  
- Worksheets hub  
- Demo student auto-enter (`/demo/enter?grade=g3` → `/student/home`) + button interactions  
- Parent demo enter + parent routes  
- Public APIs: worksheets catalog, demo cards catalog/series, arcade games  

### Locale / fallback mechanics
- `DEFAULT_LOCALE` / `FALLBACK_LOCALE` = `"en"`
- `getLocaleFallbackChain("en")` → `["en"]`
- `resolveLocaleDefinition("he")` / `"he-IL"` → **English** (no `he` registry entry)
- No `locales/he` or `content-packs/he` trees present

---

## 3. Exclusions (Admin)

### What is excluded (allowed Hebrew)
- All of `pages/admin/**`, `components/admin/**`
- `lib/admin-portal/*.he.js`, `lib/admin-server/**` Hebrew UI
- `lib/auth/auth-registration.he.js` — **Admin-only imports**
- `lib/teacher-portal/teacher-ui.he.js` — imported only by Admin (`TeacherDiscussionSubjectsSection.jsx`)
- Admin-focused tests/scripts that assert Hebrew Admin copy

### Separation check (Admin must not leak into public English)
- Public auth/registration uses `lib/auth/auth-registration.js` (i18n keys → `locales/en`), **not** `.he.js`
- Public teacher portal uses `lib/teacher-portal/teacher-ui.js` (English / locale bundles), **not** `.he.js`
- Grep of `pages/**` + non-admin `components/**` for `from '...*.he.js'`: **only under Admin paths**

Admin Hebrew is therefore **not** counted as a public-English blocker.

---

## 4. Blocking findings

**None.**

No public-English runtime Hebrew text found.  
No EN locale/content-pack Hebrew strings found.  
No EN→HE fallback chain found.

---

## 5. Non-blocking / stale residue

| Item | Classification | Why not a public EN blocker | Follow-up |
|---|---|---|---|
| `lib/auth/auth-registration.he.js` | Admin companion (escaped Hebrew) | Imported only by Admin pages/components | Keep for Admin; do not wire into public EN |
| `lib/teacher-portal/teacher-ui.he.js` | Admin companion (literal Hebrew) | Imported only by Admin | Keep for Admin; public uses `teacher-ui.js` |
| Admin UI trees (~71 files with Hebrew) | Admin exempt | Out of translation scope by requirement | Product structure OK to align; language stays Hebrew |
| Regex/guards containing `[\u0590-\u05FF]` in public code (`TeacherDashboardClient.jsx`, `reward-card-global-display.js`, glossaries, `learning-content-de-DE/math.js`) | Detector / stripper, not UI copy | These **reject or strip** Hebrew; they do not render Hebrew to EN users | Optional later: move detectors to shared util to silence overly strict “escape matcher = 0” tests |
| `components/prototypes/dev/**`, `lib/dev/**` | Dev prototypes | Not production public EN marketing/product path | Leave or quarantine; not EN SoT content |
| Scripts/tests with Hebrew fixtures (~100+ signal files) | Dev/QA tooling | Not served as EN UI | Keep as guards; do not confuse with runtime |
| Stale exemption note in `scripts/i18n/check-hebrew-runtime-scan.mjs` mentioning `SCIENCE_QUESTIONS_HE` / `videos-manifest.he.json` | Doc drift in script | Those files are gone / HE bank not present as export now | Cleanup comment only; not runtime |
| `public/sw.js` Arabic offline HTML branch | Other-locale offline | Used when locale is `ar*`; EN branch is English LTR | Out of this Hebrew audit (not Hebrew) |

**Recommendation:** Do not delete Admin `.he.js` companions. Optional cleanup of orphaned comments/exemptions only.

---

## 6. Tests / commands executed

### Commands
```text
node docs/reports/_en-he-audit-scan.mjs
node scripts/i18n/check-hebrew-runtime-scan.mjs
node --test tests/i18n/global-product-no-hebrew.test.mjs
node --test tests/i18n/global-product-zero-hebrew-runtime.test.mjs
node --test tests/i18n/global-english-only.test.mjs
node --test tests/learning/english-global-no-hebrew.test.mjs
node --test tests/rewards/global-reward-no-hebrew.test.mjs
node scripts/run-next-dev.mjs 3001 127.0.0.1
node docs/reports/_en-he-runtime-crawl.mjs
node docs/reports/_en-he-runtime-deep.mjs
node docs/reports/_en-he-demo-trail.mjs
node docs/reports/_en-he-authed-demo.mjs
# plus ad-hoc node probes for locale fallback + EN content roots + card catalog
```

### Numeric evidence
| Metric | Count |
|---|---|
| Repo text files scanned (broad) | ~12,122 |
| Files with any Hebrew signal (literal or `\u05..` escape) | 274 |
| Of which Admin | 71 |
| Public surface with escape/literal signal | 5 — all **guards/strippers**, zero UI Hebrew strings |
| `locales/en` + `content-packs/en` + help EN content + english-questions + learning-content-en + public literal Hebrew hits | **0 / 1,157 files** |
| Certified Hebrew scan (`check-hebrew-runtime-scan`) | **OK — 126 files** |
| Runtime routes (primary crawl) | **37 — 0 Hebrew** |
| Runtime deep pages | **13 — 0 Hebrew** |
| Runtime APIs | **4 — 0 Hebrew** (arcade returned 401, body still no Hebrew) |
| Authed demo crawl stops | **25 — 0 Hebrew** |
| `global-product-no-hebrew` | **15/15 pass** |
| Learning + rewards no-Hebrew suites | **23/23 pass** |

### Test caveats (not Hebrew-in-EN blockers)
- `global-product-zero-hebrew-runtime`: fails “Escaped Hebrew Unicode matchers = 0” on **anti-Hebrew guard regexes** (not rendered copy). Literal Hebrew in product runtime = **0 (pass)**.
- `global-english-only`: fails on Arabic `lang="ar" dir="rtl"` offline HTML inside SW for Arabic locales — **not Hebrew**.

### Known coverage gaps (honest)
- Full **teacher authenticated** classroom flows (create activity, grade worksheet, live class report) were not logged-in beyond `/teacher/login` (no teacher demo session equivalent exercised).
- Mitigation: teacher public strings come from `locales/en/teacher.json` + `teacher-ui.js` (English); `teacher-ui.he.js` is Admin-only. Static EN teacher JSON: no Hebrew.

These gaps do **not** overturn the EN SoT decision for Hebrew cleanliness, but teacher live QA remains recommended before claiming “every post-login teacher pixel.”

---

## 7. Decision summary

| Question | Answer |
|---|---|
| Is English actually clean of Hebrew? | **Yes** for public EN static content + live public/demo student/parent routes checked |
| Can it be the source of truth to fix other languages? | **Yes** |
| Minimal fixes required before touching other languages? | **None for Hebrew-in-English.** Optional non-blocking: silence/relocate guard regexes so strict escape-matcher tests pass; refresh stale script exemption comments |

**Bottom line:** Stop the multi-language thrash. Treat **`locales/en` + `content-packs/en` + English runtime wiring** as the clean baseline. Keep Admin Hebrew quarantined. Proceed to other languages only by translating/adapting from this English base — do not pull from Hebrew Admin companions or deleted `he` packs.
