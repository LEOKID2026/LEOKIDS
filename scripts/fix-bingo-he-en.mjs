/**
 * Replace Arcade Bingo HE UI strings (as \u escapes) with English.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = path.join(ROOT, "hooks/useArcadeBingoSession.js");
let t = fs.readFileSync(p, "utf8");

/** Decode a JS string that may contain \uXXXX escapes to real text for matching, then we replace source escapes. */
const map = [
  ["\\u05D7\\u05E4\\u05D9\\u05E1\\u05EA \\u05D4\\u05E7\\u05DC\\u05E4\\u05D9\\u05DD \\u05E8\\u05D9\\u05E7\\u05D4", "Card deck is empty"],
  ["\\u05DC\\u05D0 \\u05DE\\u05D5\\u05DB\\u05DF", "Not ready"],
  ["\\u05DE\\u05DE\\u05EA\\u05D9\\u05E0\\u05D9\\u05DD \\u05E9\\u05D4\\u05DE\\u05D0\\u05E8\\u05D7 \\u05D9\\u05E4\\u05EA\\u05D7 \\u05DE\\u05E9\\u05D7\\u05E7 \\u05D1\\u05D9\\u05E0\\u05D2\\u05D5.", "Waiting for the host to open a Bingo game."],
  ["\\u05DE\\u05DE\\u05EA\\u05D9\\u05E0\\u05D9\\u05DD \\u05DC\\u05E9\\u05D7\\u05E7\\u05E0\\u05D9\\u05DD - \\u05D4\\u05DE\\u05D0\\u05E8\\u05D7 \\u05E6\\u05E8\\u05D9\\u05DA \\u05DC\\u05D4\\u05EA\\u05D7\\u05D9\\u05DC \\u05D0\\u05EA \\u05D4\\u05DE\\u05E9\\u05D7\\u05E7 \\u05DE\\u05D4\\u05DC\\u05D5\\u05D1\\u05D9.", "Waiting for players — the host must start the game from the lobby."],
  ["\\u05DE\\u05DE\\u05EA\\u05D9\\u05E0\\u05D9\\u05DD \\u05DC\\u05D4\\u05D9\\u05DE\\u05D5\\u05E8 \\u05DE\\u05DB\\u05DC \\u05D4\\u05E9\\u05D7\\u05E7\\u05E0\\u05D9\\u05DD.", "Waiting for all players to be ready."],
  ["\\u05D4\\u05D7\\u05D3\\u05E8 \\u05DE\\u05D5\\u05DB\\u05DF - \\u05D4\\u05DE\\u05D0\\u05E8\\u05D7 \\u05D9\\u05DB\\u05D5\\u05DC \\u05DC\\u05E4\\u05EA\\u05D5\\u05D7 \\u05D1\\u05D9\\u05E0\\u05D2\\u05D5 \\u05DB\\u05E9\\u05DC\\u05E4\\u05D7\\u05D5\\u05EA \\u05E9\\u05E0\\u05D9 \\u05E9\\u05D7\\u05E7\\u05E0\\u05D9\\u05DD \\u05D9\\u05D5\\u05E9\\u05D1\\u05D9\\u05DD \\u05D5\\u05DE\\u05D5\\u05DB\\u05E0\\u05D9\\u05DD.", "Room ready — the host can start Bingo when at least two players are seated and ready."],
  ["\\u05DE\\u05DE\\u05EA\\u05D9\\u05E0\\u05D9\\u05DD \\u05E9\\u05D4\\u05DE\\u05D0\\u05E8\\u05D7 \\u05D9\\u05E4\\u05EA\\u05D7 \\u05D1\\u05D9\\u05E0\\u05D2\\u05D5.", "Waiting for the host to open Bingo."],
  ["\\u05D0\\u05D9\\u05DF \\u05E1\\u05D9\\u05D1\\u05D5\\u05D1 \\u05D1\\u05D9\\u05E0\\u05D2\\u05D5 \\u05E4\\u05E2\\u05D9\\u05DC \\u05E2\\u05D3\\u05D9\\u05D9\\u05DF", "No active Bingo round yet"],
  ["\\u05D0\\u05D9\\u05DF \\u05DE\\u05D6\\u05D4\\u05D4 \\u05E9\\u05D7\\u05E7\\u05DF", "No player identity"],
  ["\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05DC\\u05E4\\u05EA\\u05D5\\u05D7 \\u05DB\\u05E2\\u05EA", "Cannot start right now"],
  ["\\u05D4\\u05E7\\u05E8\\u05D9\\u05D0\\u05D5\\u05EA \\u05DE\\u05EA\\u05D7\\u05D9\\u05DC\\u05D5\\u05EA \\u05D0\\u05D7\\u05E8\\u05D9 \\u05E9\\u05D4\\u05DE\\u05D0\\u05E8\\u05D7 \\u05E4\\u05D5\\u05EA\\u05D7 \\u05D0\\u05EA \\u05D4\\u05E1\\u05D9\\u05D1\\u05D5\\u05D1.", "Calls start after the host opens the round."],
  ["\\u05D0\\u05D9\\u05DF \\u05DE\\u05E9\\u05D7\\u05E7 \\u05D7\\u05D9", "No live game"],
  ["\\u05D0\\u05D9\\u05DF \\u05DE\\u05E9\\u05D7\\u05E7 \\u05E9\\u05D4\\u05E1\\u05EA\\u05D9\\u05D9\\u05DD", "No finished game"],
  ["\\u05DC\\u05D0 \\u05DE\\u05D0\\u05E8\\u05D7 \\u05D0\\u05D5 \\u05DC\\u05D0 \\u05DE\\u05D5\\u05DB\\u05DF", "Not host or not ready"],
  ["\\u05E4\\u05EA\\u05D7\\u05D5 \\u05D7\\u05D3\\u05E8\\u05D9\\u05DD \\u05DE\\u05E9\\u05D5\\u05EA\\u05E4\\u05D9\\u05DD \\u05DB\\u05D3\\u05D9 \\u05DC\\u05E9\\u05D7\\u05E7 \\u05D1\\u05D9\\u05E0\\u05D2\\u05D5 \\u05D0\\u05D5\\u05E0\\u05DC\\u05D9\\u05D9\\u05DF.", "Open shared rooms to play Bingo online."],
  ["\\u05DC\\u05D0 \\u05D1\\u05D7\\u05D3\\u05E8 \\u05D1\\u05D9\\u05E0\\u05D2\\u05D5 \\u05D7\\u05D9", "Not in a live Bingo room"],
  ["\\u05DC\\u05D0 \\u05DE\\u05D7\\u05D5\\u05D1\\u05E8 \\u05DC\\u05D7\\u05D3\\u05E8", "Not connected to a room"],
  ["\\u05D4\\u05D7\\u05D3\\u05E8 \\u05DC\\u05D0 \\u05E4\\u05E2\\u05D9\\u05DC", "Room is not active"],
  ["\\u05DB\\u05D1\\u05E8 \\u05D9\\u05E9 \\u05E1\\u05E9\\u05DF \\u05E4\\u05E2\\u05D9\\u05DC \\u05D0\\u05D5 \\u05E9\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05DC\\u05E4\\u05EA\\u05D5\\u05D7", "A session is already active or start is blocked"],
  ["\\u05DE\\u05DE\\u05EA\\u05D9\\u05E0\\u05D9\\u05DD \\u05DC\\u05D8\\u05D9\\u05D9\\u05DE\\u05E8 \\u05D4\\u05E7\\u05E8\\u05D9\\u05D0\\u05D4", "Waiting for the call timer"],
  ["\\u05E8\\u05E7 \\u05D4\\u05E7\\u05D5\\u05E8\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC \\u05DC\\u05DE\\u05E9\\u05D5\\u05DA \\u05DE\\u05E1\\u05E4\\u05E8", "Only the caller can draw a number"],
  ["\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 (\\u05E0\\u05D3\\u05E8\\u05E9 \\u05DE\\u05D5\\u05E9\\u05D1)", "No card (seat required)"],
  ["\\u05D4\\u05DE\\u05E9\\u05D7\\u05E7 \\u05DC\\u05D0 \\u05D1\\u05E2\\u05D9\\u05E6\\u05D5\\u05DE\\u05D5", "Game is not in progress"],
  ["\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05DC\\u05D1\\u05E7\\u05E9 \\u05DE\\u05E9\\u05D7\\u05E7 \\u05D7\\u05D5\\u05D6\\u05E8 \\u05DB\\u05E2\\u05EA", "Cannot request a rematch right now"],
  ["\\u05DE\\u05E9\\u05D7\\u05E7 \\u05D7\\u05D5\\u05D6\\u05E8 \\u05DC\\u05D0 \\u05D6\\u05DE\\u05D9\\u05DF", "Rematch is not available"],
  ["\\u05D0\\u05D9\\u05DF \\u05DE\\u05D4 \\u05DC\\u05D1\\u05D8\\u05DC", "Nothing to cancel"],
  ["\\u05D4\\u05DE\\u05E9\\u05D7\\u05E7 \\u05D4\\u05E1\\u05EA\\u05D9\\u05D9\\u05DD", "Game finished"],
  ["\\u05DB\\u05D1\\u05E8 \\u05E0\\u05EA\\u05D1\\u05E2", "Already claimed"],
  ["\\u05E2\\u05D3\\u05D9\\u05D9\\u05DF \\u05DC\\u05D0 \\u05D6\\u05DB\\u05D0\\u05D9", "Pattern not complete"],
  ["\\u05DE\\u05E9\\u05D7\\u05E7 \\u05E4\\u05E2\\u05D9\\u05DC - \\u05D4\\u05DE\\u05E1\\u05E4\\u05E8\\u05D9\\u05DD \\u05E0\\u05E7\\u05E8\\u05D0\\u05D9\\u05DD \\u05D1\\u05E9\\u05E8\\u05EA.", "Game in progress — numbers are called in order."],
  ["\\u05DE\\u05E9\\u05D7\\u05E7 \\u05E4\\u05E2\\u05D9\\u05DC", "Game in progress"],
  ["\\u05D4\\u05E1\\u05EA\\u05D9\\u05D9\\u05DD", "Finished"],
];

// Longer strings first
map.sort((a, b) => b[0].length - a[0].length);
let hits = 0;
for (const [from, to] of map) {
  if (t.includes(from)) {
    t = t.split(from).join(to);
    hits++;
  }
}
// Any remaining HE escapes → remove
const left = (t.match(/\\u05[0-9A-Fa-f]{2}/gi) || []).length;
t = t.replace(/\\u05[0-9A-Fa-f]{2}/gi, "");
fs.writeFileSync(p, t);
console.log({ hits, leftAfterMap: left });
