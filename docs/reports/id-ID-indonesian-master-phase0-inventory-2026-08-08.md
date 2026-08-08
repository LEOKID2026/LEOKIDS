# Indonesian Master — Phase 0 Inventory

**Date:** 2026-08-08  
**Mode:** READ-ONLY (no `id-ID` created, no translation, no code wiring, no build, no commit)  
**English SoT:** `en` only (not Arabic / not other languages)

---

```text
Indonesian Master — Phase 0 Inventory

Candidate locale = id-ID
Candidate path = /id  (pathPrefix: id)
Candidate selector = Indonesia
Fallback = id-ID → en
Direction = ltr

Locale collision = NO
Path collision = NO
Selector collision = NO

Current selector count = 88
Expected eventual selector count = 89

Namespace authority = lib/i18n/load-messages.js → I18N_NAMESPACES
Namespace count = 15
Namespaces = common, ui, auth, learning, reports, emails, seo, legal, worksheets, games, validation, teacher, school, platform, copilot

Total English translatable namespace leaves = 2854
Placeholder-bearing leaves = 124  ({var} ICU-style)
Rich-text/HTML leaves = 0  (in locales/en/*.json)

Content-pack families = 7 under content-packs/en/ (+ public-seo English SoT outside content-packs)
Content-pack files by family =
  books = 319
  demo = 1
  games = 149
  global-burn-down = 154
  learning = 59  (includes diagnostic-labels.json)
  reports = 48
  rewards = 2
Total active content-pack files = 732 JSON under content-packs/en/
Catalog root keys (CONTENT_PACK_CATALOG.en) = 28

Public SEO disk files (English content-packs) = 0  (no content-packs/en/public-seo/)
Public SEO runtime-active files = ~25 English page sources
  (11 guides + 9 practice hubs + 1 worksheets hub + 4 marketing landings;
   SEO_PUBLIC_PATHS expands to 51 paths including worksheet slugs)
Public SEO authority =
  data/seo/guide-pages.js
  data/seo/practice-pages.js
  data/seo/worksheets-pages.en.js
  data/marketing/landing-pages.js
  lib/seo/locale-public-seo-content.js (resolver)
  lib/seo/public-seo-ar-001-client-index.js (Arabic overlays only today)
  locales/en/seo.json (meta chrome)

Help sections = 4 (parents, students, parent-report, subjects)
Help articles = 40 (13 + 11 + 12 + 4)
Help integration authority = data/help-center/index.js + data/help-center/content/*

Public route groups =
  Marketing/home, Legal, Practice, Guides, Worksheets, Help,
  Auth logins, Demo, Offline PWA hub, Learning masters, Install-app
Public routes total ≈ 133 unique page templates
  (≈93 static/hub + 40 help articles; sitemap static = 69 incl. 30 worksheet slugs)

Logged-in roles mapped:
Parent = YES (13 pages; locale API pages/api/parent/membership/locale.js)
Student = YES (59 pages; learning/games/rewards/activities)
Teacher = YES (26 pages; locale API pages/api/teacher/profile/locale.js)
School = YES (14 pages; dashboard/students/teachers/classes/operators)

User-visible API/server surfaces =
  ~214 routes under pages/api/{parent,student,teacher,school,demo,public}/
  Patterns: snake_case codes (map via validation.json), English sentence errors (must localize),
  teacher sendTeacherApiError messages, parent guest/link sentences

English-learning intentional-content map =
  subject===english → content locale forced en (lib/i18n/locale-resolution.js)
  utils/learning-content-en/** (english subject branch)
  data/english-questions/**
  docs/learning-book/*/english/** target lines
  learning taxonomy english.* (structure/content; english_subject_exception)
  /practice/english + english-master pages (UI may localize; stems/options stay EN)
  writing english-letters / english-words builders (learning content)

Potential English UI fallback surfaces =
  Unwired locale falls to en via registry + loadLocaleBundles merge
  Public SEO for non-Arabic masters (es-419 model) stays English until overlays exist
  Help resolveHelpLocale() → en when id-ID not wired
  API error strings still English until mapped
  emails namespace (4 leaves) + any untranslated pack leaf

Service Worker authority = public/sw.js
  LOCALE_PUBLIC_PATH_PREFIX + offlineFallbackPath(locale)
  Regen: docs/reports/_gen-sw-locale-prefix-map.mjs
Candidate /id/offline collision = NO
  (future: id-ID → /id/offline once registered + SW map entry)

SEO locale metadata support:
html lang = YES (pages/_document.js from registry)
hreflang = YES (buildHreflangAlternates over ACTIVE_LOCALE_IDS + x-default)
canonical = YES (buildCanonicalUrl + withLocalePath)
og:locale = YES (registry.ogLocale via resolveOgLocale) — id-ID value NOT registered yet
TTS = YES (registry.textToSpeechLocale via lib/speech/locale-resolver.js) — id-ID value NOT registered yet
  (Phase 0 does NOT invent og/TTS values — MAIN must lock)

Math/number logic-sensitive files/surfaces =
  LOGIC: correctAnswer / selectedAnswer grading, params.kind, questionKinds,
    utils/math-question-generator.js, activity answer APIs, science correctIndex
  DISPLAY: formatNumber / formatCurrency (lib/i18n/message-format.js),
    book-math-display thousands substitution, report number formatting
  Rule: never alter canonical math answers/params when translating stems

Reusable existing tests =
  tests/i18n/es-419-phase1.test.mjs
  tests/i18n/content-packs-es-419.test.mjs
  tests/i18n/help-center-es419.test.mjs
  tests/i18n/arabic-master-wiring.test.mjs
  tests/i18n/message-loader.test.mjs
  tests/i18n/locale-path.test.mjs
  tests/i18n/locale-nav-persistence.test.mjs
  tests/i18n/sw-offline-inline-locale.test.mjs
  tests/i18n/layout-language-switcher.test.mjs
  tests/i18n/ar-001-public-seo-locale.test.mjs
  tests/i18n/learning-content-locale.test.mjs
  tests/i18n/country-locale-wiring.test.mjs + country-wave{4-7}-wiring.test.mjs
  tests/e2e/ar-001-runtime-crawl.spec.ts (pattern only — do not copy Arabic assumptions)
  docs/reports/_master-loggedin-api-verify.mjs
  docs/reports/_non-en-locale-sot-audit.mjs
  Closest LTR master wiring models: pt-BR / de-DE wiring tests

Missing Indonesian-specific tests that will be required later =
  tests/i18n/id-ID-wiring.test.mjs (registry, prefix, namespaces, SW, packs)
  Help center id-ID slug parity
  Runtime crawl for /id public + logged-in roles
  English-leakage crawl excluding english_subject_exception
  Structural parity vs en namespaces + burn-down indexes
  Optional public-seo overlay tests IF choosing ar-style SEO (not es-419 English fallback)

Admin/dev/prototype exclusions =
  pages/admin/**, pages/api/admin/**
  pages/learning/dev/**, student prototypes / pwa-debug
  scripts/**, artifacts/**, tests/**, logs
  middleware skips /admin and /api for locale rewrite

Files that will require shared wiring =
  lib/i18n/locale-registry.js
  lib/i18n/load-messages.js
  lib/content/pack-catalog.js
  public/sw.js (+ optional _gen-sw-locale-prefix-map.mjs)
  data/help-center/index.js
  components/help/sectionPageBuilders.js (if locale chrome branches)
  lib/learning/question-content-locale.js
  utils/learning-content-en/index.js (+ new utils/learning-content-id-ID/)
  lib/learning/render-question-stem.js
  data/english-questions/word-meanings-locale.js
  data/writing/word-packs.locale.js
  lib/i18n/check-locale-completeness.js
  Optional: lib/i18n/locale-normalize.js alias "id"→"id-ID"
  Optional public-seo client index IF translated SEO overlays chosen

Files/folders that will require Indonesian content =
  locales/id-ID/{15 namespaces}.json
  content-packs/id-ID/** (mirror en families; catalog + burn-down leaves)
  data/help-center/id-ID/{index,parents,students,parent-report,subjects}.js
  docs/learning-book/id-ID/** drafts (completeness manifest required)
  science overlay / native stems (math, geometry)
  writing pack locale strings
  word-meanings locale pack (UI/meaning side; English lemmas stay EN where intentional)
  Optional: content-packs/id-ID/public-seo/** + client index registration

Potential BLOCKERs = none found for candidate /id or id-ID registration path

Potential HIGH risks =
  1) Public SEO model choice (es-419 English fallback vs ar-001 translated overlays) — affects scope/size
  2) Logged-in + API English sentences remaining after public UI ships (partial locale feel)
  3) Completeness manifest requires learning books + science/stems/writing — large beyond UI JSON
  4) Register mix kamu/Anda across child vs adult surfaces if not gated by audience
  5) Math/answer key corruption if translators touch logic fields

Potential MEDIUM risks =
  1) ogLocale / textToSpeechLocale not inventable in Phase 0 — must be MAIN-locked before registry
  2) Grade labels: product keys g1–g6 / "Grade N" → Kelas 1–6; Fase A/B/C not in product model today
  3) Physical class vs grade: rombongan belajar / rombel vs Kelas — school portal ambiguity
  4) Game terminology "gim" vs common "permainan" — locked authority may feel product-specific
  5) English taxonomy / english-page-skills packs: translate UI chrome only; keep learning EN
  6) Help subjects factory articles use "grades 1–6" — must become Kelas under authority
  7) SW SUPPORTED_LOCALE_CACHE_IDS parity tests will fail until map updated with registry

Potential LOW risks =
  1) CDN test URLs containing /processed/id/ are not HTTP locale routes
  2) India uses /in-en (bare /in free) — does not block /id
  3) emails namespace only 4 leaves
  4) demo pack optional if demo not shipping in market
  5) teacher.reportSubjects array holds subject IDs (non-translatable)

Files modified = 0 product/code files
  (inventory only: this report + artifacts/id-ID-phase0/phase0-counts.mjs helper)
Build = not run
Commit = not created
Push = not performed
API/background agents used = 0

PHASE 0 RESULT = READY
```

---

## 1. Collision check (verified)

| Check | Result | Evidence |
|-------|--------|----------|
| Locale `id-ID` | **NO collision** | Absent from `LOCALE_REGISTRY` |
| `pathPrefix: "id"` | **NO collision** | Not in any registered prefix set |
| Selector "Indonesia" | **NO collision** | Zero repo hits for Indonesia / Bahasa / id-ID |
| `/id` vs dynamic `[id]` | **NO collision** | Middleware owns first segment before Next routing; no root `pages/[id]`; nested `[id]` only under `/api/admin/**` (locale rewrite skipped) |
| SW `/id/offline` | **NO collision** | Pattern `/{prefix}/offline`; `id` unused |

```text
LOCALE COLLISION = NO
PATH COLLISION = NO
SELECTOR COLLISION = NO
Collision owner = n/a
MAIN decision required =
  Confirm pathPrefix "id" + selector label "Indonesia" +
  lock ogLocale + textToSpeechLocale before Phase 1 registry write
  (do not invent in Phase 0)
```

---

## 2. English SoT surfaces (active public product)

| Layer | Authority |
|-------|-----------|
| UI namespaces | `locales/en/*.json` (15) |
| Content packs | `content-packs/en/**` (7 families, 732 JSON) |
| Public SEO page copy | `data/seo/*`, `data/marketing/landing-pages.js` |
| Help | `data/help-center/content/*` |
| Learning books | `docs/learning-book/en/**` (completeness required) |
| Writing packs | `data/writing/word-packs.en.js` + locale router |
| Question banks | English SoT banks + locale display layers |
| Completeness contract | `lib/i18n/locale-completeness-manifest.js` |

Do **not** use Arabic or other languages as translation source.

---

## 3. Namespace authority (per namespace)

Authority file: `lib/i18n/load-messages.js`

| Namespace | English leaves | Placeholders | Arrays/objects | HTML | Non-translatable notes |
|-----------|---------------:|-------------:|----------------|------|------------------------|
| common | 46 | 1 | nested objects | 0 | — |
| ui | 633 | 17 | deep nested (max depth ~6) | 0 | — |
| auth | 181 | 6 | grouped objects | 0 | — |
| learning | 617 | 52 | deep nested | 0 | Grade g1–g6 labels → Kelas |
| reports | 249 | 28 | nested | 0 | — |
| emails | 4 | 0 | flat | 0 | — |
| seo | 10 | 0 | flat | 0 | — |
| legal | 31 | 0 | flat | 0 | — |
| worksheets | 334 | 2 | flat | 0 | — |
| games | 80 | 0 | nested | 0 | — |
| validation | 58 | 2 | nested | 0 | Maps API codes |
| teacher | 81 | 11 | 1 string array | 0 | `reportSubjects` = subject IDs |
| school | 387 | 5 | nested | 0 | rombel vs Kelas ambiguity |
| platform | 54 | 0 | nested | 0 | — |
| copilot | 89 | 0 | nested | 0 | Adult register (Anda) |
| **TOTAL** | **2854** | **124** | — | **0** | — |

---

## 4. Message loader / wiring for `id-ID → en`

| Concern | File |
|---------|------|
| Static bundles + merge cache | `lib/i18n/load-messages.js` |
| Fallback chain | `lib/i18n/locale-resolution.js` → `getLocaleFallbackChain` |
| Translator | `lib/i18n/create-translator.js` |
| Provider / hydration | `lib/i18n/I18nProvider.jsx` |
| Normalize | `lib/i18n/locale-normalize.js` |
| SSR request locale | `lib/i18n/read-request-interface-locale.server.js` |
| Cookie | `lib/i18n/locale-cookie.js` |
| Path rewrite | `middleware.js` + `lib/i18n/locale-path.js` |
| Packs | `lib/content/pack-catalog.js` + `resolve-registered-pack.js` + `locale.server.js` |

**Minimum for chain to work:** register `id-ID` with `fallbackLocale: "en"` + empty/partial `LOCALE_BUNDLES["id-ID"]` → deep-merge yields English until overlays exist.  
**Closest master model:** `pt-BR` (full LTR language master, `pathPrefix`, selector-visible) — not sparse country overlay.

---

## 5. Content-pack families

| Family | English authority | Files | Runtime loader | Catalog/index | Needs full ID | Can remain EN | Reason |
|--------|-------------------|------:|----------------|---------------|---------------|---------------|--------|
| books | `content-packs/en/books/` | 319 | `resolveBooksPack` / book-pack-copy | ui + registry-titles + english-page-skills; page-title leaves on disk | YES (titles/UI) | english skill target lines | english_subject_exception |
| demo | `content-packs/en/demo/ui.json` | 1 | demo-pack-copy | single file | IF demo ships | YES if unused | es-419 inventory optional |
| games | `content-packs/en/games/` | 149 | game-pack-copy / game-locale-contract | burn-down-index + ui-pack-index | YES | — | full master |
| global-burn-down | `content-packs/en/global-burn-down/` | 154 | global-burn-down-copy | burn-down-index (153 keys) | YES | — | portals/chrome |
| learning | `content-packs/en/learning/` | 59 | learning-locale-contract + burn-down | burn-down-index + diagnostics + taxonomy | MOSTLY | taxonomy/english.* learning targets | english_subject_exception |
| reports | `content-packs/en/reports/` | 48 | report-pack-copy | burn-down-index | YES | — | parent reports |
| rewards | `content-packs/en/rewards/` | 2 | reward-pack-copy | ui + card-catalog | YES | card art URLs | UI strings |
| public-seo | **not under en packs** | 0 disk | locale-public-seo-content | data/seo + marketing | MAIN choice | YES (es-419 model) | ar-001 uses overlays |
| writing | `data/writing/*` | n/a pack family | word-packs.locale.js | EN packs + locale chain | YES (instructions/titles) | english letter/word content | intentional EN learning |
| worksheets meta | worksheets namespace + ready catalog | — | worksheet servers | ready catalog | YES (UI) | — | — |

---

## 6. Public SEO inventory

```text
Public SEO source-of-truth = data/seo/* + data/marketing/landing-pages.js (+ locales/en/seo.json)
Client index = lib/seo/public-seo-ar-001-client-index.js (Arabic only today)
Server resolver = lib/seo/locale-public-seo-content.js
Generator if any = scripts/i18n/generate-public-seo-ar-001.mjs (Arabic path)
Disk file count (en packs) = 0
Runtime registration count (en) = ~25 page content sources; SEO_PUBLIC_PATHS = 51
```

**MAIN decision:** follow es-419 (English SEO until later) vs ar-001 (full translated `content-packs/id-ID/public-seo` + client index).

---

## 7. Help Center

```text
English Help sections = 4
English Help articles = 40
Help locale authority = data/help-center/index.js → resolveHelpLocale()
Indonesian integration files required =
  data/help-center/id-ID/index.js
  data/help-center/id-ID/parents.js
  data/help-center/id-ID/students.js
  data/help-center/id-ID/parent-report.js
  data/help-center/id-ID/subjects.js
  + imports/branches in data/help-center/index.js
  + assertAllArticlesValid slug parity (40)
```

Model: full master like `es-419` / `pt-BR` (not sparse country overlay).

---

## 8. Public routes under `/id/...`

| Group | Approx count | Examples |
|-------|-------------:|----------|
| Marketing / home | 11 | `/`, `/kids`, `/parents`, `/teachers`, `/schools`, … |
| Legal | 7 | `/privacy`, `/terms`, `/legal`, … |
| Practice | 10 hubs | `/practice`, `/practice/math`, … |
| Guides | 11 | `/guides` + guide slugs |
| Worksheets | 33 | hub + 30 ready + preview |
| Help | 45 | hub + sections + 40 articles |
| Auth logins | 4 | parent/teacher/school/student login |
| Demo | 2 | `/demo/enter`, `/demo/parent/enter` |
| Offline | 5 | `/offline` + mini-games |
| Learning masters | 4 | math/english/geometry/science-master |
| Install-app | 3 | parent/teacher/student |

**Total unique templates ≈ 133.**

---

## 9. Logged-in product surfaces

| Role | Shell | Locale persist | Must translate with public site |
|------|-------|----------------|---------------------------------|
| Parent | Layout + parent modals/dashboard | `/api/parent/membership/locale` | YES |
| Student | Student home/learning/games/rewards | session + cookie/middleware | YES |
| Teacher | TeacherPortalShell | `/api/teacher/profile/locale` | YES |
| School | SchoolPortalShell | cookie/middleware + school chrome packs | YES |

Namespaces heavily involved: `ui`, `auth`, `learning`, `teacher`, `school`, `validation`, `reports`, `platform`, `copilot`, plus global-burn-down leaves for portal chrome.

---

## 10. API / server string classes

| Class | Examples |
|-------|----------|
| **must localize** | `"Method not allowed"`, `"Student session expired"`, teacher `sendTeacherApiError` messages, parent guest/link sentences |
| **technical only** | `{ error: "snake_case_code" }` when UI maps via validation namespace |
| **error/log only** | server logs, stack traces |
| **admin/dev only** | `pages/api/admin/**` |
| **English-learning intentional** | English-subject question payloads / lemmas |

---

## 11. English-subject exception map (path/key)

| Path / rule | Keep EN? |
|-------------|----------|
| `resolveContentLocale({ subject: "english" })` → `"en"` | YES (stems/options) |
| `utils/learning-content-en/english.js` WORD_LISTS / phonics | YES |
| `data/english-questions/**` | YES (learning content) |
| `content-packs/*/books/english-page-skills.json` skill targets | YES where teaching English |
| `learning/taxonomy/english.*` learning targets | YES per manifest exception |
| Instructions via `resolveLearningInstructionLocale` | MAY follow interface locale |
| `/practice/english` marketing chrome | Translate UI; not stems |
| Writing english-letters / english-words | Learning content EN |

Do **not** treat these as UI leakage.

---

## 12. Excluded scope

Admin, dev, prototypes, internal QA (`lib/site-nav.js` QA tooling paths), scripts, build tooling, tests, logs — **out of public Indonesian translation scope** unless they affect user runtime (they generally do not).

---

## 13. Service Worker / offline

```text
LOCALE_PUBLIC_PATH_PREFIX = public/sw.js (inline map)
offlineFallbackPath(en) = /offline
offlineFallbackPath(non-en) = /{prefix}/offline
Candidate = id-ID → /id/offline
Collision = NO
```

Arabic-only SW inline HTML branch does not apply to Indonesian (LTR Latin).

---

## 14. SEO locale metadata (actual support)

| Feature | Supported now | Needs for id-ID |
|---------|---------------|-----------------|
| html lang/dir | YES | registry entry |
| hreflang | YES via ACTIVE_LOCALE_IDS | enable locale |
| canonical | YES | pathPrefix wiring |
| og:locale | YES from registry | **MAIN lock value** (not invented here) |
| alternates | YES (PageSeo) | auto once enabled |
| TTS | YES from registry | **MAIN lock value** (not invented here) |

---

## 15. Locked Indonesian linguistic authority (Phase 0 — do not change)

```text
Language = Bahasa Indonesia
Locale = id-ID
Direction = ltr
Digits = 0–9
Academic grade = Kelas (Kelas 1 … Kelas 6)
School stage = SD / Sekolah Dasar
Fase A = Kelas 1–2; Fase B = Kelas 3–4; Fase C = Kelas 5–6
Student = murid
Teacher = guru
Parent/guardian = orang tua/wali murid
Physical class/group = rombongan belajar / rombel
Subject = mata pelajaran
Score/mark = nilai / skor (context)
Report = laporan
Report card = rapor
Worksheet = lembar kerja
Practice = latihan
Game = gim
Help Center = Pusat Bantuan
Guide = Panduan
Sign in = Masuk
Sign out = Keluar
Password = kata sandi
Dashboard = dasbor
```

### Product ambiguities to REPORT (not decide)

1. **ogLocale / textToSpeechLocale** — product supports fields; no Indonesian values in repo. MAIN must lock (candidates typically `id_ID` / `id-ID` by analogy to `pt_BR`/`pt-BR`, but Phase 0 does not invent).
2. **Fase A/B/C** — curriculum authority exists in this brief; product model is `g1`–`g6` only. Whether Fase labels appear in UI needs MAIN product decision.
3. **Selector label** — candidate `Indonesia` matches country-style labels (e.g. Egypt, Brasil); alternate `Bahasa Indonesia` not chosen here.
4. **nilai vs skor** — both allowed by context; need per-surface guidance in translation phase.
5. **gim** — locked; may differ from colloquial *permainan* — keep unless MAIN revises authority.

---

## 16. Register policy (later translation)

| Audience | Register |
|----------|----------|
| Child/Student | friendly Indonesian; **kamu** / natural imperatives |
| Adult (Parent/Teacher/School/Help adult/Legal/Marketing adult) | **Anda** or neutral professional |

Flag high-sensitivity English keys already containing *you/You* in student vs adult namespaces (`learning.*` child; `copilot.*` / `school.*` / `teacher.*` / `auth.*` adult).

---

## 17. Numeric / math safety

| Kind | Classification |
|------|----------------|
| `correctAnswer`, `selectedAnswer`, MCQ grading | **logic-sensitive** |
| `params`, `questionKinds`, operations | **logic-sensitive** |
| Decimal/thousand separators in prose / reports | **display-only** (format via intl) |
| Currency in UI | **display-only** |
| Equations rendered as learning content | display layer only; do not rewrite canonical params |

---

## 18–19. Tests

Reusable patterns listed in header block. **No new broad test suites in Phase 0.**  
Do not copy Arabic country-wave linguistic assumptions (صف/درجة etc.).

---

## PHASE 0 RESULT = READY

Ready because:

- English SoT active scope mapped (namespaces + packs + SEO + Help + books completeness path)
- `/id` collision status known (**clear**)
- Runtime loaders/catalogs/indexes mapped
- Help / SEO / logged-in / API surfaces mapped
- Intentional English-learning content distinguished from UI leakage
- No blocker requiring alternate path selection
