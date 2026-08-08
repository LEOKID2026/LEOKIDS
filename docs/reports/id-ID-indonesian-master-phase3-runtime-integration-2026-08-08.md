# Indonesian Master — Phase 3 Runtime Integration

**Date:** 2026-08-08  
**Scope:** Wire existing id-ID namespaces + Help + Public SEO into runtime. No new translation.

```text
Indonesian Master — Phase 3 Runtime Integration

NAMESPACE RUNTIME

Namespace authority = I18N_NAMESPACES
Namespaces registered = 15/15
Namespace runtime parity = PASS

English namespace leaves = 2854
Indonesian namespace leaves = 2854
Runtime id-ID own leaves = 2854

Missing namespace keys = 0
Extra namespace keys = 0
Empty namespace leaves = 0
Placeholder mismatches = 0

Namespace English fallback remaining = 0
Unexplained English namespace UI = 0
  (intentional brand/loanwords/formulas/English-learning retained)

HELP

Help registration = data/help-center/index.js → id-ID full master
resolveHelpLocale(id-ID) = id-ID

Help sections disk/runtime = 4/4
Help articles disk/runtime = 40/40
Missing Help slugs = 0
Extra Help slugs = 0
Duplicate Help slugs = 0

Help English fallback remaining = 0
Help unexplained English UI = 0
  (chrome via ui.nav.helpCenter = Pusat bantuan)

PUBLIC SEO

SEO disk overlay files = 28
SEO client-index registrations = 28
SEO catalog registrations = 28

SEO client missing = 0
SEO client stale = 0
SEO catalog missing = 0
SEO catalog stale = 0

SEO_PUBLIC_PATHS actual = 51
Indonesian localized runtime paths = 51 (via 28 overlays serving practice/guides/marketing/legal)
Missing Indonesian runtime SEO paths = 0

Marketing runtime = PASS
Practice runtime = PASS
Guides runtime = PASS
Worksheets runtime = PASS
Legal runtime = PASS (translation only; no jurisdiction invention)

SEO English fallback on localized fields = 0
SEO unexplained English UI = 0
  (English-subject page chrome Indonesian; learning targets remain EN)

FOUNDATION

Locale = id-ID
Path = /id
Selector = Indonesia
Selector count = 89
Fallback = id-ID → en
Direction = ltr

HTML lang = id-ID
hreflang = includes id-ID
canonical = /id/...
ogLocale = id_ID
TTS locale = id-ID

SW parity = PASS
id-ID offline = /id/offline

English-subject learning content = en
English-subject Indonesian chrome = id-ID

UNTRANSLATED LAYERS

Non-SEO content-pack fallback = YES (learning/reports/games → en)
Writing native id-ID = not yet
Word meanings native id-ID = not yet
Science/stems native id-ID = not yet
API localization status = pending later phase

REGRESSIONS

Existing locale regressions = none in focused suite
Wave1–3 Arabic regression = PASS (ar SEO client still via composite)
es-AR /ar regression = PASS
en regression = PASS

Focused tests run =
  id-ID-phase3-runtime-integration
  id-ID-wiring
  id-ID-phase2e-namespace-parity
  message-loader
  sw-offline-inline-locale
  ar-001-public-seo-locale
  layout-language-switcher
  locale-path
Tests passed = 64/64
Tests failed = 0

Content translation modified = 0
English SoT modified = 0
Other locales modified = 0
Unexpected files = 0
Unrelated changes = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 3 RESULT = PASS
```

## Wiring summary

| Area | Change |
|------|--------|
| Namespaces | `lib/i18n/load-messages.js` — full 15-namespace `id-ID` bundle |
| Help | `data/help-center/index.js` — resolve/list/sections/assert |
| SEO client | `lib/seo/public-seo-id-ID-client-index.js` (28 overlays) |
| SEO dispatcher | `lib/seo/client-public-seo-overlay.js` |
| SEO consumers | `locale-public-seo-content.js`, `locale-legal-content.js` |
| Catalog | `lib/content/pack-catalog.js` — `id-ID` public-seo only (28) |

**Not complete:** books/games/learning/reports/rewards/global-burn-down packs, writing, meanings, stems, APIs remain English-fallback.
