# GLOBAL Product Isolation v3 — Completion Report

**Date:** 2026-07-16  
**Repo scope:** `LEO-KIDS-GLOBAL` only  

---

## HEAD

| When | SHA |
|------|-----|
| Start (matched `origin/main`) | `5077f97e1a7e1d7f06e71dde30197875ae7bfb60` |
| End | *(see tip after push — feature commits below)* |

---

## Commits

| Summary |
|---------|
| App: product_* settings tables + membership hardening |
| SQL: `sql/global-product-isolation-v3/` + supersede v2 |
| Tests + this report |

---

## Blockers fixed

### 1. Legacy tables untouched

- **Not altered:** `parent_account_settings`, `guest_mode_settings` PKs.
- **New:** `product_parent_account_settings` PK `(parent_user_id, product_id)`.
- **New:** `product_guest_mode_settings` PK `(product_id, setting_key)`.
- Global app reads/writes only the new tables.

### 2. Membership hole closed

- `ensure_user_product_membership`: **service_role EXECUTE only**; REVOKE from `authenticated`/`anon`.
- Suspended memberships are **not** reactivated by ensure (separate `reactivate_user_product_membership` for service_role).
- Global ensure uses `getServerProductId()` only; client `product_id` ignored.

### 3. Transitional RLS

- Authenticated path = IL legacy; **RESTRICTIVE** policies force `leokids_il` (or student join).
- Global private data via **service-role APIs** only.
- Covers students, access codes, sessions, learning_sessions, answers, reports, coins, inventory, subject permissions, worksheets/activities, copilot usage, product settings, memberships.
- Arcade / Tier D excluded.
- Unsafe v1/v2 permissive product policies dropped by name.

### 4. IL new users

- `students.product_id` default `leokids_il`.
- Trigger `trg_v3_auto_il_membership_on_student` creates IL membership on IL student insert.
- Global create requires active Global membership; Global RPC refuses `leokids_il`.

### 5. Verification

- `G_verification_assertions.sql`: legacy PK intact, no authenticated EXECUTE, RESTRICTIVE present, dual membership **exactly 2**, JWT/`SET LOCAL ROLE authenticated` dry-runs, Arcade no `product_id`.
- `H_il_compat_checks.sql`: IL default + auto membership + Global RPC refuse IL.

---

## Migrations (staged — not executed)

`sql/global-product-isolation-v3/`

0. `00_preflight_inventory.sql`  
1. `A_students_product_id.sql`  
2. `B_user_product_memberships.sql`  
3. `C_product_parent_account_settings.sql`  
4. `D_product_guest_mode_settings.sql`  
5. `E_global_rpc_and_il_compat.sql`  
6. Deploy Global app  
7. `F_rls_restrictive_il_only.sql`  
8. `G_verification_assertions.sql`  
9. `H_il_compat_checks.sql`  

Rollback: `rollback/R_*.sql` with `v3.rollback_confirm`.

v2 marked **SUPERSEDED**.

---

## App files changed

- `lib/global/product-settings.server.js` (new)
- `lib/global/product-membership.server.js`
- `lib/auth/persona-entitlement.server.js`
- `lib/parent-server/parent-entitlement-provision.server.js`
- `lib/guest/guest-settings.server.js`
- `tests/product-isolation/product-isolation.test.mjs`
- `sql/global-product-isolation-v3/**`
- `sql/global-product-isolation-v2/README.md` (superseded)

---

## Test results

| Suite | Result |
|-------|--------|
| `npm run build` | PASS |
| `npm run test:product-isolation` | PASS (12) |
| `npm run test:i18n` | PASS |
| `npm run test:worksheets` | PASS |
| `npm run test:parent-report-phase6` | PASS |
| `npm run test:diagnostic-engine-v2-harness` | PASS |

---

## Remaining risks

1. SQL still **not applied** — live schema unchanged until owner runs v3.  
2. `SET LOCAL ROLE authenticated` dry-run requires a role that does not bypass RLS.  
3. Broad IL permissive policies remain by design; isolation depends on RESTRICTIVE IL-only.  
4. Operator should run `00_preflight_inventory.sql` and archive `pg_policies` before Stage F.  
5. Guest Global remains disabled by seed.

---

## Confirmations

- [x] SQL not executed  
- [x] Supabase not changed  
- [x] Israeli sites not modified  
- [x] `GLOBAL_DATA_WRITES_ENABLED` remains default false  
- [x] Legacy settings PKs not altered  
- [x] Arcade not product-filtered  
