# Global Product Isolation

**Status:** Staged only — **do not execute** without owner review, staging backup, and IL compatibility sign-off.

**Path:** `sql/global-product-isolation/` (canonical package — only active Product Isolation SQL in this repo)

## Architecture (transitional)

1. **Global site** — private data only via **service-role APIs** with hard `product_id = leokids_global`.
2. **Authenticated client** — treated as **IL legacy path**. RESTRICTIVE policies hide Global rows.
3. **Arcade / Tier D** — no product isolation.
4. **Legacy tables** — `parent_account_settings`, `guest_mode_settings` keep single-row PK for IL.
5. **Product-scoped settings** — `product_parent_account_settings`, `product_guest_mode_settings` (Global app only).

## Execution order

| # | File | Purpose |
|---|------|---------|
| 0 | `00_preflight_inventory.sql` | Capture `pg_policies` / RLS state (read-only) |
| 1 | `A_students_product_id.sql` | `students.product_id` + optional access_code denorm; IL backfill |
| 2 | `B_user_product_memberships.sql` | Membership SoT; service_role RPC; IL auto on IL student insert |
| 3 | `C_product_parent_account_settings.sql` | New Global settings table |
| 4 | `D_product_guest_mode_settings.sql` | New Global guest settings table |
| 5 | `E_global_rpc_and_il_compat.sql` | Global create RPC; IL-safe consistency |
| 6 | Deploy Global app (product_* tables + gates) | Writes still gated by write barrier |
| 7 | `F_rls_restrictive_il_only.sql` | RESTRICTIVE IL-only for authenticated Tier A/B/C |
| 8 | `G_verification_assertions.sql` | Hard-fail assertions + role/JWT dry-runs |
| 9 | `H_il_compat_checks.sql` | IL signup/create/list compatibility checks |

**Order:** `00 → A → B → C → D → E → F → G → H`

Rollback: `rollback/R_*.sql` per stage with confirm GUC (`v3.rollback_confirm` — stage letter, not a second package).

## Confirmations

- Package is not auto-applied.
- Do not run from CI against production.
- IL site code must not be required to change.
- This repository must keep **only** this Product Isolation SQL folder.
