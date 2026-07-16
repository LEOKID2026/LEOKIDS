-- Rollback Stage D — WARNING: deletes leokids_global guest settings rows, then collapses PK.
DO $$
BEGIN
  IF current_setting('v2.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_D' THEN
    RAISE EXCEPTION 'Refusing R_D_guest: set v2.rollback_confirm = YES_STAGE_D';
  END IF;
END $$;

DELETE FROM public.guest_mode_settings WHERE product_id = 'leokids_global';

ALTER TABLE public.guest_mode_settings DROP CONSTRAINT IF EXISTS guest_mode_settings_pkey;
-- Restore single-key PK for IL rows only
ALTER TABLE public.guest_mode_settings ADD CONSTRAINT guest_mode_settings_pkey PRIMARY KEY (setting_key);
-- Keep product_id column (nullable) rather than dropping if IL apps already read it.
