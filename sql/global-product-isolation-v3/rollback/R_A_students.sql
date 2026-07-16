DO $$ BEGIN
  IF current_setting('v3.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_A' THEN
    RAISE EXCEPTION 'Refusing R_A: set v3.rollback_confirm=YES_STAGE_A';
  END IF;
  IF EXISTS (SELECT 1 FROM public.students WHERE product_id = 'leokids_global') THEN
    RAISE EXCEPTION 'Global students exist — refusing Stage A rollback';
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_v3_sync_access_code_product_id ON public.student_access_codes;
DROP FUNCTION IF EXISTS public.trg_v3_sync_access_code_product_id();
DROP INDEX IF EXISTS idx_v3_students_product_id;
DROP INDEX IF EXISTS idx_v3_students_parent_product;
DROP INDEX IF EXISTS idx_v3_sac_product_code_hash;
-- Keep product_id columns by default (safer).
