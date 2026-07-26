# Global Engine Selective Port — Return Report

**Baseline:** `56564f4cb41c01657571cb1e9c3272ff9d92cba1`  
**HEAD:** `88c22a47c07e63ed8e624bcc06a8327be39537f5`  
**Source tip (LIOSH):** `3b9a89a6dad7fcf6764237df39898a68e7113c56`  
**Clone:** clean `LEOKIDS-CLEAN-MAIN-PORT` (not dirty audit worktree)

## Global commits

- 88c22a47c test(global-learning): add focused engine and report parity coverage
- 63c9cb1a7 fix(global-demo): align English demo reports with production pipeline
- 9a0b233a4 fix(global-reports): replace Israel date bounds with locale-aware calendar
- d24070cf4 feat(global-parent-report): add safe English factual findings and topic status
- 9b17bd536 feat(global-learning): add factual observations for active subjects
- ccee7882f feat(global-learning): complete universal ADC and decision pipeline

## Label coverage

- **76/76** active tags with approved English factual labels
- Canonical labels (after alias sharing of wording): **76**
- Unsafe interpretive words in factual map: **0**
- Contract field `labelHe`: **forbidden / absent**

## Active subjects

math, geometry, english, science (history / hebrew / moledet skipped)

## Recurrence ladder traces

| case | expected | actual | pass |
|---|---|---|---|
| 1/40 | observed | observed | true |
| 2/40 | repeated | repeated | true |
| 3/40 | repeated | repeated | true |
| 3/5 | consistent | consistent | true |
| 3/21 | repeated | repeated | true |
| 4/12 | consistent | consistent | true |
| 5/10 | strong | strong | true |
| 6/25 | strong | strong | true |
| 4/4 | repeated | repeated | true |

## Parity

- Report surfaces (regular/detailed/short/contract/demo): **aligned via LPD + rebuild**
- Demo production pipeline: **wired** (`rebuildParentReportBaseFromAggregatedBody`)
- Date policy: **UTC default**, explicit IANA honored, **no Asia/Jerusalem default**

## Focused tests

**88/88 pass** (ADC, factualObservations, fuzzy active subjects, chrome/safety, locale calendar, demo parity)

## Israeli skipped / not ported

See JSON `skippedIsraeli` and `dependenciesNotPorted`.

## Artifacts

- global-engine-final-active-tags.csv
- global-parent-factual-labels-final.csv
- global-engine-report-parity-final.csv
- global-engine-date-policy-final.csv
- global-engine-selective-port-return.json
