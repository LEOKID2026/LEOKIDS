# Arabic country wave — main wiring report

```text
Arabic country wave — main wiring report

Locales wired =
- ar-EG
- ar-SA
- ar-MA
- ar-DZ

Paths =
- /eg
- /sa
- /ma
- /dz

Fallback chains =
- ar-EG → ar-001 → en
- ar-SA → ar-001 → en
- ar-MA → ar-001 → en
- ar-DZ → ar-001 → en

Selector count before = 76
Selector count after = 80

Registry changes =
- lib/i18n/locale-registry.js: registered ar-EG/ar-SA/ar-MA/ar-DZ (enabled, RTL, pathPrefix eg/sa/ma/dz, selectorVisible, fallbackLocale ar-001)
- العربية (ar-001) retained in selector

Path/redirect changes =
- Public prefixes via registry pathPrefix (middleware uses generic strip/canonicalize — no middleware fork)
- Internal /ar-EG|/ar-SA|/ar-MA|/ar-DZ → public /eg|/sa|/ma|/dz
- /ar remains es-AR (Argentina); bare ar stays disabled

Middleware changes =
- none (generic locale-registry driven)

Message-loader changes =
- lib/i18n/load-messages.js: sparse namespace imports + LOCALE_BUNDLES for all 4 locales
- scripts/i18n/wire-arabic-country-wave.mjs added for catalog/loader wiring helper

Content-pack changes =
- lib/content/pack-catalog.js: registered all on-disk sparse packs for ar-EG/ar-SA/ar-MA/ar-DZ (catalog↔disk parity)
- No full-copy packs invented; inheritance via fallback chain

Help resolver/index changes =
- data/help-center/index.js: wired ar-SA/ar-MA/ar-DZ overlays
- ar-EG has no Help overlay → resolveHelpLocale(ar-EG) = ar-001 (inherit master)

Other shared wiring changes =
- lib/seo/public-seo-ar-001-client-index.js: register ar-SA public-seo overlays
- lib/seo/locale-public-seo-content.js: loadPublicSeoPack walks fallback chain (country → ar-001)
- data/english-questions/word-meanings-locale.js: Arabic country instruction locales inherit ar-001 meanings
- lib/reports/report-pack-copy.js: merge catalogued reports/burn-down leaf packs into runtime index (sparse leaf overrides resolve)
- utils/learning-content-ar-001/geometry-conceptual.js: ar-001 geometry active when fallback chain includes ar-001
- pages/learning/parent-report.js: Arabic date locale uses registry intlLocale for all ar-* RTL locales
- public/sw.js: offline paths + locale cache ids for the 4 countries
- tests/i18n/arabic-country-wave-wiring.test.mjs (new)
- tests/i18n/arabic-master-wiring.test.mjs + country-locale-wiring.test.mjs selector counts updated to 80
- docs/reports/_arabic-country-wave-runtime-probes.mjs (+ JSON output)

RTL verified = yes (direction rtl + isRtlLocale true for all 4)
Locale persistence verified = yes (middleware sets lk_global_locale cookie on prefixed routes; LanguageSwitcher uses getSelectableLocales)

Egypt content layer test = PASS (ar-EG-content-layer.test.mjs)
Saudi content layer test = PASS (ar-SA-content-layer.test.mjs)
Morocco content layer test = PASS (ar-MA-sparse-contract.test.mjs)
Algeria content layer test = PASS (ar-DZ-sparse-contract.test.mjs)

Wiring tests = PASS (arabic-country-wave-wiring.test.mjs 16/16; arabic-master-wiring; country-locale-wiring; locale-direction)
Runtime probes = PASS (docs/reports/arabic-country-wave-runtime-probes.json)

Duplicate locales = 0
Duplicate paths = 0
Duplicate labels = 0
Route mismatches = 0
Fallback mismatches = 0

Hebrew leakage findings = 0
Forbidden English UI findings = 0

ar-DZ grade6 display = السنة 1 متوسط
ar-DZ invalid السنة 6 findings = 0

COUNTRY CONTENT findings:
BLOCKER = 0
HIGH = 0
MEDIUM = 0
LOW = 0

SHARED WIRING findings:
BLOCKER = 0
HIGH = 0
MEDIUM = 0
LOW = 0

Build run = yes (technical wiring verification only; not final closure)
Build result = PASS (npm run build exit 0)

API/background agents used = 0

Commit = not created
Push = not performed
Deployment = not performed
```

## Notes for auditors

- No country-to-country Arabic inheritance.
- Sparse overlays retained; Science / Books / word-meanings inherit via `ar-001`.
- Egypt Help intentionally inherits `ar-001` (no country Help directory).
- Next stage: independent linguistic auditor + structural/runtime auditor (read-only), then fixes by owner, then final closure + commit/push.
