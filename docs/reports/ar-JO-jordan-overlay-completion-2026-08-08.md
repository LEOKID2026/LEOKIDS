# Jordan Arabic country overlay (ar-JO) — closure report

```text
Country = Jordan
Locale = ar-JO

Corrections made =
  - locales/ar-JO/copilot.json: boundary.peerComparison الفصل → الشعبة
  - Dense sparse global-burn-down fragments: TeacherDashboardClient, school portal,
    teacher pages/activities/worksheets, product-context, discussion picker,
    worksheet report, student activity, pages___app — تلميذ→طالب, فصل→شعبة
  - content-packs/ar-JO/learning/burn-down/utils__topic-next-step-engine.json:
    academic درجة → صف
  - Full grade-aware recommendation templates: صفوف 1-2 / الصف N →
    الصف الأول–الثاني / الثالث–الرابع / الخامس–السادس (and natural morphology)
  - Rebuilt burn-down-index.json for global-burn-down / reports / games / learning
  - tests/i18n/ar-JO-sparse-contract.test.mjs: effective resolved-copy regressions;
    fixed CROSS_COUNTRY false positive (قطر ⊂ القطرية)

Inherited physical-class فصل findings remaining = 0
Inherited school-role تلميذ findings remaining = 0
Inherited academic درجة findings remaining = 0
Recommendation digit-grade findings remaining = 0

Grade terminology = الصف
Class-group terminology = الشعبة
Student terminology = طالب / طلاب
Teacher terminology = معلم

Short grade register = الصف الأول … الصف السادس
Formal grade register = الصف الأول الأساسي … الصف السادس الأساسي
Dual register status = accepted and intentional

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests =
  node --test tests/i18n/ar-JO-sparse-contract.test.mjs
Tests passed = 7
Tests failed = 0

Accepted by design =
  Dual short/formal grade register (UI short vs Help/About أساسي)
  Score/angle/temperature درجة remains inherited (e.g. درجة الذروة, 90 درجة, درجة واحدة)
  disconnect فصل ولي الأمر unchanged
  English-learning fill-in worksheet sentence with تلاميذ left inherited
  No claim that التعليم الأساسي = grades 1–6 only
  Product scope remains grade1–6 display only

Shared wiring required =
  locale registry ar-JO
  public path /jo
  fallback ar-JO → ar-001 → en
  message loader / pack catalog / resolvers
  Help center index wiring for data/help-center/ar-JO
  selector / redirects / middleware

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
