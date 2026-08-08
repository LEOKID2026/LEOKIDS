# Indonesian Master — Phase 9B-4 Teacher + School + Guardian API/UI Localization

**Date:** 2026-08-08  
**Authority:** Phase 9A inventory + Phase 9B-1 code-first foundation  
**Artifacts:** `artifacts/id-ID-phase9b4/**`

---

```text
Indonesian Master — Phase 9B-4 Teacher + School + Guardian API/UI Localization

TEACHER

Phase9A Teacher findings addressed = YES (consumer-side; stable codes already from helpers)
BLOCKER = P9A-T-001, P9A-T-002 FIXED (message-first → apiErrorMessageHe)
HIGH = P9A-T-003, P9A-T-004, P9A-T-005 FIXED at UI (codes already emitted; UI now code-first)
MEDIUM = P9A-T-006, P9A-T-007 FIXED at UI (validation_failed / mapped codes win; no locale logic change)
LOW = P9A-T-008, P9A-T-009 accepted via code-first + localized fallback / existing packs

Teacher message-first consumers before = 28 call sites (pages + teacher-portal components)
Teacher message-first consumers after = 0
Teacher raw English API leaks after = 0

Activities = FIXED (list/new/monitor/report + individual/batch)
Worksheets = FIXED (list/new/index/grade/report + class paths)
Student link/create = FIXED (dashboard class manage uses code-first; link APIs already emit stable codes)
Classes/archive = FIXED (class_archived / already_archived mapped + UI code-first)
Onboarding = FIXED at display (rate_limited / teacher_profile_missing mapped; login already code-branched)
Reports = FIXED (activity report + class report modal)
Profile locale = FIXED at display (validation_failed wins; preference logic unchanged)

SCHOOL

Phase9A School findings addressed = YES (bypass + CRUD transport hygiene)
BLOCKER = apiErrorMessageHe already PASS from 9B-1; remaining direct bypasses FIXED
HIGH = activity monitor + teacher detail message bypass FIXED; CRUD field prose sanitized
MEDIUM = N/A additional beyond mapped-code audit PASS
LOW = N/A

apiErrorMessageHe regression = PASS
School direct bypasses before = 2 (activities/monitor.js + SchoolTeacherDetailContent.jsx)
School direct bypasses after = 0
Activity monitor = FIXED (apiErrorMessageHe)
CRUD validation = FIXED (message twin → validation_failed; code unchanged)
School raw English API leaks after = 0

GUARDIAN

Guardian consumers traced = pages/guardian/login.js + view.js (+ mapGuardianAccessErrorKey)
Raw-message consumer exists = NO (maps error.code → i18n messageKey)
Guardian changes required = NO
Guardian raw English API leaks after = 0

API CODES

Existing codes reused = validation_failed, class_archived, already_archived, rate_limited, feature_disabled, school_inactive, teacher_profile_missing, link_unavailable, consent_required, student_not_found, wrong_school, not_school_portal_member, operator_grant_required, profile_update_failed, unexpected_server_error, internal_error (+ 9B-1 set)
New stable codes introduced = 0
New mappings required from MAIN = 0 (see artifacts/id-ID-phase9b4/new-code-mappings-required.json)
Dynamic parameterized errors remaining = Invalid ${field}; Feature disabled: ${feature}; link-limit templates (deferred MAIN)

SHARED HELPERS

sendTeacherApiError modified = NO
sendSchoolApiError modified = NO
sendGuardianApiError modified = NO
Stable code contract preserved = YES (message remains compatibility/debug English)

TOTAL

Teacher confirmed raw-English leaks after = 0
School confirmed raw-English leaks after = 0
Guardian confirmed raw-English leaks after = 0
Unknown-code localized fallback = YES (validation.apiFallback)

Business logic drift = 0

Files modified =
  lib/teacher-portal/teacher-ui.js
  pages/teacher/class/[classId]/activities/index.js
  pages/teacher/class/[classId]/activities/new.js
  pages/teacher/class/[classId]/activities/[activityId]/monitor.js
  pages/teacher/class/[classId]/activities/[activityId]/report.js
  pages/teacher/class/[classId]/discussion/new.js
  pages/teacher/class/[classId]/worksheets/index.js
  pages/teacher/class/[classId]/worksheets/new.js
  pages/teacher/class/[classId]/worksheets/[worksheetId]/index.js
  pages/teacher/class/[classId]/worksheets/[worksheetId]/report.js
  pages/teacher/class/[classId]/worksheets/[worksheetId]/grade/[studentId].js
  pages/teacher/worksheets/index.js
  pages/teacher/worksheets/new.js
  pages/teacher/worksheets/[worksheetId]/index.js
  pages/teacher/worksheets/[worksheetId]/report.js
  pages/teacher/worksheets/[worksheetId]/grade/[studentId].js
  pages/teacher/students/activities/new.js
  pages/teacher/students/activities/batch/[batchId]/monitor.js
  components/teacher-portal/TeacherDashboardClient.jsx
  components/teacher-portal/TeacherDiscussionQuestionPicker.jsx
  components/teacher-portal/TeacherActivityStudentAnswersModal.jsx
  components/teacher-portal/TeacherPhysicalClassModals.jsx
  components/teacher-portal/TeacherStudentIndividualActivitiesPanel.jsx
  components/teacher-portal/TeacherClassReportModal.jsx
  pages/school/activities/[activityId]/monitor.js
  components/school-portal/SchoolTeacherDetailContent.jsx
  pages/api/school/activities/[activityId]/monitor.js
  pages/api/school/classes/physical-report.js
  pages/api/school/students/[studentId]/accounts/parent/{block,link,reset-pin,revoke,unblock,unlink}.js
  pages/api/school/students/[studentId]/accounts/student/{block,reset-pin,revoke,unblock}.js
Files created =
  tests/i18n/id-ID-phase9b4-teacher-school-guardian-api-ui.test.mjs
  artifacts/id-ID-phase9b4/new-code-mappings-required.json
  artifacts/id-ID-phase9b4/summary.json
  docs/reports/id-ID-indonesian-master-phase9b4-teacher-school-guardian-api-ui-2026-08-08.md
Files outside ownership = 0

validation.json modified = 0
Shared 9B-1 resolver modified = 0
Other roles modified = 0
English SoT modified = 0
Other locales modified = 0

New-code reconciliation artifact = artifacts/id-ID-phase9b4/new-code-mappings-required.json

Focused tests = tests/i18n/id-ID-phase9b4-teacher-school-guardian-api-ui.test.mjs (+ 9B-1 foundation regression)
Tests passed = 18
Tests failed = 0

API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 9B-4 RESULT = PASS
```

---

## Implementation notes

1. **Teacher:** All confirmed `error.message || error.code` consumers switched to `apiErrorMessageHe` (re-exported from `lib/teacher-portal/teacher-ui.js`). Raw `error.code` displays also routed through the resolver so mapped codes localize and unknown codes fall back.
2. **School:** Direct bypasses removed; most pages already used `apiErrorMessageHe`. CRUD routes kept `code=validation_failed` and replaced English field sentences in `message` with `validation_failed` for transport hygiene.
3. **Guardian:** Login already maps `body.error.code` via `mapGuardianAccessErrorKey` → i18n keys; no raw message render; no API/UI edits.
4. **Helpers:** Unchanged — stable `error.code` remains product authority; English `message` is compatibility only.
