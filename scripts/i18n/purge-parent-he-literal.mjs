/**
 * Second-pass purge: strip literal Hebrew (U+0590–U+05FF) and remaining \u05xx
 * from specific files that failed/stubbed or still contain HE matchers.
 * Keeps Latin EN/ES matchers.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const FILES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "utils/parent-copilot/guardrail-validator.js",
      "utils/parent-copilot/intent-answer-composers.js",
      "utils/parent-copilot/no-data-request-response.js",
      "utils/parent-copilot/question-classifier.js",
      "utils/parent-copilot/semantic-question-class.js",
      "utils/parent-copilot/stage-a-freeform-interpretation.js",
      "utils/parent-report-language/pedagogy-glossary.js",
      // Also re-scan dirs for any remaining HE (literal or escape)
    ];

const HE_CHAR = /[\u0590-\u05FF]/;
const HE_CHAR_G = /[\u0590-\u05FF]+/g;
const HE_ESC_G = /\\u05[0-9A-Fa-f]{2}/gi;
const HE_CLASS = /\[\\u0590-\\u05[Ff]{2}\]|\[\u0590-\u05FF\]/g;

function hasHe(src) {
  return HE_CHAR.test(src) || /\\u05[0-9A-Fa-f]{2}/i.test(src) || /\\u0590/i.test(src);
}

function cleanRegexBody(body) {
  let b = body.replace(HE_ESC_G, "").replace(HE_CHAR_G, "");
  b = b.replace(HE_CLASS, "[^\\s\\S]");
  for (let i = 0; i < 10; i++) {
    const prev = b;
    b = b.replace(/\|\|/g, "|");
    b = b.replace(/\(\|/g, "(");
    b = b.replace(/\|\)/g, ")");
    b = b.replace(/\(\?:\|/g, "(?:");
    b = b.replace(/\|(?=\))/g, "");
    b = b.replace(/(?<=\()\|/g, "");
    if (b === prev) break;
  }
  b = b.replace(/^\|+/, "").replace(/\|+$/, "");
  // If no Latin letters/digits left → never match
  if (!/[a-zA-Z0-9]/.test(b)) return "(?!)";
  return b || "(?!)";
}

function transform(src) {
  let out = src;

  // Regex literals containing HE
  out = out.replace(/\/((?:\\.|\[(?:\\.|[^\]])*\]|[^/[\\])+?)\/([gimsuyvd]*)/g, (full, body, flags) => {
    if (!HE_CHAR.test(body) && !/\\u05/i.test(body) && !/\\u0590/i.test(body)) return full;
    return `/${cleanRegexBody(body)}/${flags}`;
  });

  // String literals: strip HE chars/escapes; empty if nothing Latin left
  out = out.replace(/"((?:\\.|[^"\\])*)"/g, (full, inner) => {
    if (!HE_CHAR.test(inner) && !/\\u05/i.test(inner)) return full;
    let cleaned = inner.replace(HE_ESC_G, "").replace(HE_CHAR_G, "");
    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
    if (!/[a-zA-Z0-9]/.test(cleaned)) return '""';
    return `"${cleaned}"`;
  });

  out = out.replace(/'((?:\\.|[^'\\])*)'/g, (full, inner) => {
    if (!HE_CHAR.test(inner) && !/\\u05/i.test(inner)) return full;
    let cleaned = inner.replace(HE_ESC_G, "").replace(HE_CHAR_G, "");
    if (!/[a-zA-Z0-9]/.test(cleaned)) return "''";
    return `'${cleaned}'`;
  });

  // Template literals (simple): strip HE
  out = out.replace(/`((?:\\.|[^`\\])*)`/g, (full, inner) => {
    if (!HE_CHAR.test(inner) && !/\\u05/i.test(inner)) return full;
    const cleaned = inner.replace(HE_ESC_G, "").replace(HE_CHAR_G, "");
    return `\`${cleaned}\``;
  });

  // Comments with HE
  out = out.replace(/\/\*[\s\S]*?\*\//g, (block) => {
    if (!HE_CHAR.test(block) && !/\\u05/i.test(block)) return block;
    return block.replace(HE_CHAR_G, "").replace(HE_ESC_G, "");
  });
  out = out.replace(/\/\/[^\n]*/g, (line) => {
    if (!HE_CHAR.test(line) && !/\\u05/i.test(line)) return line;
    return line.replace(HE_CHAR_G, "").replace(HE_ESC_G, "");
  });

  // Any remaining
  out = out.replace(HE_ESC_G, "").replace(HE_CHAR_G, "");
  out = out.replace(HE_CLASS, "[^\\s\\S]");

  out = out.replace(/\|\|/g, "|");
  out = out.replace(/\(\|/g, "(");
  out = out.replace(/\|\)/g, ")");
  out = out.replace(/\/\|/g, "/");
  out = out.replace(/\|\//g, "/");

  out = out.replace(
    /const\s+(HEB_LETTER|HEBREW_CHAR|HE_LETTER|HEBREW_LETTER)\s*=\s*\/[^;\n]+/g,
    "const $1 = /(?!)/"
  );

  return out;
}

function nuclear(src) {
  let out = src;
  out = out.replace(/\/((?:\\.|\[(?:\\.|[^\]])*\]|[^/[\\])+?)\/([gimsuyvd]*)/g, (full, body, flags) => {
    if (HE_CHAR.test(body) || /\\u05/i.test(body) || /\\u0590/i.test(body)) return `/(?!)/${flags}`;
    return full;
  });
  out = out.replace(HE_CHAR_G, "").replace(HE_ESC_G, "");
  out = out.replace(/\|\|/g, "|").replace(/\(\|/g, "(").replace(/\|\)/g, ")");
  return out;
}

function nodeCheck(p) {
  const r = spawnSync(process.execPath, ["--check", p], { encoding: "utf8" });
  return { ok: r.status === 0, err: (r.stderr || "").slice(0, 300) };
}

function walk(dirRel) {
  const abs = path.join(ROOT, dirRel);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dirRel}/${ent.name}`.replace(/\\/g, "/");
    if (ent.isDirectory()) out.push(...walk(rel));
    else if (/\.(js|mjs)$/.test(ent.name)) out.push(rel);
  }
  return out;
}

let targets = FILES.filter((f) => !f.startsWith("-"));
if (targets.includes("--all-dirs")) {
  targets = [
    ...walk("utils/parent-copilot"),
    ...walk("utils/parent-report-language"),
    ...walk("utils/parent-narrative-safety"),
    ...walk("utils/learning-pattern-decision"),
  ].filter((r) => r !== "utils/parent-report-language/parent-facing-normalize.js");
}

const report = { purged: [], nuclear: [], skipped: [], failed: [] };

for (const rel of targets) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    report.skipped.push(rel);
    continue;
  }
  const backup = fs.readFileSync(abs, "utf8");
  if (!hasHe(backup)) {
    report.skipped.push(rel);
    continue;
  }
  let next = transform(backup);
  fs.writeFileSync(abs, next, "utf8");
  let check = nodeCheck(abs);
  if (!check.ok) {
    next = nuclear(backup);
    fs.writeFileSync(abs, next, "utf8");
    check = nodeCheck(abs);
    if (!check.ok) {
      fs.writeFileSync(abs, backup, "utf8");
      report.failed.push({ rel, err: check.err });
      continue;
    }
    report.nuclear.push(rel);
  } else {
    report.purged.push(rel);
  }
}

console.log(JSON.stringify(report, null, 2));
if (report.failed.length) process.exit(1);
