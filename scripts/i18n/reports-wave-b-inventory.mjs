/**
 * Wave B0 — Reports file inventory (findings, role, target layer).
 * Run: node scripts/i18n/reports-wave-b-inventory.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outPath = path.join(root, "tmp/i18n/reports-wave-b-inventory.json");

/** @param {string} file */
function classifyRole(file) {
  const f = file.replace(/\\/g, "/");
  if (/\.test\.|selftest|fixtures|zero-evidence-policy-tests|context-labeling-matrix|surface-classification-audit/.test(f)) {
    return { role: "test fixture", logic: true, copy: true, target: "tests/fixtures or exclude" };
  }
  if (/pages\/api\//.test(f)) return { role: "API", logic: true, copy: true, target: "structured API + createReportTranslator" };
  if (/pages\/learning\/parent-report|parent-report-detailed/.test(f)) return { role: "UI component", logic: true, copy: true, target: "useReportT + reportLocale props" };
  if (/components\/parent-report|components\/parent\//.test(f)) return { role: "UI component", logic: false, copy: true, target: "useReportT()" };
  if (/math-report-generator|parent-report-v2|detailed-parent-report|intervention-plan/.test(f)) {
    return { role: "report generator", logic: true, copy: true, target: "structured model + report packs" };
  }
  if (/normalize-parent-facing|row-diagnostics|engine-v1-signals|topic-trend|diagnostic-restraint|foundation-ordering|evidence-targets/.test(f)) {
    return { role: "structured analysis", logic: true, copy: true, target: "stable codes + reportPackCopy" };
  }
  if (/parent-report-insights\//.test(f)) return { role: "structured analysis", logic: true, copy: true, target: "insight codes + locales/en/reports.json" };
  if (/parent-report-surface\//.test(f)) return { role: "display labels", logic: true, copy: true, target: "content-packs/en/reports/labels.json" };
  if (/grade-aware-recommendation|display-labels|hebrew-copy-spec|diagnostic-explanations|surface-row-labels|subject-evidence-policy/.test(f)) {
    return { role: "recommendation templates", logic: false, copy: true, target: "content-packs/en/reports/" };
  }
  if (/parent-report-ui-explain|engine-decision-parent-copy|parent-facing-error-pattern/.test(f)) {
    return { role: "report copy", logic: true, copy: true, target: "content-packs/en/reports/explain-ui.json" };
  }
  if (/parent-report-approved-copy|parent-report-regular-display/.test(f)) return { role: "UI component", logic: true, copy: true, target: "useReportT + report packs" };
  if (/parent-report-ai|output-integrity/.test(f)) return { role: "structured analysis", logic: true, copy: true, target: "codes + report packs" };
  if (/parent-report-language\/v2-parent-copy/.test(f)) return { role: "legacy compatibility", logic: false, copy: false, target: "already wired — 0 copy" };
  if (/-he\.js$/.test(f)) return { role: "legacy compatibility", logic: false, copy: true, target: "deprecated wrapper → report locale" };
  return { role: "report copy", logic: true, copy: true, target: "content-packs/en/reports/" };
}

function isReportFile(file) {
  const f = file.replace(/\\/g, "/");
  return /parent-report|report-generator|report-language|detailed-parent-report|parent-report-ui-explain/.test(f);
}

const { findings } = scanRepository();
/** @type {Map<string, number>} */
const byFile = new Map();
for (const f of findings) {
  if (!isReportFile(f.file)) continue;
  byFile.set(f.file, (byFile.get(f.file) || 0) + 1);
}

/** @type {Array<Record<string, unknown>>} */
const rows = [];
for (const [file, count] of [...byFile.entries()].sort((a, b) => b[1] - a[1])) {
  const meta = classifyRole(file);
  rows.push({
    file,
    findings: count,
    role: meta.role,
    containsLogic: meta.logic,
    containsCopy: meta.copy,
    targetLayer: meta.target,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  totalFindings: rows.reduce((n, r) => n + r.findings, 0),
  fileCount: rows.length,
  structure: "content-packs/en/reports/{explain-ui,recommendations,labels,interventions,summaries}.json + locales/en/reports.json for ICU contract strings",
  rows,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log("inventory", report.fileCount, "files", report.totalFindings, "findings");
console.log("wrote", outPath);
