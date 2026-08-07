# Arabic Country Wave — MAIN/WIRING correction report (F1 + F2)

```text
Arabic Country Wave — MAIN/WIRING correction report

F1 Service Worker =
Root cause = offlineInlineFallbackHtml used loc.startsWith("ar") RTL chrome but hardcoded href="/ar-001/offline" instead of offlineFallbackPath(locale)
Fix = build Arabic inline HTML href from offlineFallbackPath(loc); Arabic UI detection via locale-id /^ar(-|$)/ (does not match es-AR)
Regression coverage = tests/i18n/sw-offline-inline-locale.test.mjs + pwa-runtime-locale Arabic/Argentina cases

ar-EG inline offline link = /eg/offline
ar-SA inline offline link = /sa/offline
ar-MA inline offline link = /ma/offline
ar-DZ inline offline link = /dz/offline
ar-001 inline offline link = /ar-001/offline
Argentina /ar regression = PASS (pathPrefix ar → es-AR; isArabicOfflineUiLocale(es-AR)=false; no /ar-001/offline in es-AR inline HTML)

F2 Teacher grade formatter =
Root cause = GRADE_KEY_TO_EN captured globalBurnDownCopy() values at module import while active locale was still en
Fix = resolve grade_1…grade_6 via globalBurnDownCopy at call time (generic; no per-country branches)
Consumers reviewed =
- components/teacher-portal/TeacherDiscussionQuestionPicker.jsx (formatGradeLevelHe)
- lib/teacher-portal/teacher-activity-report-export-labels.js (formatGradeLevelHe)
- tests/scripts/verify-school-class-activity-matrix.mjs (formatGradeLevelHe)
- other teacher-class-grade exports are key-normalization only (unaffected)
Stale module-init locale capture remaining = 0

en g6 = Grade 6
ar-EG g6 = الصف السادس
ar-SA g6 = الصف السادس
ar-MA g6 = السنة السادسة
ar-DZ g6 = السنة 1 متوسط

Tests run =
- tests/i18n/sw-offline-inline-locale.test.mjs
- tests/i18n/teacher-grade-call-time-locale.test.mjs
- tests/i18n/pwa-runtime-locale.test.mjs
- tests/i18n/ar-001-activity-emails-sw.test.mjs
- tests/i18n/arabic-country-wave-wiring.test.mjs
- docs/reports/_arabic-country-wave-runtime-probes.mjs
Tests passed = all of the above
Tests failed = 0 (focused suite)

Note: tests/teacher-class-grade.test.mjs still has 2 pre-existing failures (hebrew topic bank + geometry shapes_basic pool) unrelated to F1/F2; not modified.

Arabic country runtime probes = PASS
Existing ar-001 regression = PASS (sw offline + grade formatter)
Existing es-AR regression = PASS (/ar → es-AR; not Arabic offline UI)

SHARED WIRING:
BLOCKER = 0
HIGH = 0
MEDIUM = 0
LOW = 0

Country content files modified = 0
API/background agents used = 0

Build run = no
Build type = n/a (small JS-only shared fixes; module import verified via tests)
Build result = n/a

Commit = not created
Push = not performed
Deployment = not performed
```
