-- =============================================================================
-- Stage D — Product-scoped settings (Tier C)
-- Package: sql/global-product-isolation/
-- DO NOT EXECUTE without owner review.
--
-- Purpose:
--   guest_mode_settings and subject permission defaults differ per product.
--   Global site: 4 subjects (Math, Geometry, English, Science).
--   IL site: Hebrew curriculum subjects (existing catalog).
--
-- Israeli site impact: NONE — backfill existing rows to leokids_il.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. guest_mode_settings — per-product guest toggles
--     Confirmed: scripts/qa/guest-mode-browser-qa.mjs, lib/guest/*
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.guest_mode_settings
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.guest_mode_settings.product_id IS
  'Tier C — guest mode config is per product. Global guest parent is separate from IL.';

UPDATE public.guest_mode_settings
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

ALTER TABLE IF EXISTS public.guest_mode_settings
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'guest_mode_settings'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'guest_mode_settings_product_id_check'
  ) THEN
    ALTER TABLE public.guest_mode_settings
      ADD CONSTRAINT guest_mode_settings_product_id_check
      CHECK (public.is_valid_leokids_product_id(product_id));
  END IF;
END $$;

-- One settings row per product (adjust if live schema uses singleton row)
CREATE UNIQUE INDEX IF NOT EXISTS uq_guest_mode_settings_product
  ON public.guest_mode_settings (product_id);

-- Seed global row (disabled by default — owner enables when global guest launches)
INSERT INTO public.guest_mode_settings (product_id)
VALUES ('leokids_global')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. subject_permission_catalog — product-specific subject list
--     Confirmed: lib/learning/subject-permissions/subject-access.server.js
--     [OWNER CONFIRM] whether catalog is shared with product_id filter or split tables.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.subject_permission_catalog
  ADD COLUMN IF NOT EXISTS product_id text;

COMMENT ON COLUMN public.subject_permission_catalog.product_id IS
  'Tier C — subject catalog entries may differ by product (IL Hebrew vs global EN).';

UPDATE public.subject_permission_catalog
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

ALTER TABLE IF EXISTS public.subject_permission_catalog
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

CREATE INDEX IF NOT EXISTS idx_subject_permission_catalog_product
  ON public.subject_permission_catalog (product_id, is_active);

-- Example global catalog seeds (STAGED — owner adjusts subject_key values to match app)
-- INSERT INTO public.subject_permission_catalog (subject_key, display_name_he, product_id, is_active, sort_order)
-- VALUES
--   ('math',      'Math',      'leokids_global', true, 10),
--   ('geometry',  'Geometry',  'leokids_global', true, 20),
--   ('english',   'English',   'leokids_global', true, 30),
--   ('science',   'Science',   'leokids_global', true, 40)
-- ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. subject_permission_defaults — grade-level defaults per product
--     [OWNER CONFIRM] exact table name: may be subject_grade_defaults or similar.
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.subject_permission_defaults
  ADD COLUMN IF NOT EXISTS product_id text;

UPDATE public.subject_permission_defaults
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_subject_permission_defaults_product
  ON public.subject_permission_defaults (product_id, grade_key);

-- -----------------------------------------------------------------------------
-- 4. student_subject_permissions — per-student overrides (Tier B/C boundary)
--     Rows tie to student_id; product derived via students.product_id.
--     NO product_id column needed if all queries join students.
--     Optional denormalization for admin list performance:
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.student_subject_permissions
--   ADD COLUMN IF NOT EXISTS product_id text;
--
-- UPDATE public.student_subject_permissions ssp
-- SET product_id = st.product_id
-- FROM public.students st
-- WHERE ssp.student_id = st.id AND ssp.product_id IS NULL;

-- -----------------------------------------------------------------------------
-- 5. guest_* access tables — scope via guest parent per product
--     guest_learning_access, guest_game_access — scripts/qa, pages/api/admin/guest/*
--     Strategy: guest system parent email per product (env GUEST_SYSTEM_PARENT_EMAIL).
--     Students under guest parent must have students.product_id matching product.
-- -----------------------------------------------------------------------------

COMMIT;
