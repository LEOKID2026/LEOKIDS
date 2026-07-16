-- =============================================================================
-- Stage D — product_guest_mode_settings (NEW)
-- Legacy guest_mode_settings PK (setting_key) is NOT altered.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.product_guest_mode_settings (
  product_id         text        NOT NULL,
  setting_key        text        NOT NULL,
  setting_value_json jsonb       NOT NULL DEFAULT '{}'::jsonb,
  updated_at         timestamptz NOT NULL DEFAULT now(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, setting_key),
  CONSTRAINT product_guest_mode_settings_product_id_check
    CHECK (public.is_valid_leokids_product_id(product_id)),
  CONSTRAINT product_guest_mode_settings_value_json_chk
    CHECK (jsonb_typeof(setting_value_json) IN ('object', 'array', 'boolean', 'number'))
);

COMMENT ON TABLE public.product_guest_mode_settings IS
  'Product-scoped guest settings. Global app only. IL uses guest_mode_settings.';

INSERT INTO public.product_guest_mode_settings (product_id, setting_key, setting_value_json)
VALUES
  ('leokids_global', 'guest_mode_enabled', '{"enabled": false}'::jsonb),
  ('leokids_global', 'guest_defaults', '{"games_per_category": 2, "topics_per_subject": 2}'::jsonb),
  ('leokids_global', 'guest_economy', '{"shop_enabled": true, "cards_enabled": true}'::jsonb),
  ('leokids_global', 'surprise_box_guest_settings', '{"max_pending_boxes": 1, "cards_per_open": 1, "coin_prizes_per_open": 1, "box_interval_minutes": 180, "first_box_immediate": true, "prevent_duplicate_in_box": true}'::jsonb)
ON CONFLICT (product_id, setting_key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_v3_pgms_product
  ON public.product_guest_mode_settings (product_id);

ALTER TABLE public.product_guest_mode_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS v3_pgms_authenticated_il_select ON public.product_guest_mode_settings;
CREATE POLICY v3_pgms_authenticated_il_select
  ON public.product_guest_mode_settings
  FOR SELECT
  TO authenticated
  USING (product_id = 'leokids_il');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute a1 ON a1.attrelid = c.conrelid AND a1.attnum = c.conkey[1]
    WHERE c.conrelid = 'public.guest_mode_settings'::regclass
      AND c.contype = 'p'
      AND array_length(c.conkey, 1) = 2
  ) THEN
    RAISE EXCEPTION 'LEGACY BREAK: guest_mode_settings PK is composite — abort Stage D';
  END IF;
END $$;

COMMIT;
