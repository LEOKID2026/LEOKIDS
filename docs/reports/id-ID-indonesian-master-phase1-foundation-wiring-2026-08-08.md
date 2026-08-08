# Indonesian Master — Phase 1 Foundation Wiring

**Date:** 2026-08-08  
**Scope:** Foundation wiring only — no translation, Help, content packs, or public SEO content.

```text
Indonesian Master — Phase 1 Foundation Wiring

Locale = id-ID
Path = /id
Selector = Indonesia
Fallback = id-ID → en
Direction = ltr

ogLocale = id_ID
textToSpeechLocale = id-ID

Registry = lib/i18n/locale-registry.js (enabled, selectorVisible)
Selector before = 88
Selector after = 89
Duplicate ids = 0
Duplicate paths = 0
Duplicate labels = 0

Locale normalization =
  id-ID / id-id / ID-ID → id-ID (exact registry match)
  bare id → canonical "id" (not a registry alias; same master convention as de/it/fr)
  pathPrefix "id" owns public /id → id-ID
/id route = PASS (/, /parents, /practice/math, /help, /parent/login)
False /id path matches = 0 (/foo/id, /some-id-value, /api/.../id untouched)

Message-loader registration = LOCALE_BUNDLES["id-ID"] = Object.freeze({})
Namespace authority = I18N_NAMESPACES (lib/i18n/load-messages.js)
Namespace count = 15
Temporary namespace scaffolds created = 0 (empty in-bundle registration; no locales/id-ID/*.json)

Fallback runtime = getLocaleFallbackChain("id-ID") = ["id-ID","en"]
English fallback currently expected = yes
Indonesian translated namespace leaves = 0

HTML lang = id-ID (registry intlLocale / document from registry id)
Direction runtime = ltr; isRtlLocale(id-ID) = false
hreflang = id-ID alternate via ACTIVE_LOCALE_IDS + ogLocale→hyphen
canonical = /id/... via withLocalePath
OG locale runtime = id_ID
TTS locale runtime = id-ID (tag routing only; no voice claim)

SW map registration = "id-ID": "id" (via _gen-sw-locale-prefix-map.mjs)
id-ID offline = /id/offline
SW map↔registry parity = PASS
Arabic offline UI for id-ID = false

Locale persistence = withLocalePath keeps /id prefix on representative paths

English-subject content locale = en (via interfaceLocale + subject=english)
Math/question logic modified = 0

Help Phase1 behavior = resolveHelpLocale("id-ID") → en (unregistered Help pack)
Content-pack Phase1 behavior = missing id-ID packs → en via getContentFallbackChain
Public SEO Phase1 behavior = English SoT (no id-ID overlays)
Final Public SEO policy = full translated (later phase)

Writing/meaning routers requiring later content =
  data/writing/word-packs.locale.js
  data/english-questions/word-meanings-locale.js
  utils/learning-content-* display layers / stems / science overlay
  lib/learning/question-content-locale.js hasNativeQuestionDisplayLocale (optional later)
  lib/content/pack-catalog.js id-ID entry (when packs exist)
  data/help-center/id-ID/* (40 articles)
  content-packs/id-ID/public-seo + client index (full SEO policy)

Focused tests run =
  id-ID-wiring, message-loader, locale-path, locale-nav-persistence,
  locale-normalize, locale-direction, sw-offline-inline-locale,
  layout-language-switcher, arabic-master-wiring, arabic-country-wave-3-wiring
Tests passed = 95/95 (focused suite above)
Tests failed = 0 (focused suite)

Note: learning-content-locale book-dir assertions (2) fail pre-existing
  (docs/learning-book/math vs docs/learning-book/en/math) — unrelated to id-ID.
  English-subject subtest in that file PASSES.
  locale-infrastructure-stage5 en missingCount=1 is pre-existing learning_books gap.

Existing locale regressions = none in focused suite
Wave1–3 Arabic regression = PASS (selector 89 updated; paths unchanged)
es-AR /ar regression = PASS (SW /ar/offline)
en regression = PASS (/offline)

Files modified =
  lib/i18n/locale-registry.js
  lib/i18n/load-messages.js
  public/sw.js
  tests/i18n/id-ID-wiring.test.mjs (new)
  tests/i18n/layout-language-switcher.test.mjs (88→89)
  tests/i18n/arabic-master-wiring.test.mjs (88→89)
  tests/i18n/arabic-country-wave-3-wiring.test.mjs (88→89)
  tests/i18n/country-locale-wiring.test.mjs (88→89)
  tests/i18n/arabic-country-wave-probe-quality.test.mjs (88→89)
  docs/reports/id-ID-indonesian-master-phase1-foundation-wiring-2026-08-08.md

Unexpected files = 0
Unrelated changes = 0

Translation work performed = 0
English SoT modified = 0
Other locales modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 1 RESULT = PASS
```
