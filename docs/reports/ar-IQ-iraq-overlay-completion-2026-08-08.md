# Iraq (ar-IQ) sparse country overlay — closure report

```text
Country = Iraq
Locale = ar-IQ

Corrections made =
- locales/ar-IQ/common.json: gradeLabel → "{grade}" passthrough (authoritative grade1–6 word forms)
- locales/ar-IQ/learning.json: gradeTitle → "{grade}" passthrough
- locales/ar-IQ/school.json: navClasses / colClasses → شعب
- locales/ar-IQ/copilot.json: boundary.peerComparison في الفصل → في الشعبة
- content-packs/ar-IQ/books/ui.json: grade chrome g1–g6 word forms (sparse; no full book copy)
- content-packs/ar-IQ/books/registry-titles.json: g3 bookTitle digit → الصف الثالث
- content-packs/ar-IQ/books/english-page-skills.json: g3 grammar frame title digit → الصف الثالث
- content-packs/ar-IQ/reports/burn-down/...grade-aware-recommendation-templates.json: leaf digit → word forms
- content-packs/ar-IQ/global-burn-down/burn-down-index.json: remaining physical-class فصل → شعبة
  (school messaging/report VM, teacher class/activity/worksheet pages, student discussion, smoke artifact)
- tests/i18n/ar-IQ-sparse-contract.test.mjs: effective merge scans for digit grades + semantic physical-class فصل

Numeric grade display defects remaining = 0
Physical-class فصل defects remaining = 0
gradeLabel numeric-runtime risk = none
  (overlay gradeLabel/gradeTitle = "{grade}"; authoritative labels are grade1–6 / g1–g6 / grade_1–6.
   Shared runtime callers must pass resolved labels — country content supplies all six.)
Books/UI grade defects remaining = 0

grade1 = الصف الأول
grade2 = الصف الثاني
grade3 = الصف الثالث
grade4 = الصف الرابع
grade5 = الصف الخامس
grade6 = الصف السادس

Grade terminology = الصف
Class-group terminology = شعبة

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests =
node --test tests/i18n/ar-IQ-sparse-contract.test.mjs

Tests passed = 10
Tests failed = 0

Accepted by design =
Product curriculum/grade IDs unchanged; Iraq changes display terminology only.
English classroom-vocab / seasons strings that contain فصل(ول) in non-class-group senses left inherited.
Disconnect verb «فصل ولي الأمر» and science «فصل المخاليط» left inherited.

Shared wiring required =
locale registry entry for ar-IQ
public path /iq (planned)
fallback chain ar-IQ → ar-001 → en
LanguageSwitcher / middleware / message loader registration
Help center locale index wiring for ar-IQ
content-pack catalog registration for ar-IQ
canonical redirects (if any)
Note: Shared wiring is an expected MAIN dependency — not a country-content severity finding.

BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

ar-001 modified = 0
Other locales modified = 0
Shared runtime modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```

Status: Iraq sparse country overlay closed for content findings. Not product-wired.
