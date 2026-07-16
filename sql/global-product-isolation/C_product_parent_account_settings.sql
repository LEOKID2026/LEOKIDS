-- =============================================================================
-- Stage C — product_parent_account_settings (NEW)
-- Legacy parent_account_settings PK (parent_user_id) is NOT altered.
-- IL continues using parent_account_settings unchanged.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.product_parent_account_settings (
  parent_user_id               uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id                   text        NOT NULL,
  plan_code                    text        NOT NULL DEFAULT 'free' CHECK (plan_code IN (
                                             'free', 'trial', 'basic', 'family', 'premium', 'school_linked'
                                           )),
  account_status               text        NOT NULL DEFAULT 'active' CHECK (account_status IN (
                                             'active', 'trial', 'suspended', 'cancelled'
                                           )),
  subscription_status          text        NULL CHECK (subscription_status IS NULL OR subscription_status IN (
                                             'active', 'trial', 'past_due', 'cancelled'
                                           )),
  max_children                 integer     NOT NULL DEFAULT 3 CHECK (max_children >= 0),
  reports_enabled              boolean     NOT NULL DEFAULT true,
  copilot_enabled              boolean     NOT NULL DEFAULT false,
  advanced_diagnostics_enabled boolean     NOT NULL DEFAULT false,
  export_enabled               boolean     NOT NULL DEFAULT false,
  monthly_ai_limit             integer     NULL CHECK (monthly_ai_limit IS NULL OR monthly_ai_limit >= 0),
  monthly_report_limit         integer     NULL CHECK (monthly_report_limit IS NULL OR monthly_report_limit >= 0),
  billing_provider             text        NULL,
  provider_customer_id         text        NULL,
  provider_subscription_id     text        NULL,
  trial_ends_at                timestamptz NULL,
  current_period_ends_at       timestamptz NULL,
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (parent_user_id, product_id),
  CONSTRAINT product_parent_account_settings_product_id_check
    CHECK (public.is_valid_leokids_product_id(product_id))
);

COMMENT ON TABLE public.product_parent_account_settings IS
  'Product-scoped parent settings. Global app only. IL uses parent_account_settings.';

CREATE INDEX IF NOT EXISTS idx_v3_ppas_product
  ON public.product_parent_account_settings (product_id);

DROP TRIGGER IF EXISTS trg_v3_ppas_updated_at ON public.product_parent_account_settings;
CREATE TRIGGER trg_v3_ppas_updated_at
  BEFORE UPDATE ON public.product_parent_account_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

ALTER TABLE public.product_parent_account_settings ENABLE ROW LEVEL SECURITY;

-- Authenticated: IL-scoped select only (Global rows via service role / RESTRICTIVE in F).
DROP POLICY IF EXISTS v3_ppas_authenticated_il_select ON public.product_parent_account_settings;
CREATE POLICY v3_ppas_authenticated_il_select
  ON public.product_parent_account_settings
  FOR SELECT
  TO authenticated
  USING (
    parent_user_id = auth.uid()
    AND product_id = 'leokids_il'
  );

-- Assert legacy table PK unchanged (fail stage if someone altered it earlier)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute a1 ON a1.attrelid = c.conrelid AND a1.attnum = c.conkey[1]
    WHERE c.conrelid = 'public.parent_account_settings'::regclass
      AND c.contype = 'p'
      AND array_length(c.conkey, 1) = 2
  ) THEN
    RAISE EXCEPTION 'LEGACY BREAK: parent_account_settings PK is composite — abort Stage C';
  END IF;
END $$;

COMMIT;
