/**
 * One-time refactor: school-ui.js export const → export let + bindSchoolUiLocale refresh.
 * Run: node scripts/i18n/refactor-school-ui-locale.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const FILE = path.join(ROOT, "lib/school-portal/school-ui.js");

let src = fs.readFileSync(FILE, "utf8");

if (src.includes("bindSchoolUiLocale")) {
  console.log("already refactored");
  process.exit(0);
}

src = src.replace(
  'import schoolEn from "../../locales/en/school.json" with { type: "json" };',
  `import { loadLocaleBundles } from "../i18n/load-messages.js";
import schoolEn from "../../locales/en/school.json" with { type: "json" };

/** @type {string} */
let _schoolUiLocale = "en";

/** Bind school portal copy to interface locale (call from SchoolPortalShell render). */
export function bindSchoolUiLocale(localeId) {
  _schoolUiLocale = localeId || "en";
  refreshSchoolUiBindings();
}

function schoolRoot() {
  const b = loadLocaleBundles(_schoolUiLocale);
  const s = b.school;
  return s && typeof s === "object" ? s : schoolEn;
}

function portalPack() {
  return schoolRoot().portal || schoolEn.portal;
}
function teacherPack() {
  return schoolRoot().teacher || schoolEn.teacher;
}
function learningStatusPack() {
  return schoolRoot().learningStatus || schoolEn.learningStatus;
}
function reportSummaryPack() {
  return schoolRoot().reportSummary || schoolEn.reportSummary;
}`,
);

src = src.replace(
  /const P = schoolEn\.portal;\nconst T = schoolEn\.teacher;\nconst LS = schoolEn\.learningStatus;\nconst RS = schoolEn\.reportSummary;\n/,
  "",
);

const constExports = [...src.matchAll(/^export const (SCHOOL_[A-Z0-9_]+|TEACHER_[A-Z0-9_]+) = P\.(\w+);$/gm)];
const teacherExports = [...src.matchAll(/^export const (TEACHER_[A-Z0-9_]+) = T\.(\w+);$/gm)];

/** @type {string[]} */
const refreshLines = [];

for (const [, name, key] of constExports) {
  src = src.replace(`export const ${name} = P.${key};`, `export let ${name} = "";`);
  refreshLines.push(`  ${name} = portalPack().${key};`);
}
for (const [, name, key] of teacherExports) {
  src = src.replace(`export const ${name} = T.${key};`, `export let ${name} = "";`);
  refreshLines.push(`  ${name} = teacherPack().${key};`);
}

// LS references in studentLearningStatusBadgeClass
src = src.replace(/\bLS\./g, "learningStatusPack().");

// RS in report functions
src = src.replace(/fillTemplate\(RS\./g, "fillTemplate(reportSummaryPack().");

const refreshFn = `
function refreshSchoolUiBindings() {
${refreshLines.join("\n")}
}

refreshSchoolUiBindings();
`;

src = src.replace(
  /export \{\n  apiErrorMessageHe,/,
  `${refreshFn}\nexport {\n  apiErrorMessageHe,`,
);

fs.writeFileSync(FILE, src, "utf8");
console.log("refactored", refreshLines.length, "bindings");
