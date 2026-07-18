/**
 * Approved English wording selftest for ported math games.
 * Run: node components/educational-games/math-games-approved-english.selftest.mjs
 */
import assert from "assert";
import {
  buildGiftsSessionRun,
  giftsFeedback,
  giftsItemLabelForKey,
  giftsPrompt,
  giftsSolutionParts,
  remainingItemsText,
} from "./leo-gifts/leo-gifts-data.js";
import {
  bakeryControlHint,
  bakeryFeedback,
  bakeryPrompt,
  bakerySolutionParts,
  buildBakerySessionRun,
} from "./leo-bakery/leo-bakery-data.js";
import {
  buildOrderedSessionRun,
  pathFeedback,
  pathSolutionParts,
} from "./leo-number-path/leo-number-path-data.js";
import {
  difficultyHint,
  pickCustomersForRun,
  pizzeriaSolutionText,
} from "./leo-pizzeria/leo-pizzeria-data.js";
import { gamePackCopy } from "../../lib/games/game-pack-copy.js";

const FRACTION_PACK = "components__educational-games__leo-pizzeria__FractionDisplay";
const COMPARE_LABEL = Object.freeze({
  greater: gamePackCopy(FRACTION_PACK, "compare_greater"),
  less: gamePackCopy(FRACTION_PACK, "compare_less"),
  equal: gamePackCopy(FRACTION_PACK, "compare_equal"),
});

const FORBIDDEN = [
  "How many every group",
  "Make the amount be the same total",
  "undefined",
  "null",
  "NaN",
  "[object Object]",
  "LESS",
  "GREATER",
  "EQUAL",
  "share_equally",
  "make_groups",
  "findTotal",
  "sameTotal",
  "build_fraction",
  "א",
  "ב",
];

const ENGLISH_LEAK = /\b(LESS|GREATER|EQUAL|share_equally|make_groups|findTotal|sameTotal|build_fraction)\b/;

function assertNoForbidden(text, ctx) {
  const t = String(text ?? "");
  for (const bad of FORBIDDEN) {
    assert(!t.includes(bad), `${ctx}: forbidden "${bad}" in "${t}"`);
  }
  assert(!ENGLISH_LEAK.test(t), `${ctx}: enum leak in "${t}"`);
  assert(!/undefined|null|NaN|\[object Object\]/.test(t), `${ctx}: technical leak in "${t}"`);
}

console.log("math-games approved English wording selftest…");

assert.strictEqual(giftsItemLabelForKey("item_gifts", 1), "gift");
assert.strictEqual(giftsItemLabelForKey("item_gifts", 2), "gifts");
assert.strictEqual(giftsItemLabelForKey("item_candies", 1), "candy");
assert.strictEqual(giftsItemLabelForKey("item_stickers", 2), "stickers");
assert.strictEqual(remainingItemsText(0), "Nothing left over.");
assert.strictEqual(remainingItemsText(1), "1 item left over.");
assert.strictEqual(remainingItemsText(2), "2 items left over.");

assert.strictEqual(COMPARE_LABEL.greater, "First fraction is greater");
assert.strictEqual(COMPARE_LABEL.less, "Second fraction is greater");
assert.strictEqual(COMPARE_LABEL.equal, "The fractions are equal");

assert.strictEqual(difficultyHint("medium"), "Build fractions, equivalent fractions, and compare");
assert.strictEqual(difficultyHint("hard"), "Equivalent fractions, compare, and combine visually");

const diffs = /** @type {const} */ (["easy", "medium", "hard"]);

for (const d of diffs) {
  for (let s = 0; s < 40; s += 1) {
    for (const task of buildGiftsSessionRun(d)) {
      assertNoForbidden(giftsPrompt(task), `gifts/${d}/${task.mode}`);
      assertNoForbidden(giftsFeedback(true, task), `gifts-feedback-ok/${task.id}`);
      assertNoForbidden(giftsFeedback(false, task), `gifts-feedback-bad/${task.id}`);
      const parts = giftsSolutionParts(task);
      assertNoForbidden(parts.text, `gifts-solution/${task.id}`);
      assert.match(parts.equation, /=|×/);
    }

    for (const task of buildBakerySessionRun(d)) {
      assertNoForbidden(bakeryPrompt(task), `bakery/${d}/${task.mode}`);
      assertNoForbidden(bakeryControlHint(task), `bakery-control/${task.mode}`);
      assertNoForbidden(bakeryFeedback(true), "bakery-feedback-ok");
      assertNoForbidden(bakeryFeedback(false), "bakery-feedback-bad");
      const parts = bakerySolutionParts(task);
      assertNoForbidden(parts.text, `bakery-solution/${task.id}`);
      assert.match(parts.equation, /×|=/);
    }

    for (const task of buildOrderedSessionRun(d)) {
      assertNoForbidden(task.promptHe, `number-path/${d}/${task.rule}`);
      assertNoForbidden(pathFeedback(true), "path-feedback-ok");
      assertNoForbidden(pathFeedback(false), "path-feedback-bad");
      const parts = pathSolutionParts(task);
      assert.strictEqual(parts.text, "Correct path:");
      assert.ok(parts.pathLtr.length > 0);
    }

    for (const order of pickCustomersForRun(d)) {
      if (order.variant === "compare_fractions") {
        assertNoForbidden(pizzeriaSolutionText(order), `pizzeria-compare/${order.id}`);
      }
    }
  }
}

console.log("math-games approved English wording selftest OK");
