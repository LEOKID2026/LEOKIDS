# Morocco ar-MA terminology closure — 2026-08-07

```text
Country = Morocco
Locale = ar-MA

Corrections made =
  - Removed أستاذ mix: school/SEO overlays now use معلم (or inherit للمعلّمين); dropped identical teacher_portal override
  - Completed teacher class-group overrides: classGuidanceSeverityTier, classHealth, actionTypes.class_reteach → قسم
  - Added grade-aware recommendation templates overlay (31 keys): صف/صفوف → سنة/سنوات
  - Added pages__learning__parent-report grade → السنة + burn-down-index entries
  - learning howToLearnSteps (math/geometry): درجة → السنة
  - ui.public.about + seoNav: صف → سنة
  - Expanded regression test for السنة / قسم / مستوى + no أستاذ in overlays

Inherited terminology reviewed =
  - معلم: MSA natural and correct in Moroccan UI; Massar also uses أستاذ in admin portals, but معلم is not a defect — kept inheritance; closed MEDIUM
  - رقم الصف أو العمود / اختر صفًا أو عمودًا: table row, not school year — keep ar-001 inheritance
  - confirmDisconnectParent «فصل ولي الأمر»: verb “disconnect”, not class-group — keep inheritance
  - coloringUploadPhaseSegment «فصل الموضوع»: verb “separate”, not class-group — keep inheritance
  - reports row-diagnostics «لهذا الصف / مدخلات الصف»: table row, not school year — keep inheritance (outside grade meaning)
  - Help parent-report «المعلم»: acceptable inherited teacher term — no override

Grade terminology defects remaining = 0
Class-group terminology defects remaining = 0
Teacher terminology defects remaining = 0

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests = node --test tests/i18n/ar-MA-sparse-contract.test.mjs
Tests passed = 10
Tests failed = 0

BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

Shared wiring required = yes

ar-001 modified = 0
Other locales modified = 0
Shared runtime modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```
