/**
 * Regression guard: master "how to play" steps route through locale keys, not hardcoded XP copy.
 * Run: node --test tests/learning/master-no-visible-english.test.mjs
 */

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const MASTER_PAGES = [
  "pages/learning/science-master.js",
  "pages/learning/history-master.js",
];

describe("master pages: how-to-play uses localized copy keys", () => {
  for (const file of MASTER_PAGES) {
    test(`${file} routes how-to-play step4 through locale`, () => {
      const src = readFileSync(join(ROOT, file), "utf8");
      assert.match(src, /howToLearnSteps\.step4/);
      assert.doesNotMatch(src, />\s*Build answer streaks and earn stars and XP points\s*</);
    });
  }
});
