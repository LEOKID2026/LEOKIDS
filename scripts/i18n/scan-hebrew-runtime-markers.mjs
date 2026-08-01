/**
 * Scan Global product for residual Hebrew runtime markers.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ALLOW =
  /(^|[/\\])(admin|dev|prototypes|prototype)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|lib[/\\]auth[/\\][^/\\]+\.he\.js$/i;

const SCAN = ["data", "utils", "lib", "pages", "components", "content-packs", "locales", "hooks"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review"]);

const PATTERNS = {
  literalHe: /[\u0590-\u05FF]/,
  escapedHe: /\\u05[0-9a-fA-F]{2}/,
  heRange: /\\u0590|\\u05FF|\[\\u0590-\\u05FF\]/,
  en_to_he: /\ben_to_he\b/,
  he_to_en: /\bhe_to_en\b/,
  wordHe: /\bwordHe\b/,
  sentenceHe: /\bsentenceHe\b/,
  subjectLabelHe: /\bsubjectLabelHe\b/,
  findHebrewMeaning: /\bfindHebrewMeaning\b/,
  heLocale: /he-IL|\.startsWith\(\s*["']he["']\)|locale\s*===\s*["']he["']|===\s*["']he-IL["']/,
  heImports: /utterance-normalize-he|conversational-reply-class-he|parent-facing-normalize-he|contextual-follow-up-he|hebrew-display-labels|classroom-skill-labels-he|isHebrewInstructionLocale/,
  israeliSubjects: /"hebrew"\s*:|"moledet-geography"|moledet_geography|"history"\s*:\s*\{/,
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    const rel = path.relative(ROOT, p).replace(/\\/g, "/");
    if (ALLOW.test(rel)) continue;
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) out.push(rel);
  }
  return out;
}

const files = SCAN.flatMap((r) => walk(path.join(ROOT, r)));
/** @type {Record<string, string[]>} */
const hits = Object.fromEntries(Object.keys(PATTERNS).map((k) => [k, []]));

for (const rel of files) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const [name, re] of Object.entries(PATTERNS)) {
    if (re.test(text)) hits[name].push(rel);
  }
}

// He-named filenames
const heNamed = files.filter((f) => {
  const base = path.basename(f);
  // Avoid false positives like *cache.js matching /He\.js$/i
  return (
    /(^|[^a-zA-Z])He\.(js|mjs)$/.test(base) ||
    /-he\.(js|mjs)$/i.test(base) ||
    /\.he\.(js|mjs)$/i.test(base) ||
    /_he\.(js|mjs)$/i.test(base) ||
    /hebrew/i.test(base)
  );
});

console.log(
  JSON.stringify(
    {
      scanned: files.length,
      heNamedFiles: heNamed,
      counts: Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, v.length])),
      samples: Object.fromEntries(
        Object.entries(hits).map(([k, v]) => [k, v.slice(0, 25)])
      ),
    },
    null,
    2
  )
);
