# Indonesian Master — Arcade Residual Chrome Corrections

**Date:** 2026-08-08  
**Role:** Correction Owner — Indonesian Master Arcade / Student Residual Chrome  
**Scope:** Localization-only wiring of Arcade Club, student arcade hub, multiplayer chrome, and id-ID games pack residual `setting_up_your_leo_number`. No Phase 9 API reopen. No game/business logic changes.

```text
Indonesian Master — Arcade Residual Chrome Corrections

ID-A-001 = CLOSED
ID-A-002 = CLOSED
ID-A-003 = CLOSED
ID-A-004 = CLOSED
ID-A-005 = CLOSED
ID-A-009 = CLOSED

ID-AUD-B-001 = CLOSED
ID-AUD-B-002 = CLOSED

Arcade Club visible hardcoded EN before = 68
Arcade Club visible hardcoded EN after = 0

Student Arcade hub visible hardcoded EN before = 28
Student Arcade hub visible hardcoded EN after = 0

Multiplayer game visible hardcoded EN before = 72
Multiplayer game visible hardcoded EN after = 0

Raw localization keys visible = 0
Games pack untranslated residual = 0

English-learning content preserved = YES
Game/business logic drift = 0
Phase9 API regression = PASS (phase9b3 focused suite 14/14)

Files modified =
  components/arcade/club/ArcadeClubFriendsPanel.jsx
  components/arcade/club/ArcadeClubProfilePanel.jsx
  components/arcade/club/ArcadeClubEventsPanel.jsx
  components/arcade/club/ArcadeClubMissionsPanel.jsx
  components/arcade/club/ArcadeClubShopPanel.jsx
  components/arcade/club/ArcadeTabNav.jsx
  components/arcade/club/ArcadeLobbyHeader.jsx
  components/arcade/club/ArcadeGuestUpgradeBanner.jsx
  components/arcade/club/ArcadeInviteBanner.jsx
  components/arcade/club/EmoteBar.jsx
  pages/student/arcade.js
  components/arcade/chess/ChessScreen.js
  components/arcade/checkers/CheckersScreen.js
  components/arcade/dominoes/DominoesScreen.js
  components/arcade/placeholder/ArcadePlaceholderScreen.js
  components/arcade/bingo/ArcadeBingoScreen.js
  components/arcade/bingo/Ov2BingoFinishModal.js
  content-packs/en/games/burn-down/** (new + extended club/hub/mp leaves)
  content-packs/en/games/burn-down-index.json
  content-packs/id-ID/games/burn-down/** (new + extended + setting_up_your_leo_number)
  content-packs/id-ID/games/burn-down-index.json
  artifacts/id-ID-arcade-residual-chrome/**

Files outside ownership = 0
  (English SoT content-packs/en leaves extended only with new chrome keys required for wiring; no EN meaning rewrites of existing SoT prose beyond additive keys)

Focused tests =
  artifacts/id-ID-arcade-residual-chrome/validate.mjs
  artifacts/id-ID-arcade-residual-chrome/residual-scan.mjs
  tests/i18n/id-ID-phase9b3-student-arcade-api-ui.test.mjs
Tests passed = 7 + residual-scan + 14 phase9b3 = all green
Tests failed = 0

API/background/sub-agents used = 0

Build = not run
Commit = not created
Push = not performed

CORRECTION RESULT = PASS
```

## Notes

- Consumers use existing `gamePackCopy(slug, key, vars)` + `t()`; no new Arcade translation system.
- Guest lock fixed: `t(GUEST_GAME_LOCK_LABEL_KEY)` → id-ID `Terkunci`.
- ID-A-009: `setting_up_your_leo_number` → `Menyiapkan nomor Leo kamu…`.
- Child register: `kamu` / `gim` retained in new Indonesian chrome.
- Allowed English retained: Bingo board `FREE` token (if present), game proper names via packs, `"Already claimed"` as internal status-code comparison only.
