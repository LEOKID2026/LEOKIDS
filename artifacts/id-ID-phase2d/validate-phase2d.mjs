/**
 * Content-only validation for id-ID Help + Public SEO (Phase 2D).
 */
import fs from "fs";
import path from "path";
import { PARENT_ARTICLES } from "../../data/help-center/content/parents.js";
import { STUDENT_ARTICLES } from "../../data/help-center/content/students.js";
import { PARENT_REPORT_ARTICLES } from "../../data/help-center/content/parent-report.js";
import { SUBJECT_ARTICLES } from "../../data/help-center/content/subjects.js";
import {
  ALL_ARTICLES_ID_ID,
  SECTIONS_ID_ID,
} from "../../data/help-center/id-ID/index.js";
import { GUIDE_SLUGS, GUIDE_PAGES, GUIDE_HUB_CARDS } from "../../data/seo/guide-pages.js";
import {
  PRACTICE_SLUGS,
  PRACTICE_HUB_CARDS,
  getPracticePageContent,
} from "../../data/seo/practice-pages.js";
import { getWorksheetsPageContent } from "../../data/seo/worksheets-pages.en.js";
import {
  KIDS_LANDING,
  PARENTS_LANDING,
  TEACHERS_LANDING,
  SCHOOLS_LANDING,
} from "../../data/marketing/landing-pages.js";
import {
  POLICY_LAST_UPDATED_DISPLAY,
  LEGACY_POLICY_PAGES,
  UNIFIED_LEGAL_SECTIONS,
  LEGAL_CROSS_LINKS,
  LEGAL_CONTACT_PAGE_LINKS,
  LEGAL_FOOTER_LINKS,
  PARENT_REPORT_DISCLAIMER_TITLE,
  PARENT_REPORT_DISCLAIMER_PARAGRAPHS,
  CONTACT_EMAIL,
} from "../../data/legal/sitePolicies.js";
import { SEO_PUBLIC_PATHS } from "../../lib/seo/seo-public-paths.js";

const ROOT = process.cwd();
const SEO_ROOT = path.join(ROOT, "content-packs/id-ID/public-seo");

function collectStrings(value, out = [], opts = {}) {
  const skip = opts.skipKeys || new Set();
  if (typeof value === "string") {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out, opts);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (skip.has(k)) continue;
      collectStrings(v, out, opts);
    }
  }
  return out;
}

function emptyLeaves(value, p = "", out = []) {
  if (typeof value === "string") {
    if (!value.trim()) out.push(p || "(root)");
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((x, i) => emptyLeaves(x, `${p}[${i}]`, out));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) emptyLeaves(v, p ? `${p}.${k}` : k, out);
  }
  return out;
}

function walkJsonFiles(dir, base = "") {
  /** @type {string[]} */
  let out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out = out.concat(walkJsonFiles(path.join(dir, ent.name), rel));
    else if (ent.name.endsWith(".json")) out.push(rel.replace(/\\/g, "/"));
  }
  return out;
}

const EN_HELP = [...PARENT_ARTICLES, ...STUDENT_ARTICLES, ...PARENT_REPORT_ARTICLES, ...SUBJECT_ARTICLES];
const enHelpSlugs = EN_HELP.map((a) => `${a.section}/${a.slug}`).sort();
const idHelpSlugs = ALL_ARTICLES_ID_ID.map((a) => `${a.section}/${a.slug}`).sort();

const helpMissing = enHelpSlugs.filter((s) => !idHelpSlugs.includes(s));
const helpExtra = idHelpSlugs.filter((s) => !enHelpSlugs.includes(s));
const helpDup = idHelpSlugs.filter((s, i) => idHelpSlugs.indexOf(s) !== i);
const helpEmpty = emptyLeaves(ALL_ARTICLES_ID_ID).concat(emptyLeaves(SECTIONS_ID_ID));

// Forbidden English UI heuristics in Help (translatable fields)
const HELP_EN_UI_RE =
  /\b(Welcome to|How do I|Sign in|Parent dashboard|Create a parent|Practice recommendations|Important notice|Login troubleshooting|Grade \d|grades? \d|worksheet|student|teacher|parent guide)\b/i;
const ALLOWED_EN_HELP = [
  /Leo Kids/i,
  /\bPIN\b/,
  /\bPDF\b/,
  /\bPWA\b/,
  /\bCopilot\b/,
  /\bGoogle\b/,
  /grade_\d/,
  /Share → Add to Home Screen/,
  /Tic-tac-toe/,
  /\/[a-z]/,
];

const helpEnUi = [];
for (const article of ALL_ARTICLES_ID_ID) {
  const strings = collectStrings(article, [], {
    skipKeys: new Set(["slug", "section", "id", "kind", "path", "href", "src", "sources"]),
  });
  for (const s of strings) {
    if (ALLOWED_EN_HELP.some((re) => re.test(s))) continue;
    if (HELP_EN_UI_RE.test(s)) helpEnUi.push({ slug: article.slug, s: s.slice(0, 120) });
  }
}

// Terminology / register defects
const termDefects = [];
const helpAll = collectStrings({ sections: SECTIONS_ID_ID, articles: ALL_ARTICLES_ID_ID });
for (const s of helpAll) {
  if (/\bsiswa\b/i.test(s)) termDefects.push({ kind: "siswa", s: s.slice(0, 100) });
  if (/\bpeserta didik\b/i.test(s)) termDefects.push({ kind: "peserta didik", s: s.slice(0, 100) });
  if (/\bFase [ABC]\b/.test(s)) termDefects.push({ kind: "fase", s: s.slice(0, 100) });
  if (/\bGrade\s*[1-6]\b/.test(s) || /\bgrades?\s+[1-6]\b/i.test(s)) {
    termDefects.push({ kind: "grade-en", s: s.slice(0, 100) });
  }
}
// Adult help should prefer Anda; flag heavy kamu in parents/parent-report
const registerDefects = [];
for (const a of ALL_ARTICLES_ID_ID) {
  if (a.section === "students") continue;
  const strings = collectStrings(a, [], { skipKeys: new Set(["slug", "section", "id", "path", "href"]) });
  for (const s of strings) {
    if (/\bkamu\b/i.test(s)) registerDefects.push({ slug: a.slug, s: s.slice(0, 100) });
  }
}

// SEO expected
const expectedSeo = [
  ...GUIDE_SLUGS.map((s) => `guides/${s}.json`),
  "guides/hub-cards.json",
  ...PRACTICE_SLUGS.map((s) => `practice/${s}.json`),
  "practice/hub-cards.json",
  "practice/worksheets.json",
  "marketing/kids.json",
  "marketing/parents.json",
  "marketing/teachers.json",
  "marketing/schools.json",
  "legal/unified.json",
];
const onDisk = walkJsonFiles(SEO_ROOT);
const missingSeo = expectedSeo.filter((f) => !onDisk.includes(f));
const orphanSeo = onDisk.filter((f) => !expectedSeo.includes(f));

/** @type {any[]} */
const seoEmpty = [];
/** @type {any[]} */
const untranslatedTitle = [];
/** @type {any[]} */
const untranslatedMeta = [];
/** @type {any[]} */
const untranslatedH1 = [];
/** @type {any[]} */
const untranslatedCta = [];
/** @type {any[]} */
const identicalLeaves = [];
/** @type {any[]} */
const intentionalEn = [];
/** @type {any[]} */
const faseLeak = [];
/** @type {any[]} */
const gradeDefect = [];
/** @type {any[]} */
const mixedDefect = [];

function loadSeo(rel) {
  return JSON.parse(fs.readFileSync(path.join(SEO_ROOT, rel), "utf8"));
}

function enLeavesForCompare() {
  const en = {
    guides: GUIDE_PAGES,
    guideHubCards: GUIDE_HUB_CARDS,
    practice: Object.fromEntries(PRACTICE_SLUGS.map((s) => [s, getPracticePageContent(s)])),
    practiceHubCards: PRACTICE_HUB_CARDS,
    worksheets: getWorksheetsPageContent(),
    marketing: {
      kids: KIDS_LANDING,
      parents: PARENTS_LANDING,
      teachers: TEACHERS_LANDING,
      schools: SCHOOLS_LANDING,
    },
    legal: {
      policyLastUpdatedDisplay: POLICY_LAST_UPDATED_DISPLAY,
      legacyPolicyPages: LEGACY_POLICY_PAGES,
      unifiedLegalSections: UNIFIED_LEGAL_SECTIONS,
      legalCrossLinks: LEGAL_CROSS_LINKS,
      legalContactPageLinks: LEGAL_CONTACT_PAGE_LINKS,
      legalFooterLinks: LEGAL_FOOTER_LINKS,
      parentReportDisclaimerTitle: PARENT_REPORT_DISCLAIMER_TITLE,
      parentReportDisclaimerParagraphs: PARENT_REPORT_DISCLAIMER_PARAGRAPHS,
      contactEmail: CONTACT_EMAIL,
    },
  };
  return en;
}

const enBundle = enLeavesForCompare();

function compareLeaf(enVal, idVal, loc) {
  if (typeof enVal !== "string" || typeof idVal !== "string") return;
  if (!enVal.trim()) return;
  if (!idVal.trim()) {
    seoEmpty.push(loc);
    return;
  }
  if (enVal === idVal) {
    const justified =
      /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(enVal) ||
      enVal.startsWith("/") ||
      enVal.includes("@") ||
      /^(Leo Kids|LEO KIDS|Leo|PIN|PDF|PWA|Copilot|Google|Gmail|Drive|Calendar|Pythagoras\.?)$/i.test(enVal) ||
      /Leo Number/i.test(enVal) ||
      /^[A-Z]{2,}$/.test(enVal);
    if (justified) intentionalEn.push({ loc, enVal });
    else identicalLeaves.push({ loc, enVal: enVal.slice(0, 140) });
  }
}

function deepCompare(enNode, idNode, loc = "") {
  if (typeof enNode === "string") {
    compareLeaf(enNode, typeof idNode === "string" ? idNode : "", loc);
    return;
  }
  if (Array.isArray(enNode)) {
    const arr = Array.isArray(idNode) ? idNode : [];
    enNode.forEach((v, i) => deepCompare(v, arr[i], `${loc}[${i}]`));
    return;
  }
  if (enNode && typeof enNode === "object") {
    const idObj = idNode && typeof idNode === "object" ? idNode : {};
    for (const [k, v] of Object.entries(enNode)) {
      if (["slug", "seoKey", "href", "route", "scrollToSectionId", "id", "relatedPracticePath", "relatedGuideSlugs", "action", "scrollTo", "emoji"].includes(k)) {
        continue;
      }
      deepCompare(v, idObj[k], loc ? `${loc}.${k}` : k);
    }
  }
}

for (const slug of GUIDE_SLUGS) {
  const id = loadSeo(`guides/${slug}.json`);
  const en = GUIDE_PAGES[slug];
  deepCompare(en, id, `guides/${slug}`);
  if (en.h1 && id.h1 === en.h1) untranslatedH1.push(`guides/${slug}`);
  if (en.displayTitle && id.displayTitle === en.displayTitle) untranslatedTitle.push(`guides/${slug}`);
  if (id.footerCta?.primary?.label && id.footerCta.primary.label === en.footerCta?.primary?.label) {
    untranslatedCta.push(`guides/${slug}.footerCta.primary`);
  }
  for (const s of collectStrings(id)) {
    if (/\bFase [ABC]\b/.test(s)) faseLeak.push({ file: slug, s });
    if (/\bGrade\s*[1-6]\b/.test(s) || /\bgrades?\s+[1-6]\b/i.test(s)) gradeDefect.push({ file: slug, s: s.slice(0, 100) });
  }
  seoEmpty.push(...emptyLeaves(id).map((p) => `guides/${slug}:${p}`));
}
deepCompare(GUIDE_HUB_CARDS, loadSeo("guides/hub-cards.json"), "guides/hub-cards");

for (const slug of PRACTICE_SLUGS) {
  const id = loadSeo(`practice/${slug}.json`);
  const en = getPracticePageContent(slug);
  deepCompare(en, id, `practice/${slug}`);
  if (en.h1 && id.h1 === en.h1) untranslatedH1.push(`practice/${slug}`);
  if (id.footerCta?.primary?.label && id.footerCta.primary.label === en.footerCta?.primary?.label) {
    untranslatedCta.push(`practice/${slug}.footerCta.primary`);
  }
  for (const s of collectStrings(id)) {
    if (/\bFase [ABC]\b/.test(s)) faseLeak.push({ file: slug, s });
    if (/\bGrade\s*[1-6]\b/.test(s) || /\bgrades?\s+[1-6]\b/i.test(s)) gradeDefect.push({ file: slug, s: s.slice(0, 100) });
  }
  seoEmpty.push(...emptyLeaves(id).map((p) => `practice/${slug}:${p}`));
}
deepCompare(PRACTICE_HUB_CARDS, loadSeo("practice/hub-cards.json"), "practice/hub-cards");
deepCompare(getWorksheetsPageContent(), loadSeo("practice/worksheets.json"), "practice/worksheets");

for (const audience of ["kids", "parents", "teachers", "schools"]) {
  const id = loadSeo(`marketing/${audience}.json`);
  const en = { kids: KIDS_LANDING, parents: PARENTS_LANDING, teachers: TEACHERS_LANDING, schools: SCHOOLS_LANDING }[audience];
  deepCompare(en, id, `marketing/${audience}`);
  if (en.pageTitle && id.pageTitle === en.pageTitle) untranslatedTitle.push(`marketing/${audience}`);
  if (en.metaDescription && id.metaDescription === en.metaDescription) untranslatedMeta.push(`marketing/${audience}`);
  if (en.hero?.title && id.hero?.title === en.hero.title) untranslatedH1.push(`marketing/${audience}.hero`);
  if (en.hero?.primaryCta?.label && id.hero?.primaryCta?.label === en.hero.primaryCta.label) {
    untranslatedCta.push(`marketing/${audience}.hero.primaryCta`);
  }
  // adult marketing kamu
  if (audience !== "kids") {
    for (const s of collectStrings(id)) {
      if (/\bkamu\b/i.test(s)) registerDefects.push({ slug: `marketing/${audience}`, s: s.slice(0, 100) });
    }
  }
  for (const s of collectStrings(id)) {
    if (/\bFase [ABC]\b/.test(s)) faseLeak.push({ file: audience, s });
    if (/\bGrade\s*[1-6]\b/.test(s) || /\bgrades?\s+[1-6]\b/i.test(s)) gradeDefect.push({ file: audience, s: s.slice(0, 100) });
  }
  seoEmpty.push(...emptyLeaves(id).map((p) => `marketing/${audience}:${p}`));
}

const legalId = loadSeo("legal/unified.json");
deepCompare(enBundle.legal, legalId, "legal/unified");
seoEmpty.push(...emptyLeaves(legalId).map((p) => `legal/unified:${p}`));
for (const s of collectStrings(legalId)) {
  if (/\bFase [ABC]\b/.test(s)) faseLeak.push({ file: "legal", s });
  if (/\bGrade\s*[1-6]\b/.test(s) || /\bgrades?\s+[1-6]\b/i.test(s)) gradeDefect.push({ file: "legal", s: s.slice(0, 100) });
}

// Mixed EN/ID prose: long Indonesian string still containing common English UI phrases
const MIXED_RE = /\b(Click here|Sign up|Log in|Get started|Learn more|Parent portal|Practice areas)\b/;
for (const rel of onDisk) {
  const obj = loadSeo(rel);
  for (const s of collectStrings(obj)) {
    if (/[A-Za-z]{3,}/.test(s) && /[àáâãäåæçèéêëìíîïñòóôõöùúûüýÿĀ-ž]/.test(s) === false) {
      // has latin letters; check if mostly English leftover in Indonesian file
    }
    if (MIXED_RE.test(s) && /[Aa]nda|[Bb]er|[Mm]urid|[Kk]elas/.test(s)) {
      mixedDefect.push({ rel, s: s.slice(0, 120) });
    }
  }
}

const report = {
  help: {
    sectionsEn: 4,
    sectionsId: Object.keys(SECTIONS_ID_ID).length,
    articlesEn: EN_HELP.length,
    articlesId: ALL_ARTICLES_ID_ID.length,
    missingSlugs: helpMissing,
    extraSlugs: helpExtra,
    duplicateSlugs: helpDup,
    emptyFields: helpEmpty.length,
    untranslatedEnglishUi: helpEnUi.length,
    untranslatedEnglishUiSample: helpEnUi.slice(0, 20),
    terminologyDefects: termDefects.length,
    terminologySample: termDefects.slice(0, 20),
    registerDefects: registerDefects.filter((r) => !String(r.slug).startsWith("marketing")).length,
    registerSample: registerDefects.slice(0, 20),
  },
  seo: {
    englishRuntimeSources: [
      "data/seo/guide-pages.js",
      "data/seo/practice-pages.js",
      "data/seo/worksheets-pages.en.js",
      "data/marketing/landing-pages.js",
      "data/legal/sitePolicies.js",
      "locales/en/seo.json (chrome; not owned — namespaces)",
    ],
    englishRuntimePaths: SEO_PUBLIC_PATHS.length,
    overlayFiles: onDisk.length,
    expectedOverlayFiles: expectedSeo.length,
    missingPaths: missingSeo,
    orphanPaths: orphanSeo,
    emptyLeaves: [...new Set(seoEmpty)].length,
    emptySample: [...new Set(seoEmpty)].slice(0, 20),
    untranslatedTitles: untranslatedTitle,
    untranslatedMeta: untranslatedMeta,
    untranslatedH1: untranslatedH1,
    untranslatedCta: untranslatedCta,
    identicalUnjustified: identicalLeaves.length,
    identicalSample: identicalLeaves.slice(0, 30),
    intentionalOrJustified: intentionalEn.length,
    faseLeak: faseLeak.length,
    gradeDefects: gradeDefect.length,
    gradeSample: gradeDefect.slice(0, 20),
    mixedDefects: mixedDefect.length,
    marketingRegisterKamu: registerDefects.filter((r) => String(r.slug).startsWith("marketing")).length,
  },
};

const pass =
  report.help.sectionsId === 4 &&
  report.help.articlesId === 40 &&
  report.help.missingSlugs.length === 0 &&
  report.help.extraSlugs.length === 0 &&
  report.help.duplicateSlugs.length === 0 &&
  report.help.emptyFields === 0 &&
  report.help.untranslatedEnglishUi === 0 &&
  report.help.terminologyDefects === 0 &&
  report.help.registerDefects === 0 &&
  report.seo.missingPaths.length === 0 &&
  report.seo.orphanPaths.length === 0 &&
  report.seo.emptyLeaves === 0 &&
  report.seo.untranslatedTitles.length === 0 &&
  report.seo.untranslatedMeta.length === 0 &&
  report.seo.untranslatedH1.length === 0 &&
  report.seo.untranslatedCta.length === 0 &&
  report.seo.identicalUnjustified === 0 &&
  report.seo.faseLeak === 0 &&
  report.seo.gradeDefects === 0 &&
  report.seo.marketingRegisterKamu === 0;

report.PHASE_2D_CONTENT_PASS = pass;

fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase2d/validate-phase2d-report.json"),
  JSON.stringify(report, null, 2)
);
console.log(JSON.stringify(report, null, 2));
process.exit(pass ? 0 : 1);
