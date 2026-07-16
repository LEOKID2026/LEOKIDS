-- Rollback Stage A — only safe if no Global students exist.
DO $$
BEGIN
  IF current_setting('v2.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_A' THEN
    RAISE EXCEPTION 'Refusing R_A_students: set v2.rollback_confirm = YES_STAGE_A';
  END IF;

  IF EXISTS (SELECT 1 FROM public.students WHERE product_id = 'leokids_global') THEN
    RAISE EXCEPTION 'Global students exist — refusing to drop product_id labeling';
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_v2_sync_access_code_product_id ON public.student_access_codes;
DROP FUNCTION IF EXISTS public.trg_sync_access_code_product_id();
DROP INDEX IF EXISTS idx_v2_students_product_id;
DROP INDEX IF EXISTS idx_v2_students_parent_product;
DROP INDEX IF EXISTS idx_v2_student_access_codes_product_code_hash;
DROP INDEX IF EXISTS idx_v2_student_access_codes_code_hash_active;

ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_product_id_check;
ALTER TABLE public.student_access_codes DROP CONSTRAINT IF EXISTS student_access_codes_product_id_check;

-- Keep columns by default (safer). Uncomment to drop:
-- ALTER TABLE public.students DROP COLUMN IF EXISTS product_id;
-- ALTER TABLE public.student_access_codes DROP COLUMN IF EXISTS product_id;
