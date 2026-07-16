-- =============================================================================
-- Stage B — user_product_memberships (membership SoT)
-- - Backfill IL for existing parents
-- - Auto-create IL membership when IL student is inserted (no IL app code change)
-- - ensure_user_product_membership: service_role ONLY; never reactivates suspended
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
  'Product membership SoT. parent_profiles stays shared. Clients cannot self-grant.';

CREATE INDEX IF NOT EXISTS idx_v3_upm_product_status
  ON public.user_product_memberships (product_id, status);

CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_v3_upm_updated_at ON public.user_product_memberships;
CREATE TRIGGER trg_v3_upm_updated_at
  BEFORE UPDATE ON public.user_product_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-- Existing parents → IL membership only (never auto Global)
INSERT INTO public.user_product_memberships (
  user_id, product_id, status, interface_language, preferred_report_language
)
SELECT
  pp.id,
  'leokids_il',
  'active',
  COALESCE(pp.preferred_language, 'he'),
  COALESCE(pp.preferred_language, 'he')
FROM public.parent_profiles pp
ON CONFLICT (user_id, product_id) DO NOTHING;

-- IL app compat: when a student is created with leokids_il (default), ensure IL membership
CREATE OR REPLACE FUNCTION public.trg_v3_auto_il_membership_on_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.product_id IS NULL OR NEW.product_id = 'leokids_il' THEN
    INSERT INTO public.user_product_memberships (
      user_id, product_id, status, interface_language, preferred_report_language
    )
    VALUES (NEW.parent_id, 'leokids_il', 'active', 'he', 'he')
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_v3_auto_il_membership_on_student ON public.students;
CREATE TRIGGER trg_v3_auto_il_membership_on_student
  BEFORE INSERT ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_v3_auto_il_membership_on_student();

-- Service-role ensure: create if missing; update languages if active;
-- NEVER reactivate suspended/pending.
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
  -- Hard reject non-service callers (PostgREST sets request.jwt.claim.role)
  IF COALESCE(auth.role(), current_setting('request.jwt.claim.role', true), '')
       IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'ensure_user_product_membership: service_role only';
  END IF;

  IF NOT public.is_valid_leokids_product_id(p_product_id) THEN
    RAISE EXCEPTION 'invalid product_id: %', p_product_id;
  END IF;

  SELECT * INTO v_row
  FROM public.user_product_memberships
  WHERE user_id = p_user_id AND product_id = p_product_id;

  IF FOUND THEN
    IF v_row.status = 'suspended' THEN
      RAISE EXCEPTION 'membership suspended for user % product %', p_user_id, p_product_id;
    END IF;
    IF v_row.status IS DISTINCT FROM 'active' THEN
      RAISE EXCEPTION 'membership not active for user % product %', p_user_id, p_product_id;
    END IF;

    UPDATE public.user_product_memberships
    SET
      interface_language = COALESCE(p_interface_language, interface_language),
      preferred_report_language = COALESCE(
        p_preferred_report_language,
        preferred_report_language,
        p_interface_language
      ),
      updated_at = now()
    WHERE user_id = p_user_id AND product_id = p_product_id AND status = 'active'
    RETURNING * INTO v_row;

    RETURN v_row;
  END IF;

  INSERT INTO public.user_product_memberships (
    user_id, product_id, status, interface_language, preferred_report_language
  )
  VALUES (
    p_user_id,
    p_product_id,
    'active',
    p_interface_language,
    COALESCE(p_preferred_report_language, p_interface_language)
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

-- Separate admin reactivation (service_role only) — not called by Global ensure path
CREATE OR REPLACE FUNCTION public.reactivate_user_product_membership(
  p_user_id uuid,
  p_product_id text
)
RETURNS public.user_product_memberships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.user_product_memberships;
BEGIN
  IF COALESCE(auth.role(), current_setting('request.jwt.claim.role', true), '')
       IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'reactivate_user_product_membership: service_role only';
  END IF;

  UPDATE public.user_product_memberships
  SET status = 'active', updated_at = now()
  WHERE user_id = p_user_id AND product_id = p_product_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'membership not found';
  END IF;
  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) FROM authenticated;
REVOKE ALL ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.ensure_user_product_membership(uuid, text, text, text) TO service_role;

REVOKE ALL ON FUNCTION public.reactivate_user_product_membership(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reactivate_user_product_membership(uuid, text) FROM authenticated;
REVOKE ALL ON FUNCTION public.reactivate_user_product_membership(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.reactivate_user_product_membership(uuid, text) TO service_role;

-- No authenticated INSERT/UPDATE/DELETE policies on memberships (service_role bypasses RLS)
ALTER TABLE public.user_product_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS v2_upm_select_own ON public.user_product_memberships;
DROP POLICY IF EXISTS memberships_select_own ON public.user_product_memberships;
DROP POLICY IF EXISTS v3_upm_select_own ON public.user_product_memberships;

-- Authenticated may SELECT own rows (read), but cannot mutate via RLS
CREATE POLICY v3_upm_select_own
  ON public.user_product_memberships
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

COMMIT;
