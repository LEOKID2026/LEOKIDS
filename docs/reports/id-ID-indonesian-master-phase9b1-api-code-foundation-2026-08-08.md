# Indonesian Master — Phase 9B-1 Shared API Code-First Foundation

**Date:** 2026-08-08  
**Mode:** Shared infrastructure only (no role-page / bulk API route edits)  
**Authority:** Phase 9A inventory + `artifacts/phase9a/**`  
**Artifacts:** `artifacts/id-ID-phase9b1/**`

---

```text
Indonesian Master — Phase 9B-1 Shared API Code-First Foundation

PHASE9A INPUT

Stable product codes audited = 31 Phase 9A coverage-missing codes + 4 school/guardian helper codes + existing validation.api set
Existing validation.api keys before = 43 (Phase 9A inventory claimed 44; leaf count verified 43)
Missing user-facing code mappings identified = 34
  Exact set:
  account_deactivated, already_archived, class_archived, config_missing,
  consent_invalid, consent_required, grade_mismatch, grade_required,
  guest_not_eligible, jwt_required, link_limit_reached, link_unavailable,
  missing_card_id, missing_resume_token, missing_student_id,
  not_authenticated, not_authorized, not_parent_activity, not_school_guardian,
  not_school_portal_member, operator_grant_required, profile_update_failed,
  rate_limited, server_error, student_id_required, student_not_found,
  student_not_linked, student_product_mismatch, student_scope_violation,
  subject_mismatch, teacher_profile_missing, unexpected_server_error,
  unknown_query_param, wrong_school

VALIDATION.API

New en validation.api keys = 34
New id-ID validation.api keys = 34
Final validation.api key count = 77

Missing id-ID keys = 0
Extra id-ID keys = 0
Placeholder mismatches = 0

Codes mapped already = 43 prior validation.api keys (incl. internal_error, feature_disabled, school_inactive, …)
Codes newly mapped = 34
Technical/non-user-facing codes excluded = 1 (missing_idempotency_key)
Dynamic prose without stable code =
  Invalid ${field} → parameterized template / field codes later
  Feature disabled: ${feature} → prefer feature_disabled mapping in consumers
  link-limit count templates → parameterized template later
  school CRUD required-field prose → stable codes in school role phase
  parent Username/PIN/create prose → parent 9B-2

CODE RESOLUTION

Existing shared mapping authority = locales/*/validation.json → validation.api (via bindPlatformDisplayLocale / API_ERROR_LABEL_HE)
API_ERROR_I18N_KEYS reused/extended = NO
New competing registry created = NO

Mapped-code priority = FIRST (always)
Unknown-code behavior = localized validation.apiFallback / caller fallback
Raw English message priority = NEVER over mapped code; NEVER preferred when a code is present

apiErrorMessageHe before = prefer English error.message prose when it looks non-snake_case
apiErrorMessageHe after = resolveApiErrorMessage(code-first) → validation.api[code] then fallback
School mapped-code blocker fixed = YES

SHARED SERVER HELPERS

sendTeacherApiError stable code = YES (already emits error.code)
sendSchoolApiError stable code = YES (delegates to sendTeacherApiError)
sendPersonaApiError stable code = YES (error + errorCode)
sendGuardianApiError stable code = YES (error.code)

Helpers modified = 0
Reason = codes already stable; message remains compatibility/debug only; no locale-aware server rewrite in 9B-1

SERVER LOCALE

readRequestInterfaceLocale modified = NO
Accept-Language introduced = NO

ROLE-SPECIFIC DEBT REMAINING

Parent raw-message fixes pending = YES (parent-api-errors rawMessage + dashboard) → 9B-2
Student raw-message fixes pending = YES (student-api-legacy-errors + worksheet/arcade) → 9B-3
Teacher message-first consumers pending = YES (body?.error?.message || code)
School direct-bypass consumers pending = YES
  pages/school/activities/[activityId]/monitor.js (message||code; not apiErrorMessageHe)
Arcade pending = YES
Demo/Public pending = LOW/confirm
Guardian pending = YES if UI raw-renders message

Stable user-facing codes still unmapped = 0 (for Phase 9A user-facing stable-code set in scope)
Orphan English-only prose requiring later stable-code conversion =
  parent create/PIN/guest strings; school CRUD required-field templates;
  dynamic Invalid ${field} / link-limit count templates; student temporary EN passthrough strings

REGRESSIONS

id-ID namespace parity = PASS (15/15; validation leaves 92/92 incl. new api keys)
Namespaces overall = PASS
Help = PASS (phase2d)
Public SEO = PASS (phase2d)
Phase5 packs = PASS
Phase7 native learning = PASS
Phase8 completeness = PASS

en helper regression = PASS
es-419 helper regression = PASS (code-first; may inherit en SoT merge for new keys)
ar-001 helper regression = PASS
id-ID helper regression = PASS

Files modified =
  locales/en/validation.json
  locales/id-ID/validation.json
  lib/platform-ui/display-labels.js
Files created =
  lib/api/resolve-api-error-message.js
  tests/i18n/id-ID-phase9b1-api-code-foundation.test.mjs
  docs/reports/id-ID-indonesian-master-phase9b1-api-code-foundation-2026-08-08.md
  artifacts/id-ID-phase9b1/code-classification.json
  artifacts/id-ID-phase9b1/test-summary.json
Files outside ownership = 0

English SoT validation modified = YES
Other English SoT modified = 0
Other locales modified = 0
Previous id-ID content modified = 0

Focused tests = tests/i18n/id-ID-phase9b1-api-code-foundation.test.mjs
  + compact phase2d/2e/5/7/8 regressions
Tests passed = 37
Tests failed = 0

API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 9B-1 RESULT = PASS
```

---

## Implementation notes

### Exact missing code set (derived, not the pasted sample alone)

From `artifacts/phase9a/validation-code-coverage.json` missing list (31) plus helper codes in `teacher-school-helper-codes.json` that were still unmapped (`not_school_portal_member`, `operator_grant_required`, `profile_update_failed`, `unexpected_server_error`).

Excluded as technical: `missing_idempotency_key`.

### Architecture choice

`API_ERROR_I18N_KEYS` maps a small set to top-level `validation.*` keys and is unused in product UI. Extending it would create a second registry beside `validation.api`.

Shared foundation therefore:

1. Extend **`validation.api`** (en SoT + id-ID parity)
2. Add **`lib/api/resolve-api-error-message.js`** — deterministic code-first resolver for later role mappers
3. Fix **`apiErrorMessageHe`** to call that resolver (School blocker)

### Dynamic prose classification (no bulk API edits)

| Pattern | Class | Later owner |
|---------|-------|-------------|
| `Invalid ${field}` | parameterized template / field codes | role/API hygiene |
| `Feature disabled: ${feature}` | use existing `feature_disabled` | teacher/school consumers |
| link-limit count templates | parameterized template | teacher |
| school `* required` field prose | convert to stable codes | school role |
| parent Username/PIN/create EN | convert to stable codes | parent 9B-2 |

### School bypass remaining

`pages/school/activities/[activityId]/monitor.js` still uses `body?.error?.message || body?.error?.code` and bypasses the helper — deferred to school role pass.
