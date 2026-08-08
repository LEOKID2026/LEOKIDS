# Indonesian Master — Namespace/Register/Terminology Corrections

**Date:** 2026-08-08  
**Owner:** Correction Owner — Indonesian Master Namespace Register / Terminology Cleanup  
**Scope:** Assigned linguistic findings ID-A-012…021 (excl. LOW intentional) + ID-AUD-B-003 stale tests. Namespace JSON + three intermediate tests only.

```text
Indonesian Master — Namespace/Register/Terminology Corrections

ID-A-012 = CLOSED
ID-A-013 = CLOSED
ID-A-014 = CLOSED
ID-A-015 = CLOSED
ID-A-016 = CLOSED
ID-A-018 = CLOSED
ID-A-019 = CLOSED
ID-A-020 = INTENTIONAL BRAND
ID-A-021 = VALID ID LOANWORD

ID-AUD-B-003 = CLOSED

Adult kamu defects after = 0 (assigned adult surfaces; worksheets coloring/public/answerKey + shared validation.api.session_expired cleared)
Child Anda defects after = 0 (ui.student.errors.sessionExpired retains kamu; residual Anda under ui.student.parentInvite* addresses parent, not child)
Mixed-register defects after = 0

Kelas/rombel defects after = 0 (teacherShell + platform school-class audit keys)
Learning unexplained EN UI after = 0
  Retained identical master leaves (justified):
    Avatar / avatarAlt = standard Indonesian loanword
    Level / Level {level} = established product gaming loanword (also in Naik level!)
    Diagram = established academic/math loanword (aligned with enlargeDiagram / Tutup diagram)

Parent Copilot classification = INTENTIONAL LOCKED PRODUCT BRAND
  Evidence:
    - locales/en/ui.json + locales/fr-FR/ui.json retain "Parent Copilot" in report language hint
    - scripts/oracle-conformance-tests.mjs labels "Parent Copilot (v1)"
    - Product surface naming across parent-copilot scripts/components uses Parent Copilot as product name
    - Help id-ID shortens display title to Copilot; brand token Parent Copilot retained in localeSettings.reportHint

Status classification = VALID ID LOANWORD (retain)
  Evidence: school.portal.statusLabel + activityColStatus = "Status"; common Indonesian UI loanword; Phase 4C already treated Status as intentional loanword; no competing product term (Keadaan) established

Current EN namespace leaves = 2972
Current ID namespace leaves = 2972
Missing = 0
Extra = 0
Empty = 0
Placeholder mismatches = 0
validation.api = 116/116

Stale tests updated =
  tests/i18n/id-ID-phase2a-core-ui.test.mjs
  tests/i18n/id-ID-phase2c-adult-portals.test.mjs
  tests/i18n/id-ID-phase3-runtime-integration.test.mjs
Tests now validate current contract =
  dynamic EN/ID owned-subset / full-namespace leaf parity (no frozen 972/2854)
  id-ID overlay active → Dasbor / Matematika / Selamat datang di Leo Kids
  rombel + session_expired register smoke asserts

Files modified =
  locales/id-ID/worksheets.json
  locales/id-ID/ui.json
  locales/id-ID/platform.json
  locales/id-ID/validation.json
  locales/id-ID/learning.json
  tests/i18n/id-ID-phase2a-core-ui.test.mjs
  tests/i18n/id-ID-phase2c-adult-portals.test.mjs
  tests/i18n/id-ID-phase3-runtime-integration.test.mjs
  docs/reports/id-ID-indonesian-master-namespace-register-terminology-corrections-2026-08-08.md

Files outside ownership = 0
  (no Arcade/Parent/Teacher/School JSX; no locale registry / load-messages / pack catalog / Help/SEO)

Focused tests =
  node --test tests/i18n/id-ID-phase2a-core-ui.test.mjs tests/i18n/id-ID-phase2c-adult-portals.test.mjs tests/i18n/id-ID-phase3-runtime-integration.test.mjs
  + dynamic namespace parity / register / Kelas-rombel / learning identical / session_expired probes
Tests passed = 17/17 (owned suite)
Tests failed = 0

Other locales modified = 0
API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

CORRECTION RESULT = PASS
```

## Per-finding notes

| ID | Action |
|---|---|
| ID-A-012 | `publicFullSystemNote`: kamu → Anda |
| ID-A-013 | Adult coloringUpload\* kamu/-mu → Anda / foto Anda / galeri Anda / etc. |
| ID-A-014 | `teacherShell.myClasses` → Rombel saya; `classReportTitle` → Laporan rombel |
| ID-A-015 | platform audit/fallback class keys → rombel; also `school_class_teacher_reassigned` → Guru rombel diganti |
| ID-A-016 | Timer→Waktu; Streak→Beruntun; Reset→Atur ulang; Default→Bawaan; Horizontal→Mendatar; related chrome; Avatar/Level/Diagram retained with justification |
| ID-A-018 | `validation.api.session_expired` → register-neutral “Sesi telah berakhir…”; student `ui.student.errors.sessionExpired` unchanged (kamu) |
| ID-A-019 | Consumer: `WorksheetIncludeAnswersOption` via Ready/Create/Recommendations/Public parent worksheet hubs → adult; kamu → Anda |
| ID-A-020 | Retain Parent Copilot (locked brand) |
| ID-A-021 | Retain Status (valid ID loanword) |
| ID-AUD-B-003 | Stale frozen counts / empty-overlay EN Dashboard expectations updated to current contract |

## ID-A-019 consumer evidence

- `hooks/useWorksheetUi.js` exposes `answerKeySeparate`
- Rendered by `components/worksheets/WorksheetIncludeAnswersOption.jsx`
- Used from `CreateWorksheetTab`, `ReadyWorksheetsTab`, `RecommendationsTab`, `ReadyWorksheetPublicPage` under Parent/Public worksheet hubs — adult/parent chrome, not student learning HUD
