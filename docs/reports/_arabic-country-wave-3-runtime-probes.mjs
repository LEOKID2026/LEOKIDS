/**
 * Focused runtime probes for Arabic Country Wave 3 wiring.
 * Catches "file on disk but runtime ignores it" + Qatar /qa carve-out.
 * Run: node docs/reports/_arabic-country-wave-3-runtime-probes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  getPublicLocalePathPrefix,
  resolveDirection,
  isRtlLocale,
  withLocalePath,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import { getClientPublicSeoOverlay } from "../../lib/seo/public-seo-ar-001-client-index.js";
import {
  resolveHelpLocale,
  listArticles,
  getHelpSections,
} from "../../data/help-center/index.js";
import {
  shouldShowLayoutLanguageSwitcher,
  isInternalQaToolingPath,
  isQatarPublicLocalePath,
} from "../../lib/site-nav.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "docs/reports/arabic-country-wave-3-runtime-probes.json");

const HEBREW_RE = /[\u0590-\u05FF]/;
const ARABIC_RE = /[\u0600-\u06FF]/;
/** English UI chrome labels — not English-learning subject content. */
export const FORBIDDEN_EN_UI =
  /\b(Home|Dashboard|Worksheets|Parents|Teachers|School)\b/;

/**
 * False Qatar claim: foundational stage = full grades 1–6.
 * Does NOT match legal early-learning wording such as
 * "المرحلة التأسيسية للصفين الأول والثاني".
 * @param {string} blob
 * @returns {string[]} matched pattern sources
 */
export function detectFalseQatarFoundationalClaims(blob) {
  const text = String(blob || "");
  const patterns = [
    /المرحلة التأسيسية\s*(هي|=|:)?\s*الصفوف\s*من\s*1\s*إلى\s*6/,
    /المرحلة التأسيسية\s*(هي|=|:)?\s*الدرجات\s*1\s*[–-]\s*6/,
    /الصفوف\s*من\s*1\s*إلى\s*6\s*هي\s*المرحلة التأسيسية/,
    /الدرجات\s*1\s*[–-]\s*6\s*هي\s*المرحلة التأسيسية/,
    /المرحلة التأسيسية\s*(تشمل|تغطي)\s*الصفوف\s*(من\s*)?1\s*(إلى|[–-])\s*6/,
    /المرحلة التأسيسية\s*(للصفوف|للدرجات)\s*(من\s*)?1\s*(إلى|[–-])\s*6/,
    /foundational\s*(stage|phase)?\s*(is|=|:)?\s*grades?\s*1\s*[–-]\s*6/i,
    /grades?\s*1\s*[–-]\s*6\s*(are|is|=)\s*(the\s+)?foundational/i,
  ];
  return patterns.filter((re) => re.test(text)).map((re) => String(re));
}

/**
 * @param {Array<string|null|undefined>} samples UI chrome samples only
 * @returns {string[]}
 */
export function collectForbiddenEnglishUi(samples) {
  return (samples || [])
    .filter(Boolean)
    .map(String)
    .filter((s) => FORBIDDEN_EN_UI.test(s) && !ARABIC_RE.test(s));
}

const LOCALES = [
  {
    id: "ar-KW",
    prefix: "kw",
    helpLocale: "ar-KW",
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabel: "فصل",
    studentHit: "طالب",
  },
  {
    id: "ar-QA",
    prefix: "qa",
    helpLocale: "ar-QA",
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabel: "شعبة",
    studentHit: "طالب",
  },
  {
    id: "ar-OM",
    prefix: "om",
    helpLocale: "ar-OM",
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabelIncludes: "شعبة",
    studentHit: "طالب",
  },
  {
    id: "ar-BH",
    prefix: "bh",
    helpLocale: "ar-BH",
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabelIncludes: "صف",
    studentHit: "طالب",
  },
];

function walkPackJson(dir, base, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkPackJson(p, base, acc);
    else if (e.name.endsWith(".json")) {
      acc.push(path.relative(base, p).split(path.sep).join("/"));
    }
  }
  return acc;
}

function diskNamespaces(localeId) {
  const dir = path.join(ROOT, "locales", localeId);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

function loadSwHelpers() {
  const sw = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
  const start = sw.indexOf("const LOCALE_PUBLIC_PATH_PREFIX");
  const end = sw.indexOf("const REWARD_CARD_PATH_PREFIX");
  // eslint-disable-next-line no-new-func
  return new Function(
    `${sw.slice(start, end)}\nreturn { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale };`
  )();
}

function probeNamespaceParity(localeId) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(localeId);
  const ns = diskNamespaces(localeId);
  const failures = [];
  for (const name of ns) {
    if (!bundles[name]) failures.push(`missing bundle ${name}`);
  }
  return { namespacesOnDisk: ns, failures };
}

function probeCatalogParity(localeId) {
  const disk = walkPackJson(
    path.join(ROOT, "content-packs", localeId),
    path.join(ROOT, "content-packs", localeId)
  ).sort();
  const catalog = Object.keys(CONTENT_PACK_CATALOG[localeId] || {}).sort();
  return {
    diskCount: disk.length,
    catalogCount: catalog.length,
    missing: disk.filter((p) => !catalog.includes(p)),
    stale: catalog.filter((p) => !disk.includes(p)),
  };
}

function probeSeoParity(localeId) {
  const disk = walkPackJson(
    path.join(ROOT, "content-packs", localeId, "public-seo"),
    path.join(ROOT, "content-packs", localeId, "public-seo")
  ).sort();
  const missing = disk.filter((rel) => !getClientPublicSeoOverlay(localeId, ...rel.split("/")));
  return { diskCount: disk.length, missing };
}

function probe(localeSpec) {
  const { id, helpLocale, grade6 } = localeSpec;
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(id);
  const g6 = lookupMessage(bundles, "common.grade6");
  const classLabel = lookupMessage(bundles, "school.portal.classLabel");
  const student = lookupMessage(bundles, "learning.master.defaultPlayerName");
  const gradeField = lookupMessage(bundles, "worksheets.gradeField");
  const about = JSON.stringify(bundles.ui?.public?.about || bundles.ui?.about || {});
  const practice = getPracticePageContentForLocale(id, "math");
  const guide = getGuidePageContentForLocale(id, "math-practice-at-home");
  const helpParents = listArticles("parents", id);
  const helpSections = getHelpSections(id);

  const failures = [];
  if (g6 !== grade6) failures.push(`grade6 want ${grade6} got ${g6}`);
  if (localeSpec.gradeField && gradeField !== localeSpec.gradeField) {
    failures.push(`gradeField want ${localeSpec.gradeField} got ${gradeField}`);
  }
  if (localeSpec.classLabel && classLabel !== localeSpec.classLabel) {
    failures.push(`classLabel want ${localeSpec.classLabel} got ${classLabel}`);
  }
  if (
    localeSpec.classLabelIncludes &&
    !String(classLabel || "").includes(localeSpec.classLabelIncludes)
  ) {
    failures.push(`classLabel missing ${localeSpec.classLabelIncludes}: ${classLabel}`);
  }
  if (localeSpec.studentHit && !String(student || "").includes(localeSpec.studentHit)) {
    failures.push(`student missing ${localeSpec.studentHit}: ${student}`);
  }

  if (id === "ar-KW") {
    if (/الصفوف من 1 إلى 6 هي المرحلة الابتدائية|الدرجات 1[–-]6.*الابتدائية فقط/.test(about)) {
      failures.push("KW maps all 1–6 to primary alone");
    }
  }
  if (id === "ar-QA") {
    const falseFoundational = detectFalseQatarFoundationalClaims(about);
    if (falseFoundational.length) {
      failures.push(
        `QA false foundational=grades1–6 claim (${falseFoundational.length} pattern(s))`
      );
    }
  }
  if (id === "ar-OM") {
    if (/الصفوف من 1 إلى 6 هي الحلقة الأولى/.test(about)) {
      failures.push("OM maps all 1–6 to Cycle 1 alone");
    }
  }
  if (id === "ar-BH") {
    if (/التعليم الأساسي.*(ينتهي|ينتهي عند).*الصف السادس|grades?\s*1[–-]6\s*=\s*Cycle\s*1/i.test(about)) {
      failures.push("BH false basic-education / Cycle1 claim");
    }
  }

  const nsParity = probeNamespaceParity(id);
  const catParity = probeCatalogParity(id);
  const seoParity = probeSeoParity(id);
  failures.push(...nsParity.failures.map((f) => `ns:${f}`));
  if (catParity.missing.length || catParity.stale.length) {
    failures.push(`catalog missing=${catParity.missing.length} stale=${catParity.stale.length}`);
  }
  if (seoParity.missing.length) {
    failures.push(`seo missing=${seoParity.missing.join(",")}`);
  }

  const uiSamples = [
    g6,
    classLabel,
    gradeField,
    student,
    practice?.h1,
    guide?.h1,
    helpSections?.parents?.title,
    helpSections?.students?.title,
    helpSections?.subjects?.title,
  ]
    .filter(Boolean)
    .map(String);
  const hebrew = uiSamples.filter((s) => HEBREW_RE.test(s));
  const forbiddenEn = collectForbiddenEnglishUi(uiSamples);
  if (forbiddenEn.length) {
    failures.push(`forbidden English UI: ${forbiddenEn.join(" | ")}`);
  }

  return {
    localeId: id,
    rtl: isRtlLocale(id) && resolveDirection(id) === "rtl",
    chain: getLocaleFallbackChain(id),
    publicHome: withLocalePath(id, "/"),
    helpLocale: resolveHelpLocale(id),
    helpLocaleOk: resolveHelpLocale(id) === helpLocale,
    grade6: g6,
    classLabel,
    student: student ?? null,
    gradeField: gradeField ?? null,
    helpParentsCount: helpParents.length,
    practiceH1: practice?.h1 ?? null,
    catalogParity: catParity,
    seoParity,
    namespaceParityOk: nsParity.failures.length === 0,
    catalogParityOk: catParity.missing.length === 0 && catParity.stale.length === 0,
    seoParityOk: seoParity.missing.length === 0,
    hebrewLeakage: hebrew.length,
    forbiddenEnglishUi: forbiddenEn.length,
    countryFailures: failures,
  };
}

function runWave3Probes() {
const selectorBeforeNote = 84;
const selectorAfter = getSelectableLocales().length;
const { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale } =
  loadSwHelpers();

const swFailures = [];
for (const c of LOCALES) {
  if (offlineFallbackPath(c.id) !== `/${c.prefix}/offline`) {
    swFailures.push(`${c.id} offline ${offlineFallbackPath(c.id)}`);
  }
  if (LOCALE_PUBLIC_PATH_PREFIX[c.id] !== c.prefix) {
    swFailures.push(`${c.id} map ${LOCALE_PUBLIC_PATH_PREFIX[c.id]}`);
  }
}
const regressions = {
  "ar-IQ": "/iq/offline",
  "ar-JO": "/jo/offline",
  "ar-AE": "/ae/offline",
  "ar-TN": "/tn/offline",
  "ar-EG": "/eg/offline",
  "ar-SA": "/sa/offline",
  "ar-MA": "/ma/offline",
  "ar-DZ": "/dz/offline",
  "ar-001": "/ar-001/offline",
  "es-AR": "/ar/offline",
  en: "/offline",
};
for (const [id, want] of Object.entries(regressions)) {
  if (offlineFallbackPath(id) !== want) swFailures.push(`regression ${id}=${offlineFallbackPath(id)}`);
}
if (isArabicOfflineUiLocale("es-AR") !== false) swFailures.push("es-AR arabic UI");

let swMapMismatch = 0;
for (const [id, def] of Object.entries(LOCALE_REGISTRY)) {
  if (!def?.enabled || id === "en") continue;
  const prefix = getPublicLocalePathPrefix(id);
  if (!prefix) continue;
  if (LOCALE_PUBLIC_PATH_PREFIX[id] !== prefix) swMapMismatch += 1;
}

const qatarCarveOut = {
  qatarLocalePathsShowSwitcher: ["/qa", "/qa/", "/qa/parents", "/qa/practice/math"].every(
    (p) => shouldShowLayoutLanguageSwitcher(p) === true
  ),
  toolsQaHidden: shouldShowLayoutLanguageSwitcher("/tools/qa") === false,
  toolsQaNestedHidden: shouldShowLayoutLanguageSwitcher("/tools/qa/x") === false,
  isQatarPath: isQatarPublicLocalePath("/qa/student/home") === true,
  toolsNotQatar: isQatarPublicLocalePath("/tools/qa") === false,
  toolsIsInternal: isInternalQaToolingPath("/tools/qa") === true,
  qatarNotInternal: isInternalQaToolingPath("/qa/parents") === false,
};

const results = {
  generatedAt: new Date().toISOString(),
  phase: "arabic-country-wave-3-wiring",
  selectorCountBefore: selectorBeforeNote,
  selectorCountAfter: selectorAfter,
  locales: {},
  qatarCarveOut,
  sw: {
    failures: swFailures,
    mapMismatch: swMapMismatch,
    wave3: Object.fromEntries(LOCALES.map((c) => [c.id, offlineFallbackPath(c.id)])),
    regressions,
    argentinaArabicUi: isArabicOfflineUiLocale("es-AR"),
  },
  summary: {
    rtlAll: true,
    hebrewLeakage: 0,
    forbiddenEnglishUi: 0,
    helpLocaleAllOk: true,
    namespaceParityAllOk: true,
    catalogParityAllOk: true,
    seoParityAllOk: true,
    countryChecksOk: true,
    swOk: swFailures.length === 0 && swMapMismatch === 0,
    qatarCarveOutOk: Object.values(qatarCarveOut).every(Boolean),
  },
};

for (const c of LOCALES) {
  const r = probe(c);
  results.locales[c.id] = r;
  if (!r.rtl) results.summary.rtlAll = false;
  results.summary.hebrewLeakage += r.hebrewLeakage;
  results.summary.forbiddenEnglishUi += r.forbiddenEnglishUi;
  if (!r.helpLocaleOk) results.summary.helpLocaleAllOk = false;
  if (!r.namespaceParityOk) results.summary.namespaceParityAllOk = false;
  if (!r.catalogParityOk) results.summary.catalogParityAllOk = false;
  if (!r.seoParityOk) results.summary.seoParityAllOk = false;
  if (r.countryFailures.length) results.summary.countryChecksOk = false;
}

const tnMath = getPracticePageContentForLocale("ar-TN", "math");
results.wave2Regression = {
  tunisiaMathH1: tnMath?.h1 ?? null,
  tunisiaUsesYear: String(tnMath?.h1 || "").includes("السنة"),
};

results.pass =
  results.summary.rtlAll &&
  results.summary.hebrewLeakage === 0 &&
  results.summary.forbiddenEnglishUi === 0 &&
  results.summary.helpLocaleAllOk &&
  results.summary.namespaceParityAllOk &&
  results.summary.catalogParityAllOk &&
  results.summary.seoParityAllOk &&
  results.summary.countryChecksOk &&
  results.summary.swOk &&
  results.summary.qatarCarveOutOk &&
  results.wave2Regression.tunisiaUsesYear &&
  Object.values(results.locales).every((r) => r.helpParentsCount > 0) &&
  selectorAfter === 88;

fs.writeFileSync(OUT, `${JSON.stringify(results, null, 2)}\n`, "utf8");
console.log(JSON.stringify(results, null, 2));
console.log(results.pass ? "WAVE3 PROBES PASS" : "WAVE3 PROBES FAIL");
return results;
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);
if (isMain) {
  const results = runWave3Probes();
  process.exit(results.pass ? 0 : 1);
}
