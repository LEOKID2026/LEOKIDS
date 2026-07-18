/**
 * Export lib/rewards/reward-card-global-en-catalog.js → content-packs/en/rewards/card-catalog.json
 * Run: node scripts/i18n/export-reward-card-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REWARD_CARD_GLOBAL_EN_CATALOG } from "../../lib/rewards/reward-card-global-en-catalog.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outPath = path.join(root, "content-packs/en/rewards/card-catalog.json");

/**
 * @param {string} cardKey
 */
function inferCategory(cardKey) {
  if (cardKey.startsWith("achievement_")) return "achievement";
  if (cardKey.startsWith("event_")) return "event";
  if (cardKey.startsWith("leo_")) return "shop";
  return "card";
}

/** @type {Record<string, object>} */
const cards = {};
for (const [cardKey, entry] of Object.entries(REWARD_CARD_GLOBAL_EN_CATALOG)) {
  const title = String(entry.name || "").trim();
  const description = String(entry.description || "").trim();
  cards[cardKey] = {
    cardKey,
    title,
    description,
    category: inferCategory(cardKey),
    accessibility: {
      title,
      description,
    },
  };
}

const payload = {
  version: 1,
  cardCount: Object.keys(cards).length,
  cards,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Exported ${payload.cardCount} cards → ${outPath}`);
