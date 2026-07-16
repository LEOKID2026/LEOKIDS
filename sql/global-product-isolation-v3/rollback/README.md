# Rollback — Global Product Isolation v3

Run **one stage file** at a time after:
`SELECT set_config('v3.rollback_confirm', 'YES_STAGE_X', false);`

Does **not** disable pre-existing RLS. Does **not** alter legacy IL table PKs (they were never changed).

Reverse order: F → E → D → C → B → A.
