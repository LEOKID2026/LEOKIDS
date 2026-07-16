# GLOBAL ENGLISH FAST TRACK — Final Code Report

## Git

| | |
|---|---|
| **HEAD at start** | `480738f` (`chore: trigger fresh Vercel Next.js deployment`) |
| **Branch** | `main` |
| **Remote** | `origin` → `https://github.com/LEOKID2026/LEOKIDS.git` (global; not Israeli) |
| **HEAD at end** | `cc42401` (`feat: englishize public, auth, learning, worksheets, games UI, and PWA`) |
| **Commits** | `a66dc3a` foundation · `cc42401` English UI/PWA/SQL package+report |

## Scope confirmations

- Work limited to `LEO-KIDS-GLOBAL` only.
- **Supabase was not modified** (no SQL run, no migrations applied, no live RLS changes).
- **Israeli sites** (`LEO-KIDS`, `LEO-KIDS-WEB-TRY`) were not modified.
- **`GLOBAL_DATA_WRITES_ENABLED=false`** remains the default until owner-approved SQL.

## What was delivered

### Locale + direction

- Registry: `lib/i18n/locale-registry.js` — `en` (default), `en-XA`, `ar-XB`, future locales reserved; **no `/he`**.
- Dynamic document: `pages/_document.js` + `_app.js` set `lang` / `dir` from locale cookie/path.
- Math LTR helper: `components/i18n/MathExpression.jsx`.

### i18n

- Custom Pages Router stack (not next-intl): `lib/i18n/*` + `locales/en/{common,ui,auth,learning,reports,emails,seo,legal,worksheets,games,validation}.json`.
- ICU-ish plurals/variables via `message-format.js`; English fallback; missing-key warnings; pseudo-long for `en-XA`.
- CI: `npm run test:i18n` (bundles, write-barrier, curriculum pack, Hebrew foundation scan).

### Write barrier + mock

- `lib/global/write-barrier.js`, `apply-write-barrier.js`, `mock-fixtures.js`, `mock-mode.client.js`.
- Mutating APIs gated (create/update/delete student, learning session start/finish/answer, guest start, etc.).
- Mock login paths for demo access codes / parent session ready when writes disabled.
- `GET /api/mock/report` for localized sample reports (no DB).

### Public / auth / parent / student

- Homepage, marketing landings, about/contact, parent/student/teacher login, forgot/reset password — English + i18n hooks.
- Parent dashboard, student home, learning hub — English; preview banner when mock mode on.
- Canonical origin from env: `lib/site/canonical-public-site-origin.js` (`NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_CANONICAL_ORIGIN`).

### Four subjects

- Masters: math, geometry, english, science — English shell UI, help boards, coaching strings, badges via locale keys.
- Student mirrors remain re-exports.
- No active navigation to deleted subjects (hebrew/history/moledet/geography).

### Curriculum

- `curriculum/international/{math,geometry,english,science}/g1–g6.json` — **126** skills with stable IDs + loader.

### Reports

- Engines stay contract-oriented; English prose via `lib/reports/localize-report-contract.js` + `locales/en/reports.json`.
- `wrapPayloadWithLocalizedParentFacing` for English overlay beside legacy payloads.

### Worksheets / games UI / PWA / SEO

- Worksheet hub/generator/preview/answer key English + LTR print docs.
- Games hub/arcade chrome English (gameplay untouched).
- Manifests + SWs: English, `lk-global-*` cache prefixes, offline English LTR.
- Sitemap/robots from canonical origin; practice SEO keys English; 404/500 English pages.

### SQL package (not executed)

`sql/global-product-isolation/`:

1. `A_product_identity.sql`
2. `B_memberships.sql`
3. `C_global_writes.sql`
4. `D_product_scoped_settings.sql`
5. `E_isolation_notes.sql`
6. `G_verification.sql` (verify before hardening)
7. `F_rls.sql` (RLS last; Arcade excluded)
8. `H_rollback.sql`

See folder `README.md` for order, risks, rollback, verification, IL impact, dependent code.

## Remaining Hebrew / domains (expected)

| Item | Reason |
|------|--------|
| Many `pages/api/*`, admin, arcade internals, generators, `utils/` content | Legacy migration; not all runtime UI |
| `data/seo/practice-pages.he.js` body copy | Still Hebrew content module; SEO meta keys English; full EN rewrite deferred |
| Guide pages / help center Hebrew modules | Outside critical English product path for this track |
| Question stems from generators | Content locale / generator Englishization continues after SQL enablement |
| Hardcoded `leokids.co.il` in docs/history only | Runtime canonical uses env |

## Build / tests

| Check | Result |
|-------|--------|
| `npm run build` | Passed (after SEO + master syntax fixes) |
| `npm run test:i18n` | Locales + write-barrier + curriculum OK; Hebrew scan soft-warns legacy |
| Report localize smoke | OK |
| Full worksheet / parent-report / diagnostic suites | Run before production cutover (may still assume some Hebrew fixtures) |

## Vercel

- Deploy from GitHub only; project `leo-kids-global`.
- No local `.vercel` re-link to Israeli project.

## Owner next steps (only remaining)

1. Review and approve SQL package; run in documented order.
2. Set `GLOBAL_DATA_WRITES_ENABLED=true` (and mock off) after verification.
3. Set production `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_CANONICAL_ORIGIN`.
4. Browser + integration + production acceptance tests.
)
