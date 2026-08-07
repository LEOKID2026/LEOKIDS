# Arabic Country Wave — F1-R1 Closure

Date: 2026-08-08  
Role: MAIN/WIRING  
Finding: F1-R1 (SHARED WIRING / MEDIUM)  
Commit / push / deployment: **not performed**

---

```text
Arabic Country Wave — F1-R1 Closure

Finding = F1-R1
Root cause =
  offlineFallbackPath() used raw localeId as the URL segment
  (`/${loc}/offline`) after a few Arabic special-cases.
  For es-AR (and most country locales) localeId ≠ public pathPrefix,
  so Argentina became /es-AR/offline instead of /ar/offline.
  Prior probe asserted withLocalePath only → false PASS.

offlineFallbackPath implementation before =
  hard-coded Arabic if-branches + fallback `/${loc}/offline`

offlineFallbackPath implementation after =
  LOCALE_PUBLIC_PATH_PREFIX map (mirrors locale-registry pathPrefix)
  + `/${prefix}/offline` with en → /offline

es-AR = /ar/offline
ar-EG = /eg/offline
ar-SA = /sa/offline
ar-MA = /ma/offline
ar-DZ = /dz/offline
ar-001 = /ar-001/offline

Argentina Arabic-UI detection = false (isArabicOfflineUiLocale)
Argentina /ar routing regression = PASS

Arabic original F1 regression = PASS
F2 regression = PASS (unchanged; probes still green)

SW helper tested directly = yes
Old withLocalePath-only blind spot removed = yes

Tests run =
  tests/i18n/sw-offline-inline-locale.test.mjs
  tests/i18n/pwa-runtime-locale.test.mjs
  tests/i18n/ar-001-activity-emails-sw.test.mjs
  tests/i18n/arabic-country-wave-wiring.test.mjs
  docs/reports/_arabic-country-wave-runtime-probes.mjs

Tests passed = all
Tests failed = 0

Runtime probe = PASS
Probe now evaluates actual SW path logic = yes

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

Country content files modified = 0
ar-001 content modified = 0
API/background agents used = 0

Build = not final / not run
Commit = not created
Push = not performed
Deployment = not performed
```

## Files touched

- `public/sw.js` — `LOCALE_PUBLIC_PATH_PREFIX` + generic `offlineFallbackPath`
- `tests/i18n/sw-offline-inline-locale.test.mjs` — evaluates SW helpers; es-AR + registry parity
- `docs/reports/_arabic-country-wave-runtime-probes.mjs` — eval real SW helper
- `docs/reports/_gen-sw-locale-prefix-map.mjs` — regenerate map from registry when locales change
