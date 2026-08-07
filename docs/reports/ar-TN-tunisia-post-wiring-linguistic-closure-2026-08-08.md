# Tunisia (ar-TN) post-wiring linguistic closure — 2026-08-08

```text
Tunisia Post-Wiring Linguistic Closure

Known Practice finding =
  Public Practice math H1 inherited academic الصف from ar-001 public-seo

Observed before =
  ممارسة الرياضيات حسب الصف والموضوع

Effective after =
  ممارسة الرياضيات حسب السنة والموضوع
  (overlay on disk + deep-merge verified in focused tests;
   live runtime still needs MAIN public-seo client-index + pack-catalog registration)

Academic صف findings reviewed =
  public-seo practice/* (math, geometry, english, hub, hub-cards, games, science,
  reading, no-print, parent-reports, worksheets)
  public-seo guides (math-practice-at-home, math-games-for-kids, no-print-worksheets,
  reading-practice-at-home, english-vocabulary-practice, hub-cards)
  public-seo marketing/schools (صفوف class-group → أقسام)
  public-seo legal/unified (academic صف → السنة; classroom فصول → أقسام)
  learning ParentCurriculumContent (topics_by_grade / six_grades / per_grade)
  existing locales/ar-TN + prior content-packs (already السنة/قسم)

Academic صف findings remaining = 0
  (on overlaid Practice/Guides/Schools/legal surfaces after ar-001←ar-TN merge)

Academic درجة findings remaining = 0
  (academic grade/year sense closed; score sense kept e.g. الدرجة المنخفضة in
  parent-progress-tracking — intentionally not overlaid)

Physical-class فصل findings remaining = 0
  (schools marketing + legal classroom sense → قسم/أقسام; prior school portal already قسم)

Files created =
  content-packs/ar-TN/public-seo/practice/math.json
  content-packs/ar-TN/public-seo/practice/geometry.json
  content-packs/ar-TN/public-seo/practice/english.json
  content-packs/ar-TN/public-seo/practice/hub.json
  content-packs/ar-TN/public-seo/practice/hub-cards.json
  content-packs/ar-TN/public-seo/practice/games.json
  content-packs/ar-TN/public-seo/practice/science.json
  content-packs/ar-TN/public-seo/practice/reading.json
  content-packs/ar-TN/public-seo/practice/no-print.json
  content-packs/ar-TN/public-seo/practice/parent-reports.json
  content-packs/ar-TN/public-seo/practice/worksheets.json
  content-packs/ar-TN/public-seo/guides/math-practice-at-home.json
  content-packs/ar-TN/public-seo/guides/math-games-for-kids.json
  content-packs/ar-TN/public-seo/guides/no-print-worksheets.json
  content-packs/ar-TN/public-seo/guides/reading-practice-at-home.json
  content-packs/ar-TN/public-seo/guides/english-vocabulary-practice.json
  content-packs/ar-TN/public-seo/guides/hub-cards.json
  content-packs/ar-TN/public-seo/marketing/schools.json
  content-packs/ar-TN/public-seo/legal/unified.json
  content-packs/ar-TN/learning/burn-down/components__parent__ParentCurriculumContent.json
  content-packs/ar-TN/learning/burn-down-index.json
  artifacts/linguistic-audit/gen-ar-TN-public-seo-closure.mjs
  docs/reports/ar-TN-tunisia-post-wiring-linguistic-closure-2026-08-08.md

Files modified =
  tests/i18n/ar-TN-sparse-contract.test.mjs

New namespace files created =
  (none — no new locales/ar-TN/*.json)

New content-pack files created =
  content-packs/ar-TN/public-seo/** (19 JSON overlays)
  content-packs/ar-TN/learning/burn-down/**
  content-packs/ar-TN/learning/burn-down-index.json

Post-wiring registration required =
  yes
  MAIN must register ar-TN public-seo overlays in:
    - lib/seo/public-seo-ar-001-client-index.js (or regenerate via scripts/i18n/generate-public-seo-ar-001.mjs if that script now discovers country overlays)
    - lib/content/pack-catalog.js entries for each new public-seo/* and learning/burn-down* path
  Until then, getPracticePageContentForLocale("ar-TN") still resolves ar-001 H1 with الصف.

Grade terminology =
  السنة (UI + Practice/SEO)

Physical class terminology =
  قسم / أقسام

Hebrew leakage = 0
Forbidden English UI = 0
Cross-country leakage = 0

Focused tests =
  node --test tests/i18n/ar-TN-sparse-contract.test.mjs
Tests passed = 14
Tests failed = 0

BLOCKER = none
HIGH = none
MEDIUM = none
LOW = none

ar-001 modified = 0
Other country locales modified = 0
Shared runtime modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```
