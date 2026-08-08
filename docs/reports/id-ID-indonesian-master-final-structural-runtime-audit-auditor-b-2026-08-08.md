# Indonesian Master — Final Structural & Runtime Audit

**Auditor:** Independent Auditor B  
**Date:** 2026-08-08  
**Mode:** READ-ONLY (no fixes, no build, no commit/push, no sub-agents)

```text
Indonesian Master — Final Structural & Runtime Audit

AUDIT RESULT = FAIL

FOUNDATION

Locale = id-ID
Path = /id
Selector = Indonesia
Selector count = 89
Fallback = id-ID → en
Direction = ltr
OG locale = id_ID
TTS locale = id-ID
SW/offline = /id/offline (SW map "id-ID":"id"; prefix collisions = 0)

NAMESPACES

Authority count = 15/15 (I18N_NAMESPACES)
Current EN leaves = 2927
Current ID leaves = 2927
Missing = 0
Extra = 0
Empty = 0
Placeholder mismatches = 0

validation.api EN / ID = 116 / 116
(Note: Phase2 historical 2854 is obsolete after Phase9 validation.api expansion; dynamic total = 2927)

HELP

Sections = 4/4
Articles = 40/40
Runtime locale = id-ID
Missing/extra/duplicates = 0 / 0 / 0

PUBLIC SEO

Disk = 28
Client = 28
Catalog = 28
Runtime paths = 51/51 (SEO_PUBLIC_PATHS = 51; Phase3/Phase5 public-seo runtime PASS)
Missing/stale = 0

CONTENT PACKS

Books = 319
Games = 149
Rewards = 2
Demo = 1
Global burn-down = 154 disk / 153 runtime leaves / index PASS
Learning = 59
Reports = 48 disk / 47 runtime leaves / index PASS
Non-SEO total = 732
Public SEO = 28
Total disk = 760
Catalog model = 28 non-SEO roots + 28 public-seo = 56 catalog keys
English fallback = 0 (catalog roots)

NATIVE LEARNING

Math = 75 kinds / 128 templates / runtime provenance id-ID
Geometry = 9 kinds / 8 localized templates / runtime provenance id-ID
Science = 1017/1017 / contractComplete = true / runtime provenance id-ID
Writing = 12 packs / 8 color instructions / 179 ready titles / 119 sentence cues / runtime localized
Word Meanings = 745/745 (WORD_LISTS authority) / missing = 0 / empty = 0
Learning Books = 24/24 subject×grade slots / 450 localized files / learning_books missing = 0 / legacyFallback = 0
(English SoT docs/learning-book/en absent from HEAD — not classified as Indonesian defect)

COMPLETENESS

ok = 13
missing = 0
fallback = 0
exceptions = english_subject (1)

API

Parent = 0 raw-English leaks (9B-2/9B-5 PASS)
Student/Arcade = 0 raw-English API leaks (9B-3/9B-5 PASS; mapped-code priority PASS)
Teacher = 0
School = 0
Guardian = 0
Demo/Public = 0
Raw-message user-visible leaks = 0
resolveApiErrorMessage = mapped code beats English message; unknown → validation.apiFallback
apiErrorMessageHe = code-first for id-ID

HARDCODED/BYPASS

Unlocalized runtime bypasses = YES (Arcade Club + student arcade shell)
Hardcoded product chrome findings = YES (see Findings ID-AUD-B-001 / ID-AUD-B-002)

REGRESSIONS

en = PASS (/practice/math unprefixed; SW /offline via en default)
es-419 = route/fallback PASS (path /es-419; fallback es-419→en; selectorVisible=false intentional)
ar-001 = route/fallback/selector PASS (arabic-master + wave wiring suites PASS; SW "ar-001":"ar-001")
Arabic Wave1–3 = PASS (selector 89; country paths unchanged in focused wiring)
es-AR = PASS (pathPrefix ar → /ar; fallback es-AR→es-419→en; SW registered)
Pre-existing book-path failures = unchanged
  (learning-content-locale: drafts dir resolves to docs/learning-book/math/... not locale tree — 2 failures)

GIT/SCOPE

Unexpected unrelated files = YES (Arabic wave reports + global-en-qa + _gen-ar-SA sparse helper in dirty tree)
Other locale modifications = 0 (no es/ar/pt/fr/de/it locale JSON edits)
English SoT modifications = locales/en/validation.json only (Phase9 validation.api expansion — expected)
Logic-engine drift = 0 (learning-content-en index/science = id-ID display wiring only; params/correctIndex unchanged)
Temporary/secrets findings = 0

BLOCKER = 0
HIGH = 2
MEDIUM = 1
LOW = 1

Findings =
[ID-AUD-B-001 | HIGH | Arcade Club product chrome | components/arcade/club/ArcadeTabNav.jsx + ArcadeClubEventsPanel.jsx + ArcadeClubFriendsPanel.jsx + ArcadeClubProfilePanel.jsx (+ Missions/Shop/Lobby/Guest banners) | User-visible English hardcodes (Games/Friends/Shop/Profile; Daily event; Collect reward; Player card; Add friend; etc.) bypass useI18n/t(); API feedback was localized in 9B-5 but chrome was not | product/i18n owner]
[ID-AUD-B-002 | HIGH | Student arcade shell | pages/student/arcade.js | Hardcoded English UX/status strings (e.g. "Pick an available game", "Enter a room code", "Not enough coins", "Room is full", "Game disabled on server") not governed by locale messages | product/i18n owner]
[ID-AUD-B-003 | MEDIUM | Stale intermediate tests | tests/i18n/id-ID-phase2a-core-ui.test.mjs; id-ID-phase2c-adult-portals.test.mjs (empty-overlay→en); id-ID-phase3-runtime-integration.test.mjs (hardcoded 2854) | Fail because product advanced (2927 leaves; full ID overlay "Dasbor") while assertions freeze Phase2 incomplete state — can mask real regressions | test owner]
[ID-AUD-B-004 | LOW | Dirty-tree unrelated artifacts | docs/reports/arabic-country-wave-*.md/json; docs/reports/ar-DZ-effective-gaps-scan.json; docs/reports/global-en-qa-accounts-provision.json; tests/i18n/_gen-ar-SA-sparse-layer.mjs | Present alongside Indonesian program; not id-ID runtime defects | cleanup owner]

Focused tests =
  id-ID wiring + phase2a/2c/2d/2e/3/4a/4d/5 + phase6a/6c/6d/7/8 + phase9b1–9b5
  layout-language-switcher + arabic-master + arabic-country-wave-3 + arabic-country-wave-probe-quality + country-locale-wiring
  es-419-phase1 + ar-001-remediation/activity-emails-sw (route scope only)
  learning-content-locale (pre-existing book-path probe)
  Independent probe: artifacts/id-ID-auditor-b-final/structural-runtime-probe.mjs

Tests passed =
  Phase2E namespace parity = 4/4
  Phase5 non-SEO runtime = 17/17 (when run alone; 1 fail only when bundled with Phase3 stale 2854 assertion)
  Phase6a/6c/6d/7/8/9b1–9b5 = 81/81
  Wiring + Arabic/country/layout + Phase2E = 63/63
  id-ID batch1 (2a→5+wiring) = 51/54 (3 stale fails)
  Product-authority dynamic checks (namespaces/help/packs/completeness/API) = PASS

Tests failed =
  id-ID-phase2a structural parity hardcoded leaf total (972 vs current 1045 for Phase2A subset) — STALE
  id-ID-phase2c empty-overlay expects EN "Dashboard" — STALE (now "Dasbor")
  id-ID-phase3 hardcoded 2854 own leaves — STALE (actual 2927)
  es-419 translated namespace parity / forbidden patterns — OUT OF SCOPE (translation re-audit; routes unaffected)
  learning-content-locale book-path ×2 — PRE-EXISTING UNCHANGED

Files modified = 0 (auditor read-only; probe artifacts only under artifacts/id-ID-auditor-b-final/)
Build = not run
Commit = not created
Push = not performed
API/background/sub-agents used = 0

FINAL STRUCTURAL AUDIT = FAIL
```

## Verdict rationale

Structural wiring, namespaces (dynamic **2927/2927**), Help, Public SEO, content-pack catalog model (**56** keys), native learning, learning books, completeness (**missing = 0**), and API raw-message gates all **PASS**.

FAIL is driven solely by **HIGH** hardcoded Arcade Club / student-arcade chrome that bypasses the locale message system (section 20). Phase 9B-5 already noted this residual as outside the API gate; for Master final structural closure it remains open.

## PASS gate checklist

| Gate | Result |
|---|---|
| BLOCKER = 0 | YES |
| HIGH = 0 | **NO** (2) |
| missing runtime localization registrations = 0 | YES (registered layers complete) |
| wrong-locale fallback = 0 | YES |
| logic drift = 0 | YES |
| confirmed raw-English API leak = 0 | YES |
| completeness missing = 0 | YES |

## Evidence anchors

- Registry: `lib/i18n/locale-registry.js` (`id-ID` → pathPrefix `id`, nativeName Indonesia, fallback en, og `id_ID`, TTS `id-ID`)
- SW: `public/sw.js` `"id-ID": "id"`
- Completeness: `checkLocaleCompleteness("id-ID")` → ok=13 missing=0 fallback=0 exceptions=1
- Probe JSON: `artifacts/id-ID-auditor-b-final/probe-results.json`
