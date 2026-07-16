DO $$ BEGIN
  IF current_setting('v3.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_F' THEN
    RAISE EXCEPTION 'Refusing R_F: set v3.rollback_confirm=YES_STAGE_F';
  END IF;
END $$;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname='public' AND policyname LIKE 'v3_restrict_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS public.v3_student_is_il_visible(uuid);
DROP FUNCTION IF EXISTS public.v3_product_is_il(text);
