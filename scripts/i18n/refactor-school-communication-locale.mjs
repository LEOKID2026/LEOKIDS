/**
 * Refactor school-communication.js: export const → export let + bindSchoolCommunicationLocale.
 * Run: node scripts/i18n/refactor-school-communication-locale.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const FILE = path.join(ROOT, "lib/school-portal/school-communication.js");

let src = fs.readFileSync(FILE, "utf8");

if (src.includes("bindSchoolCommunicationLocale")) {
  console.log("already refactored");
  process.exit(0);
}

src = src.replace(
  'import schoolEn from "../../locales/en/school.json" with { type: "json" };\n\nconst C = schoolEn.communication;',
  `import { loadLocaleBundles } from "../i18n/load-messages.js";
import schoolEn from "../../locales/en/school.json" with { type: "json" };

/** @type {string} */
let _schoolCommunicationLocale = "en";

/** Bind school messaging / student-detail copy to interface locale. */
export function bindSchoolCommunicationLocale(localeId) {
  _schoolCommunicationLocale = localeId || "en";
  refreshSchoolCommunicationBindings();
}

function communicationPack() {
  const b = loadLocaleBundles(_schoolCommunicationLocale);
  const s = b.school;
  const c = s && typeof s === "object" ? s.communication : null;
  return c && typeof c === "object" ? c : schoolEn.communication;
}`,
);

/** @type {string[]} */
const refreshLines = [];

src = src.replace(/^export const (SC_[A-Z0-9_]+) = C\.(\w+);$/gm, (_, name, key) => {
  refreshLines.push(`  ${name} = communicationPack().${key};`);
  return `export let ${name} = "";`;
});

src = src.replace(
  /export const (SC_LAST_LOGIN_DAYS_AGO) = \(days\) => fillTemplate\(C\.lastLoginDaysAgo, \{ days \}\);/,
  `export const SC_LAST_LOGIN_DAYS_AGO = (days) =>
  fillTemplate(communicationPack().lastLoginDaysAgo, { days });`,
);
src = src.replace(
  /export const (SC_COMPOSE_PREVIEW_COUNT) = \(count\) => fillTemplate\(C\.composePreviewCount, \{ count \}\);/,
  `export const SC_COMPOSE_PREVIEW_COUNT = (count) =>
  fillTemplate(communicationPack().composePreviewCount, { count });`,
);
src = src.replace(
  /export const (SC_RECEIPTS_READ_COUNT) = \(read, total\) => fillTemplate\(C\.receiptsReadCount, \{ read, total \}\);/,
  `export const SC_RECEIPTS_READ_COUNT = (read, total) =>
  fillTemplate(communicationPack().receiptsReadCount, { read, total });`,
);

const refreshFn = `
function refreshSchoolCommunicationBindings() {
${refreshLines.join("\n")}
}

refreshSchoolCommunicationBindings();
`;

src = src.trimEnd() + "\n" + refreshFn;

fs.writeFileSync(FILE, src, "utf8");
console.log("refactored", refreshLines.length, "communication bindings");
