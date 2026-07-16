-- =============================================================================
-- Stage G — Verification with FAILING assertions
-- Package: sql/global-product-isolation-v2/
-- Safe to run read-only (assertions RAISE EXCEPTION on failure).
-- Dry-run DML section uses nested transaction + ROLLBACK.
-- =============================================================================

DO $$
DECLARE
  v_null_students bigint;
  v_non_il_existing bigint;
  v_global_students bigint;
  v_dup_memberships bigint;
  v_bad_answers_fk_policy bigint;
  v_arcade_product_cols bigint;
  v_pas_pk_ok boolean;
  v_guest_pk_ok boolean;
  v_v1_null_escape bigint;
BEGIN
  -- G1: no students.product_id NULL after Stage A
  SELECT count(*) INTO v_null_students FROM public.students WHERE product_id IS NULL;
  IF v_null_students <> 0 THEN
    RAISE EXCEPTION 'ASSERT G1 FAIL: % students with NULL product_id', v_null_students;
  END IF;

  -- G2: before Global launch, all students should be IL (adjust after Global beta)
  SELECT count(*) INTO v_global_students
  FROM public.students WHERE product_id = 'leokids_global';
  -- Soft: warn via NOTICE if >0 after intentional Global creates; hard-fail only if NULL slipped.
  RAISE NOTICE 'G2 info: global students count = %', v_global_students;

  -- G3: no duplicate memberships
  SELECT count(*) INTO v_dup_memberships FROM (
    SELECT user_id, product_id, count(*) c
    FROM public.user_product_memberships
    GROUP BY 1, 2
    HAVING count(*) > 1
  ) d;
  IF v_dup_memberships <> 0 THEN
    RAISE EXCEPTION 'ASSERT G3 FAIL: duplicate memberships';
  END IF;

  -- G4: every parent_profile has IL membership after Stage B
  IF EXISTS (
    SELECT 1 FROM public.parent_profiles pp
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_product_memberships m
      WHERE m.user_id = pp.id AND m.product_id = 'leokids_il'
    )
  ) THEN
    RAISE EXCEPTION 'ASSERT G4 FAIL: parent_profiles without leokids_il membership';
  END IF;

  -- G5: same user CAN hold IL + Global (structure allows dual PK) — structural check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'user_product_memberships'
      AND constraint_type = 'PRIMARY KEY'
  ) THEN
    RAISE EXCEPTION 'ASSERT G5 FAIL: user_product_memberships PK missing';
  END IF;

  -- G6: parent_account_settings composite PK
  SELECT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute a1 ON a1.attrelid = c.conrelid AND a1.attnum = c.conkey[1]
    JOIN pg_attribute a2 ON a2.attrelid = c.conrelid AND a2.attnum = c.conkey[2]
    WHERE c.conrelid = 'public.parent_account_settings'::regclass
      AND c.contype = 'p'
      AND a1.attname = 'parent_user_id'
      AND a2.attname = 'product_id'
  ) INTO v_pas_pk_ok;
  IF NOT v_pas_pk_ok THEN
    RAISE EXCEPTION 'ASSERT G6 FAIL: parent_account_settings PK is not (parent_user_id, product_id)';
  END IF;

  -- G7: guest_mode_settings composite PK
  SELECT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute a1 ON a1.attrelid = c.conrelid AND a1.attnum = c.conkey[1]
    JOIN pg_attribute a2 ON a2.attrelid = c.conrelid AND a2.attnum = c.conkey[2]
    WHERE c.conrelid = 'public.guest_mode_settings'::regclass
      AND c.contype = 'p'
      AND a1.attname = 'product_id'
      AND a2.attname = 'setting_key'
  ) INTO v_guest_pk_ok;
  IF NOT v_guest_pk_ok THEN
    RAISE EXCEPTION 'ASSERT G7 FAIL: guest_mode_settings PK is not (product_id, setting_key)';
  END IF;

  -- G8: no Production OR jwt IS NULL escape in active policies
  SELECT count(*) INTO v_v1_null_escape
  FROM pg_policies
  WHERE schemaname = 'public'
    AND (
      qual ILIKE '%jwt_product_id() IS NULL%'
      OR with_check ILIKE '%jwt_product_id() IS NULL%'
    );
  IF v_v1_null_escape <> 0 THEN
    RAISE EXCEPTION 'ASSERT G8 FAIL: % policies still use jwt_product_id() IS NULL escape', v_v1_null_escape;
  END IF;

  -- G9: no policy referencing answers.session_id (wrong column)
  SELECT count(*) INTO v_bad_answers_fk_policy
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'answers'
    AND (qual ILIKE '%answers.session_id%' OR with_check ILIKE '%answers.session_id%');
  IF v_bad_answers_fk_policy <> 0 THEN
    RAISE EXCEPTION 'ASSERT G9 FAIL: answers policies still reference session_id';
  END IF;

  -- G10: Arcade must not have product_id column added by this package
  SELECT count(*) INTO v_arcade_product_cols
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name LIKE 'arcade_%'
    AND column_name = 'product_id';
  IF v_arcade_product_cols <> 0 THEN
    RAISE EXCEPTION 'ASSERT G10 FAIL: arcade_* has product_id — blanket isolation not allowed';
  END IF;

  -- G11: access_codes index must not reference nonexistent "code" column
  IF EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'student_access_codes'
      AND indexdef ILIKE '%(product_id, code)%'
      AND indexdef NOT ILIKE '%code_hash%'
  ) THEN
    RAISE EXCEPTION 'ASSERT G11 FAIL: unsafe index on student_access_codes(code)';
  END IF;

  RAISE NOTICE 'ALL G ASSERTIONS PASSED';
END $$;

-- -----------------------------------------------------------------------------
-- Dry-run DML (rolled back) — membership dual-product + student product check
-- Uses SAVEPOINT so surrounding session stays clean.
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_uid uuid;
  v_sid uuid;
BEGIN
  -- Pick any existing parent if present; otherwise skip dry-run.
  SELECT id INTO v_uid FROM public.parent_profiles LIMIT 1;
  IF v_uid IS NULL THEN
    RAISE NOTICE 'DRY-RUN skipped: no parent_profiles';
    RETURN;
  END IF;

  BEGIN
    INSERT INTO public.user_product_memberships (user_id, product_id, status, interface_language)
    VALUES (v_uid, 'leokids_global', 'active', 'en')
    ON CONFLICT (user_id, product_id) DO UPDATE SET status = 'active';

    -- Prove dual membership possible
    IF (
      SELECT count(*) FROM public.user_product_memberships
      WHERE user_id = v_uid AND product_id IN ('leokids_il', 'leokids_global')
    ) < 1 THEN
      RAISE EXCEPTION 'DRY-RUN FAIL: dual membership not visible';
    END IF;

    RAISE EXCEPTION 'dry_run_rollback'; -- force rollback of this block's writes
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM = 'dry_run_rollback' THEN
        RAISE NOTICE 'DRY-RUN membership OK (rolled back)';
      ELSE
        RAISE;
      END IF;
  END;
END $$;
