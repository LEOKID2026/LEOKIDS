/**
 * Indonesian Master Phase 5 — Non-SEO content pack runtime integration parity.
 * Disk counts are computed dynamically; catalog model matches full masters (root indexes).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CONTENT_PACK_CATALOG, getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";
import { bookUiCopyForLocale, resolveRegistryTitleKey } from "../../lib/learning-book/book-pack-copy.js";
import { gamePackCopyForLocale } from "../../lib/games/game-pack-copy.js";
import { globalBurnDownCopyForLocale } from "../../lib/i18n/global-burn-down-copy.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";
import { burnDownCopyForLocale } from "../../lib/learning/burn-down-copy.js";
import { demoPackCopyForLocale } from "../../lib/demo/demo-pack-copy.js";
import { rewardUiCopyForLocale, loadRewardCardCatalog } from "../../lib/rewards/reward-pack-copy.js";
import {
  I18N_NAMESPACES,
  loadLocaleBundles,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { resolveHelpLocale, getHelpSections, listArticles } from "../../data/help-center/index.js";
import { ID_ID_PUBLIC_SEO_KEYS } from "../../lib/seo/public-seo-id-ID-client-index.js";
import { SEO_PUBLIC_PATHS } from "../../lib/seo/seo-public-paths.js";
import { getClientPublicSeoOverlay } from "../../lib/seo/client-public-seo-overlay.js";

const ROOT = process.cwd();
const LOCALE = "id-ID";
const PACK_ROOT = path.join(ROOT, "content-packs", LOCALE);
const EN_PACK_ROOT = path.join(ROOT, "content-packs", "en");

const NON_SEO_FAMILIES = [
  "books",
  "games",
  "rewards",
  "demo",
  "global-burn-down",
  "learning",
  "reports",
];

/** Full-master catalog roots (same set as en / pt-BR). */
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

function familyDisk(family, localeRoot = PACK_ROOT) {
  return walkJsonFiles(path.join(localeRoot, family));
}

function familyDiskEn(family) {
  return familyDisk(family, EN_PACK_ROOT);
}

/**
 * Exact relative-path parity vs EN disk authority for one family.
 * @param {string} family
 */
function assertFamilyDiskParityWithEn(family) {
  const enFiles = familyDiskEn(family);
  const idFiles = familyDisk(family);
  assert.ok(enFiles.length > 0, `EN ${family} authority must be non-empty`);
  const enSet = new Set(enFiles);
  const idSet = new Set(idFiles);
  const missing = enFiles.filter((f) => !idSet.has(f));
  const orphan = idFiles.filter((f) => !enSet.has(f));
  assert.deepEqual(missing, [], `${family}: missing id-ID packs vs EN`);
  assert.deepEqual(orphan, [], `${family}: orphan/stale id-ID packs vs EN`);
  assert.equal(idFiles.length, enFiles.length, `${family}: disk count vs EN`);
  return { enFiles, idFiles };
}

function deepEqualJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Provenance: id-ID catalog layer present and resolved pack equals id-ID overlay
 * (full masters deep-merge en→id-ID; result must match id-ID, not en).
 */
function assertCatalogProvenance(relPath) {
  const idPack = getCatalogPackExact(LOCALE, relPath);
  const enPack = getCatalogPackExact("en", relPath);
  assert.ok(idPack != null, `missing catalog ${LOCALE}:${relPath}`);
  const segments = relPath.split("/");
  const resolved = resolveRegisteredContentPack(LOCALE, ...segments);
  assert.ok(resolved != null, `resolve null ${relPath}`);
  assert.ok(deepEqualJson(resolved, idPack), `resolved !== id-ID for ${relPath}`);
  if (enPack != null && !deepEqualJson(idPack, enPack)) {
    assert.ok(!deepEqualJson(resolved, enPack), `resolved fell back to en for ${relPath}`);
  }
}

test("Phase5 disk inventory: EN authority parity (catalog ≠ disk)", () => {
  /** @type {Record<string, { en: number, id: number }>} */
  const counts = {};
  let missingGlobal = 0;
  let orphanGlobal = 0;

  for (const family of NON_SEO_FAMILIES) {
    const enFiles = familyDiskEn(family);
    const idFiles = familyDisk(family);
    const enSet = new Set(enFiles);
    const idSet = new Set(idFiles);
    const missing = enFiles.filter((f) => !idSet.has(f));
    const orphan = idFiles.filter((f) => !enSet.has(f));
    missingGlobal += missing.length;
    orphanGlobal += orphan.length;
    counts[family] = { en: enFiles.length, id: idFiles.length };
    assert.ok(enFiles.length > 0, `EN ${family} authority empty`);
    assert.deepEqual(missing, [], `${family} missing vs EN`);
    assert.deepEqual(orphan, [], `${family} orphan vs EN`);
    assert.equal(idFiles.length, enFiles.length, `${family} count vs EN`);
  }

  const seo = familyDisk("public-seo");
  const cat = CONTENT_PACK_CATALOG[LOCALE] || {};
  const catSeoKeys = Object.keys(cat).filter((k) => k.startsWith("public-seo/"));
  // SEO packs are locale catalog overlays (EN disk has none); authority = catalog + client index.
  assert.equal(seo.length, catSeoKeys.length, "public-seo disk vs catalog");
  assert.equal(seo.length, ID_ID_PUBLIC_SEO_KEYS.length, "public-seo disk vs client index");
  assert.deepEqual(
    seo.map((f) => `public-seo/${f}`).sort(),
    catSeoKeys.sort(),
    "public-seo disk paths vs catalog keys"
  );

  const nonSeo = Object.values(counts).reduce((a, b) => a + b.id, 0);
  assert.equal(missingGlobal, 0);
  assert.equal(orphanGlobal, 0);
  console.log(
    JSON.stringify(
      {
        authority: "content-packs/en/{family} exact relative paths",
        note: "catalog entries != disk files",
        counts,
        nonSeoDisk: nonSeo,
        seoDisk: seo.length,
        catalogKeys: Object.keys(cat).length,
      },
      null,
      2
    )
  );
});

test("Phase5 catalog model: 28 non-SEO roots + 28 public-seo", () => {
  const cat = CONTENT_PACK_CATALOG[LOCALE];
  assert.ok(cat);
  const keys = Object.keys(cat);
  const seoKeys = keys.filter((k) => k.startsWith("public-seo/"));
  const nonSeoKeys = keys.filter((k) => !k.startsWith("public-seo/"));
  assert.equal(seoKeys.length, 28);
  assert.equal(nonSeoKeys.length, 28);
  assert.equal(keys.length, 56);
  for (const rel of ROOT_PACKS) {
    assert.ok(cat[rel], `missing root ${rel}`);
  }
  const enKeys = Object.keys(CONTENT_PACK_CATALOG.en || {}).sort();
  assert.deepEqual(nonSeoKeys.sort(), enKeys);
  // no duplicates
  assert.equal(new Set(keys).size, keys.length);
});

test("Phase5 books: disk load + catalog provenance + representatives", () => {
  const { idFiles: files } = assertFamilyDiskParityWithEn("books");
  let missing = 0;
  for (const rel of files) {
    const pack = loadContentPack(LOCALE, "books", ...rel.split("/"));
    if (pack == null) missing += 1;
  }
  assert.equal(missing, 0);
  for (const rel of [
    "books/ui.json",
    "books/registry-titles.json",
    "books/english-page-skills.json",
  ]) {
    assertCatalogProvenance(rel);
  }
  const g1 = bookUiCopyForLocale(LOCALE, "grades", "g1");
  assert.equal(g1, "Kelas 1");
  const mathTitle = resolveRegistryTitleKey("math.g1.a", LOCALE);
  assert.ok(typeof mathTitle === "string" && mathTitle.length > 0);
  assert.notEqual(mathTitle, resolveRegistryTitleKey("math.g1.a", "en"));
});

test("Phase5 games: disk load + index provenance + representatives", () => {
  const { idFiles: files } = assertFamilyDiskParityWithEn("games");
  let missing = 0;
  for (const rel of files) {
    if (loadContentPack(LOCALE, "games", ...rel.split("/")) == null) missing += 1;
  }
  assert.equal(missing, 0);
  assertCatalogProvenance("games/burn-down-index.json");
  assertCatalogProvenance("games/ui-pack-index.json");
  const enIndex = getCatalogPackExact("en", "games/burn-down-index.json");
  const idIndex = getCatalogPackExact(LOCALE, "games/burn-down-index.json");
  assert.ok(enIndex && typeof enIndex === "object");
  assert.ok(idIndex && typeof idIndex === "object");
  assert.deepEqual(
    Object.keys(idIndex).sort(),
    Object.keys(enIndex).sort(),
    "games burn-down-index keys vs EN"
  );
  assert.ok(Object.keys(idIndex).length > 0, "games burn-down-index empty");
  // English-learning game + non-English game — pack provenance via index overlay
  const enCopy = gamePackCopyForLocale("en", "leo-lab", "title");
  const idCopy = gamePackCopyForLocale(LOCALE, "leo-lab", "title");
  assert.ok(idCopy);
  if (enCopy !== idCopy) {
    assert.notEqual(idCopy, enCopy);
  }
});

test("Phase5 rewards + demo", () => {
  assertFamilyDiskParityWithEn("rewards");
  assertFamilyDiskParityWithEn("demo");
  assertCatalogProvenance("rewards/ui.json");
  assertCatalogProvenance("rewards/card-catalog.json");
  assertCatalogProvenance("demo/ui.json");
  const catalog = loadRewardCardCatalog(LOCALE);
  assert.ok(catalog && typeof catalog === "object");
  const uiSample = rewardUiCopyForLocale(LOCALE, "shop", "coinsLabel");
  assert.ok(typeof uiSample === "string" && uiSample.length > 0);
  const demo = demoPackCopyForLocale(LOCALE, "display", "studentName");
  assert.ok(typeof demo === "string" && demo.length > 0);
});

test("Phase5 global-burn-down: index + leaves", () => {
  const { idFiles: files } = assertFamilyDiskParityWithEn("global-burn-down");
  assertCatalogProvenance("global-burn-down/burn-down-index.json");
  const enIndex = getCatalogPackExact("en", "global-burn-down/burn-down-index.json");
  const index = getCatalogPackExact(LOCALE, "global-burn-down/burn-down-index.json");
  assert.ok(enIndex && typeof enIndex === "object");
  assert.ok(index && typeof index === "object");
  assert.deepEqual(
    Object.keys(index).sort(),
    Object.keys(enIndex).sort(),
    "global-burn-down index keys vs EN"
  );
  // Flat companion leaves beside burn-down-index.json (not under burn-down/)
  const leafFiles = files.filter((f) => f !== "burn-down-index.json");
  assert.equal(Object.keys(index).length, leafFiles.length, "index keys vs companion leaves");
  const indexKeys = new Set(Object.keys(index));
  let missing = 0;
  let stale = 0;
  for (const f of leafFiles) {
    const slug = f.replace(/\.json$/, "");
    if (!indexKeys.has(slug)) missing += 1;
  }
  for (const slug of indexKeys) {
    if (!leafFiles.includes(`${slug}.json`)) stale += 1;
  }
  assert.equal(missing, 0, "global-burn-down leaves missing from index");
  assert.equal(stale, 0, "global-burn-down stale index entries");
  const slug0 = Object.keys(index)[0];
  const key0 = Object.keys(index[slug0] || {})[0] || "level";
  const id = globalBurnDownCopyForLocale(LOCALE, slug0, key0);
  assert.ok(typeof id === "string");
});

test("Phase5 reports: index + leaves", () => {
  const { idFiles: files } = assertFamilyDiskParityWithEn("reports");
  assertCatalogProvenance("reports/burn-down-index.json");
  const enIndex = getCatalogPackExact("en", "reports/burn-down-index.json");
  const index = getCatalogPackExact(LOCALE, "reports/burn-down-index.json");
  assert.ok(enIndex && typeof enIndex === "object");
  assert.ok(index && typeof index === "object");
  assert.deepEqual(
    Object.keys(index).sort(),
    Object.keys(enIndex).sort(),
    "reports burn-down-index keys vs EN"
  );
  const leafFiles = files.filter((f) => f.startsWith("burn-down/") && f.endsWith(".json"));
  assert.equal(Object.keys(index).length, leafFiles.length, "reports index vs burn-down leaves");
  const indexKeys = new Set(Object.keys(index));
  let missing = 0;
  let stale = 0;
  for (const f of leafFiles) {
    const slug = f.replace(/^burn-down\//, "").replace(/\.json$/, "");
    if (!indexKeys.has(slug)) missing += 1;
  }
  for (const slug of indexKeys) {
    if (!leafFiles.includes(`burn-down/${slug}.json`)) stale += 1;
  }
  assert.equal(missing, 0, "reports leaves missing from index");
  assert.equal(stale, 0, "reports stale index entries");
  const sampleSlug = Object.keys(index)[0];
  const idVal = reportPackCopyForLocale(LOCALE, sampleSlug, Object.keys(index[sampleSlug])[0]);
  assert.ok(typeof idVal === "string" && idVal.length > 0);
});

test("Phase5 learning: roots + taxonomy + diagnostics + burn-down", () => {
  const { idFiles: files } = assertFamilyDiskParityWithEn("learning");
  let missing = 0;
  for (const rel of files) {
    if (loadContentPack(LOCALE, "learning", ...rel.split("/")) == null) missing += 1;
  }
  assert.equal(missing, 0);
  for (const rel of ROOT_PACKS.filter((r) => r.startsWith("learning/"))) {
    assertCatalogProvenance(rel);
  }
  const labels = resolveRegisteredContentPack(LOCALE, "learning", "diagnostic-labels.json");
  const tags = resolveRegisteredContentPack(LOCALE, "learning", "fast-diagnostic-tag-labels.json");
  assert.ok(labels && typeof labels === "object");
  assert.ok(tags && typeof tags === "object");
  const enBd = getCatalogPackExact("en", "learning/burn-down-index.json");
  const bd = getCatalogPackExact(LOCALE, "learning/burn-down-index.json");
  assert.ok(bd && Object.keys(bd).length > 0);
  assert.deepEqual(
    Object.keys(bd).sort(),
    Object.keys(enBd || {}).sort(),
    "learning burn-down-index keys vs EN"
  );
  const slug = Object.keys(bd)[0];
  const key = Object.keys(bd[slug] || {})[0];
  if (key) {
    const copy = burnDownCopyForLocale(LOCALE, slug, key);
    assert.ok(typeof copy === "string");
  }
});

test("Phase5 English fallback for catalog roots = 0", () => {
  let enFallback = 0;
  for (const rel of ROOT_PACKS) {
    const idPack = getCatalogPackExact(LOCALE, rel);
    const enPack = getCatalogPackExact("en", rel);
    const resolved = resolveRegisteredContentPack(LOCALE, ...rel.split("/"));
    if (idPack == null) {
      enFallback += 1;
      continue;
    }
    if (!deepEqualJson(resolved, idPack)) enFallback += 1;
    else if (enPack != null && deepEqualJson(resolved, enPack) && !deepEqualJson(idPack, enPack)) {
      enFallback += 1;
    }
  }
  assert.equal(enFallback, 0);
});

test("Phase5 public-seo regression", () => {
  const disk = familyDisk("public-seo");
  assert.equal(disk.length, ID_ID_PUBLIC_SEO_KEYS.length);
  const catSeo = Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {}).filter((k) =>
    k.startsWith("public-seo/")
  );
  assert.equal(catSeo.length, ID_ID_PUBLIC_SEO_KEYS.length);
  assert.deepEqual(
    disk.map((f) => `public-seo/${f}`).sort(),
    [...catSeo].sort()
  );
  assert.equal(SEO_PUBLIC_PATHS.length, 51);
  for (const rel of disk) {
    assert.ok(getClientPublicSeoOverlay(LOCALE, ...rel.split("/")), rel);
  }
});

test("Phase5 namespace + Help regression", async () => {
  resetLocaleBundleCache();
  const bundles = await loadLocaleBundles(LOCALE);
  assert.ok(Array.isArray(I18N_NAMESPACES) && I18N_NAMESPACES.length > 0);
  assert.equal(Object.keys(bundles).length, I18N_NAMESPACES.length);
  for (const ns of I18N_NAMESPACES) {
    assert.ok(bundles[ns], `missing bundle ${ns}`);
  }
  assert.equal(resolveHelpLocale(LOCALE), LOCALE);
  const sections = getHelpSections(LOCALE);
  assert.equal(Object.keys(sections).length, 4);
  let articleCount = 0;
  for (const key of Object.keys(sections)) {
    articleCount += listArticles(key, LOCALE).length;
  }
  assert.equal(articleCount, 40);
});
