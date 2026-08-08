/**
 * Focused runtime probes for Arabic Country Wave 2 wiring.
 * Catches "file on disk but runtime ignores it".
 * Run: node docs/reports/_arabic-country-wave-2-runtime-probes.mjs
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
import { loadContentPack } from "../../lib/content/locale.server.js";
import {
  resolveHelpLocale,
  listArticles,
  getHelpSections,
} from "../../data/help-center/index.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
  getWorksheetsPageContentForLocale,
  getMarketingLandingContentForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import { getClientPublicSeoOverlay } from "../../lib/seo/public-seo-ar-001-client-index.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";
import { burnDownCopyForLocale } from "../../lib/learning/burn-down-copy.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "docs/reports/arabic-country-wave-2-runtime-probes.json");

const HEBREW_RE = /[\u0590-\u05FF]/;
const ARABIC_RE = /[\u0600-\u06FF]/;
const FORBIDDEN_EN_UI = /\b(Home|Dashboard|Worksheets|Parents|Teachers|School)\b/;

const LOCALES = [
  {
    id: "ar-IQ",
    prefix: "iq",
    helpLocale: "ar-IQ",
    grade6: "الصف السادس",
    classLabel: "شعبة",
  },
  {
    id: "ar-JO",
    prefix: "jo",
    helpLocale: "ar-JO",
    grade6: "الصف السادس",
    classLabel: "شعبة",
    student: "طالب",
  },
  {
    id: "ar-AE",
    prefix: "ae",
    helpLocale: "ar-AE",
    grade6: "الصف السادس",
    classLabelIncludes: "الشعبة",
  },
  {
    id: "ar-TN",
    prefix: "tn",
    helpLocale: "ar-TN",
    grade6: "السنة السادسة",
    classLabel: "قسم",
    gradeWord: "السنة",
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
  const ar001 = loadLocaleBundles("ar-001");
  const ns = diskNamespaces(localeId);
  const failures = [];
  for (const name of ns) {
    if (!bundles[name]) {
      failures.push(`missing bundle ${name}`);
      continue;
    }
    const disk = JSON.parse(
      fs.readFileSync(path.join(ROOT, "locales", localeId, `${name}.json`), "utf8")
    );
    const stack = [{ obj: disk, prefix: name }];
    while (stack.length) {
      const { obj, prefix } = stack.pop();
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) continue;
      for (const [k, v] of Object.entries(obj)) {
        const key = `${prefix}.${k}`;
        if (typeof v === "string") {
          if (lookupMessage(bundles, key) !== v) failures.push(`${key}: disk≠runtime`);
          const base = lookupMessage(ar001, key);
          if (base != null && base !== v && lookupMessage(bundles, key) === base) {
            failures.push(`${key}: still ar-001`);
          }
        } else if (v && typeof v === "object" && !Array.isArray(v)) {
          stack.push({ obj: v, prefix: key });
        }
      }
    }
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

function probe(localeSpec) {
  const { id, helpLocale, grade6 } = localeSpec;
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(id);
  const g6 = lookupMessage(bundles, "common.grade6");
  const classLabel = lookupMessage(bundles, "school.portal.classLabel");
  const student =
    lookupMessage(bundles, "learning.master.defaultPlayerName") ||
    lookupMessage(bundles, "auth.studentLoginTitle");
  const gradeField = lookupMessage(bundles, "worksheets.gradeField");
  const about = JSON.stringify(bundles.ui?.public?.about || {});

  const worksheets = getWorksheetsPageContentForLocale(id);
  const practice = getPracticePageContentForLocale(id, "math");
  const seoGuide = getGuidePageContentForLocale(id, "math-practice-at-home");
  const marketing = getMarketingLandingContentForLocale(id, "parents");
  const helpParents = listArticles("parents", id);
  const helpSections = getHelpSections(id);
  const demo = loadContentPack(id, "demo", "ui.json");
  const reportGrade = reportPackCopyForLocale(
    id,
    "components__parent-report-detailed-surface",
    "grade"
  );

  const samples = [
    g6,
    classLabel,
    student,
    worksheets?.h1,
    practice?.h1,
    seoGuide?.h1,
    marketing?.h1 || marketing?.title,
    helpSections?.parents?.title,
    reportGrade,
    demo?.bar?.gradeLabel || demo?.grades?.g6,
  ]
    .filter(Boolean)
    .map(String);

  const hebrew = samples.filter((s) => HEBREW_RE.test(s));
  const forbiddenEn = samples.filter((s) => FORBIDDEN_EN_UI.test(s) && !ARABIC_RE.test(s));
  const nsParity = probeNamespaceParity(id);
  const catParity = probeCatalogParity(id);

  const failures = [];
  if (g6 !== grade6) failures.push(`grade6 want ${grade6} got ${g6}`);
  if (localeSpec.classLabel && classLabel !== localeSpec.classLabel) {
    failures.push(`classLabel want ${localeSpec.classLabel} got ${classLabel}`);
  }
  if (localeSpec.classLabelIncludes && !String(classLabel || "").includes(localeSpec.classLabelIncludes)) {
    failures.push(`classLabel missing ${localeSpec.classLabelIncludes}: ${classLabel}`);
  }
  if (localeSpec.student && !String(student || "").includes(localeSpec.student)) {
    failures.push(`student role missing ${localeSpec.student}: ${student}`);
  }
  if (localeSpec.gradeWord && gradeField !== localeSpec.gradeWord) {
    failures.push(`gradeField want ${localeSpec.gradeWord} got ${gradeField}`);
  }
  if (id === "ar-IQ") {
    const mathStep1 = lookupMessage(bundles, "learning.math.howToLearnSteps.step1");
    const geoStep1 = lookupMessage(bundles, "learning.geometry.howToLearnSteps.step1");
    const aboveGrade = lookupMessage(
      bundles,
      "copilot.answers.utils_parent-copilot_intent-answer-composers.according_to_the_report_there_is_still_insufficient_evidence_for"
    );
    if (!String(mathStep1 || "").includes("الصف") || String(mathStep1 || "").includes("اختر الدرجة")) {
      failures.push(`ar-IQ math step1 want الصف not الدرجة: ${mathStep1}`);
    }
    if (!String(geoStep1 || "").includes("الصف") || String(geoStep1 || "").includes("اختر الدرجة")) {
      failures.push(`ar-IQ geometry step1 want الصف not الدرجة: ${geoStep1}`);
    }
    if (
      !String(aboveGrade || "").includes("الصف المذكور") ||
      String(aboveGrade || "").includes("الدرجة المذكورة")
    ) {
      failures.push(`ar-IQ copilot above-grade want الصف المذكور: ${aboveGrade}`);
    }

    const diskPublicSeo = walkPackJson(
      path.join(ROOT, "content-packs", id, "public-seo"),
      path.join(ROOT, "content-packs", id, "public-seo")
    );
    for (const rel of diskPublicSeo) {
      const overlay = getClientPublicSeoOverlay(id, ...rel.split("/"));
      if (!overlay) {
        failures.push(`ar-IQ public-seo disk pack missing from runtime index: ${rel}`);
      }
    }

    const practiceMath = getPracticePageContentForLocale(id, "math");
    const practiceReading = getPracticePageContentForLocale(id, "reading");
    const guide = getGuidePageContentForLocale(id, "math-practice-at-home");
    for (const [label, text] of [
      ["practice math", JSON.stringify(practiceMath)],
      ["practice reading", JSON.stringify(practiceReading)],
      ["guide math-practice-at-home", JSON.stringify(guide)],
    ]) {
      if (/اختر الدرجة|حسب الدرجة|فوق الدرجة/.test(text)) {
        failures.push(`ar-IQ ${label} still has academic درجة`);
      }
    }

    const WORD_BANDS = [
      "الصفان الأول والثاني",
      "الصفان الثالث والرابع",
      "الصفان الخامس والسادس",
    ];
    const NUMERIC_GRADE_RE =
      /الصفوف\s*[0-9٠-٩]+|الصفوف\s*[1-6]\s*[–-]\s*[1-6]|الصفوف\s*1\s*[–-]\s*6|الصف\s+[1-6]/g;

    function collectGradeBandTitles(obj) {
      const out = [];
      (function walk(o) {
        if (!o || typeof o !== "object") return;
        if (Array.isArray(o.gradeSections)) {
          for (const g of o.gradeSections) {
            if (g?.title) out.push(String(g.title));
          }
        }
        for (const v of Object.values(o)) {
          if (v && typeof v === "object") walk(v);
        }
      })(obj);
      return out;
    }

    const bandSlugs = ["math", "english", "reading", "geometry", "science", "games", "no-print"];
    for (const slug of bandSlugs) {
      const page = getPracticePageContentForLocale(id, slug);
      if (!getClientPublicSeoOverlay(id, "practice", `${slug}.json`)) {
        failures.push(`ar-IQ practice/${slug}.json not in runtime SEO index`);
      }
      const bands = collectGradeBandTitles(page);
      if (bands.length === 0) {
        // overlays without gradeSections still must not show numeric bands in blob
      } else {
        for (const want of WORD_BANDS) {
          if (!bands.includes(want)) {
            failures.push(`ar-IQ practice ${slug} missing word-form band: ${want}`);
          }
        }
      }
      const blob = JSON.stringify(page || {});
      for (const want of WORD_BANDS) {
        if (!blob.includes(want)) {
          failures.push(`ar-IQ practice ${slug} runtime blob missing ${want}`);
        }
      }
      const numericHits = blob.match(NUMERIC_GRADE_RE) || [];
      if (numericHits.length) {
        failures.push(`ar-IQ practice ${slug} numeric grade bands: ${numericHits.join(" | ")}`);
      }
    }

    const hub = getPracticePageContentForLocale(id, "hub");
    const hubBlob = JSON.stringify(hub || {});
    if (!getClientPublicSeoOverlay(id, "practice", "hub.json")) {
      failures.push("ar-IQ practice/hub.json not in runtime SEO index");
    }
    if (!/للصفوف الأول/.test(hubBlob) && !/الأول إلى السادس/.test(hubBlob) && !/الأول–السادس/.test(hubBlob)) {
      failures.push("ar-IQ hub missing word-form grade range");
    }
    if (/للصفوف\s*1\s*[–-]\s*6/.test(hubBlob) || /للصفوف\s*[1-6]\s*[–-]\s*[1-6]/.test(hubBlob)) {
      failures.push("ar-IQ hub still has numeric grade range");
    }
    const hubNumeric = hubBlob.match(NUMERIC_GRADE_RE) || [];
    if (hubNumeric.length) {
      failures.push(`ar-IQ hub numeric grade bands: ${hubNumeric.join(" | ")}`);
    }

    const nextStep = burnDownCopyForLocale(
      id,
      "utils__topic-next-step-engine",
      "move_up_a_grade_same_topic_only"
    );
    if (!String(nextStep).includes("صف")) {
      failures.push(`ar-IQ learning topic-next-step not effective: ${nextStep}`);
    }
    if (/درجة/.test(String(nextStep))) {
      failures.push(`ar-IQ learning topic-next-step still uses درجة: ${nextStep}`);
    }
    if (!getCatalogPackExact(id, "learning/burn-down/utils__topic-next-step-engine.json")) {
      failures.push("ar-IQ learning topic-next-step not in catalog");
    }
  }

  if (id === "ar-AE") {
    if (/الصفوف من 1 إلى 6 هي الحلقة الأولى/.test(about)) {
      failures.push("UAE about maps all 1–6 to Cycle 1 alone");
    }
    if (!/الحلقة الأولى/.test(about) || !/الحلقة الثانية/.test(about)) {
      failures.push("UAE about missing Cycle 1/2 wording");
    }
  }

  if (id === "ar-TN") {
    const mathH1 = String(practice?.h1 || "");
    if (!mathH1.includes("السنة")) {
      failures.push(`ar-TN practice math H1 missing السنة: ${mathH1}`);
    }
    if (mathH1.includes("حسب الصف")) {
      failures.push(`ar-TN practice math H1 contains حسب الصف: ${mathH1}`);
    }

    const geometry = getPracticePageContentForLocale(id, "geometry");
    const geometryH1 = String(geometry?.h1 || "");
    if (!geometryH1.includes("السنة")) {
      failures.push(`ar-TN practice geometry H1 missing السنة: ${geometryH1}`);
    }

    const schools = getMarketingLandingContentForLocale(id, "schools");
    const schoolsBadge = String(schools?.badge || "");
    if (!schoolsBadge.includes("أقسام")) {
      failures.push(`ar-TN schools marketing overlay not effective: ${schoolsBadge}`);
    }

    const diskPublicSeo = walkPackJson(
      path.join(ROOT, "content-packs", id, "public-seo"),
      path.join(ROOT, "content-packs", id, "public-seo")
    );
    for (const rel of diskPublicSeo) {
      const parts = rel.split("/");
      const overlay = getClientPublicSeoOverlay(id, ...parts);
      if (!overlay) {
        failures.push(`ar-TN public-seo disk pack missing from runtime index: ${rel}`);
      }
    }

    const curriculumSlug = "components__parent__ParentCurriculumContent";
    const catalogLeaf = getCatalogPackExact(
      id,
      `learning/burn-down/${curriculumSlug}.json`
    );
    if (!catalogLeaf) {
      failures.push("ar-TN learning ParentCurriculumContent not in catalog");
    }
    const topicsByGrade = burnDownCopyForLocale(id, curriculumSlug, "topics_by_grade");
    if (!String(topicsByGrade).includes("السنة")) {
      failures.push(`ar-TN learning topics_by_grade missing السنة: ${topicsByGrade}`);
    }
    if (/حسب الصف|اختر الصف/.test(String(topicsByGrade))) {
      failures.push(`ar-TN learning curriculum still uses صف: ${topicsByGrade}`);
    }
    const sixGrades = burnDownCopyForLocale(id, curriculumSlug, "six_grades");
    if (!String(sixGrades).includes("سنوات")) {
      failures.push(`ar-TN learning six_grades overlay not effective: ${sixGrades}`);
    }
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
    worksheetsH1: worksheets?.h1 ?? null,
    practiceH1: practice?.h1 ?? null,
    seoGuideH1: seoGuide?.h1 ?? null,
    reportGrade: reportGrade ?? null,
    hebrewLeakage: hebrew.length,
    forbiddenEnglishUi: forbiddenEn.length,
    namespaceParityOk: nsParity.failures.length === 0,
    namespaceParityFailures: nsParity.failures,
    catalogParity: catParity,
    catalogParityOk: catParity.missing.length === 0 && catParity.stale.length === 0,
    countryFailures: failures,
  };
}

/**
 * Wave 2 membership/invariants — independent of total selector count after Wave 3+.
 * @param {Array<{id:string,pathPrefix?:string,selectorVisible?:boolean}>} selectable
 * @param {typeof LOCALE_REGISTRY} registry
 * @param {(id:string)=>string|null|undefined} getPrefix
 * @param {(id:string)=>string[]} getChain
 * @returns {{ failures: string[], checks: Record<string, boolean>, currentSelectorTotal: number }}
 */
export function probeWave2LocaleMembership(
  selectable,
  registry = LOCALE_REGISTRY,
  getPrefix = getPublicLocalePathPrefix,
  getChain = getLocaleFallbackChain
) {
  const WAVE2 = [
    { id: "ar-IQ", prefix: "iq" },
    { id: "ar-JO", prefix: "jo" },
    { id: "ar-AE", prefix: "ae" },
    { id: "ar-TN", prefix: "tn" },
  ];
  const list = Array.isArray(selectable) ? selectable : [];
  /** @type {string[]} */
  const failures = [];
  /** @type {Record<string, boolean>} */
  const checks = {};
  for (const c of WAVE2) {
    const hit = list.find((l) => l && l.id === c.id);
    const def = registry?.[c.id];
    const selectableOk = Boolean(hit);
    const enabledOk = def?.enabled === true;
    const visibleOk = def?.selectorVisible !== false;
    const prefixOk = getPrefix(c.id) === c.prefix;
    const chain = getChain(c.id);
    const chainOk =
      Array.isArray(chain) &&
      chain.length === 3 &&
      chain[0] === c.id &&
      chain[1] === "ar-001" &&
      chain[2] === "en";
    checks[`${c.id}.selectable`] = selectableOk;
    checks[`${c.id}.enabled`] = enabledOk;
    checks[`${c.id}.selectorVisible`] = visibleOk;
    checks[`${c.id}.path`] = prefixOk;
    checks[`${c.id}.fallback`] = chainOk;
    if (!selectableOk) failures.push(`Wave2 missing selectable ${c.id}`);
    if (!enabledOk) failures.push(`Wave2 ${c.id} not enabled`);
    if (!visibleOk) failures.push(`Wave2 ${c.id} selectorVisible false`);
    if (!prefixOk) failures.push(`Wave2 ${c.id} path want /${c.prefix}`);
    if (!chainOk) failures.push(`Wave2 ${c.id} fallback want ${c.id}→ar-001→en got ${chain}`);
  }
  return { failures, checks, currentSelectorTotal: list.length };
}

function runWave2Probes() {
const selectorBeforeNote = 80;
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
  "ar-EG": "/eg/offline",
  "ar-SA": "/sa/offline",
  "ar-MA": "/ma/offline",
  "ar-DZ": "/dz/offline",
  "ar-001": "/ar-001/offline",
  "es-AR": "/ar/offline",
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

const wave2Membership = probeWave2LocaleMembership(getSelectableLocales());

const results = {
  generatedAt: new Date().toISOString(),
  phase: "arabic-country-wave-2-wiring",
  selectorCountBefore: selectorBeforeNote,
  selectorCountAfter: selectorAfter,
  currentSelectorTotal: wave2Membership.currentSelectorTotal,
  wave2Membership,
  locales: {},
  sw: {
    failures: swFailures,
    mapMismatch: swMapMismatch,
    wave2: Object.fromEntries(LOCALES.map((c) => [c.id, offlineFallbackPath(c.id)])),
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
    countryChecksOk: true,
    swOk: swFailures.length === 0 && swMapMismatch === 0,
    wave2MembershipOk: wave2Membership.failures.length === 0,
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
  if (r.countryFailures.length) results.summary.countryChecksOk = false;
}

results.pass =
  results.summary.rtlAll &&
  results.summary.hebrewLeakage === 0 &&
  results.summary.forbiddenEnglishUi === 0 &&
  results.summary.helpLocaleAllOk &&
  results.summary.namespaceParityAllOk &&
  results.summary.catalogParityAllOk &&
  results.summary.countryChecksOk &&
  results.summary.swOk &&
  results.summary.wave2MembershipOk &&
  Object.values(results.locales).every((r) => r.helpParentsCount > 0);

fs.writeFileSync(OUT, `${JSON.stringify(results, null, 2)}\n`, "utf8");
console.log(JSON.stringify(results, null, 2));
console.log(results.pass ? "WAVE2 PROBES PASS" : "WAVE2 PROBES FAIL");
if (!results.pass) {
  for (const [id, r] of Object.entries(results.locales)) {
    if (r.countryFailures?.length) console.error(id, r.countryFailures);
    if (r.namespaceParityFailures?.length) console.error(id, "ns", r.namespaceParityFailures.slice(0, 5));
  }
  if (swFailures.length) console.error("sw", swFailures);
  if (wave2Membership.failures.length) console.error("wave2Membership", wave2Membership.failures);
}
return results;
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);
if (isMain) {
  const results = runWave2Probes();
  process.exit(results.pass ? 0 : 1);
}
