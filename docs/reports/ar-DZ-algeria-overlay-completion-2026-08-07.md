# Algeria (ar-DZ) sparse country overlay — completion report

```text
Country = Algeria
Locale = ar-DZ
Base authority = ar-001

Authority sources reviewed =
- Loi n° 08-04 du 23 janvier 2008 (loi d’orientation sur l’éducation nationale) via UNESCO Observatory — primary = 5 years; middle (متوسط) = 4 years
- Nuffic: Primary and secondary education (Algeria) — التعليم الابتدائي 5 years; التعليم المتوسط follows
- Algerian curriculum/practice sources using السنة الأولى…الخامسة ابتدائي and السنة الأولى متوسط (1AM), e.g. education materials / dzostad / dzetude patterns
- Algerian school legislation terminology: تلميذ، أستاذ، قسم، فوج (subgroup), ولي الأمر
- Currency: الدينار الجزائري (ISO DZD; common symbol د.ج) — no product price-display keys required override

Files created =
locales/ar-DZ/common.json
locales/ar-DZ/seo.json
locales/ar-DZ/learning.json
locales/ar-DZ/worksheets.json
locales/ar-DZ/validation.json
locales/ar-DZ/school.json
locales/ar-DZ/teacher.json
locales/ar-DZ/ui.json
content-packs/ar-DZ/demo/ui.json
content-packs/ar-DZ/global-burn-down/burn-down-index.json
content-packs/ar-DZ/games/burn-down-index.json
content-packs/ar-DZ/reports/burn-down-index.json
content-packs/ar-DZ/reports/burn-down/components__parent-report-detailed-surface.json
content-packs/ar-DZ/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json
content-packs/ar-DZ/reports/burn-down/utils__parent-report-out-of-grade-transparency.json
data/help-center/ar-DZ/merge-overlays.js
data/help-center/ar-DZ/index.js
data/help-center/ar-DZ/parents.js
data/help-center/ar-DZ/students.js
data/help-center/ar-DZ/subjects.js
tests/i18n/ar-DZ-sparse-contract.test.mjs
docs/reports/ar-DZ-algeria-overlay-completion-2026-08-07.md

Files modified =
(none outside Algeria overlay + its focused test + this report)

Grade mapping =
grade1 → السنة 1 ابتدائي
grade2 → السنة 2 ابتدائي
grade3 → السنة 3 ابتدائي
grade4 → السنة 4 ابتدائي
grade5 → السنة 5 ابتدائي
grade6 → السنة 1 متوسط
Note: Algerian primary is 5 years only. Product still has six levels; grade6 is display-mapped to the first year of التعليم المتوسط (1AM). No extra product grades added.

Grade bands =
1–2 → السنة 1–2 ابتدائي
3–4 → السنة 3–4 ابتدائي
5–6 → السنة 5 ابتدائي–1 متوسط

Grade/class-group distinction =
Grade terminology = السنة (school year / level within ابتدائي or متوسط)
Class-group terminology = قسم (actual class section)
Reason for distinction =
In Algerian school administration, السنة marks the curricular year (e.g. السنة 3 ابتدائي) while قسم is the concrete teaching group/section. Using صف or فصل for both creates ambiguity; فوج is reserved for internal subgroups inside a قسم and was not used for either product concept.

Student terminology =
Official school term = تلميذ / تلاميذ. Product child-profile voice (طفل/أطفال) largely inherited from ar-001 by design; Help students section already uses تلميذ in Master.

Teacher terminology =
الأستاذ (Algerian cadre term for primary/middle teachers). Sparse overrides on school role/invite/create labels; remaining معلّم strings inherit from ar-001 where not overridden.

Parent/guardian terminology =
ولي الأمر / أولياء الأمور — inherited from ar-001 (aligned with local usage).

School terminology =
إدارة المدرسة / مدير المدرسة inherited; قسم for class groups; السنة for grade.

Worksheet terminology =
أوراق عمل / تمارين — inherited from ar-001 (understood MSA; no unjustified full rename).

Practice terminology =
ممارسة / تمرين — inherited from ar-001.

Currency terminology =
الدينار الجزائري (DZD / د.ج) verified; no overlay keys created (no local price/currency display strings requiring change; purchase logic untouched).

Multilingual-country wording =
SEO/about/help framed as «النسخة العربية للجزائر» / «ممارسة بالعربية … في الجزائر». No claim that Arabic is Algeria’s only language. No French or Tamazight copy or fallback added.

Overrides created =
Sparse locale namespaces (grade, class-group, key teacher labels, Algeria SEO/about).
Sparse content-pack grade labels/bands + report grade wording + Algeria SEO fragments.
Sparse Help overlays for سنة mapping and Arabic-version-for-Algeria wording.

Heavy content inherited =
Science / Math-Geometry bulk / Learning Books / word meanings / full Help bodies / games copy beyond grade bands / rewards / emails / legal — all inherit from ar-001 (not copied).

Identical overrides = 0
Empty overrides = 0
Orphan keys = 0
Placeholder mismatches = 0
Type mismatches = 0
Cross-country leakage findings = 0 (scanned for Morocco/Tunisia/Egypt/Saudi/France/CP1/CM2/صف N patterns in overlay files)
Hebrew leakage findings = 0
Forbidden English UI findings = 0 (UI grade/practice labels resolved in Arabic; English-learning IDs like Grade_1 preserved only as product IDs in Help list mirrors)

Focused tests run =
node --test tests/i18n/ar-DZ-sparse-contract.test.mjs

Tests passed = 8
Tests failed = 0

BLOCKER =
(none for overlay authoring)

HIGH =
Shared wiring still required before public use (see below). Country is NOT product-connected.

MEDIUM =
gradeLabel template «السنة {grade}» remains numeric; authoritative display names are grade1–grade6 keys (grade6 ≠ «السنة 6»).
Some school portal strings still inherit معلّم/فصل from ar-001 outside sparse override set — intentional sparsity.

LOW =
Curriculum content for product grade6 is still the product’s 6th band, only labeled as السنة 1 متوسط for Algerian display.

Shared wiring required =
locale registry entry for ar-DZ
public path /dz (planned)
fallback chain ar-DZ → ar-001 → en
LanguageSwitcher / middleware / message loader registration
Help center locale index wiring for ar-DZ
content-pack catalog registration for ar-DZ
canonical redirects (if any)

ar-001 modified = 0
English SoT modified = 0
Other locales modified = 0
Shared runtime files modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed
```

Status: Algeria sparse overlay authored and focused-tested only. Not wired into the product.
