# Global Product Isolation v2 — SUPERSEDED

> **SUPERSEDED by `sql/global-product-isolation-v3/`.**  
> Do not apply this package.

## Known defects (why v3)

1. Altered PK of legacy `parent_account_settings` / `guest_mode_settings` (breaks IL single-row assumptions).
2. Granted `ensure_user_product_membership` to `authenticated` (self-serve membership hole).
3. Ensure path could reactivate suspended memberships.
4. RLS relied on membership / JWT without RESTRICTIVE IL-only authenticated path.
5. Verification dual-membership check used `< 1` instead of exactly `2`.

Use **v3** only.
