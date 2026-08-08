# Indonesian Master — Phase 9A API/Server Localization Inventory

**Date:** 2026-08-08  
**Mode:** READ-ONLY inventory & classification (no translation, no code changes, no build/commit)  
**Locale target:** `id-ID`  
**Supporting extracts:** `artifacts/phase9a/` (`unique-english-prose.json`, `teacher-school-helper-prose.json`, `validation-code-coverage.json`)

---

```text
Indonesian Master — Phase 9A API/Server Localization Inventory

API ROUTE INVENTORY

Parent routes inspected = 27
Student routes inspected = 47
Teacher routes inspected = 63
School routes inspected = 59
Demo routes inspected = 12
Public routes inspected = 6
Other product API areas inspected =
  arcade=33, guardian=8, learning=5, auth=2, contact=1,
  coloring-upload=2, analytics=1, pwa=1, gallery=1
Admin/dev excluded (classified E, not productized) = 69
Cron/mock/learning-simulator excluded = 4

Phase 0 estimate (parent+student+teacher+school+demo+public) = ~214
Actual current count for those six areas = 214 (exact match)
Total pages/api *.js files on disk = 344
Total relevant public-product API route files (excl. admin/cron/mock/sim) = 271
Other shared server helpers inspected =
  lib/teacher-server (sendTeacherApiError), lib/school-server (sendSchoolApiError),
  lib/auth/persona-guard (sendPersonaApiError), lib/guardian-server,
  lib/platform-ui/display-labels (apiErrorMessageHe),
  lib/parent-client/parent-api-errors.js,
  lib/student-client/student-api-legacy-errors.js,
  lib/classroom-activities/student-activity-error-labels.client.js,
  lib/api/error-codes.js,
  lib/i18n/read-request-interface-locale.server.js,
  lib/i18n/global-burn-down-copy.js,
  lib/rewards/server/card-api-locale.server.js

Total relevant API/server files = 271 routes + ~12 critical helpers (focused)
Total English-looking response strings/templates (unique prose) =
  parent≈45 + student≈20 + demo≈8 + public≈1 + arcade≈14 + learning≈13
  + teacher/school/guardian helper prose≈67
  ≈ 168 unique templates (plus many snake_case machine codes)

CLASSIFICATION

MUST LOCALIZE raw user-visible = 42 discrete findings (see MUST-LOCALIZE FINDINGS;
  many templates collapse to shared mechanisms)
Machine codes / do not translate = high volume; stable literal codes sampled ≥38;
  validation.api covers 44 keys; most teacher/school codes remain unmapped there
Technical/internal = Method not allowed / Invalid JSON / Unknown query parameter /
  Invalid ${field} templates when only logged or replaced by fallback — retain as C
  unless a raw-message consumer surfaces them (then A)
Log-only = console/logger/stack paths (D) — not inventoried as product findings
Admin/dev excluded = pages/api/admin/** + Hebrew-only admin UI helpers (E)
Intentional English-learning = learning payload question/content fields;
  English-subject exception already in completeness manifest (F) — keep EN targets

RAW MESSAGE RENDERING

Parent raw-message paths =
  1. pages/parent/dashboard.js — payload.error || t(...) for credentials / PIN / delete
  2. lib/parent-client/parent-api-errors.js — ui.parent.errors.rawMessage = "{message}"
     (English API prose intentionally injected as t() parameter for create/update/load)
  3. Guest link / create-student flows when mapper receives English error strings

Student raw-message paths =
  1. lib/student-client/student-api-legacy-errors.js — any English prose with ≥4 letters
     not equal to the two legacy tokens is returned AS-IS
     (pages/student/home.js, world-home-prototype.js)
  2. pages/student/worksheet/[worksheetId].js — json?.error || "Error"
  3. pages/student/arcade.js — apiMessage prefers payload.error string
  4. pages/student/arcade/my-room.js — json.message || json.error || "Error" / "Saved!"
  5. pages/student/login.js guest resume — payload?.error || t(...) (login success path
     replaces API text with auth.invalidStudentCredentials — OK for password failure)

Teacher raw-message paths =
  Pattern body?.error?.message || body?.error?.code across teacher activity/worksheet UIs:
  pages/teacher/class/**/activities/**, worksheets/**, students/activities/**
  → prefers English sendTeacherApiError message over code

School raw-message paths =
  apiErrorMessageHe(error) in lib/platform-ui/display-labels.js:
  if error.message looks like prose (not snake_case), RETURN MESSAGE RAW
  Consumers: pages/school/messages.js, students/index.js, classes/index.js,
  operators/[operatorId].js, activities/[activityId]/monitor.js,
  lib/school-portal/use-school-data-fetch.js

Demo/public raw-message paths =
  Contact form maps codes locally (no raw prose) — clean
  Demo parent APIs return English error strings; demo UI mostly local copy —
  treat as LOW unless demo shell renders payload.error
  Public worksheet APIs mostly machine codes

VALIDATION / EXISTING LOCALIZATION

Stable API codes found (literal scan sample) = 38+
  (true set larger: many codes passed as variables result.code / auth.code)

Codes already mapped through validation.api (id-ID) = 44 keys, including:
  not_a_school_manager, school_inactive, feature_disabled, unauthorized, forbidden,
  validation_failed, method_not_allowed, internal_error, db_schema_not_ready,
  subject_already_granted, teacher_subject_not_granted, not_found,
  staff_user_not_found, physical_class_not_found, student_limit_reached, …
  + top-level validation.* (unauthorized, forbidden, notFound, …)
  + lib/api/error-codes.js API_ERROR_I18N_KEYS (8 keys) — DEFINED BUT UNUSED in product UI

Codes missing frontend localization (examples from product APIs) =
  account_deactivated, already_archived, class_archived, config_missing,
  consent_invalid, consent_required, grade_mismatch, grade_required,
  guest_not_eligible, jwt_required, link_limit_reached, link_unavailable,
  rate_limited, student_not_linked, subject_mismatch, teacher_profile_missing,
  unknown_query_param, wrong_school, not_authorized, missing_student_id, …

Duplicate English server prose unnecessary to translate when code path exists =
  "Method not allowed" + code method_not_allowed (already in validation.api)
  "Unexpected server error" / "Server error — please try again" + internal_error
  "Teacher portal is disabled" + feature_disabled
  "School is inactive" + school_inactive
  "Incorrect username or PIN" (student login UI replaces with auth.invalidStudentCredentials)
  "Student session expired" (student home maps via STUDENT_API_LEGACY_ERROR)
  Module-level globalBurnDownCopy(...) constants that already have id-ID burn-down packs
    but evaluate at import with activeBurnDownLocale default "en" on API process

SERVER LOCALE RESOLUTION

Existing request-locale authority =
  lib/i18n/read-request-interface-locale.server.js
  Priority: x-lk-interface-locale header → middleware-forwarded header →
  locale cookie → URL locale prefix → null
  (No Accept-Language invention required / not used as authority)

Parent locale availability =
  YES — product membership interface_language via
  pages/api/parent/membership/locale.js + cookie set on PATCH;
  request cookie/header readable via readRequestInterfaceLocale
  Most parent APIs DO NOT currently call it for error prose

Student locale availability =
  Partial — card/rewards APIs use resolveCardApiLocales(req) (cookie/header/query)
  Login/session/home APIs generally do NOT bind interface locale for error strings
  globalBurnDownCopy / gamePackCopy on API default to en unless bound (not per-request)

Teacher locale availability =
  YES profile — pages/api/teacher/profile/locale.js preferred_language + cookie
  Error helpers sendTeacherApiError emit English message regardless of profile locale

School locale availability =
  Inherits teacher/staff session + cookie; sendSchoolApiError → sendTeacherApiError
  Display layer uses validation.api via bindPlatformDisplayLocale BUT still prefers
  English message when present

Public/demo locale availability =
  Worksheets/cards: query interfaceLocale / cookie / readRequestInterfaceLocale
  Contact: code-only responses (locale on UI)
  Demo: contentLocale/interfaceLocale on card routes; parent demo errors often English literals

MUST-LOCALIZE FINDINGS

── Parent ──
BLOCKER =
  P9A-P-001 | credentials save | pages/api/parent/create-student-access-code.js |
    response key error | English templates e.g. "Username is already taken",
    "Invalid PIN", "Could not create access code" |
    consumer pages/parent/dashboard.js | raw YES |
    mechanism: stable codes + parent namespace mapper (stop payload.error render) | BLOCKER
  P9A-P-002 | PIN reset | same access-code API | error | English |
    dashboard savePinReset payload.error || t(...) | raw YES | same | BLOCKER
  P9A-P-003 | delete child | pages/api/parent/delete-student.js |
    error (burn-down EN at module default) | dashboard setDeleteError(payload.error) |
    raw YES | use codes + ui.parent.deleteFailed only | BLOCKER
  P9A-P-004 | dashboard create/update/load | multiple parent APIs returning English error |
    mapParentDashboardApiError → ui.parent.errors.rawMessage "{message}" |
    raw YES (intentional passthrough) | map codes only; never pass EN prose | BLOCKER

HIGH =
  P9A-P-005 | guest link | pages/api/parent/guest/link.js |
    error | "Child ID is missing", temporary EN, module-level burn-down EN |
    parent guest link UI / dashboard guest link | often raw or rawMessage | HIGH
  P9A-P-006 | create/update student | create-student.js / update-student.js |
    "Could not create student", "Could not update student", grade/name validation EN |
    via rawMessage mapper | HIGH
  P9A-P-007 | subject/game permissions | subject-permissions.js / game-permissions.js |
    "This child is not linked…", "Invalid subject", "Unexpected server error" |
    parent panels | HIGH if panels use mapParentPanelApiError (also rawMessage)

MEDIUM =
  P9A-P-008 | report-data / coin-history validation prose |
    "Invalid date params…", "Failed to load coin history" | MEDIUM
  P9A-P-009 | copilot-turn English auth/validation prose |
    parent copilot has mapParentCopilotTurnErrorHe — verify all branches | MEDIUM

LOW =
  P9A-P-010 | Method not allowed / Missing bearer token on parent APIs |
    rare wrong-method; still leaks if rawMessage | LOW

── Student ──
BLOCKER =
  P9A-S-001 | home profile errors | home-profile*.js |
    "A temporary error occurred. Please try again later." / "Student session expired" |
    resolveStudentApiErrorMessage | sessionExpired mapped; temporary EN PASSTHROUGH | BLOCKER
  P9A-S-002 | worksheet student UI | student worksheet APIs → pages/student/worksheet |
    json?.error || "Error" | raw YES | BLOCKER
  P9A-S-003 | arcade lobby | arcade APIs → pages/student/arcade.js apiMessage |
    prefers payload.error English | raw YES | BLOCKER

HIGH =
  P9A-S-004 | arcade my-room | setMessage("Saved!" / json.error) | HIGH
  P9A-S-005 | guest resume | pages/api/student/guest/* → login payload?.error | HIGH
  P9A-S-006 | games start/finish | educational-games / solo-games English error messages
    when UI shows result.message | HIGH

MEDIUM =
  P9A-S-007 | learning session/answer APIs English failures if surfaced | MEDIUM
  P9A-S-008 | leo-miners / action-decisions English (partial gamePackCopy) | MEDIUM

LOW =
  P9A-S-009 | login "Incorrect username or PIN" |
    UI replaces with t(auth.invalidStudentCredentials) — duplicate EN unnecessary | LOW
    (keep code path; do not translate API string if UI stays authoritative)

── Teacher ──
BLOCKER =
  P9A-T-001 | sendTeacherApiError architecture |
    lib/teacher-server/teacher-session.server.js |
    body.error.message = English prose | teacher pages prefer .message | BLOCKER
  P9A-T-002 | activity create/load/monitor/report |
    pages/api/teacher/activities/** + worksheet-activities/** |
    "Server error — please try again", "Too many requests…", validation EN |
    pages/teacher/** setError(body?.error?.message || …) | raw YES | BLOCKER

HIGH =
  P9A-T-003 | student link/create | link.js / create.js |
    "Student linking is not available yet", consent/limit EN | HIGH
  P9A-T-004 | class archive / members | "Class is archived", "Class already archived" | HIGH
  P9A-T-005 | onboard | "Too many onboard attempts", "Onboard requires…" | HIGH

MEDIUM =
  P9A-T-006 | report-data validation | Invalid windowDays / date range | MEDIUM
  P9A-T-007 | profile locale | "preferredLanguage is required" | MEDIUM

LOW =
  P9A-T-008 | Method not allowed / Unknown query parameter when UI never sends them | LOW
  P9A-T-009 | globalBurnDownCopy unexpected_server_error (id-ID pack exists; API binds en) | LOW→HIGH
    if message rendered — treat as HIGH until frontend prefers code

── School ──
BLOCKER =
  P9A-SC-001 | apiErrorMessageHe prefers English message |
    lib/platform-ui/display-labels.js + school pages |
    validation.api id-ID READY but bypassed when message is prose | BLOCKER
  P9A-SC-002 | sendSchoolApiError → English message twins of codes |
    pages/api/school/** | same leak via apiErrorMessageHe | BLOCKER

HIGH =
  P9A-SC-003 | students/teachers/operators CRUD validation prose |
    "accessId required", "loginUsername required", "gradeLevel is required",
    "physicalClassName is required" | HIGH
  P9A-SC-004 | monitor answers | activityId required templates | HIGH

MEDIUM =
  P9A-SC-005 | Unexpected server error / Too many requests on school routes | MEDIUM

LOW =
  P9A-SC-006 | Method not allowed | LOW
  Note (linguistics for Phase 9B+): academic grade=Kelas; physical class=rombel;
  student=murid — do not translate in 9A

── Demo / Public ──
BLOCKER = 0 (no confirmed normal product leak unique to demo/public beyond shared helpers)
HIGH =
  P9A-D-001 | demo parent report/copilot English errors if demo shell shows payload.error | HIGH*
    (*confirm demo UI; classify HIGH if rendered, else LOW)
MEDIUM =
  P9A-D-002 | demo cards Method not allowed / Server error | MEDIUM
LOW =
  P9A-PU-001 | public worksheets includeAnswers_required (code-like) | LOW
  Contact submit = codes only → Group 1 / not MUST LOCALIZE

Guardian (adjacent product) =
  sendGuardianApiError same shape as teacher; include in Group 2/3 if guardian UI
  uses raw message (same risk class as school/teacher)

Total MUST-LOCALIZE findings = 42 (enumerated IDs above; mechanisms overlap)

Recommended implementation groups =
1. Stable codes already mapped in validation.api / parent/student namespaces
   → NO API string translation; fix consumers to prefer code → t(validation.api.*)
   Critical fix: apiErrorMessageHe must NOT prefer English message over mapped code
   Critical fix: teacher setError(message||code) → code-first + mapper
   Critical fix: parent dashboard stop payload.error raw; expand CODE_TO_MESSAGE_KEY
   Critical fix: resolveStudentApiErrorMessage stop EN passthrough (fallback only)
2. Raw-message paths → convert orphan English-only `error` strings to stable codes
   OR attach code alongside and ignore message in UI
3. Server-generated dynamic prose (Invalid ${field}, link_limit_reached template,
   Feature disabled: ${feature}) → locale-aware server translator using
   readRequestInterfaceLocale + validation/platform packs OR frontend templates
4. Intentional English learning payloads → keep EN (questions/targets); UI chrome separate

Files likely requiring API/server changes =
  lib/teacher-server/teacher-session.server.js (optional: message=code or omit message)
  pages/api/parent/create-student-access-code.js
  pages/api/parent/guest/link.js (stop module-level EN burn-down constants)
  pages/api/parent/create-student.js, update-student.js, delete-student.js
  pages/api/parent/students/**/subject-permissions.js
  pages/api/student/home-profile*.js, login.js (optional code field)
  pages/api/student/worksheet* / educational-games* / solo-games*
  pages/api/arcade/** (error string → code)
  pages/api/teacher/** + pages/api/school/** (bulk: emit code-primary)
  Module-level globalBurnDownCopy call sites under pages/api/**

Files likely requiring frontend mapper changes =
  lib/platform-ui/display-labels.js (apiErrorMessageHe)
  lib/parent-client/parent-api-errors.js (remove/limit rawMessage EN passthrough)
  pages/parent/dashboard.js
  lib/student-client/student-api-legacy-errors.js
  pages/student/worksheet/[worksheetId].js
  pages/student/arcade.js, arcade/my-room.js
  pages/teacher/** (error.message preference)
  pages/school/** (already use apiErrorMessageHe — fix helper)

Existing namespace files sufficient =
  locales/id-ID/validation.json (api + apiFallback) — extend keys, do not replace
  locales/id-ID/ui.json parent.errors / student.errors / auth.*
  global-burn-down id-ID packs for some API slugs (already translated Phase 4C)
  student activity ERROR_COPY_KEYS + burn-down (good model for code→copy)

New id-ID content files required =
  Prefer extending validation.api (+ optional teacher.json/school.json error maps)
  rather than new packs; only add burn-down keys if keeping server-side copy helpers

Previous Phase3–8 product files modified = 0
English SoT modified = 0
Other locales modified = 0
API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 9A RESULT = READY
```

---

## Evidence notes (for Phase 9B implementers)

### A. Actual scope vs Phase 0

| Area | Files |
|------|------:|
| parent | 27 |
| student | 47 |
| teacher | 63 |
| school | 59 |
| demo | 12 |
| public | 6 |
| **Phase 0 six-area total** | **214** |
| arcade | 33 |
| guardian | 8 |
| learning | 5 |
| auth + contact + misc product | 8 |
| admin (excluded E) | 69 |

### B. Helper response shapes

| Helper | Shape | Localization implication |
|--------|--------|---------------------------|
| `sendTeacherApiError` / `sendSchoolApiError` | `{ error: { code, message } }` | UI often shows `message` (EN) |
| `sendPersonaApiError` | `{ ok:false, error, errorCode, message }` | Parent APIs mix codes + EN `error` string |
| `sendGuardianApiError` | teacher-like | Same risk if UI raw-renders |
| Parent JSON | `{ ok:false, error: "<EN or code>" }` | Inconsistent; many EN strings |
| Contact | `{ ok:false, code }` | Clean — code only |
| Student login | `{ ok:false, error: "Incorrect username or PIN" }` | UI replaces — Group 1 |

### C. Why `validation.api` alone is not enough today

1. Only ~7 of sampled product literal codes intersect `validation.api`.
2. `apiErrorMessageHe` **bypasses** mapped labels when `error.message` is English prose.
3. Teacher pages prefer `error.message` before `error.code`.
4. Parent `rawMessage` template is `{message}` — English in, English out.
5. `mapApiErrorToI18nKey` in `lib/api/error-codes.js` is unused by product UI.

### D. Server locale: do not invent Accept-Language

Reliable authorities already present:

- Cookie + `x-lk-interface-locale` via `readRequestInterfaceLocale`
- Parent membership `interface_language`
- Teacher `preferred_language`
- Explicit worksheet/card query params

`globalBurnDownCopy` / `gamePackCopy` on API handlers currently default to **en** (module import / unbound active locale). Module-scope constants (e.g. guest link errors) freeze English at load time even if packs exist in id-ID.

### E. Success messages

Most success responses are `{ ok: true, … }` without user prose. Parent dashboard successes already use `t(ui.parent.createChildSuccess)` etc. Arcade success strings are mostly local `t(games.apiSuccess)`. **No large API success-prose localization backlog**; focus remains errors/status failures.

### F. Emails

`emails.json` already localized. Email trigger APIs are out of API string scope unless they also return English confirmation prose to UI (none identified as primary backlog beyond normal `ok: true`).

### G. Smallest safe Phase 9B plan

1. **Frontend-first (days):** code-first mappers; kill EN passthrough in `apiErrorMessageHe`, parent `rawMessage`, student legacy resolver, teacher `message||code`.
2. **Extend `validation.api` (id-ID + en SoT):** missing teacher/school/parent/student codes listed above.
3. **API hygiene:** ensure every user-facing failure has a stable `code`; deprecate prose `error`/`message` for product personas (or set `message === code`).
4. **Optional server locale:** only for unavoidable dynamic templates; use `readRequestInterfaceLocale` + existing packs — not Accept-Language.
5. **Keep F:** English learning targets untouched.

---

## Machine-readable MUST-LOCALIZE index

| ID | role | route / surface | source file | response key | English (sample) | frontend consumer | raw? | recommended mechanism | severity |
|----|------|-----------------|-------------|--------------|------------------|-------------------|------|----------------------|----------|
| P9A-P-001 | parent | create-student-access-code | pages/api/parent/create-student-access-code.js | error | Username is already taken | pages/parent/dashboard.js | YES | code + ui.parent.* | BLOCKER |
| P9A-P-002 | parent | create-student-access-code | same | error | Invalid PIN / Could not… | dashboard PIN reset | YES | code + ui.parent.* | BLOCKER |
| P9A-P-003 | parent | delete-student | pages/api/parent/delete-student.js | error | server/child missing copy | dashboard delete | YES | code + ui.parent.deleteFailed | BLOCKER |
| P9A-P-004 | parent | list/create/update | multiple parent APIs | error | Could not create/list/update… | parent-api-errors rawMessage | YES | codes only; drop EN passthrough | BLOCKER |
| P9A-P-005 | parent | guest/link | pages/api/parent/guest/link.js | error | Child ID is missing / EN burn-down | dashboard guest link | YES | codes + request-locale burn-down | HIGH |
| P9A-P-006 | parent | create/update-student | create-student.js / update-student.js | error | Could not create/update student | rawMessage | YES | codes + parent.errors.* | HIGH |
| P9A-P-007 | parent | subject-permissions | pages/api/parent/students/.../subject-permissions.js | error | This child is not linked… | parent panels | YES | codes + mapper | HIGH |
| P9A-S-001 | student | home-profile* | pages/api/student/home-profile*.js | error | A temporary error occurred… | student-api-legacy-errors | YES | map or fallback; no EN pass | BLOCKER |
| P9A-S-002 | student | worksheet | student worksheet APIs | error | (various EN) | pages/student/worksheet | YES | code mapper | BLOCKER |
| P9A-S-003 | student | arcade | pages/api/arcade/** | error | Missing room ID / Server error… | pages/student/arcade.js | YES | code + games.* | BLOCKER |
| P9A-S-004 | student | my-room | arcade profile APIs | message/error | Saved! / Error | arcade/my-room.js | YES | local copy only | HIGH |
| P9A-T-001 | teacher | all teacher APIs | teacher-session.server.js | error.message | (any EN) | teacher pages message-first | YES | code-first + validation.api | BLOCKER |
| P9A-T-002 | teacher | activities* | pages/api/teacher/activities/** | error.message | Server error — please try again | teacher activity UIs | YES | same | BLOCKER |
| P9A-SC-001 | school | school portal | display-labels apiErrorMessageHe | error.message | (EN prose) | school pages | YES | prefer validation.api[code] | BLOCKER |
| P9A-SC-002 | school | school APIs | pages/api/school/** | error.message | accessId required etc. | via apiErrorMessageHe | YES | codes + validation.api extend | BLOCKER |

(Additional IDs P9A-P-008…P9A-PU-001 summarized in role severity sections above.)

---

**PHASE 9A RESULT = READY**

Criteria met: public-product API/server routes classified; raw-message consumers traced; machine codes distinguished from prose; validation localization mapped; implementation scope concrete and finite. No product/locale files modified.
