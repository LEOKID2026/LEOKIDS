# GLOBAL ENGLISH — Production Acceptance Fix Round Report

## Git / Deployment reconcile

| | |
|---|---|
| **Branch** | `main` |
| **Remote** | `origin` → `https://github.com/LEOKID2026/LEOKIDS.git` (global; not Israeli) |
| **HEAD before this round** | `c9a4066` (`docs: align fast-track report with pushed HEAD`) — local and `origin/main` matched |
| **Prior report error** | Fast-track report briefly claimed `f421dfd` while delivered HEAD was `c9a4066` — report was stale |
| **Acceptance code commit** | `6a72952` (`fix: Production acceptance — English chrome, login crash, Hebrew CI hard-fail`) |
| **HEAD / origin/main** | `a2fc76c` (docs tip; includes `6a72952`) |
| **Vercel** | Deploy from GitHub `leo-kids-global`; verify Production SHA matches `a2fc76c` after deploy succeeds |

## Scope confirmations

- Work limited to `LEO-KIDS-GLOBAL` only.
- **Supabase was not modified** (no SQL run, no migrations applied).
- **Israeli sites** (`LEO-KIDS`, `LEO-KIDS-WEB-TRY`) were not modified.
- **`GLOBAL_DATA_WRITES_ENABLED=false`** remains the default.
- SQL package under `sql/global-product-isolation/` remains prepared, **not executed**.

## Blockers fixed this round

### 1. Parent Login mobile client crash

| Item | Detail |
|------|--------|
| **Root cause** | UTF-8 BOM (`EF BB BF`) on `pages/_app.js` from a PowerShell `Set-Content` edit → client parse failure / Application error |
| **Status** | BOM removed; first bytes are `imp…` |
| **Verification** | Playwright 412×799 + desktop on local production server (`next start :3011`): **no `pageerror`**, form renders |
| **Note** | Port `3010` may host a different project — Global smoke uses **3011** |

### 2. Active Hebrew on Production chrome

Fixed rendered Hebrew including:

- Install app / cookie prefs / copy modal (prior round + reapply)
- Password toggle (`lib/auth/auth-password.js` → Show/Hide)
- Parent / student promo video defaults (English)
- Worksheet public catalog, topic options, practice formats, levels (English label layer)
- Geometry worksheet stems rewritten to English (selector no longer Hebrew-only ask-cue gate; stem builder English)

### 3. Copy modal / direction

- `CopyConfirmPopup`: English titles, dynamic `dir`/`lang`, logical close (`end-3`), `text-align: start`

### 4. Learning question content (4 subjects)

- Layer `utils/learning-content-en/*` + `localizeLearningQuestion`
- Fixed math Yes/No heuristic that mapped any `כ…` stem (e.g. `כיתה`) to `"Yes"` and destroyed fraction stems
- Geometry localization rebuilt from params; removed bare-noun phrase shredding
- `npm run test:i18n:learning-questions` — **PASS**

### 5. Help / Guides / Practice

- English help/guides/practice SEO modules remain the active source; Hebrew CI hard-fails certified surfaces

### 6. Hebrew CI

- `scripts/i18n/check-hebrew-runtime-scan.mjs` **hard-fails** on certified Global surfaces (~94 files)
- Narrow exemptions only (documented in script): e.g. `data/science-questions.js`, `data/help-center/videos-manifest.he.json`

### 7. Service Worker

- Cache prefix `lk-global-v2` (static/dynamic v2)
- Activate deletes only `lk-global-*` old caches (not Israeli prefixes)
- Navigations network-first

## Tests run (this round)

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** |
| `npm run test:i18n` | **PASS** (locales, write-barrier, curriculum, learning-questions, hebrew certified scan) |
| `npm run test:worksheets` | **PASS** |
| `npm run test:parent-report-phase6` | **PASS** |
| `npm run test:diagnostic-engine-v2-harness` | **PASS** (19/19; harness still includes legacy subject scenario IDs) |
| Browser smoke `scripts/i18n/smoke-production-routes.mjs` | **PASS 40/40** on `http://127.0.0.1:3011` (desktop 1280×800 + mobile 412×799) |

### Smoke table (local production server)

All listed routes **PASS** on both viewports (no client exception, no body Hebrew, HTTP OK):

`/`, `/kids`, `/parents`, `/teachers`, `/about`, `/contact`, `/help`, `/guides`, `/practice`, `/parent/login`, `/student/login`, `/auth/forgot-password`, `/auth/reset-password`, `/practice/worksheets`, `/learning`, `/learning/math-master`, `/learning/geometry-master`, `/learning/english-master`, `/learning/science-master`, `/404`

Non-blocking local noise: `/_vercel/insights/script.js` 404 under `next start` (not a page crash).

## Remaining exemptions / non-Production leftovers

| Item | Reason | Reachable in Production UI? |
|------|--------|------------------------------|
| `*.he.js` / `*.he.jsx` companions | Historical twins; not certified import path for Global chrome | No (if not imported) |
| Admin / arcade / many `pages/api/*` internals | Outside certified launch surface | Admin/arcade only |
| Generator source strings still Hebrew | Localized at finalize via `learning-content-en` | Student sees English layer |
| Diagnostic harness scenarios for hebrew/history/moledet | Engine regression IDs only | Not Global nav |
| SQL package | Ready; owner must approve before run | N/A |

## Owner next steps (SQL still blocked)

1. Confirm Vercel Production deployment SHA == pushed HEAD.
2. Re-run smoke against Production URL (`BASE_URL=https://… node scripts/i18n/smoke-production-routes.mjs`).
3. Only then review/approve SQL package order in `sql/global-product-isolation/README.md`.
4. Do **not** set `GLOBAL_DATA_WRITES_ENABLED=true` until SQL isolation is applied and verified.
)
