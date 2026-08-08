/**
 * Independent Auditor B — Indonesian Master Final Structural & Runtime Probe (READ-ONLY).
 * Writes JSON report under artifacts/id-ID-auditor-b-final/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "artifacts/id-ID-auditor-b-final/probe-results.json");
const LOCALE = "id-ID";
const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

function walkJsonFiles(dir, base = "") {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJsonFiles(p, rel));
    else if (e.name.endsWith(".json")) out.push(rel.replace(/\\/g, "/"));
  }
  return out;
}

function collectStringLeaves(v, prefix, out) {
  if (typeof v === "string") {
    out.set(prefix, v);
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      if (typeof item === "string") out.set(p, item);
      else collectStringLeaves(item, p, out);
    });
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, child] of Object.entries(v)) {
      const p = prefix ? `${prefix}.${k}` : k;
      collectStringLeaves(child, p, out);
    }
  }
}

function placeholders(s) {
  return [...String(s).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort();
}

function countLeaves(obj) {
  const m = new Map();
  collectStringLeaves(obj, "", m);
  return m;
}

function countMdFiles(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) n += countMdFiles(p);
    else if (e.name.endsWith(".md")) n += 1;
  }
  return n;
}

const report = { generatedAt: new Date().toISOString(), locale: LOCALE };

// --- Foundation ---
function fileUrl(rel) {
  return `file://${path.join(ROOT, rel).replace(/\\/g, "/")}`;
}

const registryMod = await import(fileUrl("lib/i18n/locale-registry.js"));
const resolutionMod = await import(fileUrl("lib/i18n/locale-resolution.js"));
const loadMod = await import(fileUrl("lib/i18n/load-messages.js"));
const seoMod = await import(fileUrl("lib/seo/locale-seo.js"));
const pathMod = await import(fileUrl("lib/i18n/locale-path.js"));
const helpMod = await import(fileUrl("data/help-center/index.js"));
const catalogMod = await import(fileUrl("lib/content/pack-catalog.js"));
const localeServerMod = await import(fileUrl("lib/content/locale.server.js"));
const seoClientMod = await import(fileUrl("lib/seo/public-seo-id-ID-client-index.js"));
const seoPathsMod = await import(fileUrl("lib/seo/seo-public-paths.js"));
const seoOverlayMod = await import(fileUrl("lib/seo/client-public-seo-overlay.js"));
const completenessMod = await import(fileUrl("lib/i18n/check-locale-completeness.js"));
const resolveApiMod = await import(fileUrl("lib/api/resolve-api-error-message.js"));
const displayMod = await import(fileUrl("lib/platform-ui/display-labels.js"));

const def = registryMod.resolveLocaleDefinition(LOCALE);
const selectable = registryMod.getSelectableLocales();
const prefixes = Object.values(registryMod.LOCALE_REGISTRY).map((d) => d.pathPrefix).filter(Boolean);
const prefixCollisions = prefixes.filter((p, i) => prefixes.indexOf(p) !== i);
const idCollisions = Object.keys(registryMod.LOCALE_REGISTRY).filter((id, i, arr) => arr.indexOf(id) !== i);

const sw = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
const swHasId = /"id-ID"\s*:\s*"id"/.test(sw);

report.foundation = {
  locale: def?.id,
  enabled: def?.enabled,
  pathPrefix: def?.pathPrefix,
  publicPath: `/${def?.pathPrefix}`,
  selector: def?.nativeName || def?.label,
  selectorCount: selectable.length,
  indonesiaInSelector: selectable.some((s) => s.id === LOCALE || s.nativeName === "Indonesia" || s.label === "Indonesia"),
  fallbackChain: resolutionMod.getLocaleFallbackChain(LOCALE),
  direction: registryMod.resolveDirection(LOCALE),
  isRtl: registryMod.isRtlLocale(LOCALE),
  ogLocale: def?.ogLocale,
  ogResolved: seoMod.resolveOgLocale(LOCALE),
  textToSpeechLocale: def?.textToSpeechLocale,
  swMap: swHasId,
  offlinePath: "/id/offline",
  resolveFromPrefix: registryMod.resolveLocaleIdFromPathPrefix("id"),
  prefixCollisions: [...new Set(prefixCollisions)],
  idCollisions,
  withLocaleSample: pathMod.withLocalePath("/practice/math", LOCALE),
  stripSample: pathMod.stripLocaleFromPath("/id/practice/math"),
};

// --- Namespaces ---
const { I18N_NAMESPACES, loadLocaleBundles, lookupMessage, resetLocaleBundleCache } = loadMod;
const nsReport = {};
let enTotal = 0;
let idTotal = 0;
let missingGlobal = [];
let extraGlobal = [];
let emptyGlobal = [];
let phGlobal = [];

for (const ns of I18N_NAMESPACES) {
  const enPath = path.join(ROOT, "locales/en", `${ns}.json`);
  const idPath = path.join(ROOT, "locales/id-ID", `${ns}.json`);
  const en = countLeaves(JSON.parse(fs.readFileSync(enPath, "utf8")));
  const id = countLeaves(JSON.parse(fs.readFileSync(idPath, "utf8")));
  const missing = [...en.keys()].filter((k) => !id.has(k));
  const extra = [...id.keys()].filter((k) => !en.has(k));
  const empty = [];
  const ph = [];
  for (const [k, enVal] of en) {
    const idVal = id.get(k);
    if (idVal === undefined) continue;
    if (!String(idVal).trim()) empty.push(k);
    if (placeholders(enVal).join(",") !== placeholders(idVal).join(",")) ph.push(k);
  }
  nsReport[ns] = { en: en.size, id: id.size, missing: missing.length, extra: extra.length, empty: empty.length, ph: ph.length };
  enTotal += en.size;
  idTotal += id.size;
  missingGlobal.push(...missing.map((k) => `${ns}.${k}`));
  extraGlobal.push(...extra.map((k) => `${ns}.${k}`));
  emptyGlobal.push(...empty.map((k) => `${ns}.${k}`));
  phGlobal.push(...ph.map((k) => `${ns}.${k}`));
}

const enVal = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/validation.json"), "utf8"));
const idVal = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID/validation.json"), "utf8"));
const enApiKeys = Object.keys(enVal.api || {}).sort();
const idApiKeys = Object.keys(idVal.api || {}).sort();

report.namespaces = {
  authorityCount: I18N_NAMESPACES.length,
  namespaces: [...I18N_NAMESPACES],
  perNs: nsReport,
  enLeaves: enTotal,
  idLeaves: idTotal,
  missing: missingGlobal.length,
  extra: extraGlobal.length,
  empty: emptyGlobal.length,
  placeholderMismatches: phGlobal.length,
  missingSample: missingGlobal.slice(0, 10),
  extraSample: extraGlobal.slice(0, 10),
  validationApi: {
    en: enApiKeys.length,
    id: idApiKeys.length,
    keysEqual: JSON.stringify(enApiKeys) === JSON.stringify(idApiKeys),
  },
};

// resolveApiErrorMessage smoke
resetLocaleBundleCache();
const bundles = await loadLocaleBundles(LOCALE);
const t = (key, params) => lookupMessage(bundles, key, params) ?? key;
const mapped = resolveApiMod.resolveApiErrorMessage(
  { code: "username_taken", message: "Username is already taken." },
  { translate: t, fallback: t("validation.apiFallback") }
);
const unknown = resolveApiMod.resolveApiErrorMessage(
  { code: "totally_unknown_xyz", message: "Something English blew up" },
  { translate: t, fallback: t("validation.apiFallback") }
);
displayMod.bindPlatformDisplayLocale?.(LOCALE);
const viaApiErrorMessageHe = displayMod.apiErrorMessageHe
  ? displayMod.apiErrorMessageHe({ code: "username_taken", message: "Username is already taken." })
  : null;

report.validationApiRuntime = {
  mappedBeatsEnglish: mapped === t("validation.api.username_taken") && mapped !== "Username is already taken.",
  unknownUsesFallback: unknown === t("validation.apiFallback"),
  mappedValue: mapped,
  unknownValue: unknown,
  apiErrorMessageHeSample: viaApiErrorMessageHe,
};

// --- Help ---
const helpLocale = helpMod.resolveHelpLocale(LOCALE);
const sections = helpMod.getHelpSections(LOCALE);
const articles = helpMod.listArticles(LOCALE);
const enArticles = helpMod.listArticles("en");
const enSlugs = new Set(enArticles.map((a) => a.slug));
const idSlugs = new Set(articles.map((a) => a.slug));
const helpMissing = [...enSlugs].filter((s) => !idSlugs.has(s));
const helpExtra = [...idSlugs].filter((s) => !enSlugs.has(s));
const slugCounts = {};
for (const a of articles) slugCounts[a.slug] = (slugCounts[a.slug] || 0) + 1;
const helpDupes = Object.entries(slugCounts).filter(([, c]) => c > 1).map(([s]) => s);

report.help = {
  runtimeLocale: helpLocale,
  sections: sections.length,
  articles: articles.length,
  missing: helpMissing.length,
  extra: helpExtra.length,
  duplicates: helpDupes.length,
};

// --- Public SEO ---
const seoDisk = walkJsonFiles(path.join(ROOT, "content-packs/id-ID/public-seo"));
const clientKeys = seoClientMod.ID_ID_PUBLIC_SEO_KEYS || [];
const clientOverlay = seoOverlayMod.getClientPublicSeoOverlay(LOCALE);
const seoPaths = seoPathsMod.SEO_PUBLIC_PATHS || [];
const catalog = catalogMod.CONTENT_PACK_CATALOG[LOCALE] || {};
const catalogKeys = Object.keys(catalog);
const publicSeoCatalog = catalogKeys.filter((k) => k.startsWith("public-seo/"));
const nonSeoCatalog = catalogKeys.filter((k) => !k.startsWith("public-seo/"));

report.publicSeo = {
  diskOverlays: seoDisk.length,
  clientIndex: Array.isArray(clientKeys) ? clientKeys.length : Object.keys(clientKeys).length,
  catalogPublicSeo: publicSeoCatalog.length,
  seoPublicPaths: seoPaths.length,
  clientOverlayPresent: !!clientOverlay,
  runtimeProbeNote: "detailed path coverage via phase2d/phase5 tests",
};

let seoRuntimeOk = 0;
let seoRuntimeMissing = [];
try {
  const localeSeo = await import(fileUrl("lib/seo/locale-public-seo-content.js"));
  for (const p of seoPaths) {
    const overlay =
      localeSeo.resolvePublicSeoContent?.(LOCALE, p) ||
      localeSeo.getPublicSeoForPath?.(LOCALE, p) ||
      localeSeo.resolveLocalePublicSeo?.(LOCALE, p);
    if (overlay) seoRuntimeOk += 1;
    else seoRuntimeMissing.push(p);
  }
  report.publicSeo.localizedRuntime = `${seoRuntimeOk}/${seoPaths.length}`;
  report.publicSeo.runtimeMissing = seoRuntimeMissing.slice(0, 20);
  report.publicSeo.resolverExports = Object.keys(localeSeo).slice(0, 30);
} catch (e) {
  report.publicSeo.runtimeError = String(e.message || e);
}

// --- Content packs disk ---
const PACK_ROOT = path.join(ROOT, "content-packs", LOCALE);
const families = {
  books: walkJsonFiles(path.join(PACK_ROOT, "books")).length,
  games: walkJsonFiles(path.join(PACK_ROOT, "games")).length,
  rewards: walkJsonFiles(path.join(PACK_ROOT, "rewards")).length,
  demo: walkJsonFiles(path.join(PACK_ROOT, "demo")).length,
  "global-burn-down": walkJsonFiles(path.join(PACK_ROOT, "global-burn-down")).length,
  learning: walkJsonFiles(path.join(PACK_ROOT, "learning")).length,
  reports: walkJsonFiles(path.join(PACK_ROOT, "reports")).length,
  "public-seo": seoDisk.length,
};
const nonSeoTotal =
  families.books +
  families.games +
  families.rewards +
  families.demo +
  families["global-burn-down"] +
  families.learning +
  families.reports;

report.contentPacks = {
  disk: families,
  nonSeoTotal,
  publicSeo: families["public-seo"],
  totalDisk: nonSeoTotal + families["public-seo"],
  catalogKeys: catalogKeys.length,
  nonSeoCatalogRoots: nonSeoCatalog.length,
  publicSeoCatalogKeys: publicSeoCatalog.length,
  catalogModel: `${nonSeoCatalog.length} non-SEO + ${publicSeoCatalog.length} public-seo = ${catalogKeys.length}`,
};

// Runtime provenance samples
const loadContentPack = localeServerMod.loadContentPack;
const samples = [
  "books/ui.json",
  "games/ui-pack-index.json",
  "rewards/ui.json",
  "demo/ui.json",
  "global-burn-down/burn-down-index.json",
  "learning/diagnostic-labels.json",
  "reports/burn-down-index.json",
];
const provenance = {};
for (const rel of samples) {
  try {
    const pack = loadContentPack(LOCALE, rel);
    provenance[rel] = {
      found: !!pack,
      locale: pack?.locale || pack?.__locale || pack?.meta?.locale || null,
      exact: catalogMod.getCatalogPackExact?.(LOCALE, rel) ? true : !!catalog[rel],
    };
  } catch (e) {
    provenance[rel] = { error: String(e.message || e) };
  }
}
report.runtimeProvenanceSamples = provenance;

// Global burn-down / reports leaf counts from indexes if present
function indexLeafCount(rel) {
  try {
    const pack = loadContentPack(LOCALE, rel);
    const data = pack?.data || pack;
    if (!data) return null;
    if (Array.isArray(data.entries)) return data.entries.length;
    if (Array.isArray(data.items)) return data.items.length;
    if (data.index && typeof data.index === "object") return Object.keys(data.index).length;
    if (typeof data === "object") {
      const keys = Object.keys(data).filter((k) => k !== "locale" && k !== "meta");
      return keys.length;
    }
    return null;
  } catch {
    return null;
  }
}
report.burnDownRuntime = {
  globalIndexLeaves: indexLeafCount("global-burn-down/burn-down-index.json"),
  reportsIndexLeaves: indexLeafCount("reports/burn-down-index.json"),
  learningIndexLeaves: indexLeafCount("learning/burn-down-index.json"),
};

// --- Native learning ---
let mathKinds = null;
let mathTemplates = null;
let geoKinds = null;
let geoTemplates = null;
function extractKinds(src) {
  const s = new Set();
  for (const m of src.matchAll(/kind === "([^"]+)"/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.includes\("([^"]+)"\)/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.startsWith\("([^"]+)"\)/g)) s.add(m[1]);
  return [...s].sort();
}
function extractDisplayTemplates(src) {
  /** @type {string[]} */
  const out = [];
  for (const m of src.matchAll(/`([^`\\]|\\.)*`/gs)) {
    out.push(m[0].slice(1, -1));
  }
  for (const m of src.matchAll(/return "([^"\\]|\\.)*"/g)) {
    const inner = m[0].slice('return "'.length, -1);
    if (/[A-Za-zÀ-ÿ]{3,}/.test(inner)) out.push(inner);
  }
  return out;
}
try {
  const mathSrc = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/math.js"), "utf8");
  const geoSrc = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/geometry.js"), "utf8");
  mathKinds = extractKinds(mathSrc).length;
  mathTemplates = extractDisplayTemplates(mathSrc).length;
  geoKinds = extractKinds(geoSrc).length;
  geoTemplates = extractDisplayTemplates(geoSrc).length;
} catch (e) {
  report.mathGeoExtractError = String(e.message || e);
}

// List utils/learning-content-id-ID
const idLearnDir = path.join(ROOT, "utils/learning-content-id-ID");
report.nativeLearningFiles = fs.existsSync(idLearnDir) ? fs.readdirSync(idLearnDir) : [];

// Science overlay
let science = null;
try {
  const sciMod = await import(fileUrl("data/science-questions-id-ID-overlay.js"));
  const overlay = sciMod.SCIENCE_ID_ID_OVERLAY || sciMod.default || sciMod;
  const q = overlay.questions || overlay;
  const n = Array.isArray(q) ? q.length : Object.keys(q || {}).length;
  let contractComplete = overlay.contractComplete === true || sciMod.contractComplete === true;
  try {
    const covMod = await import(fileUrl("lib/learning/science-localization-coverage.js"));
    const cov = covMod.computeScienceLocalizationCoverage?.(overlay) || covMod.computeScienceLocalizationCoverage?.(LOCALE);
    if (cov && typeof cov === "object") {
      science = { count: n, ...cov, contractComplete: cov.contractComplete ?? contractComplete };
    } else {
      science = { count: n, contractComplete };
    }
  } catch {
    science = { count: n, contractComplete };
  }
} catch (e) {
  science = { error: String(e.message || e) };
}

// Writing
let writing = {};
try {
  const wp = await import(fileUrl("data/writing/word-packs.id-ID.js"));
  const packs = wp.WORD_PACKS_ID_ID || wp.default || wp;
  writing.packs = Array.isArray(packs) ? packs.length : Object.keys(packs || {}).length;
  const colors = wp.COLOR_INSTRUCTIONS_ID_ID || wp.colorInstructions || null;
  writing.colorInstructions = colors ? (Array.isArray(colors) ? colors.length : Object.keys(colors).length) : null;
} catch (e) {
  writing.packsError = String(e.message || e);
}
try {
  const rt = await import(fileUrl("data/writing/ready-title.id-ID.js"));
  const titles = rt.READY_TITLES_ID_ID || rt.READY_TITLE_ID_ID || rt.default || rt;
  writing.readyTitles = Array.isArray(titles) ? titles.length : Object.keys(titles || {}).length;
} catch (e) {
  writing.titlesError = String(e.message || e);
}
try {
  const cues = await import(fileUrl("data/english-questions/writing-sentence-cues/id-ID.js"));
  const c = cues.WRITING_SENTENCE_CUES_ID_ID || cues.default || cues;
  writing.sentenceCues = Array.isArray(c) ? c.length : Object.keys(c || {}).length;
} catch (e) {
  writing.cuesError = String(e.message || e);
}

// Word meanings
let wordMeanings = {};
try {
  const wm = await import(fileUrl("data/english-questions/word-meanings/id-ID.js"));
  const meanings = wm.WORD_MEANINGS_ID_ID || wm.default || wm;
  wordMeanings.count = Array.isArray(meanings) ? meanings.length : Object.keys(meanings || {}).length;
  let empty = 0;
  if (meanings && typeof meanings === "object" && !Array.isArray(meanings)) {
    for (const v of Object.values(meanings)) {
      if (!String(v || "").trim()) empty += 1;
    }
  }
  wordMeanings.empty = empty;
} catch (e) {
  wordMeanings.error = String(e.message || e);
}
try {
  const lists = await import(fileUrl("data/english-questions/word-lists.js"));
  const WORD_LISTS = lists.WORD_LISTS || lists.default;
  wordMeanings.WORD_LISTS = Array.isArray(WORD_LISTS) ? WORD_LISTS.length : Object.keys(WORD_LISTS || {}).length;
} catch (e) {
  wordMeanings.listError = String(e.message || e);
}

// Learning books
const bookRoot = path.join(ROOT, "docs/learning-book/id-ID");
const subjects = ["math", "geometry", "science", "english"];
const grades = ["g1", "g2", "g3", "g4", "g5", "g6"];
let slots = 0;
let missingSlots = [];
for (const s of subjects) {
  for (const g of grades) {
    const d = path.join(bookRoot, s, g);
    if (fs.existsSync(d)) slots += 1;
    else missingSlots.push(`${s}/${g}`);
  }
}
const enBookRoot = path.join(ROOT, "docs/learning-book/en");
report.learningBooks = {
  slotsPresent: slots,
  missingSlots,
  localizedMdFiles: countMdFiles(bookRoot),
  enSoTPresentOnHead: fs.existsSync(enBookRoot),
};

report.nativeLearning = {
  mathKinds,
  mathTemplates,
  geoKinds,
  geoTemplates,
  science,
  writing,
  wordMeanings,
};

// Completeness
try {
  const result = completenessMod.checkLocaleCompleteness(LOCALE);
  const findings = result.findings || result.allFindings || [];
  const ok = findings.filter((f) => f.status === "ok").length;
  const missing = findings.filter((f) => f.status === "missing").length;
  const fallback = findings.filter((f) => f.status === "fallback").length;
  const exceptions = findings.filter((f) => f.status === "english_subject_exception").length;
  report.completeness = {
    ok: result.okCount ?? ok,
    missing: result.missingCount ?? missing,
    fallback: result.fallbackCount ?? fallback,
    exceptions: result.exceptionCount ?? exceptions,
    summary: result.summary || { ok, missing, fallback, exceptions },
    findings: findings.map((f) => ({
      id: f.id,
      status: f.status,
      detail: f.detail,
    })),
  };
} catch (e) {
  report.completeness = { error: String(e.message || e), stack: e.stack };
}

// English subject exception
try {
  const contentLoc = resolutionMod.resolveContentLocale({ interfaceLocale: LOCALE, subject: "english" });
  const uiLoc = resolutionMod.resolveContentLocale({ interfaceLocale: LOCALE, subject: "math" });
  report.englishSubject = {
    englishContentLocale: contentLoc,
    mathContentLocale: uiLoc,
  };
} catch (e) {
  report.englishSubject = { error: String(e.message || e) };
}

fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ wrote: OUT, foundation: report.foundation, namespaces: {
  authorityCount: report.namespaces.authorityCount,
  enLeaves: report.namespaces.enLeaves,
  idLeaves: report.namespaces.idLeaves,
  missing: report.namespaces.missing,
  extra: report.namespaces.extra,
  empty: report.namespaces.empty,
  ph: report.namespaces.placeholderMismatches,
  validationApi: report.namespaces.validationApi,
}, help: report.help, contentPacks: report.contentPacks, completeness: report.completeness, learningBooks: report.learningBooks, native: report.nativeLearning }, null, 2));
