# GLOBAL Product Isolation — Report

**Date:** 2026-07-16  
**Repo scope:** `LEO-KIDS-GLOBAL` only  
**Canonical SQL package:** `sql/global-product-isolation/`

---

## Package layout (single active package)

```
sql/global-product-isolation/
  README.md
  00_preflight_inventory.sql
  A_students_product_id.sql
  B_user_product_memberships.sql
  C_product_parent_account_settings.sql
  D_product_guest_mode_settings.sql
  E_global_rpc_and_il_compat.sql
  F_rls_restrictive_il_only.sql
  G_verification_assertions.sql
  H_il_compat_checks.sql
  rollback/
    README.md
    R_A_students.sql
    R_B_memberships.sql
    R_C_settings.sql
    R_D_guest.sql
    R_E_rpc.sql
    R_F_rls.sql
```

**Execution order:** `00 → A → B → C → D → E → F → G → H`

Older versioned package folders and versioned isolation reports were removed from the working tree; Git history retains them.

---

## Model (final)

| Entity | Role |
|--------|------|
| `auth.users` | Shared identity; may hold IL + Global memberships |
| `parent_profiles` | Shared profile — not membership SoT |
| `user_product_memberships` | Membership SoT — PK `(user_id, product_id)` |
| `students` | Explicit `product_id`; IL default + backfill; Global creates = `leokids_global` |
| `parent_account_settings` / `guest_mode_settings` | **Legacy IL** — PKs unchanged |
| `product_parent_account_settings` / `product_guest_mode_settings` | **Global** product-scoped settings |
| Arcade / Tier D | No blanket product isolation |

App product id: server-only via `getServerProductId()` → `leokids_global`.

---

## Design guarantees

1. Legacy IL settings tables are not PK-migrated.
2. Membership RPC is **service_role only**; suspended is not auto-reactivated.
3. Authenticated clients see **IL-only** via RESTRICTIVE RLS; Global private data via service-role APIs.
4. New IL users: default `leokids_il` + auto IL membership trigger on student insert.
5. Global create refuses IL product and requires active Global membership.

---

## App surfaces (product-aware)

- `lib/global/product-context.server.js`
- `lib/global/product-membership.server.js`
- `lib/global/product-student.server.js`
- `lib/global/product-settings.server.js`
- Parent/student/learning/guest APIs gated to `leokids_global`
- Write barrier: `GLOBAL_DATA_WRITES_ENABLED` default **false**

---

## Confirmations

- [x] SQL not executed from this cleanup  
- [x] Supabase not changed  
- [x] Israeli sites not modified  
- [x] `GLOBAL_DATA_WRITES_ENABLED` remains default false  
- [x] Exactly one Product Isolation SQL directory under `sql/`  
- [x] No auto-apply of this package via package.json / CI / build  

See cleanup commit for HEAD tip after push.
