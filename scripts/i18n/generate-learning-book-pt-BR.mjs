/**
 * Generate docs/learning-book/pt-BR/** from docs/learning-book/en/**.
 * Preserves frontmatter keys, slugs, IDs, structure; translates display text.
 *
 * Run: node scripts/i18n/generate-learning-book-pt-BR.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "docs/learning-book/en");
const OUT = path.join(ROOT, "docs/learning-book/pt-BR");
const CACHE_PATH = path.join(__dirname, "_mt-cache-pt-BR-learning-book.json");

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
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=" +
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

async function translateChunk(en, cache) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (!/[A-Za-z]/.test(s)) return s;
  if (cache[s]) return cache[s];
  const { text, ph } = protectCode(s);
  try {
    let out = await mt(text);
    out = restoreCode(out, ph)
      .replace(/\btelemóvel\b/gi, "celular")
      .replace(/\bautocarro\b/gi, "ônibus")
      .replace(/\bGrau\b/g, "Ano")
      .replace(/\bgrau\b/g, "ano");
    cache[s] = out;
    return out;
  } catch (err) {
    console.warn("MT fail", s.slice(0, 50), err.message);
    return s;
  }
}

/**
 * Translate markdown while preserving YAML frontmatter keys and fenced code.
 * @param {string} md
 * @param {Record<string,string>} cache
 */
async function translateMarkdown(md, cache) {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) {
    return translateChunk(md, cache);
  }
  const yaml = fm[1];
  const body = fm[2];
  const yamlLines = yaml.split(/\r?\n/);
  const outYaml = [];
  for (const line of yamlLines) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) {
      outYaml.push(line);
      continue;
    }
    const key = m[1];
    const val = m[2];
    // Keep structural/meta keys; translate human titles/summaries
    if (
      [
        "id",
        "pageId",
        "slug",
        "subject",
        "grade",
        "topicId",
        "skillId",
        "order",
        "status",
        "locale",
        "type",
        "kind",
        "batchId",
        "prev",
        "next",
      ].includes(key)
    ) {
      outYaml.push(line);
      continue;
    }
    if (!val || val === '""' || val === "''" || /^[\[{]/.test(val.trim())) {
      outYaml.push(line);
      continue;
    }
    const quote = val.startsWith('"') || val.startsWith("'") ? val[0] : "";
    const inner = quote ? val.slice(1, -1) : val;
    if (!/[A-Za-z]/.test(inner)) {
      outYaml.push(line);
      continue;
    }
    const translated = await translateChunk(inner, cache);
    outYaml.push(quote ? `${key}: ${quote}${translated}${quote}` : `${key}: ${translated}`);
  }

  // Body: translate paragraph chunks; keep headings markers and math-ish lines
  const bodyLines = body.split(/\r?\n/);
  /** @type {string[]} */
  const outBody = [];
  let buf = [];
  const flush = async () => {
    if (!buf.length) return;
    const chunk = buf.join("\n");
    buf = [];
    if (!/[A-Za-z]/.test(chunk)) {
      outBody.push(chunk);
      return;
    }
    // Don't MT pure formula / blank / list markers only
    if (/^[\s#>*\-\d\.\$\\π=+\-×÷\/\(\)\[\],.:;_%]+$/m.test(chunk) && !/[A-Za-z]{3,}/.test(chunk)) {
      outBody.push(chunk);
      return;
    }
    outBody.push(await translateChunk(chunk, cache));
  };

  for (const line of bodyLines) {
    if (/^```/.test(line)) {
      await flush();
      outBody.push(line);
      continue;
    }
    if (/^#{1,6}\s+/.test(line)) {
      await flush();
      const m = line.match(/^(#{1,6}\s+)(.*)$/);
      if (m && /[A-Za-z]/.test(m[2])) {
        outBody.push(m[1] + (await translateChunk(m[2], cache)));
      } else {
        outBody.push(line);
      }
      continue;
    }
    if (!line.trim()) {
      await flush();
      outBody.push(line);
      continue;
    }
    buf.push(line);
  }
  await flush();

  return `---\n${outYaml.join("\n")}\n---\n${outBody.join("\n")}`;
}

async function main() {
  const files = walk(SRC);
  console.log("EN drafts:", files.length);
  const cache = loadCache();
  let done = 0;
  for (const file of files) {
    const rel = path.relative(SRC, file);
    const outFile = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const raw = fs.readFileSync(file, "utf8");
    const translated = await translateMarkdown(raw, cache);
    fs.writeFileSync(outFile, translated, "utf8");
    done += 1;
    if (done % 20 === 0 || done === files.length) {
      saveCache(cache);
      console.log(`Progress ${done}/${files.length}`);
    }
    await new Promise((r) => setTimeout(r, 30));
  }
  saveCache(cache);
  console.log("Done. Wrote", done, "files to", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
