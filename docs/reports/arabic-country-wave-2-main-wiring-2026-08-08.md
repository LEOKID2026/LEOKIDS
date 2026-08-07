# Arabic Country Wave 2 — MAIN WIRING REPORT

Date: 2026-08-08  
Role: MAIN/WIRING  
Commit / push / deployment: **not performed**

```text
Arabic Country Wave 2 — MAIN WIRING REPORT

Locales wired =
- ar-IQ
- ar-JO
- ar-AE
- ar-TN

Paths =
- ar-IQ = /iq
- ar-JO = /jo
- ar-AE = /ae
- ar-TN = /tn

Fallback chains =
ar-IQ → ar-001 → en
ar-JO → ar-001 → en
ar-AE → ar-001 → en
ar-TN → ar-001 → en

Selector count before = 80
Selector count after = 84

Registry = PASS (enabled, selectorVisible, rtl, fallbackLocale=ar-001)
Duplicate locale ids = 0
Duplicate paths = 0
Duplicate labels = 0

Namespace disk↔loader parity:
ar-IQ = PASS (10 namespaces)
ar-JO = PASS (11 namespaces)
ar-AE = PASS (11 namespaces)
ar-TN = PASS (10 namespaces)

Content-pack disk↔catalog parity:
ar-IQ = PASS (9 packs)
ar-JO = PASS (40 packs)
ar-AE = PASS (38 packs)
ar-TN = PASS (21 packs)

Help runtime:
ar-IQ = ar-IQ
ar-JO = ar-JO
ar-AE = ar-AE
ar-TN = ar-TN

RTL = PASS (all four)
Locale persistence = PASS (withLocalePath / stripLocale / buildLocalizedHref / public prefixes)

Iraq runtime = PASS
Jordan runtime = PASS
UAE runtime = PASS
Tunisia runtime = PASS

Iraq grade6 = الصف السادس
Iraq class group = شعبة

Jordan grade6 = الصف السادس
Jordan student role = طالب
Jordan class group = شعبة

UAE grade6 = الصف السادس
UAE class group = الشعبة الصفية / الشعبة
UAE Cycle 1/2 wording = PASS (intro covers Cycle 1 grades 1–4 + part of Cycle 2 grades 5–6; not 1–6 = Cycle 1 alone)

Tunisia grade6 = السنة السادسة
Tunisia grade terminology = السنة
Tunisia class group = قسم

SW map ↔ registry parity = PASS (86 prefixes; mismatches = 0)
ar-IQ offline = /iq/offline
ar-JO offline = /jo/offline
ar-AE offline = /ae/offline
ar-TN offline = /tn/offline
es-AR offline regression = /ar/offline
Arabic Wave 1 offline regression = /eg|/sa|/ma|/dz|/ar-001/offline PASS

Hebrew leakage = 0
Forbidden English UI = 0
Cross-country leakage = 0

Country tests = PASS
Wiring tests = PASS
Runtime probes = PASS (Wave 2 + Wave 1 regression probe)

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

Findings requiring Iraq agent = 0
Findings requiring Jordan agent = 0
Findings requiring UAE agent = 0
Findings requiring Tunisia agent = 0
Findings requiring MAIN/WIRING = 0

Build run = no
Build type = n/a (Node ESM import + tests/probes verified)
Build result = n/a

API/background agents used = 0

Commit = not created
Push = not performed
Deployment = not performed
```

## Shared wiring touched

- `lib/i18n/locale-registry.js` — register ar-IQ/JO/AE/TN
- `lib/i18n/load-messages.js` — disk-parity namespaces
- `lib/content/pack-catalog.js` — disk-parity packs
- `data/help-center/index.js` — sparse Help resolvers
- `lib/seo/public-seo-ar-001-client-index.js` — ar-AE public-seo overlays
- `data/english-questions/word-meanings-locale.js` — Wave 2 meaning chain
- `public/sw.js` — LOCALE_PUBLIC_PATH_PREFIX + cache ids
- `scripts/i18n/wire-arabic-country-wave-2.mjs`
- `docs/reports/_gen-sw-locale-prefix-map.mjs` (regen-safe)
- `docs/reports/_arabic-country-wave-2-runtime-probes.mjs`
- Tests: Wave 2 wiring + selector count updates + AE/JO post-wiring assertions

Ready for independent Linguistic + Structural/Runtime auditors (no commit/push).
