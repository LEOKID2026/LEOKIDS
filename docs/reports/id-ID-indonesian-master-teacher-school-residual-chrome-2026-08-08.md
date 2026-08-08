# Indonesian Master — Teacher/School Residual Chrome Corrections

**Date:** 2026-08-08  
**Owner:** Correction Owner — Indonesian Master Teacher & School Residual Chrome  
**Findings:** ID-A-006, ID-A-010, ID-A-011, ID-A-017

```text
Indonesian Master — Teacher/School Residual Chrome Corrections

ID-A-006 = CLOSED
ID-A-010 = CLOSED
ID-A-011 = CLOSED
ID-A-017 = CLOSED

Teacher class report English before = 34
Teacher class report English after = 0

Teacher worksheet English before = 11
Teacher worksheet English after = 0

Teacher discussion English before = 2
Teacher discussion English after = 0

School fallback English before = 20
School fallback English after = 0

Kelas/rombel semantic defects = 0
Adult register defects = 0

Phase9 API regression = PASS
  Teacher raw English API leak = 0
  School raw English API leak = 0
  Teacher message-first consumers = 0
  School direct bypasses = 0
Business logic drift = 0

Namespace/burn-down keys added =
  locales/en|id-ID/school.json portal:
    reportLoadError, messagesLoadError, childrenLoadError,
    permissionsUpdateError, portalLoadError
  content-packs/en|id-ID/global-burn-down:
    pages__teacher__class__[classId] (expanded report chrome)
    pages__teacher__worksheets__new (new)
    pages__teacher__class__[classId]__worksheets__new (new)
    pages__teacher__worksheets__[worksheetId] (new)
    pages__teacher__class__[classId]__worksheets__[worksheetId] (new)
    pages__teacher__class__[classId]__worksheets__[worksheetId]__report (new)
    pages__teacher__worksheets__[worksheetId]__grade__[studentId] (expanded)
    pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId] (expanded)
    pages__teacher__worksheets__[worksheetId]__report (expanded)
    pages__teacher__class__[classId]__discussion__new (expanded)
    pages__teacher__worksheets__index (+not_signed_in/error_generic)
    pages__teacher__class__[classId]__worksheets__index (+not_signed_in/error_generic)
  lib/school-portal/school-ui.js exports for new SCHOOL_* load/error constants
EN/id-ID parity = PASS (owned slugs + new school portal keys)

Files modified =
  pages/teacher/class/[classId].js
  pages/teacher/worksheets/new.js
  pages/teacher/class/[classId]/worksheets/new.js
  pages/teacher/worksheets/[worksheetId]/index.js
  pages/teacher/worksheets/[worksheetId]/report.js
  pages/teacher/worksheets/[worksheetId]/grade/[studentId].js
  pages/teacher/class/[classId]/worksheets/[worksheetId]/index.js
  pages/teacher/class/[classId]/worksheets/[worksheetId]/report.js
  pages/teacher/class/[classId]/worksheets/[worksheetId]/grade/[studentId].js
  pages/teacher/class/[classId]/discussion/new.js
  pages/school/activities/[activityId]/monitor.js
  pages/school/messages.js
  pages/school/students/index.js
  pages/school/classes/index.js
  pages/school/operators/[operatorId].js
  pages/school/teachers/[teacherId].js
  components/school-portal/SchoolTeacherDetailContent.jsx
  components/school-portal/SchoolOperatorsManager.jsx
  lib/school-portal/school-ui.js
  locales/en/school.json
  locales/id-ID/school.json
  content-packs/en/global-burn-down/** (owned packs + burn-down-index.json)
  content-packs/id-ID/global-burn-down/** (owned packs + burn-down-index.json)
  artifacts/id-ID-teacher-school-residual-chrome/focused-validation.mjs
  artifacts/id-ID-teacher-school-residual-chrome/focused-validation.json
  docs/reports/id-ID-indonesian-master-teacher-school-residual-chrome-2026-08-08.md

Files outside ownership =
  none intentional
  (school-portal components touched only where they surface Phase-A school fallback chrome)

Focused tests =
  node artifacts/id-ID-teacher-school-residual-chrome/focused-validation.mjs
Tests passed = 1/1
Tests failed = 0

API/background/sub-agents used = 0
  (1 local Task subagent for worksheet/discussion page wiring only)

Build = not run
Commit = not created
Push = not performed

CORRECTION RESULT = PASS
```

## Notes

- Physical class/group chrome uses **rombel / rombongan belajar**; academic grade copy uses **Kelas** (e.g. discussion `err_invalid_grade`).
- Adult register: **Anda** / neutral professional; no `kamu`.
- School fallbacks use `apiErrorMessageHe(..., SCHOOL_*_LOAD_ERROR)` / localized constants — no English fallback literals on owned surfaces.
- Phase 9 Teacher/School API architecture not reopened; message-first consumers remain 0 on owned pages.
