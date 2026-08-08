# Indonesian Master — Phase 9B-3 Student + Arcade API/UI Localization

**Date:** 2026-08-08  
**Authority:** Phase 9A Student findings P9A-S-001…009 + Phase 9B-1 foundation (PASS)  
**Artifacts:** `artifacts/id-ID-phase9b3/**`

---

```text
Indonesian Master — Phase 9B-3 Student + Arcade API/UI Localization

Phase9A findings addressed =
BLOCKER = P9A-S-001, P9A-S-002, P9A-S-003
HIGH = P9A-S-004, P9A-S-005, P9A-S-006
MEDIUM = P9A-S-007 (no user-visible chrome — learning failures console-only; left intentional), P9A-S-008 (action-decisions code + leo-miners UI chrome)
LOW = P9A-S-009 (stable code added; UI remains auth.invalidStudentCredentials authority)

STUDENT ERROR RESOLVER

Legacy raw-English passthrough before = YES (/[A-Za-z]{4,}/ → return s)
Legacy raw-English passthrough after = NO (always localized Student fallback)
Session-expired mapping = PRESERVED (legacy token + session_expired / not_authenticated → ui.student.errors.sessionExpired)
Generic localized fallback = ui.student.errors.loadFailed

HOME

Home/profile raw English before = YES ("A temporary error occurred…"; invalid JSON English)
Home/profile raw English after = 0 (APIs emit unexpected_server_error; UI resolveStudentApiErrorMessage)

WORKSHEET

Worksheet raw English before = YES (json?.error || "Error" / "Unable to open" / "Network error")
Worksheet raw English after = 0 (code-first resolveStudentApiErrorMessage + auth.networkError; success via burn-down)

ARCADE

Lobby raw English before = YES (apiMessage preferred payload.error English)
Lobby raw English after = 0 (code-first → Student map / games.apiFailed)
My-room raw English before = YES ("Saved!" / json.message || json.error || "Error")
My-room raw English after = 0 (games.apiSuccess / resolveStudentApiErrorMessage)
Raw success prose removed = YES ("Saved!" → games.apiSuccess)

GUEST / LOGIN

Guest resume = code-first (API emits code; login uses auth.guestUnavailable / resume messageKey — no payload.error)
Login invalid credentials = UI authority preserved (auth.invalidStudentCredentials); API adds code invalid_credentials only
Unnecessary server translation introduced = NO

GAMES / LEARNING

Educational games = start/finish APIs emit stable codes; hooks localize via resolveStudentApiErrorMessage
Solo games = same
Learning APIs = no Student UI raw-render of session/answer failures (console.warn only) — intentional English-learning payloads untouched; pages/api/learning/** not modified
Intentional English-learning content preserved = YES

API CODES

Existing codes reused = unexpected_server_error, server_error, method_not_allowed, not_authenticated, forbidden, missing_resume_token, insufficient_funds, session_expired (field)
New stable codes introduced = invalid_game, invalid_difficulty, invalid_game_category, invalid_game_data, missing_game_id, game_session_mismatch, invalid_category, start_failed, finish_failed, guest_resume_failed, invalid_credentials
New mappings required from MAIN = 12 (see artifact)

TOTAL

Confirmed Student/Arcade raw-English leaks before = 9 Phase9A findings (3 BLOCKER + 3 HIGH + 2 MEDIUM surfaceable + 1 LOW duplicate)
Confirmed Student/Arcade raw-English leaks after = 0 (normal product API error/status chrome)
Unknown-code localized fallback = YES (ui.student.errors.loadFailed / games.apiFailed)

Game/learning logic drift = 0
Auth/session logic drift = 0

Files modified =
  lib/student-client/student-api-legacy-errors.js
  pages/api/student/home-profile.js
  pages/api/student/home-profile/summary.js
  pages/api/student/home-profile/analytics.js
  pages/api/student/home-profile/achievement-grants.js
  pages/api/student/worksheet-activities/[worksheetId].js
  pages/api/student/worksheet-activities/[worksheetId]/pdf-url.js
  pages/api/student/worksheet-activities/[worksheetId]/submit.js
  pages/api/student/worksheet-activities/[worksheetId]/mark-complete.js
  pages/api/student/educational-games/start.js
  pages/api/student/educational-games/finish.js
  pages/api/student/solo-games/start.js
  pages/api/student/solo-games/finish.js
  pages/api/student/guest/resume.js
  pages/api/student/login.js
  pages/api/student/action-decisions.js
  pages/api/arcade/my-room.js
  pages/student/home.js
  pages/student/world-home-prototype.js
  pages/student/worksheet/[worksheetId].js
  pages/student/arcade.js
  pages/student/arcade/my-room.js
  pages/student/login.js
  hooks/educational-games/useEducationalGameSession.js
  hooks/solo-games/useSoloGameSession.js
  lib/leo-miners/leo-miners-economy.client.js
  components/leo-miners/LeoMinersShell.jsx
  components/leo-miners/LeoMinersGame.jsx
Files created =
  tests/i18n/id-ID-phase9b3-student-arcade-api-ui.test.mjs
  artifacts/id-ID-phase9b3/new-code-mappings-required.json
  artifacts/id-ID-phase9b3/test-summary.json
  docs/reports/id-ID-indonesian-master-phase9b3-student-arcade-api-ui-2026-08-08.md
Files outside ownership =
  hooks/educational-games/useEducationalGameSession.js (student-only helper)
  hooks/solo-games/useSoloGameSession.js (student-only helper)
  lib/leo-miners/leo-miners-economy.client.js (student-only helper)
  components/leo-miners/LeoMinersShell.jsx (student-only surface)
  components/leo-miners/LeoMinersGame.jsx (student-only surface)
  pages/api/learning/** = 0 (not modified — no user-visible Student error chrome)

validation.json modified = 0
Shared 9B-1 foundation modified = 0
Other roles modified = 0
English SoT modified = 0
Other locales modified = 0

New-code reconciliation artifact = artifacts/id-ID-phase9b3/new-code-mappings-required.json

Focused tests = tests/i18n/id-ID-phase9b3-student-arcade-api-ui.test.mjs
Tests passed = 14
Tests failed = 0

API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

PHASE 9B-3 RESULT = PASS
```
