# Final binary English Hebrew audit — 2026-08-06

## 1. Final status

# **FAIL**

## 2. Decision

- Is the entire English site only English? **No**
- May other languages be fixed on the English base now? **No** — not until FAIL items below are cleared (and remaining blocked logins are completed)

Do **not** declare English Source-of-Truth ready.

---

## 3. Evidence

| Metric | Value |
|---|---|
| Commands | see §Commands |
| Files scanned (static hard scan) | **12,431** |
| Hebrew hits total (static) | **2,511** |
| Hebrew hits allowed (Admin exempt) | **2,024** |
| Hebrew hits technical (detectors) | **238** |
| Hebrew hits dev/test/doc | **249** |
| Hebrew hits forbidden in static connected code | **0** |
| Public routes crawled (EN) | **40+** (incl. `/en`, help articles, practice, guides) |
| API responses checked | **public 6** + **teacher authed 3+** (+ dashboard/report-data observed) |
| Logged-in flows attempted | demo-student ✅, demo-parent ✅, teacher ✅, parent-real ❌, student-real ❌, school ❌ |
| Teacher deep (class/students/worksheets/activities) | ✅ via API class id after dashboard data load |

### Commands run
```text
node docs/reports/_en-final-hard-scan.mjs
node scripts/run-next-dev.mjs 3001   # already running
node --env-file=.env.e2e.local docs/reports/_en-final-runtime-crawl.mjs
node --env-file=.env.e2e.local --env-file=.env.local docs/reports/_en-final-loggedin-deep.mjs
node --env-file=.env.e2e.local --env-file=.env.local docs/reports/_en-final-teacher-api-probe.mjs
node --env-file=.env.e2e.local --env-file=.env.local docs/reports/_en-final-teacher-deep-api.mjs
node --env-file=.env.e2e.local --env-file=.env.local docs/reports/_en-final-teacher-dom-he.mjs
```

Artifacts:
- `docs/reports/en-final-hebrew-hard-scan.json` (full static hit list)
- `docs/reports/en-final-runtime-crawl.json`
- `docs/reports/en-final-loggedin-deep-crawl.json`
- `docs/reports/en-final-teacher-api-hebrew-probe.json`
- `docs/reports/en-final-teacher-deep-via-api.json`
- `docs/reports/en-final-teacher-dom-hebrew.json`

---

## 4. Hebrew hits — classification

### A. Static connected product code
**0 forbidden.**  
`locales/en`, `content-packs/en`, public pages/components (non-admin) have no Hebrew UI strings.  
Technical-only escapes in product paths (allowed as detectors, not copy):

| path | line | text (trimmed) | classification |
|---|---|---|---|
| `components/teacher-portal/TeacherDashboardClient.jsx` | 31 | `if (/[\u0590-\u05FF]/.test(s)) return fallback` | technical |
| `components/teacher-portal/TeacherDashboardClient.jsx` | 664 | `!/[\u0590-\u05FF]/.test(String(s.topWeakTopicLabelHe))` | technical |
| `lib/rewards/reward-card-global-display.js` | 14 | `HEBREW_RE = /[\u0590-\u05FF]/` | technical |
| `lib/i18n/arabic-master-glossary.js` | 75–77 | forbidden Hebrew patterns for AR QA | technical |
| `lib/i18n/dutch-netherlands-glossary.js` | 120 | Hebrew leakage detector | technical |
| `utils/learning-content-de-DE/math.js` | 572,647,666 | strip Hebrew from DE math | technical |

Full 2,511-line inventory: `en-final-hebrew-hard-scan.json`.

### B. Admin exempt (allowed) — sample
Admin / `.he` companions account for **2,024** hits (e.g. `admin-ui.he.js`, `pages/admin/analytics.js`, `auth-registration.he.js`, `teacher-ui.he.js`). **Allowed by exclusion.**

### C. FAIL — runtime / API Hebrew feeding English teacher UI

These are **forbidden** under Pass rules 1, 3, 5, 10 (visible EN runtime + APIs that feed UI).

| source | exact text (samples) | classification | why FAIL |
|---|---|---|---|
| UI `/teacher/dashboard` (body) | `כיתה ג׳ - LEO` | **forbidden** | Visible on English teacher dashboard |
| UI `/teacher/dashboard` (HTML) | `כיתה ג׳ - LEO` / `Show class students` | **forbidden** | Rendered in EN session |
| UI `/teacher/class/{id}` (body) | `כיתה ג׳ - LEO`, `נועה כהן`, `איתי לוי`, `מאיה אברהם`, `דניאל מזרחי`, … | **forbidden** | Hebrew student + class names on EN class page |
| API `/api/teacher/me` | `מורה LEO`, `preferredLanguage":"he"` | **forbidden** | Feeds teacher chrome / locale preference |
| API `/api/teacher/classes` | `כיתה ג׳ - LEO` | **forbidden** | Feeds class list UI |
| API `/api/teacher/dashboard` | class name + many Hebrew student names (`גיא רוזן`, `אביגיל דיין`, …) | **forbidden** | Feeds dashboard |
| API `/api/teacher/dashboard/activity` | `מורה LEO`, `כיתה ג׳ - LEO` | **forbidden** | Feeds dashboard activity |
| API `/api/teacher/classes/{id}/report-data` | `כיתה ג׳ - LEO`, `נועה כהן`, `איתי לוי`, … | **forbidden** | Feeds teacher reports |

**Root cause:** Hebrew **seed/simulation DB data** (class title, teacher display name, student names, `preferredLanguage=he`) is returned and rendered while the interface locale cookie is English. Static EN packs are clean; **connected runtime data is not.**

---

## 5. Runtime results (summary)

| route / flow | role | result | Hebrew |
|---|---|---|---|
| `/` … public marketing, help, guides, practice, logins, `/en` | public | OK | no |
| Help articles `/help/parents` etc. | public | OK | no |
| Demo student home/cards/learning/games | demo-student | OK | no |
| Demo parent dashboard/worksheets/reports | demo-parent | OK | no |
| Teacher login → dashboard/worksheets | teacher | login OK | **yes on dashboard after data load** |
| Teacher class / activities / worksheets | teacher-deep | OK load | **yes (class + student names)** |
| Teacher APIs me/classes/dashboard/report-data | api | 200 | **yes** |
| Parent real login (`E2E_PARENT_*`) | parent | **blocked** — Supabase `Invalid login credentials`; UI overlay issues | n/a |
| Student real login (`E2E_STUDENT_*`) | student | **blocked** — earlier selector/timing; retry incomplete | n/a |
| School staff login | school | **blocked** — no `SCHOOL_QA_PASSWORD` / `DEMO_TEACHER_PASSWORD` in env | n/a |

Public APIs (`/api/demo/cards/*`, worksheets catalog): no Hebrew.

Fallback chain: still `en` only; `he` locale id resolves to English registry — **not** the failure mode. Failure is **Hebrew data in EN UI**, not locale fallback to `he` packs.

---

## 6. What remains (must fix before SoT / other languages)

1. **Sanitize or reseed** teacher simulation data used by Global EN:
   - Class names → English (e.g. `Grade 3 - LEO`)
   - Teacher display name → English (not `מורה LEO`)
   - Student roster names → English
   - `preferredLanguage` → `en` for EN product QA users
2. Re-run teacher dashboard + class + report-data crawl; require **zero** Hebrew in body/HTML/API.
3. Complete blocked logins with valid seeds:
   - Working `E2E_PARENT_EMAIL/PASSWORD`
   - Working student username/PIN
   - School staff password in env
4. Only then re-attempt Pass / SoT declaration.

---

## 7. Explicit non-claim

English global product is **not** fully Hebrew-clean across static connected code, runtime UI, APIs, and logged-in flows.

Static EN code/content packs are clean; **Teacher logged-in English runtime and its APIs currently expose Hebrew names from DB seed.** English may **not** be used as Source of Truth until that is fixed and re-verified.
