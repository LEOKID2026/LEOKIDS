-- =============================================================================
-- Stage E — Global create-student RPC + parent/student product consistency
-- Package: sql/global-product-isolation-v2/
-- DO NOT EXECUTE without owner review.
--
-- App path: create_global_parent_student_with_subject_defaults
-- Trigger: student.product_id must match an active parent membership for that product.
-- =============================================================================

BEGIN;

-- Consistency: student product requires active parent membership for same product.
CREATE OR REPLACE FUNCTION public.trg_students_require_parent_product_membership()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.product_id IS NULL THEN
    RAISE EXCEPTION 'students.product_id is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.user_product_memberships m
    WHERE m.user_id = NEW.parent_id
      AND m.product_id = NEW.product_id
      AND m.status = 'active'
  ) THEN
    RAISE EXCEPTION
      'student product_id % requires active user_product_memberships for parent %',
      NEW.product_id, NEW.parent_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Staged: create trigger but leave DISABLED until app deploy + staging pass.
DROP TRIGGER IF EXISTS trg_v2_students_require_parent_membership ON public.students;
CREATE TRIGGER trg_v2_students_require_parent_membership
  BEFORE INSERT OR UPDATE OF parent_id, product_id ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_students_require_parent_product_membership();

ALTER TABLE public.students DISABLE TRIGGER trg_v2_students_require_parent_membership;

COMMENT ON FUNCTION public.trg_students_require_parent_product_membership() IS
  'Enable after Stage B + app deploy: ALTER TABLE students ENABLE TRIGGER trg_v2_students_require_parent_membership;';

-- Global-only create RPC (does not call IL-only defaults blindly without product).
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
  v_student_id uuid;
  v_row public.students;
BEGIN
  IF p_product_id IS DISTINCT FROM 'leokids_global' THEN
    RAISE EXCEPTION 'create_global_parent_student_with_subject_defaults only allows leokids_global';
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

  v_student_id := v_row.id;

  -- Best-effort subject defaults if helper exists (IL RPC name may differ).
  BEGIN
    PERFORM public.ensure_parent_student_learning_permissions(
      p_parent_id,
      p_changed_by,
      v_student_id
    );
  EXCEPTION
    WHEN undefined_function THEN
      NULL; -- optional in older schemas
  END;

  RETURN jsonb_build_object(
    'student_id', v_student_id,
    'student', to_jsonb(v_row),
    'product_id', 'leokids_global'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_global_parent_student_with_subject_defaults(uuid, uuid, text, text, text) TO service_role;

COMMIT;

-- After staging verification, enable consistency trigger:
-- ALTER TABLE public.students ENABLE TRIGGER trg_v2_students_require_parent_membership;
