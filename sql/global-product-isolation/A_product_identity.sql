-- =============================================================================
-- Stage A — Product identity columns (Tier A tables)
-- Package: sql/global-product-isolation/
-- DO NOT EXECUTE without owner review and staging backup.
--
-- Purpose:
--   Add nullable product_id to product-private tables, index for filtering,
--   and backfill ALL existing rows to leokids_il (Israeli site origin).
--
-- Israeli site impact: NONE if backfill runs before global writes.
--   All current production data is Israeli → leokids_il.
--
-- Owner confirmation needed:
--   - Verify table names match live Supabase (grep pages/api for .from("...")).
--   - Confirm parent_profiles.id = auth.users.id (Leo Kids pattern).
--   - Confirm students.parent_id references parent_profiles.id or auth.users.id.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 0. Product ID domain (reused in later stages)
-- -----------------------------------------------------------------------------
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

COMMENT ON TYPE public.leokids_product_id IS
  'Leo Kids product identifier. leokids_il = Israeli site; leokids_global = international site.';

-- Helper: cast-safe product check for text columns (if ENUM not used on a table)
CREATE OR REPLACE FUNCTION public.is_valid_leokids_product_id(p text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p IN ('leokids_il', 'leokids_global');
$$;

-- -----------------------------------------------------------------------------
-- 1. parent_profiles — Tier A (account origin)
--     Confirmed in codebase: lib/parent-server/parent-session-ready.server.js
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.parent_profiles
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.parent_profiles.product_id IS
  'Product that owns this parent account row. Tier A — filter all reads/writes.';

-- Backfill existing Israeli parents
UPDATE public.parent_profiles
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

-- Default for IL app compatibility until both apps deploy product-aware writes
ALTER TABLE IF EXISTS public.parent_profiles
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'parent_profiles_product_id_check'
      AND conrelid = 'public.parent_profiles'::regclass
  ) THEN
    ALTER TABLE public.parent_profiles
      ADD CONSTRAINT parent_profiles_product_id_check
      CHECK (public.is_valid_leokids_product_id(product_id));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_parent_profiles_product_id
  ON public.parent_profiles (product_id);

CREATE INDEX IF NOT EXISTS idx_parent_profiles_product_created
  ON public.parent_profiles (product_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 2. students — Tier A (child belongs to one product)
--     Confirmed in codebase: pages/api/parent/*, pages/api/student/*
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.students.product_id IS
  'Product scope for this student. Tier A — must match parent product on create.';

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

CREATE INDEX IF NOT EXISTS idx_students_product_id
  ON public.students (product_id);

CREATE INDEX IF NOT EXISTS idx_students_parent_product
  ON public.students (parent_id, product_id);

-- Optional consistency: student product should match parent product.
-- Enable only after owner confirms parent_id FK target.
-- ALTER TABLE public.students
--   ADD CONSTRAINT students_parent_product_match
--   CHECK (
--     product_id = (
--       SELECT pp.product_id FROM public.parent_profiles pp WHERE pp.id = students.parent_id
--     )
--   );

-- -----------------------------------------------------------------------------
-- 3. parent_account_settings — Tier A (per-product subscription/settings)
--     [OWNER CONFIRM] table exists in production; grep admin/parent entitlement code.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.parent_account_settings
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.parent_account_settings.product_id IS
  'Tier A — subscription/entitlement scoped per product.';

UPDATE public.parent_account_settings
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

ALTER TABLE IF EXISTS public.parent_account_settings
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'parent_account_settings')
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint
       WHERE conname = 'parent_account_settings_product_id_check'
     ) THEN
    ALTER TABLE public.parent_account_settings
      ADD CONSTRAINT parent_account_settings_product_id_check
      CHECK (public.is_valid_leokids_product_id(product_id));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_parent_account_settings_product
  ON public.parent_account_settings (product_id);

-- -----------------------------------------------------------------------------
-- 4. parent_reports — Tier A (derived reports stored per parent)
--     [OWNER CONFIRM] if table stores denormalized parent_id directly.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.parent_reports
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.parent_reports.product_id IS
  'Tier A — parent-facing reports must not leak cross-product.';

UPDATE public.parent_reports
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_parent_reports_product_id
  ON public.parent_reports (product_id);

-- -----------------------------------------------------------------------------
-- 5. parent_copilot_usage_log — Tier A
--     [OWNER CONFIRM] table name from copilot billing/analytics.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.parent_copilot_usage_log
  ADD COLUMN IF NOT EXISTS product_id text;

UPDATE public.parent_copilot_usage_log
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_parent_copilot_usage_product
  ON public.parent_copilot_usage_log (product_id);

-- -----------------------------------------------------------------------------
-- 6. student_access_codes — Tier A adjunct (codes belong to product-scoped student)
--     Confirmed: pages/api/parent/create-student-access-code.js
--     Strategy: derive via student_id join OR denormalize product_id for index speed.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.student_access_codes
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.student_access_codes.product_id IS
  'Denormalized from students.product_id for fast login lookup. Keep in sync on insert.';

UPDATE public.student_access_codes sac
SET product_id = s.product_id
FROM public.students s
WHERE sac.student_id = s.id
  AND sac.product_id IS NULL;

UPDATE public.student_access_codes
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_student_access_codes_product
  ON public.student_access_codes (product_id, code);

COMMIT;

-- -----------------------------------------------------------------------------
-- Post-stage notes (NOT NULL deferred to after global app deploy — see README)
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.parent_profiles ALTER COLUMN product_id SET NOT NULL;
-- ALTER TABLE public.students ALTER COLUMN product_id SET NOT NULL;
