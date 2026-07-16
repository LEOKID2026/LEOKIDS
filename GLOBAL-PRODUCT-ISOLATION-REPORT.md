# GLOBAL Product Isolation — Report

**Date:** 2026-07-16  
**Repo scope:** `LEO-KIDS-GLOBAL` only  
**Canonical SQL package:** `sql/global-product-isolation/`

---

## HEAD

| When | SHA |
|------|-----|
| Before this fix | `7a9eb2a751efea651e96b2f62d5cc7b06117ffcc` |
| After | `2347202c66687c4f5642ab9f95685f3ea063bc55` |

---

## Preflight follow-up (this change)

### Tables added to Stage F (RESTRICTIVE IL-only via `student_id`)

- `diamond_transactions`
- `student_diamond_balances`
- `reward_card_transactions`
- `student_reward_cards`
- `surprise_box_openings`
- `student_game_category_permissions`
- `student_game_permissions_change_log`
- `teacher_students` (has `student_id`)
- `teacher_class_students` (has `student_id`)

### Explicitly not restricted

- Arcade / Tier D
- Shared catalogs: `coin_reward_rules`, `coin_spend_rules`, `shop_items`, `teacher_plans`

### Other fixes

- `students.product_id` / `student_access_codes.product_id` → **NOT NULL** after backfill (NULL is not IL)
- `v3_product_is_il(NULL)` → **false**; visibility requires `product_id = 'leokids_il'`
- G15 proves authenticated cannot **UPDATE** membership (not duplicate INSERT)
- H3 uses a real `parent_profiles` row inside a rolled-back probe

---

## Package layout

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
```

**Order:** `00 → A → B → C → D → E → F → G → H`

---

## Files changed (this commit)

- `sql/global-product-isolation/A_students_product_id.sql`
- `sql/global-product-isolation/F_rls_restrictive_il_only.sql`
- `sql/global-product-isolation/00_preflight_inventory.sql`
- `sql/global-product-isolation/G_verification_assertions.sql`
- `sql/global-product-isolation/H_il_compat_checks.sql`
- `sql/global-product-isolation/rollback/R_A_students.sql`
- `sql/global-product-isolation/rollback/R_F_rls.sql`
- `sql/global-product-isolation/README.md`
- `tests/product-isolation/product-isolation.test.mjs`
- `GLOBAL-PRODUCT-ISOLATION-REPORT.md`

---

## Test results

| Suite | Result |
|-------|--------|
| `npm run test:product-isolation` | **PASS** — 12 tests |
| `npm run build` | **PASS** |

---

## Confirmations

- [x] SQL not executed  
- [x] Supabase not changed  
- [x] Israeli sites not modified  
- [x] `GLOBAL_DATA_WRITES_ENABLED` remains default false  
- [x] Package is staged only — not auto-applied via CI/build  
