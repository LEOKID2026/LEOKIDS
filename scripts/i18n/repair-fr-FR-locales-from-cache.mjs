/**
 * Rebuild locales/fr-FR from en + MT cache without corrupting keys/placeholders.
 * Run: node scripts/i18n/repair-fr-FR-locales-from-cache.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXACT_OVERRIDES,
  applyGlossaryHints,
  applySurfaceTone,
  loadCache,
  looksNonTranslate,
  protectPlaceholders,
  restorePlaceholders,
} from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR.json");

const CHILD_NAMESPACES = new Set(["learning", "games", "worksheets"]);
const ADULT_NAMESPACES = new Set([
  "school",
  "teacher",
  "reports",
  "auth",
  "emails",
  "legal",
  "platform",
  "copilot",
  "validation",
]);

const SKIP_VALUE_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "namespace",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

function toneForNamespace(fileName) {
  const base = fileName.replace(/\.json$/, "");
  if (CHILD_NAMESPACES.has(base)) return "child";
  if (ADULT_NAMESPACES.has(base)) return "adult";
  return null;
}

function translateValue(en, cache, tone) {
  if (looksNonTranslate(en)) return en;
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    let v = EXACT_OVERRIDES[en];
    if (tone) v = applySurfaceTone(v, tone);
    return v;
  }
  let raw = cache[en];
  if (!raw) return en;
  // Cache may already include bad glossary; rebuild carefully with placeholder protection
  const { text, ph } = protectPlaceholders(en);
  // Prefer cached translation but restore placeholder names from EN
  let out = applyGlossaryHints(raw);
  // Restore any mangled placeholders from original EN names
  const enNames = ph.length
    ? ph
    : [...String(en).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]);
  if (enNames.length) {
    // Replace {anything} in order of appearance with EN placeholder names
    let i = 0;
    out = out.replace(/\{[a-zA-Z0-9_]+\}/g, () => {
      const name = enNames[i] || enNames[enNames.length - 1];
      i += 1;
      return `{${name}}`;
    });
  }
  void text;
  void restorePlaceholders;
  // Collapse stutter
  out = out
    .replace(/Mathématiques(?:ématiques)+/g, "Mathématiques")
    .replace(/Leo Enfants/g, "Leo Kids")
    .replace(/Enfants Lion/g, "Leo Kids")
    .replace(/pour ton commodité/gi, "pour ta commodité");
  if (tone) out = applySurfaceTone(out, tone);
  return out;
}

function transform(node, key, cache, tone) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (key && SKIP_VALUE_KEYS.has(key)) return node;
    return translateValue(node, cache, tone);
  }
  if (Array.isArray(node)) return node.map((x) => transform(x, key, cache, tone));
  if (typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = transform(v, k, cache, tone);
    }
    return out;
  }
  return node;
}

function main() {
  const cache = loadCache(CACHE_PATH);
  const srcDir = path.join(ROOT, "locales/en");
  const outDir = path.join(ROOT, "locales/fr-FR");
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(srcDir).filter((x) => x.endsWith(".json"))) {
    const raw = JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8"));
    const tone = toneForNamespace(f);
    const translated = transform(raw, null, cache, tone);
    // Hard authority overrides for grades / brand / worksheets
    if (f === "common.json") {
      translated.grade1 = "CP";
      translated.grade2 = "CE1";
      translated.grade3 = "CE2";
      translated.grade4 = "CM1";
      translated.grade5 = "CM2";
      translated.grade6 = "6e";
      translated.gradeLabel = "Classe {grade}";
      translated.brandName = "Leo Kids";
      translated.subjectMath = "Mathématiques";
      translated.subjectGeometry = "Géométrie";
      translated.subjectEnglish = "Anglais";
      translated.subjectScience = "Sciences";
      translated.home = "Accueil";
    }
    fs.writeFileSync(path.join(outDir, f), `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    console.log("repaired", f);
  }
}

main();
