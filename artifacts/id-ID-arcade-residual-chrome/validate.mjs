/**
 * Focused validation for Indonesian Master Arcade residual chrome corrections.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function readJson(rel) {
  return JSON.parse(read(rel));
}

/** Count quoted string literals that exactly match known EN chrome phrases. */
function countExactQuoted(src, phrases) {
  let n = 0;
  const hits = [];
  for (const p of phrases) {
    const re = new RegExp(`(["'])${escapeRe(p)}\\1`, "g");
    let m;
    while ((m = re.exec(src))) {
      const before = src.slice(Math.max(0, m.index - 60), m.index);
      // Ignore gamePackCopy second-arg keys and object keys
      if (/gamePackCopy\s*\([^)]*$/.test(before)) continue;
      if (/["'][a-z0-9_]+["']\s*:\s*$/i.test(before)) continue;
      n += 1;
      hits.push(p);
    }
  }
  return { n, hits };
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const clubFiles = [
  "components/arcade/club/ArcadeClubFriendsPanel.jsx",
  "components/arcade/club/ArcadeClubProfilePanel.jsx",
  "components/arcade/club/ArcadeClubEventsPanel.jsx",
  "components/arcade/club/ArcadeClubMissionsPanel.jsx",
  "components/arcade/club/ArcadeClubShopPanel.jsx",
  "components/arcade/club/ArcadeTabNav.jsx",
  "components/arcade/club/ArcadeLobbyHeader.jsx",
  "components/arcade/club/ArcadeGuestUpgradeBanner.jsx",
  "components/arcade/club/ArcadeInviteBanner.jsx",
];

const clubPhrases = [
  "Friends",
  "My Leo number",
  "Add friend",
  "Approve",
  "Decline",
  "Player card",
  "Game name:",
  "Recent history",
  "Save name",
  "Daily event",
  "Today's missions",
  "Card shop",
  "Games",
  "Shop",
  "Profile",
  "Coins",
  "Diamonds",
  "Collect reward",
  "Upgrade to a Leo profile for the full experience",
  "Accept",
  "Setting up your Leo number…",
  "Home screen",
  "My collection",
  "Copied!",
  "Copy",
  "No friends yet",
  "No missions today",
  "No games yet",
  "Guest player",
];

const hubPhrases = [
  "Quick match",
  "Create public room",
  "Create private room",
  "Active",
  "Unavailable",
  "Open rooms",
  "Waiting for another player",
  "Not enough coins",
  "Selected game:",
  "Entry amount:",
  "Pick an available game",
  "Enter a room code",
  "Room is full",
  "Game disabled on server",
  "Game in progress",
  "ui.student.guestGameLockLabel",
];

const mpFiles = [
  "components/arcade/chess/ChessScreen.js",
  "components/arcade/checkers/CheckersScreen.js",
  "components/arcade/dominoes/DominoesScreen.js",
  "components/arcade/placeholder/ArcadePlaceholderScreen.js",
  "components/arcade/bingo/ArcadeBingoScreen.js",
  "components/arcade/bingo/Ov2BingoFinishModal.js",
];

const mpPhrases = [
  "How to play",
  "Wait for your turn",
  "Game in progress",
  "Could not load the room",
  "Waiting for a player…",
  "Waiting for another player…",
  "Leaving…",
  "Leave",
  "Back",
  "Close",
  "Help",
  "You won!",
  "Loading…",
  "Leave table",
  "Leave game",
];

let failed = 0;
const results = [];

function check(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
    console.log("PASS", name);
  } catch (e) {
    failed += 1;
    results.push({ name, ok: false, error: String(e.message || e) });
    console.log("FAIL", name, e.message || e);
  }
}

check("club hardcoded EN = 0", () => {
  let total = 0;
  const allHits = [];
  for (const f of clubFiles) {
    const { n, hits } = countExactQuoted(read(f), clubPhrases);
    total += n;
    if (n) allHits.push({ f, hits });
  }
  assert.equal(total, 0, JSON.stringify(allHits));
});

check("hub hardcoded EN = 0 + guest lock uses t()", () => {
  const src = read("pages/student/arcade.js");
  assert.match(src, /GUEST_GAME_LOCK_LABEL_KEY/);
  assert.match(src, /t\(\s*GUEST_GAME_LOCK_LABEL_KEY\s*\)/);
  assert.doesNotMatch(src, /GUEST_GAME_LOCK_LABEL_HE/);
  const { n, hits } = countExactQuoted(src, hubPhrases);
  assert.equal(n, 0, JSON.stringify(hits));
});

check("multiplayer chrome hardcoded EN (audit set) = 0", () => {
  let total = 0;
  const allHits = [];
  for (const f of mpFiles) {
    const { n, hits } = countExactQuoted(read(f), mpPhrases);
    total += n;
    if (n) allHits.push({ f, hits });
  }
  assert.equal(total, 0, JSON.stringify(allHits));
});

check("id-ID setting_up_your_leo_number translated", () => {
  const leaf = readJson(
    "content-packs/id-ID/games/burn-down/components__arcade__club__ArcadeClubFriendsPanel.json",
  );
  const idx = readJson("content-packs/id-ID/games/burn-down-index.json");
  const v = leaf.copy.setting_up_your_leo_number;
  const iv = idx.components__arcade__club__ArcadeClubFriendsPanel.setting_up_your_leo_number;
  assert.notEqual(v, "Setting up your Leo number…");
  assert.match(v, /Leo/);
  assert.match(v, /kamu|nomor/i);
  assert.equal(v, iv);
});

check("guest lock ui key resolves in id-ID", () => {
  const ui = readJson("locales/id-ID/ui.json");
  const label = ui?.student?.guestGameLockLabel;
  assert.ok(typeof label === "string" && label.length > 0);
  assert.notEqual(label, "ui.student.guestGameLockLabel");
});

check("new club packs present in en+id indexes", () => {
  const en = readJson("content-packs/en/games/burn-down-index.json");
  const id = readJson("content-packs/id-ID/games/burn-down-index.json");
  const slugs = [
    "components__arcade__club__ArcadeTabNav",
    "components__arcade__club__ArcadeLobbyHeader",
    "components__arcade__club__ArcadeClubEventsPanel",
    "components__arcade__club__ArcadeClubMissionsPanel",
    "components__arcade__club__ArcadeClubShopPanel",
    "components__arcade__club__ArcadeGuestUpgradeBanner",
    "components__arcade__club__ArcadeInviteBanner",
    "pages__student__arcade",
  ];
  for (const s of slugs) {
    assert.ok(en[s] && typeof en[s] === "object", `en missing ${s}`);
    assert.ok(id[s] && typeof id[s] === "object", `id missing ${s}`);
  }
  assert.equal(id.pages__student__arcade.quick_match, "Pertandingan cepat");
  assert.equal(id.components__arcade__club__ArcadeTabNav.games, "Gim");
});

check("mp chrome keys present in id-ID packs", () => {
  const id = readJson("content-packs/id-ID/games/burn-down-index.json");
  for (const slug of [
    "components__arcade__chess__ChessScreen",
    "components__arcade__checkers__CheckersScreen",
    "components__arcade__dominoes__DominoesScreen",
    "components__arcade__bingo__ArcadeBingoScreen",
  ]) {
    assert.equal(id[slug].how_to_play || id[slug].wait_for_your_turn || id[slug].game_in_progress || id[slug].could_not_load_the_room ? true : false, true);
    assert.ok(id[slug].back || id[slug].leave || id[slug].game_in_progress);
  }
  assert.equal(id.components__arcade__chess__ChessScreen.how_to_play, "Cara bermain");
  assert.equal(id.components__arcade__chess__ChessScreen.wait_for_your_turn, "Tunggu giliranmu");
});

const out = {
  failed,
  passed: results.filter((r) => r.ok).length,
  results,
};
fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-arcade-residual-chrome/validation-result.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(JSON.stringify(out, null, 2));
process.exit(failed ? 1 : 0);
