-- =============================================================================
-- Stage F — Row Level Security (Tier A / B / C only — NOT arcade)
-- Package: sql/global-product-isolation/
-- DO NOT EXECUTE until app layer filters are deployed and staging verified.
--
-- Feature flag recommendation: ENABLE_PRODUCT_RLS=false on IL during rollout.
--
-- Israeli site impact: MUST NOT block IL parents when product_id = leokids_il.
-- Test with JWT claim or session variable app.product_id = leokids_il.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Helper: product from JWT app_metadata (set by custom auth hook or API)
-- Fallback: app.product_id session variable for service paths
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.jwt_product_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.app_metadata', true), '')::jsonb ->> 'product_id',
    NULLIF(current_setting('app.product_id', true), '')
  );
$$;

COMMENT ON FUNCTION public.jwt_product_id IS
  'RLS policy input. Apps should set app_metadata.product_id on session or use app.product_id in RPC.';

-- -----------------------------------------------------------------------------
-- Tier A — parent_profiles
-- Parents see only their profile row for the active product.
-- -----------------------------------------------------------------------------
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS parent_profiles_select_own_product ON public.parent_profiles;
CREATE POLICY parent_profiles_select_own_product
  ON public.parent_profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    AND (
      product_id = public.jwt_product_id()
      OR public.jwt_product_id() IS NULL  -- transitional: allow until JWT claim deployed
    )
  );

DROP POLICY IF EXISTS parent_profiles_update_own_product ON public.parent_profiles;
CREATE POLICY parent_profiles_update_own_product
  ON public.parent_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() AND product_id = COALESCE(public.jwt_product_id(), product_id))
  WITH CHECK (id = auth.uid() AND product_id = COALESCE(public.jwt_product_id(), product_id));

-- Inserts typically service_role on signup — no authenticated INSERT policy here.

-- -----------------------------------------------------------------------------
-- Tier A — students
-- Parents see students they own within active product.
-- -----------------------------------------------------------------------------
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS students_parent_select_product ON public.students;
CREATE POLICY students_parent_select_product
  ON public.students
  FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid()
    AND (
      product_id = public.jwt_product_id()
      OR public.jwt_product_id() IS NULL
    )
  );

DROP POLICY IF EXISTS students_parent_mutate_product ON public.students;
CREATE POLICY students_parent_mutate_product
  ON public.students
  FOR ALL
  TO authenticated
  USING (
    parent_id = auth.uid()
    AND product_id = COALESCE(public.jwt_product_id(), product_id)
  )
  WITH CHECK (
    parent_id = auth.uid()
    AND product_id = COALESCE(public.jwt_product_id(), product_id)
  );

-- -----------------------------------------------------------------------------
-- Tier B — learning_sessions (via student join)
-- -----------------------------------------------------------------------------
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS learning_sessions_parent_via_student ON public.learning_sessions;
CREATE POLICY learning_sessions_parent_via_student
  ON public.learning_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students st
      WHERE st.id = learning_sessions.student_id
        AND st.parent_id = auth.uid()
        AND (
          st.product_id = public.jwt_product_id()
          OR public.jwt_product_id() IS NULL
        )
    )
  );

-- -----------------------------------------------------------------------------
-- Tier B — answers
-- -----------------------------------------------------------------------------
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS answers_parent_via_student ON public.answers;
CREATE POLICY answers_parent_via_student
  ON public.answers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.learning_sessions ls
      JOIN public.students st ON st.id = ls.student_id
      WHERE ls.id = answers.session_id
        AND st.parent_id = auth.uid()
        AND (
          st.product_id = public.jwt_product_id()
          OR public.jwt_product_id() IS NULL
        )
    )
  );

-- -----------------------------------------------------------------------------
-- Tier C — guest_mode_settings (read by authenticated parent portal / admin)
-- -----------------------------------------------------------------------------
ALTER TABLE public.guest_mode_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS guest_mode_settings_read_by_product ON public.guest_mode_settings;
CREATE POLICY guest_mode_settings_read_by_product
  ON public.guest_mode_settings
  FOR SELECT
  TO authenticated
  USING (
    product_id = public.jwt_product_id()
    OR public.jwt_product_id() IS NULL
  );

-- Mutations: service_role / admin only (no authenticated write policy)

-- -----------------------------------------------------------------------------
-- Tier C — user_product_memberships
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_product_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS memberships_select_own ON public.user_product_memberships;
CREATE POLICY memberships_select_own
  ON public.user_product_memberships
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- EXPLICITLY EXCLUDED — Tier D arcade (NO product RLS)
-- -----------------------------------------------------------------------------
-- arcade_rooms, arcade_games, arcade_room_players, arcade_friendships
-- DO NOT ENABLE product-scoped RLS on these tables.
-- Document in privacy policy: cross-product multiplayer is intentional.

COMMIT;
