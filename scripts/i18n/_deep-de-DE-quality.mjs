/**
 * Deeper linguistic residue scan for de-DE layer.
 * Flags high English-function density and common leftover phrases.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function pathToFileUrl(p) {
  const u = path.resolve(p).replace(/\\/g, "/");
  return "file:///" + encodeURI(u).replace(/#/g, "%23");
}

// Strong English markers unlikely in natural German school prose
const STRONG =
  /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|have been|does not|What is|Which of|How many|Choose the|Select the|Click|Please select|Try again|Save changes|Sign in|Log out|Loading\.\.\.|Welcome back|Getting started|number line|in the teens|pairs that make)\b/i;

function density(s) {
  const words = String(s).split(/\s+/).filter(Boolean);
  if (words.length < 4) return 0;
  const hits = (String(s).match(STRONG) || []).length;
  return hits;
}

function scanMd() {
  const out = [];
  for (const f of walk(path.join(ROOT, "docs/learning-book/de-DE"), (n) => n.endsWith(".md"))) {
    const rel = path.relative(path.join(ROOT, "docs/learning-book/de-DE"), f).replace(/\\/g, "/");
    if (rel.startsWith("english/")) continue;
    const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith("|") || t.startsWith("```") || t.startsWith("#")) continue;
      if (STRONG.test(t) && density(t) >= 1) {
        // ignore pure math / codes
        if (/^[\d\s+\-×÷=/?.,…°cm²m³()]+$/.test(t)) continue;
        out.push({ rel, line: t.slice(0, 180) });
        if (out.length >= 80) return out;
      }
    }
  }
  return out;
}

async function scanScience() {
  const { SCIENCE_DE_DE_OVERLAY } = await import(
    pathToFileUrl(path.join(ROOT, "data/science-questions-de-DE-overlay.js"))
  );
  const out = [];
  for (const [id, q] of Object.entries(SCIENCE_DE_DE_OVERLAY)) {
    for (const field of ["stem", "explanation"]) {
      const s = String(q[field] || "");
      if (STRONG.test(s)) out.push({ id, field, s: s.slice(0, 160) });
    }
    for (const opt of q.options || []) {
      if (STRONG.test(String(opt))) out.push({ id, field: "opt", s: String(opt).slice(0, 120) });
    }
    if (out.length >= 80) break;
  }
  return out;
}

function scanLocales() {
  const out = [];
  const dir = path.join(ROOT, "locales/de-DE");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const obj = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const walkObj = (v, key) => {
      if (typeof v === "string") {
        if (STRONG.test(v)) out.push({ ns: f, key, s: v.slice(0, 140) });
      } else if (Array.isArray(v)) v.forEach((x, i) => walkObj(x, `${key}[${i}]`));
      else if (v && typeof v === "object") {
        for (const [k, x] of Object.entries(v)) walkObj(x, key ? `${key}.${k}` : k);
      }
    };
    walkObj(obj, "");
  }
  return out.slice(0, 80);
}

function scanPacks() {
  const out = [];
  for (const f of walk(path.join(ROOT, "content-packs/de-DE"), (n) => n.endsWith(".json"))) {
    const rel = path.relative(path.join(ROOT, "content-packs/de-DE"), f).replace(/\\/g, "/");
    const blob = fs.readFileSync(f, "utf8");
    if (/\bGrade\s*[1-6]\b/.test(blob)) out.push({ rel, kind: "Grade" });
    // sample string values
    let obj;
    try {
      obj = JSON.parse(blob);
    } catch {
      continue;
    }
    const stack = [obj];
    while (stack.length) {
      const v = stack.pop();
      if (typeof v === "string") {
        if (STRONG.test(v) && v.length > 12) {
          out.push({ rel, s: v.slice(0, 140) });
          if (out.length >= 100) return out;
        }
      } else if (Array.isArray(v)) stack.push(...v);
      else if (v && typeof v === "object") stack.push(...Object.values(v));
    }
  }
  return out;
}

async function main() {
  const books = scanMd();
  const science = await scanScience();
  const locales = scanLocales();
  const packs = scanPacks();
  const report = {
    booksHits: books.length,
    books,
    scienceHits: science.length,
    science,
    localesHits: locales.length,
    locales,
    packsHits: packs.length,
    packs: packs.slice(0, 60),
  };
  fs.writeFileSync(path.join(ROOT, "scripts/i18n/_de-DE-deep-quality.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        booksHits: books.length,
        scienceHits: science.length,
        localesHits: locales.length,
        packsHits: packs.length,
        bookSamples: books.slice(0, 20),
        scienceSamples: science.slice(0, 20),
        localeSamples: locales.slice(0, 20),
        packSamples: packs.slice(0, 20),
      },
      null,
      2
    )
  );
}

main();
