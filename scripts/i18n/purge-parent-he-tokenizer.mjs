/**
 * Safer HE strip: scan JS source with a simple tokenizer so block-comment
 * terminators cannot be mistaken for a regex. Replaces any regex containing
 * Hebrew (literal or u05 escapes) with a never-matching pattern.
 * Strips HE from strings/comments/templates.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FILES = process.argv.slice(2);

function isHeCode(cp) {
  return cp >= 0x0590 && cp <= 0x05ff;
}

function stripHeFromText(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (isHeCode(c)) continue;
    // skip \u05xx sequences
    if (s[i] === "\\" && s.slice(i, i + 2).toLowerCase() === "\\u" && /^\\u05[0-9a-fA-F]{2}/i.test(s.slice(i))) {
      i += 5; // skip \u05xx (6 chars total, loop +1)
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

/**
 * @param {string} src
 */
function transform(src) {
  let i = 0;
  let out = "";
  const n = src.length;

  function peek(k = 0) {
    return src[i + k] || "";
  }

  while (i < n) {
    // Line comment
    if (peek() === "/" && peek(1) === "/") {
      let j = i + 2;
      while (j < n && src[j] !== "\n") j++;
      const cmt = src.slice(i, j);
      out += textHasHe(cmt) ? stripHeFromText(cmt) : cmt;
      i = j;
      continue;
    }
    // Block comment
    if (peek() === "/" && peek(1) === "*") {
      let j = i + 2;
      while (j < n - 1 && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      const cmt = src.slice(i, j);
      out += textHasHe(cmt) ? stripHeFromText(cmt) : cmt;
      i = j;
      continue;
    }
    // String "
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
    // String '
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
    // Template `
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
    // Regex: only when / is likely a regex start (after [=(:,[!&|?{};] or start / whitespace)
    if (peek() === "/") {
      const before = out.replace(/\s+$/, "");
      const prev = before[before.length - 1] || "";
      const regexOk = !before.length || /[=(:,[!&|?{};~%^*/+-]/.test(prev) || /\breturn$|\bcase$|\bthrow$|\bin$|\bof$/.test(before.slice(-6));
      // Also allow after keywords with space already stripped from end of out... check raw
      const rawBefore = src.slice(Math.max(0, i - 20), i);
      const regexOk2 =
        /(?:^|[=(:,[!&|?{};\n]|return\s+|case\s+|throw\s+|=>\s*)$/.test(rawBefore.replace(/\s+$/, "")) ||
        /(?:^|[\s;{}([])$/.test(rawBefore.slice(-1));
      if (regexOk || regexOk2) {
        let j = i + 1;
        let cls = false;
        while (j < n) {
          const ch = src[j];
          if (ch === "\\" ) {
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
          if (ch === "\n") break; // abort — not a regex
          j++;
        }
        // flags
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

    // bare HE outside strings (identifiers shouldn't have HE)
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

  // Cleanup empty alts left in non-HE regexes that had HE removed via class
  out = out.replace(/\[\\u0590-\\u05[Ff]{2}\]/g, "[^\\s\\S]");
  out = out.replace(
    /const\s+(HEB_LETTER|HEBREW_CHAR|HE_LETTER|HEBREW_LETTER)\s*=\s*\/(?:[^/]|\\.)+\/[gimsuyvd]*/g,
    "const $1 = /(?!)/"
  );

  return out;
}

function nodeCheck(p) {
  const r = spawnSync(process.execPath, ["--check", p], { encoding: "utf8" });
  return { ok: r.status === 0, err: (r.stderr || "").slice(0, 400) };
}

const report = [];
for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    report.push({ rel, status: "missing" });
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
console.log(JSON.stringify(report, null, 2));
if (report.some((r) => r.status === "failed")) process.exit(1);
