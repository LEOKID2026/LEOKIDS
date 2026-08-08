# Indonesian Master — Phase 2C Adult Portals & Reports

**Date:** 2026-08-08  
**Scope:** Translate owned adult namespaces only. No loader/registry/SW wiring (shared ownership).

```text
Indonesian Master — Phase 2C Adult Portals & Reports

reports = translated (locales/id-ID/reports.json)
emails = translated (locales/id-ID/emails.json)
legal = translated (locales/id-ID/legal.json)
teacher = translated (locales/id-ID/teacher.json)
school = translated (locales/id-ID/school.json)
copilot = translated (locales/id-ID/copilot.json)

English source leaves = 838
Indonesian target leaves = 838
Missing keys = 0
Extra keys = 0
Empty leaves = 0
Placeholder mismatches = 0

Student terminology defects = 0
Grade/class semantic defects = 0
Adult register defects = 0
Report terminology defects = 0
Untranslated English UI leaves = 0
  (intentional kept: teacher.reportSubjects IDs; English-grammar topic labels
   Present simple / Past simple; UI/math loanwords Status / Volume; machine
   tokens rangeFrom/rangeTo, YYYY-MM-DD, next_step, FACTS_JSON)

Diagnostic logic modified = 0
School model modified = 0
Legal requirements invented = 0

Files created =
  locales/id-ID/reports.json
  locales/id-ID/emails.json
  locales/id-ID/legal.json
  locales/id-ID/teacher.json
  locales/id-ID/school.json
  locales/id-ID/copilot.json
  tests/i18n/id-ID-phase2c-adult-portals.test.mjs
  artifacts/id-ID-phase2c/audit-phase2c.mjs
  artifacts/id-ID-phase2c/audit-results.json
  docs/reports/id-ID-indonesian-master-phase2c-adult-portals-reports-2026-08-08.md

Files outside ownership modified = 0

Focused tests =
  tests/i18n/id-ID-phase2c-adult-portals.test.mjs
  tests/i18n/id-ID-wiring.test.mjs
  artifacts/id-ID-phase2c/audit-phase2c.mjs
Tests passed = 16/16 (+ audit PASS)
Tests failed = 0

English SoT modified = 0
Other locales modified = 0
Shared wiring modified = 0
API/background agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 2C RESULT = PASS
```

## Terminology decisions (owned surfaces)

| English sense | Indonesian |
|---|---|
| Student / school “children” (learner) | murid |
| Parent | orang tua |
| Guardian | wali murid |
| Teacher | guru |
| Academic grade / year level | Kelas |
| Physical / admin class group | rombongan belajar / rombel |
| Report | laporan |
| Dashboard | dasbor |
| Adult address | Anda (no `kamu`) |
| Parent-facing “your child” (copilot) | anak Anda |

School portal probes: `colGrade` = Kelas ≠ `colClass` = Rombel; `choosePhysicalClass` = Pilih rombongan belajar.

## Runtime note

`LOCALE_BUNDLES["id-ID"]` remains `Object.freeze({})` (Phase 1). Disk translations are ready; static import wiring is shared ownership and was not modified in Phase 2C. Message-loader tests confirm English fallback until a later wiring step.
