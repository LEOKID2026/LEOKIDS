DO $$ BEGIN
  IF current_setting('v3.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_E' THEN
    RAISE EXCEPTION 'Refusing R_E: set v3.rollback_confirm=YES_STAGE_E';
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_v3_students_global_membership_required ON public.students;
DROP FUNCTION IF EXISTS public.trg_v3_students_global_membership_required();
DROP FUNCTION IF EXISTS public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text);
