# Arabic Country Wave 3 — Qatar Content Closure

Date: 2026-08-08  
Scope: COUNTRY CONTENT ONLY (`ar-QA`). No shared wiring, build, commit, or push.

```text
Arabic Country Wave 3 — Qatar Content Closure

Locale = ar-QA
Proposed path = /qa
Selector label = قطر

Registry/path collision = no
  (no locale / selector / Help / content-pack owner for ar-QA, /qa, or قطر)
  Soft note for MAIN: lib/site-nav.js treats paths containing /qa or ending with /qa
  as Quality-Assurance routes and hides the language switcher — carve locale /qa*
  out when wiring, or choose an alternate path via MAIN decision.
Fallback intended = ar-QA → ar-001 → en

Grade authority = الصف
Grade1 = الصف الأول
Grade2 = الصف الثاني
Grade3 = الصف الثالث
Grade4 = الصف الرابع
Grade5 = الصف الخامس
Grade6 = الصف السادس
Formal register = الصف الأول الابتدائي … الصف السادس الابتدائي

Primary stage mapping = grades 1–6 = المرحلة الابتدائية (valid)
Foundational-stage mapping = المرحلة التأسيسية = early learning (mainly grade1+grade2);
  grades 1–6 = المرحلة التأسيسية = forbidden (0 hits)

Physical class = شعبة / شعب
Student = طالب / طلاب
Teacher = معلم
Guardian = ولي الأمر

Locale namespaces created/modified =
  locales/ar-QA/common.json
  locales/ar-QA/ui.json
  locales/ar-QA/auth.json
  locales/ar-QA/learning.json
  locales/ar-QA/worksheets.json
  locales/ar-QA/teacher.json
  locales/ar-QA/school.json
  locales/ar-QA/platform.json
  locales/ar-QA/validation.json
  locales/ar-QA/copilot.json
  locales/ar-QA/seo.json

Content packs created/modified =
  content-packs/ar-QA/global-burn-down/** (fragments + burn-down-index)
  content-packs/ar-QA/reports/** 
  content-packs/ar-QA/games/**
  content-packs/ar-QA/learning/** (incl. diagnostic-labels grade→الصف)
  content-packs/ar-QA/rewards/**
  content-packs/ar-QA/demo/ui.json
  content-packs/ar-QA/books/**

Help files created/modified =
  data/help-center/ar-QA/index.js
  data/help-center/ar-QA/merge-overlays.js
  data/help-center/ar-QA/parents.js
  data/help-center/ar-QA/students.js
  data/help-center/ar-QA/subjects.js
  data/help-center/ar-QA/parent-report.js

Public SEO overlays created/modified =
  content-packs/ar-QA/public-seo/practice/{math,geometry omitted if absent,english,games,hub,reading,science}.json
  content-packs/ar-QA/public-seo/guides/{hub-cards,learning-games-at-home,math-practice-at-home}.json
  content-packs/ar-QA/public-seo/marketing/{schools,teachers}.json

Academic درجة defects = 0
Physical-class فصل defects = 0
Student-role تلميذ defects = 0
False foundational-stage claims = 0
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
  node --test tests/i18n/ar-QA-sparse-contract.test.mjs
Tests passed = 8
Tests failed = 0

Post-content MAIN registration required = yes
New namespace registration required = yes (locales/ar-QA → message loader)
New pack registrations required = yes (content-packs/ar-QA → pack-catalog)
New public-seo registrations required = yes (public-seo client index / catalog)
New Help registration required = yes (data/help-center/index.js → ar-QA)
Also required by MAIN =
  locale-registry ar-QA, pathPrefix qa, selector قطر, fallback ar-QA → ar-001 → en
  site-nav QA-path carve-out for locale /qa*
  middleware / SW / offline path if applicable

BLOCKER = none
HIGH = site-nav /qa Quality-Assurance heuristic conflicts with proposed locale path /qa
  (content layer still uses proposed /qa; MAIN must decide carve-out vs alternate path)
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

## Authority notes

| Concept | Qatar |
|---|---|
| Academic grade | الصف |
| Physical class group | شعبة / شعب |
| Student | طالب |
| Teacher | معلم |
| Guardian | ولي الأمر |
| Primary stage | المرحلة الابتدائية = product grades 1–6 |
| Foundational stage | المرحلة التأسيسية = early learning, mainly G1+G2 |
| Formal grade wording | الصف N الابتدائي |

## Artifacts

- `artifacts/linguistic-audit/bootstrap-ar-QA-from-jo.mjs`
- `artifacts/linguistic-audit/rebuild-ar-QA-burn-down-indexes.mjs`
- `artifacts/linguistic-audit/scan-ar-QA-effective.mjs`
- `artifacts/linguistic-audit/ar-QA-effective-scan.json`
- `tests/i18n/ar-QA-sparse-contract.test.mjs`

## FINAL STATUS

**PASS** — findings = 0 on country content layer. Runtime registration deferred to MAIN.
