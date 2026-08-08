# Arabic Country Wave 3 — Oman Content Closure

Date: 2026-08-08  
Scope: COUNTRY CONTENT ONLY (`ar-OM`) — no wiring / build / commit / push

```text
Arabic Country Wave 3 — Oman Content Closure

Locale = ar-OM
Proposed path = /om
Selector label = عُمان

Registry/path collision = none
  - ar-OM absent from locale-registry
  - pathPrefix "om" unused
  - selector label عُمان unused
  - locales/ar-OM, content-packs/ar-OM, data/help-center/ar-OM were absent before this pass
Fallback intended = ar-OM → ar-001 → en

Grade authority = الصف
Grade1 = الصف الأول
Grade2 = الصف الثاني
Grade3 = الصف الثالث
Grade4 = الصف الرابع
Grade5 = الصف الخامس
Grade6 = الصف السادس
(Formal optional: الصف … الأساسي when التعليم الأساسي context requires it)

Cycle 1 mapping = grades 1–4 = الحلقة الأولى (full)
Cycle 2 mapping = grades 5–6 = جزء من الحلقة الثانية (not full)
Cycle 2 continuation = الحلقة الثانية تمتد رسميًا حتى الصف العاشر
  (التعليم الأساسي = 10 years; LEO 1–6 ≠ single Oman cycle)

Physical class = شعبة / شعب
Student = طالب
Teacher = معلم
Guardian = ولي الأمر

Locale namespaces created/modified =
  locales/ar-OM/common.json
  locales/ar-OM/worksheets.json
  locales/ar-OM/auth.json
  locales/ar-OM/learning.json
  locales/ar-OM/seo.json
  locales/ar-OM/ui.json
  locales/ar-OM/teacher.json
  locales/ar-OM/school.json
  locales/ar-OM/validation.json
  locales/ar-OM/platform.json
  locales/ar-OM/copilot.json

Content packs created/modified =
  content-packs/ar-OM/** (38 JSON overlays)
  including: public-seo/practice/*, public-seo/guides/*, public-seo/marketing/*,
  global-burn-down/*, learning/*, reports/*, rewards/*, games/*, books/*, demo/*

Help files created/modified =
  data/help-center/ar-OM/index.js
  data/help-center/ar-OM/merge-overlays.js
  data/help-center/ar-OM/parents.js
  data/help-center/ar-OM/students.js
  data/help-center/ar-OM/subjects.js
  data/help-center/ar-OM/parent-report.js

Public SEO overlays created/modified =
  content-packs/ar-OM/public-seo/practice/{hub,math,english,reading,science,games}.json
  content-packs/ar-OM/public-seo/guides/{hub-cards,math-practice-at-home,learning-games-at-home}.json
  content-packs/ar-OM/public-seo/marketing/{schools,teachers}.json
  content-packs/ar-OM/global-burn-down/lib__site__public-page-seo.json
  content-packs/ar-OM/global-burn-down/pages___app.json

Academic درجة defects = 0
Physical-class فصل defects = 0
Student-role defects = 0
False Cycle1 claims = 0
False Cycle2 claims = 0
Wrong primary-stage claims = 0
Numeric academic grade defects = 0

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Type mismatches = 0
Placeholder mismatches = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests =
  node --test tests/i18n/ar-OM-content-layer.test.mjs
Tests passed = 11
Tests failed = 0

Post-content MAIN registration required = yes
New namespace registration required = yes (ar-OM → ar-001 → en; pathPrefix om; selector عُمان)
New pack registrations required = yes (pack-catalog + any public-seo client indexes for ar-OM overlays)
New public-seo registrations required = yes
New Help registration required = yes (data/help-center/index.js branches for ar-OM)

BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

Shared runtime files modified = 0
ar-001 modified = 0
Other country locales modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```

## Collision check (step 0)

| Candidate | Status |
|-----------|--------|
| `ar-OM` | free |
| `/om` (`pathPrefix: "om"`) | free |
| `عُمان` | free |

No improvisation required. MAIN must register when wiring.

## Generator / audit artifacts (workspace-only)

- `artifacts/ar-OM-wave3/generate-ar-OM-overlay.mjs`
- `artifacts/ar-OM-wave3/scan-ar-OM-closure.mjs`
- `artifacts/ar-OM-wave3/scan-results.json`
- `tests/i18n/ar-OM-content-layer.test.mjs`

## PASS criteria

All severity buckets = 0; focused content contract = 11/11 pass.
