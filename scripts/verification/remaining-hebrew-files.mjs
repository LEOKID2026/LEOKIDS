/**
 * Remaining Hebrew files outside admin + import reachability.
 * Run: node scripts/verification/remaining-hebrew-files.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const HE = /[\u0590-\u05FF]/;
const ADMIN = [/^pages\/admin\//, /^pages\/api\/admin\//, /^components\/admin\//, /^lib\/admin-portal\//, /^lib\/admin-server\//];

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else out.push(f);
  }
  return out;
}

function isAdmin(rel) {
  return ADMIN.some((r) => r.test(rel));
}

/** Build import graph of all js/jsx files */
const allFiles = walk(root).filter((f) => /\.(js|jsx|mjs|cjs)$/.test(f));
const importGraph = new Map();
for (const file of allFiles) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  const text = fs.readFileSync(file, "utf8");
  const importers = [];
  for (const m of text.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    importers.push(m[1] || m[2]);
  }
  importGraph.set(rel, importers);
}

/** Reverse graph */
const importedBy = new Map();
for (const [from, specs] of importGraph) {
  for (const spec of specs) {
    if (!importedBy.has(spec)) importedBy.set(spec, []);
    importedBy.get(spec).push(from);
  }
}

const entryPoints = [
  ...walk(path.join(root, "pages")).filter((f) => /\.(js|jsx)$/.test(f)),
  path.join(root, "middleware.js"),
].map((f) => path.relative(root, f).split(path.sep).join("/"));

/** BFS from pages to find reachable files (approximate) */
const reachable = new Set();
const queue = [...entryPoints.filter((p) => fs.existsSync(path.join(root, p)))];
while (queue.length) {
  const rel = queue.shift();
  if (reachable.has(rel)) continue;
  reachable.add(rel);
  const specs = importGraph.get(rel) || [];
  for (const spec of specs) {
    if (spec.startsWith(".") || spec.startsWith("/")) {
      const base = path.normalize(path.join(path.dirname(rel), spec)).split(path.sep).join("/");
      for (const cand of [base, base + ".js", base + ".jsx", base + "/index.js"]) {
        if (fs.existsSync(path.join(root, cand)) && !reachable.has(cand)) queue.push(cand);
      }
    }
  }
}

/** @type {object[]} */
const rows = [];
for (const file of allFiles) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (isAdmin(rel)) continue;
  if (rel.startsWith("tests/") || rel.startsWith("scripts/")) continue;
  const text = fs.readFileSync(file, "utf8");
  if (!HE.test(text) && !/\.he\.(js|jsx)/.test(rel)) continue;
  const runtimeReachable = reachable.has(rel) || [...reachable].some((r) => r.includes(rel));
  let classification = "C";
  let reason = "Internal/tooling or unreachable from pages";
  if (/\.he\.(js|jsx|ts|tsx)$/.test(rel)) {
    classification = runtimeReachable ? "A" : "B";
    reason = runtimeReachable ? "Hebrew .he file reachable from pages — must convert" : "Hebrew .he archive; not reachable from page entry (verify admin-only imports)";
  } else if (runtimeReachable && HE.test(text)) {
    classification = "A";
    reason = "Hebrew content in runtime-reachable file";
  }
  rows.push({
    file: rel,
    hasHebrew: HE.test(text),
    isHeFile: /\.he\./.test(rel),
    runtimeReachable,
    classification,
    reason,
    allowlisted: classification === "C",
  });
}

const outDir = path.join(root, "tmp", "verification");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "remaining-hebrew-files.json"), JSON.stringify(rows, null, 2));

const a = rows.filter((r) => r.classification === "A");
console.log("Hebrew/he files outside admin:", rows.length);
console.log("Class A (runtime):", a.length);
console.log("Class B:", rows.filter((r) => r.classification === "B").length);
console.log("Class C:", rows.filter((r) => r.classification === "C").length);
a.slice(0, 25).forEach((r) => console.log(" A:", r.file, "-", r.reason));
console.log(`Wrote ${path.join(outDir, "remaining-hebrew-files.json")}`);
