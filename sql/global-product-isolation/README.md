# Global Product Isolation — Staged SQL Package

**Status:** Staged only — **do not execute** on production without owner review, staging run, and backup.

**Products:** `leokids_il` (Israeli site) · `leokids_global` (international site)

**Goal:** Share one Supabase project while keeping parent/student data and per-product settings isolated. Arcade/multiplayer remains cross-product (Tier D).

---

## Execution order

| Step | File | When | Depends on |
|------|------|------|------------|
| 1 | `A_product_identity.sql` | Wave 1 — before any global user creates data | — |
| 2 | `B_memberships.sql` | Immediately after A | A |
| 3 | `C_global_writes.sql` | After A+B; triggers stay **commented** until app deploy | A, B |
| 4 | `D_product_scoped_settings.sql` | Before global guest or global subject catalog | A |
| 5 | `E_isolation_notes.sql` | Anytime after A (views are safe) | A |
| 6 | Deploy app changes | Global writes `leokids_global`; IL keeps default `leokids_il` | A–D |
| 7 | `G_verification.sql` | After each stage + after app deploy | Relevant stages |
| 8 | `F_rls.sql` | Pre-launch / Wave 11 — **not** required for Wave 1 | App filters live |
| 9 | `H_rollback.sql` | Only if reversing a stage | — |

**Never run F before app-layer product filters are tested.** RLS misconfiguration can block Israeli parents.

---

## Purpose per file

| File | Purpose |
|------|---------|
| **A** | Add `product_id` to Tier A tables; backfill all existing rows → `leokids_il`; indexes |
| **B** | `user_product_memberships` + IL backfill + `ensure_user_product_membership` RPC |
| **C** | Document global write rules; staged triggers using `app.product_id` session var |
| **D** | `guest_mode_settings`, subject catalog/defaults scoped by product |
| **E** | Tier A/B/C/D documentation + read-only view stubs |
| **F** | RLS for Tier A/B/C only — **excludes arcade** |
| **G** | Verification queries (null counts, mismatches, leak checks) |
| **H** | Rollback sections per stage (reverse order: F → A) |

---

## Risks

| Risk | Mitigation |
|------|------------|
| `NOT NULL` before backfill | NOT NULL deferred in A; run only after both apps deployed |
| IL parents blocked by RLS | Transitional `jwt_product_id() IS NULL` allow; test G10 on staging |
| Global rows tagged `leokids_il` | Deploy global app **after** A; verify G7 |
| Arcade cross-play broken | **Never** add `product_id` or Tier A RLS to `arcade_*` (G11) |
| Guest settings collision | D uses unique index per `product_id` |
| student/parent product mismatch | G2 after every student create path change |
| Trigger enforcement too early | C triggers commented; enable only after staging pass |

---

## Rollback

Use `H_rollback.sql` — run **only** the section for the stage being reversed.

- **Abort Wave 1:** H-B then H-A (loses labeling; safe if no global data yet)
- **Disable RLS:** H-F only
- **Remove settings scope:** H-D only

Always re-run `G_verification.sql` after rollback.

---

## Verification checklist

After **Stage A:**

- [ ] G1: `null_product = 0` for `parent_profiles` and `students`
- [ ] G1: `global_count = 0` (until global beta)

After **Stage B:**

- [ ] G3: every `parent_profiles.id` has `leokids_il` membership
- [ ] G4: no duplicate membership rows

After **Stage D:**

- [ ] G5: one `guest_mode_settings` row per product
- [ ] G11: no `product_id` on `arcade_*` tables

After **global app deploy:**

- [ ] G7: new global rows show `leokids_global` only
- [ ] G2: zero parent/student product mismatches
- [ ] G8: access codes match student product

After **Stage F (staging):**

- [ ] G10: RLS enabled on expected tables only
- [ ] IL parent login + list students still works

---

## Expected impact on Israeli site (`leokids.co.il`)

| Stage | IL impact |
|-------|-----------|
| A | **None** — backfill sets `leokids_il`; default column preserves IL signups |
| B | **None** — auto-membership for existing parents |
| C | **None** if IL app does not set `app.product_id` (defaults to `leokids_il`) |
| D | **None** — existing settings backfilled to `leokids_il` |
| E | **None** — comments/views only |
| F | **Low risk** if tested; IL uses `leokids_il` claim — must verify on staging |
| Global app only | IL unchanged until global site writes data |

---

## Application code that must change (with migrations)

Deploy these **with or immediately after** Stage A+B. RLS (F) can follow later.

### Parent / auth

| File | Change |
|------|--------|
| `lib/parent-server/parent-session-ready.server.js` | Set `product_id` on `parent_profiles` insert; call `ensure_user_product_membership` |
| `pages/parent/login.js` | Check membership for `NEXT_PUBLIC_PRODUCT_ID` |
| `pages/api/parent/create-student.js` | Set `students.product_id` from env |
| `pages/api/parent/list-students.js` | Filter `.eq('product_id', productId)` |
| `pages/api/parent/update-student.js` | Product filter on reads/writes |
| `pages/api/parent/create-student-access-code.js` | Denormalize `product_id` on codes |
| `lib/global/apply-write-barrier.js` | Already wraps mutating APIs — extend for `product_id` |

### Student / learning (Tier B joins)

| File | Change |
|------|--------|
| `pages/api/student/login.js` | Scope access codes by product |
| `pages/api/learning/session/start.js` | Verify student belongs to product |
| `pages/api/learning/session/finish.js` | Join filter via student |
| `pages/api/learning/answer.js` | Join filter via student |
| `lib/learning/subject-permissions/subject-access.server.js` | Tier C catalog filter by product |

### Guest (Tier C)

| File | Change |
|------|--------|
| `lib/guest/*` | Load `guest_mode_settings` for current product |
| `pages/api/admin/guest/*.js` | Admin writes scoped by product |
| `scripts/qa/guest-mode-browser-qa.mjs` | QA uses product-scoped guest parent |

### Teacher / school (owner confirm)

| File | Change |
|------|--------|
| `pages/api/teacher/onboard.js` | Membership + product on teacher rows if teachers are product-scoped |
| `lib/admin-server/admin-analytics.server.js` | Analytics filter by product for global admin |

### Env / build

| Variable | Global value | IL value |
|----------|--------------|----------|
| `NEXT_PUBLIC_PRODUCT_ID` | `leokids_global` | `leokids_il` |
| `GUEST_SYSTEM_PARENT_EMAIL` | global guest parent | IL guest parent |

### Explicitly **no** product filter (Tier D)

- `pages/api/arcade/**` — cross-product play by design

---

## Owner confirmation before execute

- [ ] Table names match live schema (`parent_account_settings`, `subject_permission_defaults`, etc.)
- [ ] `students.parent_id` FK target confirmed for optional consistency constraint in A
- [ ] Global subject catalog seed keys match app (`math`, `geometry`, `english`, `science`)
- [ ] JWT `app_metadata.product_id` hook planned before enabling strict RLS
- [ ] Staging backup taken

---

## Reference

Full architecture: `GLOBALIZATION-AUDIT-AND-IMPLEMENTATION-PLAN.md` §12 (tiers), §13 (migration plan).
