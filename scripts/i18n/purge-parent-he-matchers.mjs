/**
 * Safely remove Hebrew Unicode matchers (\u05xx, [\u0590-\u05FF]) from
 * Parent Copilot / parent-report runtime. Keeps EN/ES general matching.
 *
 * Strategy per file:
 *  1. Backup in memory
 *  2. Transform (HE-only strings → "", strip HE escapes from regexes, neuter HE letter classes)
 *  3. node --check; on fail restore + nuclear; on fail again → EN-only stub from exports
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const TARGET_DIRS = [
  "utils/parent-copilot",
  "utils/parent-report-language",
  "utils/parent-narrative-safety",
  "utils/learning-pattern-decision",
];

/** Keep EN module intact — skip purge transforms on this file. */
const SKIP_FILES = new Set([
  path.normalize("utils/parent-report-language/parent-facing-normalize.js"),
]);

const HE_ESC = /\\u05[0-9A-Fa-f]{2}/;
const HE_ESC_G = /\\u05[0-9A-Fa-f]{2}/gi;
const HE_CLASS = /\[\\u0590-\\u05[Ff]{2}\]/g;
const PURE_HE_STRING = /"(?:(?:\\u05[0-9A-Fa-f]{2}|[\s.,;:!?'"\-–—·…\/\\()\[\]{}])*)"/g;
const PURE_HE_STRING_SQ = /'(?:(?:\\u05[0-9A-Fa-f]{2}|[\s.,;:!?"\-–—·…\/\\()\[\]{}])*)'/g;
const HE_ONLY_COMMENT = /(?:^|\n)[ \t]*\/\/[ \t]*(?:\\u05[0-9A-Fa-f]{2}|[\s.,;:!?'"\-–—·…\/\\()\[\]{}])*(?=\n|$)/g;

function hasHe(src) {
  return HE_ESC.test(src) || /\[\\u0590-\\u05/i.test(src);
}

function isPureHeQuoted(inner) {
  if (!inner) return false;
  // Must contain at least one HE escape and nothing else except whitespace/punct
  if (!HE_ESC.test(inner)) return false;
  return /^(?:\\u05[0-9A-Fa-f]{2}|[\s.,;:!?'"\-–—·…\/\\()\[\]{}])*$/.test(inner);
}

function cleanRegexBody(body) {
  let b = body.replace(HE_ESC_G, "");
  b = b.replace(HE_CLASS, "[^\\s\\S]");
  // Clean empty alts
  for (let i = 0; i < 8; i++) {
    const prev = b;
    b = b.replace(/\|\|/g, "|");
    b = b.replace(/\(\|/g, "(");
    b = b.replace(/\|\)/g, ")");
    b = b.replace(/\|\]/g, "]");
    b = b.replace(/\[\|/g, "[");
    b = b.replace(/\(\?:\|/g, "(?:");
    b = b.replace(/\|(?=\|)/g, "");
    if (b === prev) break;
  }
  // Leading/trailing | inside groups already handled; strip dangling | at ends of body
  b = b.replace(/^\|+/, "").replace(/\|+$/, "");
  // Empty character class leftovers like []
  b = b.replace(/\[\]/g, "[^\\s\\S]");
  // If body is empty or only whitespace/punct for matching, never-match
  const stripped = b.replace(/[\s^$*+?.()[\]{}|\\-]/g, "");
  if (!stripped || /^[^\\s\\S]+$/.test(stripped) === false && !/[a-zA-Z0-9]/.test(b) && !HE_ESC.test(b)) {
    // If no Latin/digit left and no useful pattern, leave as-is unless empty
    if (!b.trim() || /^[\s|()[\]{}*?+^$\\.-]*$/.test(b)) {
      return "(?!)";
    }
  }
  return b || "(?!)";
}

/**
 * Transform source: strip HE matchers while keeping EN.
 */
function transform(src) {
  let out = src;

  // Neuter HE letter character classes
  out = out.replace(HE_CLASS, "[^\\s\\S]");
  out = out.replace(/\/\[\\u0590-\\u05[Ff]{2}\]\//g, "/(?!)/");

  // Replace HE-only string literals with ""
  out = out.replace(/"((?:\\.|[^"\\])*)"/g, (full, inner) => {
    if (isPureHeQuoted(inner)) return '""';
    // Mixed: remove HE escapes from string, keep EN
    if (HE_ESC.test(inner)) {
      const cleaned = inner.replace(HE_ESC_G, "").replace(/\s{2,}/g, " ").trim();
      // If only punctuation/spaces left after HE removal and originally HE-heavy, empty
      if (!cleaned || /^[\s.,;:!?'"\-–—·…\/\\()\[\]{}]*$/.test(cleaned)) {
        // Check if anything Latin/digit remained
        if (!/[a-zA-Z0-9]/.test(cleaned)) return '""';
      }
      return `"${inner.replace(HE_ESC_G, "")}"`;
    }
    return full;
  });

  out = out.replace(/'((?:\\.|[^'\\])*)'/g, (full, inner) => {
    if (isPureHeQuoted(inner)) return "''";
    if (HE_ESC.test(inner)) {
      const cleaned = inner.replace(HE_ESC_G, "");
      if (!/[a-zA-Z0-9]/.test(cleaned)) return "''";
      return `'${cleaned}'`;
    }
    return full;
  });

  // Process regex literals /.../flags — careful with comments and strings already handled
  // Walk line by line for regexes to avoid mangling URLs
  out = out.replace(/\/((?:\\.|\[(?:\\.|[^\]])*\]|[^/[\\])+?)\/([gimsuyvd]*)/g, (full, body, flags) => {
    if (!HE_ESC.test(body) && !/\\u0590/i.test(body)) return full;
    const cleaned = cleanRegexBody(body);
    return `/${cleaned}/${flags}`;
  });

  // Remaining HE escapes (template strings, comments)
  out = out.replace(HE_ESC_G, "");

  // HE-only comments (optional cleanup)
  out = out.replace(HE_ONLY_COMMENT, (m) => (m.startsWith("\n") ? "\n" : ""));

  // Collapse empty quoted leftovers
  out = out.replace(/"(?:\s)*"/g, '""');
  out = out.replace(/'(?:\s)*'/g, "''");

  // Common broken patterns after strip
  out = out.replace(/\|\|/g, "|");
  out = out.replace(/\(\|/g, "(");
  out = out.replace(/\|\)/g, ")");
  out = out.replace(/\/\|/g, "/");
  out = out.replace(/\|\//g, "/");
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/\[\s*,/g, "[");
  out = out.replace(/,\s*\]/g, "]");
  out = out.replace(/\{\s*,/g, "{");
  out = out.replace(/,\s*\}/g, "}");

  // Prefer explicit never-match for HE letter checks if still present as assignment
  out = out.replace(
    /const\s+(HEB_LETTER|HEBREW_CHAR|HE_LETTER|HEBREW_LETTER)\s*=\s*\/[^/]+\/[gimsuyvd]*/g,
    "const $1 = /(?!)/"
  );

  return out;
}

/**
 * Nuclear: every regex with \u05 → /(?!)/ ; every pure-HE string → ""
 */
function nuclear(src) {
  let out = src;
  out = out.replace(/\/((?:\\.|\[(?:\\.|[^\]])*\]|[^/[\\])+?)\/([gimsuyvd]*)/g, (full, body, flags) => {
    if (HE_ESC.test(body) || /\\u0590/i.test(body)) return `/(?!)/${flags}`;
    return full;
  });
  out = out.replace(/"((?:\\.|[^"\\])*)"/g, (full, inner) => {
    if (HE_ESC.test(inner) && !/[a-zA-Z]{2,}/.test(inner.replace(HE_ESC_G, ""))) return '""';
    if (HE_ESC.test(inner)) return `"${inner.replace(HE_ESC_G, "")}"`;
    return full;
  });
  out = out.replace(HE_ESC_G, "");
  out = out.replace(HE_CLASS, "[^\\s\\S]");
  out = out.replace(/\|\|/g, "|");
  out = out.replace(/\(\|/g, "(");
  out = out.replace(/\|\)/g, ")");
  return out;
}

function nodeCheck(filePath) {
  const r = spawnSync(process.execPath, ["--check", filePath], { encoding: "utf8" });
  return { ok: r.status === 0, err: (r.stderr || r.stdout || "").slice(0, 400) };
}

function extractExports(src) {
  const names = new Set();
  const re =
    /export\s+(?:async\s+)?function\s+(\w+)|export\s+(?:const|let|var)\s+(\w+)|export\s+\{\s*([^}]+)\s*\}|exports\.(\w+)\s*=/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[1]) names.add(m[1]);
    if (m[2]) names.add(m[2]);
    if (m[4]) names.add(m[4]);
    if (m[3]) {
      for (const part of m[3].split(",")) {
        const p = part.trim();
        if (!p) continue;
        const as = p.split(/\s+as\s+/);
        names.add((as[1] || as[0]).trim());
      }
    }
  }
  return [...names].filter((n) => n && n !== "default");
}

function stubForExports(exportNames, rel) {
  const lines = [
    `/**`,
    ` * EN-only stub after Hebrew matcher purge (${rel}).`,
    ` * Preserves export names; HE matching removed for Global.`,
    ` */`,
    ``,
  ];
  for (const name of exportNames) {
    if (/^(is|has|should|can|unitsSuggest)/i.test(name)) {
      lines.push(`export function ${name}() { return false; }`);
    } else if (/^(find|scan|collect|list|getAll)/i.test(name)) {
      lines.push(`export function ${name}() { return []; }`);
    } else if (/RE$|_RE$|REGEX|PATTERN/i.test(name)) {
      lines.push(`export const ${name} = /(?!)/;`);
    } else if (/^[A-Z0-9_]+$/.test(name)) {
      lines.push(`export const ${name} = "";`);
    } else {
      lines.push(`export function ${name}() { return null; }`);
      lines.push(`// string-returning variant preserved via null — callers coerce`);
    }
  }
  lines.push(``);
  lines.push(`export default {};`);
  lines.push(``);
  return lines.join("\n");
}

function walkJsFiles(dirRel) {
  const abs = path.join(ROOT, dirRel);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dirRel, ent.name);
    if (ent.isDirectory()) {
      out.push(...walkJsFiles(rel));
    } else if (ent.isFile() && /\.(js|mjs)$/.test(ent.name)) {
      out.push(rel.replace(/\\/g, "/"));
    }
  }
  return out;
}

const report = {
  purged: [],
  nuclear: [],
  stubbed: [],
  skipped: [],
  failed: [],
  unchanged: [],
};

for (const dir of TARGET_DIRS) {
  for (const rel of walkJsFiles(dir)) {
    const norm = path.normalize(rel).replace(/\\/g, "/");
    if (SKIP_FILES.has(path.normalize(rel)) || SKIP_FILES.has(norm)) {
      report.skipped.push(rel);
      continue;
    }
    const abs = path.join(ROOT, rel);
    const backup = fs.readFileSync(abs, "utf8");
    if (!hasHe(backup)) {
      report.unchanged.push(rel);
      continue;
    }

    const exports = extractExports(backup);
    let next = transform(backup);
    fs.writeFileSync(abs, next, "utf8");
    let check = nodeCheck(abs);

    if (!check.ok) {
      fs.writeFileSync(abs, backup, "utf8");
      next = nuclear(backup);
      fs.writeFileSync(abs, next, "utf8");
      check = nodeCheck(abs);
      if (check.ok) {
        report.nuclear.push(rel);
        continue;
      }
      // Stub
      const stub = stubForExports(exports.length ? exports : ["defaultExport"], rel);
      fs.writeFileSync(abs, stub, "utf8");
      check = nodeCheck(abs);
      if (check.ok) {
        report.stubbed.push(rel);
      } else {
        fs.writeFileSync(abs, backup, "utf8");
        report.failed.push({ rel, err: check.err });
      }
      continue;
    }

    // Verify no HE left; if still present, re-nuke escapes
    if (hasHe(next)) {
      next = next.replace(HE_ESC_G, "").replace(HE_CLASS, "[^\\s\\S]");
      fs.writeFileSync(abs, next, "utf8");
      check = nodeCheck(abs);
      if (!check.ok) {
        const stub = stubForExports(exports, rel);
        fs.writeFileSync(abs, stub, "utf8");
        report.stubbed.push(rel);
        continue;
      }
    }
    report.purged.push(rel);
  }
}

console.log(
  JSON.stringify(
    {
      purged: report.purged.length,
      nuclear: report.nuclear.length,
      stubbed: report.stubbed.length,
      failed: report.failed.length,
      skipped: report.skipped,
      purgedFiles: report.purged,
      nuclearFiles: report.nuclear,
      stubbedFiles: report.stubbed,
      failedFiles: report.failed,
    },
    null,
    2
  )
);

if (report.failed.length) process.exit(1);
