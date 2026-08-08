/**
 * Shared helpers for id-ID Phase 4B content-pack translation.
 */
import fs from "node:fs";
import path from "node:path";

export const ROOT = process.cwd();
export const TARGET_LOCALE = "id-ID";

const PRESERVE_KEY_EXACT = new Set([
  "gameId",
  "cardKey",
  "cardCount",
  "version",
  "category",
  "id",
  "slug",
  "route",
  "href",
  "src",
  "url",
  "path",
  "emoji",
  "icon",
  "image",
  "audio",
  "filename",
  "asset",
  "rarityId",
  "seriesSlug",
]);

const PRESERVE_VALUE_EXACT = new Set([
  "shop",
  "achievement",
  "event",
  "regular",
  "special",
  "rare",
  "gold",
]);

/**
 * English-learning targets live in detective/train *data* packs (and mirrored
 * burn-down-index sections), not in hub chrome (title/blurb/help.*).
 */
export function isEnglishLearningLeaf(relPath, keyPath, value) {
  const p = relPath.replace(/\\/g, "/");
  const leafKey = (keyPath.split(".").pop() || "").toLowerCase();
  if (typeof value !== "string") return false;

  const inDetectiveData =
    /leo-word-detective-data/i.test(p) ||
    /leo-word-detective__leo-word-detective-data/i.test(keyPath) ||
    (/burn-down-index\.json$/i.test(p) && /leo-word-detective__leo-word-detective-data/i.test(keyPath));

  const inTrainData =
    /leo-word-train-data/i.test(p) ||
    /leo-word-train__leo-word-train-data/i.test(keyPath) ||
    (/burn-down-index\.json$/i.test(p) && /leo-word-train__leo-word-train-data/i.test(keyPath));

  if (!inDetectiveData && !inTrainData) return false;

  // UI chrome / feedback / grade bands inside data copy → translate
  if (/^grades_/.test(leafKey)) return false;
  if (
    /^(starting_letter|missing_letter|drag_|word_matches|right_word|word_completes|correct_|put_events|event_order|drag_a_title|title_fits|meaning_|nice_|great_|awesome_|excellent_|fill_in|load_|both_cars|arrange_|the_sentence_matches|the_right_word|word_order|the_missing_word|that_word_fits)/i.test(
      leafKey
    )
  ) {
    return false;
  }

  // Passages, cloze stems, English reading Q/A remain English
  if (/___/.test(value)) return true;
  if (inDetectiveData && /[A-Za-z]{3,}/.test(value) && /\s/.test(value)) return true;
  if (inDetectiveData && /^[A-Za-z][A-Za-z' -]{2,60}$/.test(value)) return true;
  return false;
}

export function shouldPreserveString(key, value, keyPath = "", relPath = "") {
  if (typeof value !== "string") return true;
  if (PRESERVE_KEY_EXACT.has(key)) return true;
  if (PRESERVE_VALUE_EXACT.has(value) && ["category"].includes(key)) return true;
  if (value === "") return true;
  if (/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+$/u.test(value)) return true;
  if (/^\d+(\.\d+)?$/.test(value)) return true;
  if (/^(https?:\/\/|\/)/.test(value)) return true;
  if (/\.(png|jpe?g|webp|svg|gif|mp3|wav|ogg|json)(\?|$)/i.test(value)) return true;
  if (/^(set[A-Za-z]+|cfg\.|gamePackCopy\()/i.test(value)) return true;
  if (/e\.target\.value/.test(value)) return true;
  // Burn-down scrape artifacts / code fragments (not user-facing chrome).
  // Do NOT treat ICU/mustache placeholders like {minutes} as code.
  {
    const withoutPlaceholders = value.replace(/\{\{?\w+\}?\}/g, "");
    const looksLikeCode =
      /=>/.test(withoutPlaceholders) ||
      /\b(return|const|function|typeof|instanceof)\b/.test(withoutPlaceholders) ||
      /className=|aria-label=|<\/|max-lg:|[&]>|void,|busy\?:|dir=\"ltr\"/.test(value) ||
      /\b(Math|Object|Array)\./.test(withoutPlaceholders) ||
      /\.(map|filter|reduce|fromEntries)\s*\(/.test(withoutPlaceholders) ||
      /^[a-zA-Z_$][\w$]*\s*\(/.test(withoutPlaceholders.trim()) ||
      /setPhase\(|setQuery\(|setDisplayName\(/.test(value);
    if (looksLikeCode) return true;
  }
  // Pure snake/kebab ids without spaces
  if (/^[a-z][a-z0-9_-]{0,48}$/.test(value) && !/[A-Z]/.test(value) && value.length <= 40) {
    // short display words like "bingo" as titles are OK to translate elsewhere; preserve when key is id-like
    if (/id|key|slug|category|type|kind|enum/i.test(key) || PRESERVE_VALUE_EXACT.has(value)) return true;
  }
  if (isEnglishLearningLeaf(relPath, keyPath, value)) return true;
  // Proper person names used as labels
  if (/^(Austin|Daniel|Daphne|Hannah|Johnny|Jonathan|Morgan|Mia|Jo|Dan|Noa)$/.test(value)) return true;
  return false;
}

export function placeholders(s) {
  const simple = [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const icu = [...String(s).matchAll(/\{(\w+)\s*,/g)].map((m) => m[1]);
  const mustache = [...String(s).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  return [...new Set([...simple, ...icu, ...mustache])].sort();
}

export function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export function enToIdPath(enPath) {
  return enPath.replace(/content-packs[\\/]en[\\/]/, `content-packs/${TARGET_LOCALE}/`);
}

export function walkLeaves(node, prefix = [], out = []) {
  if (node === null || typeof node !== "object") {
    out.push({ path: prefix.join("."), value: node, key: prefix[prefix.length - 1] || "" });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => walkLeaves(v, prefix.concat(String(i)), out));
    return out;
  }
  for (const k of Object.keys(node)) walkLeaves(node[k], prefix.concat(k), out);
  return out;
}

export function deepMapStrings(node, fn, prefix = [], relPath = "") {
  if (typeof node === "string") {
    return fn(node, prefix[prefix.length - 1] || "", prefix.join("."), relPath);
  }
  if (node === null || typeof node !== "object") return node;
  if (Array.isArray(node)) {
    return node.map((v, i) => deepMapStrings(v, fn, prefix.concat(String(i)), relPath));
  }
  const out = {};
  for (const k of Object.keys(node)) {
    out[k] = deepMapStrings(node[k], fn, prefix.concat(k), relPath);
  }
  return out;
}
