-- =============================================================================
-- Stage F — RLS replace (Tier A/B/C only — NOT arcade)
-- Package: sql/global-product-isolation-v2/
-- DO NOT EXECUTE until app product filters are deployed and staging verified.
--
-- Rules:
--   - Prefer service-role APIs with hard product context for Global writes.
--   - Client authenticated access uses membership SoT (not app_metadata alone).
--   - NEVER: OR jwt_product_id() IS NULL as Production escape.
--   - answers join uses learning_session_id (real column).
--   - Drop v1 unsafe policies by name before creating v2 policies.
--   - Arcade tables are EXPLICITLY untouched.
-- =============================================================================

BEGIN;

-- Membership helper for RLS (not JWT product claim as SoT)
CREATE OR REPLACE FUNCTION public.user_has_active_product_membership(p_product_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_product_memberships m
    WHERE m.user_id = auth.uid()
      AND m.product_id = p_product_id
      AND m.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.user_active_product_ids()
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.product_id
  FROM public.user_product_memberships m
  WHERE m.user_id = auth.uid()
    AND m.status = 'active';
$$;

-- -----------------------------------------------------------------------------
-- Drop unsafe v1 policies (idempotent)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS parent_profiles_select_own_product ON public.parent_profiles;
DROP POLICY IF EXISTS parent_profiles_update_own_product ON public.parent_profiles;
DROP POLICY IF EXISTS students_parent_select_product ON public.students;
DROP POLICY IF EXISTS students_parent_mutate_product ON public.students;
DROP POLICY IF EXISTS learning_sessions_parent_via_student ON public.learning_sessions;
DROP POLICY IF EXISTS answers_parent_via_student ON public.answers;
DROP POLICY IF EXISTS guest_mode_settings_read_by_product ON public.guest_mode_settings;
DROP POLICY IF EXISTS memberships_select_own ON public.user_product_memberships;

-- Drop v2 names before recreate (idempotent re-run)
DROP POLICY IF EXISTS v2_parent_profiles_select_own ON public.parent_profiles;
DROP POLICY IF EXISTS v2_parent_profiles_update_own ON public.parent_profiles;
DROP POLICY IF EXISTS v2_students_parent_select ON public.students;
DROP POLICY IF EXISTS v2_students_parent_insert ON public.students;
DROP POLICY IF EXISTS v2_students_parent_update ON public.students;
DROP POLICY IF EXISTS v2_students_parent_delete ON public.students;
DROP POLICY IF EXISTS v2_learning_sessions_parent_select ON public.learning_sessions;
DROP POLICY IF EXISTS v2_answers_parent_select ON public.answers;
DROP POLICY IF EXISTS v2_guest_mode_settings_select ON public.guest_mode_settings;
DROP POLICY IF EXISTS v2_upm_select_own ON public.user_product_memberships;
DROP POLICY IF EXISTS v2_pas_select_own ON public.parent_account_settings;

-- -----------------------------------------------------------------------------
-- parent_profiles — shared profile (no product filter on row)
-- Ownership only. Membership is separate table.
-- -----------------------------------------------------------------------------
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_parent_profiles_select_own
  ON public.parent_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY v2_parent_profiles_update_own
  ON public.parent_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- -----------------------------------------------------------------------------
-- students — ownership + membership for that product
-- -----------------------------------------------------------------------------
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_students_parent_select
  ON public.students
  FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid()
    AND public.user_has_active_product_membership(product_id)
  );

CREATE POLICY v2_students_parent_insert
  ON public.students
  FOR INSERT
  TO authenticated
  WITH CHECK (
    parent_id = auth.uid()
    AND public.user_has_active_product_membership(product_id)
  );

CREATE POLICY v2_students_parent_update
  ON public.students
  FOR UPDATE
  TO authenticated
  USING (
    parent_id = auth.uid()
    AND public.user_has_active_product_membership(product_id)
  )
  WITH CHECK (
    parent_id = auth.uid()
    AND public.user_has_active_product_membership(product_id)
  );

CREATE POLICY v2_students_parent_delete
  ON public.students
  FOR DELETE
  TO authenticated
  USING (
    parent_id = auth.uid()
    AND public.user_has_active_product_membership(product_id)
  );

-- -----------------------------------------------------------------------------
-- Tier B — learning_sessions via student product membership
-- -----------------------------------------------------------------------------
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_learning_sessions_parent_select
  ON public.learning_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students st
      WHERE st.id = learning_sessions.student_id
        AND st.parent_id = auth.uid()
        AND public.user_has_active_product_membership(st.product_id)
    )
  );

-- -----------------------------------------------------------------------------
-- Tier B — answers via learning_session_id (NOT session_id)
-- -----------------------------------------------------------------------------
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_answers_parent_select
  ON public.answers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students st
      WHERE st.id = answers.student_id
        AND st.parent_id = auth.uid()
        AND public.user_has_active_product_membership(st.product_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.learning_sessions ls
      JOIN public.students st ON st.id = ls.student_id
      WHERE ls.id = answers.learning_session_id
        AND st.parent_id = auth.uid()
        AND public.user_has_active_product_membership(st.product_id)
    )
  );

-- -----------------------------------------------------------------------------
-- Tier C — guest_mode_settings
-- -----------------------------------------------------------------------------
ALTER TABLE public.guest_mode_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_guest_mode_settings_select
  ON public.guest_mode_settings
  FOR SELECT
  TO authenticated
  USING (public.user_has_active_product_membership(product_id));

-- -----------------------------------------------------------------------------
-- memberships + settings
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_product_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_upm_select_own
  ON public.user_product_memberships
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE public.parent_account_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY v2_pas_select_own
  ON public.parent_account_settings
  FOR SELECT
  TO authenticated
  USING (
    parent_user_id = auth.uid()
    AND public.user_has_active_product_membership(product_id)
  );

-- -----------------------------------------------------------------------------
-- Views: prefer security_invoker when supported (PG15+ / recent Supabase)
-- Do not create a wide authenticated students view here.
-- -----------------------------------------------------------------------------
-- Example (enable only if view already exists and must stay exposed):
-- ALTER VIEW public.some_parent_view SET (security_invoker = true);

COMMIT;

-- EXPLICITLY EXCLUDED (Tier D) — do not add product RLS:
-- arcade_rooms, arcade_games, arcade_room_players, arcade_results,
-- arcade_friendships, arcade_game_sessions, matchmaking tables.
