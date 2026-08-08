/**
 * Residual EN scan for owned Arcade surfaces after chrome corrections.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const files = [
  "components/arcade/club/ArcadeClubFriendsPanel.jsx",
  "components/arcade/club/ArcadeClubProfilePanel.jsx",
  "components/arcade/club/ArcadeClubEventsPanel.jsx",
  "components/arcade/club/ArcadeClubMissionsPanel.jsx",
  "components/arcade/club/ArcadeClubShopPanel.jsx",
  "components/arcade/club/ArcadeTabNav.jsx",
  "components/arcade/club/ArcadeLobbyHeader.jsx",
  "components/arcade/club/ArcadeGuestUpgradeBanner.jsx",
  "components/arcade/club/ArcadeInviteBanner.jsx",
  "components/arcade/club/EmoteBar.jsx",
  "pages/student/arcade.js",
  "components/arcade/chess/ChessScreen.js",
  "components/arcade/checkers/CheckersScreen.js",
  "components/arcade/dominoes/DominoesScreen.js",
  "components/arcade/placeholder/ArcadePlaceholderScreen.js",
  "components/arcade/bingo/ArcadeBingoScreen.js",
  "components/arcade/bingo/Ov2BingoFinishModal.js",
];

/** User-facing English phrases that should no longer appear as quoted UI literals. */
const phrases = [
  "Friends",
  "My Leo number",
  "Add friend",
  "Approve",
  "Decline",
  "Player card",
  "Recent history",
  "Save name",
  "Daily event",
  "Today's missions",
  "Card shop",
  "Collect reward",
  "Upgrade to a Leo profile for the full experience",
  "Home screen",
  "My collection",
  "Quick match",
  "Create public room",
  "Create private room",
  "Not enough coins",
  "Pick an available game",
  "Enter a room code",
  "Room is full",
  "Game disabled on server",
  "Waiting for another player",
  "How to play",
  "Wait for your turn",
  "Game in progress",
  "Could not load the room",
  "Waiting for a player…",
  "Leaving…",
  "You won!",
  "Leave table",
  "Leave game",
  "Setting up your Leo number…",
  "ui.student.guestGameLockLabel",
  "😊 Message",
  "Missing room id",
  "Your card",
  "Called numbers",
  "Claim prize",
  "Round result",
  "Table multiplier",
  "Prizes claimed",
  "Unclaimed",
  "Host only",
  "The host starts a new game when all seated players request a rematch.",
  "When the room fills, the game state opens",
  "Session ended",
  "Players in room",
  "The first tile goes here",
  "Call next",
  "Reset",
];

function countQuoted(src, phrase) {
  const re = new RegExp(`(["'])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\1`, "g");
  let n = 0;
  let m;
  while ((m = re.exec(src))) {
    const before = src.slice(Math.max(0, m.index - 80), m.index);
    if (/gamePackCopy\s*\([^)]*$/.test(before)) continue;
    if (/["'][a-z0-9_]+["']\s*:\s*$/i.test(before)) continue;
    // status-code comparison only
    if (phrase === "Already claimed" && /!==|===/.test(before.slice(-5))) continue;
    n += 1;
  }
  return n;
}

const hits = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const p of phrases) {
    const n = countQuoted(src, p);
    if (n) hits.push({ f, p, n });
  }
  // raw key bug
  if (src.includes("GUEST_GAME_LOCK_LABEL_HE") && !src.includes("// deprecated")) {
    hits.push({ f, p: "GUEST_GAME_LOCK_LABEL_HE", n: 1 });
  }
}

const pack = JSON.parse(
  fs.readFileSync(
    path.join(
      ROOT,
      "content-packs/id-ID/games/burn-down/components__arcade__club__ArcadeClubFriendsPanel.json",
    ),
    "utf8",
  ),
);
const settingUp = pack.copy.setting_up_your_leo_number;

const out = {
  residualQuotedEn: hits.length,
  hits,
  setting_up_your_leo_number: settingUp,
  settingUpTranslated: settingUp !== "Setting up your Leo number…",
};
fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-arcade-residual-chrome/residual-scan.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(JSON.stringify(out, null, 2));
process.exit(hits.length || !out.settingUpTranslated ? 1 : 0);
