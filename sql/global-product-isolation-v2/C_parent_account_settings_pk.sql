-- =============================================================================
-- Stage C — parent_account_settings product-scoped PK
-- Package: sql/global-product-isolation-v2/
-- DO NOT EXECUTE without owner review.
--
-- Before: PRIMARY KEY (parent_user_id)
-- After:  PRIMARY KEY (parent_user_id, product_id)
-- Existing rows → product_id = leokids_il (data preserved).
-- =============================================================================

BEGIN;

ALTER TABLE IF EXISTS public.parent_account_settings
  ADD COLUMN IF NOT EXISTS product_id text;

UPDATE public.parent_account_settings
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

ALTER TABLE IF EXISTS public.parent_account_settings
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'parent_account_settings_product_id_check'
      AND conrelid = 'public.parent_account_settings'::regclass
  ) THEN
    ALTER TABLE public.parent_account_settings
      ADD CONSTRAINT parent_account_settings_product_id_check
      CHECK (public.is_valid_leokids_product_id(product_id));
  END IF;
END $$;

ALTER TABLE public.parent_account_settings
  ALTER COLUMN product_id SET NOT NULL;

-- Drop single-column PK if present, then add composite PK.
DO $$
DECLARE
  pk_name text;
BEGIN
  SELECT c.conname INTO pk_name
  FROM pg_constraint c
  WHERE c.conrelid = 'public.parent_account_settings'::regclass
    AND c.contype = 'p';

  IF pk_name IS NOT NULL THEN
    -- Only rebuild if PK is not already composite (parent_user_id, product_id)
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint c
      JOIN pg_attribute a1 ON a1.attrelid = c.conrelid AND a1.attnum = c.conkey[1]
      JOIN pg_attribute a2 ON a2.attrelid = c.conrelid AND a2.attnum = c.conkey[2]
      WHERE c.conrelid = 'public.parent_account_settings'::regclass
        AND c.contype = 'p'
        AND a1.attname = 'parent_user_id'
        AND a2.attname = 'product_id'
        AND array_length(c.conkey, 1) = 2
    ) THEN
      EXECUTE format('ALTER TABLE public.parent_account_settings DROP CONSTRAINT %I', pk_name);
      ALTER TABLE public.parent_account_settings
        ADD CONSTRAINT parent_account_settings_pkey
        PRIMARY KEY (parent_user_id, product_id);
    END IF;
  ELSE
    ALTER TABLE public.parent_account_settings
      ADD CONSTRAINT parent_account_settings_pkey
      PRIMARY KEY (parent_user_id, product_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_v2_pas_product
  ON public.parent_account_settings (product_id);

COMMENT ON COLUMN public.parent_account_settings.product_id IS
  'Tier A — settings/subscription scoped per product. Same parent may have IL + Global rows.';

COMMIT;
