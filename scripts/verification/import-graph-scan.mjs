/**
 * Import graph + runtime pattern scan.
 * Run: node scripts/verification/import-graph-scan.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "verification");
fs.mkdirSync(outDir, { recursive: true });

const ADMIN_ALLOW = [
  /^pages\/admin\//,
  /^pages\/api\/admin\//,
  /^components\/admin\//,
  /^lib\/admin-portal\//,
  /^lib\/admin-server\//,
];

const PATTERNS = [
  { id: "he_import", re: /(?:from|import|require)\s*\(?['"][^'"]*\.he(?:\.[a-z]+)?['"]/gi },
  { id: "title_he", re: /\btitle_he\b/g },
  { id: "blurb_he", re: /\bblurb_he\b/g },
  { id: "bookTitleHe", re: /\bbookTitleHe\b/g },
  { id: "titleHe", re: /\btitleHe\b/g },
  { id: "gradeShortLabel", re: /\bgradeShortLabel\b/g },
  { id: "he_il", re: /he-IL/gi },
];

const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const SCAN = ["pages", "components", "lib", "hooks", "utils", "data", "middleware.js"];

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  const st = fs.statSync(d);
  if (st.isFile()) {
    out.push(d);
    return out;
  }
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    walk(path.join(d, e.name), out);
  }
  return out;
}

function isAdmin(rel) {
  return ADMIN_ALLOW.some((r) => r.test(rel));
}

/** @type {Map<string, { rel: string, line: number, snippet: string }[]>} */
const findings = new Map();
/** @type {Set<string>} */
const brokenHeImports = new Set();

for (const base of SCAN) {
  const abs = path.join(root, base);
  if (!fs.existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (![...EXT].some((e) => rel.endsWith(e))) continue;
    const text = fs.readFileSync(file, "utf8");
    text.split(/\r?\n/).forEach((line, i) => {
      for (const { id, re } of PATTERNS) {
        re.lastIndex = 0;
        if (!re.test(line)) continue;
        if (isAdmin(rel) && id !== "he_import") continue;
        const key = `${rel}:${id}`;
        if (!findings.has(key)) findings.set(key, []);
        findings.get(key).push({ rel, line: i + 1, snippet: line.trim().slice(0, 140) });
      }
      const imp = line.match(/(?:from|import)\s+['"]([^'"]+\.he[^'"]*)['"]|require\s*\(\s*['"]([^'"]+\.he[^'"]*)['"]\s*\)/);
      if (imp) {
        const spec = imp[1] || imp[2];
        const resolved = path.normalize(path.join(path.dirname(file), spec));
        const candidates = [
          resolved,
          resolved + ".js",
          resolved + ".jsx",
          path.join(resolved, "index.js"),
        ];
        if (!candidates.some((c) => fs.existsSync(c)) && !isAdmin(rel)) {
          brokenHeImports.add(`${rel} → ${spec}`);
        }
      }
    });
  }
}

/** @type {object[]} */
const flat = [];
for (const [key, items] of findings) {
  for (const item of items.slice(0, 3)) {
    flat.push({ pattern: key.split(":").pop(), ...item, count: items.length });
  }
}

const report = {
  brokenHeImports: [...brokenHeImports].sort(),
  findingGroups: findings.size,
  findings: flat.sort((a, b) => a.rel.localeCompare(b.rel)),
};

fs.writeFileSync(path.join(outDir, "import-graph-scan.json"), JSON.stringify(report, null, 2));

console.log("Broken .he imports:", report.brokenHeImports.length);
report.brokenHeImports.slice(0, 15).forEach((x) => console.log(" ", x));
console.log("Pattern finding groups:", report.findingGroups);
const nonAdminTitleHe = flat.filter((f) => f.pattern === "titleHe" && !isAdmin(f.rel));
console.log("Non-admin titleHe refs:", nonAdminTitleHe.length);
console.log(`Wrote ${path.join(outDir, "import-graph-scan.json")}`);

if (report.brokenHeImports.length) process.exit(1);
