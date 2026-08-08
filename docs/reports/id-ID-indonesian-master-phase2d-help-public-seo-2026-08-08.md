# Indonesian Master — Phase 2D Help + Public SEO

**Date:** 2026-08-08  
**Scope:** Content ownership only — Help Center + Public SEO overlays for `id-ID`.  
**English SoT only.** No shared wiring / registry / client-index registration.

```text
Indonesian Master — Phase 2D Help + Public SEO

HELP CENTER

English Help sections = 4
Indonesian Help sections = 4

English Help articles = 40
Indonesian Help articles = 40

Help section parity = PASS
Help article parity = PASS
Missing Help slugs = 0
Extra Help slugs = 0
Duplicate Help slugs = 0
Empty Help fields = 0

Help untranslated English UI = 0
Help terminology defects = 0
Help register defects = 0

Help files created =
  data/help-center/id-ID/index.js
  data/help-center/id-ID/parents.js
  data/help-center/id-ID/students.js
  data/help-center/id-ID/parent-report.js
  data/help-center/id-ID/subjects.js

PUBLIC SEO

English runtime SEO sources =
  data/seo/guide-pages.js
  data/seo/practice-pages.js
  data/seo/worksheets-pages.en.js
  data/marketing/landing-pages.js
  data/legal/sitePolicies.js
  locales/en/seo.json (chrome namespaces — NOT owned by Phase 2D; see namespaces owner)

English runtime SEO paths = 51 (SEO_PUBLIC_PATHS)
Indonesian SEO overlay files created = 28

Guide SEO = 12 (11 guide pages + hub-cards.json)
Practice SEO = 11 (9 practice pages + hub-cards.json + worksheets.json)
Worksheet SEO = 1 (practice/worksheets.json; counted in Practice SEO)
Marketing SEO = 4 (kids, parents, teachers, schools)
Other public SEO = 1 (legal/unified.json)

Missing Indonesian SEO paths = 0
Orphan Indonesian SEO paths = 0
Empty localized SEO leaves = 0

Untranslated SEO titles = 0
Untranslated SEO meta descriptions = 0
Untranslated SEO H1 = 0
Untranslated SEO CTA/UI = 0
Mixed-language prose defects = 0

Intentional English-learning values retained =
  English subject page UI localized (Bahasa Inggris); no intentional stem/example
  vocabulary lemmas required retention in this overlay set beyond proper nouns

Justified English-identical values =
  Pythagoras. (geometry topic bullet — proper noun)
  Brand / technical tokens preserved where present (Leo Kids, LEO KIDS, PIN, Copilot, PDF, PWA, Google, emails, hrefs, slugs, seoKeys)

Grade terminology defects = 0
Fase A/B/C product-model leakage = 0

Help shared registration required =
  data/help-center/index.js
    — import SECTIONS_ID_ID / BY_SECTION_ID_ID / ALL_ARTICLES_ID_ID from ./id-ID/index.js
    — resolveHelpLocale("id-ID") → "id-ID"
    — wire getHelpSections / getArticle / listArticles / assertAllArticlesValid for id-ID
  components/help/sectionPageBuilders.js (only if locale chrome branches required — MAIN decide)

Public SEO shared registration required =
  lib/seo/public-seo-ar-001-client-index.js
    — OR new id-ID public-seo client index consumed by locale-public-seo-content.js
    — register all 28 content-packs/id-ID/public-seo/** JSON overlays
  lib/seo/locale-public-seo-content.js (only if new index module path — MAIN decide)
  lib/legal/locale-legal-content.js already reads getClientPublicSeoOverlay(locale,"legal","unified.json")
    — works once id-ID legal overlay is registered in the client index

Content-pack catalog registration required =
  lib/content/pack-catalog.js
    — CONTENT_PACK_CATALOG["id-ID"] public-seo/* entries for the 28 overlay files
      (if catalog is used for server/pack resolution in addition to client index)

Files created outside ownership =
  tests/i18n/id-ID-phase2d-help-public-seo-content.test.mjs (focused content-only test — allowed)
  artifacts/id-ID-phase2d/** (generators, dicts, validation reports)
  docs/reports/id-ID-indonesian-master-phase2d-help-public-seo-2026-08-08.md

Files modified outside ownership = 0
  (lib/i18n/locale-registry.js, load-messages.js, public/sw.js remain Phase 1 wiring; not touched in 2D)

Focused content tests run =
  tests/i18n/id-ID-phase2d-help-public-seo-content.test.mjs
  artifacts/id-ID-phase2d/validate-phase2d.mjs
Tests passed = 4/4 + validate-phase2d PASS
Tests failed = 0

English SoT modified = 0
Other locales modified = 0
Shared wiring modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed

MAIN registration required = YES

PHASE 2D RESULT = PASS
```

## Notes for MAIN

1. Content layer is complete on disk; runtime remains English until Help + public-seo client index (+ optional pack-catalog) registration.
2. `locales/id-ID/seo.json` (10 chrome leaves) is namespace ownership, not Phase 2D public-seo overlays.
3. Locked terminology applied: Kelas 1–6, murid, guru, orang tua, rombongan belajar (schools marketing), lembar kerja, latihan, gim, laporan, Anda (adult), kamu (student Help only).
