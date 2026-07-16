-- Rollback Stage C — WARNING: deletes Global parent_account_settings rows.
DO $$
BEGIN
  IF current_setting('v2.rollback_confirm', true) IS DISTINCT FROM 'YES_STAGE_C' THEN
    RAISE EXCEPTION 'Refusing R_C_settings: set v2.rollback_confirm = YES_STAGE_C';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.parent_account_settings WHERE product_id = 'leokids_global'
  ) AND current_setting('v2.allow_global_data_loss', true) IS DISTINCT FROM 'YES' THEN
    RAISE EXCEPTION 'Global settings rows exist. Set v2.allow_global_data_loss=YES to proceed.';
  END IF;
END $$;

DELETE FROM public.parent_account_settings WHERE product_id = 'leokids_global';

ALTER TABLE public.parent_account_settings DROP CONSTRAINT IF EXISTS parent_account_settings_pkey;
ALTER TABLE public.parent_account_settings ADD CONSTRAINT parent_account_settings_pkey PRIMARY KEY (parent_user_id);
