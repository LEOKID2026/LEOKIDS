-- =============================================================================
-- Stage E — Isolation tier documentation + safe view stubs
-- Package: sql/global-product-isolation/
-- Comments only + optional read-only views. No RLS here (see F_rls.sql).
-- =============================================================================

-- =============================================================================
-- TIER CLASSIFICATION (mandatory before any migration execution)
-- =============================================================================
--
-- Tier A — Product-private (explicit product_id on table)
--   parent_profiles, students, parent_account_settings, parent_reports,
--   parent_copilot_usage_log, student_access_codes (denormalized)
--   Rule: WHERE product_id = current_product on every read/write.
--
-- Tier B — Derived via student (NO product_id column)
--   learning_sessions, answers, coin_transactions, student_coin_balances,
--   student_sessions, student_learning_state, worksheet_student_assignments,
--   parent_reports (if only student_id FK)
--   Rule: JOIN students s ON s.id = <table>.student_id
--         WHERE s.product_id = current_product
--
-- Tier C — Product-scoped config (explicit product_id)
--   guest_mode_settings, subject_permission_catalog, subject_permission_defaults
--   Rule: WHERE product_id = current_product
--
-- Tier D — Shared by design (NO product filter)
--   arcade_rooms, arcade_room_players, arcade_games, arcade_friendships,
--   arcade_invites, matchmaking queues
--   Rule: cross-product play allowed; chat uses message keys for i18n.
--   DO NOT add product_id to Tier D. DO NOT apply product RLS to Tier D.
--
-- =============================================================================
-- ANTI-PATTERNS
-- =============================================================================
-- 1. Adding product_id to arcade_* tables — breaks cross-product matchmaking.
-- 2. Filtering Tier D in parent reports — IL child may play global friend (OK).
-- 3. NOT NULL product_id before backfill — blocks IL writes.
-- 4. RLS on auth.users — breaks Supabase auth.
-- 5. Assuming parent_id alone scopes data — must also filter product_id.
--
-- =============================================================================
-- SAME EMAIL SCENARIO
-- =============================================================================
-- auth.users: one row per email (Supabase)
-- user_product_memberships: (user_id, leokids_il) + (user_id, leokids_global)
-- students: separate rows per product; never auto-copy IL students to global.
--
-- =============================================================================
-- SAFE VIEW STUBS (read-only helpers for app queries)
-- =============================================================================

-- Students with product label (service_role / RLS-protected selects)
CREATE OR REPLACE VIEW public.v_students_scoped AS
SELECT
  s.*,
  s.product_id AS scope_product_id
FROM public.students s;

COMMENT ON VIEW public.v_students_scoped IS
  'Thin alias reminding consumers to filter scope_product_id. Prefer explicit product filter in API.';

-- Learning sessions with inherited product (Tier B join pattern)
CREATE OR REPLACE VIEW public.v_learning_sessions_with_product AS
SELECT
  ls.*,
  st.product_id AS scope_product_id,
  st.parent_id
FROM public.learning_sessions ls
JOIN public.students st ON st.id = ls.student_id;

COMMENT ON VIEW public.v_learning_sessions_with_product IS
  'Tier B template: filter WHERE scope_product_id = $1. No product_id on learning_sessions.';

-- Parent + membership join for login gate
CREATE OR REPLACE VIEW public.v_parent_product_access AS
SELECT
  pp.id AS parent_user_id,
  pp.product_id AS profile_product_id,
  m.product_id AS membership_product_id,
  m.status AS membership_status,
  m.interface_language,
  m.preferred_report_language
FROM public.parent_profiles pp
LEFT JOIN public.user_product_memberships m
  ON m.user_id = pp.id AND m.product_id = pp.product_id;

COMMENT ON VIEW public.v_parent_product_access IS
  'Login check: membership_product_id must match site product AND status = active.';

-- Active guest settings per product
CREATE OR REPLACE VIEW public.v_guest_settings_by_product AS
SELECT *
FROM public.guest_mode_settings
WHERE product_id IS NOT NULL;

COMMENT ON VIEW public.v_guest_settings_by_product IS
  'Tier C: load guest config with WHERE product_id = current_product.';

-- Revoke public access to views; APIs use service_role or RLS-backed roles
REVOKE ALL ON public.v_students_scoped FROM PUBLIC;
REVOKE ALL ON public.v_learning_sessions_with_product FROM PUBLIC;
REVOKE ALL ON public.v_parent_product_access FROM PUBLIC;
REVOKE ALL ON public.v_guest_settings_by_product FROM PUBLIC;

GRANT SELECT ON public.v_students_scoped TO authenticated, service_role;
GRANT SELECT ON public.v_learning_sessions_with_product TO authenticated, service_role;
GRANT SELECT ON public.v_parent_product_access TO authenticated, service_role;
GRANT SELECT ON public.v_guest_settings_by_product TO authenticated, service_role;
