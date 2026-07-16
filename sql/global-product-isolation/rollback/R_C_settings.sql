DO $$ BEGIN
  IF current_setting('v3.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_C' THEN
    RAISE EXCEPTION 'Refusing R_C: set v3.rollback_confirm=YES_STAGE_C';
  END IF;
END $$;

-- WARNING: drops product_parent_account_settings (Global settings loss)
DROP TABLE IF EXISTS public.product_parent_account_settings CASCADE;
