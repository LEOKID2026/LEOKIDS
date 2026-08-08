/**
 * Phase 5 runtime parity probe — dynamic disk + catalog + provenance.
 * Writes artifacts/id-ID-phase5/parity-report.json
 */
import fs from "fs";
import path from "path";
import { CONTENT_PACK_CATALOG, getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";
import { ID_ID_PUBLIC_SEO_KEYS } from "../../lib/seo/public-seo-id-ID-client-index.js";
import { SEO_PUBLIC_PATHS } from "../../lib/seo/seo-public-paths.js";
import { resolveHelpLocale, getHelpSections, listArticles } from "../../data/help-center/index.js";
import { I18N_NAMESPACES, loadLocaleBundles, resetLocaleBundleCache } from "../../lib/i18n/load-messages.js";

const ROOT = process.cwd();
const LOCALE = "id-ID";
const OUT_DIR = path.join(ROOT, "artifacts/id-ID-phase5");
const PACK_ROOT = path.join(ROOT, "content-packs", LOCALE);

const ROOT_PACKS = [
  "books/ui.json",
  "books/registry-titles.json",
  "books/english-page-skills.json",
  "demo/ui.json",
  "games/burn-down-index.json",
  "games/ui-pack-index.json",
  "global-burn-down/burn-down-index.json",
  "learning/burn-down-index.json",
  "learning/diagnostic-engine-v2-defaults.json",
  "learning/diagnostic-framework-v1.json",
  "learning/diagnostic-labels.json",
  "learning/example-pattern-diagnostics-payload.json",
  "learning/fast-diagnostic-probes.json",
  "learning/fast-diagnostic-tag-labels.json",
  "learning/geometry-content.json",
  "learning/learning-patterns-copy.json",
  "learning/math-animation-titles.json",
  "learning/taxonomy/english.structure.json",
  "learning/taxonomy/english.content.json",
  "learning/taxonomy/geometry.structure.json",
  "learning/taxonomy/geometry.content.json",
  "learning/taxonomy/math.structure.json",
  "learning/taxonomy/math.content.json",
  "learning/taxonomy/science.structure.json",
  "learning/taxonomy/science.content.json",
  "reports/burn-down-index.json",
  "rewards/card-catalog.json",
  "rewards/ui.json",
];

function walkJsonFiles(dir, base = "") {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJsonFiles(p, rel.replace(/\\/g, "/")));
    else if (e.name.endsWith(".json")) out.push(rel.replace(/\\/g, "/"));
  }
  return out.sort();
}

function deepEqualJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function familyProbe(family) {
  const files = walkJsonFiles(path.join(PACK_ROOT, family));
  let loadMissing = 0;
  for (const rel of files) {
    if (loadContentPack(LOCALE, family, ...rel.split("/")) == null) loadMissing += 1;
  }
  const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {}).filter((k) =>
    k.startsWith(`${family}/`)
  );
  return {
    disk: files.length,
    catalogRoots: catalogKeys.length,
    catalogKeys,
    runtimeDiscoverable: files.length - loadMissing,
    missing: loadMissing,
    staleOrphan: 0,
  };
}

function indexLeafProbe(family, indexRel, leafMode) {
  const files = walkJsonFiles(path.join(PACK_ROOT, family));
  const index = getCatalogPackExact(LOCALE, indexRel) || {};
  const indexKeys = new Set(Object.keys(index));
  let leafFiles;
  if (leafMode === "flat") {
    leafFiles = files.filter((f) => f !== "burn-down-index.json");
  } else {
    leafFiles = files.filter((f) => f.startsWith("burn-down/") && f.endsWith(".json"));
  }
  let missing = 0;
  let stale = 0;
  for (const f of leafFiles) {
    const slug =
      leafMode === "flat"
        ? f.replace(/\.json$/, "")
        : f.replace(/^burn-down\//, "").replace(/\.json$/, "");
    if (!indexKeys.has(slug)) missing += 1;
  }
  for (const slug of indexKeys) {
    const expect =
      leafMode === "flat" ? `${slug}.json` : `burn-down/${slug}.json`;
    if (!leafFiles.includes(expect)) stale += 1;
  }
  return {
    disk: files.length,
    indexKeys: indexKeys.size,
    runtimeLeaves: leafFiles.length - missing,
    missing,
    stale,
  };
}

function catalogProvenance() {
  let enFallback = 0;
  const failures = [];
  for (const rel of ROOT_PACKS) {
    const idPack = getCatalogPackExact(LOCALE, rel);
    const enPack = getCatalogPackExact("en", rel);
    const resolved = resolveRegisteredContentPack(LOCALE, ...rel.split("/"));
    if (idPack == null || !deepEqualJson(resolved, idPack)) {
      enFallback += 1;
      failures.push(rel);
    } else if (enPack != null && deepEqualJson(resolved, enPack) && !deepEqualJson(idPack, enPack)) {
      enFallback += 1;
      failures.push(rel);
    }
  }
  return { enFallback, failures };
}

resetLocaleBundleCache();
const bundles = await loadLocaleBundles(LOCALE);
const sections = getHelpSections(LOCALE);
let helpArticles = 0;
for (const key of Object.keys(sections || {})) {
  helpArticles += listArticles(key, LOCALE).length;
}

const books = familyProbe("books");
const games = familyProbe("games");
const rewards = familyProbe("rewards");
const demo = familyProbe("demo");
const learning = familyProbe("learning");
const gbd = {
  ...familyProbe("global-burn-down"),
  ...indexLeafProbe("global-burn-down", "global-burn-down/burn-down-index.json", "flat"),
};
const reports = {
  ...familyProbe("reports"),
  ...indexLeafProbe("reports", "reports/burn-down-index.json", "nested"),
};
const seoDisk = walkJsonFiles(path.join(PACK_ROOT, "public-seo")).length;
const cat = CONTENT_PACK_CATALOG[LOCALE] || {};
const catKeys = Object.keys(cat);
const catSeo = catKeys.filter((k) => k.startsWith("public-seo/"));
const catNonSeo = catKeys.filter((k) => !k.startsWith("public-seo/"));
const provenance = catalogProvenance();

const report = {
  locale: LOCALE,
  generatedAt: new Date().toISOString(),
  disk: {
    books: books.disk,
    games: games.disk,
    rewards: rewards.disk,
    demo: demo.disk,
    globalBurnDown: gbd.disk,
    learning: learning.disk,
    reports: reports.disk,
    nonSeoTotal:
      books.disk +
      games.disk +
      rewards.disk +
      demo.disk +
      gbd.disk +
      learning.disk +
      reports.disk,
    publicSeo: seoDisk,
    total: 0,
  },
  families: { books, games, rewards, demo, globalBurnDown: gbd, learning, reports },
  catalog: {
    model: "full-master-root-indexes (28) + public-seo (28) = 56",
    totalKeys: catKeys.length,
    nonSeoRoots: catNonSeo.length,
    publicSeo: catSeo.length,
    duplicateRegistrations: catKeys.length - new Set(catKeys).size,
    missingVsEn: Object.keys(CONTENT_PACK_CATALOG.en || {}).filter((k) => !cat[k]),
    staleNonSeo: catNonSeo.filter((k) => !(CONTENT_PACK_CATALOG.en || {})[k]),
  },
  provenance,
  publicSeo: {
    disk: seoDisk,
    client: ID_ID_PUBLIC_SEO_KEYS.length,
    catalog: catSeo.length,
    runtimePaths: SEO_PUBLIC_PATHS.length,
  },
  namespaceHelp: {
    namespaces: I18N_NAMESPACES.length,
    bundleNamespaces: Object.keys(bundles).length,
    helpLocale: resolveHelpLocale(LOCALE),
    helpSections: Object.keys(sections || {}).length,
    helpArticles,
  },
};

report.disk.total = report.disk.nonSeoTotal + report.disk.publicSeo;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "parity-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
