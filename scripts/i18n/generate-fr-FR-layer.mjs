/**
 * Generate locales/fr-FR + content-packs/fr-FR from English sources.
 * Glossary-guided MT (tl=fr) + France postfixes. Not runtime wiring.
 *
 * Run: node scripts/i18n/generate-fr-FR-layer.mjs
 * Optional: --force --dry --namespaces-only --packs-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXACT_OVERRIDES,
  FORBIDDEN_FR_FR_PATTERNS,
  applyGlossaryHints,
  applySurfaceTone,
  hasForbidden,
  loadCache,
  looksNonTranslate,
  protectPlaceholders,
  restorePlaceholders,
  saveCache,
  translateStringFr,
} from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR.json");
const REPORT_PATH = path.join(__dirname, "_fr-FR-layer-report.json");

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const NAMESPACES_ONLY = process.argv.includes("--namespaces-only");
const PACKS_ONLY = process.argv.includes("--packs-only");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

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
  "severity",
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

const CHILD_NAMESPACES = new Set(["learning", "games"]);
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
  "worksheets", // parent/teacher hub — vous; child writing verbs set explicitly
]);

function toneForNamespace(fileName) {
  const base = fileName.replace(/\.json$/, "");
  if (CHILD_NAMESPACES.has(base)) return "child";
  if (ADULT_NAMESPACES.has(base)) return "adult";
  return null;
}

function toneForPackRel(rel) {
  if (rel.startsWith("reports" + path.sep) || rel.startsWith("reports/")) return "adult";
  if (rel.startsWith("learning" + path.sep) || rel.startsWith("games" + path.sep)) return "child";
  return null;
}

async function translateString(en, cache, tone) {
  return translateStringFr(en, cache, { force: FORCE, tone });
}

function listJsonFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, ent.name);
      if (ent.isDirectory()) walk(fp);
      else if (ent.name.endsWith(".json")) out.push(fp);
    }
  })(dir);
  return out;
}

async function transformNode(node, ctx, translateFn) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (ctx.preserveString) return node;
    if (ctx.key && SKIP_VALUE_KEYS.has(ctx.key)) return node;
    if (ctx.doNotTranslate && ctx.key && ctx.doNotTranslate.has(ctx.key)) return node;
    return translateFn(node, ctx.key);
  }
  if (typeof node !== "object") return node;
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      out.push(
        await transformNode(
          item,
          {
            doNotTranslate: ctx.doNotTranslate,
            preserveString: ctx.preserveArrayStrings || ctx.preserveString,
          },
          translateFn,
        ),
      );
    }
    return out;
  }

  /** @type {Set<string>|undefined} */
  let childSkip = ctx.doNotTranslate;
  if (Array.isArray(node.doNotTranslateFields)) {
    childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
  }

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    out[k] = await transformNode(
      v,
      {
        key: k,
        doNotTranslate: childSkip,
        preserveArrayStrings: k === "doNotTranslateFields",
      },
      translateFn,
    );
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function collectStrings(node, key, skipFields, unique) {
  if (node == null) return;
  if (typeof node === "string") {
    if (key && SKIP_VALUE_KEYS.has(key)) return;
    if (skipFields && key && skipFields.has(key)) return;
    if (!looksNonTranslate(node)) unique.add(node);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((x) => collectStrings(x, undefined, skipFields, unique));
    return;
  }
  if (typeof node === "object") {
    let childSkip = skipFields;
    if (Array.isArray(node.doNotTranslateFields)) {
      childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
    }
    for (const [k, v] of Object.entries(node)) collectStrings(v, k, childSkip, unique);
  }
}

async function fillCache(unique, cache) {
  const pending = [...unique].filter((s) => FORCE || !cache[s]);
  console.log("Need MT resolve:", pending.length);
  const CONCURRENCY = 6;
  let done = 0;
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const chunk = pending.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (s) => translateString(s, cache, null)));
    done += chunk.length;
    if (done % 80 === 0 || done >= pending.length) {
      saveCache(CACHE_PATH, cache);
      console.log(`Cache progress ${Math.min(done, pending.length)}/${pending.length}`);
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  saveCache(CACHE_PATH, cache);
}

async function translateTree(raw, cache, stats, tone) {
  const inflight = new Map();
  async function translateFn(s) {
    stats.stringsSeen++;
    if (looksNonTranslate(s)) {
      stats.skipped++;
      stats.bySource.skip = (stats.bySource.skip || 0) + 1;
      return s;
    }
    let p = inflight.get(s + "::" + tone);
    if (!p) {
      p = translateString(s, cache, tone).then((r) => {
        if (r.source === "mt-fail" || r.source === "ph-mismatch") stats.mtFails++;
        if (r.value !== s) stats.translated++;
        stats.bySource[r.source] = (stats.bySource[r.source] || 0) + 1;
        if (hasForbidden(r.value)) {
          stats.forbiddenHits.push({ en: s, fr: r.value });
        }
        return r;
      });
      inflight.set(s + "::" + tone, p);
    }
    return (await p).value;
  }
  return transformNode(raw, {}, translateFn);
}

async function generateNamespaces(cache, stats) {
  const srcDir = path.join(ROOT, "locales", "en");
  const outDir = path.join(ROOT, "locales", "fr-FR");
  ensureDir(outDir);
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"));
  const unique = new Set();
  for (const f of files) {
    collectStrings(JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8")), undefined, undefined, unique);
  }
  console.log("Namespaces unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache);
  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8"));
    const tone = toneForNamespace(f);
    const translated = await translateTree(raw, cache, stats, tone);
    fs.writeFileSync(path.join(outDir, f), `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.namespaceFiles++;
  }
}

async function generatePacks(cache, stats) {
  const srcRoot = path.join(ROOT, "content-packs", "en");
  const outRoot = path.join(ROOT, "content-packs", "fr-FR");
  const allFiles = [];
  for (const d of DOMAINS) {
    const files = listJsonFiles(path.join(srcRoot, d));
    stats.domains[d] = files.length;
    for (const f of files) allFiles.push(f);
  }
  const unique = new Set();
  for (const file of allFiles) {
    collectStrings(JSON.parse(fs.readFileSync(file, "utf8")), undefined, undefined, unique);
  }
  console.log("Pack files:", allFiles.length, "unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache);
  for (const file of allFiles) {
    const rel = path.relative(srcRoot, file);
    const outFile = path.join(outRoot, rel);
    ensureDir(path.dirname(outFile));
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const tone = toneForPackRel(rel);
    const translated = await translateTree(raw, cache, stats, tone);
    fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.packFiles++;
  }
}

async function main() {
  void EXACT_OVERRIDES;
  void FORBIDDEN_FR_FR_PATTERNS;
  void applyGlossaryHints;
  void protectPlaceholders;
  void restorePlaceholders;
  void applySurfaceTone;

  const cache = loadCache(CACHE_PATH);
  const stats = {
    namespaceFiles: 0,
    packFiles: 0,
    stringsSeen: 0,
    translated: 0,
    skipped: 0,
    bySource: {},
    domains: {},
    forbiddenHits: [],
    mtFails: 0,
  };

  if (!PACKS_ONLY) {
    console.log("=== locales/fr-FR ===");
    await generateNamespaces(cache, stats);
  }
  if (!NAMESPACES_ONLY) {
    console.log("=== content-packs/fr-FR ===");
    await generatePacks(cache, stats);
  }

  stats.forbiddenHits = stats.forbiddenHits.slice(0, 80);
  stats.cacheSize = Object.keys(cache).length;
  fs.writeFileSync(REPORT_PATH, JSON.stringify(stats, null, 2), "utf8");
  console.log("Done.", JSON.stringify(stats, null, 2));
  console.log("Report:", REPORT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
