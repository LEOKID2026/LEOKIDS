# Arabic Country Wave 3 — Bahrain Content Closure — 2026-08-08

```text
Arabic Country Wave 3 — Bahrain Content Closure

Locale = ar-BH
Proposed path = /bh
Selector label = البحرين

Registry/path collision = no
Fallback intended = ar-BH → ar-001 → en

Grade authority = الصف
Grade1 = الصف الأول
Grade2 = الصف الثاني
Grade3 = الصف الثالث
Grade4 = الصف الرابع
Grade5 = الصف الخامس
Grade6 = الصف السادس

Basic education mapping = التعليم الأساسي = grades 1–9
Cycle 1 mapping = الحلقة الأولى = grades 1–3
Grades 4–6 relationship = جزء من الحلقات الثانية والثالثة (4–9); not Cycle 1
Grade6 primary terminology = allowed (الصف السادس الابتدائي) when formal primary context requires it

Physical class authority = صف دراسي / صفوف دراسية (context-natural صف OK)
Student = طالب / طلبة / طلاب
Teacher = معلم
Guardian = ولي الأمر

Locale namespaces created/modified =
  locales/ar-BH/{auth,common,copilot,learning,platform,reports,school,seo,teacher,ui,validation,worksheets}.json

Content packs created/modified =
  content-packs/ar-BH/** (62 JSON overlays: public-seo, global-burn-down, learning, games, books, demo, rewards, reports)

Help files created/modified =
  data/help-center/ar-BH/{index,merge-overlays,parents,students,subjects,parent-report}.js

Public SEO overlays created/modified =
  practice/{hub,math,geometry,english,science,reading,games,no-print}
  guides/{hub-cards,math-practice-at-home,learning-games-at-home}
  marketing/{schools,teachers}
  legal/unified

Academic درجة defects = 0
Numeric academic grade defects = 0
Physical-class terminology defects = 0
Student-role تلميذ defects = 0 (product UI; English cloze example kept as learning content)
False basic-education claims = 0
False Cycle1 claims = 0
Stage-mapping defects = 0

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Type mismatches = 0
Placeholder mismatches = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests = tests/i18n/ar-BH-sparse-contract.test.mjs
Tests passed = 9
Tests failed = 0

Post-content MAIN registration required = yes
New namespace registration required = yes
  - lib/i18n/locale-registry.js: ar-BH, fallbackLocale ar-001, pathPrefix bh, native/selector البحرين
New pack registrations required = yes
  - lib/content/pack-catalog.js (and any burn-down / public-seo discovery) for content-packs/ar-BH/**
New public-seo registrations required = yes
  - public-seo client index / generate-public-seo pipeline for ar-BH overlays
New Help registration required = yes
  - data/help-center/index.js: BY_SECTION_AR_BH / ALL_ARTICLES_AR_BH / SECTIONS_AR_BH + resolveHelpLocale ar-bh → ar-BH

BLOCKER = 0
HIGH = 0
MEDIUM = 0
LOW = 0

Shared runtime files modified = 0
ar-001 modified = 0
Other country locales modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```

## Notes for MAIN

- Collision check confirmed: `ar-BH`, `/bh`, and selector identity `البحرين` are free in registry, path prefixes, locale folders, content-packs, Help, and public SEO registrations.
- Do not invent an alternate locale/path.
- Content is sparse overlay on `ar-001`; mathematical `÷ شعبة` in master learning remains inherited (division label, not classroom).
- Season titles (`الفصول` = seasons) intentionally not overlaid.
