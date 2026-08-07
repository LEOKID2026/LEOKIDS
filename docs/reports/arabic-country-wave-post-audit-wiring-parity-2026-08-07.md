# Arabic Country Wave — Post-Audit Wiring Parity Report

Date: 2026-08-07  
Role: MAIN/WIRING agent  
Scope: disk ↔ wiring ↔ runtime reconciliation after Independent Linguistic Audit overlays  
Commit / push / deployment: **not performed**

---

```text
Arabic Country Wave — Post-Audit Wiring Parity Report

Locales checked =
- ar-EG
- ar-SA
- ar-MA
- ar-DZ

Locale namespace disk↔loader parity =
ar-EG = PASS (common, copilot, learning, school, seo, worksheets)
ar-SA = PASS (auth, common, copilot, learning, platform, school, seo, teacher, ui, worksheets)
ar-MA = PASS (common, copilot, learning, platform, school, seo, teacher, ui, validation, worksheets)
ar-DZ = PASS (auth, common, copilot, learning, legal, platform, reports, school, seo, teacher, ui, validation, worksheets)

New namespace registrations required =
ar-EG: copilot
ar-SA: school
ar-MA: copilot, platform
ar-DZ: auth, copilot, legal, platform, reports

New namespace registrations added =
ar-EG: copilot
ar-SA: school
ar-MA: copilot, platform
ar-DZ: auth, copilot, legal, platform, reports

Help runtime:
ar-EG resolveHelpLocale = ar-EG
ar-SA resolveHelpLocale = ar-SA
ar-MA resolveHelpLocale = ar-MA
ar-DZ resolveHelpLocale = ar-DZ

Egypt Help sparse merge verified = PASS (ar-EG overlays → ar-001 → en; no full Help copy)
Egypt Help audit fixes effective = PASS
  subjects math/geometry/english/science → الصف (not اختر الدرجة)
  parents edit-or-delete-student.summary → الصف (not الدرجة)

Content-pack disk↔catalog parity = PASS (all four)
Missing catalog entries = 0
Stale catalog entries = 0

Effective audit corrections:

Egypt =
  learning.math.howToLearnSteps.step1 → الصف
  learning.geometry.howToLearnSteps.step1 → الصف
  learning.geometry.errors.noTopics → صف آخر
  copilot above-grade → الصف المذكور
  Help subjects ×4 → الصف
  Help parent edit/delete → الصف

Saudi =
  learning.master.gradeRequired → صفك
  school.portal.classesSubtitle → الصف والفصل والمادة
  copilot rebuild chrome → مساعد الطيار

Morocco =
  school class labels → قسم / السنة
  platform audit actions → القسم
  validation.api.physical_class_not_found → قسم
  Copilot peerComparison → القسم
  Copilot grade copy → السنة
  Help subjects → السنة + مستوى

Algeria =
  grade/year → السنة
  teacher role → أستاذ
  physical class group → قسم
  auth / platform / copilot / school surfaces effective

ar-DZ grade6 = السنة 1 متوسط
Invalid السنة 6 = 0

F1 regression = PASS
  ar-EG → /eg/offline
  ar-SA → /sa/offline
  ar-MA → /ma/offline
  ar-DZ → /dz/offline
  ar-001 → /ar-001/offline
  es-AR remains /ar/offline

F2 regression = PASS
  en g6 = Grade 6
  ar-EG g6 = الصف السادس
  ar-SA g6 = الصف السادس
  ar-MA g6 = السنة السادسة
  ar-DZ g6 = السنة 1 متوسط
  (call-time locale via bindGlobalBurnDownLocale / formatGradeLevelHe)

Argentina /ar regression = PASS
ar-001 regression = PASS (not modified; still Help + grade authority)

Tests run =
  tests/i18n/ar-EG-content-layer.test.mjs
  tests/i18n/ar-SA-content-layer.test.mjs
  tests/i18n/ar-MA-sparse-contract.test.mjs
  tests/i18n/ar-DZ-sparse-contract.test.mjs
  tests/i18n/arabic-country-wave-wiring.test.mjs
  tests/i18n/message-loader.test.mjs
  tests/i18n/arabic-master-wiring.test.mjs
  tests/i18n/pwa-runtime-locale.test.mjs
  tests/i18n/sw-offline-inline-locale.test.mjs
  tests/i18n/teacher-grade-call-time-locale.test.mjs
  docs/reports/_arabic-country-wave-runtime-probes.mjs

Tests passed = all of the above (67 + 21 + probes PASS)
Tests failed = 0

Runtime probes = docs/reports/_arabic-country-wave-runtime-probes.mjs → arabic-country-wave-runtime-probes.json
Selector count = 80

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
ar-001 modified = 0
Other locales modified = 0
API/background agents used = 0

Build run = no
Build type = n/a (Node ESM import of new locale JSON + Help modules verified via tests/probes)
Build result = n/a

Commit = not created
Push = not performed
Deployment = not performed
```

---

## Wiring changes (shared only)

1. **`lib/i18n/load-messages.js`** — registered post-audit namespaces for all four countries (import + `LOCALE_BUNDLES`).
2. **`data/help-center/index.js`** — wired `ar-EG` Help sparse layer like SA/MA/DZ; `resolveHelpLocale("ar-EG")` → `ar-EG`.
3. **`tests/i18n/arabic-country-wave-wiring.test.mjs`** — Egypt Help expectation + disk↔loader leaf parity + Egypt Help effective merge.
4. **`docs/reports/_arabic-country-wave-runtime-probes.mjs`** — post-audit probes (Help ar-EG, namespace/catalog parity, audit-closure keys, F1/F2).

No country content rewrite. No `ar-001` edits. No commit/push.
