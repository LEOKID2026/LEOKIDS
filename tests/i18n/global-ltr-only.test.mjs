/**
 * Global LTR-only scan — fails on RTL patterns in non-admin runtime.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const SCAN_ROOTS = [
  "pages",
  "components",
  "lib",
  "data",
  "content",
  "utils",
  "hooks",
  "styles",
  "public",
  "middleware.js",
];

const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".css", ".scss", ".html"]);

const RTL_PATTERNS = [
  { re: /dir\s*=\s*["']rtl["']/i, kind: "dir_rtl_attr" },
  { re: /dir\s*=\s*\{\s*["']rtl["']\s*\}/i, kind: "dir_rtl_jsx" },
  { re: /direction\s*:\s*rtl\b/i, kind: "direction_rtl" },
  { re: /text-align\s*:\s*right\b/i, kind: "text_align_right" },
  { re: /flex-direction\s*:\s*(?:row-reverse|column-reverse)/i, kind: "flex_reverse" },
  { re: /locale\s*:\s*["']he-IL["']/i, kind: "locale_he_il" },
];

/** Narrow allowlist: file path pattern → reason */
const ALLOW = [
  { re: /^pages\/admin\//, reason: "Admin stays Hebrew/RTL by product decision" },
  { re: /^pages\/api\/admin\//, reason: "Admin API" },
  { re: /^components\/admin\//, reason: "Admin UI components" },
  { re: /^lib\/admin-portal\//, reason: "Admin portal labels" },
  { re: /^lib\/admin-server\//, reason: "Admin server" },
  { re: /^components\/prototypes\/dev\//, reason: "Dev prototypes not production" },
  { re: /^pages\/dev\//, reason: "Dev-only prototype routes" },
  { re: /^components\/ai-hybrid-internal-reviewer-panel\.jsx$/, reason: "Internal AI review panel; not student/parent UI" },
  // Worksheet print: explicit LTR islands may mention right for math columns
  { re: /^styles\/worksheet-print\.css$/, reason: "Print math isolation uses direction:ltr + unicode-bidi" },
  { re: /^utils\/hebrew-audio-attach\.js$/, reason: "Hebrew TTS stem helper; not used in Global English student audio path" },
];

/** Per-line allowlist after match */
const LINE_ALLOW = [
  /direction\s*:\s*ltr/i,
  /unicode-bidi\s*:\s*isolate/i,
  /\/\*.*rtl.*\*\//i,
  /\/\/.*rtl/i,
];

function isAllowed(rel) {
  return ALLOW.some((a) => a.re.test(rel));
}

function walk(entry, out = []) {
  const abs = path.isAbsolute(entry) ? entry : path.join(root, entry);
  if (!fs.existsSync(abs)) return out;
  const st = fs.statSync(abs);
  if (st.isFile()) {
    out.push(abs);
    return out;
  }
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
    walk(path.join(abs, ent.name), out);
  }
  return out;
}

/** @type {{ rel: string, line: number, kind: string, snippet: string }[]} */
const findings = [];

for (const base of SCAN_ROOTS) {
  for (const file of walk(base)) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (isAllowed(rel)) continue;
    const ext = path.extname(rel);
    if (ext && !EXT.has(ext)) continue;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    text.split(/\r?\n/).forEach((line, i) => {
      if (LINE_ALLOW.some((re) => re.test(line))) return;
      for (const { re, kind } of RTL_PATTERNS) {
        if (re.test(line)) {
          findings.push({
            rel,
            line: i + 1,
            kind,
            snippet: line.trim().slice(0, 140),
          });
          break;
        }
      }
    });
  }
}

if (findings.length) {
  console.error(`FAIL global-ltr-only: ${findings.length} finding(s)\n`);
  for (const f of findings.slice(0, 80)) {
    console.error(`[${f.kind}] ${f.rel}:${f.line}`);
    console.error(`  ${f.snippet}`);
  }
  if (findings.length > 80) console.error(`… +${findings.length - 80} more`);
  process.exit(1);
}

assert.equal(findings.length, 0);
console.log("ok - global LTR-only runtime scan (0 findings)");
