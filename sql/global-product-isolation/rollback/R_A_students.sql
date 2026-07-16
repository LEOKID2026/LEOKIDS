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

ALTER TABLE IF EXISTS public.student_access_codes
  DROP CONSTRAINT IF EXISTS student_access_codes_product_id_check;

ALTER TABLE IF EXISTS public.students
  DROP CONSTRAINT IF EXISTS students_product_id_check;

-- Reverse NOT NULL (columns kept; safer than DROP COLUMN).
ALTER TABLE IF EXISTS public.students
  ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE IF EXISTS public.student_access_codes
  ALTER COLUMN product_id DROP NOT NULL;

-- Legacy unused enum from earlier Stage A drafts (columns use text + CHECK).
DROP TYPE IF EXISTS public.leokids_product_id;
