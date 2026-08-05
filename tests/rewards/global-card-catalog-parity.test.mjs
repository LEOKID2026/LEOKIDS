/**
 * Global (student/public) card catalog contract — Root A locale-neutral fields.
 * Admin catalog checks live in card-catalog-admin-parity.test.mjs.
 *
 * Run: node --test tests/rewards/global-card-catalog-parity.test.mjs
 */

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

describe("global-card-catalog-parity", () => {
  test("student cards view exposes locale-neutral requirement and progress fields", () => {
    const src = readFileSync(join(ROOT, "lib/rewards/server/reward-cards.server.js"), "utf8");
    assert.match(src, /requirementText/);
    assert.match(src, /progressText/);
    assert.match(src, /visibilityMode/);
    assert.doesNotMatch(src, /\brequirementHe\b/);
    assert.doesNotMatch(src, /\bprogressHe\b/);
    assert.doesNotMatch(src, /\blockMessageHe\b/);
    assert.doesNotMatch(src, /\bbuildCardRequirementHe\b/);
    assert.doesNotMatch(src, /\bname_he\b/);
    assert.doesNotMatch(src, /\bdescription_he\b/);
  });
});
