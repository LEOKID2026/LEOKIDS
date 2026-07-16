-- =============================================================================
-- Stage C — Global write enforcement (documentation + optional DB guards)
-- Package: sql/global-product-isolation/
-- DO NOT EXECUTE triggers in production until app layer is deployed.
--
-- Purpose:
--   Document and optionally enforce that LEO-KIDS-GLOBAL app writes use
--   product_id = leokids_global. IL app continues leokids_il.
--
-- App-layer source of truth (deploy BEFORE enabling hard DB triggers):
--   NEXT_PUBLIC_PRODUCT_ID=leokids_global  (global Vercel project)
--   lib/global/apply-write-barrier.js      (wrapMutatingApi)
--   lib/parent-server/parent-session-ready.server.js
--   pages/api/parent/create-student.js
--
-- Israeli site impact: NONE when IL app keeps default leokids_il.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Session variable convention for service-role RPCs
--    Set per request: SET LOCAL app.product_id = 'leokids_global';
-- -----------------------------------------------------------------------------
COMMENT ON FUNCTION public.is_valid_leokids_product_id IS
  'Used by write guards. Apps should set LOCAL app.product_id per transaction when using RPCs.';

-- -----------------------------------------------------------------------------
-- 2. Read current product from session (NULL = no enforcement)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_app_product_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.product_id', true), '');
$$;

-- -----------------------------------------------------------------------------
-- 3. BEFORE INSERT/UPDATE trigger — students (STAGED, disabled by default)
--    Uncomment CREATE TRIGGER after global app writes are verified in staging.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_student_product_id_on_write()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_expected text;
BEGIN
  v_expected := public.current_app_product_id();

  -- No session var → allow (IL cron / legacy paths) until enforcement enabled
  IF v_expected IS NULL THEN
    IF NEW.product_id IS NULL THEN
      NEW.product_id := 'leokids_il';
    END IF;
    RETURN NEW;
  END IF;

  IF NOT public.is_valid_leokids_product_id(v_expected) THEN
    RAISE EXCEPTION 'invalid app.product_id session: %', v_expected;
  END IF;

  IF NEW.product_id IS NULL THEN
    NEW.product_id := v_expected;
  ELSIF NEW.product_id IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'students.product_id must match app.product_id (got %, expected %)',
      NEW.product_id, v_expected;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.enforce_student_product_id_on_write IS
  'Server-validated product_id on student writes. Global API sets app.product_id=leokids_global. '
  'DISABLED until Stage C trigger is attached — see README execution order.';

-- Staged — do not attach until owner enables:
-- DROP TRIGGER IF EXISTS trg_students_enforce_product ON public.students;
-- CREATE TRIGGER trg_students_enforce_product
--   BEFORE INSERT OR UPDATE ON public.students
--   FOR EACH ROW
--   EXECUTE FUNCTION public.enforce_student_product_id_on_write();

-- -----------------------------------------------------------------------------
-- 4. BEFORE INSERT/UPDATE trigger — parent_profiles (STAGED)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_parent_profile_product_id_on_write()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_expected text;
BEGIN
  v_expected := public.current_app_product_id();

  IF v_expected IS NULL THEN
    IF NEW.product_id IS NULL THEN
      NEW.product_id := 'leokids_il';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.product_id IS NULL THEN
    NEW.product_id := v_expected;
  ELSIF NEW.product_id IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'parent_profiles.product_id must match app.product_id';
  END IF;

  RETURN NEW;
END;
$$;

-- Staged — do not attach until owner enables:
-- DROP TRIGGER IF EXISTS trg_parent_profiles_enforce_product ON public.parent_profiles;
-- CREATE TRIGGER trg_parent_profiles_enforce_product
--   BEFORE INSERT OR UPDATE ON public.parent_profiles
--   FOR EACH ROW
--   EXECUTE FUNCTION public.enforce_parent_profile_product_id_on_write();

-- -----------------------------------------------------------------------------
-- 5. Membership write on parent signup (call from service role, not trigger)
-- -----------------------------------------------------------------------------
COMMENT ON FUNCTION public.ensure_user_product_membership IS
  'Global signup flow: ensure_user_product_membership(auth.uid(), ''leokids_global'', ''en''). '
  'IL signup flow: ensure_user_product_membership(auth.uid(), ''leokids_il'', ''he'').';

-- -----------------------------------------------------------------------------
-- 6. Tier B tables — NO product_id column
--    learning_sessions, answers, coin_transactions inherit via students join.
-- -----------------------------------------------------------------------------
-- Confirmed Tier B tables from pages/api:
--   learning_sessions  — pages/api/learning/session/*
--   answers            — pages/api/learning/answer.js
--   coin_transactions  — pages/api/parent/students/*/coin-history.js
--   student_sessions   — pages/api/student/login.js
--   student_learning_state — pages/api/student/learning-profile.js
--
-- App rule: every query JOINs students ON student_id AND filters students.product_id.

-- -----------------------------------------------------------------------------
-- 7. Tier D — arcade (NO product filter by design)
--    arcade_rooms, arcade_games — cross-product play allowed.
--    DO NOT add product_id or product triggers to Tier D tables.
