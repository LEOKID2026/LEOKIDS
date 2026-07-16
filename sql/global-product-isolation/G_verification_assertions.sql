-- =============================================================================
-- Stage G — Hard-fail verification (assertions + role/JWT dry-runs)
-- =============================================================================

DO $$
DECLARE
  v_cnt bigint;
  v_uid uuid;
  v_il_sid uuid;
  v_g_sid uuid;
  v_can_exec boolean;
  v_seen bigint;
BEGIN
  -- G1: no NULL product_id on students
  SELECT count(*) INTO v_cnt FROM public.students WHERE product_id IS NULL;
  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ASSERT G1 FAIL: % students with NULL product_id', v_cnt;
  END IF;

  -- G2: no duplicate memberships
  SELECT count(*) INTO v_cnt FROM (
    SELECT user_id, product_id FROM public.user_product_memberships
    GROUP BY 1, 2 HAVING count(*) > 1
  ) d;
  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ASSERT G2 FAIL: duplicate memberships';
  END IF;

  -- G3: legacy parent_account_settings PK must remain single-column
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    WHERE c.conrelid = 'public.parent_account_settings'::regclass
      AND c.contype = 'p'
      AND array_length(c.conkey, 1) <> 1
  ) THEN
    RAISE EXCEPTION 'ASSERT G3 FAIL: parent_account_settings PK altered (IL break risk)';
  END IF;

  -- G4: legacy guest_mode_settings PK must remain single-column
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    WHERE c.conrelid = 'public.guest_mode_settings'::regclass
      AND c.contype = 'p'
      AND array_length(c.conkey, 1) <> 1
  ) THEN
    RAISE EXCEPTION 'ASSERT G4 FAIL: guest_mode_settings PK altered (IL break risk)';
  END IF;

  -- G5: product_* tables exist with composite PKs
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='product_parent_account_settings') THEN
    RAISE EXCEPTION 'ASSERT G5 FAIL: product_parent_account_settings missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='product_guest_mode_settings') THEN
    RAISE EXCEPTION 'ASSERT G5 FAIL: product_guest_mode_settings missing';
  END IF;

  -- G6: ensure_user_product_membership NOT executable by authenticated
  SELECT has_function_privilege('authenticated', 'public.ensure_user_product_membership(uuid,text,text,text)', 'EXECUTE')
    INTO v_can_exec;
  IF v_can_exec THEN
    RAISE EXCEPTION 'ASSERT G6 FAIL: authenticated can EXECUTE ensure_user_product_membership';
  END IF;

  -- G7: no jwt_product_id() IS NULL escape in live policies
  SELECT count(*) INTO v_cnt FROM pg_policies
  WHERE schemaname='public'
    AND (qual ILIKE '%jwt_product_id() IS NULL%' OR with_check ILIKE '%jwt_product_id() IS NULL%');
  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ASSERT G7 FAIL: % policies still use jwt IS NULL escape', v_cnt;
  END IF;

  -- G8: no answers.session_id in policies
  SELECT count(*) INTO v_cnt FROM pg_policies
  WHERE schemaname='public' AND tablename='answers'
    AND (qual ILIKE '%answers.session_id%' OR with_check ILIKE '%session_id%' AND qual NOT ILIKE '%learning_session_id%');
  -- Stricter: explicit bad column
  SELECT count(*) INTO v_cnt FROM pg_policies
  WHERE schemaname='public' AND tablename='answers'
    AND (qual ILIKE '%answers.session_id%' OR with_check ILIKE '%answers.session_id%');
  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ASSERT G8 FAIL: answers policies reference session_id';
  END IF;

  -- G9: Arcade must not have product_id
  SELECT count(*) INTO v_cnt FROM information_schema.columns
  WHERE table_schema='public' AND table_name LIKE 'arcade_%' AND column_name='product_id';
  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ASSERT G9 FAIL: arcade_* has product_id';
  END IF;

  -- G10: RESTRICTIVE policies exist for students
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='students'
      AND policyname='v3_restrict_students_il_only' AND permissive='RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'ASSERT G10 FAIL: missing restrictive students IL policy';
  END IF;

  -- G11: unsafe v1/v2 permissive product policies must be gone
  SELECT count(*) INTO v_cnt FROM pg_policies
  WHERE schemaname='public'
    AND policyname IN (
      'students_parent_select_product','students_parent_mutate_product',
      'answers_parent_via_student','guest_mode_settings_read_by_product'
    );
  IF v_cnt <> 0 THEN
    RAISE EXCEPTION 'ASSERT G11 FAIL: unsafe v1/v2 product policies still present';
  END IF;

  RAISE NOTICE 'STATIC ASSERTIONS G1-G11 PASSED';

  -- -------- Role / JWT dry-runs (must use non-bypass role; rolled back) --------
  SELECT id INTO v_uid FROM public.parent_profiles LIMIT 1;
  IF v_uid IS NULL THEN
    RAISE NOTICE 'JWT dry-run skipped: no parent_profiles';
    RETURN;
  END IF;

  INSERT INTO public.user_product_memberships (user_id, product_id, status, interface_language)
  VALUES (v_uid, 'leokids_il', 'active', 'he')
  ON CONFLICT DO NOTHING;
  INSERT INTO public.user_product_memberships (user_id, product_id, status, interface_language)
  VALUES (v_uid, 'leokids_global', 'active', 'en')
  ON CONFLICT DO NOTHING;

  SELECT count(*) INTO v_cnt FROM public.user_product_memberships
  WHERE user_id = v_uid AND product_id IN ('leokids_il','leokids_global');
  IF v_cnt <> 2 THEN
    RAISE EXCEPTION 'ASSERT G12 FAIL: dual membership must be exactly 2 rows, got %', v_cnt;
  END IF;

  INSERT INTO public.students (parent_id, full_name, grade_level, product_id)
  VALUES (v_uid, '__v3_il_probe__', 'g3', 'leokids_il')
  RETURNING id INTO v_il_sid;

  INSERT INTO public.students (parent_id, full_name, grade_level, product_id)
  VALUES (v_uid, '__v3_global_probe__', 'g3', 'leokids_global')
  RETURNING id INTO v_g_sid;

  -- Superuser bypasses RLS — switch to authenticated for real checks.
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', v_uid::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  SELECT count(*) INTO v_seen FROM public.students WHERE id = v_g_sid;
  IF v_seen <> 0 THEN
    RAISE EXCEPTION 'ASSERT G13 FAIL: authenticated can see Global student row';
  END IF;

  SELECT count(*) INTO v_seen FROM public.students WHERE id = v_il_sid;
  IF v_seen <> 1 THEN
    RAISE EXCEPTION 'ASSERT G14 FAIL: authenticated cannot see IL student (got %)', v_seen;
  END IF;

  -- Dual membership must NOT expose Global rows on the same authenticated path
  SELECT count(*) INTO v_seen FROM public.students
  WHERE parent_id = v_uid AND product_id = 'leokids_global';
  IF v_seen <> 0 THEN
    RAISE EXCEPTION 'ASSERT G14b FAIL: dual-membership user sees Global via authenticated path';
  END IF;

  BEGIN
    INSERT INTO public.user_product_memberships (user_id, product_id, status)
    VALUES (v_uid, 'leokids_global', 'active');
    RAISE EXCEPTION 'ASSERT G15 FAIL: authenticated inserted membership';
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM LIKE 'ASSERT G15%' THEN RAISE; END IF;
      NULL;
  END;

  BEGIN
    PERFORM public.ensure_user_product_membership(v_uid, 'leokids_global', 'en', 'en');
    RAISE EXCEPTION 'ASSERT G16 FAIL: authenticated executed ensure_user_product_membership';
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM LIKE 'ASSERT G16%' THEN RAISE; END IF;
      NULL;
  END;

  EXECUTE 'RESET ROLE';
  RAISE EXCEPTION 'v3_verification_rollback';
EXCEPTION
  WHEN OTHERS THEN
    BEGIN
      EXECUTE 'RESET ROLE';
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    IF SQLERRM = 'v3_verification_rollback' THEN
      RAISE NOTICE 'JWT/ROLE DRY-RUN ASSERTIONS PASSED (rolled back)';
    ELSE
      RAISE;
    END IF;
END $$;
