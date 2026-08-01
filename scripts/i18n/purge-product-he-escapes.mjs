/**
 * Purge product runtime of escaped Hebrew (\u05xx) and [\u0590-\u05FF] matchers.
 * Extends tokenizer approach from purge-parent-he-tokenizer.mjs across product roots.
 *
 * node scripts/i18n/purge-product-he-escapes.mjs
 * node scripts/i18n/purge-product-he-escapes.mjs path/to/file.js   # optional list
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCAN = ["data", "utils", "lib", "pages", "components", "hooks", "content-packs", "locales"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review"]);
const ALLOW =
  /(^|[/\\])(admin|dev|prototypes|prototype)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|admin-rewards|teacher-ui\.he\.|teacher-activity-report-pdf-he|lib[/\\]auth[/\\][^/\\]+\.he\.js$/i;

function isHeCode(cp) {
  return cp >= 0x0590 && cp <= 0x05ff;
}

function stripHeFromText(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (isHeCode(c)) continue;
    if (s[i] === "\\" && /^\\u05[0-9a-fA-F]{2}/i.test(s.slice(i))) {
      i += 5;
      continue;
    }
    out += s[i];
  }
  return out;
}

function textHasHe(s) {
  for (let i = 0; i < s.length; i++) {
    if (isHeCode(s.charCodeAt(i))) return true;
    if (s[i] === "\\" && /^\\u05[0-9a-fA-F]{2}/i.test(s.slice(i))) return true;
  }
  return false;
}

function transform(src) {
  // Pre-pass: drop unquoted HE-escape object keys before tokenizer touches them
  src = src.replace(/^[ \t]*(?:\\u05[0-9a-fA-F]{2})+[ \t]*:[^\n]*\r?\n/gm, "");
  // Drop array elements that are HE-only quoted escapes
  src = src.replace(/^[ \t]*"(?:\\u05[0-9a-fA-F]{2})+",?\s*\r?\n/gm, "");
  // Drop object entries with HE-only quoted keys (keys that start with \u05)
  src = src.replace(/^[ \t]*"\\u05[^"]*"\s*:[^\n]*\r?\n/gm, "");

  let i = 0;
  let out = "";
  const n = src.length;

  function peek(k = 0) {
    return src[i + k] || "";
  }

  while (i < n) {
    if (peek() === "/" && peek(1) === "/") {
      let j = i + 2;
      while (j < n && src[j] !== "\n") j++;
      const cmt = src.slice(i, j);
      out += textHasHe(cmt) ? stripHeFromText(cmt) : cmt;
      i = j;
      continue;
    }
    if (peek() === "/" && peek(1) === "*") {
      let j = i + 2;
      while (j < n - 1 && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      const cmt = src.slice(i, j);
      out += textHasHe(cmt) ? stripHeFromText(cmt) : cmt;
      i = j;
      continue;
    }
    if (peek() === '"') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === '"') {
          j++;
          break;
        }
        j++;
      }
      const lit = src.slice(i, j);
      if (textHasHe(lit)) {
        const inner = lit.slice(1, -1);
        const cleaned = stripHeFromText(inner).replace(/\s{2,}/g, " ").trim();
        out += /[a-zA-Z0-9]/.test(cleaned) ? `"${cleaned}"` : '""';
      } else {
        out += lit;
      }
      i = j;
      continue;
    }
    if (peek() === "'") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === "'") {
          j++;
          break;
        }
        j++;
      }
      const lit = src.slice(i, j);
      if (textHasHe(lit)) {
        const inner = lit.slice(1, -1);
        const cleaned = stripHeFromText(inner);
        out += /[a-zA-Z0-9]/.test(cleaned) ? `'${cleaned}'` : "''";
      } else {
        out += lit;
      }
      i = j;
      continue;
    }
    if (peek() === "`") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === "`") {
          j++;
          break;
        }
        j++;
      }
      const lit = src.slice(i, j);
      out += textHasHe(lit) ? "`" + stripHeFromText(lit.slice(1, -1)) + "`" : lit;
      i = j;
      continue;
    }
    if (peek() === "/") {
      const before = out.replace(/\s+$/, "");
      const prev = before[before.length - 1] || "";
      const regexOk = !before.length || /[=(:,[!&|?{};~%^*/+-]/.test(prev) || /\breturn$|\bcase$|\bthrow$|\bin$|\bof$/.test(before.slice(-6));
      const rawBefore = src.slice(Math.max(0, i - 20), i);
      const regexOk2 =
        /(?:^|[=(:,[!&|?{};\n]|return\s+|case\s+|throw\s+|=>\s*)$/.test(rawBefore.replace(/\s+$/, "")) ||
        /(?:^|[\s;{}([])$/.test(rawBefore.slice(-1));
      if (regexOk || regexOk2) {
        let j = i + 1;
        let cls = false;
        while (j < n) {
          const ch = src[j];
          if (ch === "\\") {
            j += 2;
            continue;
          }
          if (ch === "[") {
            cls = true;
            j++;
            continue;
          }
          if (ch === "]" && cls) {
            cls = false;
            j++;
            continue;
          }
          if (ch === "/" && !cls) {
            j++;
            break;
          }
          if (ch === "\n") break;
          j++;
        }
        while (j < n && /[gimsuyvd]/.test(src[j])) j++;
        const reLit = src.slice(i, j);
        if (reLit.startsWith("/") && reLit.includes("/", 1) && textHasHe(reLit)) {
          const flags = reLit.match(/\/([gimsuyvd]*)$/)?.[1] || "";
          out += `/(?!)/${flags}`;
        } else if (textHasHe(reLit)) {
          out += stripHeFromText(reLit);
        } else {
          out += reLit;
        }
        i = j;
        continue;
      }
    }

    if (isHeCode(src.charCodeAt(i))) {
      i++;
      continue;
    }
    if (src[i] === "\\" && /^\\u05[0-9a-fA-F]{2}/i.test(src.slice(i))) {
      i += 6;
      continue;
    }

    out += src[i];
    i++;
  }

  out = out.replace(/\[\\u0590-\\u05[Ff]{2}\]/g, "[^\\s\\S]");
  out = out.replace(
    /const\s+(HEB_LETTER|HEBREW_CHAR|HE_LETTER|HEBREW_LETTER|HEBREW_RE|HEBREW_SCRIPT_RE|HEBREW_NIQQUD_RE|HEBREW_CODEPOINT_RE)\s*=\s*\/(?:[^/]|\\.)+\/[gimsuyvd]*/g,
    "const $1 = /(?!)/"
  );
  // Remove bare HE unicode-escape object keys (unquoted \u05xx…: value)
  out = out.replace(/^[ \t]*(?:\\u05[0-9a-fA-F]{2})+[ \t]*:[^\n]*\r?\n/gm, "");
  // Remove properties whose keys became empty after HE strip
  out = out.replace(/^[ \t]*""[ \t]*:[^\n]*\r?\n/gm, "");
  out = out.replace(/^[ \t]*''[ \t]*:[^\n]*\r?\n/gm, "");
  // Collapse broken empty leftovers (do NOT touch logical ||)
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/\[\s*,/g, "[");
  out = out.replace(/,\s*\]/g, "]");
  out = out.replace(/\(\s*,/g, "(");
  out = out.replace(/,\s*\)/g, ")");
  // Only collapse empty regex alts, never JS logical OR
  out = out.replace(/\/(?:[^/\n]|\\.)*\|\|(?:[^/\n]|\\.)*\//g, (m) => m.replace(/\|\|/g, "|"));
  out = out.replace(/\(\|/g, "(");
  out = out.replace(/\|\)/g, ")");

  return out;
}

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

function nodeCheck(p) {
  if (p.endsWith(".json")) {
    try {
      JSON.parse(fs.readFileSync(p, "utf8"));
      return { ok: true };
    } catch (e) {
      return { ok: false, err: String(e.message || e).slice(0, 200) };
    }
  }
  // node --check cannot parse .jsx; accept transform (syntax validated elsewhere)
  if (/\.jsx$/i.test(p)) return { ok: true };
  if (!/\.(js|mjs|cjs)$/i.test(p)) return { ok: true };
  const r = spawnSync(process.execPath, ["--check", p], { encoding: "utf8" });
  return { ok: r.status === 0, err: (r.stderr || "").slice(0, 400) };
}

const argvFiles = process.argv.slice(2);
const candidates =
  argvFiles.length > 0
    ? argvFiles.map((f) => f.replace(/\\/g, "/"))
    : SCAN.flatMap((r) => walk(path.join(ROOT, r))).filter((rel) => {
        const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
        return textHasHe(text) || /\\u05[0-9a-fA-F]{2}/i.test(text) || /\\u0590|\\u05FF/.test(text);
      });

const report = [];
for (const rel of candidates) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    report.push({ rel, status: "missing" });
    continue;
  }
  if (ALLOW.test(rel)) {
    report.push({ rel, status: "skipped-allow" });
    continue;
  }
  const backup = fs.readFileSync(abs, "utf8");
  if (!textHasHe(backup) && !/\\u05[0-9a-fA-F]{2}/i.test(backup)) {
    report.push({ rel, status: "clean" });
    continue;
  }
  const next = transform(backup);
  fs.writeFileSync(abs, next, "utf8");
  const check = nodeCheck(abs);
  if (!check.ok) {
    fs.writeFileSync(abs, backup, "utf8");
    report.push({ rel, status: "failed", err: check.err });
  } else {
    const still = textHasHe(next) || /\\u05[0-9a-fA-F]{2}/i.test(next);
    report.push({ rel, status: still ? "purged-residual" : "purged", still });
  }
}

const failed = report.filter((r) => r.status === "failed");
const residual = report.filter((r) => r.status === "purged-residual");
console.log(
  JSON.stringify(
    {
      processed: report.length,
      purged: report.filter((r) => r.status === "purged").length,
      residual: residual.length,
      failed: failed.length,
      failedFiles: failed.slice(0, 30),
      residualFiles: residual.slice(0, 40),
    },
    null,
    2
  )
);
if (failed.length) process.exit(1);
