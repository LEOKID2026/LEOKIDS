# GLOBAL zero-Hebrew / zero-Israel-residue cleanup

Date: 2026-08-05
Status: cleanup stabilized — **no commit / no push / no deploy / no DB migration**

## Hard targets

| Target | Result |
|--------|--------|
| Hebrew Unicode in first-party files | **0** |
| Repository gate `check-zero-hebrew-repository.mjs` | **PASS** |
| Canonical GLOBAL runtime card keys | **136** |
| Pack-only non-runtime keys (excluded from API) | **6** |
| Israel-only keys in content-packs catalogs | **0** |
| `resolveIsraelCardCopy` | **removed** |
| `card-requirement-he.server.js` | **removed** |
| `*.he.js` companions under product roots | **0** |

Pack-only keys (present in packs for copy/assets, not returned by card APIs):
`leo_card_common_assets`, `event_autumn`, `event_family_day`, `event_spring`, `event_summer_vacation`, `event_winter_vacation`.

## What was removed / moved

Hebrew-heavy trees and audit corpora were moved outside the repo to:

`%TEMP%/leo-kids-global-audits/moved-from-global/`

Including (among others): `tmp/`, `exports/`, prior Hebrew `docs/` evidence, language-review corpora, prototypes, Hebrew review scripts/fixtures.

Hebrew product copy was rewritten to English or removed; validators retain Unicode ranges/escapes only for detection.

## Card system (Root A)

- Locale-aware GLOBAL resolver only (`resolveGlobalCardCopy`).
- Requirements from `card-requirement-global.server.js` + packs.
- Student/demo APIs use `name`, `description`, `requirementText`, `lockMessage`, `contentLocale`, `resolvedLocale`, `fallbackSource`.
- Israel-only keys removed from all `content-packs/**/rewards/card-catalog.json`.
- Runtime filter in `global-card-scope.js` retained as a safety gate for any leftover DB rows.
- Canonical keys: `lib/rewards/canonical-global-card-manifest.js` (136).

## DB

No schema change applied. GLOBAL queries avoid Hebrew content columns for student/demo card paths; admin serializers are catalog-backed. See external inventory:

`%TEMP%/leo-kids-global-audits/DB_HEBREW_COLUMNS_INVENTORY.md`

## Permanent gate

```bash
node scripts/i18n/check-zero-hebrew-repository.mjs
```
