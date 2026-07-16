-- =============================================================================
-- Stage F — Transitional RLS: authenticated = IL-only (RESTRICTIVE)
-- Global private data: service-role APIs only (bypasses RLS).
-- Does NOT drop IL permissive ownership policies.
-- Does NOT touch Arcade / Tier D / shared catalogs (coin_*_rules, shop_items, teacher_plans).
-- =============================================================================

BEGIN;

-- Helpers: NULL is NOT IL -------------------------------------------------
CREATE OR REPLACE FUNCTION public.v3_student_is_il_visible(p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = p_student_id
      AND s.product_id = 'leokids_il'
  );
$$;

CREATE OR REPLACE FUNCTION public.v3_product_is_il(p_product_id text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(p_product_id = 'leokids_il', false);
$$;

-- Drop unsafe v1/v2 permissive product policies (if present) ----------------
DROP POLICY IF EXISTS parent_profiles_select_own_product ON public.parent_profiles;
DROP POLICY IF EXISTS parent_profiles_update_own_product ON public.parent_profiles;
DROP POLICY IF EXISTS students_parent_select_product ON public.students;
DROP POLICY IF EXISTS students_parent_mutate_product ON public.students;
DROP POLICY IF EXISTS learning_sessions_parent_via_student ON public.learning_sessions;
DROP POLICY IF EXISTS answers_parent_via_student ON public.answers;
DROP POLICY IF EXISTS guest_mode_settings_read_by_product ON public.guest_mode_settings;
DROP POLICY IF EXISTS v2_parent_profiles_select_own ON public.parent_profiles;
DROP POLICY IF EXISTS v2_parent_profiles_update_own ON public.parent_profiles;
DROP POLICY IF EXISTS v2_students_parent_select ON public.students;
DROP POLICY IF EXISTS v2_students_parent_insert ON public.students;
DROP POLICY IF EXISTS v2_students_parent_update ON public.students;
DROP POLICY IF EXISTS v2_students_parent_delete ON public.students;
DROP POLICY IF EXISTS v2_learning_sessions_parent_select ON public.learning_sessions;
DROP POLICY IF EXISTS v2_answers_parent_select ON public.answers;
DROP POLICY IF EXISTS v2_guest_mode_settings_select ON public.guest_mode_settings;
DROP POLICY IF EXISTS v2_pas_select_own ON public.parent_account_settings;

-- Drop v3 restrictive names for idempotent re-run
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public' AND policyname LIKE 'v3_restrict_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Tier A: students ----------------------------------------------------------
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_students_il_only
  ON public.students
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_product_is_il(product_id))
  WITH CHECK (public.v3_product_is_il(product_id));

-- Tier A: student_access_codes ---------------------------------------------
ALTER TABLE public.student_access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_sac_il_only
  ON public.student_access_codes
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

-- Tier B: student_sessions -------------------------------------------------
ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_student_sessions_il_only
  ON public.student_sessions
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

-- Tier B: learning_sessions ------------------------------------------------
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_learning_sessions_il_only
  ON public.learning_sessions
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

-- Tier B: answers ----------------------------------------------------------
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_answers_il_only
  ON public.answers
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

-- Tier A: parent_reports ---------------------------------------------------
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_parent_reports_il_only
  ON public.parent_reports
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

-- Tier B: coins / inventory ------------------------------------------------
ALTER TABLE public.student_coin_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_coin_balances_il_only
  ON public.student_coin_balances
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_coin_tx_il_only
  ON public.coin_transactions
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

ALTER TABLE public.student_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY v3_restrict_inventory_il_only
  ON public.student_inventory
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.v3_student_is_il_visible(student_id))
  WITH CHECK (public.v3_student_is_il_visible(student_id));

-- Diamonds / reward cards / surprise / game permissions (preflight gaps) ---
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'diamond_transactions',
    'student_diamond_balances',
    'reward_card_transactions',
    'student_reward_cards',
    'surprise_box_openings',
    'student_game_category_permissions',
    'student_game_permissions_change_log'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t)
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name=t AND column_name='student_id'
       ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format(
        'CREATE POLICY v3_restrict_%s_il_only ON public.%I
         AS RESTRICTIVE
         FOR ALL TO authenticated
         USING (public.v3_student_is_il_visible(student_id))
         WITH CHECK (public.v3_student_is_il_visible(student_id))',
        t, t
      );
    END IF;
  END LOOP;
END $$;

-- Teacher links (student_id present in real schema) ------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='teacher_students')
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema='public' AND table_name='teacher_students' AND column_name='student_id'
     ) THEN
    EXECUTE 'ALTER TABLE public.teacher_students ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY v3_restrict_teacher_students_il_only ON public.teacher_students
         AS RESTRICTIVE
      FOR ALL TO authenticated
      USING (public.v3_student_is_il_visible(student_id))
      WITH CHECK (public.v3_student_is_il_visible(student_id))
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='teacher_class_students')
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema='public' AND table_name='teacher_class_students' AND column_name='student_id'
     ) THEN
    EXECUTE 'ALTER TABLE public.teacher_class_students ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY v3_restrict_teacher_class_students_il_only ON public.teacher_class_students
         AS RESTRICTIVE
      FOR ALL TO authenticated
      USING (public.v3_student_is_il_visible(student_id))
      WITH CHECK (public.v3_student_is_il_visible(student_id))
    $p$;
  END IF;
END $$;

-- Subject permissions ------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_subject_permissions') THEN
    EXECUTE 'ALTER TABLE public.student_subject_permissions ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY v3_restrict_ssp_il_only ON public.student_subject_permissions
         AS RESTRICTIVE
      FOR ALL TO authenticated
      USING (public.v3_student_is_il_visible(student_id))
      WITH CHECK (public.v3_student_is_il_visible(student_id))
    $p$;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_learning_access_preferences') THEN
    EXECUTE 'ALTER TABLE public.student_learning_access_preferences ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY v3_restrict_slap_il_only ON public.student_learning_access_preferences
         AS RESTRICTIVE
      FOR ALL TO authenticated
      USING (public.v3_student_is_il_visible(student_id))
      WITH CHECK (public.v3_student_is_il_visible(student_id))
    $p$;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='student_subject_permissions_change_log') THEN
    EXECUTE 'ALTER TABLE public.student_subject_permissions_change_log ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY v3_restrict_ssp_log_il_only ON public.student_subject_permissions_change_log
         AS RESTRICTIVE
      FOR ALL TO authenticated
      USING (public.v3_student_is_il_visible(student_id))
      WITH CHECK (public.v3_student_is_il_visible(student_id))
    $p$;
  END IF;
END $$;

-- Worksheet / assigned activities ------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'parent_assigned_activities',
    'parent_activity_status',
    'parent_activity_attempts',
    'parent_activity_learning_visits',
    'worksheet_assignments',
    'worksheet_student_answers',
    'private_worksheet_assignments'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t)
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name=t AND column_name='student_id'
       ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format(
        'CREATE POLICY v3_restrict_%s_il_only ON public.%I
         AS RESTRICTIVE
         FOR ALL TO authenticated
         USING (public.v3_student_is_il_visible(student_id))
         WITH CHECK (public.v3_student_is_il_visible(student_id))',
        t, t
      );
    END IF;
  END LOOP;
END $$;

-- Copilot usage ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='parent_copilot_usage_log') THEN
    EXECUTE 'ALTER TABLE public.parent_copilot_usage_log ENABLE ROW LEVEL SECURITY';
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='parent_copilot_usage_log' AND column_name='product_id'
    ) THEN
      EXECUTE $p$
        CREATE POLICY v3_restrict_copilot_il_only ON public.parent_copilot_usage_log
         AS RESTRICTIVE
        FOR ALL TO authenticated
        USING (public.v3_product_is_il(product_id))
        WITH CHECK (public.v3_product_is_il(product_id))
      $p$;
    END IF;
  END IF;
END $$;

-- Product settings tables --------------------------------------------------
DROP POLICY IF EXISTS v3_restrict_ppas_il_only ON public.product_parent_account_settings;
CREATE POLICY v3_restrict_ppas_il_only
  ON public.product_parent_account_settings
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (product_id = 'leokids_il')
  WITH CHECK (product_id = 'leokids_il');

DROP POLICY IF EXISTS v3_restrict_pgms_il_only ON public.product_guest_mode_settings;
CREATE POLICY v3_restrict_pgms_il_only
  ON public.product_guest_mode_settings
  AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (product_id = 'leokids_il')
  WITH CHECK (product_id = 'leokids_il');

-- Membership: authenticated cannot INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS v3_restrict_upm_no_write ON public.user_product_memberships;
CREATE POLICY v3_restrict_upm_no_write
  ON public.user_product_memberships
  AS RESTRICTIVE
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY v3_restrict_upm_no_update
  ON public.user_product_memberships
  AS RESTRICTIVE
  FOR UPDATE TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY v3_restrict_upm_no_delete
  ON public.user_product_memberships
  AS RESTRICTIVE
  FOR DELETE TO authenticated
  USING (false);

COMMIT;

-- EXPLICITLY EXCLUDED:
-- arcade_* / Tier D
-- Shared catalogs: coin_reward_rules, coin_spend_rules, shop_items, teacher_plans
