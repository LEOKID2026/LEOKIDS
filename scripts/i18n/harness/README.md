# ar-001 audit harnesses (Agent 4)

Audit-only tooling. Does **not** change production behavior.

## Memory full-loop

- **File:** `memory-full-loop.mjs`
- **Path:** start → gameplay → completion → interstitial → skip/continue → finish → retry
- **Selectors (existing product testids — no SoloGame product mutation):**
  - `[data-testid=memory-gameplay][data-memory-ready=1]`
  - `[data-testid=memory-complete]`
  - `[data-testid=memory-retry]`
  - Interstitial Skip = product button (`role=button` name `/^Skip$/i`)
- **Determinism:** pair matching by face-up `img[src]` (not random clicks). Waits honor `MISMATCH_HOLD_MS` (1200) and interstitial max (5000+buffer). No soft skip of failures.
- **Usage:** `BASE_URL=http://127.0.0.1:3000 node scripts/i18n/harness/memory-full-loop.mjs`
- **Output:** `artifacts/i18n/ar-001-memory-full-loop-proof.json`

## Emails render proof

- **File:** `emails-render-proof.mjs`
- **Strategy:** loader/render proof via `loadLocaleBundles` + `lookupMessage` — **not** live SMTP delivery.
- **Usage:** `node scripts/i18n/harness/emails-render-proof.mjs`
- **Output:** `artifacts/i18n/ar-001-emails-render-proof.json`
