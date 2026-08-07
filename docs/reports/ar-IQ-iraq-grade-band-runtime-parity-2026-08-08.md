# Arabic Country Wave 2 — Iraq Grade-Band Runtime Parity

```text
Arabic Country Wave 2 — Iraq Grade-Band Runtime Parity

New ar-IQ public-seo paths detected = 5
New ar-IQ public-seo paths registered = 5

Pack catalog parity:
ar-IQ = PASS (missing=0 stale=0; disk=21 catalog=21)
ar-JO = PASS
ar-AE = PASS
ar-TN = PASS

ar-IQ public-seo disk count = 10
ar-IQ public-seo runtime index count = 10
Public SEO missing registrations = 0
Public SEO stale registrations = 0

Math bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
English bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
Reading bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
Geometry bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
Science bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
Games bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
No-print bands runtime = الصفان الأول والثاني | الصفان الثالث والرابع | الصفان الخامس والسادس
Hub range runtime = word-form (للصفوف الأول… / الأول–السادس); no للصفوف 1–6

Numeric academic grade-band runtime defects = 0
Academic درجة runtime defects = 0

Math howToLearn runtime = اختر الصف والصعوبة والعملية…
Geometry howToLearn runtime = اختر الصف والصعوبة والموضوع…
Copilot runtime = …فوق الصف المذكور.
Learning topic-next-step runtime = الانتقال إلى صف أعلى — نفس الموضوع فقط

Selector = 84
Routes = /iq /jo /ae /tn
Fallbacks = country → ar-001 → en
RTL = PASS
SW parity = PASS (ar-IQ→/iq/offline … es-AR→/ar/offline)

Runtime probe updated = YES
Runtime probe result = PASS

Country tests = PASS
Wiring tests = PASS
Public SEO tests = PASS
Pack parity tests = PASS

COUNTRY CONTENT findings:
BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

SHARED WIRING findings:
BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

Country content files modified = 0
ar-001 modified = 0
Other country locales modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```

## Shared wiring touched

- `lib/content/pack-catalog.js` — register 5 new ar-IQ public-seo practice packs
- `lib/seo/public-seo-ar-001-client-index.js` — register same 5 overlays in AR_IQ_PUBLIC_SEO
- `docs/reports/_arabic-country-wave-2-runtime-probes.mjs` — word-form bands + numeric residual checks
- `tests/i18n/arabic-country-wave-2-wiring.test.mjs` — runtime grade-band assertions for ar-IQ
