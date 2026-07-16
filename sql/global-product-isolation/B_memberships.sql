-- =============================================================================
-- Stage B — user_product_memberships
-- Package: sql/global-product-isolation/
-- DO NOT EXECUTE without owner review.
--
-- Purpose:
--   Same auth.users email may hold separate memberships per product.
--   Login on leokids_global checks membership for leokids_global only.
--   IL parent logging into global → offer "create global account", not auto-merge.
--
-- Israeli site impact: NONE — existing users get leokids_il membership on backfill.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Memberships table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_product_memberships (
  user_id                   uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id                text        NOT NULL,
  status                    text        NOT NULL DEFAULT 'active',
  interface_language        text,
  preferred_report_language text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT user_product_memberships_product_id_check
    CHECK (public.is_valid_leokids_product_id(product_id)),
  CONSTRAINT user_product_memberships_status_check
    CHECK (status IN ('active', 'suspended', 'pending'))
);

COMMENT ON TABLE public.user_product_memberships IS
  'Maps auth.users to Leo Kids products. One row per (user, product). '
  'Enables same email on IL and global without merging student data.';

COMMENT ON COLUMN public.user_product_memberships.interface_language IS
  'UI locale for this product membership (e.g. en, he, es). Distinct from report language.';

COMMENT ON COLUMN public.user_product_memberships.preferred_report_language IS
  'Language for emailed/printed parent reports for this product.';

CREATE INDEX IF NOT EXISTS idx_user_product_memberships_product
  ON public.user_product_memberships (product_id, status);

CREATE INDEX IF NOT EXISTS idx_user_product_memberships_user_active
  ON public.user_product_memberships (user_id)
  WHERE status = 'active';

-- -----------------------------------------------------------------------------
-- 2. updated_at trigger (Supabase convention)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_product_memberships_updated_at ON public.user_product_memberships;

CREATE TRIGGER trg_user_product_memberships_updated_at
  BEFORE UPDATE ON public.user_product_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -----------------------------------------------------------------------------
-- 3. Backfill IL memberships for existing parent_profiles
--    [OWNER CONFIRM] extend to teacher_profiles / school_accounts if those
--    personas also need product-scoped membership checks.
-- -----------------------------------------------------------------------------
INSERT INTO public.user_product_memberships (
  user_id,
  product_id,
  status,
  interface_language,
  preferred_report_language
)
SELECT
  pp.id,
  COALESCE(pp.product_id, 'leokids_il'),
  'active',
  COALESCE(pp.preferred_language, 'he'),
  COALESCE(pp.preferred_language, 'he')
FROM public.parent_profiles pp
ON CONFLICT (user_id, product_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Helper RPC stub (app may call after signup)
--    Server validates product_id against request origin / env, not client alone.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_user_product_membership(
  p_user_id uuid,
  p_product_id text,
  p_interface_language text DEFAULT NULL
)
RETURNS public.user_product_memberships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.user_product_memberships;
BEGIN
  IF NOT public.is_valid_leokids_product_id(p_product_id) THEN
    RAISE EXCEPTION 'invalid product_id: %', p_product_id;
  END IF;

  INSERT INTO public.user_product_memberships (
    user_id,
    product_id,
    status,
    interface_language
  )
  VALUES (
    p_user_id,
    p_product_id,
    'active',
    p_interface_language
  )
  ON CONFLICT (user_id, product_id) DO UPDATE
    SET status = 'active',
        interface_language = COALESCE(EXCLUDED.interface_language, user_product_memberships.interface_language),
        updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

COMMENT ON FUNCTION public.ensure_user_product_membership IS
  'Idempotent membership upsert. Call from service-role API after parent/teacher signup. '
  'Global app must pass leokids_global; IL app must pass leokids_il.';

REVOKE ALL ON FUNCTION public.ensure_user_product_membership FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_user_product_membership TO service_role;

COMMIT;
