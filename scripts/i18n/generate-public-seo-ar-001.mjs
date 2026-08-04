/**
 * Generate content-packs/ar-001/public-seo/* overlays + client index for guides,
 * practice, marketing landings, hub cards, and legal policy copy.
 *
 * Run: node scripts/i18n/generate-public-seo-ar-001.mjs
 * Optional: --force  --offline  --dry
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-ar-001.json");
const OUT_ROOT = path.join(ROOT, "content-packs/ar-001/public-seo");
const CLIENT_INDEX = path.join(ROOT, "lib/seo/public-seo-ar-001-client-index.js");

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const OFFLINE = process.env.AR_001_OFFLINE === "1" || process.argv.includes("--offline");

const SKIP_KEYS = new Set([
  "seoKey",
  "slug",
  "id",
  "href",
  "relatedPracticePath",
  "relatedGuideSlugs",
  "scrollToSectionId",
  "route",
  "canonicalPath",
  "pageKey",
  "action",
]);

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(str)) return true;
  if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
  if (!/[A-Za-z]/.test(str)) return true;
  return false;
}

async function mtTranslate(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateString(en, cache) {
  if (looksNonTranslate(en)) return en;
  if (!FORCE && cache[en]) return cache[en];
  if (OFFLINE) return en;
  try {
    const translated = await mtTranslate(en);
    cache[en] = translated.replace(/Leo Kids/g, "Leo Kids");
    return cache[en];
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return en;
  }
}

async function transformValue(value, key, cache) {
  if (typeof value === "string") {
    if (SKIP_KEYS.has(key)) return value;
    return translateString(value, cache);
  }
  if (Array.isArray(value)) {
    const arr = [];
    for (const item of value) arr.push(await transformValue(item, key, cache));
    return arr;
  }
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const obj = {};
    for (const [k, v] of Object.entries(value)) {
      obj[k] = await transformValue(v, k, cache);
    }
    return obj;
  }
  return value;
}

function writeJson(relPath, data) {
  const full = path.join(OUT_ROOT, relPath);
  if (!DRY) {
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
  return relPath.replace(/\\/g, "/");
}

async function main() {
  const cache = loadCache();
  /** @type {string[]} */
  const written = [];

  const guideMod = await import(pathToFileURL(path.join(ROOT, "data/seo/guide-pages.js")).href);
  const practiceMod = await import(pathToFileURL(path.join(ROOT, "data/seo/practice-pages.js")).href);
  const marketingMod = await import(pathToFileURL(path.join(ROOT, "data/marketing/landing-pages.js")).href);
  const legalMod = await import(pathToFileURL(path.join(ROOT, "data/legal/sitePolicies.js")).href);

  for (const slug of guideMod.GUIDE_SLUGS) {
    if (slug === "hub") continue;
    const en = guideMod.getGuidePageContent(slug);
    if (!en) continue;
    console.log("guide", slug);
    const overlay = await transformValue(en, "", cache);
    written.push(writeJson(`guides/${slug}.json`, overlay));
  }

  console.log("guide hub-cards");
  const guideHub = await transformValue(guideMod.GUIDE_HUB_CARDS, "", cache);
  written.push(writeJson("guides/hub-cards.json", guideHub));

  for (const slug of practiceMod.PRACTICE_SLUGS) {
    if (slug === "hub") continue;
    const en = practiceMod.getPracticePageContent(slug);
    if (!en) continue;
    console.log("practice", slug);
    const { hubCards, ...page } = en;
    const overlay = await transformValue(page, "", cache);
    written.push(writeJson(`practice/${slug}.json`, overlay));
  }

  console.log("practice hub-cards");
  const practiceHub = await transformValue(practiceMod.PRACTICE_HUB_CARDS, "", cache);
  written.push(writeJson("practice/hub-cards.json", practiceHub));

  for (const audience of ["kids", "parents", "teachers"]) {
    const key = `${audience.toUpperCase()}_LANDING`;
    const en = marketingMod[key];
    if (!en) continue;
    console.log("marketing", audience);
    const overlay = await transformValue(en, "", cache);
    written.push(writeJson(`marketing/${audience}.json`, overlay));
  }

  console.log("legal unified");
  const legalOverlay = {
    policyLastUpdatedDisplay: await translateString(legalMod.POLICY_LAST_UPDATED_DISPLAY, cache),
    legacyPolicyPages: await transformValue(legalMod.LEGACY_POLICY_PAGES, "", cache),
    unifiedLegalSections: await transformValue(legalMod.UNIFIED_LEGAL_SECTIONS, "", cache),
    legalCrossLinks: await transformValue(legalMod.LEGAL_CROSS_LINKS, "", cache),
    legalContactPageLinks: await transformValue(legalMod.LEGAL_CONTACT_PAGE_LINKS, "", cache),
    legalFooterLinks: await transformValue(legalMod.LEGAL_FOOTER_LINKS, "", cache),
    parentReportDisclaimerTitle: await translateString(legalMod.PARENT_REPORT_DISCLAIMER_TITLE, cache),
    parentReportDisclaimerParagraphs: await transformValue(
      legalMod.PARENT_REPORT_DISCLAIMER_PARAGRAPHS,
      "",
      cache
    ),
  };
  written.push(writeJson("legal/unified.json", legalOverlay));

  if (!DRY) saveCache(cache);

  const importLines = written
    .map((rel, i) => {
      const varName = `pack_${i}`;
      return { varName, rel, importPath: `../../content-packs/ar-001/public-seo/${rel}` };
    });

  const indexSrc = `/**
 * AUTO-GENERATED by scripts/i18n/generate-public-seo-ar-001.mjs — do not edit by hand.
 */
${importLines.map(({ varName, importPath }) => `import ${varName} from "${importPath}" with { type: "json" };`).join("\n")}

const AR_001_PUBLIC_SEO = {
${importLines.map(({ varName, rel }) => `  "${rel}": ${varName},`).join("\n")}
};

/**
 * @param {string|null|undefined} locale
 * @param {...string} segments
 * @returns {unknown}
 */
export function getClientPublicSeoOverlay(locale, ...segments) {
  if (locale !== "ar-001") return null;
  const key = segments.map((s) => String(s || "").replace(/^\\/+|\\/+$/g, "")).filter(Boolean).join("/");
  return AR_001_PUBLIC_SEO[key] ?? null;
}
`;

  if (!DRY) {
    fs.writeFileSync(CLIENT_INDEX, indexSrc, "utf8");
  }

  console.log(`Wrote ${written.length} packs + client index`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
