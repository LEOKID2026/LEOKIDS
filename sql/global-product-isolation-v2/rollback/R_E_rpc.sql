-- Rollback Stage E only
DO $$
BEGIN
  IF current_setting('v2.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_E' THEN
    RAISE EXCEPTION 'Refusing R_E_rpc: set v2.rollback_confirm = YES_STAGE_E';
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_v2_students_require_parent_membership ON public.students;
DROP FUNCTION IF EXISTS public.trg_students_require_parent_product_membership();
DROP FUNCTION IF EXISTS public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text);
