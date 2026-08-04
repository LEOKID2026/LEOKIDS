/**
 * Generate docs/learning-book/it-IT/** from docs/learning-book/en/**.
 * Preserves frontmatter keys, slugs, IDs, structure; translates display text.
 * English subject instructional targets (vocab/phonics/examples) stay protected
 * when marked as English learning content in path english/**.
 *
 * Run: node scripts/i18n/generate-learning-book-it-IT.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "docs/learning-book/en");
const OUT = path.join(ROOT, "docs/learning-book/it-IT");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT-learning-book.json");
const OFFLINE = process.env.IT_IT_OFFLINE === "1" || process.argv.includes("--offline");

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

async function mt(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

function protectCode(s) {
  /** @type {string[]} */
  const ph = [];
  let out = String(s).replace(/`([^`]+)`/g, (_, code) => {
    ph.push(code);
    return `⟦C${ph.length - 1}⟧`;
  });
  out = out.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    ph.push(expr);
    return `⟦P${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restoreCode(s, ph) {
  return String(s)
    .replace(/⟦C(\d+)⟧/g, (_, i) => `\`${ph[Number(i)]}\``)
    .replace(/⟦P(\d+)⟧/g, (_, i) => `\${${ph[Number(i)]}}`);
}

function postFix(out) {
  return out
    .replace(/\bGrade 1\b/g, "1ª primaria")
    .replace(/\bGrade 2\b/g, "2ª primaria")
    .replace(/\bGrade 3\b/g, "3ª primaria")
    .replace(/\bGrade 4\b/g, "4ª primaria")
    .replace(/\bGrade 5\b/g, "5ª primaria")
    .replace(/\bGrade 6\b/g, "1ª secondaria")
    .replace(/\b6ª primaria\b/gi, "1ª secondaria")
    .replace(/\bdollari\b/gi, "euro")
    .replace(/\bdollaro\b/gi, "euro")
    .replace(/\bdollars\b/gi, "euro")
    .replace(/\bdollar\b/gi, "euro")
    .replace(/worksheet/gi, "scheda didattica")
    .replace(/foglio di calcolo/gi, "scheda didattica")
    .replace(/\bLeo Kids\b/g, "Leo Kids");
}

async function translateChunk(en, cache) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (!/[A-Za-z]/.test(s)) return s;
  if (cache[s]) return postFix(cache[s]);
  if (OFFLINE) return postFix(s);
  const { text, ph } = protectCode(s);
  try {
    let out = await mt(text);
    out = postFix(restoreCode(out, ph));
    cache[s] = out;
    return out;
  } catch (err) {
    console.warn("MT fail", s.slice(0, 50), err.message);
    return s;
  }
}

/**
 * For English-subject books: translate UI chrome / explanations in Italian,
 * but keep fenced English examples and inline `code` targets intact via protectCode.
 * Vocabulary/phonics target words in backticks stay English.
 */
async function translateMarkdown(md, cache, opts = {}) {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) {
    return translateBody(md, cache, opts);
  }
  const yaml = fm[1];
  const body = fm[2];
  // Preserve YAML keys; translate string values carefully for title fields only
  const yamlOut = yaml;
  const bodyOut = await translateBody(body, cache, opts);
  return `---\n${yamlOut}\n---\n${bodyOut}`;
}

async function translateBody(body, cache, opts) {
  // Split fenced code blocks — never translate inside
  const parts = String(body).split(/(```[\s\S]*?```)/g);
  const out = [];
  for (const part of parts) {
    if (part.startsWith("```")) {
      out.push(part);
      continue;
    }
    // Translate paragraph-sized chunks
    const chunks = part.split(/(\n{2,})/);
    for (const chunk of chunks) {
      if (/^\n+$/.test(chunk) || !chunk.trim()) {
        out.push(chunk);
        continue;
      }
      // Table rows / metadata keys: keep structure
      if (/^\|.*\|$/.test(chunk.trim()) || /^\*\*Source references:\*\*/.test(chunk.trim())) {
        // Translate cell text but keep pipes
        if (chunk.includes("|")) {
          const lines = chunk.split("\n");
          const translatedLines = [];
          for (const line of lines) {
            if (!line.includes("|") || /^\|?\s*[-:| ]+\s*\|?$/.test(line)) {
              translatedLines.push(line);
              continue;
            }
            const cells = line.split("|");
            const newCells = [];
            for (const cell of cells) {
              const t = cell.trim();
              if (!t || t.startsWith("`") || t.startsWith("**learning") || t.startsWith("**skill")) {
                newCells.push(cell);
              } else if (/^(Field|Value|math|geometry|english|science|g\d|visual_|launch_)/i.test(t)) {
                newCells.push(cell);
              } else {
                const tr = await translateChunk(t, cache);
                newCells.push(cell.replace(t, tr));
              }
            }
            translatedLines.push(newCells.join("|"));
          }
          out.push(translatedLines.join("\n"));
        } else {
          out.push(await translateChunk(chunk, cache));
        }
        continue;
      }
      // Heading lines
      if (/^#{1,6}\s/.test(chunk.trim())) {
        const m = chunk.match(/^(#{1,6}\s+)(.*)$/s);
        if (m) {
          out.push(m[1] + (await translateChunk(m[2], cache)));
        } else {
          out.push(await translateChunk(chunk, cache));
        }
        continue;
      }
      out.push(await translateChunk(chunk, cache));
    }
  }
  return out.join("");
}

async function main() {
  const cache = loadCache();
  const files = walk(SRC);
  console.log("Learning-book files:", files.length);
  let n = 0;
  for (const src of files) {
    const rel = path.relative(SRC, src);
    const dest = path.join(OUT, rel);
    const md = fs.readFileSync(src, "utf8");
    const isEnglishSubject = rel.replace(/\\/g, "/").startsWith("english/");
    const out = await translateMarkdown(md, cache, { englishSubject: isEnglishSubject });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out, "utf8");
    n += 1;
    if (n % 20 === 0) {
      saveCache(cache);
      console.log(`Progress ${n}/${files.length}`);
    }
    await new Promise((r) => setTimeout(r, 25));
  }
  saveCache(cache);
  console.log("Wrote", n, "files to", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
