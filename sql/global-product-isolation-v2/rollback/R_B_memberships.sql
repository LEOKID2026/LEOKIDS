-- Rollback Stage B — drops memberships table. Does not recreate IL memberships.
DO $$
BEGIN
  IF current_setting('v2.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_B' THEN
    RAISE EXCEPTION 'Refusing R_B_memberships: set v2.rollback_confirm = YES_STAGE_B';
  END IF;
END $$;

DROP FUNCTION IF EXISTS public.ensure_user_product_membership(uuid, text, text, text);
DROP TABLE IF EXISTS public.user_product_memberships;
