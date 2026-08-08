# Indonesian Master — Phase 4C Global Burn-down + Reports

**Date:** 2026-08-08  
**Scope:** Content-only translation of `global-burn-down` + `reports` packs. No pack-catalog / resolver / loader wiring.

**Actual disk count at start:** EN `global-burn-down` = 154, EN `reports` = 48, **total = 202** (matches Phase 0). ID targets = 0 before this phase.

```text
Indonesian Master — Phase 4C Global Burn-down + Reports

GLOBAL BURN-DOWN

English files = 154
Indonesian files = 154
Missing files = 0
Orphan files = 0
English leaves = 940
Indonesian leaves = 940

REPORT PACKS

English files = 48
Indonesian files = 48
Missing files = 0
Orphan files = 0
English leaves = 1208
Indonesian leaves = 1208

Global missing keys = 0
Global extra keys = 0
Empty required leaves = 0
Placeholder mismatches = 0
Schema defects = 0

Intentional English-learning leaves retained = 38
  (fill-in blanks / English examples; font stacks; timezone; filenames;
   code fragments; loanwords Status/Volume/Diagonal/Normal/Pythagoras;
   structural "{topic}: {detail}")
Unexplained English UI leaves = 0

Student terminology defects = 0
Grade/class semantic defects = 0
Report terminology defects = 0
Adult register defects = 0

Diagnostic/report logic modified = 0

Files created =
  content-packs/id-ID/global-burn-down/** (154 files: 153 leaves + burn-down-index.json)
  content-packs/id-ID/reports/** (48 files: 47 burn-down leaves + burn-down-index.json)
  artifacts/id-ID-phase4c/* (dicts, apply/rebuild/validate tooling + results)
  docs/reports/id-ID-indonesian-master-phase4c-global-burn-down-reports-2026-08-08.md

Files outside ownership modified = 0

Shared index registration required =
  content-packs/id-ID/global-burn-down/burn-down-index.json
  content-packs/id-ID/reports/burn-down-index.json
  (optional later: extend scripts/i18n/rebuild-canonical-burn-down-indexes.mjs locales to include id-ID)
Pack catalog registration required = YES
  lib/content/pack-catalog.js → id-ID entries for both burn-down-index.json paths
  (id-ID currently registers public-seo only)

Focused tests/validation =
  artifacts/id-ID-phase4c/validate-phase4c.mjs
Tests passed = 3/3
Tests failed = 0

English SoT modified = 0
Other locales modified = 0
Shared wiring modified = 0
API/background agents used = 0
  (local Task subagents used only for string-dict translation batches)

Build = not run
Commit = not created
Push = not performed

PHASE 4C RESULT = PASS
```

## Semantic notes

| Probe | Indonesian |
|---|---|
| `grade_status` | Status Kelas |
| `class_status` | Status rombel |
| `col_class` | Rombel |
| `{count} children` (school) | {count} murid |
| Parent-facing “the child / anak Anda” in report narrative | kept as anak / anak Anda |
| `report` label | laporan |
| Academic grade in display template | Kelas |

## Runtime note

Disk packs are complete and index-rebuilt locally. Until MAIN registers both indexes in `pack-catalog.js`, runtime continues to fall back to English content packs.
