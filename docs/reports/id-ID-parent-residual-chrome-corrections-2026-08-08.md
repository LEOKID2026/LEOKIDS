# Indonesian Master — Parent Residual Chrome Corrections

**Date:** 2026-08-08  
**Owner:** Correction Owner — Indonesian Master Parent Residual Chrome  
**Findings:** ID-A-007, ID-A-008

```text
Indonesian Master — Parent Residual Chrome Corrections

ID-A-007 = CLOSED
ID-A-008 = CLOSED

AssignActivityModal English findings before = 20
AssignActivityModal English findings after = 0

ParentSentActivitiesPanel English findings before = 24
ParentSentActivitiesPanel English findings after = 0

Adult register defects = 0
Raw API English regression = 0
Business logic drift = 0

Namespace keys added = 41 (ui.parent.* activity/sent-results chrome; EN + id-ID)
EN/ID key parity = PASS

Files modified =
  components/parent/AssignActivityModal.js
  components/parent/ParentSentActivitiesPanel.jsx
  locales/en/ui.json
  locales/id-ID/ui.json
  tests/i18n/id-ID-parent-residual-chrome-assign-sent.test.mjs
  tests/classroom-activities/student-activity-scope-labels.test.mjs
    (assert now matches ui.parent.sentActivitiesTitle wiring)

Files outside ownership = 0
  (parent-activity-labels.client.js left unused by panel; not rewritten)

Focused tests =
  tests/i18n/id-ID-parent-residual-chrome-assign-sent.test.mjs
  tests/i18n/id-ID-phase9b2-parent-api-ui-localization.test.mjs (Phase 9 regression)
Tests passed = 26 (10 residual chrome + 16 Phase 9B-2)
Tests failed = 0

API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

CORRECTION RESULT = PASS
```

## Notes

- **ID-A-007:** All AssignActivityModal validation + chrome strings wired through `t("ui.parent.*")` / `ui.common.close`; API save errors use `t(mapParentPanelApiError(...))`.
- **ID-A-008:** Results load failure uses `resolveParentApiErrorDisplay(..., "panel_load", t)` — no `json.message` / `json.error` / `"Could not load results"` literal fallback.
- Adult Indonesian copy uses **Anda** / neutral professional (reused `deleteNetworkError`, `panelLoadFailed`, new keys without *kamu*).
- Phase 9 Parent code-first error handling preserved (Phase 9B-2 suite green).
