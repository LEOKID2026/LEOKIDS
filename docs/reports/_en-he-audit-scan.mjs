#!/usr/bin/env node
/**
 * Independent EN Hebrew audit helper — write-only under docs/reports.
 */
import fs from "node:fs";
import path from "node:path";

const HE = /[\u0590-\u05FF]/;
const ESC = /\\u05[0-9a-fA-F]{2}/g;
const ROOT = process.cwd();
const SKIP = new Set([
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
]);
const ADMIN_RE = /(^|[/\\])(admin|admin-portal|admin-server)([/\\]|$)/i;

/** @type {{file:string,kind:string,samples:string[]}[]} */
const findings = [];

function classify(rel) {
  const n = rel.replace(/\\/g, "/");
  if (ADMIN_RE.test(n) || n.includes("/admin/")) return "admin";
  if (
    n.startsWith("tests/") ||
    n.startsWith("__tests__/") ||
    n.includes(".test.") ||
    n.includes(".spec.") ||
    n.includes("playwright")
  )
    return "tests";
  if (
    n.startsWith("docs/") ||
    n.startsWith("reports/") ||
    n.startsWith("artifacts/") ||
    n.startsWith(".cursor/")
  )
    return "docs";
  if (n.startsWith("scripts/") || n.startsWith("sql/")) return "scripts";
  if (
    n.includes("/prototypes/") ||
    n.startsWith("lib/dev/") ||
    n.includes("/dev/")
  )
    return "dev_prototypes";
  if (
    n.endsWith(".he.js") ||
    n.endsWith(".he.json") ||
    n.includes("/locales/he/") ||
    n.includes("/content-packs/he/")
  )
    return "hebrew_named";
  if (
    n.startsWith("locales/en") ||
    n.startsWith("content-packs/en") ||
    n.startsWith("components/") ||
    n.startsWith("pages/") ||
    n.startsWith("lib/") ||
    n.startsWith("utils/") ||
    n.startsWith("hooks/") ||
    n.startsWith("contexts/") ||
    n.startsWith("data/") ||
    n.startsWith("curriculum/") ||
    n.startsWith("public/") ||
    n.startsWith("styles/") ||
    n.startsWith("workers/")
  )
    return "public_surface";
  return "other";
}

function sampleLines(txt, pred, max = 3) {
  const out = [];
  for (const [i, line] of txt.split(/\r?\n/).entries()) {
    if (pred(line)) {
      out.push(`L${i + 1}: ${line.trim().slice(0, 180)}`);
      if (out.length >= max) break;
    }
  }
  return out;
}

function walk(d) {
  let ents;
  try {
    ents = fs.readdirSync(d, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of ents) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      walk(p);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    if (!EXT.has(ext)) continue;
    let txt;
    try {
      txt = fs.readFileSync(p, "utf8");
    } catch {
      continue;
    }
    const rel = path.relative(ROOT, p).split(path.sep).join("/");
    const kind = classify(rel);
    const hasLit = HE.test(txt);
    const escMatches = [...txt.matchAll(ESC)];
    if (!hasLit && escMatches.length === 0) continue;
    findings.push({
      file: rel,
      kind,
      hasLiteral: hasLit,
      escapeCount: escMatches.length,
      samples: sampleLines(
        txt,
        (line) => HE.test(line) || ESC.test(line) || /\\u05/.test(line)
      ),
    });
  }
}

walk(ROOT);

const byKind = {};
for (const f of findings) {
  byKind[f.kind] = byKind[f.kind] || [];
  byKind[f.kind].push(f);
}

const summary = Object.fromEntries(
  Object.entries(byKind).map(([k, v]) => [
    k,
    {
      count: v.length,
      literal: v.filter((x) => x.hasLiteral).length,
      escapedOnly: v.filter((x) => !x.hasLiteral && x.escapeCount).length,
      files: v.map((x) => x.file),
    },
  ])
);

const out = {
  generatedAt: new Date().toISOString(),
  totalFilesWithHebrewSignal: findings.length,
  summary,
  public_surface: byKind.public_surface || [],
  hebrew_named: byKind.hebrew_named || [],
  dev_prototypes: byKind.dev_prototypes || [],
  other: byKind.other || [],
};

fs.mkdirSync(path.join(ROOT, "docs/reports"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "docs/reports/en-hebrew-independent-static-scan.json"),
  JSON.stringify(out, null, 2)
);
console.log(JSON.stringify({ total: findings.length, summary }, null, 2));
