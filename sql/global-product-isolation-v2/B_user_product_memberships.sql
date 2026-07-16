-- =============================================================================
-- Stage B — user_product_memberships (membership SoT)
-- Package: sql/global-product-isolation-v2/
-- DO NOT EXECUTE without owner review.
--
-- Same auth.users may have both leokids_il and leokids_global rows.
-- Backfill IL only — never auto-create Global membership for all users.
-- parent_profiles stays shared (no product_id membership column).
-- =============================================================================

BEGIN;

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
  'Source of truth for product membership. parent_profiles is shared profile only.';

CREATE INDEX IF NOT EXISTS idx_v2_upm_product_status
  ON public.user_product_memberships (product_id, status);

CREATE INDEX IF NOT EXISTS idx_v2_upm_user_active
  ON public.user_product_memberships (user_id)
  WHERE status = 'active';

CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_v2_upm_updated_at ON public.user_product_memberships;
CREATE TRIGGER trg_v2_upm_updated_at
  BEFORE UPDATE ON public.user_product_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-- IL backfill from existing parent profiles only
INSERT INTO public.user_product_memberships (
  user_id,
  product_id,
  status,
  interface_language,
  preferred_report_language
)
SELECT
  pp.id,
  'leokids_il',
  'active',
  COALESCE(pp.preferred_language, 'he'),
  COALESCE(pp.preferred_language, 'he')
FROM public.parent_profiles pp
ON CONFLICT (user_id, product_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.ensure_user_product_membership(
  p_user_id uuid,
  p_product_id text,
  p_interface_language text DEFAULT NULL,
  p_preferred_report_language text DEFAULT NULL
)
RETURNS public.user_product_memberships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.user_product_memberships;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id AND current_setting('role', true) <> 'service_role' THEN
    -- Allow service_role; for authenticated require self.
    IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role'
       AND auth.uid() IS DISTINCT FROM p_user_id THEN
      RAISE EXCEPTION 'ensure_user_product_membership: forbidden';
    END IF;
  END IF;

  IF NOT public.is_valid_leokids_product_id(p_product_id) THEN
    RAISE EXCEPTION 'invalid product_id: %', p_product_id;
  END IF;

  INSERT INTO public.user_product_memberships (
    user_id,
    product_id,
    status,
    interface_language,
    preferred_report_language
  )
  VALUES (
    p_user_id,
    p_product_id,
    'active',
    p_interface_language,
    COALESCE(p_preferred_report_language, p_interface_language)
  )
  ON CONFLICT (user_id, product_id) DO UPDATE
  SET
    status = 'active',
    interface_language = COALESCE(EXCLUDED.interface_language, public.user_product_memberships.interface_language),
    preferred_report_language = COALESCE(
      EXCLUDED.preferred_report_language,
      public.user_product_memberships.preferred_report_language
    ),
    updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) TO authenticated;

COMMIT;
