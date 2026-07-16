-- =============================================================================
-- Stage 0 — Preflight inventory (READ ONLY)
-- Package: sql/global-product-isolation/
-- Capture before applying A–F. Does not mutate schema.
-- =============================================================================

-- RLS enablement
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'parent_profiles','students','student_access_codes','student_sessions',
    'learning_sessions','answers','parent_reports','student_coin_balances',
    'coin_transactions','student_inventory','parent_account_settings',
    'guest_mode_settings','parent_copilot_usage_log',
    'student_subject_permissions','student_learning_access_preferences',
    'student_subject_permissions_change_log','parent_assigned_activities',
    'parent_activity_status','parent_activity_attempts',
    'worksheet_assignments','worksheet_student_answers','private_worksheet_assignments'
  )
ORDER BY 1;

-- Full policy inventory (Tier A/B/C focus + anything product-related)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Legacy PK shapes (must remain single-column for IL)
SELECT c.conrelid::regclass AS table_name, c.conname, pg_get_constraintdef(c.oid) AS def
FROM pg_constraint c
WHERE c.contype = 'p'
  AND c.conrelid IN (
    'public.parent_account_settings'::regclass,
    'public.guest_mode_settings'::regclass
  );

-- Known broad authenticated policies (expected IL permissive baseline)
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND roles::text ILIKE '%authenticated%'
  AND tablename IN (
    'students','student_access_codes','learning_sessions','answers',
    'parent_reports','student_coin_balances','coin_transactions','student_inventory'
  )
ORDER BY 1, 2;
