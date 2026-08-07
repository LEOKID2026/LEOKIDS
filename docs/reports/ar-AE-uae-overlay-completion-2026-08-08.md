```text
Country = United Arab Emirates
Locale = ar-AE
Base authority = ar-001

Authority sources reviewed =
- UAE MoE Terminologies / glossary (moe.gov.ae): الحلقة الأولى = grades 1–4; الحلقة الثانية = grades 5–8; التعليم الأساسي
- UAE Government / TIMSS education stages: Cycle 1 (1–4), Cycle 2 (5–8), Cycle 3 (9–12)
- UAE MoE SIS / Al Manhal + ADEK student-admin policy: طالب / معلم / ولي الأمر; physical class group الشعبة الصفية
- Product constraint: LEO grades 1–6 only → spans الحلقة الأولى fully + part of الحلقة الثانية (5–6), not full cycle 2 through 8

Existing UAE locale/path discovered =
none in lib/i18n/locale-registry.js (no ar-AE, no en-AE, no pathPrefix "ae").
No /ae collision found in scoped registry scan.
Public path decision deferred to MAIN agent (multilingual-country policy).

Files created =
locales/ar-AE/auth.json
locales/ar-AE/common.json
locales/ar-AE/copilot.json
locales/ar-AE/learning.json
locales/ar-AE/platform.json
locales/ar-AE/school.json
locales/ar-AE/seo.json
locales/ar-AE/teacher.json
locales/ar-AE/ui.json
locales/ar-AE/validation.json
locales/ar-AE/worksheets.json
content-packs/ar-AE/** (34 sparse JSON overlays: books, demo, games, global-burn-down, learning, public-seo, reports, rewards)
data/help-center/ar-AE/index.js
data/help-center/ar-AE/merge-overlays.js
data/help-center/ar-AE/parents.js
data/help-center/ar-AE/students.js
data/help-center/ar-AE/subjects.js
data/help-center/ar-AE/parent-report.js
tests/i18n/ar-AE-content-layer.test.mjs
docs/reports/ar-AE-uae-overlay-completion-2026-08-08.md
artifacts/ar-AE-wave2/generate-ar-AE-overlay.mjs
artifacts/ar-AE-wave2/fix-ar-AE-terminology.mjs

Files modified =
none outside ar-AE scope (no shared wiring / ar-001 / other locales)

Grade mapping =
grade1 → الصف الأول
grade2 → الصف الثاني
grade3 → الصف الثالث
grade4 → الصف الرابع
grade5 → الصف الخامس
grade6 → الصف السادس

Education-stage mapping =
Official UAE: التعليم الأساسي spans الحلقة الأولى (1–4) + الحلقة الثانية (5–8).
LEO product grades 1–6 cross both cycles.

grade1–4 stage =
الحلقة الأولى

grade5–6 stage treatment =
جزء من الحلقة الثانية (explicitly noted that الحلقة الثانية continues to الصف الثامن).
Product bands g12/g34/g56 remain display-only الصف الأول–الثاني / الثالث–الرابع / الخامس–السادس — not labeled as full official cycles.

Grade terminology =
الصف (academic year/grade). Digit forms الصف 1–6 overridden. Academic درجة defects corrected to الصف on overlay surfaces.

Class-group terminology =
الشعبة الصفية (canonical label / choosePhysicalClass)
الشعبة (short column / report / transfer labels)
الشعب (plural lists)
NOT الفصل / الفصل الدراسي for physical class group

Student terminology =
طالب / الطلاب / الطالب (school role). Parent-facing طفل retained where inherited context is parent UI.

Teacher terminology =
معلم / المعلّم (matches ar-001 + UAE SIS). No identical noop override of unchanged teacher chrome beyond physical-class and طالب surfaces.

Parent/guardian terminology =
ولي الأمر / أولياء الأمور (inherited + Help section shell). No dialectal change required.

School terminology =
المدرسة / مدير المدرسة / إدارة المدرسة (inherited)
الشعبة الصفية / الصف / المادة
Teacher assignment + class reports + invite/validation/audit use شعبة where physical class group was فصل in ar-001

Worksheet terminology =
ورقة عمل inherited from ar-001 (no UAE-specific rename). Grade chrome الصف الأول–السادس.

Currency terminology =
No real-money AED UI found in ar-001 money surfaces → no الدرهم الإماراتي / AED override.
In-game workة/coins remain game economy (inherited).

Multilingual-country wording =
SEO: "النسخة العربية لدولة الإمارات العربية المتحدة"
No claim that Arabic is the only language of the UAE.
No English UAE country content inside ar-AE.
No fallback to a UAE English locale.

Harmful inheritance corrected =
- Digit grade labels الصف 1–6 → الصف الأول–السادس
- Academic درجة → الصف on learning/how-to / geometry errors / copilot evidence / SEO / Help subjects
- Physical class فصل / الفصل الدراسي (misused as class group) → الشعبة الصفية / الشعبة
- تلميذ → طالب on student auth/UI/Help/platform audit surfaces in overlay
- Latin Copilot → مساعد الطيار
- Country SEO/about → دولة الإمارات العربية المتحدة + التعليم الأساسي cycle wording

Overrides created =
Sparse locale namespaces (11 JSON) + sparse content-packs (34) + Help overlays (6 modules). Heavy banks/taxonomy/word-meanings not copied.

Heavy content inherited =
learning taxonomy, question banks, English meanings, most reports/games copy, legal, emails, games.json locale file, reports.json locale file — via ar-001 fallback (not wired yet).

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Cross-country leakage = 0
Hebrew leakage = 0
Forbidden English UI = 0

Focused tests =
node --test tests/i18n/ar-AE-content-layer.test.mjs

Tests passed = 9
Tests failed = 0

BLOCKER = none
HIGH = none
MEDIUM =
Shared wiring required before product exposure (registry, selector, public path collision check for multilingual UAE, load-messages, pack catalog, Help index, SW if applicable).
LOW =
reading/public SEO still uses some inherited "المرحلة الابتدائية" phrasing in non-overridden ar-001 surfaces; overlay h1 uses التعليم الأساسي. Acceptable until MAIN wiring + broader SEO pass.

Shared wiring required =
yes — locale registry entry (fallback ar-AE → ar-001 → en), public path decision (do NOT assume /ae), selector, load-messages, pack catalog, Help global index, any SW locale map.
Existing UAE locale/path discovered = none

ar-001 modified = 0
English SoT modified = 0
Other locales modified = 0
Shared runtime modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```
