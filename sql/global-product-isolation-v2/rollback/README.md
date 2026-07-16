# Rollback — Global Product Isolation v2

**Danger:** Rolling back after Global data exists can orphan or delete Global rows. Prefer forward-fix.

## Rules

1. Run **only one stage file** at a time.
2. Set `v2_rollback_confirm = 'YES_STAGE_X'` in that file before running (see each file).
3. Rollback removes **v2 policies/objects only**. It does **not** `DISABLE ROW LEVEL SECURITY` on tables that already had RLS before v2.
4. Re-run `../G_verification_assertions.sql` after any rollback (expect failures for removed stages).

## Order (reverse of apply)

| Stage rolled back | File |
|-------------------|------|
| F (RLS) | `R_F_rls.sql` |
| E (RPC/trigger) | `R_E_rpc.sql` |
| D (guest PK) | `R_D_guest.sql` — **destructive** if Global guest rows exist |
| C (settings PK) | `R_C_settings.sql` — **destructive** if Global settings rows exist |
| B (memberships) | `R_B_memberships.sql` |
| A (students product_id) | `R_A_students.sql` — only if no Global students |

Never run all rollback files in one session without explicit per-file confirms.
