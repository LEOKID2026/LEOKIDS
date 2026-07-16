-- Rollback Stage F only — drop v2 policies. Does NOT disable RLS.
-- Set confirm before run:
--   SELECT set_config('v2.rollback_confirm', 'YES_STAGE_F', false);

DO $$
BEGIN
  IF current_setting('v2.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_F' THEN
    RAISE EXCEPTION 'Refusing R_F_rls: set v2.rollback_confirm = YES_STAGE_F';
  END IF;
END $$;

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

-- Restore pre-v2 parent policies ONLY if you have them saved from inventory.
-- This file intentionally does not recreate unknown historical policies.
