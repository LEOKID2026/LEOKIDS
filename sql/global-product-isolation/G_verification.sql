-- =============================================================================
-- Stage G — Verification queries
-- Package: sql/global-product-isolation/
-- Run after each stage in staging. DO NOT run destructive fixes in production
-- without owner approval.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- G1. Stage A — product_id columns exist and IL backfill complete
-- -----------------------------------------------------------------------------
SELECT 'parent_profiles' AS tbl,
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE product_id IS NULL) AS null_product,
       COUNT(*) FILTER (WHERE product_id = 'leokids_il') AS il_count,
       COUNT(*) FILTER (WHERE product_id = 'leokids_global') AS global_count
FROM public.parent_profiles
UNION ALL
SELECT 'students',
       COUNT(*),
       COUNT(*) FILTER (WHERE product_id IS NULL),
       COUNT(*) FILTER (WHERE product_id = 'leokids_il'),
       COUNT(*) FILTER (WHERE product_id = 'leokids_global')
FROM public.students;

-- Expect: null_product = 0 after backfill; global_count = 0 until global beta.

-- -----------------------------------------------------------------------------
-- G2. Orphan students (parent product mismatch) — should return 0 rows
-- -----------------------------------------------------------------------------
SELECT s.id AS student_id, s.product_id AS student_product, pp.product_id AS parent_product
FROM public.students s
JOIN public.parent_profiles pp ON pp.id = s.parent_id
WHERE s.product_id IS DISTINCT FROM pp.product_id;

-- -----------------------------------------------------------------------------
-- G3. Stage B — every parent_profile has IL membership
-- -----------------------------------------------------------------------------
SELECT pp.id
FROM public.parent_profiles pp
LEFT JOIN public.user_product_memberships m
  ON m.user_id = pp.id AND m.product_id = 'leokids_il'
WHERE m.user_id IS NULL;

-- Expect: 0 rows after B_memberships backfill.

-- -----------------------------------------------------------------------------
-- G4. Duplicate memberships (sanity)
-- -----------------------------------------------------------------------------
SELECT user_id, product_id, COUNT(*)
FROM public.user_product_memberships
GROUP BY user_id, product_id
HAVING COUNT(*) > 1;

-- -----------------------------------------------------------------------------
-- G5. Stage D — guest settings per product
-- -----------------------------------------------------------------------------
SELECT product_id, COUNT(*)
FROM public.guest_mode_settings
GROUP BY product_id
ORDER BY product_id;

-- -----------------------------------------------------------------------------
-- G6. Tier B spot check — learning_sessions without resolvable student
-- -----------------------------------------------------------------------------
SELECT ls.id
FROM public.learning_sessions ls
LEFT JOIN public.students st ON st.id = ls.student_id
WHERE st.id IS NULL
LIMIT 20;

-- -----------------------------------------------------------------------------
-- G7. Global write leak detector (run after global app starts writing)
--     Any row with product_id = leokids_global must be created after cutover.
-- -----------------------------------------------------------------------------
SELECT 'students' AS tbl, id, created_at, product_id
FROM public.students
WHERE product_id = 'leokids_global'
ORDER BY created_at DESC
LIMIT 10;

-- -----------------------------------------------------------------------------
-- G8. student_access_codes product drift
-- -----------------------------------------------------------------------------
SELECT sac.id, sac.product_id AS code_product, st.product_id AS student_product
FROM public.student_access_codes sac
JOIN public.students st ON st.id = sac.student_id
WHERE sac.product_id IS DISTINCT FROM st.product_id
LIMIT 20;

-- -----------------------------------------------------------------------------
-- G9. Index presence (performance)
-- -----------------------------------------------------------------------------
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE '%product%'
ORDER BY tablename, indexname;

-- -----------------------------------------------------------------------------
-- G10. RLS enabled flags (after Stage F)
-- -----------------------------------------------------------------------------
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'parent_profiles', 'students', 'learning_sessions', 'answers',
    'guest_mode_settings', 'user_product_memberships'
  )
ORDER BY c.relname;

-- -----------------------------------------------------------------------------
-- G11. Arcade tables must NOT have product_id (Tier D guard)
-- -----------------------------------------------------------------------------
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'product_id'
  AND table_name LIKE 'arcade_%';

-- Expect: 0 rows.
