/**
 * Validate reward content packs (136 cards + UI strings + catalog parity).
 * Run: node scripts/i18n/validate-reward-content-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cardCatalog from "../../content-packs/en/rewards/card-catalog.json" with { type: "json" };
import rewardUi from "../../content-packs/en/rewards/ui.json" with { type: "json" };
import { REWARD_CARD_GLOBAL_EN_CATALOG } from "../../lib/rewards/reward-card-global-en-catalog.js";
import {
  loadRewardCardCatalog,
  resolveRewardCardEntry,
  validateRewardCatalogAgainstKeys,
} from "../../lib/rewards/reward-pack-copy.js";
import { CARD_RULE_TYPE_META } from "../../lib/rewards/card-rule-types.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
/** @type {string[]} */
const errors = [];

const catalogKeys = Object.keys(cardCatalog.cards || {});
const legacyKeys = Object.keys(REWARD_CARD_GLOBAL_EN_CATALOG);

if (catalogKeys.length !== 136) {
  errors.push(`expected 136 cards in card-catalog.json, got ${catalogKeys.length}`);
}

const parity = validateRewardCatalogAgainstKeys(legacyKeys);
if (!parity.ok) {
  if (parity.missingInCatalog.length) {
    errors.push(`catalog missing keys: ${parity.missingInCatalog.slice(0, 5).join(", ")}`);
  }
  if (parity.orphanInCatalog.length) {
    errors.push(`catalog orphan keys: ${parity.orphanInCatalog.slice(0, 5).join(", ")}`);
  }
  if (parity.duplicateIds.length) {
    errors.push(`duplicate card keys: ${parity.duplicateIds.join(", ")}`);
  }
}

for (const cardKey of catalogKeys) {
  const entry = cardCatalog.cards[cardKey];
  if (entry.cardKey !== cardKey) errors.push(`${cardKey}: cardKey mismatch`);
  if (!String(entry.title || "").trim()) errors.push(`${cardKey}: missing title`);
  if (!String(entry.description || "").trim()) errors.push(`${cardKey}: missing description`);
}

for (const ruleType of Object.keys(CARD_RULE_TYPE_META)) {
  if (ruleType === "subject_improvement") continue;
  if (!rewardUi.requirements?.[ruleType]) {
    errors.push(`missing requirement template for rule_type: ${ruleType}`);
  }
}

for (const locale of ["en", "en-XA", "ar-XB"]) {
  const loaded = loadRewardCardCatalog(locale);
  if (Object.keys(loaded).length !== 136) {
    errors.push(`${locale}: loadRewardCardCatalog count ${Object.keys(loaded).length}`);
  }
  const sample = resolveRewardCardEntry("achievement_20_questions", locale);
  if (!sample?.title) errors.push(`${locale}: sample card missing title`);
  if (locale === "en-XA" && sample?.title && !/^\[\[\[/.test(sample.title)) {
    errors.push("en-XA: pseudo-long not applied to sample card title");
  }
  if (locale === "ar-XB" && sample?.title && sample.title.charCodeAt(0) !== 0x202b) {
    errors.push("ar-XB: pseudo-rtl not applied to sample card title");
  }
}

const uiPath = path.join(root, "content-packs/en/rewards/ui.json");
if (!fs.existsSync(uiPath)) errors.push("missing ui.json");

if (errors.length) {
  console.error("validate-reward-content-packs FAILED");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(`validate-reward-content-packs OK (${catalogKeys.length} cards, UI pack present)`);
