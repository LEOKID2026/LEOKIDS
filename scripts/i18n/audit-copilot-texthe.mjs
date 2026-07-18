/**
 * Audit active runtime textHe vs inventory Copilot bucket.
 *
 * Usage: node scripts/i18n/audit-copilot-texthe.mjs [--write-report]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/copilot-texthe-audit.json");

const RUNTIME_GLOBS = [
  "utils/parent-copilot/**/*.js",
  "lib/parent-copilot/**/*.{js,mjs,jsx}",
  "components/parent-copilot/**/*.{js,jsx}",
];

const SKIP_PATH_RE =
  /\.(test|spec)\.|__tests__|fixtures\/|\.md$|README|snapshot|mock-fixtures|parent-copilot-async-llm-gate-suite|parent-copilot-structured-output\.test/;

/** @param {string} line */
function classifyLineContext(line) {
  const trimmed = line.trim();
  if (/^\s*\/\//.test(trimmed) || /^\s*\*/.test(trimmed)) return "comment";
  if (/textHe\s*[:?]/i.test(line) && /\/\/|\/\*|\*\//.test(line)) return "comment";
  if (/\.test\.|describe\(|it\(|assert\./.test(line)) return "test";
  if (/snapshot|fixture|mock|example|@deprecated|legacy|backward compat/i.test(line)) return "fixtureOrCompat";
  if (/textHe\s*[:?]/i.test(line)) return "runtimeActive";
  if (/\btextHe\b/.test(line)) return "reference";
  return "other";
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      walk(abs, out);
    } else if (/\.(js|jsx|mjs)$/.test(name)) {
      out.push(abs);
    }
  }
  return out;
}

function collectFiles() {
  const files = new Set();
  for (const rel of ["utils/parent-copilot", "lib/parent-copilot", "components/parent-copilot"]) {
    for (const abs of walk(path.join(root, rel))) {
      files.add(abs);
    }
  }
  return [...files].map((abs) => path.relative(root, abs).replace(/\\/g, "/"));
}

export function auditCopilotTextHe() {
  const files = collectFiles().filter((f) => !SKIP_PATH_RE.test(f));
  /** @type {Record<string, number>} */
  const byContext = {};
  /** @type {Array<{ file: string, line: number, context: string, snippet: string }>} */
  const runtimeSamples = [];
  let totalReferences = 0;

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    const lines = source.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (!/\btextHe\b/.test(lines[i])) continue;
      totalReferences++;
      const context = classifyLineContext(lines[i]);
      byContext[context] = (byContext[context] || 0) + 1;
      if (context === "runtimeActive" && runtimeSamples.length < 40) {
        runtimeSamples.push({
          file,
          line: i + 1,
          context,
          snippet: lines[i].trim().slice(0, 120),
        });
      }
    }
  }

  return {
    filesScanned: files.length,
    totalTextHeReferences: totalReferences,
    byContext,
    activeRuntimeTextHeReferences: byContext.runtimeActive || 0,
    inventoryCopilotBucketNote:
      "Wave F Copilot bucket counts unique hardcoded UI strings in copilot composers/consumers. textHe references include property reads/writes, destructuring, tests, and comments — not 1:1 with scanner findings.",
    runtimeSamples,
  };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]).replace(/\\/g, "/") === fileURLToPath(import.meta.url).replace(/\\/g, "/");

if (isMain) {
  const report = auditCopilotTextHe();
  if (process.argv.includes("--write-report")) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(report, null, 2));
}
