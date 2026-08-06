#!/usr/bin/env node
/**
 * Final binary EN Hebrew hard scan — every hit with classification.
 * Output: docs/reports/en-final-hebrew-hard-scan.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HE = /[\u0590-\u05FF]/;
const ESC_HE = /\\u05[0-9a-fA-F]{2}/;
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  ".git",
  "playwright-report",
  "test-results",
  ".vercel",
  ".tmp",
  ".tmp-zip-preview",
  "android",
]);
const EXT = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".sql",
  ".css",
  ".html",
  ".txt",
  ".svg",
  ".webmanifest",
]);

function posix(p) {
  return p.split(path.sep).join("/");
}

function classify(rel, lineText) {
  const n = posix(rel);
  const isAdmin =
    /(^|\/)(admin|admin-portal|admin-server)(\/|$)/i.test(n) ||
    n.includes("/admin/") ||
    n.startsWith("pages/admin/") ||
    n.startsWith("components/admin/") ||
    n.startsWith("pages/api/admin/") ||
    n.endsWith("admin-ui.he.js") ||
    n.endsWith("admin-rewards-ui.he.js") ||
    n.endsWith("admin-video-builder-ui.he.js") ||
    n.endsWith("admin-analytics-labels.he.js") ||
    n === "lib/auth/auth-registration.he.js" ||
    n === "lib/teacher-portal/teacher-ui.he.js";

  // Technical detector / stripper (regex character class or replace of Hebrew range)
  const technical =
    /\\u0590-\\u05FF|\[\\u0590-\\u05FF\]|\\u05[0-9a-fA-F]{2}.*\\u05|HEBREW_RE|containsHebrew|Forbidden.*Hebrew|Hebrew script|Hebrew leakage|Hebrew block|strip.*Hebrew|reject.*Hebrew|no Hebrew|zero Hebrew|textHasHebrew|HEBREW_RE\s*=/.test(
      lineText
    ) ||
    (/\[\\u0590-\\u05FF\]/.test(lineText) &&
      (/\.test\(|\.replace\(|new RegExp|HE\s*=|HEBREW/.test(lineText) ||
        /label:\s*"Hebrew/.test(lineText)));

  // More precise technical: line is primarily a regex detector
  const techPrecise =
    /\[\\u0590-\\u05FF\]/.test(lineText) ||
    (/\\u05[0-9a-fA-F]{2}/.test(lineText) &&
      /label:\s*"Hebrew|FORBIDDEN_|HEBREW_RE|containsHebrew|\.replace\(\s*\/\[\\u0590/.test(
        lineText
      ));

  const isDevTestDoc =
    n.startsWith("tests/") ||
    n.startsWith("__tests__/") ||
    n.startsWith("scripts/") ||
    n.startsWith("docs/") ||
    n.startsWith("reports/") ||
    n.startsWith("artifacts/") ||
    n.startsWith(".cursor/") ||
    n.startsWith("sql/") ||
    n.includes("/prototypes/") ||
    n.startsWith("lib/dev/") ||
    n.includes(".test.") ||
    n.includes(".spec.") ||
    n.includes("playwright") ||
    n.endsWith(".md") ||
    n.includes("GLOBALIZATION-AUDIT");

  const isAuditArtifact =
    n.startsWith("docs/reports/") &&
    (n.includes("hebrew") || n.includes("en-he") || n.includes("_en-he"));

  if (isAdmin) {
    return {
      classification: "allowed",
      bucket: "admin_exempt",
      reason: "Admin / admin companion (.he) — explicitly excluded from EN translation requirement",
    };
  }

  // Pure technical detector on an otherwise product file
  if (techPrecise || (technical && !HE.test(lineText.replace(/\\u05[0-9a-fA-F]{2}/g, "")))) {
    // If the line ONLY has escapes inside a regex/detector context and no actual Hebrew UI string assignment
    const looksLikeUiString =
      /=\s*["'`][^"'`]*[\u0590-\u05FF]/.test(lineText) ||
      /=\s*"\\u05/.test(lineText) ||
      /label:\s*"\\u05/.test(lineText) ||
      /:\s*"\\u05/.test(lineText);
    if (!looksLikeUiString && (techPrecise || /\[\\u0590-\\u05FF\]/.test(lineText))) {
      return {
        classification: "technical",
        bucket: "hebrew_detector",
        reason: "Technical regex/detector/stripper for Hebrew — not user-facing EN copy",
      };
    }
  }

  if (isAuditArtifact) {
    return {
      classification: "dev-test-doc",
      bucket: "audit_artifact",
      reason: "Audit report/helper generated under docs/reports — not product UI",
    };
  }

  if (isDevTestDoc) {
    return {
      classification: "dev-test-doc",
      bucket: "tests_scripts_docs",
      reason: "Tests/scripts/docs/prototypes — not public English runtime product surface",
    };
  }

  // Hebrew-named companion that somehow wasn't caught as admin
  if (/\.he\.(js|json|ts)$/.test(n)) {
    return {
      classification: "stale",
      bucket: "hebrew_named_file",
      reason: "Hebrew-named companion file — verify imports; if public-connected then FORBIDDEN",
    };
  }

  // Connected public/product surface with Hebrew = FORBIDDEN
  return {
    classification: "forbidden",
    bucket: "public_or_connected",
    reason: "Hebrew signal in non-exempt product path — FAIL if connected to public EN",
  };
}

function decodeSample(text) {
  // Show readable form for escaped sequences
  try {
    return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    );
  } catch {
    return text;
  }
}

/** @type {any[]} */
const hits = [];
let filesScanned = 0;

function walk(dir) {
  let ents;
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of ents) {
    if (SKIP_DIRS.has(e.name)) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(abs);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    if (!EXT.has(ext)) continue;
    filesScanned += 1;
    let txt;
    try {
      txt = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    if (!HE.test(txt) && !ESC_HE.test(txt)) continue;
    const rel = posix(path.relative(ROOT, abs));
    const lines = txt.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!HE.test(line) && !ESC_HE.test(line)) continue;
      const cls = classify(rel, line);
      hits.push({
        file: rel,
        line: i + 1,
        text: line.trim().slice(0, 240),
        textDecoded: decodeSample(line.trim()).slice(0, 240),
        classification: cls.classification,
        bucket: cls.bucket,
        reason: cls.reason,
        hasLiteralHebrew: HE.test(line),
        hasEscapedHebrew: ESC_HE.test(line),
      });
    }
  }
}

walk(ROOT);

const summary = {
  filesScanned,
  totalHits: hits.length,
  byClassification: {},
  forbiddenCount: 0,
  allowedCount: 0,
  technicalCount: 0,
  staleCount: 0,
  devTestDocCount: 0,
};
for (const h of hits) {
  summary.byClassification[h.classification] =
    (summary.byClassification[h.classification] || 0) + 1;
  if (h.classification === "forbidden") summary.forbiddenCount += 1;
  else if (h.classification === "allowed") summary.allowedCount += 1;
  else if (h.classification === "technical") summary.technicalCount += 1;
  else if (h.classification === "stale") summary.staleCount += 1;
  else if (h.classification === "dev-test-doc") summary.devTestDocCount += 1;
}

const forbidden = hits.filter((h) => h.classification === "forbidden");
const out = {
  generatedAt: new Date().toISOString(),
  summary,
  forbidden,
  hits,
};

fs.mkdirSync(path.join(ROOT, "docs/reports"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "docs/reports/en-final-hebrew-hard-scan.json"),
  JSON.stringify(out, null, 2)
);
console.log(JSON.stringify(summary, null, 2));
console.log("forbidden_files", [...new Set(forbidden.map((f) => f.file))]);
process.exit(forbidden.length ? 1 : 0);
