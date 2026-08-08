# Indonesian Master — School Final Linguistic Residual Corrections

**Date:** 2026-08-08  
**Owner:** Correction Owner — Indonesian Master School Final Linguistic Residuals  
**Findings:** NEW-A-001, NEW-A-002, NEW-A-003, ID-A-011

```text
Indonesian Master — School Final Linguistic Residual Corrections

NEW-A-001 = CLOSED
NEW-A-002 = CLOSED
NEW-A-003 = CLOSED
ID-A-011 = CLOSED

Activity monitor English before = 11
Activity monitor English after = 0

Teacher detail English before = 6
Teacher detail English after = 0

Classes browse English before = 3
Classes browse English after = 0

School English fallback paths before = 22
School English fallback paths after = 0

Kelas/rombel defects = 0
Adult register defects = 0

Namespace keys added = 22
  (locales/en|id-ID/school.json portal:
   networkError, teacherDetailNetworkError, noTeacherId, noTeacherIdInUrl,
   authorizedSubjects, backToActivities, monitorChildrenQuestions, classAccuracy,
   colAnswers, colCorrect, viewAnswers, childrenCount, subjectsCount,
   physicalClassesCount, classStatusWithValue, createClassFailed, createChildFailed,
   updateAssignmentFailed, loadAssignmentFailed, inviteFailed, creationFailed,
   actionFailed)
EN/id-ID parity = PASS (missing=0 extra=0 empty=0 placeholder mismatches=0)
Current EN namespace leaves = 2991
Current ID namespace leaves = 2991

Phase9 School API regression = PASS
  School raw English API leak = 0
  apiErrorMessageHe = code-first (session hook message bypass removed)
  School direct API message bypass = 0
Business logic drift = 0

Files modified =
  pages/school/activities/[activityId]/monitor.js
  pages/school/classes/index.js
  pages/school/students/index.js
  pages/school/teachers/[teacherId].js
  pages/school/operators/[operatorId].js
  components/school-portal/SchoolTeacherDetailContent.jsx
  components/school-portal/SchoolOperatorsManager.jsx
  components/school-portal/SchoolClassManagementPanel.jsx
  components/school-portal/SchoolStudentAssignmentPanel.jsx
  components/school-portal/SchoolStudentCreateForm.jsx
  components/school-portal/SchoolUserIdInviteForm.jsx
  components/school-portal/SchoolStaffCreateForm.jsx
  components/school-portal/SchoolStaffEmailInviteForm.jsx
  components/school-portal/SchoolStaffAccessActions.jsx
  lib/school-portal/school-ui.js
  lib/school-portal/use-school-portal-session.js
  locales/en/school.json
  locales/id-ID/school.json
  artifacts/id-ID-school-final-linguistic-residuals/focused-validation.mjs
  artifacts/id-ID-school-final-linguistic-residuals/focused-validation.json
  docs/reports/id-ID-indonesian-master-school-final-linguistic-residuals-2026-08-08.md

Files outside ownership =
  none intentional
  (lib/school-portal/use-school-portal-session.js included as School portal load path for ID-A-011 / Phase9 bypass)

Focused tests =
  node artifacts/id-ID-school-final-linguistic-residuals/focused-validation.mjs
Tests passed = 1/1
Tests failed = 0

API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

CORRECTION RESULT = PASS
```

## Notes

- **Class accuracy** → physical cohort performance → Indonesian `Akurasi rombel` (not academic Kelas).
- **Physical classes count** → `rombongan belajar`; **class status** → `Status rombel`.
- **subjectsCount** uses live `group.subjectClasses.length` with localized `{count} subjects` / `{count} mata pelajaran` (replaces hardcoded `6 subjects`).
- Adult register: portal keys use **Anda** / neutral professional; no `kamu`.
- Session portal error path now uses `apiErrorMessageHe(..., SCHOOL_PORTAL_LOAD_ERROR)` (code-first).
