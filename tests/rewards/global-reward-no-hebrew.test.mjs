/**
 * Focused global-product guards for rewards/cards Hebrew blockers.
 * Run: node --test tests/rewards/global-reward-no-hebrew.test.mjs
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  HEBREW_RE,
  isHebrewText,
  resolveGlobalRewardCardDisplay,
  GLOBAL_UNSUPPORTED_REWARD_CARD_KEYS,
} from "../../lib/rewards/reward-card-global-display.js";
import { resolveRewardCardImageUrls } from "../../lib/rewards/reward-card-image-urls.js";
import {
  loadRewardCardCatalog,
  resolveRewardCardEntry,
} from "../../lib/rewards/reward-pack-copy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const HE = /[\u0590-\u05FF]/;

const PLACEHOLDER_TIERS = ["regular", "gold", "rare", "special"];

function readPlaceholder(tier) {
  return fs.readFileSync(
    path.join(ROOT, "public/rewards/cards/placeholders", tier, "default.svg"),
    "utf8",
  );
}

describe("reward placeholder SVGs — zero Hebrew", () => {
  for (const tier of PLACEHOLDER_TIERS) {
    test(`${tier}/default.svg has no Hebrew characters`, () => {
      const svg = readPlaceholder(tier);
      assert.equal(HE.test(svg), false, `${tier} still contains Hebrew`);
      assert.match(svg, /CARD/i);
    });
  }
});

describe("HEBREW_RE detects Hebrew", () => {
  test("matches Hebrew letters", () => {
    assert.equal(HEBREW_RE.test("כלב"), true);
    assert.equal(isHebrewText("תיאור"), true);
    assert.equal(isHebrewText("קלף רגיל"), true);
  });

  test("rejects English / empty", () => {
    assert.equal(HEBREW_RE.test("Reward card"), false);
    assert.equal(isHebrewText("Mystery card"), false);
    assert.equal(isHebrewText(""), false);
    assert.equal(isHebrewText(null), false);
  });

  test("broken never-match pattern is not used", () => {
    assert.notEqual(String(HEBREW_RE), String(/(?!)/));
  });
});

describe("resolveGlobalRewardCardDisplay — no Hebrew DB fallback", () => {
  test("Hebrew nameHe/descriptionHe never become display output", () => {
    const display = resolveGlobalRewardCardDisplay({
      nameHe: "כלב",
      descriptionHe: "תיאור",
    });
    assert.equal(HE.test(display.name), false);
    assert.equal(HE.test(display.description), false);
    assert.equal(display.name, "Reward card");
  });

  test("missing English catalog + Hebrew DB fields → safe English fallback", () => {
    const display = resolveGlobalRewardCardDisplay({
      cardKey: "definitely_missing_card_key_xyz",
      nameHe: "כוכב עברית",
      descriptionHe: "תיאור בעברית",
    });
    assert.equal(display.name, "Reward card");
    assert.equal(HE.test(display.description), false);
    assert.match(display.description, /Collect|Reward/i);
  });

  test("catalog English preferred over Hebrew DB fields", () => {
    const display = resolveGlobalRewardCardDisplay({
      cardKey: "achievement_20_questions",
      nameHe: "עשרים שאלות",
      descriptionHe: "תיאור",
    });
    assert.equal(display.name, "20 Questions");
    assert.equal(HE.test(display.description), false);
  });

  test("unsupported Israeli keys never expose Hebrew Star / Homeland Explorer", () => {
    for (const cardKey of GLOBAL_UNSUPPORTED_REWARD_CARD_KEYS) {
      const display = resolveGlobalRewardCardDisplay({
        cardKey,
        nameHe: "כוכב",
        descriptionHe: "תיאור",
      });
      assert.equal(display.name, "Reward card");
      assert.equal(/hebrew star|homeland explorer/i.test(display.name), false);
      assert.equal(/hebrew star|homeland explorer/i.test(display.description), false);
      assert.equal(resolveRewardCardEntry(cardKey, "en"), null);
    }
  });
});

describe("resolveRewardCardImageUrls — English placeholders", () => {
  test("null card → English regular placeholder", () => {
    const urls = resolveRewardCardImageUrls(null);
    assert.equal(urls.display, "/rewards/cards/placeholders/regular/default.svg");
    assert.equal(HE.test(readPlaceholder("regular")), false);
  });

  test("missing image → English placeholder", () => {
    const urls = resolveRewardCardImageUrls({ image_url: "" });
    assert.equal(urls.display, "/rewards/cards/placeholders/regular/default.svg");
  });

  test("broken local SVG path → English placeholder", () => {
    const urls = resolveRewardCardImageUrls({
      image_url: "/rewards/cards/shop/animals/missing.svg",
    });
    assert.equal(urls.display, "/rewards/cards/placeholders/regular/default.svg");
  });
});

describe("en reward catalog — no Israeli titles", () => {
  test("active en catalog omits Hebrew Star and Homeland Explorer", () => {
    const catalog = loadRewardCardCatalog("en");
    const blob = JSON.stringify(catalog);
    assert.equal(Object.prototype.hasOwnProperty.call(catalog, "achievement_hebrew_star"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(catalog, "achievement_moledet_explorer"), false);
    assert.equal(/Hebrew Star/.test(blob), false);
    assert.equal(/Homeland Explorer/.test(blob), false);
    assert.equal(Object.keys(catalog).length, 134);
  });
});

describe("student cards/shop UI — no direct name_he", () => {
  const studentFiles = [
    "pages/student/cards.js",
    "components/student/rewards/StudentCardsShopView.jsx",
  ];

  for (const rel of studentFiles) {
    test(`${rel} does not reference name_he / description_he`, () => {
      const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
      assert.equal(/\bname_he\b/.test(text), false, `${rel} still references name_he`);
      assert.equal(/\bdescription_he\b/.test(text), false, `${rel} still references description_he`);
    });
  }
});
