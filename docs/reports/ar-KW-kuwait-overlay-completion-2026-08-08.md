# Kuwait Arabic country overlay (ar-KW) — content closure

```text
Arabic Country Wave 3 — Kuwait Content Closure

Locale = ar-KW
Proposed path = /kw
Selector label = الكويت

Registry/path collision = no
Fallback intended = ar-KW → ar-001 → en

Grade authority = الصف
Grade1 = الصف الأول
Grade2 = الصف الثاني
Grade3 = الصف الثالث
Grade4 = الصف الرابع
Grade5 = الصف الخامس
Grade6 = الصف السادس

Primary stage = grades 1–5
Grade6 stage = المرحلة المتوسطة

Physical class = فصل / فصول
Student = طالب / طلاب
Teacher = معلم
Guardian = ولي الأمر

Locale namespaces created/modified =
  locales/ar-KW/auth.json
  locales/ar-KW/common.json
  locales/ar-KW/copilot.json
  locales/ar-KW/learning.json
  locales/ar-KW/platform.json
  locales/ar-KW/school.json
  locales/ar-KW/seo.json
  locales/ar-KW/teacher.json
  locales/ar-KW/ui.json
  locales/ar-KW/worksheets.json

Content packs created/modified =
  content-packs/ar-KW/** (41 JSON overlays: books, demo, games, global-burn-down,
  learning, public-seo practice/guides/marketing/legal, reports, rewards)

Help files created/modified =
  data/help-center/ar-KW/index.js
  data/help-center/ar-KW/merge-overlays.js
  data/help-center/ar-KW/parents.js
  data/help-center/ar-KW/students.js
  data/help-center/ar-KW/subjects.js
  data/help-center/ar-KW/parent-report.js

Public SEO overlays created/modified =
  practice: math, geometry, english, science, reading, games, hub, no-print
  guides: hub-cards, learning-games-at-home, math-practice-at-home
  marketing: schools, teachers
  legal: unified

Academic درجة defects = 0
Numeric academic grade defects = 0
Wrong Kuwait primary-stage claims = 0
Physical-class terminology defects = 0
Student-role defects = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Type mismatches = 0
Placeholder mismatches = 0

Focused tests =
  node --test tests/i18n/ar-KW-sparse-contract.test.mjs
Tests passed = 6
Tests failed = 0

Post-content MAIN registration required = yes
New namespace registration required = yes
  - lib/i18n/locale-registry.js: ar-KW, pathPrefix "kw", label الكويت,
    fallbackLocale ar-001, selectorVisible, direction rtl
New pack registrations required = yes
  - lib/content/pack-catalog.js entries for content-packs/ar-KW/**
New public-seo registrations required = yes
  - lib/seo/public-seo-ar-001-client-index.js (or generate script discovery)
New Help registration required = yes
  - data/help-center/index.js: BY_SECTION_AR_KW / SECTIONS_AR_KW / resolveHelpLocale

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

## Notes

- Collision check: no `ar-KW`, no `pathPrefix: "kw"`, no selector `الكويت` owner in registry.
- Sparse overlays only where ar-001 inheritance is wrong for Kuwait (digit grades, تلميذ, academic درجة, false 1–6=primary stage claims, semesterish الفصل الدراسي as class group).
- Physical class remains فصل (unlike UAE شعبة / Maghreb قسم).
- Formal About + Help welcome state: grades 1–5 = المرحلة الابتدائية; grade 6 = بداية المرحلة المتوسطة.
- Generator / scan artifacts: `artifacts/ar-KW-wave3/`.
