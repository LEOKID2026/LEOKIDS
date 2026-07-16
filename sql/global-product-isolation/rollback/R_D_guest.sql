DO $$ BEGIN
  IF current_setting('v3.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_D' THEN
    RAISE EXCEPTION 'Refusing R_D: set v3.rollback_confirm=YES_STAGE_D';
  END IF;
END $$;

-- WARNING: drops Global guest settings table (Global data loss)
DROP TABLE IF EXISTS public.product_guest_mode_settings CASCADE;
