/**
 * Finish HE-named module renames/deletes + import/symbol rewrites for Global product.
 * node scripts/i18n/finish-he-named-modules.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "exports", "curriculum-oracle", "language-review"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) out.push(p);
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function renameRel(fromRel, toRel) {
  const from = path.join(ROOT, fromRel);
  const to = path.join(ROOT, toRel);
  if (!fs.existsSync(from)) {
    return fs.existsSync(to) ? "already" : "missing";
  }
  ensureDir(to);
  if (fs.existsSync(to) && path.resolve(from) !== path.resolve(to)) fs.unlinkSync(to);
  fs.renameSync(from, to);
  return "renamed";
}

function deleteRel(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return "missing";
  fs.unlinkSync(p);
  return "deleted";
}

const report = { steps: [] };

// --- Pre: fold rewards-ui.he into admin-rewards-ui.he (admin-only HE) ---
{
  const adminPath = path.join(ROOT, "lib/admin-portal/admin-rewards-ui.he.js");
  const rewardsPath = path.join(ROOT, "lib/rewards/rewards-ui.he.js");
  if (fs.existsSync(adminPath) && fs.existsSync(rewardsPath)) {
    let admin = fs.readFileSync(adminPath, "utf8");
    const rewards = fs.readFileSync(rewardsPath, "utf8");
    if (admin.includes('from "../rewards/rewards-ui.he.js"')) {
      // Inline rarity/type helpers from rewards-ui.he (keep admin HE literals)
      const inline = `
const RARITY_LABELS_HE = {
  regular: "רגיל",
  special: "מיוחד",
  rare: "נדיר",
  gold: "זהב",
};
const CARD_TYPE_LABELS_HE = {
  achievement: "קלף הישג",
  shop: "קלף חנות",
  event: "קלף אירוע",
};
export function formatRarityHe(rarity) {
  return RARITY_LABELS_HE[rarity] || RARITY_LABELS_HE.regular;
}
export function formatCardTypeHe(cardType) {
  return CARD_TYPE_LABELS_HE[cardType] || CARD_TYPE_LABELS_HE.shop;
}
`;
      admin = admin
        .replace(
          /import \{ formatCardTypeHe, formatRarityHe \} from "\.\.\/rewards\/rewards-ui\.he\.js";\r?\n/,
          ""
        )
        .replace(/export \{ formatCardTypeHe, formatRarityHe \};\r?\n/, "")
        .replace(
          /^(import \{ CARD_RULE_TYPE_META \} from "\.\.\/rewards\/card-rule-types\.js";\r?\n)/m,
          `$1${inline}`
        );
      fs.writeFileSync(adminPath, admin, "utf8");
      report.steps.push("inlined rewards-ui.he into admin-rewards-ui.he");
    }
  }
}

// --- Pre: inline spelling normalize into answer-compare; drop HE module ---
{
  const ac = path.join(ROOT, "utils/answer-compare.js");
  if (fs.existsSync(ac)) {
    let t = fs.readFileSync(ac, "utf8");
    if (t.includes("hebrew-spelling-niqqud")) {
      t = t.replace(
        /import \{ normalizeAnswerForSpellingNiqqudStrict \} from "\.\/hebrew-spelling-niqqud\.js";\r?\n/,
        `/** Locale-neutral answer normalize (quotes/punct); former HE niqqud path removed. */
function normalizeAnswerForSpellingNiqqudStrict(value) {
  return String(value ?? "")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/^[\\s"'\`.,!?;:()[\\]{}\\-–—]+|[\\s"'\`.,!?;:()[\\]{}\\-–—]+$/g, "")
    .trim()
    .replace(/\\s+/g, " ")
    .toLowerCase();
}
`
      );
      fs.writeFileSync(ac, t, "utf8");
      report.steps.push("inlined spelling normalize into answer-compare");
    }
  }
}

// --- Pre: remove HE book audio branch ---
{
  const p = path.join(ROOT, "lib/learning-book/audio/prepare-learning-book-audio-text.js");
  if (fs.existsSync(p)) {
    let t = fs.readFileSync(p, "utf8");
    t = t.replace(
      /import \{\r?\n  prepareHebrewBookAudioTextForSection,\r?\n  prepareHebrewBookAudioTextForSectionDetailed,\r?\n\} from "\.\/normalize-hyphens-for-tts\.js";\r?\n/,
      ""
    );
    t = t.replace(
      /if \(s === "hebrew" && g === "g1"\) \{\r?\n    return prepareHebrewBookAudioTextForSectionDetailed\(pageData, sectionNumber\);\r?\n  \}\r?\n\r?\n/,
      ""
    );
    // also remove unused prepareHebrewBookAudioTextForSection if only Detailed was used
    fs.writeFileSync(p, t, "utf8");
    report.steps.push("removed HE branch from prepare-learning-book-audio-text");
  }
}

const RENAMES = [
  ["utils/approved-verbal-master-contract.client.js", "utils/approved-verbal-master-contract.client.js"],
  ["utils/learning-number-spacing.js", "utils/learning-number-spacing.js"],
  ["utils/learning-mixed-rtl-math-render.js", "utils/learning-mixed-rtl-math-render.js"],
  ["utils/learning-mixed-rtl-math.js", "utils/learning-mixed-rtl-math.js"],
  ["lib/bidi/mixed-rtl-math-runs.js", "lib/bidi/mixed-rtl-math-runs.js"],
  ["components/learning/LearningMixedRtlMathText.jsx", "components/learning/LearningMixedRtlMathText.jsx"],
  ["components/learning-book/MixedRtlMathText.js", "components/learning-book/MixedRtlMathText.js"],
  ["utils/detailed-report-parent-letter.js", "utils/detailed-report-parent-letter.js"],
  ["utils/parent-report-language/parent-report-copy-spec.js", "utils/parent-report-language/parent-report-copy-spec.js"],
  ["utils/parent-report-ui-explain.js", "utils/parent-report-ui-explain.js"],
  [
    "content-packs/en/global-burn-down/utils__audio-narration-binding.json",
    "content-packs/en/global-burn-down/utils__audio-narration-binding.json",
  ],
  [
    "content-packs/es-419/global-burn-down/utils__audio-narration-binding.json",
    "content-packs/es-419/global-burn-down/utils__audio-narration-binding.json",
  ],
  [
    "content-packs/en/reports/burn-down/utils__parent-report-language__parent-report-copy-spec.json",
    "content-packs/en/reports/burn-down/utils__parent-report-language__parent-report-copy-spec.json",
  ],
  [
    "content-packs/es-419/reports/burn-down/utils__parent-report-language__parent-report-copy-spec.json",
    "content-packs/es-419/reports/burn-down/utils__parent-report-language__parent-report-copy-spec.json",
  ],
];

const DELETES = [
  "utils/hebrew-dicta-nakdan.js",
  "utils/hebrew-spelling-niqqud.js",
  "utils/diagnostic-labels.js",
  "utils/fast-diagnostic-engine/parent-copy.js",
  "utils/fast-diagnostic-engine/probe-map.js",
  "utils/learning-pattern-decision/parent-facing-error-pattern.js",
  "lib/learning-book/audio/normalize-hyphens-for-tts.js",
  "lib/rewards/rewards-ui.he.js",
];

for (const [a, b] of RENAMES) {
  report.steps.push({ rename: a, to: b, status: renameRel(a, b) });
}
for (const d of DELETES) {
  report.steps.push({ delete: d, status: deleteRel(d) });
}

/** Longer keys first */
const TEXT_REWRITES = [
  ["utils__parent-report-language__parent-report-copy-spec", "utils__parent-report-language__parent-report-copy-spec"],
  ["utils__audio-narration-binding", "utils__audio-narration-binding"],
  ["approved-verbal-master-contract.client", "approved-verbal-master-contract.client"],
  ["learning-number-spacing", "learning-number-spacing"],
  ["learning-mixed-rtl-math-render", "learning-mixed-rtl-math-render"],
  ["learning-mixed-rtl-math", "learning-mixed-rtl-math"],
  ["mixed-rtl-math-runs", "mixed-rtl-math-runs"],
  ["LearningMixedRtlMathText", "LearningMixedRtlMathText"],
  ["renderLearningMixedRtlMathText", "renderLearningMixedRtlMathText"],
  ["MixedRtlMathText", "MixedRtlMathText"],
  ["detailed-report-parent-letter", "detailed-report-parent-letter"],
  ["parent-report-copy-spec", "parent-report-copy-spec"],
  ["parent-report-ui-explain", "parent-report-ui-explain"],
  ["parent-facing-error-pattern", "parent-facing-error-pattern"],
  ["parent-copy", "parent-copy"],
  ["probe-map", "probe-map"],
  ["diagnostic-labels", "diagnostic-labels"],
  ["normalize-hyphens-for-tts", "normalize-hyphens-for-tts"],
  // symbol migrations (no He aliases in product)
  ["resolveParentFacingPatternLabel", "resolveParentFacingPatternLabel"],
  ["parentFacingErrorPatternLabel", "parentFacingErrorPatternLabel"],
  ["parentFacingErrorPatternMeaning", "parentFacingErrorPatternMeaning"],
  ["stripParentTopicSectionPrefix", "stripParentTopicSectionPrefix"],
  ["englishLabelFromSlug", "englishLabelFromSlug"],
  ["topicBucketLabel", "topicBucketLabel"],
];

let rewritten = 0;
for (const abs of walk(ROOT)) {
  // Do not rewrite admin HE UI source content beyond import paths already handled
  let text = fs.readFileSync(abs, "utf8");
  const orig = text;
  for (const [a, b] of TEXT_REWRITES) {
    if (text.includes(a)) text = text.split(a).join(b);
  }
  if (text !== orig) {
    fs.writeFileSync(abs, text, "utf8");
    rewritten++;
  }
}
report.rewrittenFiles = rewritten;

// Make learning-number-spacing script-agnostic identity (no HE ranges)
{
  const p = path.join(ROOT, "utils/learning-number-spacing.js");
  if (fs.existsSync(p)) {
    fs.writeFileSync(
      p,
      `/**
 * Number/word spacing helper (Global).
 * Former Hebrew letter↔digit spacing removed — identity for product runtime.
 */

/**
 * @param {string|null|undefined} text
 * @returns {string}
 */
export function normalizeHebrewWordNumberSpacing(text) {
  if (text == null || typeof text !== "string") return "";
  return text;
}

/** @deprecated alias */
export const normalizeWordNumberSpacing = normalizeHebrewWordNumberSpacing;
`,
      "utf8"
    );
    report.steps.push("learning-number-spacing → identity");
  }
}

console.log(JSON.stringify(report, null, 2));
