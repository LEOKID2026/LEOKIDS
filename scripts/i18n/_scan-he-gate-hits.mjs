import fs from "node:fs";
import path from "node:path";

const ALLOW =
  /(^|[/\\])(admin|dev|prototypes|prototype)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|lib[/\\]auth[/\\][^/\\]+\.he\.js$/i;

const MARKERS = {
  literalHe: /[\u0590-\u05FF]/,
  heLocaleBranch:
    /he-IL|\.startsWith\(\s*["']he["']\)|locale\s*===\s*["']he["']|===\s*["']he-IL["']/,
  israeliSubjectId: /["'](hebrew|moledet[_-]geography|moledet_geography)["']/,
};

const SCAN = ["data", "utils", "lib", "pages", "components", "content-packs", "locales", "hooks"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review", "tmp"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    const rel = path.relative(process.cwd(), p).split(path.sep).join("/");
    if (ALLOW.test(rel)) continue;
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) out.push(rel);
  }
  return out;
}

const files = [];
for (const r of SCAN) walk(path.join(process.cwd(), r), files);

const lit = [];
const branch = [];
const named = [];
const israeli = [];
for (const rel of files) {
  const text = fs.readFileSync(rel, "utf8");
  if (MARKERS.literalHe.test(text)) lit.push(rel);
  if (MARKERS.heLocaleBranch.test(text)) branch.push(rel);
  if (MARKERS.israeliSubjectId.test(text)) israeli.push(rel);
  const base = path.basename(rel);
  if (
    /(^|[-_.])he\.js$/i.test(base) ||
    /-he\.js$/i.test(base) ||
    /\.he\.js$/i.test(base) ||
    /hebrew/i.test(base)
  ) {
    named.push(rel);
  }
}

console.log(
  JSON.stringify(
    {
      lit,
      branch: branch.slice(0, 30),
      named,
      israeli: israeli.slice(0, 30),
    },
    null,
    2
  )
);
