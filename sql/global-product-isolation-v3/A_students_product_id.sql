-- =============================================================================
-- Stage A — students.product_id (+ optional access_codes denorm)
-- DO NOT touch parent_account_settings / guest_mode_settings / parent_profiles PK.
-- Indexes use code_hash (real column).
-- =============================================================================

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'leokids_product_id' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.leokids_product_id AS ENUM ('leokids_il', 'leokids_global');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.is_valid_leokids_product_id(p text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p IN ('leokids_il', 'leokids_global');
$$;

ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.students.product_id IS
  'Product scope. Existing rows backfilled to leokids_il. Default leokids_il for IL app.';

UPDATE public.students
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

ALTER TABLE IF EXISTS public.students
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'students_product_id_check'
      AND conrelid = 'public.students'::regclass
  ) THEN
    ALTER TABLE public.students
      ADD CONSTRAINT students_product_id_check
      CHECK (public.is_valid_leokids_product_id(product_id));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_v3_students_product_id ON public.students (product_id);
CREATE INDEX IF NOT EXISTS idx_v3_students_parent_product ON public.students (parent_id, product_id);

-- Optional denorm on access codes
ALTER TABLE IF EXISTS public.student_access_codes
  ADD COLUMN IF NOT EXISTS product_id text;

UPDATE public.student_access_codes sac
SET product_id = s.product_id
FROM public.students s
WHERE sac.student_id = s.id AND sac.product_id IS NULL;

UPDATE public.student_access_codes
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_v3_sac_product_code_hash
  ON public.student_access_codes (product_id, code_hash);

CREATE OR REPLACE FUNCTION public.trg_v3_sync_access_code_product_id()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT s.product_id INTO NEW.product_id
  FROM public.students s WHERE s.id = NEW.student_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_v3_sync_access_code_product_id ON public.student_access_codes;
CREATE TRIGGER trg_v3_sync_access_code_product_id
  BEFORE INSERT OR UPDATE OF student_id ON public.student_access_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_v3_sync_access_code_product_id();

-- Optional label on parent_reports / copilot (no PK changes)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='parent_reports') THEN
    EXECUTE 'ALTER TABLE public.parent_reports ADD COLUMN IF NOT EXISTS product_id text';
    EXECUTE $u$UPDATE public.parent_reports pr SET product_id = s.product_id FROM public.students s WHERE pr.student_id = s.id AND pr.product_id IS NULL$u$;
    EXECUTE $u$UPDATE public.parent_reports SET product_id = 'leokids_il' WHERE product_id IS NULL$u$;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='parent_copilot_usage_log') THEN
    EXECUTE 'ALTER TABLE public.parent_copilot_usage_log ADD COLUMN IF NOT EXISTS product_id text';
    EXECUTE $u$UPDATE public.parent_copilot_usage_log SET product_id = 'leokids_il' WHERE product_id IS NULL$u$;
  END IF;
END $$;

COMMIT;
