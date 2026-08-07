# Morocco Arabic country overlay (ar-MA) — completion report

```text
Country = Morocco
Locale = ar-MA
Base authority = ar-001

Authority sources reviewed =
  - وزارة التربية الوطنية والتعليم الأولي والرياضة — المقرر الوزاري 047.26 (تنظيم السنة الدراسية 2026-2027): uses السنة الأولى…السادسة ابتدائي and المستوى … ابتدائي; مجالس الأقسام
  - قرار وزير التربية الوطنية بشأن النظام المدرسي في التعليم الأولي والابتدائي والثانوي (الجريدة الرسمية / نص منشور): التعليم الابتدائي = 6 سنوات في سلكين (سلك أول سنتان + سلك ثان أربع سنوات)
  - منظومة مسار / Massar (men.gov.ma): تدبير الأقسام؛ بوابة الأساتذة؛ ولي الأمر (Waliye)؛ التلميذ
  - Product constraint: ar-001 already uses مستوى for difficulty/game level → grade labels use السنة to avoid UI collision with difficulty

Files created =
  locales/ar-MA/common.json
  locales/ar-MA/learning.json
  locales/ar-MA/worksheets.json
  locales/ar-MA/school.json
  locales/ar-MA/teacher.json
  locales/ar-MA/seo.json
  locales/ar-MA/ui.json
  locales/ar-MA/validation.json
  content-packs/ar-MA/demo/ui.json
  content-packs/ar-MA/global-burn-down/lib__teacher-portal__teacher-class-grade.json
  content-packs/ar-MA/global-burn-down/lib__teacher-server__teacher-dashboard.server.json
  content-packs/ar-MA/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json
  content-packs/ar-MA/global-burn-down/lib__worksheets__worksheet-ui.json
  content-packs/ar-MA/global-burn-down/lib__site__public-page-seo.json
  content-packs/ar-MA/global-burn-down/burn-down-index.json
  content-packs/ar-MA/reports/burn-down/components__parent-report-detailed-surface.json
  content-packs/ar-MA/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json
  content-packs/ar-MA/reports/burn-down/utils__parent-report-out-of-grade-transparency.json
  content-packs/ar-MA/reports/burn-down/utils__parent-report-output-integrity__row-display-label-context.json
  content-packs/ar-MA/reports/burn-down/lib__parent-ui__parent-report-approved-copy.json
  content-packs/ar-MA/reports/burn-down/utils__parent-report-language__parent-report-display-labels.json
  content-packs/ar-MA/reports/burn-down-index.json
  content-packs/ar-MA/rewards/ui.json
  content-packs/ar-MA/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json
  content-packs/ar-MA/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json
  content-packs/ar-MA/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json
  content-packs/ar-MA/games/burn-down-index.json
  data/help-center/ar-MA/merge-overlays.js
  data/help-center/ar-MA/parents.js
  data/help-center/ar-MA/students.js
  data/help-center/ar-MA/subjects.js
  data/help-center/ar-MA/index.js
  tests/i18n/ar-MA-sparse-contract.test.mjs
  docs/reports/ar-MA-morocco-overlay-completion-2026-08-07.md

Files modified =
  (none pre-existing; all ar-MA paths are new)

Grade mapping =
  grade1 → السنة الأولى
  grade2 → السنة الثانية
  grade3 → السنة الثالثة
  grade4 → السنة الرابعة
  grade5 → السنة الخامسة
  grade6 → السنة السادسة
  (all six remain within التعليم الابتدائي; no mapping into الإعدادي)

Grade bands =
  g12 → السنة 1–2  (matches السلك الأول: السنوات 1–2)
  g34 → السنة 3–4
  g56 → السنة 5–6
  (السلك الثاني covers years 3–6; product bands stay 3–4 / 5–6)

Grade/class-group distinction =
  School year / grade / level → السنة (not صف; not مستوى — reserved for difficulty in product)
  Physical class / section → قسم (MEN: مجالس الأقسام; Massar: تدبير الأقسام)
  فصل / مجموعة not used as the school class-group label in this overlay
  Explicit school portal subtitle: السنة + القسم

Student terminology =
  Inherited from ar-001: تلميذ / طفل (Massar/MEN: تلميذ — no sparse override required)

Teacher terminology =
  Sparse school/SEO labels use أستاذ where locally structural (Massar Moudaris / MEN)
  Broader معلم strings inherited from ar-001 (MSA; understood; avoids dense rewrite)

Parent/guardian terminology =
  Inherited: ولي الأمر (matches Massar Waliye) — no override

School terminology =
  التعليم الابتدائي; السنة; القسم; إدارة الأقسام

Worksheet terminology =
  Inherited: أوراق عمل / تمارين; grade field → السنة

Currency terminology =
  No MAD override (ar-001 “عملة/عملات” = in-game coins, not درهم مغربي)
  Real-currency pricing not present in sparse surface

Multilingual-country wording =
  SEO/help framed as النسخة العربية … بالمغرب / ممارسة … بالعربية
  Explicit help note: not an exclusive representation of all languages in Morocco
  No French / Amazigh / Darija content added

Overrides created =
  114 locale string leaves + 111 content-pack string leaves (grades, قسم, SEO, bands, reports)
  Help sparse overlays for parents/students/subjects grade wording

Heavy content inherited =
  Most of ar-001 locales (auth, legal, emails, games, reports, copilot, platform, …)
  Almost all content-packs/ar-001 (books, burn-down bodies, English learning, rewards catalog, …)
  English-learning question content unchanged / not copied

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Cross-country leakage findings = 0 (no Algeria/Tunisia terms; distinct from ar-DZ السنة N ابتدائي / année moyenne mapping)
Hebrew leakage findings = 0
Forbidden English UI findings = 0

Focused tests run =
  node --test tests/i18n/ar-MA-sparse-contract.test.mjs
Tests passed = 9
Tests failed = 0

BLOCKER = (none)
HIGH = (none)
MEDIUM =
  Shared wiring still required before /ma is live (registry, paths, middleware, selector, help index)
  Teacher label mix: أستاذ (sparse) + inherited معلم — acceptable for sparse wave; optional later densification
LOW =
  Some inherited ar-001 strings still say صف/فصل outside overridden keys until broader sparse expansion
  Grade-aware recommendation templates still largely inherit صف wording from ar-001 (not parent-facing dense copy in this wave)

Shared wiring required =
  locale registry entry ar-MA
  public path /ma
  fallback chain ar-MA → ar-001 → en
  message loader / pack catalog / resolvers
  Help center index wiring for data/help-center/ar-MA
  selector / redirects / middleware (owner/main agent)

ar-001 modified = 0
English SoT modified = 0
Other locales modified = 0
Shared runtime files modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```
