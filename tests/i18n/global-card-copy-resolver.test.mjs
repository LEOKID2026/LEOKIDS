/**
 * GLOBAL card-copy resolver unit tests (no Israel / Hebrew path).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { resolveGlobalCardCopy } from "../../lib/rewards/card-copy-resolver.js";
import { isIsraelOnlyRewardCardKey } from "../../lib/rewards/global-card-scope.js";
import { CANONICAL_GLOBAL_CARD_KEYS } from "../../lib/rewards/canonical-global-card-manifest.js";
import { HEBREW_RE } from "../../lib/rewards/reward-card-global-display.js";

const sampleCard = {
  id: "test-1",
  card_key: "achievement_20_questions",
  rarity: "rare",
  card_type: "achievement",
  can_be_purchased: false,
};

const rules = [
  {
    rule_type: "total_questions",
    is_active: true,
    params_json: { min_questions: 20 },
    min_questions: 20,
  },
];

test("GLOBAL resolver ignores Hebrew-shaped DB fields if present on row", () => {
  const copy = resolveGlobalCardCopy({
    productContext: "global",
    contentLocale: "en",
    card: {
      ...sampleCard,
      name_he: "SHOULD_NOT_APPEAR",
      description_he: "SHOULD_NOT_APPEAR",
      requirement_text_he: "SHOULD_NOT_APPEAR",
    },
    rules,
    includeRequirement: true,
  });
  assert.equal(HEBREW_RE.test(copy.name), false);
  assert.equal(HEBREW_RE.test(copy.description), false);
  assert.equal(HEBREW_RE.test(copy.requirementText), false);
  assert.equal(HEBREW_RE.test(copy.lockMessage), false);
  assert.ok(copy.requirementText.trim().length > 0);
  assert.equal(copy.contentLocale, "en");
  assert.notEqual(copy.name, "SHOULD_NOT_APPEAR");
  assert.notEqual(copy.requirementText, "SHOULD_NOT_APPEAR");
});

test("GLOBAL resolver requires contentLocale", () => {
  assert.throws(
    () =>
      resolveGlobalCardCopy({
        productContext: "global",
        contentLocale: "",
        card: sampleCard,
        rules,
      }),
    /missing_content_locale/
  );
});

test("GLOBAL resolver rejects Israel-only keys", () => {
  assert.throws(
    () =>
      resolveGlobalCardCopy({
        productContext: "global",
        contentLocale: "en",
        card: { ...sampleCard, card_key: "achievement_hebrew_star" },
        rules,
      }),
    /israel_only_card/
  );
});

test("ar-001 requirement is non-English and non-Hebrew", () => {
  const copy = resolveGlobalCardCopy({
    productContext: "global",
    contentLocale: "ar-001",
    card: sampleCard,
    rules,
    includeRequirement: true,
  });
  assert.equal(HEBREW_RE.test(copy.requirementText), false);
  assert.ok(copy.requirementText.trim().length > 0);
  assert.notEqual(copy.requirementText, "Answer 20 questions in total");
});

test("canonical manifest excludes Israel-only keys", () => {
  for (const key of CANONICAL_GLOBAL_CARD_KEYS) {
    assert.equal(isIsraelOnlyRewardCardKey(key), false);
  }
  assert.equal(isIsraelOnlyRewardCardKey("achievement_hebrew_star"), true);
  assert.equal(isIsraelOnlyRewardCardKey("event_hanukkah"), true);
  assert.ok(CANONICAL_GLOBAL_CARD_KEYS.includes("leo_arcade_champion"));
  assert.ok(CANONICAL_GLOBAL_CARD_KEYS.includes("achievement_20_questions"));
});

test("shop card without rules uses availableInShop template", () => {
  const copy = resolveGlobalCardCopy({
    productContext: "global",
    contentLocale: "en",
    card: {
      card_key: "leo_arcade_champion",
      can_be_purchased: true,
      card_type: "shop",
      rarity: "gold",
    },
    rules: [],
    includeRequirement: true,
  });
  assert.equal(HEBREW_RE.test(copy.requirementText), false);
  assert.match(copy.requirementText, /shop|Shop|Available/i);
  assert.ok(copy.name.length > 0);
});

test("Israel card-copy entrypoint does not exist in GLOBAL", async () => {
  const mod = await import("../../lib/rewards/card-copy-resolver.js");
  assert.equal(typeof mod.resolveIsraelCardCopy, "undefined");
  assert.equal(typeof mod.resolveGlobalCardCopy, "function");
});
