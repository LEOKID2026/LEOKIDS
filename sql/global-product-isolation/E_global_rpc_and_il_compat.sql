-- =============================================================================
-- Stage E — Global create RPC + product consistency (Global-only hard require)
-- IL students: default leokids_il; membership auto via Stage B trigger.
-- Global students: require active leokids_global membership; never create IL.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.trg_v3_students_global_membership_required()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.product_id = 'leokids_global' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.user_product_memberships m
      WHERE m.user_id = NEW.parent_id
        AND m.product_id = 'leokids_global'
        AND m.status = 'active'
    ) THEN
      RAISE EXCEPTION 'active leokids_global membership required to create Global student';
    END IF;
  END IF;
  -- IL path: do not block when membership missing (auto-created in BEFORE INSERT trigger)
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_v3_students_global_membership_required ON public.students;
CREATE TRIGGER trg_v3_students_global_membership_required
  BEFORE INSERT OR UPDATE OF parent_id, product_id ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_v3_students_global_membership_required();

CREATE OR REPLACE FUNCTION public.create_global_parent_student_with_subject_defaults(
  p_parent_id uuid,
  p_changed_by uuid,
  p_full_name text,
  p_grade_level text,
  p_product_id text DEFAULT 'leokids_global'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.students;
BEGIN
  IF COALESCE(auth.role(), current_setting('request.jwt.claim.role', true), '')
       IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'create_global_parent_student_with_subject_defaults: service_role only';
  END IF;

  IF p_product_id IS DISTINCT FROM 'leokids_global' THEN
    RAISE EXCEPTION 'Global create RPC refuses product_id=%', p_product_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.user_product_memberships m
    WHERE m.user_id = p_parent_id
      AND m.product_id = 'leokids_global'
      AND m.status = 'active'
  ) THEN
    RAISE EXCEPTION 'active leokids_global membership required';
  END IF;

  INSERT INTO public.students (parent_id, full_name, grade_level, is_active, product_id)
  VALUES (p_parent_id, p_full_name, p_grade_level, true, 'leokids_global')
  RETURNING * INTO v_row;

  BEGIN
    PERFORM public.ensure_parent_student_learning_permissions(
      p_parent_id, p_changed_by, v_row.id
    );
  EXCEPTION
    WHEN undefined_function THEN NULL;
  END;

  RETURN jsonb_build_object(
    'student_id', v_row.id,
    'student', to_jsonb(v_row),
    'product_id', 'leokids_global'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text) FROM authenticated;
REVOKE ALL ON FUNCTION public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text) TO service_role;

COMMIT;
