-- =============================================================================
-- Stage H — Rollback per stage
-- Package: sql/global-product-isolation/
-- Run ONLY the section matching the stage you need to reverse.
-- Order: reverse F → E → D → C → B → A (RLS first, then columns).
-- =============================================================================

-- =============================================================================
-- H-F — Rollback RLS (Stage F)
-- =============================================================================
BEGIN;

ALTER TABLE IF EXISTS public.user_product_memberships DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS memberships_select_own ON public.user_product_memberships;

ALTER TABLE IF EXISTS public.guest_mode_settings DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS guest_mode_settings_read_by_product ON public.guest_mode_settings;

ALTER TABLE IF EXISTS public.answers DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS answers_parent_via_student ON public.answers;

ALTER TABLE IF EXISTS public.learning_sessions DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS learning_sessions_parent_via_student ON public.learning_sessions;

ALTER TABLE IF EXISTS public.students DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS students_parent_mutate_product ON public.students;
DROP POLICY IF EXISTS students_parent_select_product ON public.students;

ALTER TABLE IF EXISTS public.parent_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS parent_profiles_update_own_product ON public.parent_profiles;
DROP POLICY IF EXISTS parent_profiles_select_own_product ON public.parent_profiles;

DROP FUNCTION IF EXISTS public.jwt_product_id();

COMMIT;

-- =============================================================================
-- H-E — Rollback views (Stage E)
-- =============================================================================
DROP VIEW IF EXISTS public.v_guest_settings_by_product;
DROP VIEW IF EXISTS public.v_parent_product_access;
DROP VIEW IF EXISTS public.v_learning_sessions_with_product;
DROP VIEW IF EXISTS public.v_students_scoped;

-- =============================================================================
-- H-D — Rollback product-scoped settings (Stage D)
-- =============================================================================
BEGIN;

DROP INDEX IF EXISTS public.idx_subject_permission_defaults_product;
ALTER TABLE IF EXISTS public.subject_permission_defaults DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.idx_subject_permission_catalog_product;
ALTER TABLE IF EXISTS public.subject_permission_catalog DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.uq_guest_mode_settings_product;
ALTER TABLE IF EXISTS public.guest_mode_settings DROP CONSTRAINT IF EXISTS guest_mode_settings_product_id_check;
ALTER TABLE IF EXISTS public.guest_mode_settings DROP COLUMN IF EXISTS product_id;

COMMIT;

-- =============================================================================
-- H-C — Rollback write guards (Stage C)
-- =============================================================================
-- DROP TRIGGER IF EXISTS trg_parent_profiles_enforce_product ON public.parent_profiles;
-- DROP TRIGGER IF EXISTS trg_students_enforce_product ON public.students;
DROP FUNCTION IF EXISTS public.enforce_parent_profile_product_id_on_write();
DROP FUNCTION IF EXISTS public.enforce_student_product_id_on_write();
DROP FUNCTION IF EXISTS public.current_app_product_id();

-- =============================================================================
-- H-B — Rollback memberships (Stage B)
-- =============================================================================
BEGIN;

REVOKE ALL ON FUNCTION public.ensure_user_product_membership FROM service_role;
DROP FUNCTION IF EXISTS public.ensure_user_product_membership(uuid, text, text);

DROP TRIGGER IF EXISTS trg_user_product_memberships_updated_at ON public.user_product_memberships;
DROP TABLE IF EXISTS public.user_product_memberships;

COMMIT;

-- set_updated_at_timestamp may be shared — drop only if no other triggers use it:
-- DROP FUNCTION IF EXISTS public.set_updated_at_timestamp();

-- =============================================================================
-- H-A — Rollback product identity columns (Stage A)
-- WARNING: loses product labeling data. Only if Wave 1 aborted before global data.
-- =============================================================================
BEGIN;

DROP INDEX IF EXISTS public.idx_student_access_codes_product;
ALTER TABLE IF EXISTS public.student_access_codes DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.idx_parent_copilot_usage_product;
ALTER TABLE IF EXISTS public.parent_copilot_usage_log DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.idx_parent_reports_product_id;
ALTER TABLE IF EXISTS public.parent_reports DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.idx_parent_account_settings_product;
ALTER TABLE IF EXISTS public.parent_account_settings DROP CONSTRAINT IF EXISTS parent_account_settings_product_id_check;
ALTER TABLE IF EXISTS public.parent_account_settings DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.idx_students_parent_product;
DROP INDEX IF EXISTS public.idx_students_product_id;
ALTER TABLE IF EXISTS public.students DROP CONSTRAINT IF EXISTS students_product_id_check;
ALTER TABLE IF EXISTS public.students DROP COLUMN IF EXISTS product_id;

DROP INDEX IF EXISTS public.idx_parent_profiles_product_created;
DROP INDEX IF EXISTS public.idx_parent_profiles_product_id;
ALTER TABLE IF EXISTS public.parent_profiles DROP CONSTRAINT IF EXISTS parent_profiles_product_id_check;
ALTER TABLE IF EXISTS public.parent_profiles DROP COLUMN IF EXISTS product_id;

DROP FUNCTION IF EXISTS public.is_valid_leokids_product_id(text);
DROP TYPE IF EXISTS public.leokids_product_id;

COMMIT;
