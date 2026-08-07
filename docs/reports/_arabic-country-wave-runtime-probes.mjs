/**
 * Focused runtime probes for Arabic country wave — post-audit wiring parity.
 * Catches "file on disk but runtime ignores it" for namespaces, Help, and packs.
 * Run: node docs/reports/_arabic-country-wave-runtime-probes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getSelectableLocales,
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
  getArticle,
} from "../../data/help-center/index.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
  getWorksheetsPageContentForLocale,
  getMarketingLandingContentForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";
import {
  bindGlobalBurnDownLocale,
  globalBurnDownCopyForLocale,
} from "../../lib/i18n/global-burn-down-copy.js";
import { formatGradeLevelHe } from "../../lib/teacher-portal/teacher-class-grade.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "docs/reports/arabic-country-wave-runtime-probes.json");

const HEBREW_RE = /[\u0590-\u05FF]/;
const ARABIC_RE = /[\u0600-\u06FF]/;
const FORBIDDEN_EN_UI = /\b(Home|Dashboard|Worksheets|Parents|Teachers|School)\b/;

const LOCALES = [
  { id: "ar-EG", prefix: "eg", helpLocale: "ar-EG", grade6: "الصف السادس" },
  { id: "ar-SA", prefix: "sa", helpLocale: "ar-SA", grade6: "الصف السادس" },
  { id: "ar-MA", prefix: "ma", helpLocale: "ar-MA", grade6: "السنة السادسة" },
  { id: "ar-DZ", prefix: "dz", helpLocale: "ar-DZ", grade6: "السنة 1 متوسط" },
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
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

function assertContains(hay, needle, label, failures) {
  if (!String(hay || "").includes(needle)) {
    failures.push(`${label}: expected to include «${needle}» got «${String(hay || "").slice(0, 80)}»`);
  }
}

function assertNotContains(hay, needle, label, failures) {
  if (String(hay || "").includes(needle)) {
    failures.push(`${label}: must not include «${needle}»`);
  }
}

function probeNamespaceParity(localeId) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(localeId);
  const ar001 = loadLocaleBundles("ar-001");
  const ns = diskNamespaces(localeId);
  const failures = [];
  for (const name of ns) {
    if (!bundles[name]) {
      failures.push(`missing bundle namespace ${name}`);
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
          const effective = lookupMessage(bundles, key);
          if (effective !== v) {
            failures.push(`${key}: disk≠runtime`);
          }
          const base = lookupMessage(ar001, key);
          if (base != null && base !== v && effective === base) {
            failures.push(`${key}: still ar-001 (loader miss)`);
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
  const missing = disk.filter((p) => !catalog.includes(p));
  const stale = catalog.filter((p) => !disk.includes(p));
  return { diskCount: disk.length, catalogCount: catalog.length, missing, stale };
}

function probeEgyptAudit(failures) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-EG");
  const mathStep1 = lookupMessage(bundles, "learning.math.howToLearnSteps.step1");
  const geoStep1 = lookupMessage(bundles, "learning.geometry.howToLearnSteps.step1");
  const noTopics = lookupMessage(bundles, "learning.geometry.errors.noTopics");
  const above =
    lookupMessage(
      bundles,
      "copilot.answers.utils_parent-copilot_intent-answer-composers.according_to_the_report_there_is_still_insufficient_evidence_for"
    );
  assertContains(mathStep1, "الصف", "EG math step1", failures);
  assertNotContains(mathStep1, "الدرجة", "EG math step1", failures);
  assertContains(geoStep1, "الصف", "EG geometry step1", failures);
  assertNotContains(geoStep1, "الدرجة", "EG geometry step1", failures);
  assertContains(noTopics, "صف آخر", "EG geometry noTopics", failures);
  assertContains(above, "الصف المذكور", "EG copilot above-grade", failures);
  assertNotContains(above, "الدرجة", "EG copilot above-grade", failures);

  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = getArticle("subjects", slug, "ar-EG");
    const text = JSON.stringify(article || {});
    assertContains(text, "الصف", `EG help subject ${slug}`, failures);
    assertNotContains(text, "اختر الدرجة", `EG help subject ${slug}`, failures);
  }
  const parent = getArticle("parents", "edit-or-delete-student", "ar-EG");
  assertContains(parent?.summary, "الصف", "EG help edit-or-delete summary", failures);
  assertNotContains(parent?.summary, "الدرجة", "EG help edit-or-delete summary", failures);

  return {
    mathStep1,
    geoStep1,
    noTopics,
    aboveGrade: above,
    helpEditSummary: parent?.summary ?? null,
  };
}

function probeSaudiAudit(failures) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-SA");
  const gradeRequired = lookupMessage(bundles, "learning.master.gradeRequired");
  const classesSubtitle = lookupMessage(bundles, "school.portal.classesSubtitle");
  const rebuild = lookupMessage(
    bundles,
    "copilot.answers.lib_parent-copilot_copilot-turn-payload.server.could_not_verify_student_ownership_for_copilot_rebuild"
  );
  assertContains(gradeRequired, "صفك", "SA gradeRequired", failures);
  assertContains(classesSubtitle, "الصف والفصل والمادة", "SA classesSubtitle", failures);
  assertContains(rebuild, "مساعد الطيار", "SA copilot rebuild chrome", failures);
  return { gradeRequired, classesSubtitle, rebuild };
}

function probeMoroccoAudit(failures) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-MA");
  const classLabel = lookupMessage(bundles, "school.portal.classLabel");
  const colGrade = lookupMessage(bundles, "school.portal.colGrade");
  const physical = lookupMessage(bundles, "validation.api.physical_class_not_found");
  const peer = lookupMessage(bundles, "copilot.boundary.peerComparison");
  const audit = lookupMessage(bundles, "platform.auditActions.school_class_viewed");
  const gradeCopy = lookupMessage(
    bundles,
    "copilot.answers.utils_parent-copilot_intent-answer-composers.according_to_the_report_there_is_still_insufficient_evidence_for"
  );
  assertContains(classLabel, "قسم", "MA classLabel", failures);
  assertContains(colGrade, "السنة", "MA colGrade", failures);
  assertContains(physical, "قسم", "MA physical_class_not_found", failures);
  assertContains(peer, "القسم", "MA peerComparison", failures);
  assertContains(audit, "القسم", "MA audit school_class_viewed", failures);
  assertContains(gradeCopy, "السنة", "MA copilot grade copy", failures);

  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = getArticle("subjects", slug, "ar-MA");
    const text = JSON.stringify(article || {});
    assertContains(text, "السنة", `MA help subject ${slug}`, failures);
    assertContains(text, "مستوى", `MA help subject ${slug} difficulty`, failures);
    assertNotContains(text, "اختر الدرجة", `MA help subject ${slug}`, failures);
  }

  return { classLabel, colGrade, physical, peer, audit, gradeCopy };
}

function probeAlgeriaAudit(failures) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-DZ");
  const g6 = lookupMessage(bundles, "common.grade6");
  const teacherRole = lookupMessage(bundles, "platform.roles.teacher");
  const classLabel = lookupMessage(bundles, "school.portal.classLabel");
  const peer = lookupMessage(bundles, "copilot.boundary.peerComparison");
  const authTitle = lookupMessage(bundles, "auth.teacherLoginTitle");
  assertEqualish(g6, "السنة 1 متوسط", "DZ grade6", failures);
  assertNotContains(g6, "السنة 6", "DZ grade6", failures);
  assertContains(teacherRole, "أستاذ", "DZ teacher role", failures);
  assertContains(classLabel, "قسم", "DZ classLabel", failures);
  assertContains(peer, "القسم", "DZ peerComparison", failures);
  assertContains(authTitle, "أستاذ", "DZ auth teacherLoginTitle", failures);
  return { grade6: g6, teacherRole, classLabel, peer, authTitle };
}

function assertEqualish(actual, expected, label, failures) {
  if (actual !== expected) {
    failures.push(`${label}: expected «${expected}» got «${actual}»`);
  }
}

function loadSwOfflineFallbackPath() {
  const sw = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
  const start = sw.indexOf("const LOCALE_PUBLIC_PATH_PREFIX");
  const end = sw.indexOf("const REWARD_CARD_PATH_PREFIX");
  if (start < 0 || end <= start) {
    throw new Error("Could not extract SW offline helpers");
  }
  const fnSrc = sw.slice(start, end);
  // eslint-disable-next-line no-new-func
  return new Function(
    `${fnSrc}\nreturn { offlineFallbackPath, isArabicOfflineUiLocale };`
  )();
}

function probeF1F2(failures) {
  const sw = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
  if (!sw.includes("offlineFallbackPath(loc)")) {
    failures.push("F1: offlineInlineFallbackHtml must use offlineFallbackPath(loc)");
  }
  if (!sw.includes("const LOCALE_PUBLIC_PATH_PREFIX")) {
    failures.push("F1-R1: LOCALE_PUBLIC_PATH_PREFIX map missing from public/sw.js");
  }

  let offlineFallbackPath;
  let isArabicOfflineUiLocale;
  try {
    ({ offlineFallbackPath, isArabicOfflineUiLocale } = loadSwOfflineFallbackPath());
  } catch (err) {
    failures.push(`F1-R1: failed to eval SW helpers: ${err.message}`);
    return { offlinePaths: {}, argentina: null, grade6: {}, swHelperEval: false };
  }

  const expected = {
    "es-AR": "/ar/offline",
    "ar-EG": "/eg/offline",
    "ar-SA": "/sa/offline",
    "ar-MA": "/ma/offline",
    "ar-DZ": "/dz/offline",
    "ar-001": "/ar-001/offline",
  };
  // Must evaluate actual SW offlineFallbackPath — not withLocalePath alone (false PASS risk).
  for (const [loc, pathExpected] of Object.entries(expected)) {
    const swPath = offlineFallbackPath(loc);
    if (swPath !== pathExpected) {
      failures.push(`F1-R1 SW offlineFallbackPath(${loc})=${swPath} want ${pathExpected}`);
    }
    // Registry routing may still be asserted for Arabic countries; Argentina SW is authoritative here.
    if (loc !== "es-AR") {
      const routed = withLocalePath(loc, "/offline");
      if (routed !== pathExpected) {
        failures.push(`F1 withLocalePath(${loc},/offline)=${routed} want ${pathExpected}`);
      }
    }
  }

  if (offlineFallbackPath("es-AR") === "/es-AR/offline") {
    failures.push("F1-R1: SW still returns /es-AR/offline (locale-id path leak)");
  }
  if (isArabicOfflineUiLocale("es-AR") !== false) {
    failures.push("F1-R1: isArabicOfflineUiLocale(es-AR) must be false");
  }
  if (isArabicOfflineUiLocale("ar-EG") !== true) {
    failures.push("F1: isArabicOfflineUiLocale(ar-EG) must be true");
  }

  // F2 call-time grades
  const expectedG6 = {
    en: "Grade 6",
    "ar-EG": "الصف السادس",
    "ar-SA": "الصف السادس",
    "ar-MA": "السنة السادسة",
    "ar-DZ": "السنة 1 متوسط",
  };
  for (const [loc, want] of Object.entries(expectedG6)) {
    const viaPack = globalBurnDownCopyForLocale(loc, "lib__teacher-portal__teacher-class-grade", "grade_6");
    if (viaPack !== want) failures.push(`F2 pack ${loc}: ${viaPack} want ${want}`);
    bindGlobalBurnDownLocale(loc);
    const viaFmt = formatGradeLevelHe("g6");
    if (viaFmt !== want) failures.push(`F2 formatGradeLevelHe ${loc}: ${viaFmt} want ${want}`);
  }
  return {
    offlinePaths: expected,
    argentina: offlineFallbackPath("es-AR"),
    argentinaWithLocalePath: withLocalePath("es-AR", "/offline"),
    swHelperEval: true,
    grade6: expectedG6,
  };
}

function probe(localeId, helpLocale, grade6) {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(localeId);
  const grade1 = lookupMessage(bundles, "common.grade1");
  const g6 = lookupMessage(bundles, "common.grade6");
  const schoolNav =
    lookupMessage(bundles, "school.portal.navDashboard") ||
    lookupMessage(bundles, "school.nav.dashboard");
  const teacher =
    lookupMessage(bundles, "teacher.dashboard.title") ||
    lookupMessage(bundles, "teacher.nav.dashboard");
  const parent =
    lookupMessage(bundles, "ui.parent.homeTitle") ||
    lookupMessage(bundles, "common.parent");

  const worksheets = getWorksheetsPageContentForLocale(localeId);
  const practice = getPracticePageContentForLocale(localeId, "math");
  const seoGuide = getGuidePageContentForLocale(localeId, "math-practice-at-home");
  const marketing = getMarketingLandingContentForLocale(localeId, "parents");
  const helpParents = listArticles("parents", localeId);
  const helpSections = getHelpSections(localeId);
  const demo = loadContentPack(localeId, "demo", "ui.json");
  const teacherGrades = loadContentPack(localeId, "global-burn-down", "burn-down-index.json")?.[
    "lib__teacher-portal__teacher-class-grade"
  ];
  const reportGrade = reportPackCopyForLocale(
    localeId,
    "components__parent-report-detailed-surface",
    "grade"
  );

  const samples = [
    grade1,
    g6,
    schoolNav,
    teacher,
    parent,
    worksheets?.h1,
    practice?.h1,
    seoGuide?.h1,
    marketing?.h1 || marketing?.title,
    helpSections?.parents?.title,
    reportGrade,
    teacherGrades?.grade_6,
    demo?.bar?.gradeLabel || demo?.grades?.g6,
  ]
    .filter(Boolean)
    .map(String);

  const hebrew = samples.filter((s) => HEBREW_RE.test(s));
  const forbiddenEn = samples.filter((s) => FORBIDDEN_EN_UI.test(s) && !ARABIC_RE.test(s));

  const nsParity = probeNamespaceParity(localeId);
  const catParity = probeCatalogParity(localeId);

  return {
    localeId,
    rtl: isRtlLocale(localeId) && resolveDirection(localeId) === "rtl",
    chain: getLocaleFallbackChain(localeId),
    publicHome: withLocalePath(localeId, "/"),
    helpLocale: resolveHelpLocale(localeId),
    helpLocaleExpected: helpLocale,
    helpLocaleOk: resolveHelpLocale(localeId) === helpLocale,
    grade1,
    grade6: g6,
    grade6Expected: grade6,
    grade6Ok: g6 === grade6,
    teacherGrade6: teacherGrades?.grade_6 ?? null,
    worksheetsH1: worksheets?.h1 ?? null,
    practiceH1: practice?.h1 ?? null,
    seoGuideH1: seoGuide?.h1 ?? null,
    helpParentsCount: helpParents.length,
    schoolNav: schoolNav ?? null,
    reportGrade: reportGrade ?? null,
    hebrewLeakage: hebrew.length,
    forbiddenEnglishUi: forbiddenEn.length,
    namespaceParityFailures: nsParity.failures,
    namespaceParityOk: nsParity.failures.length === 0,
    namespacesOnDisk: nsParity.namespacesOnDisk,
    catalogParity: catParity,
    catalogParityOk: catParity.missing.length === 0 && catParity.stale.length === 0,
  };
}

const selectorAfter = getSelectableLocales().length;
const auditFailures = [];
const egyptAudit = probeEgyptAudit(auditFailures);
const saudiAudit = probeSaudiAudit(auditFailures);
const moroccoAudit = probeMoroccoAudit(auditFailures);
const algeriaAudit = probeAlgeriaAudit(auditFailures);
const f1f2 = probeF1F2(auditFailures);

const results = {
  generatedAt: new Date().toISOString(),
  phase: "post-audit-wiring-parity",
  selectorCountAfter: selectorAfter,
  locales: {},
  auditClosure: {
    egypt: egyptAudit,
    saudi: saudiAudit,
    morocco: moroccoAudit,
    algeria: algeriaAudit,
    failures: auditFailures,
  },
  f1f2,
  summary: {
    rtlAll: true,
    hebrewLeakage: 0,
    forbiddenEnglishUi: 0,
    helpLocaleAllOk: true,
    namespaceParityAllOk: true,
    catalogParityAllOk: true,
    auditClosureOk: auditFailures.length === 0,
    arDzGrade6: null,
    arDzInvalidSanah6: 0,
  },
};

for (const c of LOCALES) {
  const r = probe(c.id, c.helpLocale, c.grade6);
  results.locales[c.id] = r;
  if (!r.rtl) results.summary.rtlAll = false;
  results.summary.hebrewLeakage += r.hebrewLeakage;
  results.summary.forbiddenEnglishUi += r.forbiddenEnglishUi;
  if (!r.helpLocaleOk) results.summary.helpLocaleAllOk = false;
  if (!r.namespaceParityOk) results.summary.namespaceParityAllOk = false;
  if (!r.catalogParityOk) results.summary.catalogParityAllOk = false;
  if (c.id === "ar-DZ") {
    results.summary.arDzGrade6 = r.grade6;
    const bad =
      r.grade6 === "السنة 6" ||
      r.teacherGrade6 === "السنة 6" ||
      String(r.grade6 || "").includes("السنة 6") ||
      String(r.teacherGrade6 || "").includes("السنة 6") ||
      r.grade6 !== "السنة 1 متوسط";
    results.summary.arDzInvalidSanah6 = bad ? 1 : 0;
  }
}

results.pass =
  results.summary.rtlAll &&
  results.summary.hebrewLeakage === 0 &&
  results.summary.forbiddenEnglishUi === 0 &&
  results.summary.helpLocaleAllOk &&
  results.summary.namespaceParityAllOk &&
  results.summary.catalogParityAllOk &&
  results.summary.auditClosureOk &&
  results.summary.arDzInvalidSanah6 === 0 &&
  Object.values(results.locales).every((r) => r.helpParentsCount > 0) &&
  selectorAfter === 80;

fs.writeFileSync(OUT, `${JSON.stringify(results, null, 2)}\n`, "utf8");
console.log(JSON.stringify(results, null, 2));
console.log(results.pass ? "PROBES PASS" : "PROBES FAIL");
if (auditFailures.length) {
  console.error("Audit closure failures:\n" + auditFailures.map((f) => ` - ${f}`).join("\n"));
}
process.exit(results.pass ? 0 : 1);
