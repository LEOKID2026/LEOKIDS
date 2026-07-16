# GLOBAL Product Isolation v2 — Completion Report

**Date:** 2026-07-16  
**Repo scope:** `LEO-KIDS-GLOBAL` only  
**Remote:** `origin` → LEOKIDS global repository

---

## HEAD

| When | SHA |
|------|-----|
| Start (matched `origin/main`) | `fafd195a48e3144bac194fdac566f49af4234c26` |
| End | `e7b9dabee2342c0244ffa5dc8ed1d9f0e36c9f12` |

---

## Commits

| SHA | Summary |
|-----|---------|
| `2b2cd2f` | `feat(global): enforce server-side product isolation on parent and student APIs` |
| `4630a57` | `feat(sql): add global-product-isolation-v2 staged package` |
| `9afd956` | `test(global): add product-isolation suite and v2 completion report` |
| `82b4c89` | `docs: finalize product-isolation v2 report HEAD and commit SHAs` |
| `9f25602` | `docs: set product-isolation v2 report tip HEAD to 82b4c89` |
| `e7b9dab` | `docs: record final tip HEAD 9f25602 in product-isolation v2 report` |

---

## Code files changed (application)

### New

- `lib/global/product-context.server.js` — server-only `leokids_global`
- `lib/global/product-membership.server.js` — `user_product_memberships` ensure/lookup
- `lib/global/product-student.server.js` — ownership + product gates / Global counts

### Updated (product-aware)

- `lib/parent-server/parent-session-ready.server.js` — Global membership; `locale: "en"`; no `messageHe`
- `lib/parent-server/parent-entitlement-provision.server.js` — product-scoped settings insert + legacy fallback
- `lib/parent-server/delete-parent-owned-student.server.js` — ownership + `product_id` delete
- `lib/auth/persona-entitlement.server.js` — `loadParentAccountSettings(..., productId)`
- `lib/learning/subject-permissions/subject-access.server.js` — prefers `create_global_parent_student_with_subject_defaults`
- `lib/learning-supabase/student-auth.js` — session requires `students.product_id = leokids_global`
- `lib/guest/constants.js` — separate Global guest system parent email
- `lib/guest/guest-settings.server.js` — product-scoped settings; refuse legacy IL-key writes
- `lib/guest/guest-student.server.js` — guest insert sets `product_id` (still not enabled live)
- `pages/api/parent/create-student.js`
- `pages/api/parent/list-students.js`
- `pages/api/parent/update-student.js`
- `pages/api/parent/create-student-access-code.js`
- `pages/api/parent/copilot-turn.js`
- `pages/api/parent/students/[studentId]/report-data.js`
- `pages/api/parent/students/[studentId]/subject-permissions.js`
- `pages/api/parent/students/[studentId]/game-permissions.js`
- `pages/api/parent/students/[studentId]/coin-history.js`
- `pages/api/student/login.js` — Global student verify; mock login unchanged under write barrier
- `package.json` — `test:product-isolation`
- `public/student/offline-precache-generated.js` — build refresh

Learning session/answer APIs inherit product gate via `getAuthenticatedStudentSession`.

---

## Final data model

| Entity | Role |
|--------|------|
| `auth.users` | Shared identity; may join both products |
| `parent_profiles` | **Shared** profile — **not** membership SoT; no product membership column |
| `user_product_memberships` | **Membership SoT** — PK `(user_id, product_id)`; languages per product |
| `students` | Explicit `product_id`; Global creates = `leokids_global`; existing backfill → `leokids_il` |
| `parent_account_settings` | Product-scoped PK `(parent_user_id, product_id)` |
| `student_access_codes` | Optional denorm `product_id`; real credential column `code_hash` |
| `guest_mode_settings` | PK `(product_id, setting_key)` |
| Arcade / multiplayer | Tier D — **no** blanket product isolation |

App product id: **server only** via `getServerProductId()` → always `leokids_global` on this site.

---

## Migrations (staged — not executed)

Package: `sql/global-product-isolation-v2/`

| Order | File |
|-------|------|
| 1 | `A_students_and_access_codes.sql` |
| 2 | `B_user_product_memberships.sql` |
| 3 | `C_parent_account_settings_pk.sql` |
| 4 | `D_guest_settings_product.sql` |
| 5 | `E_global_rpc_and_consistency.sql` |
| 6 | Deploy app (already in this push) |
| 7 | `F_rls_replace.sql` |
| 8 | `G_verification_assertions.sql` |

v1 package `sql/global-product-isolation/` marked **SUPERSEDED** (do not apply).

### Backfill

- All existing `students` → `leokids_il`
- Access codes denorm from students → else `leokids_il`
- All `parent_profiles` → IL membership only (no auto Global membership)
- Existing `parent_account_settings` / `guest_mode_settings` → `leokids_il`
- Global guest settings seeded **disabled**

### Policies replaced (Stage F)

Drops unsafe v1 names (`*_product` with `jwt_product_id() IS NULL`, answers via `session_id`).  
Adds `v2_*` policies using `user_has_active_product_membership(product_id)`.  
`answers` uses `learning_session_id` / `student_id`.  
**Arcade untouched.**

### Rollback

`sql/global-product-isolation-v2/rollback/` — per-stage files requiring `v2.rollback_confirm`; does not blind-disable pre-existing RLS.

### Verification

`G_verification_assertions.sql` — assertions **RAISE EXCEPTION** on failure (null product_id, duplicate memberships, wrong PKs, jwt NULL escape, wrong answers column, arcade product_id, bad `code` index).

---

## Test results

| Suite | Result |
|-------|--------|
| `npm run build` | PASS |
| `npm run test:product-isolation` | PASS (11) |
| `npm run test:i18n` | PASS |
| `npm run test:worksheets` | PASS |
| `npm run test:parent-report-phase6` | PASS |
| `npm run test:diagnostic-engine-v2-harness` | PASS |

No tests wrote to Supabase Production.

---

## Remaining risks

1. SQL package is **staged only** — Global live writes still blocked until owner applies v2 + enables writes.  
2. Consistency trigger in Stage E is created **DISABLED** until staging pass.  
3. Until Stage A is applied, live student session auth returns null (schema not product-ready) — expected; mock/write-barrier path remains for shell.  
4. Username uniqueness on access codes remains global-hash based until a future product-scoped unique index is designed.  
5. Historical authenticated policies beyond v1 names may still exist in live DB — Stage F drops known unsafe names; operator should inventory `pg_policies` before apply.  
6. Guest mode remains disabled for Global (by design).

---

## Confirmations

- [x] **SQL was not executed** against any database from this workstream  
- [x] **Supabase was not changed** (no dashboard / remote migration apply)  
- [x] **Israeli sites not modified** (`LEO-KIDS`, `LEO-KIDS-WEB-TRY` untouched)  
- [x] **`GLOBAL_DATA_WRITES_ENABLED` remains default false** (barrier unchanged)  
- [x] Arcade has no blanket product filter  
- [x] `parent_profiles` is not membership SoT  
- [x] Same email can hold IL + Global memberships (schema + app support)
