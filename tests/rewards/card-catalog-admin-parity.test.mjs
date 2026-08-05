/**
 * Admin card writable fields align with student view metadata.
 * Run: node --test tests/rewards/card-catalog-admin-parity.test.mjs
 */

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ADMIN_CARD_WRITABLE_FIELDS } from "../../lib/rewards/server/admin-card-rules.server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

describe("card-catalog-admin-parity", () => {
  test("student cards view exposes locale-neutral requirement and progress fields", () => {
    const src = readFileSync(join(ROOT, "lib/rewards/server/reward-cards.server.js"), "utf8");
    assert.match(src, /requirementText/);
    assert.match(src, /progressText/);
    assert.match(src, /visibilityMode/);
    assert.match(src, /resolveGlobalCardCopy/);
    assert.doesNotMatch(src, /requirementHe/);
    assert.doesNotMatch(src, /buildCardRequirementHe/);
  });

  test("admin writable fields include visibility and grade bands", () => {
    assert.ok(ADMIN_CARD_WRITABLE_FIELDS.includes("visibility_mode"));
    assert.ok(ADMIN_CARD_WRITABLE_FIELDS.includes("grade_bands"));
    assert.ok(ADMIN_CARD_WRITABLE_FIELDS.includes("image_url"));
    assert.equal(ADMIN_CARD_WRITABLE_FIELDS.includes("requirement_text_he"), false);
    assert.equal(ADMIN_CARD_WRITABLE_FIELDS.includes("name_he"), false);
    assert.equal(ADMIN_CARD_WRITABLE_FIELDS.includes("description_he"), false);
  });

  test("admin cards API uses validateCardPayload", () => {
    const indexSrc = readFileSync(join(ROOT, "pages/api/admin/rewards/cards/index.js"), "utf8");
    const idSrc = readFileSync(join(ROOT, "pages/api/admin/rewards/cards/[id].js"), "utf8");
    assert.match(indexSrc, /validateCardPayload/);
    assert.match(idSrc, /validateCardPayload/);
    assert.match(idSrc, /pickCardWritableFields/);
  });

  test("rules admin API routes exist", () => {
    const rulesIndex = readFileSync(
      join(ROOT, "pages/api/admin/rewards/cards/[id]/rules/index.js"),
      "utf8"
    );
    const grant = readFileSync(join(ROOT, "pages/api/admin/rewards/cards/[id]/grant.js"), "utf8");
    assert.match(rulesIndex, /listCardRules/);
    assert.match(rulesIndex, /createCardRule/);
    assert.match(grant, /adminGrantCardToStudent/);
  });
});
