import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  resolveGameDisplayClient,
  resolveGameHelpClient,
} from "../../lib/games/game-ui-copy.client.js";

const LOCALES = ["en", "en-XA", "ar-XB"];

/** @type {{ label: string, gameKey: string }[]} */
const FAMILIES = [
  { label: "educational", gameKey: "leo-lab" },
  { label: "solo", gameKey: "maze" },
  { label: "arcade", gameKey: "chess" },
  { label: "offline", gameKey: "memory-match" },
];

describe("game UI packs respond to pseudo locales", () => {
  for (const family of FAMILIES) {
    for (const locale of LOCALES) {
      test(`${family.label}/${family.gameKey} display @ ${locale}`, () => {
        const display = resolveGameDisplayClient(family.gameKey, locale);
        assert.ok(display.title.trim(), "title required");
        assert.notEqual(display.title, family.gameKey, "title must not be raw game key");
        if (locale === "en-XA") {
          assert.match(display.title, /^\[\[\[/, "en-XA title should be pseudo-long wrapped");
        }
        if (locale === "ar-XB") {
          assert.equal(display.title.charCodeAt(0), 0x202b);
          assert.equal(display.title.charCodeAt(display.title.length - 1), 0x202c);
        }
      });

      test(`${family.label}/${family.gameKey} help @ ${locale}`, () => {
        const help = resolveGameHelpClient(family.gameKey, locale);
        const howToPlay = String(help.howToPlay || "").trim();
        assert.ok(howToPlay, "howToPlay required");
        assert.doesNotMatch(howToPlay, /^how_to_play$/i, "must not expose raw key");
      });
    }
  }
});
