#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  CANONICAL_GLOBAL_CARD_KEYS,
  GLOBAL_PACK_ONLY_NON_RUNTIME_CARD_KEYS,
} from "../../lib/rewards/canonical-global-card-manifest.js";
import { isIsraelOnlyRewardCardKey } from "../../lib/rewards/global-card-scope.js";
import { resolveGlobalCardCopy } from "../../lib/rewards/card-copy-resolver.js";
import { HEBREW_RE } from "../../lib/rewards/reward-card-global-display.js";

const HE = HEBREW_RE;
const results = [];
const seen = new Set();
let fail = 0;

for (const key of CANONICAL_GLOBAL_CARD_KEYS) {
  const row = {
    key,
    unique: !seen.has(key),
    israel: isIsraelOnlyRewardCardKey(key),
    packOnly: GLOBAL_PACK_ONLY_NON_RUNTIME_CARD_KEYS.includes(key),
    name: "",
    description: "",
    requirementText: "",
    hebrew: false,
    emptyName: false,
    emptyRequirement: false,
    ok: true,
    errors: [],
  };
  if (seen.has(key)) {
    row.ok = false;
    row.errors.push("duplicate_key");
  }
  seen.add(key);
  if (row.israel || row.packOnly) {
    row.ok = false;
    row.errors.push("should_not_be_in_canonical");
  }
  try {
    const copy = resolveGlobalCardCopy({
      productContext: "global",
      contentLocale: "en",
      card: { card_key: key, rarity: "regular", card_type: "achievement", can_be_purchased: false },
      rules: [{ rule_type: "total_questions", is_active: true, params_json: { min_questions: 10 }, min_questions: 10 }],
      includeRequirement: true,
    });
    row.name = copy.name;
    row.description = copy.description;
    row.requirementText = copy.requirementText;
    row.hebrew =
      HE.test(copy.name) || HE.test(copy.description) || HE.test(copy.requirementText);
    row.emptyName = !String(copy.name || "").trim();
    row.emptyRequirement = !String(copy.requirementText || "").trim();
    if (row.hebrew) row.errors.push("hebrew_text");
    if (row.emptyName) row.errors.push("empty_name");
    if (row.emptyRequirement) row.errors.push("empty_requirement");
    if (row.errors.length) row.ok = false;
  } catch (e) {
    row.ok = false;
    row.errors.push(String(e?.message || e));
  }
  if (!row.ok) fail++;
  results.push(row);
}

const outDir = path.join(process.env.TEMP || "artifacts", "leo-kids-global-audits");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "canonical-cards-validation.json");
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      canonicalCount: CANONICAL_GLOBAL_CARD_KEYS.length,
      fail,
      packOnlyExcluded: GLOBAL_PACK_ONLY_NON_RUNTIME_CARD_KEYS,
      results,
    },
    null,
    2
  )
);
console.log(
  JSON.stringify(
    { canonicalCount: CANONICAL_GLOBAL_CARD_KEYS.length, fail, outPath },
    null,
    2
  )
);
process.exit(fail ? 1 : 0);
