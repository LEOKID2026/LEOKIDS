/**
 * Scan product paths for Hebrew Unicode (excludes admin/dev/prototypes).
 */
import fs from "fs";
import path from "path";

const HE = /[\u0590-\u05FF]/;
const EXCLUDE =
  /(^|[/\\])(admin|dev|prototypes|prototype|node_modules|\.next|exports|docs)([/\\]|$)/i;
const ROOTS = [
  "data",
  "utils",
  "lib",
  "pages",
  "components",
  "content-packs",
  "locales",
  "hooks",
  "tests",
];

const hits = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    const rel = path.relative(process.cwd(), p).replace(/\\/g, "/");
    if (EXCLUDE.test(rel)) continue;
    if (ent.isDirectory()) {
      walk(p);
      continue;
    }
    if (!/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) continue;
    const text = fs.readFileSync(p, "utf8");
    const matches = text.match(/[\u0590-\u05FF]/g);
    if (matches?.length) {
      hits.push({ file: rel, count: matches.length });
    }
  }
}

for (const r of ROOTS) walk(r);
hits.sort((a, b) => b.count - a.count);
console.log(JSON.stringify({ files: hits.length, top: hits.slice(0, 60) }, null, 2));
