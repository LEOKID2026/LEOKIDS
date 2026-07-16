-- =============================================================================
-- Stage H — Israeli site compatibility (no IL code changes required)
-- =============================================================================

DO $$
DECLARE
  v_uid uuid;
  v_sid uuid;
  v_cnt bigint;
BEGIN
  -- H1: students.product_id default is leokids_il
  IF (
    SELECT column_default FROM information_schema.columns
    WHERE table_schema='public' AND table_name='students' AND column_name='product_id'
  ) NOT ILIKE '%leokids_il%' THEN
    RAISE EXCEPTION 'ASSERT H1 FAIL: students.product_id default is not leokids_il';
  END IF;

  -- H1b: NOT NULL after Stage A
  IF (
    SELECT is_nullable FROM information_schema.columns
    WHERE table_schema='public' AND table_name='students' AND column_name='product_id'
  ) IS DISTINCT FROM 'NO' THEN
    RAISE EXCEPTION 'ASSERT H1b FAIL: students.product_id must be NOT NULL';
  END IF;

  -- H2: auto IL membership trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_v3_auto_il_membership_on_student' AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'ASSERT H2 FAIL: missing auto IL membership trigger';
  END IF;

  -- H3: known parent_profiles row — temporarily remove IL membership, create IL student,
  -- verify trigger restores membership, then full rollback.
  SELECT id INTO v_uid FROM public.parent_profiles ORDER BY created_at NULLS LAST, id LIMIT 1;
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'ASSERT H3 FAIL: no parent_profiles row available for IL compat probe';
  END IF;

  -- Ensure IL membership exists then remove it for the probe
  INSERT INTO public.user_product_memberships (user_id, product_id, status, interface_language)
  VALUES (v_uid, 'leokids_il', 'active', 'he')
  ON CONFLICT (user_id, product_id) DO NOTHING;

  DELETE FROM public.user_product_memberships
  WHERE user_id = v_uid AND product_id = 'leokids_il';

  INSERT INTO public.students (parent_id, full_name, grade_level, product_id)
  VALUES (v_uid, '__v3_il_compat__', 'g3', 'leokids_il')
  RETURNING id INTO v_sid;

  SELECT count(*) INTO v_cnt FROM public.user_product_memberships
  WHERE user_id = v_uid AND product_id = 'leokids_il' AND status = 'active';
  IF v_cnt <> 1 THEN
    RAISE EXCEPTION 'ASSERT H3 FAIL: IL student create did not auto-create membership';
  END IF;

  IF (SELECT product_id FROM public.students WHERE id = v_sid) IS DISTINCT FROM 'leokids_il' THEN
    RAISE EXCEPTION 'ASSERT H3 FAIL: IL student product_id not leokids_il';
  END IF;

  RAISE EXCEPTION 'h3_rollback';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLERRM = 'h3_rollback' THEN
      RAISE NOTICE 'H3 IL auto-membership dry-run PASSED (rolled back)';
    ELSE
      RAISE;
    END IF;
END $$;

-- H4: Global RPC must refuse IL product
DO $$
BEGIN
  BEGIN
    PERFORM public.create_global_parent_student_with_subject_defaults(
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000001'::uuid,
      'x', 'g3', 'leokids_il'
    );
    RAISE EXCEPTION 'ASSERT H4 FAIL: Global RPC accepted leokids_il';
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM LIKE 'ASSERT H4%' THEN RAISE; END IF;
      RAISE NOTICE 'H4 OK: Global RPC rejected non-global product (%)', SQLERRM;
  END;
END $$;
