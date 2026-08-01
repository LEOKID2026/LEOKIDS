/**
 * Rename / delete required *-he modules for Global; rewrite imports.
 * Skips admin/dev/prototypes/tmp.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * Each entry: { from, to?, deleteIfTargetExists?: boolean }
 * If `to` omitted and deleteIfTargetExists with `prefer`, delete `from` and point imports to prefer.
 */
const ACTIONS = [
  // Rename (no EN collision)
  { from: "utils/parent-report-language/subject-withhold-summary.js", to: "utils/parent-report-language/subject-withhold-summary.js" },
  { from: "utils/parent-report-language/parent-report-owner-copy-templates.js", to: "utils/parent-report-language/parent-report-owner-copy-templates.js" },
  { from: "utils/parent-report-language/grade-insight.js", to: "utils/parent-report-language/grade-insight.js" },
  { from: "utils/parent-report-language/parent-facing-pattern-label.js", to: "utils/parent-report-language/parent-facing-pattern-label.js" },
  { from: "utils/parent-report-language/parent-report-owner-topic-copy-templates.js", to: "utils/parent-report-language/parent-report-owner-topic-copy-templates.js" },
  { from: "utils/parent-report-language/confidence-parent.js", to: "utils/parent-report-language/confidence-parent.js" },
  { from: "utils/parent-report-language/priority-parent.js", to: "utils/parent-report-language/priority-parent.js" },
  { from: "utils/parent-report-language/surface-row-labels.js", to: "utils/parent-report-language/surface-row-labels.js" },
  { from: "utils/parent-report-language/short-report-source-label.js", to: "utils/parent-report-language/short-report-source-label.js" },
  { from: "utils/parent-report-language/grade-context-parent.js", to: "utils/parent-report-language/grade-context-parent.js" },
  { from: "utils/parent-report-language/engine-decision-parent-copy.js", to: "utils/parent-report-language/engine-decision-parent-copy.js" },
  { from: "utils/parent-report-language/parent-diagnostic-explanations.js", to: "utils/parent-report-language/parent-diagnostic-explanations.js" },
  { from: "utils/parent-report-engine-insights.js", to: "utils/parent-report-engine-insights.js" },
  { from: "lib/classroom-activities/classroom-skill-labels.js", to: "lib/classroom-activities/classroom-skill-labels.js" },
  { from: "lib/platform-ui/display-labels.js", to: "lib/platform-ui/display-labels.js" },

  // Delete HE sibling — EN module already exists; retarget imports
  { from: "utils/parent-report-language/parent-report-display-labels.js", prefer: "utils/parent-report-language/parent-report-display-labels.js" },
  { from: "lib/parent-ui/parent-report-approved-copy.js", prefer: "lib/parent-ui/parent-report-approved-copy.js" },
  { from: "utils/diagnostic-labels.js", prefer: "utils/diagnostic-labels.js" },
  { from: "utils/learning-live-feedback.js", prefer: "utils/learning-live-feedback.js" },
  { from: "lib/learning-book/format-book-shell-title.js", prefer: "lib/learning-book/format-book-shell-title.js" },
  { from: "lib/rewards/rewards-ui.js", prefer: "lib/rewards/rewards-ui.js" },
];

const SKIP_DIR_PARTS = [
  `${path.sep}pages${path.sep}admin${path.sep}`,
  `${path.sep}pages${path.sep}dev${path.sep}`,
  `${path.sep}prototypes${path.sep}`,
  `${path.sep}lib${path.sep}admin`,
  `${path.sep}data${path.sep}admin`,
  `${path.sep}lib${path.sep}auth${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}.git${path.sep}`,
  `${path.sep}tmp${path.sep}`,
];

function shouldSkip(abs) {
  return SKIP_DIR_PARTS.some((p) => abs.toLowerCase().includes(p.toLowerCase()));
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (shouldSkip(abs)) continue;
    if (ent.isDirectory()) walk(abs, out);
    else if (/\.(js|jsx|mjs|cjs|ts|tsx)$/.test(ent.name)) out.push(abs);
  }
  return out;
}

const report = { renamed: [], deleted: [], missing: [] };
const replacements = []; // [RegExp, string]

for (const a of ACTIONS) {
  const fromAbs = path.join(ROOT, a.from);
  if (!fs.existsSync(fromAbs)) {
    report.missing.push(a.from);
    continue;
  }
  if (a.prefer) {
    const preferBase = a.prefer.replace(/\.js$/, "");
    const fromBase = a.from.replace(/\.js$/, "");
    replacements.push([
      new RegExp(fromBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\.js)?", "g"),
      preferBase + "$1",
    ]);
    // basename fallback
    const fromName = path.basename(a.from).replace(/\.js$/, "");
    const preferName = path.basename(a.prefer).replace(/\.js$/, "");
    replacements.push([
      new RegExp(`([\"'])([^\"']*/)?${fromName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\.js)?\\1`, "g"),
      `$1$2${preferName}$3$1`,
    ]);
    fs.unlinkSync(fromAbs);
    report.deleted.push({ from: a.from, prefer: a.prefer });
    continue;
  }
  const toAbs = path.join(ROOT, a.to);
  if (fs.existsSync(toAbs)) {
    // collision — delete from and point to existing to
    const toBase = a.to.replace(/\.js$/, "");
    const fromBase = a.from.replace(/\.js$/, "");
    replacements.push([
      new RegExp(fromBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\.js)?", "g"),
      toBase + "$1",
    ]);
    fs.unlinkSync(fromAbs);
    report.deleted.push({ from: a.from, prefer: a.to, reason: "collision" });
    continue;
  }
  fs.renameSync(fromAbs, toAbs);
  const fromBase = a.from.replace(/\.js$/, "");
  const toBase = a.to.replace(/\.js$/, "");
  replacements.push([
    new RegExp(fromBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\.js)?", "g"),
    toBase + "$1",
  ]);
  const fromName = path.basename(a.from).replace(/\.js$/, "");
  const toName = path.basename(a.to).replace(/\.js$/, "");
  replacements.push([
    new RegExp(`([\"'])([^\"']*/)?${fromName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\.js)?\\1`, "g"),
    `$1$2${toName}$3$1`,
  ]);
  report.renamed.push({ from: a.from, to: a.to });
}

replacements.push([/display-labels(\.js)?/g, "display-labels$1"]);

let importUpdates = 0;
for (const abs of walk(ROOT)) {
  let t = fs.readFileSync(abs, "utf8");
  const orig = t;
  for (const [re, rep] of replacements) t = t.replace(re, rep);
  if (t !== orig) {
    fs.writeFileSync(abs, t, "utf8");
    importUpdates++;
  }
}

console.log(JSON.stringify({ ...report, importUpdates }, null, 2));
