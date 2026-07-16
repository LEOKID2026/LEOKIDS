DO $$ BEGIN
  IF current_setting('v3.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_B' THEN
    RAISE EXCEPTION 'Refusing R_B: set v3.rollback_confirm=YES_STAGE_B';
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_v3_auto_il_membership_on_student ON public.students;
DROP FUNCTION IF EXISTS public.trg_v3_auto_il_membership_on_student();
DROP FUNCTION IF EXISTS public.ensure_user_product_membership(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.reactivate_user_product_membership(uuid, text);
DROP TABLE IF EXISTS public.user_product_memberships CASCADE;
