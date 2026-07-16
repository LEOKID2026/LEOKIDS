-- =============================================================================
-- Stage D — guest_mode_settings product scope
-- Package: sql/global-product-isolation-v2/
-- DO NOT EXECUTE without owner review.
--
-- Before: PRIMARY KEY (setting_key)
-- After:  PRIMARY KEY (product_id, setting_key)
-- Existing rows → leokids_il. Global guest stays disabled until explicitly enabled.
-- =============================================================================

BEGIN;

ALTER TABLE IF EXISTS public.guest_mode_settings
  ADD COLUMN IF NOT EXISTS product_id text;

UPDATE public.guest_mode_settings
SET product_id = 'leokids_il'
WHERE product_id IS NULL;

ALTER TABLE IF EXISTS public.guest_mode_settings
  ALTER COLUMN product_id SET DEFAULT 'leokids_il';

ALTER TABLE public.guest_mode_settings
  ALTER COLUMN product_id SET NOT NULL;

DO $$
DECLARE
  pk_name text;
BEGIN
  SELECT c.conname INTO pk_name
  FROM pg_constraint c
  WHERE c.conrelid = 'public.guest_mode_settings'::regclass
    AND c.contype = 'p';

  IF pk_name IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint c
      JOIN pg_attribute a1 ON a1.attrelid = c.conrelid AND a1.attnum = c.conkey[1]
      JOIN pg_attribute a2 ON a2.attrelid = c.conrelid AND a2.attnum = c.conkey[2]
      WHERE c.conrelid = 'public.guest_mode_settings'::regclass
        AND c.contype = 'p'
        AND a1.attname = 'product_id'
        AND a2.attname = 'setting_key'
        AND array_length(c.conkey, 1) = 2
    ) THEN
      EXECUTE format('ALTER TABLE public.guest_mode_settings DROP CONSTRAINT %I', pk_name);
      ALTER TABLE public.guest_mode_settings
        ADD CONSTRAINT guest_mode_settings_pkey
        PRIMARY KEY (product_id, setting_key);
    END IF;
  ELSE
    ALTER TABLE public.guest_mode_settings
      ADD CONSTRAINT guest_mode_settings_pkey
      PRIMARY KEY (product_id, setting_key);
  END IF;
END $$;

-- Seed Global guest settings as disabled (do not copy IL enabled state).
INSERT INTO public.guest_mode_settings (product_id, setting_key, setting_value_json)
VALUES
  ('leokids_global', 'guest_mode_enabled', '{"enabled": false}'::jsonb),
  ('leokids_global', 'guest_defaults', '{"games_per_category": 2, "topics_per_subject": 2}'::jsonb),
  ('leokids_global', 'guest_economy', '{"shop_enabled": true, "cards_enabled": true}'::jsonb),
  ('leokids_global', 'surprise_box_guest_settings', '{"max_pending_boxes": 1, "cards_per_open": 1, "coin_prizes_per_open": 1, "box_interval_minutes": 180, "first_box_immediate": true, "prevent_duplicate_in_box": true}'::jsonb)
ON CONFLICT (product_id, setting_key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_v2_guest_mode_settings_product
  ON public.guest_mode_settings (product_id);

COMMIT;
