import fs from "fs";
import path from "path";

const ALLOW =
  /(^|[/\\])(admin|dev|prototypes|prototype)([/\\]|$)|[/\\]admin-|dev-student-simulator|curriculum-oracle|language-review/i;
const SUBJ = /["'](hebrew|moledet[_-]geography|moledet_geography|moledet)["']/gi;
const ROOTS = ["utils", "lib", "pages", "components", "hooks", "content-packs", "locales", "data"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs"]);

const hits = [];
function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(d, e.name);
    const rel = path.relative(process.cwd(), p).replace(/\\/g, "/");
    if (ALLOW.test(rel)) continue;
    if (e.isDirectory()) walk(p);
    else if (/\.(js|mjs|jsx|json)$/.test(e.name)) {
      const t = fs.readFileSync(p, "utf8");
      const m = [...t.matchAll(SUBJ)];
      if (m.length) hits.push({ rel, n: m.length, sample: [...new Set(m.map((x) => x[1]))] });
    }
  }
}
for (const r of ROOTS) walk(r);
hits.sort((a, b) => b.n - a.n);
console.log(JSON.stringify({ files: hits.length, top: hits.slice(0, 50) }, null, 2));
