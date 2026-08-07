# Tunisia Arabic country overlay (ar-TN) — completion report

```text
Country = Tunisia
Locale = ar-TN
Base authority = ar-001

Authority sources reviewed =
  - inscription.education.tn (وزارة التربية): «تسجيل تلاميذ الأقسام 2-3-4-5-6 والراسبين بالسنة الأولى» → physical class-group = قسم; student = تلميذ; year = السنة
  - primaire.education.tn / cycleprimaire.education.tn: الترسيم بالسنة الأولى؛ فضاء الولي؛ تلاميذ/تلامذة المرحلة الابتدائية
  - edunet.tn / مناشر وزارة التربية: «السنة الأولى من التعليم الأساسي»؛ «مجالس الأقسام»؛ «مدرسي» / «أستاذ مدارس ابتدائية» ضمن سلك مدرسي التعليم الابتدائي
  - القانون التوجيهي للتربية والتعليم المدرسي + هيكلة التعليم الأساسي: المرحلة الابتدائية = 6 سنوات (ضمن التعليم الأساسي 9 سنوات: 6 ابتدائي + 3 إعدادي)
  - Product constraint: LEO grades 1–6 map entirely inside المرحلة الابتدائية (no Algeria-style moyenne remap)

Files created =
  locales/ar-TN/common.json
  locales/ar-TN/learning.json
  locales/ar-TN/worksheets.json
  locales/ar-TN/school.json
  locales/ar-TN/teacher.json
  locales/ar-TN/seo.json
  locales/ar-TN/ui.json
  locales/ar-TN/validation.json
  locales/ar-TN/platform.json
  locales/ar-TN/copilot.json
  content-packs/ar-TN/demo/ui.json
  content-packs/ar-TN/global-burn-down/lib__teacher-portal__teacher-class-grade.json
  content-packs/ar-TN/global-burn-down/lib__teacher-server__teacher-dashboard.server.json
  content-packs/ar-TN/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json
  content-packs/ar-TN/global-burn-down/lib__worksheets__worksheet-ui.json
  content-packs/ar-TN/global-burn-down/lib__site__public-page-seo.json
  content-packs/ar-TN/global-burn-down/burn-down-index.json
  content-packs/ar-TN/reports/burn-down/components__parent-report-detailed-surface.json
  content-packs/ar-TN/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json
  content-packs/ar-TN/reports/burn-down/utils__parent-report-out-of-grade-transparency.json
  content-packs/ar-TN/reports/burn-down/utils__parent-report-output-integrity__row-display-label-context.json
  content-packs/ar-TN/reports/burn-down/lib__parent-ui__parent-report-approved-copy.json
  content-packs/ar-TN/reports/burn-down/utils__parent-report-language__parent-report-display-labels.json
  content-packs/ar-TN/reports/burn-down/pages__learning__parent-report.json
  content-packs/ar-TN/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json
  content-packs/ar-TN/reports/burn-down-index.json
  content-packs/ar-TN/rewards/ui.json
  content-packs/ar-TN/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json
  content-packs/ar-TN/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json
  content-packs/ar-TN/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json
  content-packs/ar-TN/games/burn-down-index.json
  data/help-center/ar-TN/merge-overlays.js
  data/help-center/ar-TN/parents.js
  data/help-center/ar-TN/students.js
  data/help-center/ar-TN/subjects.js
  data/help-center/ar-TN/index.js
  tests/i18n/ar-TN-sparse-contract.test.mjs
  artifacts/linguistic-audit/gen-ar-TN-overlay.mjs
  docs/reports/ar-TN-tunisia-overlay-completion-2026-08-08.md

Files modified =
  (none pre-existing; all ar-TN paths are new)

Grade mapping =
  grade1 → السنة الأولى
  grade2 → السنة الثانية
  grade3 → السنة الثالثة
  grade4 → السنة الرابعة
  grade5 → السنة الخامسة
  grade6 → السنة السادسة
  (all six remain within المرحلة الابتدائية / years 1–6 of التعليم الأساسي; no mapping into الإعدادي)

Grade bands =
  g12 → السنة 1–2
  g34 → السنة 3–4
  g56 → السنة 5–6

Education-stage wording =
  Short UI: السنة الأولى … السنة السادسة
  Formal/SEO/Help: التعليم الابتدائي / المرحلة الابتدائية بتونس
  Explicit: product covers primary years 1–6 only (not years 7–9 إعدادي)

Grade/year terminology =
  السنة (not صف; not درجة for academic year; مستوى reserved for difficulty)

Physical class-group terminology =
  قسم / أقسام (MoE inscription.education.tn: تلاميذ الأقسام 2–6; circulars: مجالس الأقسام)
  فصل not used as school class-group label in this overlay (فصل in ar-001 school portal → قسم)

Student terminology =
  Inherited from ar-001: تلميذ / طفل (MoE: تلميذ/تلامذة — no sparse override required)

Teacher terminology =
  Sparse school/audit labels keep معلم (MSA; historically Tunisian ranks still include معلم)
  Official cadre also uses مدرّس / أستاذ مدارس ابتدائية — no dense مدرّس/أستاذ rewrite this wave (avoids معلم↔مدرّس mix)

Parent/guardian terminology =
  Inherited: ولي الأمر / أولياء الأمور (matches فضاء الولي / الولي on MoE portals)

School terminology =
  التعليم الابتدائي / المرحلة الابتدائية; السنة; القسم; إدارة الأقسام

Worksheet terminology =
  Inherited: أوراق عمل / تمارين; grade field → السنة

Currency terminology =
  الدينار التونسي (TND) verified; no overlay keys (no local fiat price-display surface requiring change)

Multilingual-country wording =
  SEO/help framed as النسخة العربية … بتونس / ممارسة … بالعربية
  Help note: not an exclusive representation of all languages used in Tunisia
  No French UI / no French fallback added

Harmful inherited terminology corrected =
  صف / درجة (academic year sense) → السنة in learning/UI/worksheets/reports/help
  فصل (physical class group) → قسم in school/teacher/platform/validation/copilot/demo
  grade-aware recommendation templates: صفوف → سنوات

Overrides created =
  139 locale string leaves + content-pack grade/قسم/SEO/bands/report overrides
  Help sparse overlays for parents/students/subjects (سنة + Tunisia multilingual framing)

Heavy content inherited =
  Most of ar-001 locales (auth, legal, emails, games, reports bodies, …)
  Almost all content-packs/ar-001 (books, science bulk, English learning, rewards catalog, …)
  English-learning question content unchanged / not copied

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests =
  node --test tests/i18n/ar-TN-sparse-contract.test.mjs
Tests passed = 11
Tests failed = 0

BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

Shared wiring required =
  yes — MAIN agent only, after Iraq + Jordan + UAE + Tunisia content waves are clean:
  - locale registry entry ar-TN
  - public path /tn
  - fallback chain ar-TN → ar-001 → en
  - message loader / pack catalog / resolvers
  - Help center index wiring for data/help-center/ar-TN
  - selector / redirects / middleware
  Country is NOT product-connected in this wave.

ar-001 modified = 0
English SoT modified = 0
Other locales modified = 0
Shared runtime modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```
