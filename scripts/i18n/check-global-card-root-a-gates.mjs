#!/usr/bin/env node
/**
 * Root A regression gates for GLOBAL card architecture.
 * Workspace-only. Fail closed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CANONICAL_GLOBAL_CARD_KEYS } from "../../lib/rewards/canonical-global-card-manifest.js";
import {
  GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS,
  isIsraelOnlyRewardCardKey,
} from "../../lib/rewards/global-card-scope.js";
import { resolveGlobalCardCopy } from "../../lib/rewards/card-copy-resolver.js";
import { HEBREW_RE } from "../../lib/rewards/reward-card-global-display.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { LOCALE_REGISTRY } from "../../lib/i18n/locale-registry.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error("FAIL:", msg);
}

// 1) Source guard: GLOBAL requirement path must not short-circuit on *_he
{
  const reqGlobal = fs.readFileSync(
    path.join(root, "lib/rewards/card-requirement-global.server.js"),
    "utf8"
  );
  // Ban property reads / assignments — comments may mention the forbidden fields.
  if (/\b(card|rule)\s*\??\.\s*(requirement_text_he|description_he|name_he)\b/.test(reqGlobal)) {
    fail("card-requirement-global.server.js must not read *_he fields");
  }
  const resolver = fs.readFileSync(path.join(root, "lib/rewards/card-copy-resolver.js"), "utf8");
  if (!resolver.includes('productContext !== "global"') && !resolver.includes("productContext === \"global\"")) {
    fail("card-copy-resolver missing hard productContext guard");
  }
}

// 2) UI must not read *He for requirements
{
  const cardsPage = fs.readFileSync(path.join(root, "pages/student/cards.js"), "utf8");
  if (/requirementHe|lockMessageHe|progressHe/.test(cardsPage)) {
    fail("pages/student/cards.js still references *He requirement fields");
  }
  if (/requirementText\s*\|\|\s*requirementHe|lockMessage\s*\|\|\s*lockMessageHe/.test(cardsPage)) {
    fail("pages/student/cards.js has Hebrew fallback pattern");
  }
}

// 3) Canonical manifest integrity
for (const key of GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS) {
  if (CANONICAL_GLOBAL_CARD_KEYS.includes(key)) {
    fail(`Israel-only key in canonical GLOBAL manifest: ${key}`);
  }
}
if (!CANONICAL_GLOBAL_CARD_KEYS.includes("leo_arcade_champion")) {
  fail("missing leo_arcade_champion in canonical manifest");
}

// 4) Every selector-visible locale resolves to a card master with catalog or chain
const selectable = Object.values(LOCALE_REGISTRY).filter(
  (l) => l.enabled !== false && l.selectorVisible !== false
);
for (const loc of selectable) {
  const chain = getLocaleFallbackChain(loc.id);
  const hasCatalog = chain.some((c) =>
    fs.existsSync(path.join(root, "content-packs", c, "rewards", "card-catalog.json"))
  );
  if (!hasCatalog) fail(`locale ${loc.id} has no card-catalog in fallback chain`);
}

// 5) Sample GLOBAL cards produce non-empty non-Hebrew requirements
const samples = [
  ["achievement_20_questions", [{ rule_type: "total_questions", is_active: true, min_questions: 20, params_json: { min_questions: 20 } }]],
  ["leo_arcade_champion", []],
  ["achievement_3_day_streak", [{ rule_type: "learning_streak_days", is_active: true, min_streak_days: 3, params_json: { min_streak_days: 3 } }]],
];
for (const locale of ["en", "ar-001", "es-MX", "pt-BR", "de-DE"]) {
  for (const [cardKey, rules] of samples) {
    if (isIsraelOnlyRewardCardKey(cardKey)) continue;
    const copy = resolveGlobalCardCopy({
      productContext: "global",
      contentLocale: locale,
      card: {
        card_key: cardKey,
        can_be_purchased: cardKey.startsWith("leo_"),
        card_type: cardKey.startsWith("leo_") ? "shop" : "achievement",
        rarity: "rare",
        description_he: "\u05D8\u05E7\u05E1\u05D8 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA",
        requirement_text_he: "\u05D8\u05E7\u05E1\u05D8 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA",
      },
      rules,
      includeRequirement: true,
    });
    if (!copy.requirementText?.trim()) fail(`empty requirement ${locale} ${cardKey}`);
    if (HEBREW_RE.test(copy.requirementText)) fail(`Hebrew requirement ${locale} ${cardKey}`);
    if (locale !== "en" && !String(locale).startsWith("en-") && copy.requirementText === "Answer 20 questions in total") {
      fail(`forbidden English requirement for ${locale} ${cardKey}`);
    }
  }
}

if (failures.length) {
  console.error(`\n${failures.length} gate failure(s)`);
  process.exit(1);
}
console.log("OK global-card-root-a-gates");
console.log(
  JSON.stringify(
    {
      canonicalCount: CANONICAL_GLOBAL_CARD_KEYS.length,
      israelOnlyCount: GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS.length,
      selectableLocalesChecked: selectable.length,
    },
    null,
    2
  )
);
