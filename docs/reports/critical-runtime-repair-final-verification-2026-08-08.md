# Critical Runtime Repair — Final Verification

**Date:** 2026-08-08  
**Commit/push:** not created / not performed  

## Student gap fix (this verification)

Students had **no account locale field**. Shared `lk_global_locale` meant Student B could inherit Student A on the same browser.

Minimal fix (no new schema):

- Authority: `student_sessions.client_meta.interface_locale`
- API: `GET/PATCH /api/student/session/locale`
- Hook: `useStudentSessionLocale` on `/student/*` and non-parent `/learning/*`
- Login: restore prior student locale → overwrite cookie; else seed from cookie
- Logout: clear `lk_global_locale` so next student does not inherit

## HTTP book probes (local `next dev` :3456)

All returned **200**, HTTP 500 = **0**:

- `/student/learning/book/math/g6?subject=math&grade=g6` → 200
- `/ar-001/student/learning/book/math/g6?...` → 200
- `/id/student/learning/book/math/g6?...` → 200
- `/es-419/student/learning/book/math/g6?...` → 200
- `/br/student/learning/book/math/g6?...` (pt-BR) → 200
- `/ar-001/student/learning/book/english/g5?...` → 200

## EN parity

- files restored = 450
- source extract files = 450
- contentDifferences = 0

## Build

- `npm run build` → PASS (exit 0)
- Warning: Automatic Static Optimization opted out via `_app` getInitialProps (pre-existing)
- Errors = 0

## Tests

- 51/51 focused tests PASS (includes student-session-locale)
