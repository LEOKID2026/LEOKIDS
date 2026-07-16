# Global Product Isolation v2

**Status:** Staged only — **do not execute** on production without owner review, staging run, and backup.

**Supersedes:** `sql/global-product-isolation/` (v1 — unsafe: indexed nonexistent `code`, used `answers.session_id`, put membership SoT on `parent_profiles.product_id`, used `jwt_product_id() IS NULL` Production escape).

**Products:** `leokids_il` · `leokids_global`

**Auth model:** One `auth.users` row may hold **both** product memberships. `parent_profiles` is a **shared** profile (no product membership column). Membership SoT = `user_product_memberships`.

---

## Real schema anchors (from applied migrations)

| Object | Fact |
|--------|------|
| `parent_profiles` | PK `id` = `auth.users.id`; no `product_id` in foundation |
| `students` | `parent_id` → `parent_profiles`; no `product_id` until Stage A |
| `student_access_codes` | `code_hash`, `pin_hash`, `login_username` — **no** plaintext `code` |
| `answers` | FK column is `learning_session_id` — **not** `session_id` |
| `parent_account_settings` | PK today = `parent_user_id` only → Stage C widens to `(parent_user_id, product_id)` |
| `guest_mode_settings` | PK today = `setting_key` → Stage D widens to `(product_id, setting_key)` |

---

## Tier model

| Tier | Tables | Isolation |
|------|--------|-----------|
| **A** | `students`, `user_product_memberships`, `parent_account_settings`, `parent_reports`, access codes (via student), copilot usage | Explicit `product_id` or membership |
| **B** | `learning_sessions`, `answers`, `student_sessions`, `coin_transactions`, worksheets | Via `students.product_id` join; APIs re-verify |
| **C** | `guest_mode_settings`, subject catalogs/defaults | Product-scoped keys |
| **D** | Arcade / multiplayer / friendships / rooms | **No** blanket `product_id` filter |

---

## Execution order

| # | File | Notes |
|---|------|-------|
| 1 | `A_students_and_access_codes.sql` | `students.product_id` + IL backfill; optional access-code denorm; indexes on `code_hash` |
| 2 | `B_user_product_memberships.sql` | Membership SoT; IL backfill only; **no** auto Global membership |
| 3 | `C_parent_account_settings_pk.sql` | Composite PK `(parent_user_id, product_id)`; preserve rows → IL |
| 4 | `D_guest_settings_product.sql` | Composite PK for guest settings; seed IL + empty Global disabled |
| 5 | `E_global_rpc_and_consistency.sql` | Global create-student RPC + membership consistency trigger |
| 6 | Deploy Global app (product-aware APIs) | Writes still gated by `GLOBAL_DATA_WRITES_ENABLED` |
| 7 | `F_rls_replace.sql` | Drop/replace unsafe policies; membership-based; **no** arcade |
| 8 | `G_verification_assertions.sql` | Assertions that **RAISE** on failure |
| — | `rollback/*` | Per-stage; does **not** disable pre-existing RLS blindly |

---

## App contract (Global site)

- Product id comes only from `lib/global/product-context.server.js` → always `leokids_global`.
- Never trust body/query/localStorage `product_id`.
- Create/list/update/delete/login/learning all verify `students.product_id = leokids_global`.

---

## Confirmations for operators

- This package is **not** auto-applied.
- Do not run against production from CI.
- After apply: run `G_verification_assertions.sql` and keep Arcade policies untouched.
